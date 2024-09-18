import {useEffect, useState} from "react";
import JobOfferAPI from "../api/crm/JobOfferAPI.js";
import {useParams} from "react-router-dom";
import {JobOfferStatus} from "../api/crm/dto/JobOffer.js";
import dayjs from "dayjs";

function SingleJobOffer({currentUser}) {
    const {jobOfferId} = useParams();

    const [load, setLoad] = useState(false)
    const [data, setData] = useState(null)
    const [history, setHistory] = useState(null)

    useEffect(() => {
        if (!load && jobOfferId) {
            JobOfferAPI.GetJobOfferById(jobOfferId).then((result) => {
                    setData(result)
                }
            ).then(()=>{
                JobOfferAPI.GetJobOfferHistory(jobOfferId).then((result2) => {
                    setHistory(result2)
                    setLoad(true)
                })
            })
                .catch(err => console.log(err))
        }
    }, [load, jobOfferId])

    return (
        <>
            {
                !load
                    ?
                    <></>
                    :
                    <div className={"p-6 flex h-full w-full justify-around"}>
                        <div className={"flex flex-col justify-around h-full"}>
                            <div className={"col-field items-center"}>
                                <h2>Description:</h2>
                                <p>{data.description}</p>
                            </div>
                            <div className={"col-field items-center"}>
                                <h2>Details:</h2>
                                <p>{data.details !== null ? data.details : "no details for this job offer"}</p>
                            </div>
                            <div className={"col-field items-center"}>
                                <h2>Status:</h2>
                                <p>{data.status !== null ? data.status : ""}</p>
                            </div>
                            <div className={"col-field items-center"}>
                                <h2>Required skills:</h2>
                                <p>{data.requiredSkills !== null ? data.requiredSkills.map(e => e) : ""}</p>
                            </div>
                            <div className={"col-field items-center"}>
                                <h2>Duration: </h2>
                                <p>{data.duration}</p>
                            </div>
                            <div className={"col-field items-center"}>
                                <h2>Value: </h2>
                                <p>{data.value !== null ? data.value : ""}</p>
                            </div>
                            <div className={"col-field items-center"}>
                                <h2>Selected Professional Id</h2>
                                <p>{data.selectedProfessionalId !== null ? data.selectedProfessionalId : "Not Assigned"}</p>
                            </div>
                        </div>
                        <div className={"h-[90%] w-[1px] bg-stone-600"}></div>
                        <div className={"flex flex-col justify-around p-6 h-full flex-1 items-center overflow-auto"}>
                            <h1 className={"text-2xl font-semibold"}>JobOffer history</h1>
                            <div
                                className={"border-[1px] p-2 border-stone-500 bg-stone-100 rounded-md shadow-md w-full flex flex-col gap-2 overflow-auto "}>
                                {history.map((history, index) =>
                                    <div className={"flex w-full justify-between"} key={index}>
                                        <div className={"w-1/4"}>{JobOfferStatus[history.jobOfferStatus]}</div>
                                        <div
                                            className={"w-1/4 break-words"}>{history.note !== '' ? `Note: ${history?.note}` : ''}</div>
                                        <div
                                            className={"w-1/4 text-center break-words"}>Applicants: {history?.candidates?.length > 0 ? history?.candidates?.length : 0}</div>
                                        <div
                                            className={"w-1/4 text-center"}>{dayjs(history.date).format('DD-MM-YYYY')}</div>
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>
            }
        </>
    )
}

export default SingleJobOffer;