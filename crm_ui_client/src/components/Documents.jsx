import {useEffect, useState} from "react";
import DocumentStoreAPI from "../api/document_store/DocumentStoreAPI.js";
import {Pagination} from "../api/utils/Pagination.ts";
import {DocumentMetadataFilter} from "../api/document_store/filter/DocumentMetadataFilter.ts";
import {TopBar} from "./Skeleton.jsx";
import Icon from "./Icon.jsx";


// eslint-disable-next-line react/prop-types
function DocumentSearchBar({onFilterChange, filter}) {
    const [selectedStatuses, setSelectedStatuses] = useState(filter);
    const [openSelectedStatuses, setOpenSelectedStatuses] = useState(false);

    const handleStatusChange = (status) => {
        // Check if the status is already selected
        if (selectedStatuses.includes(status)) {
            // If yes, remove it from the list
            setSelectedStatuses(selectedStatuses.filter(s => s !== status));
        } else {
            // If no, add it to the list
            setSelectedStatuses([...selectedStatuses, status]);
        }
    };

    const handleSearch = () => {
        // Create filter object based on state
        const filter = {
            status: selectedStatuses.length ? selectedStatuses : null,
        };
        onFilterChange(filter);
    };

    return (
        <div className="flex justify-between gap-6 h-[10%] items-center">
            <div className="p-2 flex gap-4 border rounded-md shadow-md">
                <div className="relative w-48">
                    <button
                        className=" flex gap-4 w-full items-center appearance-nonebg-white hover:border-gray-500 px-4 py-2 pr-6 leading-tight focus:outline-none focus:shadow-outline"
                        onClick={() => setOpenSelectedStatuses(!openSelectedStatuses)}>
                        Status Selection
                        <Icon name={'arrowDown'} className={"w-2 h-2"}></Icon>
                    </button>
                    {
                        openSelectedStatuses
                            ?
                            <div
                                className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg mt-1">
                                <div className="p-2 w-fit">
                                    {
                                        ['Curriculum', 'Contact', 'Attachment', 'Unknown',].map(status => (
                                            <div key={status}>
                                                <label className="flex items-center gap-2">
                                                    <input
                                                        type="checkbox"
                                                        value={status}
                                                        checked={selectedStatuses.includes(status)}
                                                        onChange={() => handleStatusChange(status)}
                                                    />
                                                    <span>{status}</span>
                                                </label>
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                            :
                            <></>
                    }
                </div>
            </div>
            <button className="page-button" onClick={handleSearch}>Search</button>
        </div>
    );
}


// eslint-disable-next-line react/prop-types
function Documents({currentUser}) {
    const [data, setData] = useState(null)
    const [load, setLoad] = useState(false)
    const [page, setPage] = useState(1);
    const [openFilter, setOpenFilter] = useState(false);
    const [filter, setFilter] = useState({
        type: [
            'Curriculum',
            'Contact',
            'Attachment',
            'Unknown',
        ]
    });

    // Function to fetch data
    const fetchDocuments = async () => {
        setLoad(true);
        try {
            const result = await DocumentStoreAPI.GetDocuments(new DocumentMetadataFilter(filter.type, null), new Pagination(page - 1, 8));
            setData(result);
        } catch (error) {
            console.error('Failed to fetch jobOffers:', error);
        } finally {
            setLoad(false);
        }
    };

    useEffect(() => {
        fetchDocuments();
    }, [page, filter]);

    const handleFilterChange = (newFilter) => {
        setFilter(newFilter);
        setPage(1)
    };


    useEffect(() => {
        DocumentStoreAPI.GetDocuments().then((result) => {
            setData(result)
        }).catch(err => console.log(err))
    }, [load])

    if (load) {
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
    }

    return (<>
            <TopBar currentUser={currentUser}
                    openFilter={openFilter}
                    switchFilter={() => setOpenFilter(!openFilter)}></TopBar>

            <div className={"w-full flex-1 p-6 flex flex-col justify-between items-center"}>
                {
                    openFilter
                        ?
                        <DocumentSearchBar onFilterChange={handleFilterChange} filter={filter}/>
                        :
                        <></>
                }
                <table className={"w-full rounded-2xl border-stone-600 shadow-md  overflow-hidden text-stone-800"}>
                    <thead className={"w-full h-12 bg-stone-200"}>
                    <tr>
                        <th>Name</th>
                        <th>Size</th>
                        <th>Timestamp</th>
                        <th>Category</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        !load
                            ?
                            <></>
                            :
                            data.map((document) => (
                                <tr key={document.metadataId} className={'hover:bg-stone-100 cursor-pointer'}>
                                    <td>{document.name}</td>
                                    <td>{document.size}</td>
                                    <td>{document.timestamp}</td>
                                    <td>{document.category}</td>
                                    <td>
                                        <div className={"flex gap-2 items-center"}>
                                            <Icon name={"download"} className={'w-4 h-4 fill-blue-500'} onClick={() => {
                                                DocumentStoreAPI.GetDocumentDataById(document.metadataId).then().catch(err => console.log(err))
                                            }}>Download
                                            </Icon>
                                        </div>
                                    </td>
                                </tr>
                            ))
                    }
                    </tbody>
                </table>
                <div className="w-full h-[10%] flex items-center justify-between">
                    <button className={"page-button"} onClick={() => setPage(page - 1)} disabled={page === 1}>
                        <Icon name='arrowLeft' className="w-4 h-4"/>
                        Previous
                    </button>
                    <span className={"text-xl text-stone-600"}>Page {page}</span>
                    <button className={"page-button"} onClick={() => setPage(page + 1)}>
                        Next
                        <Icon name='arrowRight' className="w-4 h-4"/>
                    </button>
                </div>
            </div>
        </>
    )
}

export default Documents;