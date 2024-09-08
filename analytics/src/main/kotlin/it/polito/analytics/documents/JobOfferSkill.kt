package it.polito.analytics.documents

import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.Document
import java.math.BigInteger

@Document
class JobOfferSkill (@Id val jobOfferId: BigInteger, val skills: MutableSet<String>)
