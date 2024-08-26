package it.polito.document_store.entities

import jakarta.persistence.*
import java.time.LocalDateTime

@Entity
@Table(name = "documents_metadata")
class DocumentMetadata {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "metadata_id")
    var metadataId: Long = 0

    @Column(name = "name")
    lateinit var name: String

    @Column(name = "size")
    var size: Long = 0

    @Column(name = "content_type")
    lateinit var contentType: String

    @Column(name = "timestamp")
    lateinit var timestamp: LocalDateTime

    @OneToOne(cascade = [CascadeType.ALL], fetch = FetchType.LAZY)
    @JoinColumn(name = "document_id")
    lateinit var documentData: DocumentData

    override fun toString(): String {
        return "DocumentMetadata(metadataId=$metadataId, name='$name', size=$size, contentType='$contentType', timestamp=$timestamp, documentData=$documentData)"
    }
}