import { useState } from "react";
import { Link } from "react-router-dom";
import Select from "react-select";
import useAuth from "../../context/Auth/AuthContext.js";
import useNotesOfUser from "../../hooks/notes/useNotesOfUser.js";
import useStudies from "../../hooks/studies/useStudies.js";
import Collapsible from "../../components/Collapsible/Collapsible.js";
import Loader from "../../components/Loader/Loader.js";
import "./Notes.css";

function Notes() {
	/* ---- States ---------------------------------- */
	const { user } = useAuth();
	const study = useStudies({ userID: user.user_id });
	const ects = { current: 0, total: 0 };
	const yearsOptions = [
		{ value: 1, label: "A.Sc.1" },
		{ value: 2, label: "A.Sc.2" },
		{ value: 3, label: "B.Sc" },
		{ value: 4, label: "M.Eng.1" },
		{ value: 5, label: "M.Eng.2" }
	];
	const [selectedYears, setSelectedYears] = useState([yearsOptions[3]]);
	const notes = useNotesOfUser({ userID: user.user_id, years: selectedYears.map(y => y.value) });

	/* ---- Page content ---------------------------- */
	return (
		<div className="Notes">
			<Link to="/">&lt;-- Retour</Link>
			<h2>Notes de {user.first_name} {user.last_name}</h2>
			<h3>Campus de {user.campus.name}</h3>
			
			<div>
				{(!notes.isUsable() || !study.isUsable()) ? ((notes.isLoading || study.isLoading) && <Loader/>) : (
					<>
						<Select
							options={yearsOptions.filter(o => o.value <= study.data.current_level)}
							defaultValue={selectedYears}
							onChange={setSelectedYears}
							isMulti/>
						
						{notes.data.map(module => {
							ects.total += module.ects;
							ects.current += (module.notes.reduce((acc, note) => acc + note.note, 0) / module.notes.length) >= 10 ? module.ects : 0;
							return (
								<Collapsible key={`notes-list-module-${module.module_id}`} title={module.year + module.name}>
									{module.notes.map(note => (
										<p key={`notes-list-module-${module.module_id}-note-${note.note_id}`}>{note.note}</p>
									))}
								</Collapsible>
							);
						})}
					</>
				)}

			</div>
			<p>ECTS totaux : {ects.current}/{ects.total}</p>
		</div>
	);
}

export default Notes;
