package it.polito.communication_manager.utils

import org.springframework.core.convert.converter.Converter
import org.springframework.security.core.GrantedAuthority
import org.springframework.security.core.authority.SimpleGrantedAuthority
import org.springframework.security.oauth2.jwt.Jwt

class CustomJwtGrantedAuthoritiesConverter : Converter<Jwt, Collection<GrantedAuthority>> {
    override fun convert(jwt: Jwt): Collection<GrantedAuthority> {
        val resourceAccess = jwt.claims["resource_access"] as Map<*, *>
        val apigateway = resourceAccess["apigateway"] as Map<*, *>
        val roles = apigateway["roles"] as List<*>

        return roles.map { SimpleGrantedAuthority("ROLE_$it") }
    }
}
