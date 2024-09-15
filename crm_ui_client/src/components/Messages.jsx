import {useEffect, useState} from "react";
import MessageAPI from "../api/crm/MessageAPI.js";
import "./Messages.css"
import dayjs from "dayjs";
import {IoInformationCircleOutline} from "react-icons/io5";
import {useNavigate} from "react-router-dom";


const colorMap = {
    Received: "#CCCCFF",
    Read: "#FFFFFF",
    Processing: "#FFFFCC",
    Done: "#E5FFCC",
    Discarded: "#FFCCCC",
    Failed: "#FFCCCC"
}

function MessageRow({message}) {
    const navigate = useNavigate();

    return (
        <div className="message-row" onClick={() => navigate(`/ui/Messages/${message.messageId}`)}
             style={{background: colorMap[message.status]}}>
            <div>{message.sender}</div>
            <div>{message.subject}</div>
            <div>{dayjs(message.date).format('DD-MM-YYYY')}</div>
        </div>
    )
}

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

function Messages() {
    const [messages, setMessages] = useState([])
    const [load, setLoad] = useState(false)
    const [showDialog, setShowDialog] = useState(false)

    useEffect(() => {
        if (!load) {
            MessageAPI.GetMessages(null, null)
                .then((data) => {
                    setMessages(data)
                    setLoad(true)
                })
                .catch((err) => console.log(err))
        }
    }, [load])

    const handleOpenDialog = () => {
        setShowDialog(true);
    };

    const handleCloseDialog = () => {
        setShowDialog(false);
    };

    return (
        <div className="message-box">
            <div style={{width: "100%", display: "flex", flexDirection: "row", justifyContent: "end", padding: "5px"}}>
                <IoInformationCircleOutline onClick={handleOpenDialog}/>
            </div>
            <div style={{width: "100%"}}>
                {
                    load
                        ?
                        messages.sort((a, b) => b.priority - a.priority).map((message) => (
                            <MessageRow key={message.messageId} message={message}/>
                        ))
                        :
                        <></>
                }
            </div>
            {showDialog && <Dialog onClose={handleCloseDialog}/>}
        </div>
    )
}

export default Messages