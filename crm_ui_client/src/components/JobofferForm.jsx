import {useState} from "react";
import {JobOffer} from "../api/crm/dto/JobOffer.ts";
import JobOfferAPI from "../api/crm/JobOfferAPI.js";
import Icon from "./Icon.jsx";

function JobOfferForm(props) {

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
            if (props.jobOffer !== undefined && props.jobOffer !== null) {
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
        <form className={"flex flex-col flex-1 justify-around items-center"} onSubmit={onSubmitHandler}>
            {
                props.jobOffer !== undefined
                    ?
                    <h1 className= {"text-2xl font-semibold"}>Edit job offer</h1>
                    :
                    <h1 className={"text-2xl font-semibold"}>Create new job offer</h1>
            }
            {serverResponse && (<div className={"w-full bg-blue-100 text-center p-4"}>{serverResponse}</div>)}
            <div className={"flex flex-col gap-6 justify-around"}>
                <div className={"col-field"}>
                    <div className={"h-full flex flex-col justify-between"}>
                        <label className={errors.description ? "text-red-500" : ""}>Description:</label>
                        <div>{jobOffer.description.length}/1000</div>
                    </div>
                    <textarea
                        name={"description"}
                        className={"h-52"}
                        value={jobOffer.description}
                        maxLength={1000}
                        cols={50}
                        required={true}
                        placeholder="Insert description here..."
                        onChange={onChangeHandler}/>

                </div>

                <div className={"col-field"}>
                    <label className={errors.requiredSkills ? "text-red-500" : ""}>Required skills:</label>
                    <div className={"flex flex-col gap-2 flex-1"}>
                        <div className={"flex-1 flex gap-2 items-center"}>
                            <input type={"text"} name={"requiredSkills"} value={currentSkill} className={"p-2 flex-1"}
                                   placeholder={"Insert a required skill here..."}
                                   onChange={(e) => setCurrentSkill(e.target.value)}/>
                            <Icon className={"w-4 h-4 fill-blue-500"} name={"plus"} onClick={onAdd}/>
                        </div>

                        {
                            jobOffer.requiredSkills.map((item, index) =>
                                <div className={"flex items-center gap-2"}
                                     key={index}>
                                <p>{item}</p>
                                    <Icon className={"w-4 h-4 fill-red-500"} name={"cross"} onClick={() => onRemove(index)}/>
                                </div>
                            )
                        }
                    </div>
                </div>

                <div className={"col-field"}>
                    <label className={errors.duration ? "text-red-500" : ""}>Duration of contract in days:</label>
                    <input className={"flex-1"} type={"number"} name={"duration"} min={1} max={1825} value={jobOffer.duration.toString()}
                           required={true} onChange={onChangeHandler}/>
                </div>
            </div>
            <button className={"page-button"} type="submit" onSubmit={onSubmitHandler}
                    disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : props.jobOffer? "Update": "Create"}
            </button>
        </form>
    )
}

export default JobOfferForm
