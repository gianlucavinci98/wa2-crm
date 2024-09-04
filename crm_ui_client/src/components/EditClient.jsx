import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Customer} from "../api/crm/dto/Customer.ts";
import CustomerAPI from "../api/crm/CustomerAPI";
import ContactAPI from "../api/crm/ContactAPI.js";

function ClientDetails({ customer }) {
    const [contactDetails, setContactDetails] = useState(null);
    const [newNote, setNewNote] = useState("");
    const [newContact, setNewContact] = useState({
        name: "",
        surname: "",
        ssn: "",
        addresses: [],
        emails: [],
        telephones: []
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
            let contact;
            if (!customer) {
                contact = await ContactAPI.InsertNewContact(newContact);
                await CustomerAPI.InsertNewCustomer(contact.contactId);
                alert("New customer and contact created successfully!");
            } else {
                contact = await ContactAPI.UpdateContact(contactDetails);
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
                const updatedCustomer = await CustomerAPI.InsertNewNoteToCustomer(customer.customerId, newNote);
                alert("Note added successfully!");
                setNewNote("");
            }
        } catch (e) {
            setError("Failed to add note");
            console.error(e);
        }
    };

    const handleAddAddress = async (address) => {
        try {
            const newAddress = await ContactAPI.InsertNewAddressToContact(contactDetails.contactId, address);
            setContactDetails((prev) => ({ ...prev, addresses: [...prev.addresses, newAddress] }));
        } catch (e) {
            setError("Failed to add address");
            console.error(e);
        }
    };

    const handleAddEmail = async (email) => {
        try {
            const newEmail = await ContactAPI.InsertNewEmailToContact(contactDetails.contactId, email);
            setContactDetails((prev) => ({ ...prev, emails: [...prev.emails, newEmail] }));
        } catch (e) {
            setError("Failed to add email");
            console.error(e);
        }
    };

    const handleAddTelephone = async (telephone) => {
        try {
            const newTelephone = await ContactAPI.InsertNewTelephoneToContact(contactDetails.contactId, telephone);
            setContactDetails((prev) => ({ ...prev, telephones: [...prev.telephones, newTelephone] }));
        } catch (e) {
            setError("Failed to add telephone");
            console.error(e);
        }
    };

    const handleUpdateAddress = async (addressId, address) => {
        try {
            const updatedAddress = await ContactAPI.UpdateAddressOfContact(contactDetails.contactId, addressId, address);
            setContactDetails((prev) => ({
                ...prev,
                addresses: prev.addresses.map((addr) => (addr.addressId === addressId ? updatedAddress : addr))
            }));
        } catch (e) {
            setError("Failed to update address");
            console.error(e);
        }
    };

    const handleUpdateEmail = async (emailId, email) => {
        try {
            const updatedEmail = await ContactAPI.UpdateEmailOfContact(contactDetails.contactId, emailId, email);
            setContactDetails((prev) => ({
                ...prev,
                emails: prev.emails.map((em) => (em.emailId === emailId ? updatedEmail : em))
            }));
        } catch (e) {
            setError("Failed to update email");
            console.error(e);
        }
    };

    const handleUpdateTelephone = async (telephoneId, telephone) => {
        try {
            const updatedTelephone = await ContactAPI.UpdateTelephoneOfContact(contactDetails.contactId, telephoneId, telephone);
            setContactDetails((prev) => ({
                ...prev,
                telephones: prev.telephones.map((tel) => (tel.telephoneId === telephoneId ? updatedTelephone : tel))
            }));
        } catch (e) {
            setError("Failed to update telephone");
            console.error(e);
        }
    };

    const handleDeleteAddress = async (addressId) => {
        try {
            await ContactAPI.DeleteAddressFromContact(contactDetails.contactId, addressId);
            setContactDetails((prev) => ({
                ...prev,
                addresses: prev.addresses.filter((addr) => addr.addressId !== addressId)
            }));
        } catch (e) {
            setError("Failed to delete address");
            console.error(e);
        }
    };

    const handleDeleteEmail = async (emailId) => {
        try {
            await ContactAPI.DeleteEmailFromContact(contactDetails.contactId, emailId);
            setContactDetails((prev) => ({
                ...prev,
                emails: prev.emails.filter((em) => em.emailId !== emailId)
            }));
        } catch (e) {
            setError("Failed to delete email");
            console.error(e);
        }
    };

    const handleDeleteTelephone = async (telephoneId) => {
        try {
            await ContactAPI.DeleteTelephoneFromContact(contactDetails.contactId, telephoneId);
            setContactDetails((prev) => ({
                ...prev,
                telephones: prev.telephones.filter((tel) => tel.telephoneId !== telephoneId)
            }));
        } catch (e) {
            setError("Failed to delete telephone");
            console.error(e);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div>
            <h2>{customer ? "Edit Customer" : "New Customer"}</h2>

            <div>
                <strong>Name:</strong>
                <input
                    type="text"
                    value={customer ? contactDetails?.name : newContact.name}
                    onChange={(e) => {
                        const value = e.target.value;
                        customer ? setContactDetails({ ...contactDetails, name: value }) : setNewContact({ ...newContact, name: value });
                    }}
                />
            </div>

            <div>
                <strong>Surname:</strong>
                <input
                    type="text"
                    value={customer ? contactDetails?.surname : newContact.surname}
                    onChange={(e) => {
                        const value = e.target.value;
                        customer ? setContactDetails({ ...contactDetails, surname: value }) : setNewContact({ ...newContact, surname: value });
                    }}
                />
            </div>
            <div>
                <strong>SSN:</strong>
                <input
                    type="text"
                    value={customer ? contactDetails?.ssn : newContact.ssn}
                    onChange={(e) => {
                        const value = e.target.value;
                        customer ? setContactDetails({ ...contactDetails, ssn: value }) : setNewContact({ ...newContact, ssn: value });
                    }}
                />
            </div>

            {/* Ripeti per gli altri campi:  indirizzi, email, telefono */}

            <div>
                <button onClick={handleSaveContact}>{customer ? "Save Changes" : "Create Customer"}</button>
            </div>

            {customer && (
                <>
                    <h3>Add a new note:</h3>
                    <textarea
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                        placeholder="Enter a new note"
                    />
                    <button onClick={handleAddNote}>Add Note</button>
                </>
            )}

            {/* Aggiungi sezioni per gestire l'aggiunta, modifica e cancellazione di indirizzi, email, e numeri di telefono */}
        </div>
    );
}

ClientDetails.propTypes = {
    customer: PropTypes.instanceOf(Customer)
};

export default ClientDetails;
