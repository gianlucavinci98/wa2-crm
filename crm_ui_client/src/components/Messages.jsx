import {useEffect, useState} from "react";
import MessageAPI from "../api/crm/MessageAPI.js";
import "./Messages.css"
import dayjs from "dayjs";
import {IoInformationCircleOutline} from "react-icons/io5";
import {useNavigate} from "react-router-dom";
import {TopBar} from "./Skeleton.jsx";
import {RiAttachment2} from "react-icons/ri";


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
        <div className="message-row shadow-md" onClick={() => navigate(`/ui/Messages/${message.messageId}`)}
             style={{background: colorMap[message.status]}}>
            <div>{message.sender}</div>
            <div>{message.subject}</div>
            {
                message.hasAttachments ? <RiAttachment2 size={20}/> : <div className="w-[20px]"></div>
            }
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
                <div className="dialog-content">
                    {
                        Object.entries(colorMap).map(([key, value]) => (
                            <div className="color-list" key={key}>
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
        <>
            <TopBar/>
            <div className="message-box overflow-auto flex-1">
                <div className="info-box">
                    <IoInformationCircleOutline onClick={handleOpenDialog} size={20}/>
                </div>
                <div className="w-full overflow-y-auto flex flex-col gap-1 p-1">
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
        </>
    )
}

export default Messages