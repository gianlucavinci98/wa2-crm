import {useEffect, useState} from "react";
import PropTypes from "prop-types";
import {Customer} from "../api/crm/dto/Customer.ts";
/*import CustomerAPI from "../api/crm/CustomerAPI";*/
import ContactAPI from "../api/crm/ContactAPI.js";
import {Category, Contact} from "../api/crm/dto/Contact.ts";
import Icon from "./Icon.jsx";
import {useNavigate, useParams} from "react-router-dom";
import {ContactDetails} from "../api/crm/dto/ContactDetails.ts";

function EditClient({currentUser}) {
    const navigate = useNavigate()
    const {contactId} = useParams();

    const [contactDetails, setContactDetails] = useState(null);
    /*const [newNote, setNewNote] = useState("");*/
    const [newContact, setNewContact] = useState(new ContactDetails(null, "", "", "", Category.Unknown, [], [], [], null, null));
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    async function confrontaCampi(arr1, arr2, key, value, funzioneA, funzioneB, funzioneC) {
        const set1Ids = arr1.map(item => item[key]); // ID degli oggetti del primo oggetto (Array)
        const set2Ids = arr2.map(item => item[key]); // ID degli oggetti del secondo oggetto (Set)

        // Confronta gli ID
        for (const id of set1Ids) {
            if (set2Ids.includes(id)) {
                if (arr2.find((it) => it[key] === id)[value] !== arr1.find((it) => it[key] === id)[value])
                    await funzioneA(contactDetails.contactId, id, arr1.find((it) => it[key] === id)[value], currentUser.xsrfToken); // Presente in entrambi
            } else {
                await funzioneC(contactDetails.contactId, arr1.find((it) => it[key] === id)[value], currentUser.xsrfToken); // Presente solo nel primo oggetto
            }
        }

        for (const id of set2Ids) {
            if (!set1Ids.includes(id)) {
                await funzioneB(contactDetails.contactId, id, currentUser.xsrfToken); // Presente solo nel secondo oggetto
            }
        }
    }

    useEffect(() => {
        if (loading && contactId) {
            fetchContactDetails(contactId);
            setLoading(false)
        } else {
            setLoading(false)
        }
    }, [contactId, loading]);

    const fetchContactDetails = async (contactId) => {
        try {
            const details = await ContactAPI.GetContactById(contactId);

            if (details?.addresses) {
                setNewContact((prev) => ({...prev, addresses: Array.from(details.addresses)}));
            }
            if (details?.emails) {
                setNewContact((prev) => ({...prev, emails: Array.from(details.emails)}));
            }
            if (details?.telephones) {
                setNewContact((prev) => ({...prev, telephones: Array.from(details.telephones)}));
            }
            setContactDetails(details);
        } catch (e) {
            setError("Failed to fetch contact details");
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveContact = async () => {
        try {
            if (!contactDetails) {
                ContactAPI.InsertNewContact(new Contact(null, newContact.name, newContact.surname, newContact.ssn, Category.Unknown), currentUser.xsrfToken)
                    .then(async (res) => {
                            console.log(res)

                            for (const address of newContact.addresses) {
                                await ContactAPI.InsertNewAddressToContact(res.contactId, address.address, currentUser.xsrfToken)
                            }
                            for (const email of newContact.emails) {
                                await ContactAPI.InsertNewEmailToContact(res.contactId, email.emailAddress, currentUser.xsrfToken)
                            }
                            for (const telephone of newContact.telephones) {
                                await ContactAPI.InsertNewTelephoneToContact(res.contactId, telephone.telephoneNumber, currentUser.xsrfToken)
                            }
                        }
                    ).catch((err) => console.log(err));

                alert("New customer and contact created successfully!");
                navigate(`/ui/Contacts`)
            } else {
                ContactAPI.UpdateContact(new Contact(contactDetails.contactId, contactDetails.name, contactDetails.surname, contactDetails.ssn, contactDetails.category), currentUser.xsrfToken)
                    .then(async (res) => {
                        console.log(res);

                        await confrontaCampi(newContact.addresses, contactDetails.addresses, 'addressId', 'address', ContactAPI.UpdateAddressOfContact, ContactAPI.DeleteAddressFromContact, ContactAPI.InsertNewAddressToContact);
                        await confrontaCampi(newContact.emails, contactDetails.emails, 'emailId', 'emailAddress', ContactAPI.UpdateEmailOfContact, ContactAPI.DeleteEmailFromContact, ContactAPI.InsertNewEmailToContact);
                        await confrontaCampi(newContact.telephones, contactDetails.telephones, 'telephoneId', 'telephoneNumber', ContactAPI.UpdateTelephoneOfContact, ContactAPI.DeleteTelephoneFromContact, ContactAPI.InsertNewTelephoneToContact);
                    }).catch((err) => console.log(err));

                alert("Contact updated successfully!");
                navigate(`/ui/Contacts/${contactId}`)
            }
        } catch (e) {
            setError("Failed to save contact");
            console.error(e);
        }
    };

    /*const handleAddNote = async () => {
        try {
            if (newNote && customer.customerId) {
                await CustomerAPI.InsertNewNoteToCustomer(customer.customerId, newNote, currentUser.xsrfToken);
                alert("Note added successfully!");
                setNewNote("");
            }
        } catch (e) {
            setError("Failed to add note");
            console.error(e);
        }
    };*/

    if (loading) return <h2
        className={"flex-1 flex justify-center text-center items-center text-2xl font-semibold text-blue-500"}>Loading...</h2>;
    if (error) return <h2
        className={"flex-1 flex justify-center text-center items-center text-2xl font-semibold text-red-500"}>{error}</h2>;

    return (
        <div className={"flex-1 p-6 flex items-center w-full justify-around"}>
            <div className={"flex h-full flex-col items-center justify-around"}>
                <h2 className={"text-2xl font-semibold"}>{contactDetails ? "Edit Contact" : "Insert new Contact"}</h2>
                <div className={"flex w-full justify-around gap-8"}>
                    <div className={"flex flex-col gap-6 justify-around"}>
                        <div className={"col-field"}>
                            <strong>Name:</strong>
                            <input
                                type="text"
                                value={contactDetails ? contactDetails.name : newContact.name}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    contactDetails ? setContactDetails({
                                        ...contactDetails,
                                        name: value
                                    }) : setNewContact({...newContact, name: value});
                                }}
                            />
                        </div>

                        <div className={"col-field"}>
                            <strong>Surname:</strong>
                            <input
                                type="text"
                                value={contactDetails ? contactDetails?.surname : newContact.surname}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    contactDetails ? setContactDetails({
                                        ...contactDetails,
                                        surname: value
                                    }) : setNewContact({...newContact, surname: value});
                                }}
                            />
                        </div>
                        <div className={"col-field"}>
                            <strong>SSN:</strong>
                            <input
                                type="text"
                                value={contactDetails ? contactDetails?.ssn : newContact.ssn}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    contactDetails ? setContactDetails({
                                        ...contactDetails,
                                        ssn: value
                                    }) : setNewContact({...newContact, ssn: value});
                                }}
                            />
                        </div>
                    </div>
                    <div className={"flex flex-col gap-6 justify-around"}>
                        <div className={"col-field"}>
                            <strong>Addresses:</strong>
                            <div className={"flex flex-col gap-2"}>
                                {newContact?.addresses?.map((address) => (
                                    <div key={address.addressId} className={"flex gap-2 items-center"}>
                                        <input
                                            type="text"
                                            value={address.address}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                let addresses = newContact.addresses.map((add) => (add.addressId === address.addressId ? {
                                                    ...add,
                                                    address: value
                                                } : add))
                                                setNewContact({...newContact, addresses});
                                            }}
                                        />
                                        <Icon name={"minus"} className={"w-6 h-6 fill-red-500 cursor-pointer"}
                                              onClick={() => {
                                                  setNewContact((prev) => ({
                                                      ...prev,
                                                      addresses: prev.addresses.filter((addr) => addr.addressId !== address.addressId)
                                                  }))
                                              }
                                              }></Icon>
                                    </div>
                                ))}
                                <div>
                                    <Icon name={"plus"} className={"w-6 h-6 fill-blue-800 cursor-pointer"} onClick={
                                        () => {
                                            let addresses = newContact.addresses
                                            addresses.push({
                                                addressId: "NEW" + Math.floor(Math.random() * 600),
                                                address: ""
                                            });
                                            setNewContact({...newContact, addresses});
                                        }
                                    }></Icon>
                                </div>
                            </div>
                        </div>
                        {/* Sezione Email */}
                        <div className={"col-field"}>
                            <strong>Emails</strong>
                            <div className={"flex flex-col gap-2"}>
                                {newContact?.emails?.map((email) => (
                                    <div key={email.emailId} className={"flex gap-2 items-center"}>
                                        <input
                                            type="email"
                                            value={email.emailAddress}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                let emails = newContact.emails.map((em) => (em.emailId === email.emailId ? {
                                                    ...em,
                                                    emailAddress: value
                                                } : em))
                                                setNewContact({...newContact, emails: emails});
                                            }}
                                        />
                                        <Icon name={"minus"} className={"w-6 h-6 fill-red-800 cursor-pointer"}
                                              onClick={() => {
                                                  setNewContact((prev) => ({
                                                      ...prev,
                                                      emails: prev.emails.filter((em) => em.emailId !== email.emailId)
                                                  }))
                                              }
                                              }>Delete
                                        </Icon>
                                    </div>
                                ))}
                                <div>
                                    <Icon name={"plus"} className={"w-6 h-6 fill-blue-800 cursor-pointer"} onClick={
                                        () => {
                                            let emails = newContact.emails
                                            emails.push({
                                                emailId: "NEW" + Math.floor(Math.random() * 600),
                                                emailAddress: ""
                                            });
                                            setNewContact({...newContact, emails});
                                        }
                                    }>Add Email
                                    </Icon>
                                </div>
                            </div>
                        </div>
                        {/* Sezione Telefono */}
                        <div className={"col-field"}>
                            <strong>Telephones</strong>
                            <div className={"flex flex-col gap-2"}>
                                {newContact?.telephones?.map((telephone) => (
                                    <div key={telephone.telephoneId} className={"flex gap-2 items-center"}>
                                        <input
                                            type="tel"
                                            value={telephone.telephoneNumber}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                let telephones = newContact.telephones.map((tel) => (tel.telephoneId === telephone.telephoneId ? {
                                                    ...tel,
                                                    telephoneNumber: value
                                                } : tel))
                                                setNewContact({...newContact, telephones: telephones});
                                            }}
                                        />
                                        <Icon name={"minus"} className={"w-6 h-6 fill-red-800 cursor-pointer"}
                                              onClick={() => {
                                                  setNewContact((prev) => ({
                                                      ...prev,
                                                      telephones: prev.telephones.filter((tel) => tel.telephoneId !== telephone.telephoneId)
                                                  }))
                                              }
                                              }>Delete
                                        </Icon>
                                    </div>
                                ))}
                                <div>
                                    <Icon name={"plus"} className={"w-6 h-6 fill-blue-800 cursor-pointer"} onClick={
                                        () => {
                                            let telephones = newContact.telephones
                                            telephones.push({
                                                telephoneId: "NEW" + Math.floor(Math.random() * 600),
                                                telephoneNumber: ""
                                            });
                                            setNewContact({...newContact, telephones});
                                        }
                                    }>Add Telephone
                                    </Icon>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex flex-row justify-around">
                    <button className={'page-button'}
                            onClick={handleSaveContact}>{contactDetails ? "Save Changes" : "Create"}</button>
                    <button className={'page-button'}
                            onClick={contactDetails ? () => navigate(`/ui/Contacts/${contactId}`) : () => navigate(`/ui/Contacts`)}>Cancel
                    </button>
                </div>
            </div>
            {/*{
                contactDetails && (
                    <>
                        <div className={"h-[90%] w-[1px] bg-stone-800"}></div>
                        <div className={"flex h-full flex-col items-center justify-around"}>
                            <h3 className={"text-2xl font-semibold"}>Add a new note:</h3>
                            <textarea
                                value={newNote}
                                onChange={(e) => setNewNote(e.target.value)}
                                placeholder="Enter a new note"
                            />
                            <button className={"page-button"} onClick={handleAddNote}>Add Note</button>
                        </div>
                    </>

                )
            }*/}
        </div>
    );
}

EditClient.propTypes = {
    customer: PropTypes.instanceOf(Customer)
};

export default EditClient;
