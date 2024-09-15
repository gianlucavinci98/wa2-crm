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
import {JobOffer} from "../api/crm/dto/JobOffer.ts";


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
                                    !addNew  ?
                                        <Icon name='plus'
                                                    className={`w-10 h-10 cursor-pointer hover:fill-blue-500`}
                                                    onClick={() => setAddNew()}/> :
                                        <Icon name='back'
                                              className={`w-10 h-10 cursor-pointer hover:fill-blue-500`}
                                              onClick={() => setAddNew()}/>

                                :
                                <>
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
function SideBar({currentUser, setCurrentUser}) {
    let navigate = useNavigate();
    let location = useLocation();

    return (
        <div className={"h-full p-6 flex flex-col w-1/5 bg-stone-200"}>
            <div className={"h-32 flex items-center justify-center pb-6"}>
                <img className={"h-full object-contain rounded-full"} src={logo} alt="Logo"/>
            </div>
                <div className={"w-full flex flex-col gap-6 flex-1"}>
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
                </div>
                <div className={"w-full flex flex-col gap-6 flex-1 justify-end"}>
                    <button className={location.pathname.includes("/ui/Report") ? "clicked-side-button" : "side-button"}
                            onClick={() => navigate("/ui/Report")}>Report
                    </button>
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
                setCurrentUser({principal:'yess'}) /*da cambiare*/
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
                        <Route path={"/ui"} element={currentUser?.principal ? <Navigate to={"/ui/Customers"}/> :
                            <HomePage currentUser={currentUser}/>}/>
                        <Route path={"/ui/Customers"}
                               element={!currentUser?.principal ? <Navigate to={"/ui"}/> : <ClientsTable/>}/>
                        <Route path={"/ui/Professionals"}
                               element={!currentUser?.principal ? <Navigate to={"/ui"}/> : <ProfessionalsTable/>}/>
                        <Route path={"/ui/JobOffers"}
                               element={!currentUser?.principal ? <Navigate to={"/ui"}/> : <JobOffersTable/>}/>
                        <Route path={"/ui/Report"} element={<div></div>}/>
                    </Routes>
                </div>
            </div>
        </Router>
    )
}

export {Skeleton, TopBar}
