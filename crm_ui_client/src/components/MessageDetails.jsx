import {useEffect, useState} from "react";
import MessageAPI from "../api/crm/MessageAPI.js";
import {useNavigate, useParams} from "react-router-dom";
import "./MessageDetails.css";
import {FaArrowLeft} from "react-icons/fa";
import {TbMessage2Cog} from "react-icons/tb";
import {MessageHistory} from "../api/crm/dto/MessageHistory.ts";
import {IoInformationCircleOutline} from "react-icons/io5";
import {MdOutlineHistory} from "react-icons/md";
import dayjs from "dayjs";

function HistoryDialog({messageId, onClose}) {
    const [history, setHistory] = useState([])
    const [load, setLoad] = useState(false)

    useEffect(() => {
        if (!load) {
            MessageAPI.GetMessageHistoryById(messageId).then((res) => {
                setHistory(res)
                setLoad(true)
            }).catch((err) => console.log(err))
        }
    }, [load, messageId]);

    console.log(history)
    return (
        <div className="overlay">
            <div className="dialog flex flex-col gap-1 justify-center overflow-y-auto">
                <h2 className="message-details-header-subject" style={{paddingBottom: '10px'}}>
                    Change status
                </h2>
                {
                    !load
                        ?
                        <></>
                        :
                        <div className="flex flex-1 flex-col overflow-y-auto">
                            <div className="flex flex-1 flex-row justify-around">
                                <div className="flex-col flex-1 p-2 font-bold">Date</div>
                                <div className="flex-col flex-1 p-2 font-bold">Status</div>
                                <div className="flex-col flex-1 p-2 font-bold">Comment</div>
                            </div>
                            {
                                history.sort((a, b) => dayjs(a).diff(dayjs(b))).map((h) => (
                                    <div key={h.messageHistoryId}
                                         className="flex flex-1 flex-row justify-around border">
                                        <div
                                            className="flex-col flex-1 p-2">{dayjs(h.date).format('DD-MM-YYYY h:mm A')}</div>
                                        <div className="flex-col flex-1 p-2">{h.messageStatus}</div>
                                        <div
                                            className="flex-col flex-1 justify-start p-2">{h.comment === null || h.comment.trim() === "" ? "No comment" : h.comment}</div>
                                    </div>)
                                )
                            }
                            <button className="flex flex-row justify-center w-1/4 m-1" type="button" onClick={onClose}
                                    style={{background: "#FFCCCC"}}>Close
                            </button>
                        </div>
                }
            </div>
        </div>
    )
}

