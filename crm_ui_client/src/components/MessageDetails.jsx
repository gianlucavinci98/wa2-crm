import {useEffect, useState} from "react";
import MessageAPI from "../api/crm/MessageAPI.js";
import {useNavigate, useParams} from "react-router-dom";
import "./MessageDetails.css";
import {FaArrowLeft} from "react-icons/fa";
import {TbMessage2Cog} from "react-icons/tb";
import {MessageHistory, MessageStatus} from "../api/crm/dto/MessageHistory.ts";

function Dialog({message, currentUser, onClose}) {
    const [newStatus, setNewStatus] = useState(new MessageHistory(null, message.status, null, ""))

    const handleSubmit = (event) => {
        event.preventDefault()

        MessageAPI.UpdateStatusOfMessage(message.messageId, newStatus, currentUser.xsrfToken)
            .then(r => onClose())
            .catch(err => console.log(err));
    }

    const handleChange = (event) => {
        event.preventDefault()
        const {name, value} = event.target

        setNewStatus((old) => ({
            ...old,
            [name]: value
        }))
    }

    return (
        <div className="overlay">
            <div className="dialog">
                <h2 className="message-details-header-subject" style={{paddingBottom: '10px'}}>
                    Change status
                </h2>
                <div style={{display: "flex", flexDirection: "column", alignItems: "space-between"}}>
                    <form onSubmit={handleSubmit}>
                        <div style={{display: "flex", flexDirection: "column", justifyContent: "space-between"}}>
                            <div style={{display: "flex", flexDirection: "row", alignItems: "center"}}>
                                <label>Processing</label>
                                <input type="radio" value={MessageStatus.Processing} name={"messageStatus"}
                                       onChange={handleChange}/>
                            </div>
                            <div style={{display: "flex", flexDirection: "row", alignItems: "center"}}>
                                <label>Discarded</label>
                                <input type="radio" value={MessageStatus.Discarded} name={"messageStatus"}
                                       onChange={handleChange}/>
                            </div>
                            <div style={{display: "flex", flexDirection: "row", alignItems: "center"}}>
                                <label>Done</label>
                                <input type="radio" value={MessageStatus.Done} name={"messageStatus"}
                                       onChange={handleChange}/>
                            </div>
                            <div style={{display: "flex", flexDirection: "row", alignItems: "center"}}>
                                <label>Failed</label>
                                <input type="radio" value={MessageStatus.Failed} name={"messageStatus"}
                                       onChange={handleChange}/>
                            </div>
                        </div>

                        <label>Comments:</label>
                        <input type="text" value={newStatus.comment} name={"comment"} max={200}
                               onChange={handleChange}/>

                        <button type="submit">Submit</button>
                        <button type="button" onClick={onClose}>Close</button>
                    </form>
                </div>
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

    return (
        <div className="message-details">
            {
                load
                    ?
                    <>
                        <div className="message-details-header">
                            <div className="message-details-header-left">
                                <FaArrowLeft onClick={() => navigate("/ui/Messages")}/>
                            </div>
                            <div className="message-details-header-center">
                                <h1 className={"message-details-header-subject"}>{message.subject}</h1>
                                <h2 className={"message-details-header-sender"}>{message.sender}</h2>
                            </div>
                            <div className="message-details-header-right">
                                <TbMessage2Cog onClick={handleOpenDialog}/>
                            </div>
                        </div>
                        <div className="message-details-body">{message.body}</div>
                    </>
                    :
                    <></>
            }
            {showDialog && <Dialog message={message} currentUser={currentUser} onClose={handleCloseDialog}/>}
        </div>
    )
}

export default MessageDetails;