import "./Skeleton.css"
import {BrowserRouter as Router, Route, Routes, useLocation, useNavigate} from "react-router-dom";
import logo from '../assets/logo.png';

function TopBar() {

    let location = useLocation();

    return (
        <div className={"h-28 border-b-2 border-stone-600 w-[90%] flex items-center justify-center"}>
            <div className={"w-[90%] flex justify-between items-center"}>
                <h1 className={"font-bold text-5xl text-stone-800"}>Job Placement Tool - {location.pathname.split("/").pop()}</h1>
                <div></div>
            </div>
        </div>
    )
}


function SideBar() {

    let navigate = useNavigate();
    let location = useLocation();


    return (
        <div className={"h-full p-6 flex flex-col w-1/5 bg-stone-200"}>
            <div className={"h-32 flex items-center justify-center p-6"}>
                <img className={"h-full object-contain rounded-full"} src={logo} alt="Logo" />
            </div>
            <div className={"w-full flex flex-col gap-6 flex-1"}>
                <button className={location.pathname==="/ui/Clients"?"clicked-side-button":"side-button"} onClick={()=>navigate("/ui/Clients")}>Clients</button>
                <button className={location.pathname==="/ui/Candidates"?"clicked-side-button":"side-button"} onClick={()=>navigate("/ui/Candidates")}>Candidates</button>
                <button className={location.pathname==="/ui/JobOffers"?"clicked-side-button":"side-button"} onClick={()=>navigate("/ui/JobOffers")}>Job Offers</button>
            </div>
            <div className={"w-full flex flex-col gap-6 flex-1 justify-end"}>
                <button className={location.pathname==="/ui/Report"?"clicked-side-button":"side-button"} onClick={()=>navigate("/ui/Report")}>Report</button>
                <button className={location.pathname==="/ui/Settings"?"clicked-side-button":"side-button"} onClick={()=>navigate("/ui/Settings")}>Settings</button>

            </div>
        </div>
    )
}

function Skeleton() {

    return (
        <Router>
        <div className={"h-full w-full flex"}>
            <SideBar></SideBar>
            <div className="w-4/5 flex flex-col items-center">
                <TopBar/>
                <Routes>
                    <Route path={"/ui"} element={<div className={"flex-1"}> </div>}/>
                    <Route path={"/ui/Clients"} element={<div className={"flex-1"}>clients</div>}/>
                    <Route path={"/ui/Candidates"} element={<div>candidates</div>}/>
                    <Route path={"/ui/JobOffers"} element={<div>jobOffer</div>}/>
                    <Route path={"/ui/Settings"} element={<div></div>}/>
                    <Route path={"/ui/Report"} element={<div></div>}/>
                </Routes>
            </div>
        </div>
        </Router>
)
}

export default Skeleton