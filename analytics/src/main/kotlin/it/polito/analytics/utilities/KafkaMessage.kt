package it.polito.analytics.utilities

import com.fasterxml.jackson.annotation.JsonIgnoreProperties

@JsonIgnoreProperties(ignoreUnknown = true)
data class KafkaMessage(
    val before: Any?,
    val after: ContactInfo?,
    val source: SourceInfo?,
    val op: String?,
    val ts_ms: Long?,
    val transaction: Any?
)

// Da modellare in base alle tabelle che decidiamo di monitorare e al messaggio che di conseguenza riceviamo
@JsonIgnoreProperties(ignoreUnknown = true)
data class ContactInfo(
    val category: Int,
    val contact_id: Long,
    val name: String,
    val ssn: String,
    val surname: String
)

@JsonIgnoreProperties(ignoreUnknown = true)
data class SourceInfo(
    val version: String,
    val connector: String,
    val name: String,
    val ts_ms: Long,
    val snapshot: String?,
    val db: String,
    val sequence: String?,
    val schema: String,
    val table: String,
    val txId: Long?,
    val lsn: Long?,
    val xmin: Long?
)
