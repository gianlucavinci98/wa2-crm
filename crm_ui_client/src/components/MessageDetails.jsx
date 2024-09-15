import {useEffect, useState} from "react";
import MessageAPI from "../api/crm/MessageAPI.js";
import {useNavigate, useParams} from "react-router-dom";
import "./MessageDetails.css";
import {FaArrowLeft} from "react-icons/fa";

// Componente per la finestra di dialogo
function Dialog({onClose, currentUser}) {
    return (
        <div className="overlay">
            <div className="dialog">
                <h2 className="message-details-header-subject" style={{paddingBottom: '10px'}}>Change message
                    status</h2>
                <p>Chose on of the proposed status:</p>
                <button onClick={onClose}>Close</button>
            </div>
        </div>
    )
}

function MessageDetails({currentUser}) {
    const navigate = useNavigate();

    const [message, setMessage] = useState(null)
    const [load, setLoad] = useState(false)
    const [showDialog, setShowDialog] = useState(false);
    const {messageId} = useParams()

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

    return (
        <div className="message-details">
            {
                load
                    ?
                    <>
                        <div className="message-details-header">
                            <FaArrowLeft onClick={() => navigate("/ui/Messages")}/>
                            <h1 className={"message-details-header-subject"}>{message.subject}</h1>
                            <h2 className={"message-details-header-sender"}>{message.sender}</h2>
                        </div>
                        <div className="message-details-body">{message.body}</div>
                    </>
                    :
                    <></>
            }
        </div>
    )
}

export default MessageDetails;