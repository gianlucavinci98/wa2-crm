import {useEffect, useState} from "react";
import JobOfferAPI from "../api/crm/JobOfferAPI.js";
import {TopBar} from "./Skeleton.jsx";

function SingleJobOffer({currentUser, jobOfferId}) {

    const [load, setLoad] = useState(false)
    const [data, setData] = useState(null)

    useEffect(() => {
        if (!load && jobOfferId) {
            JobOfferAPI.GetJobOfferById(jobOfferId).then((result) => {
                    setData(result)
                    setLoad(true)
                }
            ).catch(err => console.log(err))
        }
    }, [load, jobOfferId])

    return (
        <>
            <TopBar></TopBar>
            <div>
                <h2>Description:</h2>
                <p>data.description</p>
                <h2>Details:</h2>
                <p>{data.details !== null ? data.details : ""}</p>
                <h2>Status:</h2>
                <p>{data.status !== null ? data.status : ""}</p>
                <h2>Required skills:</h2>
                <p>{data.requiredSkills !== null ? data.requiredSkills.forEach(e => e) : ""}</p>
                <h2>Duration: </h2>
                <p>data.duration</p>
                <h2>Value: </h2>
                <p>{data.value !== null ? data.value : ""}</p>
                <h2>Selected Professional Id</h2>
                <p>{data.selectedProfessionalId !== null ? data.selectedProfessionalId : 'empty'}</p>
            </div>
        </>
    )
}

export default SingleJobOffer;