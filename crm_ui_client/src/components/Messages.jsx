import {useEffect, useState} from "react";
import MessageAPI from "../api/crm/MessageAPI.js";
import "./Messages.css"
import dayjs from "dayjs";
import {IoMailOutline, IoMailUnreadOutline} from "react-icons/io5";
import {MessageStatus} from "../api/crm/dto/MessageHistory.ts";
import {useNavigate} from "react-router-dom";

function MessageRow({message}) {
    const navigate = useNavigate();

    return (
        <div className="message-row" onClick={() => navigate(`/ui/Messages/${message.messageId}`)}>
            <div>{message.sender}</div>
            <div>{message.subject}</div>
            <div>{dayjs(message.date).format('DD-MM-YYYY')}</div>
            <>
                {
                    message.status === MessageStatus.Received
                        ?
                        <IoMailOutline/>
                        :
                        <IoMailUnreadOutline/>
                }
            </>
        </div>
    )
}

function Messages() {
    const [messages, setMessages] = useState([])
    const [load, setLoad] = useState(false)

    useEffect(() => {
        if (!load) {
            MessageAPI.GetMessages(null, null)
                .then((data) => setMessages(data))
                .catch((err) => console.log(err))
            setLoad(true)
        }
    }, [load])

    console.log(messages)

    return (
        <div className="message-box">
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
    )
}

export default Messages