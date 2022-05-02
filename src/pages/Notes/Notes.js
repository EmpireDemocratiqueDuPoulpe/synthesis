import { useState } from "react";
import Select from "react-select";
import useAuth from "../../context/Auth/AuthContext.js";
import useNotesOfUser from "../../hooks/Notes/useNotesOfUser.js";
import Collapsible from "../../components/Collapsible/Collapsible.js";
import Loader from "../../components/Loader/Loader.js";
import "./Notes.css";

function Notes() {
	/* ---- States ---------------------------------- */
	const { user } = useAuth();
	const ects = { current: 0, total: 0 };
	const [selectedYear, setSelectedYear] = useState(4);
	const notes = useNotesOfUser({ userID: user.user_id });

	const yearsOptions = [
		{ value: 1, label: "A.Sc.1" },
		{ value: 2, label: "A.Sc.2" },
		{ value: 3, label: "B.Sc" },
		{ value: 4, label: "M.Eng.1" },
		{ value: 5, label: "M.Eng.2" }
	];

	/* ---- Page content ---------------------------- */
	return (
		<div className="Notes">
			<h2>Notes de {user.first_name} {user.last_name}</h2>
			<h3>Campus de {user.campus}</h3>
			<div>
				<Select
					options={yearsOptions}
					defaultValue={selectedYear}
					onChange={(e) =>
						(parseInt(e.target.value, 10))}>
					{/*<option value="1">A.Sc.1</option>
					<option value="2">A.Sc.2</option>
					<option value="3">B.Sc.1</option>
					<option value="4">M.Eng.1</option>
					<option value="5">M.Eng.2</option>*/}
				</Select>
				{!notes.isUsable() ? (notes.isLoading && <Loader/>) : (
					notes.data.filter((m) => m.year === selectedYear).map((module, mIndex) => {
						ects.total += module.ects;
						ects.current += (module.notes.reduce((acc, note) => acc + note.note, 0) / module.notes.length) >= 10 ? module.ects : 0;
						return (
							<Collapsible key={`module-${mIndex}`} title={module.year + module.name}>
								{module.notes.map((note, nIndex) => (
									<p key={`module-${mIndex}-note-${nIndex}`}>{note.note}</p>
								))}
							</Collapsible>
						);
					})
				)}

			</div>
			<p>ECTS totaux : {ects.current}/{ects.total}</p>
		</div>
	);
}

export default Notes;
