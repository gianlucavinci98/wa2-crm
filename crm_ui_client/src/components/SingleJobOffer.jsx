import {useEffect, useState} from "react";
import JobOfferAPI from "../api/crm/JobOfferAPI.js";
import {useNavigate, useParams} from "react-router-dom";
import {JobOfferStatus} from "../api/crm/dto/JobOffer.ts";
import dayjs from "dayjs";
import {FaArrowLeft} from "react-icons/fa";
import {TbUserEdit} from "react-icons/tb";
import {LuTrash2} from "react-icons/lu";

function SingleJobOffer({currentUser}) {
    const {jobOfferId} = useParams();
    const navigate = useNavigate()
    const [load, setLoad] = useState(false)
    const [data, setData] = useState(null)
    const [history, setHistory] = useState(null)

    useEffect(() => {
        if (!load && jobOfferId) {
            JobOfferAPI.GetJobOfferById(jobOfferId).then((result) => {
                    setData(result)
                }
            ).then(() => {
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
                    <div className={'h-full w-full flex flex-col justify-between p-4'}>
                        <div className="w-full flex flex-row justify-center items-start">
                            <div className="flex flex-row justify-start">
                                <button onClick={() => navigate("/ui/JobOffers")}>
                                    <FaArrowLeft size={20}/>
                                </button>
                            </div>
                            <div className="flex flex-1 flex-row justify-center">
                                <h1 className="font-bold text-2xl">Job Offer Details</h1>
                            </div>
                            <div className="flex flex-row p-2">
                                <button className="bg-yellow-300 border rounded-lg p-2"
                                        onClick={() => navigate(`/ui/JobOffers/${jobOfferId}/edit`)}>
                                    <TbUserEdit size={20}/>
                                </button>
                            </div>
                            <div className="flex flex-row p-2">
                                <button className="bg-red-300 border rounded-lg p-2" onClick={() => {
                                    JobOfferAPI.DeleteJobOffer(jobOfferId, currentUser.xsrfToken).then(() => {
                                        alert("Correctly removed jobOffer")
                                        navigate("/ui/JobOffers")
                                    }).catch((err) => {
                                        console.log(err);
                                        alert("Error during jobOffer cancellation.")
                                    })
                                }}><LuTrash2 size={20}/></button>
                            </div>
                        </div>
                        <div className={"p-6 flex flex-1 w-full justify-around items-center"}>
                            <div className={"p-6 flex flex-col gap-4 h-full"}>
                                <div className={"col-field items-center"}>
                                    <h2 className={'font-semibold text-lg'}>Description:</h2>
                                    <p className={''}>{data.description}</p>
                                </div>
                                <div className={"col-field items-center"}>
                                    <h2 className={'font-semibold text-lg'}>Details:</h2>
                                    <p className={''}>{data.details !== null ? data.details : "no details for this job offer"}</p>
                                </div>
                                <div className={"col-field items-center"}>
                                    <h2 className={'font-semibold text-lg'}>Status:</h2>
                                    <p className={''}>{data.status !== null ? data.status : ""}</p>
                                </div>
                                <div className={"col-field items-center"}>
                                    <h2 className={'font-semibold text-lg'}>Required skills:</h2>
                                    <p className={''}>{data.requiredSkills !== null ? data.requiredSkills.map(e => e) : ""}</p>
                                </div>
                                <div className={"col-field items-center"}>
                                    <h2 className={'font-semibold text-lg'}>Duration: </h2>
                                    <p className={''}>{data.duration}</p>
                                </div>
                                <div className={"col-field items-center"}>
                                    <h2 className={'font-semibold text-lg'}>Value: </h2>
                                    <p className={''}>{data.value !== null ? data.value : ""}</p>
                                </div>
                                <div className={"col-field items-center"}>
                                    <h2 className={'font-semibold text-lg'}>Selected Professional Id</h2>
                                    <p className={''}>{data.selectedProfessionalId !== null ? data.selectedProfessionalId : "Not Assigned"}</p>
                                </div>
                            </div>
                            <div className={"h-[90%] w-[1px] bg-stone-600"}></div>
                            <div
                                className={"flex flex-col justify-around p-6 h-full flex-1 items-center overflow-auto"}>
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
                    </div>

            }
        </>
    )
}

export default SingleJobOffer;