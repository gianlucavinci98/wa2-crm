package it.polito.analytics.services

import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.fasterxml.jackson.module.kotlin.readValue
import it.polito.analytics.documents.JobOffer
import it.polito.analytics.dtos.JobOfferDTO
import it.polito.analytics.repositories.JobOfferRepository
import it.polito.analytics.utilities.KafkaMessage
import org.slf4j.LoggerFactory
import org.springframework.kafka.annotation.KafkaListener
import org.springframework.stereotype.Service
import java.time.LocalDateTime
import kotlin.jvm.optionals.getOrNull

@Service
class KafkaConsumerService(private val jobOfferRepository: JobOfferRepository) {
    private val logger = LoggerFactory.getLogger(KafkaConsumerService::class.java)

    @KafkaListener(topics = ["kafka_postgres_.public.job_offers"], groupId = "analytics")
    fun jobOfferConsumer(message: String) {
        try {
            val kafkaMessage: KafkaMessage<JobOfferDTO> = jacksonObjectMapper().readValue(message)

            kafkaMessage.after?.let {
                logger.info("JobOfferDTO received: $it")

                var jobOffer = jobOfferRepository.findById(it.job_offer_id.toBigInteger()).getOrNull()

                if (jobOffer != null) {
                    jobOffer.jobOfferHistory.add(Pair(it.status!!, LocalDateTime.now()!!))
                } else {
                    jobOffer = JobOffer(
                        it.job_offer_id.toBigInteger(),
                        mutableSetOf(),
                        mutableListOf(Pair(it.status!!, LocalDateTime.now()!!))
                    )
                }

                jobOfferRepository.save(jobOffer)
            } ?: run {
                logger.error("No data available in the 'after' section of the message")
            }
        } catch (e: Exception) {
            logger.error("Error deserializing message: ${e.message}")
        }
    }
}
