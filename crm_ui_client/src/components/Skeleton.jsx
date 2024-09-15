import {useEffect, useState} from "react";
import {BrowserRouter as Router, Navigate, Route, Routes, useLocation, useNavigate} from "react-router-dom";
import logo from '../assets/logo.png';
import ProfessionalsTable from "./Professionals.jsx";
import Icon from "./Icon.jsx";
import ClientsTable from "./Clients.jsx";
import JobOffersTable from "./JobOffer.jsx";
import {User} from "../api/api_gateway/dto/User.ts";
import "./Skeleton.css"
import HomePage from "./HomePage.jsx";
import JobOfferForm from "./JobofferForm.jsx";
import Messages from "./Messages.jsx";
import MessageDetails from "./MessageDetails.jsx";
import Analytics from "./Analytics.jsx";
import FileForm from "./FileForm.jsx";


// eslint-disable-next-line react/prop-types
function TopBar({switchFilter, openFilter, addNew, setAddNew, filterPresent, currentUser}) {
    let location = useLocation();

    return (
        <div className={"h-28 border-b-2 border-stone-600 w-[90%] flex items-center justify-center"}>
            <div className={"w-[90%] flex justify-between items-center"}>
                {
                    location.pathname.split("/").pop() !== 'ui'
                        ?
                        <h1 className={"font-bold text-5xl text-stone-800"}>Job Placement Tool
                            - {location.pathname.split("/").pop()}</h1>
                        : <h1 className={"font-bold text-5xl text-stone-800"}>Job Placement Tool</h1>
                }
                <div className={"flex gap-8"}>
                    <>
                        {filterPresent &&
                            <Icon name='filter'
                                  className={`w-10 h-10 ${openFilter ? "fill-blue-500" : "fill-black"} cursor-pointer`}
                                  onClick={() => switchFilter()}/>
                        }
                        {
                            location.pathname.split("/").pop() !== 'ui'
                                ?
                                <Icon name='plus'
                                      className={`w-10 h-10"${addNew ? "fill-blue-500" : "fill-black"} cursor-pointer`}
                                      onClick={() => setAddNew(true)}/>
                                :
                                <>
                                    {
                                        currentUser && currentUser.principal == null &&
                                        <button className={"page-button hover:bg-blue-500 hover:text-white"}
                                                onClick={() => window.location.href = currentUser.loginUrl}>Login</button>
                                    }
                                </>
                        }
                    </>
                </div>
            </div>
        </div>
    )
}

// eslint-disable-next-line react/prop-types
function SideBar({currentUser}) {
    let navigate = useNavigate();
    let location = useLocation();

    return (
        <div className={"h-full p-6 flex flex-col w-1/5 bg-stone-200"}>
            <div className={"h-32 flex items-center justify-center pb-6"}>
                <img className={"h-full object-contain rounded-full"} src={logo} alt="Logo"/>
            </div>
            <div className={"w-full flex flex-col gap-6 flex-1"}>
                <button className={location.pathname.includes("/ui/Clients") ? "clicked-side-button" : "side-button"}
                        onClick={() => navigate("/ui/Clients")}>Clients
                </button>
                <button className={location.pathname.includes("/ui/Candidates") ? "clicked-side-button" : "side-button"}
                        onClick={() => navigate("/ui/Candidates")}>Candidates
                </button>
                <button className={location.pathname.includes("/ui/JobOffers") ? "clicked-side-button" : "side-button"}
                        onClick={() => navigate("/ui/JobOffers")}>Job Offers
                </button>
            </div>
            <div className={"w-full flex flex-col gap-6 flex-1 justify-end"}>
                <button className={location.pathname.includes("/ui/Analytics") ? "clicked-side-button" : "side-button"}
                        onClick={() => navigate("/ui/Analytics")}>Analytics
                </button>
            </div>
            {
                currentUser && currentUser.principal &&
                <form method={"post"} action={currentUser.logoutUrl}>
                    <input type="hidden" name="_csrf" value={currentUser.xsrfToken}/>
                    <button className={"page-button hover:bg-blue-500 hover:text-white"} type={"submit"}
                            style={{border: "1px solid black"}}>Logout
                    </button>
                </form>
            }
        </div>
    )
}

function Skeleton() {
    const [currentUser, setCurrentUser] = useState(null)

    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const res = await fetch("/current-user")
                const currentUser = await res.json()
                setCurrentUser(User.fromJsonObject(currentUser))
            } catch (error) {
                setCurrentUser(null)
                console.error(error)
            }
        }

        fetchCurrentUser().then()
    }, [])

    return (
        <Router>
            <div className={"h-full w-full flex"}>
                <SideBar currentUser={currentUser}></SideBar>
                <div className="w-4/5 flex flex-col items-center">
                    <Routes>
                        <Route path={"/ui"} element={currentUser?.principal ? <Navigate to={"/ui/Clients"}/> :
                            <HomePage currentUser={currentUser}/>}/>
                        <Route path={"/ui/Clients"}
                               element={!currentUser?.principal ? <Navigate to={"/ui"}/> : <ClientsTable/>}/>
                        <Route path={"/ui/Candidates"}
                               element={!currentUser?.principal ? <Navigate to={"/ui"}/> : <ProfessionalsTable/>}/>
                        <Route path={"/ui/JobOffers"}
                               element={!currentUser?.principal ? <Navigate to={"/ui"}/> : <JobOffersTable/>}/>
                        <Route path={"/ui/JobOffers/add"}
                               element={<JobOfferForm currentUser={currentUser}/>}/>
                        <Route path={"/ui/Messages"}
                               element={<Messages/>}/>
                        <Route path={"/ui/Messages/:messageId"}
                               element={<MessageDetails currentUser={currentUser}/>}/>
                        <Route path={"/ui/Analytics"} element={<Analytics/>}/>
                        <Route path={"/ui/file"} element={<FileForm currentUser={currentUser}/>}/>
                    </Routes>
                </div>
            </div>
        </Router>
    )
}

export {Skeleton, TopBar}
