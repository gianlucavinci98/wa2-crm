import {useEffect, useState} from "react";
import ContactAPI from "../api/crm/ContactAPI.js";
import {useNavigate, useParams} from "react-router-dom";
import {FaArrowLeft} from "react-icons/fa";
import {TbUserEdit} from "react-icons/tb";
import {LuTrash2} from "react-icons/lu";
import CustomerAPI from "../api/crm/CustomerAPI.js";
import {IoIosArrowDown, IoIosArrowUp} from "react-icons/io";

function AddNoteDialog({customerId, currentUser, onClose, setLoad}) {
    const [note, setNote] = useState("")

    const handleSubmit = (event) => {
        event.preventDefault()

        CustomerAPI.InsertNewNoteToCustomer(customerId, note, currentUser.xsrfToken).then((res) => {
                console.log(res)
                setLoad(false)
                onClose()
            }
        ).catch((err) => console.log(err))
    }

    return (
        <div className="overlay">
            <div className="dialog flex flex-col items-center">
                <h2 className="message-details-header-subject" style={{paddingBottom: '10px'}}>
                    Add new note
                </h2>
                <div className="w-full flex flex-col items-center">
                    <form onSubmit={handleSubmit}>
                        <textarea
                            name="note"
                            value={note}
                            onChange={(event) => setNote(event.target.value)}
                            placeholder="Enter a new note"
                        />
                        <div className="w-full flex flex-row items-center justify-around">
                            <button className="border bg-green-300 p-2 rounded-lg" type={"submit"}
                                    onClick={handleSubmit}>Submit
                            </button>
                            <button className="border bg-red-300 p-2 rounded-lg" onClick={onClose}>Cancel</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

function CustomerDetails({currentUser, customerId}) {
    const [customer, setCustomer] = useState(null)
    const [load, setLoad] = useState(false)
    const [showDialog, setShowDialog] = useState(false)

    useEffect(() => {
        if (!load && customerId) {
            CustomerAPI.GetCustomerById(customerId).then((res) => {
                setCustomer(res)
                setLoad(true)
            }).catch((err) => console.log(err))
        }
    }, [load, customerId])

    const handleOpenDialog = () => {
        setShowDialog(true);
    };

    const handleCloseDialog = () => {
        setShowDialog(false);
    };

    return (
        <>
            {
                load
                    ?
                    <div className="flex flex-col items-start border rounded-lg p-5">
                        <label>Customer notes:</label>
                        {
                            customer.notes.length !== 0
                                ?
                                <div className="flex flex-col items-start p-3 gap-3">
                                    {
                                        customer.notes.map((note, i) => (
                                            <div key={i} className="text-clip break-all overflow-wrap max-w-full">{`- ${note}`}</div>
                                        ))
                                    }
                                </div>
                                :
                                <div>No notes for this customer profile</div>
                        }
                        <button className="border p-2 rounded-lg" onClick={handleOpenDialog}>Add Note</button>
                        {showDialog &&
                            <AddNoteDialog customerId={customerId} currentUser={currentUser} onClose={handleCloseDialog}
                                           setLoad={setLoad}/>}
                    </div>
                    :
                    <></>
            }
        </>
    )
}

function ContactDetails({currentUser}) {
    const {contactId} = useParams();
    const navigate = useNavigate();
    const [contactDetails, setContactDetails] = useState(null);
    const [load, setLoad] = useState(false);
    const [showCustomerDetails, setShowCustomerDetails] = useState(false);
    const [showProfessionalDetails, setShowProfessionalDetails] = useState(false);

    useEffect(() => {
        if (!load) {
            ContactAPI.GetContactById(contactId).then((res) => {
                setContactDetails(res)
                setLoad(true)
            }).catch((err) => console.log(err));
        }
    }, [contactId, load])

    return (
        <div className="w-full flex flex-1 flex-col items-center p-6 overflow-y-auto">
            <div className="w-full flex flex-row justify-center items-start">
                <div className="flex flex-row justify-start">
                    <button onClick={() => navigate("/ui/Contacts")}>
                        <FaArrowLeft size={20}/>
                    </button>
                </div>
                <div className="flex flex-1 flex-row justify-center">
                    <h1 className="font-bold text-2xl">Contact Details</h1>
                </div>
                <div className="flex flex-row p-2">
                    <button className="bg-yellow-300 border rounded-lg p-2"
                            onClick={() => navigate(`/ui/Contacts/${contactId}/edit`)}>
                        <TbUserEdit size={20}/>
                    </button>
                </div>
                <div className="flex flex-row p-2">
                    <button className="bg-red-300 border rounded-lg p-2" onClick={() => {
                        ContactAPI.DeleteContact(contactDetails.contactId, currentUser.xsrfToken).then(() => {
                            alert("Correctly removed contact")
                            navigate("/ui/Contacts")
                        }).catch((err) => {
                            console.log(err);
                            alert("Error during contact cancellation. Maybe the contact is associated to a Customer or Professional profile. Delete it fist.")
                        })
                    }}><LuTrash2 size={20}/></button>
                </div>
            </div>
            {
                load
                    ?
                    <div className="w-full flex flex-1 flex-row justify-center">
                        <div className="w-5"></div>
                        <div className="w-full flex flex-1 flex-col items-start border p-6 m-2 gap-2">
                            <div className="w-full flex flex-row">
                                <label className="flex-1">Name: </label>
                                <div className="flex-1">{contactDetails.name}</div>
                            </div>
                            <div className="w-full flex flex-row">
                                <label className="flex-1">Surname: </label>
                                <div className="flex-1">{contactDetails.surname}</div>
                            </div>
                            <div className="w-full flex flex-row">
                                <label className="flex-1">SSN: </label>
                                <div className="flex-1">{contactDetails.ssn}</div>
                            </div>
                            <div className="w-full flex flex-row">
                                <label className="flex-1">Category: </label>
                                <div className="flex-1">{contactDetails.category}</div>
                            </div>
                            <div className="w-full flex flex-row">
                                <label>Addresses: </label>
                                {
                                    contactDetails.addresses.length !== 0
                                        ?
                                        <div className=" flex flex-col gap-2 border p-3 rounded-lg">
                                            {
                                                contactDetails.addresses.map((e) => (
                                                    <div key={e.addressId} className="">{`- ${e.address}`}</div>
                                                ))
                                            }
                                        </div>
                                        :
                                        <div>No addresses for this contact</div>
                                }
                            </div>
                            <div className="w-full flex flex-row">
                                <label>Emails: </label>
                                {
                                    contactDetails.emails.length !== 0
                                        ?
                                        <div className=" flex flex-col gap-2 border p-3 rounded-lg">
                                            {
                                                contactDetails.emails.map((e) => (
                                                    <div key={e.emailId} className="">{`- ${e.emailAddress}`}</div>
                                                ))
                                            }
                                        </div>
                                        :
                                        <div>No emails for this contact</div>
                                }
                            </div>
                            <div className="w-full flex flex-row">
                                <label>Telephones: </label>
                                {
                                    contactDetails.telephones.length !== 0
                                        ?
                                        <div className=" flex flex-col gap-2 border p-3 rounded-lg">
                                            {
                                                contactDetails.telephones.map((e) => (
                                                    <div key={e.telephoneId}
                                                         className="">{`- ${e.telephoneNumber}`}</div>
                                                ))
                                            }
                                        </div>
                                        :
                                        <div>No telephone numbers for this contact</div>
                                }
                            </div>
                            {
                                contactDetails.professionalId === null
                                    ?
                                    <div></div>
                                    :
                                    <div className="w-full flex flex-col gap-2">
                                        <div className="w-full flex flex-row">
                                            <label className="flex-1">This contact is associated to a Professional
                                                profile</label>
                                            <button
                                                className="w-full border-b-blue-400 bg-blue-200 rounded-lg p-2 h-1/2">
                                                {
                                                    showCustomerDetails
                                                        ?
                                                        <IoIosArrowDown size={20}
                                                                        onClick={() => setShowProfessionalDetails(!showProfessionalDetails)}/>
                                                        :
                                                        <IoIosArrowUp size={20}
                                                                      onClick={() => setShowProfessionalDetails(!showProfessionalDetails)}/>
                                                }
                                            </button>
                                        </div>
                                        {
                                            showCustomerDetails && (
                                                <div>ciao</div>
                                            )
                                        }
                                    </div>
                            }
                            {
                                contactDetails.customerId === null
                                    ?
                                    <div></div>
                                    :
                                    <div className="w-full flex flex-col gap-2">
                                        <div className="w-full flex flex-row">
                                            <label>This contact is associated to a Customer profile</label>
                                            <button
                                                className="border-b-blue-400 bg-blue-200 rounded-lg p-2 h-1/2">
                                                {
                                                    showCustomerDetails
                                                        ?
                                                        <IoIosArrowDown size={20}
                                                                        onClick={() => setShowCustomerDetails(!showCustomerDetails)}/>
                                                        :
                                                        <IoIosArrowUp size={20}
                                                                      onClick={() => setShowCustomerDetails(!showCustomerDetails)}/>
                                                }
                                            </button>
                                        </div>
                                        {
                                            showCustomerDetails && (
                                                <CustomerDetails currentUser={currentUser}
                                                                 customerId={contactDetails.customerId}/>
                                            )
                                        }
                                    </div>
                            }
                        </div>
                        <div className="w-5"></div>
                    </div>
                    :
                    <></>
            }

        </div>
    )
}

export default ContactDetails