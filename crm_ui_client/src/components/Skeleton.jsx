import {useEffect, useState} from "react";
import {BrowserRouter as Router, Route, Routes, useLocation, useNavigate} from "react-router-dom";
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
function TopBar({switchFilter, openFilter, addNew, setAddNew, filterPresent}) {

    let location = useLocation();

    return (
        <div className={"h-28 border-b-2 border-stone-600 w-[90%] flex items-center justify-center"}>
            <div className={"w-[90%] flex justify-between items-center"}>
                {!location.pathname.includes("/ui/Home") ?
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
                        {!location.pathname.includes("/ui/Home") ?
                            <Icon name='plus'
                                  className={`w-10 h-10"${addNew ? "fill-blue-500" : "fill-black"} cursor-pointer`}
                                  onClick={() => setAddNew(true)}/>
                            :
                            <button className={"page-button hover:bg-blue-500 hover:text-white"}>Login</button>
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
            {
                currentUser && currentUser.principal &&
                <div>
                    <h4>Welcome {currentUser.name}</h4>
                    <p>
                        Role:
                        {
                            currentUser.roles.map((it, index) => (
                                <span key={index}>{it.toUpperCase()}</span>
                            ))
                        }
                    </p>
                    <form method={"post"} action={currentUser.logoutUrl}>
                        <input type="hidden" name="_csrf" value={currentUser.xsrfToken}/>
                        <button type={"submit"} style={{border: "1px solid black"}}>Logout</button>
                    </form>
                </div>
            }
            {
                currentUser && currentUser.principal == null &&
                <button onClick={() => window.location.href = currentUser.loginUrl}
                        style={{border: "1px solid black"}}>Login</button>
            }
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
                <button className={location.pathname.includes("/ui/Report") ? "clicked-side-button" : "side-button"}
                        onClick={() => navigate("/ui/Report")}>Report
                </button>
                <button className={location.pathname.includes("/ui/Settings") ? "clicked-side-button" : "side-button"}
                        onClick={() => navigate("/ui/Settings")}>Settings
                </button>

            </div>
        </div>
    )
}

function Skeleton() {
    const [currentUser, setCurrentUser] = useState(null);

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
                <SideBar currentUser={currentUser} setCurrentUser={setCurrentUser}></SideBar>
                <div className="w-4/5 flex flex-col items-center">
                    <Routes>
                        <Route path={"/ui"} element={<div className={"flex-1"}></div>}/>
                        <Route path={"/ui/home"} element={<HomePage/>}/>
                        <Route path={"/ui/Clients"} element={<ClientsTable/>}/>
                        <Route path={"/ui/Candidates"} element={<ProfessionalsTable/>}/>
                        <Route path={"/ui/JobOffers"} element={<JobOffersTable/>}/>
                        <Route path={"/ui/JobOffers/add"} element={<JobOfferForm/>}/>
                        <Route path={"/ui/JobOffers/update/:jobOfferId"} element={<JobOfferForm
                            jobOffer={new JobOffer(null, "description", "details", null, ["ciao", "bello"], BigInt(50), null, null)}/>}/>
                        <Route path={"/ui/Settings"} element={<div></div>}/>
                        <Route path={"/ui/Report"} element={<div></div>}/>
                    </Routes>
                </div>
            </div>
        </Router>
    )
}

export {Skeleton, TopBar}
