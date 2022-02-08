import { Routes, Route } from "react-router-dom";
import Login from "../Login/Login.js";
import Notes from "../Notes/Notes.js";
import "./App.css";

function App() {
	/* ---- Page content ---------------------------- */
	return (
		<div className="App">
			<Routes>
				<Route path="/login" element={<Login/>}/>
				<Route path="/notes" element={<Notes/>}/>
			</Routes>
		</div>
	);
}

export default App;
