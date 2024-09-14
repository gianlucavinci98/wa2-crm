import {useState, useEffect} from "react";
import PropTypes from "prop-types";
import {Customer} from "../api/crm/dto/Customer.ts";
import CustomerAPI from "../api/crm/CustomerAPI";
import ContactAPI from "../api/crm/ContactAPI.js";
import {Category, Contact} from "../api/crm/dto/Contact.ts";
import Icon from "./Icon.jsx";

function ClientDetails({customer}) {
    const [contactDetails, setContactDetails] = useState(null);
    const [newNote, setNewNote] = useState("");
    const [newContact, setNewContact] = useState({
        name: "",
        surname: "",
        ssn: "",
        category: Category.Customer,
        addresses: [],
        emails: [],
        telephones: []
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    async function confrontaCampi(arr1, set2, key, value, funzioneA, funzioneB, funzioneC) {
        const set1Ids = new Set(arr1.map(item => item[key])); // ID degli oggetti del primo oggetto (Array)
        const arr2 = Array.from(set2); // array dal secondo oggetto
        const set2Ids = new Set([...set2].map(item => item[key])); // ID degli oggetti del secondo oggetto (Set)

        // Confronta gli ID
        for (const id of set1Ids) {
            if (set2Ids.has(id)) {
                if (arr2.find((it) => it[key] === id)[value] !== arr1.find((it) => it[key] === id)[value])
                    await funzioneA(contactDetails.id, id, arr2.find((it) => it[key] === id)[value]); // Presente in entrambi
            } else {
                await funzioneC(contactDetails.id, id); // Presente solo nel primo oggetto
            }
        }

        for (const id of set2Ids) {
            if (!set1Ids.has(id)) {
                await funzioneB(contactDetails.id, arr2.find((it) => it[key] === id)[value]); // Presente solo nel secondo oggetto
            }
        }
    }

    useEffect(() => {
        if (customer && customer.contact) {
            fetchContactDetails(customer.contact.contactId);
        } else {
            setLoading(false);
        }
    }, [customer]);

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
            // const details = new ContactDetails(2, 'mario', 'bianchi', 'gf3827r', Category.Professional, new Set([new Address(2n, 'via casa mia')]), new Set([new Email(2, 'mario@gmail.com')]), new Set([new Telephone(2, '2224443331')]))
            // if (details?.addresses) {
            //     setNewContact((prev) => ({...prev, addresses: Array.from(details.addresses)}));
            // }
            // if (details?.emails) {
            //     setNewContact((prev) => ({...prev, emails: Array.from(details.emails)}));
            // }
            // if (details?.telephones) {
            //     setNewContact((prev) => ({...prev, telephones: Array.from(details.telephones)}));
            // }
            // setContactDetails(details);
            setError("Failed to fetch contact details");
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveContact = async () => {
        try {
            console.log(contactDetails)
            console.log(newContact)
            let contact;
            if (!customer) {
                contact = await ContactAPI.InsertNewContact({
                    name: newContact.name,
                    surname: newContact.surname,
                    ssn: newContact.ssn,
                    category: Category.Customer
                });
                await CustomerAPI.InsertNewCustomer(contact.contactId);
                for (const address of newContact.addresses) {
                    await ContactAPI.InsertNewAddressToContact(contact.contactId, address)
                }
                for (const email of newContact.emails) {
                    await ContactAPI.InsertNewEmailToContact(contact.contactId, email)
                }
                for (const telephone of newContact.telephones) {
                    await ContactAPI.InsertNewTelephoneToContact(contact.contactId, telephone)
                }
                alert("New customer and contact created successfully!");
            } else {
                contact = await ContactAPI.UpdateContact(new Contact(contactDetails.contactId, contactDetails.name, contactDetails.surname, contactDetails.ssn, contactDetails.category));
                await confrontaCampi(newContact.addresses, contactDetails.addresses, 'addressId', 'address', () => ContactAPI.UpdateAddressOfContact(), () => ContactAPI.DeleteAddressFromContact(), () => ContactAPI.InsertNewAddressToContact());
                await confrontaCampi(newContact.emails, contactDetails.emails, 'emailId', 'email', () => ContactAPI.UpdateEmailOfContact(), () => ContactAPI.DeleteEmailFromContact(), () => ContactAPI.InsertNewEmailToContact());
                await confrontaCampi(newContact.telephones, contactDetails.telephones, 'telephoneId', 'telephone', () => ContactAPI.UpdateTelephoneOfContact(), () => ContactAPI.DeleteTelephoneFromContact(), () => ContactAPI.InsertNewTelephoneToContact());
                alert("Contact updated successfully!");
            }
            setContactDetails(contact);
        } catch (e) {
            setError("Failed to save contact");
            console.error(e);
        }
    };

    const handleAddNote = async () => {
        try {
            if (newNote && customer.customerId) {
                await CustomerAPI.InsertNewNoteToCustomer(customer.customerId, newNote);
                alert("Note added successfully!");
                setNewNote("");
            }
        } catch (e) {
            setError("Failed to add note");
            console.error(e);
        }
    };

    if (loading) return <h2
        className={"flex-1 flex justify-center text-center items-center text-2xl font-semibold text-blue-500"}>Loading...</h2>;
    if (error) return <h2
        className={"flex-1 flex justify-center text-center items-center text-2xl font-semibold text-red-500"}>{error}</h2>;

    return (
        <div className={"flex-1 p-6 flex items-center w-full justify-around"}>
            <div className={"flex h-full flex-col items-center justify-around"}>
                <h2 className={"text-2xl font-semibold"}>{customer ? "Edit Client" : "Insert new Client"}</h2>
                <div className={"flex w-full justify-around gap-8"}>
                    <div className={"flex flex-col gap-6 justify-around"}>
                        <div className={"col-field"}>
                            <strong>Name:</strong>
                            <input
                                type="text"
                                value={customer ? contactDetails?.name : newContact.name}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    customer ? setContactDetails({
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
                                value={customer ? contactDetails?.surname : newContact.surname}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    customer ? setContactDetails({
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
                                value={customer ? contactDetails?.ssn : newContact.ssn}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    customer ? setContactDetails({
                                        ...contactDetails,
                                        ssn: value
                                    }) : setNewContact({...newContact, ssn: value});
                                }}
                            />
                        </div>
                    </div>
                    <div className={"flex flex-col gap-6 justify-around"}>
                        <strong>Addresses</strong>
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
                                <Icon name={"minus"} className={"w-6 h-6 fill-red-500 cursor-pointer"} onClick={() => {
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
                                    addresses.push({addressId: "NEW" + Math.floor(Math.random() * 600), address: ""});
                                    setNewContact({...newContact, addresses});
                                }
                            }></Icon>
                        </div>

                        {/* Sezione Email */}
                        <strong>Emails</strong>
                        {newContact?.emails?.map((email) => (
                            <div key={email.emailId} className={"flex gap-2 items-center"}>
                                <input
                                    type="email"
                                    value={email.email}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        let emails = newContact.emails.map((em) => (em.emailId === email.emailId ? {
                                            ...em,
                                            email: value
                                        } : em))
                                        setNewContact({...newContact, emails: emails});
                                    }}
                                />
                                <Icon name={"minus"} className={"w-6 h-6 fill-red-800 cursor-pointer"} onClick={() => {
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
                                    emails.push({emailId: "NEW" + Math.floor(Math.random() * 600), email: ""});
                                    setNewContact({...newContact, emails});
                                }
                            }>Add Email
                            </Icon>
                        </div>

                        {/* Sezione Telefono */}
                        <strong>Telephones</strong>
                        {newContact?.telephones?.map((telephone) => (
                            <div key={telephone.telephoneId} className={"flex gap-2 items-center"}>
                                <input
                                    type="tel"
                                    value={telephone.telephone}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        let telephones = newContact.telephones.map((tel) => (tel.telephoneId === telephone.telephoneId ? {
                                            ...tel,
                                            telephone: value
                                        } : tel))
                                        setNewContact({...newContact, telephones: telephones});
                                    }}
                                />
                                <Icon name={"minus"} className={"w-6 h-6 fill-red-800 cursor-pointer"} onClick={() => {
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
                                        telephone: ""
                                    });
                                    setNewContact({...newContact, telephones});
                                }
                            }>Add Telephone
                            </Icon>
                        </div>
                    </div>
                </div>


                <div>
                    <button className={'page-button'}
                            onClick={handleSaveContact}>{customer ? "Save Changes" : "Create Client"}</button>
                </div>
            </div>


            {customer && (
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

            )}

        </div>
    );
}

ClientDetails.propTypes = {
    customer: PropTypes.instanceOf(Customer)
};

export default ClientDetails;
