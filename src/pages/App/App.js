import { useLocation, useNavigate, Routes, Route } from "react-router-dom";
import useAuth, { states } from "../../context/Auth/AuthContext.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { solid } from "@fortawesome/fontawesome-svg-core/import.macro";
import UserIcon from "../../components/UserIcon/UserIcon.js";
import Home from "../Home/Home.js";
import Login from "../Login/Login.js";
import SCTs from "../SCTs/SCTs.js";
import Students from "../Students/Students.js";
import Planning from "../Planning/Planning.js";
import Compta from "../Compta/Compta.js";
import Jobs from "../Jobs/Jobs.js";
import JobOffers from "../JobOffers/JobOffers.js";
import Notes from "../Notes/Notes.js";
import Modules from "../Modules/Modules.js";
import Resits from "../Resits/Resits.js";
import Errors from "../Errors/Errors.js";
import "./App.css";

function App() {
	/* ---- States ---------------------------------- */
	const location = useLocation();
	const navigate = useNavigate();
	const { status, user } = useAuth();
	
	/* ---- Page content ---------------------------- */
	// TODO: Choose between french/english urls
	return (
		<div className="App">
			<div className="App-header">
				<button className="back-btn" onClick={() => navigate(-1)} disabled={location.pathname === "/"}>
					<FontAwesomeIcon icon={solid("arrow-left-long")} size="1x"/>
				</button>
				
				{status === states.CONNECTED && (
					<div className="header-user">
						<UserIcon user={user}/>
					</div>
				)}
			</div>
			
			<Routes>
				<Route path="/" element={<Home/>}/>
				<Route path="/login" element={<Login/>}/>
				
				<Route path="/scts" element={<SCTs.all/>}/>
				<Route path="/student/:UUID" element={<Students.byUUID/>}/>
				<Route path="/students/old" element={<Students.old/>}/>
				<Route path="/students" element={<Students.all/>}/>

				<Route path="/notes" element={<Notes/>}/>
				<Route path="/modules" element={<Modules/>}/>
				<Route path="/planning" element={<Planning/>}/>
				<Route path="/resits" element={<Resits/>}/>
				
				<Route path="/comptabilite/:UUID" element={<Compta.byUUID/>}/>
				<Route path="/comptabilite" element={<Compta.all/>}/>
				
				<Route path="/jobs" element={<Jobs/>}/>
				<Route path="/jobs/offer/:jobOfferID" element={<JobOffers.byID/>}/>
				<Route path="/jobs/offers/add" element={<JobOffers.add/>}/>
				<Route path="/jobs/offers" element={<JobOffers.all/>}/>
				
				<Route path="*" element={<Errors.NotFound/>}/>
			</Routes>
		</div>
	);
}

export default App;
