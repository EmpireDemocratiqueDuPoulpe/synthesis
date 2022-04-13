import { Routes, Route } from "react-router-dom";
import Home from "../Home/Home.js";
import Login from "../Login/Login.js";
import LoginAD from "../LoginAD/LoginAD.js";
import Compta from "../Compta/Compta.js";
import JobOffer from "../JobOffer/JobOffer.js";
import JobOffers from "../JobOffers/JobOffers.js";
import Notes from "../Notes/Notes.js";
import "./App.css";

function App() {
	/* ---- Page content ---------------------------- */
	return (
		<div className="App">
			<Routes>
				<Route path="/" element={<Home/>}/>
				<Route path="/login/active-directory" element={<LoginAD/>}/>
				<Route path="/login" element={<Login/>}/>
				<Route path="/notes" element={<Notes/>}/>
				<Route path="/comptabilite" element={<Compta/>}/>
				<Route path="/jobs/offer/:jobOfferID" element={<JobOffer/>}/>
				<Route path="/jobs/offers" element={<JobOffers/>}/>
			</Routes>
		</div>
	);
}

export default App;
