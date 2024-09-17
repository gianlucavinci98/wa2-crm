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
import Contacts from "./Contacts.jsx";
import ContactDetails from "./ContactDetails.jsx";
import EditClient from "./EditClient.jsx";


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
                            (location.pathname.split("/").pop() !== 'ui' && !location.pathname.includes("Messages") && !location.pathname.includes("JobOffers") && !location.pathname.includes("Analytics"))
                                ?
                                    !addNew?
                                        (!(currentUser?.roles.filter(it=>it.includes('recruiter')).length>0 && location.pathname.includes("Customers")) &&
                                        <Icon name='plus'
                                                    className={`w-10 h-10 cursor-pointer hover:fill-blue-500`}
                                                    onClick={() => setAddNew()}/> ) :
                                        <Icon name='back'
                                              className={`w-10 h-10 cursor-pointer hover:fill-blue-500`}
                                              onClick={() => setAddNew()}/>

                                :
                                <>
                                    {
                                        (addNew && location.pathname.includes("JobOffers")) && <Icon name='back'
                                                        className={`w-10 h-10 cursor-pointer hover:fill-blue-500`}
                                                        onClick={() => setAddNew()}/>
                                    }
                                    {
                                        (currentUser === null || currentUser?.principal === null) &&
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
                <button
                    className={location.pathname.includes("/ui/Contacts") ? "clicked-side-button" : "side-button"}
                    onClick={() => navigate("/ui/Contacts")}>Contacts
                </button>
                <button
                    className={location.pathname.includes("/ui/Customers") ? "clicked-side-button" : "side-button"}
                    onClick={() => navigate("/ui/Customers")}>Customers
                </button>
                <button
                    className={location.pathname.includes("/ui/Professionals") ? "clicked-side-button" : "side-button"}
                    onClick={() => navigate("/ui/Professionals")}>Professionals
                </button>
                <button
                    className={location.pathname.includes("/ui/JobOffers") ? "clicked-side-button" : "side-button"}
                    onClick={() => navigate("/ui/JobOffers")}>Job Offers
                </button>
                <button
                    className={location.pathname.includes("/ui/Messages") ? "clicked-side-button" : "side-button"}
                    onClick={() => navigate("/ui/Messages")}>Messages
                </button>
            </div>

            <div className={"w-full flex flex-col gap-6 flex-1 justify-end"}>
                {currentUser.roles.filter(it => it.includes('manager')).length > 0 &&
                    <button
                        className={location.pathname.includes("/ui/Analytics") ? "clicked-side-button" : "side-button"}
                        onClick={() => navigate("/ui/Analytics")}>Analytics
                    </button>
                }
                <form method={"post"} action={currentUser.logoutUrl}>
                    <input type="hidden" name="_csrf" value={currentUser.xsrfToken}/>
                    <button className={"side-button w-full"} type={"submit"}>Logout
                    </button>
                </form>
            </div>


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
                //setCurrentUser({principal: 'yess', roles: ['manager']}) /*da cambiare*/
                console.error(error)
            }
        }

        fetchCurrentUser().then()
    }, [])

    return (
        <Router>
            <div className={"h-full w-full flex"}>
                {
                    currentUser && currentUser.principal &&
                    <SideBar currentUser={currentUser} setCurrentUser={setCurrentUser}></SideBar>
                }
                <div className={`flex flex-col items-center ${currentUser && currentUser.principal ? "w-4/5" : "w-full"}` }>
                    <Routes>
                        <Route path={"/ui"}
                               element={currentUser?.principal ? <Navigate to={"/ui/Customers"}/> :
                                   <HomePage currentUser={currentUser}/>}/>
                        <Route path={"/ui/Contacts"}
                               element={!currentUser?.principal ? <Navigate to={"/ui"}/> :
                                   <Contacts currentUser={currentUser}/>}/>
                        <Route path={"/ui/Contacts/:contactId"}
                               element={!currentUser?.principal ? <Navigate to={"/ui"}/> :
                                   <ContactDetails currentUser={currentUser}/>}/>
                        <Route path={"/ui/Contacts/add"}
                               element={!currentUser?.principal ? <Navigate to={"/ui"}/> :
                                   <EditClient currentUser={currentUser}/>}/>
                        <Route path={"/ui/Contacts/:contactId/edit"}
                               element={!currentUser?.principal ? <Navigate to={"/ui"}/> :
                                   <EditClient currentUser={currentUser}/>}/>
                        <Route path={"/ui/Customers"}
                               element={!currentUser?.principal ? <Navigate to={"/ui"}/> : <ClientsTable currentUser={currentUser}/>}/>
                        <Route path={"/ui/Professionals"}
                               element={!currentUser?.principal ? <Navigate to={"/ui"}/> : <ProfessionalsTable currentUser={currentUser}/>}/>
                        <Route path={"/ui/JobOffers"}
                               element={!currentUser?.principal ? <Navigate to={"/ui"}/> : <JobOffersTable currentUser={currentUser}/>}/>
                        <Route path={"/ui/JobOffers/add"}
                               element={!currentUser?.principal ? <Navigate to={"/ui"}/> : <JobOfferForm currentUser={currentUser}/>}/>
                        <Route path={"/ui/Messages"}
                               element={!currentUser?.principal ? <Navigate to={"/ui"}/> :
                                   <Messages currentUser={currentUser}/>}/>
                        <Route path={"/ui/Messages/:messageId"}
                               element={!currentUser?.principal ? <Navigate to={"/ui"}/> : <MessageDetails currentUser={currentUser}/>}/>
                        <Route path={"/ui/Analytics"}
                               element={!currentUser?.principal ? <Navigate to={"/ui"}/> : <Analytics/>}/>
                        <Route path={"/ui/file"} element={<FileForm currentUser={currentUser}/>}/>
                    </Routes>
                </div>
            </div>
        </Router>
    )
}

export {Skeleton, TopBar}
