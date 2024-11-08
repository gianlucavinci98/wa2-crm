import {useState} from "react"
import {Channel, Message} from "../api/crm/dto/Message.ts"
import MessageAPI from "../api/crm/MessageAPI.js"
import "./HomePage.css"
import {TopBar} from "./Skeleton.jsx";

function HomePage({currentUser}) {
    const [message, setMessage] = useState(new Message(null, "", "", "", null, "", Channel.Email, 0));
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [serverResponse, setServerResponse] = useState("");

    const validate = () => {
        const errors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(message.sender)) {
            errors.sender = "Invalid email address";
        }
        if (message.subject.trim().length === 0) {
            errors.subject = "Subject is required";
        }
        if (message.body.trim().length === 0) {
            errors.body = "Message body is required";
        }

        return errors;
    };

    const onSubmitHandler = async (event) => {
        event.preventDefault();

        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await MessageAPI.InsertNewMessage(message);
            setServerResponse("Message sent successfully!");
            console.log(response);
        } catch (error) {
            setServerResponse("Error sending message. Please try again.");
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const onChangeHandler = (event) => {
        const {name, value} = event.target;

        setMessage((prevMessage) => ({
            ...prevMessage,
            [name]: value,
        }));

        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: "",
        }));
    };

    return (
        <>
            <TopBar currentUser={currentUser}/>
            <div className="w-[90%] flex-1 flex gap-12 justify-around items-center ">
                <div className={"flex flex-col gap-6 w-1/3 h-1/2"}>
                    <h5 className="text-3xl font-semibold">Contact Our Job Placement Team</h5>
                    <p className="text-2xl text-gray-600">Fill in the form on the right to connect with an operator and
                        start
                        your registration process for our job placement services.</p>

                </div>

                <form onSubmit={onSubmitHandler} className="flex flex-col gap-12 items-center">
                    {serverResponse && (
                        <div className="p-4 bg-blue-100 text-blue-700 rounded w-full text-center">
                            {serverResponse}
                        </div>
                    )}

                    <div className="flex">
                        <label className={errors.sender ? "text-red-500" : ""}>Email:</label>
                        <input
                            type="email"
                            required
                            name="sender"
                            value={message.sender}
                            onChange={onChangeHandler}
                            className={`border p-2 ${errors.sender ? "border-red-500" : ""} input-home`}
                        />
                        {errors.sender && <p className="text-red-500">{errors.sender}</p>}
                    </div>

                    <div className="flex">
                        <label className={errors.subject ? "text-red-500" : ""}>Subject:</label>
                        <input
                            type="text"
                            required
                            name="subject"
                            value={message.subject}
                            onChange={onChangeHandler}
                            className={`border p-2 ${errors.subject ? "border-red-500" : ""} input-home`}
                        />
                        {errors.subject && <p className="text-red-500">{errors.subject}</p>}
                    </div>

                    <div className="flex">
                        <div className={"flex flex-col justify-between"}>
                            <label className={errors.body ? "text-red-500" : ""}>Message:</label>
                            <p>{message.body.length}/500</p>
                        </div>
                        <textarea
                            required
                            name="body"
                            value={message.body}
                            onChange={onChangeHandler}
                            maxLength={500}
                            rows={10}
                            cols={50}
                            placeholder="Insert your message here..."
                            className={`border p-2 resize-none ${errors.body ? "border-red-500" : ""} textarea-home`}
                        />
                        {errors.body && <p className="text-red-500">{errors.body}</p>}
                    </div>

                    <button type="submit" className="page-button w-60" disabled={isSubmitting}>
                        {isSubmitting ? "Sending..." : "Send message"}
                    </button>
                </form>
            </div>
        </>
    );
}

export default HomePage
