import "./Skeleton.css"
import {BrowserRouter as Router, Route, Routes, useLocation, useNavigate} from "react-router-dom";

function TopBar() {

    return (
        <div className={"h-28 border-b-2 border-stone-600 w-[80%] flex justify-center items-center"}></div>
    )
}


function SideBar() {

    let navigate = useNavigate();
    let location = useLocation();

    return (
        <div className={"h-full p-6 flex flex-col w-1/5 bg-stone-200"}>
            <div className={"h-32"}></div>
            <div className={"w-full flex flex-col gap-6 flex-1"}>
                <button className={location.pathname==="/ui/clients"?"clicked-side-button":"side-button"} onClick={()=>navigate("/ui/clients")}>Clients</button>
                <button className={location.pathname==="/ui/candidates"?"clicked-side-button":"side-button"} onClick={()=>navigate("/ui/candidates")}>Candidates</button>
                <button className={location.pathname==="/ui/joboffers"?"clicked-side-button":"side-button"} onClick={()=>navigate("/ui/joboffers")}>Job Offers</button>
            </div>
            <div className={"w-full flex flex-col gap-6 flex-1 justify-end"}>
                <button className={location.pathname==="/ui/report"?"clicked-side-button":"side-button"} onClick={()=>navigate("/ui/report")}>Report</button>
                <button className={location.pathname==="/ui/settings"?"clicked-side-button":"side-button"} onClick={()=>navigate("/ui/settings")}>Settings</button>

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
                    <Route path={"/ui/clients"} element={<div className={"flex-1"}>clients</div>}/>
                    <Route path={"/ui/candidates"} element={<div>candidates</div>}/>
                    <Route path={"/ui/joboffers"} element={<div>jobOffer</div>}/>
                    <Route path={"/ui/settings"} element={<div></div>}/>
                    <Route path={"/ui/report"} element={<div></div>}/>
                </Routes>
            </div>
        </div>
        </Router>
)
}

export default Skeleton