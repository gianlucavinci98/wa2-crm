import {useEffect, useState} from "react";
import ContactAPI from "../api/crm/ContactAPI.js";
import {Pagination} from "../api/utils/Pagination.ts";
import Icon from "./Icon.jsx";
import {TopBar} from "./Skeleton.jsx";
import {useNavigate} from "react-router-dom";
import {ContactFilter} from "../api/crm/filter/ContactFilter.ts";

function Filter({setLoad, setFilter}) {
    const [localFilter, setLocalFilter] = useState(new ContactFilter(null, null, null, null, null, null, null));
    const [check, setCheck] = useState(-1);

    const handleSubmit = (event) => {
        event.preventDefault();

        setFilter(new ContactFilter(localFilter.name, localFilter.surname, localFilter.ssn, check, localFilter.address, localFilter.emailAddress, localFilter.telephoneNumber));
        setLoad(false);
    };

    const handleReset = (event) => {
        event.preventDefault();

        setCheck(-1);
        setLocalFilter(new ContactFilter(null, null, null, null, null, null, null));
        setFilter(null);
        setLoad(false);
    }

    const handleFilterChange = (event) => {
        event.preventDefault();

        let {name, value} = event.target;

        if (name !== "category") {
            if (value === "") {
                value = null;
            }

            setLocalFilter((old) => ({
                ...old,
                [name]: value,
            }));
        }
    };

    return (
        <form className="w-full flex flex-col space-y-4 p-4" onSubmit={handleSubmit}>
            <div className="flex flex-wrap justify-between space-x-4">
                <div className="flex-1">
                    <label>Name: </label>
                    <input
                        type="text"
                        onChange={handleFilterChange}
                        name="name"
                        value={localFilter.name === null ? "" : localFilter.name}
                        className="border p-1 rounded"
                    />
                </div>
                <div className="flex-1">
                    <label>Surname: </label>
                    <input
                        type="text"
                        onChange={handleFilterChange}
                        name="surname"
                        value={localFilter.surname === null ? "" : localFilter.surname}
                        className="border p-1 rounded"
                    />
                </div>
                <div className="flex-1">
                    <label>SSN: </label>
                    <input
                        type="text"
                        onChange={handleFilterChange}
                        name="ssn"
                        value={localFilter.ssn === null ? "" : localFilter.ssn}
                        className="border p-1 rounded"
                    />
                </div>
                <div className="flex-1">
                    <label>Address: </label>
                    <input
                        type="text"
                        onChange={handleFilterChange}
                        name="address"
                        value={localFilter.address === null ? "" : localFilter.address}
                        className="border p-1 rounded"
                    />
                </div>
                <div className="flex-1">
                    <label>Email: </label>
                    <input
                        type="text"
                        onChange={handleFilterChange}
                        name="emailAddress"
                        value={localFilter.emailAddress === null ? "" : localFilter.emailAddress}
                        className="border p-1 rounded"
                    />
                </div>
                <div className="flex-1">
                    <label>Telephone: </label>
                    <input
                        type="text"
                        onChange={handleFilterChange}
                        name="telephoneNumber"
                        value={localFilter.telephoneNumber === null ? "" : localFilter.telephoneNumber}
                        className="border p-1 rounded"
                    />
                </div>
            </div>

            <div className="w-full flex flex-col">
                <label>Category: </label>
                <div className="w-full flex flex-row items-center space-x-4">
                    <div className="flex-1">
                        <label>Customer</label>
                        <input
                            type="radio"
                            name="category"
                            checked={check === 0}
                            onChange={() => setCheck(0)}
                        />
                    </div>
                    <div className="flex-1">
                        <label>Professional</label>
                        <input
                            type="radio"
                            name="category"
                            checked={check === 1}
                            onChange={() => setCheck(1)}
                        />
                    </div>
                    <div className="flex-1">
                        <label>Unknown</label>
                        <input
                            type="radio"
                            name="category"
                            checked={check === 2}
                            onChange={() => setCheck(2)}
                        />
                    </div>
                    <div className="flex-1">
                        <label>CustomerProfessional</label>
                        <input
                            type="radio"
                            name="category"
                            checked={check === 3}
                            onChange={() => setCheck(3)}
                        />
                    </div>
                </div>
            </div>

            <div className="flex space-x-4 justify-center">
                <button type="submit" className="border p-2 rounded-lg">Search</button>
                <button
                    type="reset"
                    className="border p-2 rounded-lg"
                    onClick={handleReset}>Reset
                </button>
            </div>
        </form>
    );
}

function ContactRow({currentUser, contact}) {
    const navigate = useNavigate();

    return (
        <div className="w-full flex flex-row justify-around p-2.5 rounded-2xl shadow-lg"
             onClick={() => navigate(`/ui/Contacts/${contact.contactId}`)}>
            <div className="flex flex-1 justify-center">{contact.name}</div>
            <div className="flex flex-1 justify-center">{contact.surname}</div>
            <div className="flex flex-1 justify-center">{contact.ssn}</div>
            <div className="flex flex-1 justify-center">{contact.category}</div>
        </div>
    )
}

function Contacts({currentUser}) {
    const navigate = useNavigate();
    const [contacts, setContacts] = useState([]);
    const [load, setLoad] = useState(false);
    const [page, setPage] = useState(1);
    const [openFilter, setOpenFilter] = useState(false);
    const [filter, setFilter] = useState(null);

    useEffect(() => {
        if (!load) {
            ContactAPI.GetContacts(filter, new Pagination(page - 1, 8)).then((res) =>
                setContacts(res)
            ).catch((err) => console.log(err))
            setLoad(true);
        }
    }, [filter, load, page])

    return (
        <>
            <TopBar openFilter={openFilter} switchFilter={() => setOpenFilter(!openFilter)} filterPresent={true}
                    setAddNew={() => navigate(`/ui/Contacts/add`)}/>
            <div className="w-full flex flex-1 flex-col items-center overflow-y-auto p-6">
                {
                    openFilter
                        ?
                        <Filter currentUser={currentUser} setLoad={setLoad} setFilter={setFilter}/>
                        :
                        <></>
                }
                <div className="w-full overflow-y-auto flex flex-col flex-1 gap-1 items-center">
                    <div className="w-full flex flex-row justify-around p-2.5 rounded-2xl shadow-lg bg-gray-300">
                        <div className="flex flex-1 justify-center font-bold">Name</div>
                        <div className="flex flex-1 justify-center font-bold">Surname</div>
                        <div className="flex flex-1 justify-center font-bold">SSN</div>
                        <div className="flex flex-1 justify-center font-bold">Category</div>
                    </div>
                    {
                        contacts.length === 0
                            ?
                            <div className="flex-1">No result for this research</div>
                            :
                            contacts.map((contact) => (<ContactRow key={contact.contactId} contact={contact}/>))
                    }
                </div>
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

export default Contacts