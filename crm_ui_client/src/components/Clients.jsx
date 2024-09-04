import {useEffect, useState} from "react";
import "./Clients.css"
import CustomerAPI from "../api/crm/CustomerAPI.js";
import Icon from "./Icon.jsx";
import {Category, Contact} from "../api/crm/dto/Contact.ts";
import {Customer} from "../api/crm/dto/Customer.ts";
import ContactAPI from "../api/crm/ContactAPI.js";
import {ContactDetails} from "../api/crm/dto/ContactDetails.ts";
import {Address} from "../api/crm/dto/Address.ts";
import {Email} from "../api/crm/dto/Email.ts";
import {Telephone} from "../api/crm/dto/Telephone.ts";


function ClientsTable() {
    // const [customers, setCustomers] = useState([]);
    const [customers, setCustomers] = useState([new Customer(5,new Set(['best', 'wonderfull']), new Contact(3, 'carelo', 'rossi', 'bdhev2837',Category.Customer))]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);

    const [tooltip, setTooltip] = useState({ visible: false, showDetails:false, details: null, x: 0, y: 0 });

    // Function to fetch data
    const fetchCustomers = async () => {
        setLoading(true);
        try {
            const pagination = {page: page, pageSize: 10}; // Adjust page size as necessary
            const data = await CustomerAPI.GetCustomers({}, pagination);
            setCustomers(data);
        } catch (error) {
            console.error('Failed to fetch customers:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCustomers();
    }, [page]);


    const handleMouseOver = async (event, contactId) => {
        const rect = event.target.getBoundingClientRect();
        setTooltip(prevTooltip => ({
            ...prevTooltip,
            visible: true,
            x: rect.left + window.scrollX + rect.width / 2,
            y: rect.top + window.scrollY + rect.height
        }))
        try {
            const details = await ContactAPI.GetContactById(contactId);
            setTooltip(prevTooltip => ({
                ...prevTooltip,
                showDetails: true,
                details
            }));
        } catch (error) {
            // modificare il catch moccato
            setTooltip(prevTooltip => ({
                ...prevTooltip,
                showDetails: true,
                details: new ContactDetails(2, 'carelo', 'rossi', 'gf3827r', Category.Customer, new Set([new Address(2n,'via casa mia')]), new Set([new Email(2,'mario@gmail.com')]),new Set([new Telephone(2,'2224443331')])),
            }));
            console.error("Failed to fetch contact details:", error);
        }
    };

    const handleMouseOut = () => {
        setTooltip({ visible: false, showDetails:false, details: null, x: 0, y: 0 });
    };

    if (loading) {
        return <div  className="loading-container">
            <svg
                aria-hidden="true"
                viewBox="0 0 100 101"
                fill="none"
                className={"loading"}
                xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="currentColor" />
                <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentFill" />
            </svg>

        </div>;
    }

    return (
        <div className={"w-full flex-1 p-6 flex flex-col justify-between items-center"}>
            <table className={"w-full rounded-2xl border-stone-600 shadow-md  overflow-hidden text-stone-800"}>
                <thead  className={"w-full h-12 bg-stone-200"}>
                <tr>
                    <th>Client</th>
                    <th>Job Offers Actives</th>
                    <th>Notes</th>
                    <th>Actions </th>
                </tr>
                </thead>
                <tbody>
                {customers.map((customer) => (
                    <tr key={customer.customerId} className={'hover:bg-stone-100 cursor-pointer'}>
                        <td
                            onMouseOver={(event) => handleMouseOver(event, customer.contact.contactId)}
                            onMouseOut={handleMouseOut}
                            className={'cursor-pointer'}
                        >
                            {customer.contact && (
                                <div className="candidate-info">
                                    <div>{customer.contact.name} {customer.contact.surname}</div>
                                </div>
                            )}
                        </td>
                        {/*<td className={"flex flex-col items-center justify-center gap-1"}>*/}
                        {/*    {customer.contact.addresses.map((address) => (*/}
                        {/*        <div key={address.id}>addess.address</div>*/}
                        {/*    ))}*/}
                        {/*</td> /!* Addresses *!/*/}
                        {/*<td className={"flex flex-col items-center justify-center gap-1"}>*/}
                        {/*    {customer.contact.telephones.map((telephone) => (*/}
                        {/*        <div key={telephone.id}>telephone.telephone</div>*/}
                        {/*    ))}*/}
                        {/*</td> /!* Telephones *!/*/}
                        {/*<td className={"flex flex-col items-center justify-center gap-1"}>*/}
                        {/*    {customer.contact.emails.map((email) => (*/}
                        {/*        <div key={email.id}>email.email</div>*/}
                        {/*    ))}*/}
                        {/*</td> /!* Emails *!/*/}
                        <td></td>
                        <td>{Array.from(customer.notes).join(', ')}</td>
                        <td>
                            <button className={'table-button text-blue-500'}>Edit</button>
                            <button className={'table-button text-red-500'}>Delete</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
            {tooltip.visible && (
                <div
                    className="tooltip"
                    style={{
                        position: "absolute",
                        top: tooltip.y,
                        left: tooltip.x,
                        backgroundColor: "#f9f9f9",
                        border: "1px solid #ccc",
                        padding: "10px",
                        zIndex: 1000,
                        maxWidth: "200px",
                        boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
                        borderRadius: "8px"
                    }}
                >
                    {
                        tooltip.showDetails && tooltip.details ? (
                                <>
                                    <strong>{tooltip.details.name} {tooltip.details.surname}</strong><br/>
                                    <p>Email: {Array.from(tooltip.details.emails)[0].email}</p>
                                    <p>Telefono: {Array.from(tooltip.details.telephones)[0].telephone}</p>
                                </>

                            ) :
                            <div className="loading-container">
                                <svg
                                    aria-hidden="true"
                                    viewBox="0 0 100 101"
                                    fill="none"
                                    className={"loading"}
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                        fill="currentColor"/>
                                    <path
                                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                        fill="currentFill"/>
                                </svg>

                            </div>
                    }

                </div>
            )}
            <div className="w-full h-[10%] flex items-center justify-between">
                <button className={"page-button"} onClick={() => setPage(page - 1)} disabled={page === 1}>
                    <Icon name='arrowLeft' className="w-4 h-4" />
                    Previous
                </button>
                <span className={"text-xl text-stone-600"}>Page {page}</span>
                <button className={"page-button"} onClick={() => setPage(page + 1)}>
                    Next
                    <Icon name='arrowRight' className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}

export default ClientsTable;