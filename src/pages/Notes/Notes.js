import { useState } from "react";
import useAuth from "../../context/Auth/AuthContext.js";
import Collapsible from "../../components/Collapsible/Collapsible.js";
import "./Notes.css";

function Notes() {
	/* ---- States ---------------------------------- */
	const { user } = useAuth();

	const [notes] = useState([
		{moduleName: "1WORK", note: 10.5, year: 1},
		{moduleName: "1TEAM", note: 15.0, year: 1},
		{moduleName: "2JAVA", note: 16.25, year: 2}
	]);

	//const [totalEcts, setTotalEcts] = useState(65);

	const [selectedYear, setSelectedYear] = useState(4);


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

				{notes.filter((m) => m.year === selectedYear).map((module, index) => {
					return (
						<Collapsible key={`module-${index}-note`} title={module.moduleName}>
							<p>{module.note}</p>
						</Collapsible>
					);
				})}
			</div>
			<p>ECTS totaux : {notes.filter((m) => m.year === selectedYear).reduce((acc, note) => acc + note.note, 0)}/60</p>
		</div>
	);
}

export default Notes;
