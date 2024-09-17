import {useEffect, useState} from "react";
import "./JobOffer.css"
import JobOfferAPI from "../api/crm/JobOfferAPI.js";
import Icon from "./Icon.jsx";
import {TopBar} from "./Skeleton.jsx";
import JobOfferForm from "./JobofferForm.jsx";
import {JobOffer, JobOfferStatus} from "../api/crm/dto/JobOffer.ts";
import {useLocation} from "react-router-dom";


// eslint-disable-next-line react/prop-types
function JobOfferSearchBar({ onFilterChange , filter}) {
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
                    <button className=" flex gap-4 w-full items-center appearance-nonebg-white hover:border-gray-500 px-4 py-2 pr-6 leading-tight focus:outline-none focus:shadow-outline" onClick={()=>setOpenSelectedStatuses(!openSelectedStatuses)}>
                        Status Selection
                        <Icon name={'arrowDown'} className={"w-2 h-2"}></Icon>
                    </button>
                    {openSelectedStatuses?<div className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg mt-1">
                        <div className="p-2 w-fit">
                            {['Created', 'SelectionPhase', 'CandidateProposal', 'Consolidated', 'Done', 'Aborted'].map(status => (
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
                            ))}
                        </div>
                    </div>:""}
                </div>
            </div>
            <button className="page-button" onClick={handleSearch}>Search</button>
        </div>
    );
}


// eslint-disable-next-line react/prop-types
function JobOffersTable({currentUser}) {

    const location = useLocation();
    const {customer} = location?.state || {};
    const [openFilter, setOpenFilter] = useState(false);
    const [jobOffers, setJobOffers] = useState([new JobOffer(3, 'plumber job in Turin buwe vhe vhe vhjvhrjv rhv herjv rjv erjv ervjherv ejhve rjv ', "short job and no waste of time", JobOfferStatus.SelectionPhase, ["plumber"], 5, 400, 2)]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState(['Created', 'SelectionPhase', 'CandidateProposal', 'Consolidated', 'Done', 'Aborted']);
    const [page, setPage] = useState(1);
    const [editJobOffer, setEditJobOffer] = useState(!!customer);
    const [editingJobOffer, setEditingJobOffer] = useState(undefined);

    // Function to fetch data
    const fetchJobOffers = async () => {
        setLoading(true);
        try {
            const pagination = {page: page, pageSize: 10}; // Adjust page size as necessary
            const data = await JobOfferAPI.GetJobOffers(filter, pagination);
            setJobOffers(data);
        } catch (error) {
            console.error('Failed to fetch jobOffers:', error);
        } finally {
            setLoading(false);
        }
    };

    const onDeleteHandler = async (jobOffer) => {
        try {
            await JobOfferAPI.DeleteJobOffer(jobOffer.jobOfferId, currentUser.xsrfToken);
        } catch (error) {
            console.error('Failed to delete Job Offer:', error);
        }
    };

    useEffect(() => {
        fetchJobOffers();
    }, [page, filter]);

    const handleFilterChange = (newFilter) => {
        setFilter(newFilter);
        setPage(1)
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
        <>
            <TopBar currentUser={currentUser} addNew={editJobOffer} setAddNew={()=>{
                setEditingJobOffer(undefined)
                setEditJobOffer(!editJobOffer)}
            } filterPresent={!editJobOffer} openFilter={openFilter} switchFilter={()=>setOpenFilter(!openFilter)}></TopBar>
            {!editJobOffer ?
                <div className={"w-full flex-1 p-6 flex flex-col justify-between items-center"}>
                    {openFilter?<JobOfferSearchBar onFilterChange={handleFilterChange} filter={filter} />:""}
                    <table className={"w-full rounded-2xl border-stone-600 shadow-md  overflow-hidden text-stone-800"}>
                        <thead  className={"w-full h-12 bg-stone-200"}>
                        <tr>
                            <th>Description</th>
                            <th>Required skills</th>
                            <th>Duration</th>
                            <th>Value</th>
                            <th>Status</th>
                            <th>Details</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {jobOffers.map((jobOffer) => (
                            <tr key={jobOffer.selectedProfessionalId} className={'hover:bg-stone-100 cursor-pointer'}>
                                <td>{jobOffer.description}</td>
                                <td>{Array.from(jobOffer.requiredSkills).join(', ')}</td>
                                <td>{jobOffer.duration} days</td>
                                <td>{jobOffer.value}</td>
                                <td>{JobOfferStatus[jobOffer.status]}</td>
                                <td>{jobOffer.details}</td>
                                <td>
                                    <div className={"flex gap-2 items-center"}>
                                        <Icon name={"pencil"} className={'w-4 h-4 fill-blue-500'} onClick={() => {
                                            setEditingJobOffer(jobOffer)
                                            setEditJobOffer(!editJobOffer)
                                        }}>Edit
                                        </Icon>
                                        <Icon name={"garbage"} className={'w-4 h-4 fill-red-500'} onClick={() => {
                                            onDeleteHandler(jobOffer)
                                        }}>Delete</Icon>
                                    </div>
                                </td>
                            </tr>
                        ))}
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
                            <Icon name='arrowRight' className="w-4 h-4" />
                        </button>
                    </div>
                </div>
                :
                <JobOfferForm jobOffer={editingJobOffer} customer={customer}></JobOfferForm>
            }
        </>
    )
}

export default JobOffersTable;