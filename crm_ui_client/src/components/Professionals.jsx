import {useEffect, useState} from "react";
import "./Professionals.css"
import ProfessionalAPI from "../api/crm/ProfessionalAPI.js";
import Icon from "./Icon.jsx";
import {TopBar} from "./Skeleton.jsx";
import {Pagination} from "../api/utils/Pagination.ts";
import {ProfessionalFilter} from "../api/crm/filter/ProfessionalFilter.ts";
import {useNavigate} from "react-router-dom";
import DocumentStoreAPI from "../api/document_store/DocumentStoreAPI.js";
import {DocumentMetadataFilter} from "../api/document_store/filter/DocumentMetadataFilter.ts";
import {DocumentCategory} from "../api/document_store/dto/DocumentMetadata.ts";
import {MdOutlineSimCardDownload, MdOutlineUploadFile} from "react-icons/md";
import {CgProfile} from "react-icons/cg";

function SearchBar({setFilter, setLoad}) {
    const [localFilter, setLocalFilter] = useState(new ProfessionalFilter(null, null, null))

    const handleSubmit = (event) => {
        event.preventDefault()

        setFilter(new ProfessionalFilter(localFilter.skills?.split(',').map(s => s.trim()), localFilter.employmentState, localFilter.location));
        setLoad(false);
    };

    const handleReset = (event) => {
        event.preventDefault();

        setLocalFilter(new ProfessionalFilter(null, null, null));
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
        <form className=" flex justify-between gap-6 h-[10%] items-center" onSubmit={handleSubmit}>
            <div className={"p-2 flex gap-4 border rounded-md shadow-md"}>
                <input
                    name="skills"
                    type="text"
                    placeholder="Skills (comma separated)"
                    value={localFilter.skills === null ? "" : localFilter.skills}
                    onChange={handleFilterChange}
                />
                <input
                    name="location"
                    type="text"
                    placeholder="Location"
                    value={localFilter.location === null ? "" : localFilter.location}
                    onChange={handleFilterChange}
                />
                <select
                    name="employmentState"
                    value={localFilter.employmentState === null ? "" : localFilter.employmentState}
                    onChange={handleFilterChange}>
                    <option value="" disabled={true}>Status</option>
                    <option value="Employed">Employed</option>
                    <option value="Unemployed">Unemployed</option>
                    <option value="NotAvailable">Not Available</option>
                </select>
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

function AddFile({currentUser, setLoad, professionalId, onClose}) {
    const [file, setFile] = useState()

    const handleSubmit = (event) => {
        event.preventDefault()

        DocumentStoreAPI.InsertNewDocument(file, DocumentCategory.Curriculum, professionalId, currentUser.xsrfToken).then((res) => {
            console.log(res)
            onClose()
            setLoad(false)
        }).catch((err) => console.log(err))
    }

    return (
        <div className="overlay">
            <div className="dialog flex flex-col items-center">
                <h2 className="message-details-header-subject" style={{paddingBottom: '10px'}}>
                    Add Curriculum
                </h2>
                <div className="w-full flex flex-col items-center">
                    <form onSubmit={handleSubmit}>
                        <input type="file" onChange={(event) => setFile(event.target.files[0])}/>
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

function ProfessionalRow({professional, contactId, currentUser}) {
    const navigate = useNavigate()
    const [curriculum, setCurriculum] = useState(null)
    const [load, setLoad] = useState(false)
    const [showDialog, setShowDialog] = useState(false)

    useEffect(() => {
        if (!load) {
            DocumentStoreAPI.GetDocuments(new DocumentMetadataFilter(DocumentCategory.Curriculum, professional.professionalId), null).then((res) => {
                setCurriculum(res[0])
                setLoad(true)
            }).catch((err) => {
                console.log(err)
                setCurriculum(null)
                setLoad(true)
            })
        }
    }, [load, professional.professionalId])

    console.log(curriculum)

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

function ProfessionalsTable({currentUser}) {
    const [openFilter, setOpenFilter] = useState(false);
    const [professionals, setProfessionals] = useState([]);
    const [load, setLoad] = useState(false);
    const [filter, setFilter] = useState(null);
    const [page, setPage] = useState(1);
    const [tooltip, setTooltip] = useState({visible: false, showDetails: false, details: null, x: 0, y: 0});

    useEffect(() => {
        if (!load) {
            ProfessionalAPI.GetProfessionals(filter, new Pagination(page - 1, 8)).then((res) => {
                setProfessionals(res)
                setLoad(true)
            }).catch((err) => console.log(err))
        }
    }, [page, filter, load]);

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
    } else {
        return (
            <>
                <TopBar openFilter={openFilter} switchFilter={() => setOpenFilter(!openFilter)}
                        currentUser={currentUser}/>
                {
                    <div className="w-full flex flex-1 flex-col items-center overflow-y-auto p-6">
                        {
                            openFilter
                                ?
                                <SearchBar setFilter={setFilter} setLoad={setLoad}/>
                                :
                                <></>
                        }
                        <div className="w-full overflow-y-auto flex flex-col flex-1 gap-1 items-center">
                            <div
                                className="w-full flex flex-row justify-around p-2.5 rounded-2xl shadow-lg bg-gray-300">
                                <div className="flex flex-1 justify-center font-bold">Daily Rate</div>
                                <div className="flex flex-1 justify-center font-bold">Core skills</div>
                                <div className="flex flex-1 justify-center font-bold">Status</div>
                                <div className="flex flex-1 justify-center font-bold">Location</div>
                                <div className="flex flex-1 justify-center font-bold">Curriculum</div>
                            </div>
                            {
                                professionals.length === 0
                                    ?
                                    <div className="flex-1">No result for this research</div>
                                    :
                                    professionals.map((professional) => (
                                        <ProfessionalRow key={professional.professionalId} tooltip={tooltip}
                                                         setTooltip={setTooltip} currentUser={currentUser}
                                                         professional={professional}
                                                         contactId={professional.contact.contactId}/>
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
                }
            </>
        )
    }
}

export default ProfessionalsTable;