function Dialog({message, setLoad, currentUser, onClose}) {
    const [comment, setComment] = useState("")
    const [check, setCheck] = useState(message.status)
    const [error, setError] = useState("");
    const [showSchema, setShowSchema] = useState(false);

    const handleSubmit = (event) => {
        event.preventDefault()

        if (check === message.status) {
            return
        }

        const newMessageHistory = new MessageHistory(null, check, null, comment)

        MessageAPI.UpdateStatusOfMessage(message.messageId, newMessageHistory, currentUser.xsrfToken)
            .then(() => {
                setError("")
                setLoad(false)
                onClose()
            })
            .catch(() => setError("Error updating. Check the compatibility of the entered status"));
    }

    const handleChange = (event) => {
        event.preventDefault()
        const {name, value} = event.target

        if (name === "messageStatus") {
            setCheck(value)
        } else {
            setComment(value)
        }
    }

    return (
        <div className="overlay">
            <div className="dialog">
                <h2 className="message-details-header-subject" style={{paddingBottom: '10px'}}>
                    Change status
                </h2>
                {
                    error.length > 0 && !showSchema &&
                    <div className="error-message">
                        <p>{error}</p>
                        <IoInformationCircleOutline onClick={() => setShowSchema(true)} size={20}
                                                    style={{cursor: "help"}}/>
                    </div>
                }
                {
                    showSchema
                        ?
                        <div className="image-box">
                            <img className="image" src={"/ui/static/message_status_schema.png"}
                                 alt={"Message status schema"}/>
                            <button onClick={() => setShowSchema(false)}>Close</button>
                        </div>
                        :
                        <div className="dialog-content-2">
                            <form onSubmit={handleSubmit}>
                                <div className="status-list">
                                    <div className="status-list-element">
                                        <label>Processing</label>
                                        <input type="radio" value={"Processing"} name={"messageStatus"}
                                               checked={check === "Processing"}
                                               onChange={handleChange}/>
                                    </div>
                                    <div className="status-list-element">
                                        <label>Discarded</label>
                                        <input type="radio" value={"Discarded"} name={"messageStatus"}
                                               checked={check === "Discarded"}
                                               onChange={handleChange}/>
                                    </div>
                                    <div className="status-list-element">
                                        <label>Done</label>
                                        <input type="radio" value={"Done"} name={"messageStatus"}
                                               checked={check === "Done"}
                                               onChange={handleChange}/>
                                    </div>
                                    <div className="status-list-element">
                                        <label>Failed</label>
                                        <input type="radio" value={"Failed"} name={"messageStatus"}
                                               checked={check === "Failed"}
                                               onChange={handleChange}/>
                                    </div>
                                </div>

                                <div className="status-list-element">
                                    <label>Comments:</label>
                                    <input type="text" value={comment} name={"comment"} max={200}
                                           onChange={handleChange}/>
                                </div>

                                <div className="buttons-row">
                                    <button className="button" type="submit" style={{background: "#E5FFCC"}}>Submit
                                    </button>
                                    <button className="button" type="button" onClick={onClose}
                                            style={{background: "#FFCCCC"}}>Close
                                    </button>
                                </div>
                            </form>
                        </div>
                }
            </div>
        </div>
    )
}

function MessageDetails({currentUser}) {
    const navigate = useNavigate();

    const [message, setMessage] = useState(null)
    const [load, setLoad] = useState(false)
    const {messageId} = useParams()
    const [showDialog, setShowDialog] = useState(false)
    const [showHistoryDialog, setShowHistoryDialog] = useState(false)

    useEffect(() => {
        if (!load) {
            MessageAPI.GetMessageById(messageId)
                .then((data) => {
                    setMessage(data)
                    setLoad(true)
                })
                .catch((err) => console.log(err));
        }
    }, [load, messageId])

    const handleOpenDialog = () => {
        setShowDialog(true);
    };

    const handleCloseDialog = () => {
        setShowDialog(false);
    };

    const handleOpenHistoryDialog = () => {
        setShowHistoryDialog(true);
    };

    const handleCloseHistoryDialog = () => {
        setShowHistoryDialog(false);
    };

    return (
        <div className="message-details overflow-auto flex-1">
            {
                load
                    ?
                    <>
                        <div className="message-details-header">
                            <div className="message-details-header-left">
                                <FaArrowLeft onClick={() => navigate("/ui/Messages")} style={{cursor: "pointer"}}/>
                            </div>
                            <div className="message-details-header-center">
                                <h1 className={"message-details-header-subject"}>{message.subject}</h1>
                                <h2 className={"message-details-header-sender"}>{message.sender}</h2>
                            </div>
                            <div className="message-details-header-right">
                                Status: {message.status}
                                <TbMessage2Cog onClick={handleOpenDialog} size={20} style={{cursor: "pointer"}}/>
                                <MdOutlineHistory onClick={handleOpenHistoryDialog} size={20}
                                                  style={{cursor: "pointer"}}/>
                            </div>
                        </div>
                        <div className="overflow-auto border flex-1 p-4"
                             dangerouslySetInnerHTML={{__html: message.body}}/>
                    </>
                    :
                    <></>
            }
            {showDialog &&
                <Dialog message={message} setLoad={setLoad} currentUser={currentUser} onClose={handleCloseDialog}/>}
            {showHistoryDialog &&
                <HistoryDialog messageId={messageId} onClose={handleCloseHistoryDialog}/>}
        </div>
    )
}

export default MessageDetails;