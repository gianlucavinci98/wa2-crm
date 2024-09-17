import {useEffect, useState} from "react";
import MessageAPI from "../api/crm/MessageAPI.js";
import "./Messages.css"
import dayjs from "dayjs";
import {IoInformationCircleOutline} from "react-icons/io5";
import {useNavigate} from "react-router-dom";
import {TopBar} from "./Skeleton.jsx";
import {RiAttachment2} from "react-icons/ri";
import {MessageStatus} from "../api/crm/dto/MessageHistory.ts";
import {MessageFilter} from "../api/crm/filter/MessageFilter.ts";
import Icon from "./Icon.jsx";
import {Pagination} from "../api/utils/Pagination.ts";


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
                <div className="dialog-content-1">
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
    const [openFilter, setOpenFilter] = useState(false);
    const [filter, setFilter] = useState(null);
    const [page, setPage] = useState(1)

    useEffect(() => {
        if (!load) {
            MessageAPI.GetMessages(filter === null ? null : new MessageFilter(filter), new Pagination(page - 1, 8))
                .then((data) => {
                    setMessages(data)
                    setLoad(true)
                })
                .catch((err) => console.log(err))
        }
    }, [load, filter, page])

    const handleOpenDialog = () => {
        setShowDialog(true);
    };

    const handleCloseDialog = () => {
        setShowDialog(false);
    };

    return (
        <>
            <TopBar openFilter={openFilter} switchFilter={() => setOpenFilter(!openFilter)} filterPresent={true}/>
            <div className="message-box overflow-auto flex-1">
                {
                    openFilter
                        ?
                        <div className="flex flex-col gap-2 border-b p-2">
                            <div className="flex flex-row justify-center">
                                <label className="flex-1">Set filter on message status</label>
                            </div>
                            <div className="flex flex-row gap-1">
                                <div className="status-list-element">
                                    <label>Received</label>
                                    <input type="radio" name={"messageStatus"}
                                           checked={filter === 0}
                                           onChange={() => setFilter(MessageStatus.Received)}/>
                                </div>
                                <div className="status-list-element">
                                    <label>Read</label>
                                    <input type="radio" name={"messageStatus"}
                                           checked={filter === 1}
                                           onChange={() => setFilter(MessageStatus.Read)}/>
                                </div>
                                <div className="status-list-element">
                                    <label>Processing</label>
                                    <input type="radio" name={"messageStatus"}
                                           checked={filter === 2}
                                           onChange={() => setFilter(MessageStatus.Processing)}/>
                                </div>
                                <div className="status-list-element">
                                    <label>Discarded</label>
                                    <input type="radio" name={"messageStatus"}
                                           checked={filter === 4}
                                           onChange={() => setFilter(MessageStatus.Discarded)}/>
                                </div>
                                <div className="status-list-element">
                                    <label>Done</label>
                                    <input type="radio" name={"messageStatus"}
                                           checked={filter === 3}
                                           onChange={() => setFilter(MessageStatus.Done)}/>
                                </div>
                                <div className="status-list-element">
                                    <label>Failed</label>
                                    <input type="radio" name={"messageStatus"}
                                           checked={filter === 5}
                                           onChange={() => setFilter(MessageStatus.Failed)}/>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <button className="border p-2 rounded-lg" onClick={() => setLoad(false)}>Apply
                                    </button>
                                    <button className="border p-2 rounded-lg" onClick={() => {
                                        setFilter(null)
                                        setLoad(false)
                                    }}>Reset
                                    </button>
                                </div>
                            </div>
                        </div>
                        :
                        <></>
                }
                <div className="info-box">
                    <IoInformationCircleOutline onClick={handleOpenDialog} size={20} style={{cursor: "help"}}/>
                </div>
                <div className="w-full overflow-y-auto flex flex-col flex-1 gap-1 p-1 items-center">
                    {
                        load
                            ?
                            <>
                                {
                                    messages.length === 0
                                        ?
                                        <div className="flex-1">No result for this research</div>
                                        :
                                        messages.sort((a, b) => b.priority - a.priority).map((message) => (
                                            <MessageRow key={message.messageId} message={message}/>
                                        ))
                                }
                            </>
                            :
                            <></>
                    }
                </div>
                {showDialog && <Dialog onClose={handleCloseDialog}/>}
                <div className="w-full h-[10%] flex items-center justify-between">
                    <button className={"page-button"} onClick={() => {
                        setPage(page - 1)
                        setLoad(false)
                    }} disabled={page === 1}>
                        <Icon name='arrowLeft' className="w-4 h-4"/>
                        Previous
                    </button>
                    <span className={"text-xl text-stone-600"}>Page {page}</span>
                    <button className={"page-button"} onClick={() => {
                        setPage(page + 1)
                        setLoad(false)
                    }}>
                        Next
                        <Icon name='arrowRight' className="w-4 h-4"/>
                    </button>
                </div>
            </div>
        </>
    )
}

export default Messages