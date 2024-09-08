import {useState} from "react"
import {Channel, Message} from "../api/crm/dto/Message.ts"
import MessageAPI from "../api/crm/MessageAPI.js"
import "./HomePage.css"

function HomePage() {
    const [message, setMessage] = useState(new Message(null, "", "", "", "", Channel.Email, 0))
    const [errorEmail, setErrorEmail] = useState("")
    const [errorSubject, setErrorSubject] = useState("")
    const [errorBody, setErrorBody] = useState("")

    const onSubmitHandler = (event) => {
        event.preventDefault()

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        let localErrorEmail = ""
        let localErrorSubject = ""
        let localErrorBody = ""

        if (!emailRegex.test(message.sender)) {
            localErrorEmail = "Incorrect email address pattern"
        }
        if (message.subject.trim().length === 0) {
            localErrorSubject = "Empty message subject not allowed"
        }
        if (message.body.trim().length === 0) {
            localErrorBody = "Empty message body not allowed"
        }

        if (localErrorEmail === "" && localErrorSubject === "" && localErrorBody === "") {
            MessageAPI.InsertNewMessage(message).then((response) => {
                console.log(response)
            })
        } else {
            setErrorEmail(localErrorEmail)
            setErrorSubject(localErrorSubject)
            setErrorBody(localErrorBody)
        }
    }

    const onChangeHandler = (event) => {
        event.preventDefault()

        let {name, value} = event.target

        setMessage({
            ...message,
            [name]: value
        })
    }

    return (
        <div>
            {
                errorEmail.length > 0 || errorBody.length > 0 || errorBody.length > 0
                    ?
                    <div style={{display: "flex", flexDirection: "column", background: "red"}}>
                        <p>{errorEmail}</p>
                        <p>{errorSubject}</p>
                        <p>{errorBody}</p>
                    </div>
                    :
                    <></>
            }
            <form onSubmit={onSubmitHandler}>
                <div>
                    <label style={errorEmail.trim().length !== 0 ? {color: "red"} : {}}>Email*:</label>
                    <input type={"email"} required={true} onChange={onChangeHandler} name={"sender"}
                           value={message.sender}
                           style={errorEmail.trim().length !== 0 ? {border: "1px solid red"} : {}}/>
                </div>
                <div>
                    <label style={errorSubject.trim().length !== 0 ? {color: "red"} : {}}>Subject*:</label>
                    <input type={"text"} required={true} onChange={onChangeHandler} name={"subject"}
                           value={message.subject}
                           style={errorSubject.trim().length !== 0 ? {border: "1px solid red"} : {}}/>
                </div>
                <div>
                    <label style={errorBody.trim().length !== 0 ? {color: "red"} : {}}>Body*:</label>
                    <textarea required={true} onChange={onChangeHandler} name={"body"}
                              value={message.body} maxLength={500} rows={10} cols={50}
                              placeholder={"Inset here your message..."}
                              style={errorBody.trim().length !== 0 ? {
                                  border: "1px solid red",
                                  resize: 'none'
                              } : {resize: 'none'}}/>
                    <p>{message.body.length}/500</p>
                </div>
                <div>
                    <input type={"submit"} onClick={onSubmitHandler}/>
                </div>
            </form>
        </div>
    )
}

export default HomePage