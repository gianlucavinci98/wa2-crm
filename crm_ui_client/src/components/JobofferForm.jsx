import {useState} from "react";
import {JobOffer} from "../api/crm/dto/JobOffer.ts";
import {useParams} from "react-router-dom";
import {IoIosAdd, IoIosClose} from "react-icons/io";
import JobOfferAPI from "../api/crm/JobOfferAPI.js";

function JobOfferForm(props) {
    let {jobOfferId} = useParams();

    const [jobOffer, setJobOffer] = useState(
        props.jobOffer !== undefined && props.jobOffer !== null
            ?
            props.jobOffer
            :
            new JobOffer(null, "", "", null, [], 1, null, null)
    )
    const [currentSkill, setCurrentSkill] = useState("")
    const [errors, setErrors] = useState({})
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [serverResponse, setServerResponse] = useState("")

    const validate = () => {
        const errors = {};

        if (jobOffer.description.trim().length === 0) {
            errors.description = "Description is required"
        }
        if (jobOffer.requiredSkills.length < 1) {
            errors.requiredSkills = "Insert at least one skill"
        }
        if (jobOffer.duration < 1) {
            errors.duration = "Time duration must be greater or equal to 1"
        }

        console.log(jobOffer)

        return errors;
    };

    const onSubmitHandler = async (event) => {
        event.preventDefault()

        const validationErrors = validate()
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors)
            return
        }

        setIsSubmitting(true)

        try {
            let response
            if (jobOfferId !== undefined && jobOfferId !== null) {
                response = await JobOfferAPI.UpdateJobOffer(jobOffer)
            } else {
                //TODO: change the customerId in order to became dynamic
                response = await JobOfferAPI.InsertNewJobOffer(1, jobOffer, props.currentUser.xsrfToken)
            }

            setServerResponse("Message sent successfully!")
            console.log(response)
        } catch (error) {
            setServerResponse("Error sending message. Please try again.")
            console.error(error)
        } finally {
            setIsSubmitting(false)
        }
    }

    const onChangeHandler = (event) => {
        event.preventDefault()
        const {name, value} = event.target

        setJobOffer((old) => ({
            ...old,
            [name]: value
        }))

        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: "",
        }))
    }

    const onAdd = () => {
        if (currentSkill !== "") {
            setJobOffer((old) => ({
                ...old,
                requiredSkills: [...new Set([currentSkill, ...jobOffer.requiredSkills])],
            }))
            setCurrentSkill("")
        }
    }

    const onRemove = (index) => {
        setJobOffer((old) => ({
            ...old,
            requiredSkills: old.requiredSkills.filter((_, i) => i !== index)
        }));
    }

    return (
        <div>
            {
                jobOfferId !== undefined
                    ?
                    <h1>Edit job offer</h1>
                    :
                    <h1>Create new job offer</h1>
            }
            <form onSubmit={onSubmitHandler}>
                {serverResponse && (<div>{serverResponse}</div>)}

                <div>
                    <label className={errors.description ? "text-red-500" : ""}>Description*:</label>
                    <textarea
                        name={"description"}
                        value={jobOffer.description}
                        maxLength={1000}
                        rows={10}
                        cols={50}
                        required={true}
                        placeholder="Insert description here..."
                        onChange={onChangeHandler}/><p>{jobOffer.description.length}/1000</p>
                </div>

                <div>
                    <label className={errors.requiredSkills ? "text-red-500" : ""}>Required skills*:</label>
                    <div style={{display: "flex", flexDirection: "row", alignItems: "center"}}>
                        <input type={"text"} name={"requiredSkills"} maxLength={50} value={currentSkill}
                               placeholder={"Insert a required skill here..."}
                               onChange={(e) => setCurrentSkill(e.target.value)}/>
                        <IoIosAdd onClick={onAdd}/>
                    </div>
                    {
                        jobOffer.requiredSkills.map((item, index) =>
                            <div style={{display: "flex", flexDirection: "row", alignItems: "center"}} key={index}>
                                <p>{item}</p>
                                <IoIosClose onClick={() => onRemove(index)}/>
                            </div>
                        )
                    }
                </div>

                <div>
                    <label className={errors.duration ? "text-red-500" : ""}>Duration of contract in days*:</label>
                    <input type={"number"} name={"duration"} min={1} max={1825} value={jobOffer.duration.toString()}
                           required={true} onChange={onChangeHandler}/>
                </div>

                <button type="submit" onSubmit={onSubmitHandler}
                        disabled={isSubmitting}>{isSubmitting ? "Submitting..." : "Submit"}</button>
            </form>
        </div>
    )
}

export default JobOfferForm
