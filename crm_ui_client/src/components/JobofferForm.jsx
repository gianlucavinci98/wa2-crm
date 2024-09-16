import {useEffect, useState} from "react";
import {JobOffer, JobOfferStatus} from "../api/crm/dto/JobOffer.ts";
import JobOfferAPI from "../api/crm/JobOfferAPI.js";
import Icon from "./Icon.jsx";
import {UpdateJobOffer} from "../api/crm/dto/UpdateJobOffer.ts";
import {JobOfferHistory} from "../api/crm/dto/JobOfferHistory.ts";
import dayjs from "dayjs";

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
    const [applicant, setApplicant] = useState("")
    const [loading, setLoading] = useState(true);
    const [customer, setCustomer] = useState(props?.customer)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [serverResponse, setServerResponse] = useState("")
    const [jobOfferHistory, setJobOfferHistory] = useState([ new JobOfferHistory(4, JobOfferStatus.SelectionPhase, Date.now().toString(), null, "si parte")])

    const fetchJobOfferHistory = async () => {
        setLoading(true);
        try {
            const data = await JobOfferAPI.GetJobOfferHistory(jobOffer.jobOfferId);
            setJobOfferHistory(data);
        } catch (error) {
            console.error('Failed to fetch job Offer History:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJobOfferHistory();
    }, []);
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
                response = await JobOfferAPI.UpdateJobOffer(new UpdateJobOffer(jobOffer.status, notes, jobOffer?.selectedProfessionalId), props.currentUser.xsrfToken)
            } else {
                //TODO: change the customerId in order to became dynamic
                response = await JobOfferAPI.InsertNewJobOffer(customer.customerId, jobOffer, props.currentUser.xsrfToken)
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
            props.jobOffer === undefined
                ?
                <form className={"flex flex-col flex-1 justify-around items-center"} onSubmit={onSubmitHandler}>
                    <h1 className={"text-2xl font-semibold"}>Create new job offer</h1>
                    {serverResponse && (<div className={"w-full bg-blue-100 text-center p-4"}>{serverResponse}</div>)}
                    <div className={"flex flex-col gap-6 justify-around"}>
                        <div className={"col-field"}>
                            <label className={""}>Customer:</label>
                            <input className={"flex-1"} type={"text"}
                                   value={"" + customer.contact.name + " " + customer.contact.surname}
                                   disabled={true}/>
                        </div>
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
                                    <input type={"text"} name={"requiredSkills"} value={currentSkill}
                                           className={"p-2 flex-1"}
                                           placeholder={"Insert a required skill here..."}
                                           onChange={(e) => setCurrentSkill(e.target.value)}/>
                                    <Icon className={"w-4 h-4 fill-blue-500"} name={"plus"} onClick={onAdd}/>
                                </div>

                                {
                                    jobOffer.requiredSkills.map((item, index) =>
                                        <div className={"flex items-center gap-2"}
                                             key={index}>
                                            <p>{item}</p>
                                            <Icon className={"w-4 h-4 fill-red-500"} name={"cross"}
                                                  onClick={() => onRemove(index)}/>
                                        </div>
                                    )
                                }
                            </div>
                        </div>

                        <div className={"col-field"}>
                            <label className={errors.duration ? "text-red-500" : ""}>Duration of contract in
                                days:</label>
                            <input className={"flex-1"} type={"number"} name={"duration"} min={1} max={1825}
                                   value={jobOffer.duration.toString()}
                                   required={true} onChange={onChangeHandler}/>
                        </div>
                    </div>
                    <button className={"page-button"} type="submit" onSubmit={onSubmitHandler}
                            disabled={isSubmitting}>
                        {isSubmitting ? "Submitting..." : props.jobOffer ? "Update" : "Create"}
                    </button>
                </form>
                :
                loading ? <div className="loading-container">
                        <svg
                            aria-hidden="true"
                            viewBox="0 0 100 101"
                            fill="none"
                            className={"loading"}
                            xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                fill="currentColor"/>
                            <path
                                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                fill="currentFill"/>
                        </svg>
                </div>
                    :
                    <div className={"flex flex-1 w-full justify-around items-center"}>
                        <div className={"flex flex-col justify-around p-6 h-full items-center"}>
                            <h1 className={"text-2xl font-semibold"}>Edit JobOffer</h1>
                            {serverResponse && (
                                <div className={"w-full bg-blue-100 text-center p-4"}>{serverResponse}</div>)}
                            <div className={"flex flex-col w-full gap-6 justify-around"}>
                                <div className={"col-field"}>
                                    <label className={""}>Description:</label>
                                    <label className={"flex-1 font-normal break-words"}>
                                        {jobOffer.description}
                                    </label>
                                </div>

                                <div className={"col-field"}>
                                    <div className={"col-field"}>
                                        <label className={""}>Required skills:</label>
                                        {jobOffer.requiredSkills.map((item, index) =>
                                            <label key={index} className={"flex-1 font-normal"}>
                                                {item}
                                            </label>
                                        )
                                        }
                                    </div>
                                </div>

                                <div className={"col-field"}>
                                    <label className={""}>Duration:</label>
                                    <label
                                        className={"flex-1 font-normal"}>
                                        {jobOffer.duration.toString() + " days"}
                                    </label>
                                </div>
                                <div className={"col-field"}>
                                    <label className={""}>Value:</label>
                                    <label
                                        className={"flex-1 font-normal"}>
                                        {jobOffer.value.toString()}
                                    </label>
                                </div>
                            </div>
                            <div className={"col-field items-center"}>
                                <label className={""}>Edit JobOffer detail</label>
                                <textarea
                                    required
                                    name={"details"}
                                    value={jobOffer.details}
                                    onChange={onChangeHandler}
                                    maxLength={500}
                                    rows={10}
                                    cols={50}
                                    placeholder="Insert some details here..."
                                    className={`border p-2 resize-none ${errors.body ? "border-red-500" : ""} textarea-home`}
                                >
                            </textarea>
                                <button className={"page-button"}>Save</button>
                            </div>
                            {jobOffer.status === JobOfferStatus.SelectionPhase &&
                                <div className={"col-field items-center w-full"}>
                                    <label className={""}>Applicant:</label>
                                    <input
                                        type={"text"}
                                        className={"flex-1 font-normal"}
                                        value={applicant}
                                        onChange={(e) => setApplicant(e.target.value)}
                                    >
                                    </input>
                                    <button className={"page-button"}>Apply</button>
                                </div>}
                            <div className={"col-field items-center"}>
                                <label className={""}>Status:</label>
                                <label
                                    className={"flex-1 font-normal"}>
                                    {JobOfferStatus[jobOffer.status]}
                                </label>
                                <button className={"page-button"}>Next</button>
                                <button className={"page-button"}>Abort</button>
                            </div>
                        </div>
                        <div className={"h-[90%] w-[1px] bg-stone-600"}></div>
                        <div className={"flex flex-col justify-around p-6 h-full flex-1 items-center overflow-auto"}>
                            <h1 className={"text-2xl font-semibold"}>JobOffer history</h1>
                            <div className={"border-[1px] p-2 border-stone-500 bg-stone-100 rounded-md shadow-md w-full flex flex-col gap-2 overflow-auto "}>
                                {jobOfferHistory.map((history, index)=>
                                    <div className={"flex w-full justify-between"} key={index}>
                                        <div>{JobOfferStatus[history.jobOfferStatus]}</div>
                                        <div>{history?.note}</div>
                                        <div>{dayjs(history.date).format('DD-MM-YYYY')}</div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
    )
}

export default JobOfferForm
