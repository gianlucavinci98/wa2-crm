import {useState} from "react";
import {JobOffer} from "../api/crm/dto/JobOffer.ts";

function JobOfferForm(props) {

    const [jobOffer, setJobOffer] = useState(
        props.jobOffer !== undefined && props.jobOffer !== null
            ?
            props.jobOffer
            :
            new JobOffer(null, "", "", null, [], BigInt(0), null, null)
    )

    return (
        <div>
            {

            }
        </div>
    )
}

export default JobOfferForm
