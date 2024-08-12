package it.polito.communication_manager

import org.apache.camel.EndpointInject
import org.apache.camel.ProducerTemplate
import org.apache.camel.builder.RouteBuilder
import org.apache.camel.component.mock.MockEndpoint
import org.apache.camel.test.spring.junit5.CamelSpringBootTest
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.autoconfigure.AutoConfiguration
import org.springframework.boot.autoconfigure.EnableAutoConfiguration
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.context.annotation.Bean
import org.springframework.test.context.junit.jupiter.SpringExtension

@ExtendWith(SpringExtension::class)
@CamelSpringBootTest
@EnableAutoConfiguration
@SpringBootTest
class MyRouteBuilderTest {
    @EndpointInject("mock:google-mail:messages/send")
    lateinit var mockGoogleMail: MockEndpoint

    @Autowired
    lateinit var producerTemplate: ProducerTemplate

    // Spring context fixtures
    @AutoConfiguration
    class TestConfig {
        @Bean
        fun routeBuilder(): RouteBuilder {
            return object : RouteBuilder() {
                @Throws(Exception::class)
                @Override
                override fun configure() {
                    from("direct:sendEmail")
                        .to("mock:google-mail:messages/send")

                    from("direct:sendEmailWithAttachment")
                        .to("mock:google-mail:messages/send")
                }
            }
        }
    }

    @Test
    fun testSendEmailRoute() {
        mockGoogleMail.setExpectedMessageCount(1)

        val to = "recipient@example.com"
        val subject = "Test Email"
        val body = "This is a test email body"

        val headers: MutableMap<String, Any> = HashMap()
        headers["to"] = to
        headers["subject"] = subject

        producerTemplate.sendBodyAndHeaders("direct:sendEmail", body, headers)

        mockGoogleMail.assertIsSatisfied()
    }

    @Test
    fun testSendEmailWithAttachmentRoute() {
        mockGoogleMail.setExpectedMessageCount(1)

        val to = "recipient@example.com"
        val subject = "Test Email with Attachment"
        val body = "This is a test email body"
        val attachmentData: ByteArray = byteArrayOf(1)
        val attachmentFileName = "attachment.txt"

        val headers: MutableMap<String, Any> = HashMap()
        headers["to"] = to
        headers["subject"] = subject
        headers["attachmentData"] = attachmentData
        headers["attachmentFileName"] = attachmentFileName

        producerTemplate.sendBodyAndHeaders("direct:sendEmailWithAttachment", body, headers)

        mockGoogleMail.assertIsSatisfied()
    }
}