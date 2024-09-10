import {useState} from "react";
import {JobOffer} from "../api/crm/dto/JobOffer.ts";
import {useParams} from "react-router-dom";
import {IoIosAdd, IoIosClose} from "react-icons/io";

function JobOfferForm(props) {
    let {jobOfferId} = useParams();

    const [jobOffer, setJobOffer] = useState(
        props.jobOffer !== undefined && props.jobOffer !== null
            ?
            props.jobOffer
            :
            new JobOffer(null, "", "", null, [], BigInt(1), null, null)
    )
    const [currentSkill, setCurrentSkill] = useState("")

    const onSubmitHandler = (event) => {
        event.preventDefault()

        //TODO va fatta la verifica dei parametri inseriti e va aggiunta la logica degli errori come nell'altro form
    }

    const onChangeHandler = (event) => {
        event.preventDefault()
        const {name, value} = event.target

        setJobOffer((old) => ({
            ...old,
            [name]: value
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
                <div>
                    <label>Description*:</label>
                    <textarea
                        name={"description"}
                        value={jobOffer.description}
                        maxLength={1000}
                        rows={10}
                        cols={50}
                        placeholder="Insert description here..."
                        onChange={onChangeHandler}/><p>{jobOffer.description.length}/1000</p>
                </div>

                <div>
                    <label>Details:</label>
                    <textarea
                        name={"details"}
                        value={jobOffer.details}
                        maxLength={500}
                        rows={10}
                        cols={50}
                        placeholder="Insert some other details here..."
                        onChange={onChangeHandler}/><p>{jobOffer.details.length}/500</p>
                </div>

                <div>
                    <label>Required skills*:</label>
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
                    <label>Duration of contract in days*:</label>
                    <input type={"number"} name={"duration"} min={1} max={1825} value={jobOffer.duration.toString()}
                           onChange={onChangeHandler}/>
                </div>

                <button type="submit" onSubmit={onSubmitHandler}>Submit</button>
            </form>
        </div>
    )
}

export default JobOfferForm
