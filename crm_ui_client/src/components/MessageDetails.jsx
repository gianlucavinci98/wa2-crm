import {useEffect, useState} from "react";
import MessageAPI from "../api/crm/MessageAPI.js";
import {useNavigate, useParams} from "react-router-dom";
import "./MessageDetails.css";
import {FaArrowLeft} from "react-icons/fa";
import {TbMessage2Cog} from "react-icons/tb";

function Dialog({onClose}) {
    return (
        <div className="overlay">
            <div className="dialog">
                <h2 className="message-details-header-subject" style={{paddingBottom: '10px'}}>
                    Message status color legend
                </h2>
                <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
                    {
                        Object.entries(colorMap).map(([key, value]) => (
                            <div key={key}>
                                <p>{key.toString()}</p>
                                <div className="circle" style={{background: value}}/>
                            </div>
                        ))
                    }
                </div>
                <button onClick={onClose}>Close</button>
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
                                <TbMessage2Cog onClick={() => {
                                }}/>
                            </div>
                        </div>
                        <div className="message-details-body">{message.body}</div>
                    </>
                    :
                    <></>
            }
            {showDialog && <Dialog onClose={handleCloseDialog}/>}
        </div>
    )
}

export default MessageDetails;