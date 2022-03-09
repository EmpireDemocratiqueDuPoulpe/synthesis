import { useState, useEffect } from "react";
import useAuth from "../../context/Auth/AuthContext.js";
import Collapsible from "../../components/Collapsible/Collapsible.js";
import { API } from "../../config/config.js";
import "./Notes.css";
import useMessage from "../../context/Message/MessageContext.js";

function Notes() {
	/* ---- States ---------------------------------- */
	const messages = useMessage();
	const { user } = useAuth();

	const [notes, setNotes] = useState([]);

	//const [totalEcts, setTotalEcts] = useState(65);

	const [selectedYear, setSelectedYear] = useState(4);

	useEffect(() => {
		let fetching = false;
		if(!fetching){
			fetching = true;
			API.notes.getAllOfUser.fetch({ userID: user.user_id })
				.then(response => setNotes(response.notes))
				.catch(err => messages.add("error", err.error));
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	/* ---- Page content ---------------------------- */
	return (
		<div className="Notes">
			<h2>Notes de {user.first_name} {user.last_name}</h2>
			<h3>Campus de {user.campus}</h3>
			<div>
				<select value={selectedYear} onChange={(e) => setSelectedYear(parseInt(e.target.value, 10))}>
					<option value="1">A.Sc.1</option>
					<option value="2">A.Sc.2</option>
					<option value="3">B.Sc.1</option>
					<option value="4">M.Eng.1</option>
					<option value="5">M.Eng.2</option>
				</select>

				{notes.filter((n) => n.module.year === selectedYear).map((note, index) => {
					return (
						<Collapsible key={`module-${index}-note`} title={note.module.name}>
							<p>{note.note}</p>
						</Collapsible>
					);
				})}
			</div>
			<p>ECTS totaux : {notes.filter((n) => (n.module.year === selectedYear) && (n.note >= 10)).reduce((acc, note) => acc + note.module.ects, 0)}/60</p>
		</div>
	);
}

export default Notes;
