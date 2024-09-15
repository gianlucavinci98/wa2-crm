import {useEffect, useState} from "react";
import {Category, Contact} from "../api/crm/dto/Contact.ts";
import ContactAPI from "../api/crm/ContactAPI.js";
import Icon from "./Icon.jsx";
import PropTypes from "prop-types";
import {EmploymentState, Professional} from "../api/crm/dto/Professional.ts";
import ProfessionalAPI from "../api/crm/ProfessionalAPI.js";
import {ContactDetails} from "../api/crm/dto/ContactDetails.ts";
import {Address} from "../api/crm/dto/Address.ts";
import {Email} from "../api/crm/dto/Email.ts";
import {Telephone} from "../api/crm/dto/Telephone.ts";

function EditProfessional({professional, setProfessional}) {
    const [contactDetails, setContactDetails] = useState(null);
    const [skills, setSkills] = useState(null);
    const [newContact, setNewContact] = useState({
        name: "",
        surname: "",
        ssn: "",
        dailyRate:"",
        skills: "",
        location:"",
        employmentState:"",
        category: Category.Professional,
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
        if (professional && professional.contact) {
            fetchContactDetails(professional.contact.contactId);
            setSkills(Array.from(professional.skills).length>1? Array.from(professional.skills).concat(',') : Array.from(professional.skills)[0])
        } else {
            setLoading(false);
        }
    }, [professional]);

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
            const details = new ContactDetails(2, 'mario', 'bianchi', 'gf3827r', Category.Professional, new Set([new Address(2n, 'via casa mia')]), new Set([new Email(2, 'mario@gmail.com')]), new Set([new Telephone(2, '2224443331')]))
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
            // setError("Failed to fetch contact details");
            // console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveContact = async () => {
        try {
            console.log(contactDetails)
            console.log(newContact)
            let contact;
            if (!professional) {
                contact = await ContactAPI.InsertNewContact({
                    name: newContact.name,
                    surname: newContact.surname,
                    ssn: newContact.ssn,
                    category: Category.Professional
                });
                await ProfessionalAPI.InsertNewProfessional(contact.contactId,new Professional(null,newContact.skills.split(','),null,newContact.dailyRate, newContact.location, null, null));
                for (const address of newContact.addresses) {
                    await ContactAPI.InsertNewAddressToContact(contact.contactId, address)
                }
                for (const email of newContact.emails) {
                    await ContactAPI.InsertNewEmailToContact(contact.contactId, email)
                }
                for (const telephone of newContact.telephones) {
                    await ContactAPI.InsertNewTelephoneToContact(contact.contactId, telephone)
                }
                alert("New professional and contact created successfully!");
            } else {
                console.log({...professional, skills: new Set(skills.split(','))})
                console.log(professional)
                console.log(contactDetails)
                contact = await ContactAPI.UpdateContact(new Contact(contactDetails.contactId, contactDetails.name, contactDetails.surname, contactDetails.ssn, contactDetails.category));
                contact = await ProfessionalAPI.UpdateProfessional({...professional, skills: new Set(skills.split(','))});
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

    if (loading) return <h2
        className={"flex-1 flex justify-center text-center items-center text-2xl font-semibold text-blue-500"}>Loading...</h2>;
    if (error) return <h2
        className={"flex-1 flex justify-center text-center items-center text-2xl font-semibold text-red-500"}>{error}</h2>;

    return (
        <div className={"flex-1 p-6 flex items-center w-full justify-around"}>
            <div className={"flex h-full flex-col items-center justify-around"}>
                <h2 className={"text-2xl font-semibold"}>{professional ? "Edit Professional" : "Insert new Professional"}</h2>
                <div className={"flex w-full justify-around gap-8"}>
                    <div className={"flex flex-col gap-6 justify-around"}>
                        <div className={"col-field"}>
                            <strong>Name:</strong>
                            <input
                                type="text"
                                value={professional ? contactDetails?.name : newContact.name}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    professional ? setContactDetails({
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
                                value={professional ? contactDetails?.surname : newContact.surname}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    professional ? setContactDetails({
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
                                value={professional ? contactDetails?.ssn : newContact.ssn}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    professional ? setContactDetails({
                                        ...contactDetails,
                                        ssn: value
                                    }) : setNewContact({...newContact, ssn: value});
                                }}
                            />
                        </div>
                        <div className={"col-field"}>
                            <strong>Skills:</strong>
                            <input
                                type="text"
                                placeholder={"Skill separated by \",\""}
                                value={professional ? skills : newContact.skills}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    professional ? setSkills(value) : setNewContact({...newContact, skills: value});
                                }}
                            />
                        </div>
                        <div className={"col-field"}>
                            <strong>Daily Rate:</strong>
                            <input
                                type="text"
                                value={professional ? professional?.dailyRate : newContact.dailyRate}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    professional ? setProfessional({
                                        ...professional,
                                        dailyRate: value
                                    }) : setNewContact({...newContact, dailyRate: value});
                                }}
                            />
                        </div>
                        <div className={"col-field"}>
                            <strong>Location:</strong>
                            <input
                                type="text"
                                value={professional ? professional?.location : newContact.location}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    professional ? setProfessional({
                                        ...professional,
                                        location: value
                                    }) : setNewContact({...newContact, location: value});
                                }}
                            />
                        </div>
                        {professional &&
                            <div className={"col-field"}>
                                <strong>Employment State:</strong>
                                <select
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        professional ? setProfessional({
                                            ...professional,
                                            employmentState: value
                                        }) : setNewContact({...newContact, employmentState: value});
                                    }}
                                >
                                    <option value={EmploymentState.NotAvailable}>Not Avaiable</option>
                                    <option value={EmploymentState.Employed}>Employed</option>
                                    <option value={EmploymentState.Unemployed}>Unemployed</option>
                                </select>
                            </div>
                        }

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
                                            emails.push({emailId: "NEW" + Math.floor(Math.random() * 600), email: ""});
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
                                                telephone: ""
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


                <div>
                    <button className={'page-button'}
                            onClick={handleSaveContact}>{professional ? "Save Changes" : "Create"}</button>
                </div>
            </div>
        </div>
    );
}

EditProfessional.propTypes = {
    professional: PropTypes.instanceOf(Professional)
};

export default EditProfessional;
