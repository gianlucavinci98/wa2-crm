package it.polito.api_gateway

import jakarta.servlet.FilterChain
import jakarta.servlet.ServletException
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.oauth2.client.oidc.web.logout.OidcClientInitiatedLogoutSuccessHandler
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository
import org.springframework.security.web.SecurityFilterChain
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter
import org.springframework.security.web.csrf.CookieCsrfTokenRepository
import org.springframework.security.web.csrf.CsrfToken
import org.springframework.security.web.csrf.CsrfTokenRequestAttributeHandler
import org.springframework.security.web.csrf.CsrfTokenRequestHandler
import org.springframework.util.StringUtils
import org.springframework.web.cors.CorsConfiguration
import org.springframework.web.filter.OncePerRequestFilter
import java.io.IOException
import java.util.function.Supplier

@Configuration
@EnableWebSecurity
class SecurityConfig(val crr: ClientRegistrationRepository) {
    fun oidcLogoutSuccessHandler() = OidcClientInitiatedLogoutSuccessHandler(crr)
        .also { it.setPostLogoutRedirectUri("http://localhost:8082/") }

    @Bean
    fun securityFilterChain(httpSecurity: HttpSecurity): SecurityFilterChain {
        return httpSecurity
            .authorizeHttpRequests {
                /* ApiGateway Server end-points */
                it.requestMatchers("/current-user").permitAll()
                it.requestMatchers("/secure").authenticated()

                /* Resource Servers */
                it.requestMatchers("/crm/api/messages").permitAll()
                it.requestMatchers("/crm/**").authenticated()

                it.requestMatchers("/communication-manager/**").authenticated()

                it.requestMatchers("/document-store/**").authenticated()

                it.requestMatchers("/analytics/**").authenticated()

                /* UI Server */
                it.requestMatchers("/ui/**").permitAll()

                /* Other end-points */
                it.anyRequest().permitAll()
            }
            .oauth2Login { }
            .logout { it.logoutSuccessHandler(oidcLogoutSuccessHandler()) }
            .csrf {
                //it.ignoringRequestMatchers("/crm/api/messages")
                it.csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())
                it.csrfTokenRequestHandler(SpaCsrfTokenRequestHandler())
            }
            .addFilterAfter(CsrfCookieFilter(), BasicAuthenticationFilter::class.java)
            .build()
    }

    @Bean
    fun corsConfiguration() = CorsConfiguration().apply {
        allowedOrigins = listOf("http://localhost:5173")
        allowedMethods = listOf("GET", "POST", "PUT", "DELETE", "OPTIONS")
    }
}


class CsrfCookieFilter : OncePerRequestFilter() {
    @Throws(ServletException::class, IOException::class)
    override fun doFilterInternal(req: HttpServletRequest, res: HttpServletResponse, filterChain: FilterChain) {
        try {
            val csrfToken = req.getAttribute("_csrf") as CsrfToken
            csrfToken.token
            filterChain.doFilter(req, res)
        } catch (e: Exception) {
            val message = e.message!!
            val regex = Regex("HTTP response code: (\\d{3})")
            val match = regex.find(message)
            val tmp = if (match != null) match.groupValues[0] else "HTTP response code: 500"

            val code = tmp.slice(tmp.length - 3..<tmp.length).toLong()

            when (code) {
                400L -> {
                    res.status = 400
                }

                401L -> {
                    res.status = 401
                }

                403L -> {
                    res.status = 403
                }

                500L -> {
                    res.status = 500
                }
            }
        }
    }
}

class SpaCsrfTokenRequestHandler : CsrfTokenRequestAttributeHandler() {
    private val delegate: CsrfTokenRequestHandler = CsrfTokenRequestAttributeHandler()

    override fun handle(req: HttpServletRequest, res: HttpServletResponse, t: Supplier<CsrfToken>) {
        delegate.handle(req, res, t)
    }

    override fun resolveCsrfTokenValue(request: HttpServletRequest, csrfToken: CsrfToken): String? {
        return if (StringUtils.hasText(request.getHeader(csrfToken.headerName))) {
            super.resolveCsrfTokenValue(request, csrfToken)
        } else {
            delegate.resolveCsrfTokenValue(request, csrfToken)
        }
    }
}
