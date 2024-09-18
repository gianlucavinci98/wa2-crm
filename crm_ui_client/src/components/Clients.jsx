import {useState} from "react";
import "./Clients.css"
import {useNavigate} from "react-router-dom";
import {CgProfile} from "react-icons/cg";

function ClientRow({currentUser}) {
    const navigate = useNavigate()
    const [showDialog, setShowDialog] = useState(false)

    return (
        <>
            <div className="w-full flex flex-row justify-around p-2.5 rounded-2xl shadow-lg">
                <div className="flex flex-1 justify-center">{professional.dailyRate} $</div>
                <div className="flex flex-1 justify-center">{Array.from(professional.skills).join(', ')}</div>
                <div className="flex flex-1 justify-center">{professional.employmentState}</div>
                <div className="flex flex-1 justify-center">{professional.location}</div>
                <div className="flex flex-1 justify-center">
                    {
                        curriculum !== undefined
                            ?
                            <button>
                                <MdOutlineSimCardDownload size={20} onClick={() => {
                                    DocumentStoreAPI.GetDocumentDataById(curriculum.metadataId, curriculum.name).catch((err) => {
                                        console.log(err)
                                        alert("Error during the download!")
                                    })
                                }}/>
                            </button>
                            :
                            <button>
                                <MdOutlineUploadFile size={20} onClick={() => setShowDialog(true)}/>
                            </button>
                    }
                    <button>
                        <CgProfile size={20} onClick={() => navigate(`/ui/Contacts/${contactId}`)}/>
                    </button>
                    {
                        showDialog
                            ?
                            <AddFile professionalId={professional.professionalId} setLoad={setLoad}
                                     onClose={() => setShowDialog(false)}
                                     currentUser={currentUser}/>
                            :
                            <></>
                    }
                </div>
            </div>
        </>
    )
}

function Clients({currentUser}) {
    /*const [customers, setCustomers] = useState([new Customer(5, ['best', 'wonderfull'], new Contact(3, 'carelo', 'rossi', 'bdhev2837', Category.Customer))]);
    const [load, setLoad] = useState(false);
    const [page, setPage] = useState(1);
    const [editClient, setEditClient] = useState(false);
    const [editingClient, setEditingClient] = useState();
    const navigate = useNavigate()
    const [filter, setfilter] = useState(null)

    useEffect(() => {
        if (!load) {
            CustomerAPI.GetCustomers(filter, new Pagination(page - 1, 8)).then((res) => {
                setCustomers(res)
            }).catch((err) => console.log(err))
        }
    }, [load, page]);

    if (!load) {
        return <div className="loading-container">
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

        </div>;
    } else return (
        <>
            <TopBar currentUser={currentUser} addNew={editClient}/>
            <div className="w-full flex flex-1 flex-col items-center overflow-y-auto p-6">
                {
                    //filter
                }
                <div className="w-full overflow-y-auto flex flex-col flex-1 gap-1 items-center">
                    <tr>
                        <th>Customer</th>
                        <th>Notes</th>
                        <th>Actions</th>
                    </tr>
                    <div
                        className="w-full flex flex-row justify-around p-2.5 rounded-2xl shadow-lg bg-gray-300">
                        <div className="flex flex-1 justify-center font-bold">Daily Rate</div>
                        <div className="flex flex-1 justify-center font-bold">Core skills</div>
                        <div className="flex flex-1 justify-center font-bold">Status</div>
                        <div className="flex flex-1 justify-center font-bold">Location</div>
                        <div className="flex flex-1 justify-center font-bold">Curriculum</div>
                    </div>
                    {
                        customers.length === 0
                            ?
                            <div className="flex-1">No result for this research</div>
                            :
                            customers.map((customer) => (

                            ))
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
    )*/
    return (<></>)
}

export default Clients;