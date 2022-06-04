import { useState } from "react";
import Select from "react-select";
import useAuth from "../../context/Auth/AuthContext.js";
import useNotesOfUser from "../../hooks/notes/useNotesOfUser.js";
import Collapsible from "../../components/Collapsible/Collapsible.js";
import Loader from "../../components/Loader/Loader.js";
import { calcECTS } from "../../global/Functions.js";
import "./Notes.css";

function Notes() {
	/* ---- States ---------------------------------- */
	const { user } = useAuth();
	const ects = { current: 0, total: 0 };
	const yearsOptions = [
		{ value: 1, label: "A.Sc.1" },
		{ value: 2, label: "A.Sc.2" },
		{ value: 3, label: "B.Sc" },
		{ value: 4, label: "M.Eng.1" },
		{ value: 5, label: "M.Eng.2" }
	];
	const [selectedYears, setSelectedYears] = useState(user.study ? [yearsOptions[user.study.current_level - 1]] : []);
	const notes = useNotesOfUser({ userID: user.user_id, years: selectedYears.map(y => y.value) });

	/* ---- Page content ---------------------------- */
	return (
		<div className="Notes">
			<h2>Notes de {user.first_name} {user.last_name}</h2>
			<h3>Campus de {user.campus.name}</h3>
			
			<div>
				{(!notes.isUsable()) ? (notes.isLoading && <Loader/>) : (
					<>
						<Select
							options={user.study ? yearsOptions.filter(o => o.value <= user.study.current_level) : yearsOptions}
							defaultValue={selectedYears}
							onChange={setSelectedYears}
							isMulti/>
						
						{notes.data.map(module => {
							ects.total += module.ects;
							ects.current += calcECTS(module).ects;
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
