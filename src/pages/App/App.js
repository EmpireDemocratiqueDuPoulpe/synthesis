import { Routes, Route } from "react-router-dom";
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
import "./App.css";

function App() {
	/* ---- Page content ---------------------------- */
	// TODO: Choose between french/english urls
	return (
		<div className="App">
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
			</Routes>
		</div>
	);
}

export default App;
