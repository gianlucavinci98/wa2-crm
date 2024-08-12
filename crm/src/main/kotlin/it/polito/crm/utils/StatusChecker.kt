package it.polito.crm.utils

enum class MessageStatus {
    Received,
    Read,
    Processing,
    Done,
    Discarded,
    Failed
}

class MessageStatusChecker : Comparator<MessageStatus> {
    override fun compare(newMessageStatus: MessageStatus?, oldMessageStatus: MessageStatus?): Int {
        if (newMessageStatus == null || oldMessageStatus == null) {
            return -1
        }
        return when (newMessageStatus) {
            MessageStatus.Received -> -1
            MessageStatus.Read -> if (oldMessageStatus == MessageStatus.Received) 1 else -1
            MessageStatus.Processing -> if (oldMessageStatus == MessageStatus.Read) 1 else -1
            MessageStatus.Done -> if (oldMessageStatus == MessageStatus.Read || oldMessageStatus == MessageStatus.Processing) 1 else -1
            MessageStatus.Discarded -> if (oldMessageStatus == MessageStatus.Read) 1 else -1
            MessageStatus.Failed -> if (oldMessageStatus == MessageStatus.Read || oldMessageStatus == MessageStatus.Processing) 1 else -1
        }
    }
}

enum class JobOfferStatus {
    Created {
        override fun nextSuccessStatus(newJobOfferStatus: JobOfferStatus): Boolean {
            return newJobOfferStatus == SelectionPhase
        }

        override fun nextFailureStatus(newJobOfferStatus: JobOfferStatus): Boolean {
            return newJobOfferStatus == Aborted
        }
    },
    SelectionPhase {
        override fun nextSuccessStatus(newJobOfferStatus: JobOfferStatus): Boolean {
            return newJobOfferStatus == CandidateProposal
        }

        override fun nextFailureStatus(newJobOfferStatus: JobOfferStatus): Boolean {
            return newJobOfferStatus == Aborted
        }
    },
    CandidateProposal {
        override fun nextSuccessStatus(newJobOfferStatus: JobOfferStatus): Boolean {
            return newJobOfferStatus == Consolidated
        }

        override fun nextFailureStatus(newJobOfferStatus: JobOfferStatus): Boolean {
            return newJobOfferStatus == Aborted || newJobOfferStatus == SelectionPhase
        }
    },
    Consolidated {
        override fun nextSuccessStatus(newJobOfferStatus: JobOfferStatus): Boolean {
            return newJobOfferStatus == Done
        }

        override fun nextFailureStatus(newJobOfferStatus: JobOfferStatus): Boolean {
            return newJobOfferStatus == Aborted || newJobOfferStatus == SelectionPhase
        }
    },
    Done {
        override fun nextSuccessStatus(newJobOfferStatus: JobOfferStatus): Boolean {
            return false
        }

        override fun nextFailureStatus(newJobOfferStatus: JobOfferStatus): Boolean {
            return newJobOfferStatus == SelectionPhase
        }
    },
    Aborted {
        override fun nextSuccessStatus(newJobOfferStatus: JobOfferStatus): Boolean {
            return false
        }

        override fun nextFailureStatus(newJobOfferStatus: JobOfferStatus): Boolean {
            return false
        }
    };

    /**
     * If false was returned, the provided `newJobOfferStatus` is not valid
     */
    abstract fun nextSuccessStatus(newJobOfferStatus: JobOfferStatus): Boolean

    /**
     * If false was returned, the provided `newJobOfferStatus` is not valid
     */
    abstract fun nextFailureStatus(newJobOfferStatus: JobOfferStatus): Boolean
}