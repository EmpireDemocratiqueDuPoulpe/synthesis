import { Routes, Route } from "react-router-dom";
import Home from "../Home/Home.js";
import Login from "../Login/Login.js";
import Students from "../Students/Students.js";
import Compta from "../Compta/Compta.js";
import JobOffers from "../JobOffers/JobOffers.js";
import Notes from "../Notes/Notes.js";
import "./App.css";

function App() {
	/* ---- Page content ---------------------------- */
	// TODO: Choose between french/english urls
	return (
		<div className="App">
			<Routes>
				<Route path="/" element={<Home/>}/>
				<Route path="/login" element={<Login/>}/>
				
				<Route path="/students" element={<Students.all/>}/>
				
				<Route path="/notes" element={<Notes/>}/>
				<Route path="/comptabilite" element={<Compta/>}/>
				
				<Route path="/jobs/offer/:jobOfferID" element={<JobOffers.byID/>}/>
				<Route path="/jobs/offers/add" element={<JobOffers.add/>}/>
				<Route path="/jobs/offers" element={<JobOffers.all/>}/>
			</Routes>
		</div>
	);
}

export default App;
