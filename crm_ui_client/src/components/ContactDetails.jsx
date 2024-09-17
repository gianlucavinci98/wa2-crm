import {useEffect, useState} from "react";
import ContactAPI from "../api/crm/ContactAPI.js";
import {useNavigate, useParams} from "react-router-dom";
import {FaArrowLeft} from "react-icons/fa";
import {TbUserEdit} from "react-icons/tb";
import {LuTrash2} from "react-icons/lu";

function ContactDetails({currentUser}) {
    const {contactId} = useParams();
    const navigate = useNavigate();
    const [contactDetails, setContactDetails] = useState(null);
    const [load, setLoad] = useState(false);

    useEffect(() => {
        if (!load) {
            ContactAPI.GetContactById(contactId).then((res) => {
                setContactDetails(res)
                setLoad(true)
            }).catch((err) => console.log(err));
        }
    }, [contactId, load])

    return (
        <div className="w-full flex flex-1 flex-col items-center p-6">
            <div className="w-full flex flex-row justify-center">
                <div className="flex flex-row justify-start">
                    <FaArrowLeft size={20} onClick={() => navigate("/ui/Contacts")}/>
                </div>
                <div className="flex flex-1 flex-row justify-center">
                    <h1 className="font-bold text-2xl">Contact Details</h1>
                </div>
                <div className="flex flex-row justify-end">
                    <TbUserEdit size={20} onClick={() => navigate(`/ui/Contacts/${contactId}/edit`)}/>
                </div>
            </div>
            {
                load
                    ?
                    <div className="w-full flex flex-1 flex-row justify-center">
                        <div className="w-5"></div>
                        <div className="w-full flex flex-1 flex-col items-start border p-6 m-2 gap-2">
                            <div className="flex flex-row">
                                <label>Name: </label>
                                <div className="">{contactDetails.name}</div>
                            </div>
                            <div className="flex flex-row">
                                <label>Surname: </label>
                                <div className="">{contactDetails.surname}</div>
                            </div>
                            <div className="flex flex-row">
                                <label>SSN: </label>
                                <div className="">{contactDetails.ssn}</div>
                            </div>
                            <div className="flex flex-row">
                                <label>Category: </label>
                                <div className="">{contactDetails.category}</div>
                            </div>
                            <div className="flex flex-row">
                                <label>Addresses: </label>
                                {
                                    contactDetails.addresses.length !== 0
                                        ?
                                        <div className="flex flex-col gap-2 border p-3 rounded-lg">
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
                            <div className="flex flex-row">
                                <label>Emails: </label>
                                {
                                    contactDetails.emails.length !== 0
                                        ?
                                        <div className="flex flex-col gap-2 border p-3 rounded-lg">
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
                            <div className="flex flex-row">
                                <label>Telephones: </label>
                                {
                                    contactDetails.telephones.length !== 0
                                        ?
                                        <div className="flex flex-col gap-2 border p-3 rounded-lg">
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
                                    <div className="flex flex-row">
                                        <label>This contact is associated to a Professional profile: </label>
                                        <button className="border-b-blue-400 bg-blue-200 rounded-lg p-2 h-1/2"
                                                onClick={() => navigate(`/ui/Professional/${contactDetails.professionalId}`)}>
                                            Go to professional profile
                                        </button>
                                    </div>
                            }
                            {
                                contactDetails.customerId === null
                                    ?
                                    <div></div>
                                    :
                                    <div className="w-full flex flex-row items-center">
                                        <label>This contact is associated to a Customer profile: </label>
                                        <button className="border-b-blue-400 bg-blue-200 rounded-lg p-2 h-1/2"
                                                onClick={() => navigate(`/ui/Customers/${contactDetails.customerId}`)}>
                                            Go to customer profile
                                        </button>
                                    </div>
                            }
                            <button onClick={() => {
                                ContactAPI.DeleteContact(contactDetails.contactId, currentUser.xsrfToken).then(() => {
                                    alert("Correctly removed contact")
                                    navigate("/ui/Contacts")
                                }).catch((err) => {
                                    console.log(err);
                                    alert("Error during contact cancellation. Maybe the contact is associated to a Customer or Professional profile. Delete it fist.")
                                })
                            }}><LuTrash2 size={20}/></button>
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