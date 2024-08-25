package it.polito.analytics.services

import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.fasterxml.jackson.module.kotlin.readValue
import it.polito.analytics.DTOs.OggettoDTO
import it.polito.analytics.utilities.KafkaMessage
import org.springframework.kafka.annotation.KafkaListener
import org.springframework.stereotype.Service

@Service
class KafkaConsumerService {

    @KafkaListener(topics = ["kafka_postgres_.public.contacts"], groupId = "analytics")
    fun consume(message: String)
    {
        println("Messaggio consumato: $message")
        try {
            val kafkaMessage: KafkaMessage = jacksonObjectMapper().readValue(message)
            println("Sono arrivato qui")

            // Mappare anche qui in base all'oggetto che decidiamo di ricevere
            kafkaMessage.after?.let { contactInfo ->
                val oggettoDTO = OggettoDTO(
                    contactId = contactInfo.contact_id,
                    name = contactInfo.name,
                    surname = contactInfo.surname,
                    ssn = contactInfo.ssn,
                    category = contactInfo.category
                )

                println("OggettoDTO ricevuto: $oggettoDTO")
            } ?: run {
                println("Nessun dato disponibile nella sezione 'after' del messaggio.")
            }
        } catch (e: Exception) {
            println("Errore durante la deserializzazione del messaggio: ${e.message}")
        }
    }
}
