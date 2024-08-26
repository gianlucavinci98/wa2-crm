package it.polito.document_store.utils

/**
 * This enum is used to specify the relation of the `id` field
 * of `DocumentMetadata` class with the `crm microservice` entities
 *
 * These are the relations between the enum values and the `id` field:
 *
 * - `Curriculum`: the `id` field is related to a `Professional`
 * - `Contract`: the `id` field is related to a `JobOffer`
 * - `Attachment`: the `id` field is related to a `Message`
 * - `Unknown`: the document is not related to any other entity
 * */
enum class DocumentCategory {
    Curriculum,
    Contract,
    Attachment,
    Unknown
}