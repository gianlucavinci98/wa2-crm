package it.polito.communication_manager

import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.http.MediaType
import org.springframework.mock.web.MockMultipartFile
import org.springframework.test.context.junit.jupiter.SpringExtension
import org.springframework.test.web.servlet.multipart
import org.springframework.test.web.servlet.result.MockMvcResultMatchers
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status
import org.springframework.test.web.servlet.setup.MockMvcBuilders
import org.springframework.web.context.WebApplicationContext
import org.springframework.web.servlet.function.RequestPredicates.contentType


@ExtendWith(SpringExtension::class)
@SpringBootTest
@AutoConfigureMockMvc
class MessageControllerTest {
    @Autowired
    private lateinit var webApplicationContext: WebApplicationContext

    @Test
    fun `test sending message`() {
        val destinationEmail = "test@example.com"
        val subject = "Test Subject"
        val body = "Test Body"
        val attachment =
            MockMultipartFile("attachmentData", "test.txt", "text/plain", "Attachment content".toByteArray())

        val mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).build()

        mockMvc.multipart("/api/emails") {
            file(attachment)
            param("destinationEmail", destinationEmail)
            param("subject", subject)
            param("body", body)
            contentType(MediaType.MULTIPART_FORM_DATA)
        }.andExpect { status().isOk }
            .andExpect { MockMvcResultMatchers.jsonPath("$.destinationEmail").value(destinationEmail) }
            .andExpect { MockMvcResultMatchers.jsonPath("$.subject").value(subject) }
            .andExpect { MockMvcResultMatchers.jsonPath("$.body").value(body) }
            .andExpect { MockMvcResultMatchers.jsonPath("$.attachmentFileName").value("test.txt") }
    }

    @Test
    fun `test sending message with wrong email address`() {
        val destinationEmail = "test-wrong-email"
        val subject = "Test Subject"
        val body = "Test Body"

        val mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).build()

        mockMvc.multipart("/api/emails") {
            param("destinationEmail", destinationEmail)
            param("subject", subject)
            param("body", body)
            contentType(MediaType.MULTIPART_FORM_DATA)
        }
            .andExpect { status().isBadRequest }
    }

    @Test
    fun `test sending message without attachment`() {
        val destinationEmail = "test@example.com"
        val subject = "Test Subject"
        val body = "Test Body"

        val mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).build()

        mockMvc.multipart("/api/emails") {
            param("destinationEmail", destinationEmail)
            param("subject", subject)
            param("body", body)
            contentType(MediaType.MULTIPART_FORM_DATA)
        }.andExpect { status().isOk }
            .andExpect { MockMvcResultMatchers.jsonPath("$.destinationEmail").value(destinationEmail) }
            .andExpect { MockMvcResultMatchers.jsonPath("$.subject").value(subject) }
            .andExpect { MockMvcResultMatchers.jsonPath("$.body").value(body) }
    }
}