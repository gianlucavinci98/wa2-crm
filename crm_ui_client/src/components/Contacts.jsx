import {useEffect, useState} from "react";
import ContactAPI from "../api/crm/ContactAPI.js";
import {Pagination} from "../api/utils/Pagination.ts";
import Icon from "./Icon.jsx";
import {TopBar} from "./Skeleton.jsx";
import {useNavigate} from "react-router-dom";

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

    useEffect(() => {
        if (!load) {
            ContactAPI.GetContacts(null, new Pagination(page - 1, 8)).then((res) =>
                setContacts(res)
            ).catch((err) => console.log(err))
            setLoad(true);
        }
    }, [load, page])

    return (
        <>
            <TopBar openFilter={openFilter} switchFilter={() => setOpenFilter(!openFilter)} filterPresent={true}
                    setAddNew={() => navigate(`/ui/Contacts/add`)}/>
            <div className="w-full flex flex-1 flex-col items-center overflow-y-auto p-6">
                {
                    openFilter
                        ?
                        <div>ciao</div>
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