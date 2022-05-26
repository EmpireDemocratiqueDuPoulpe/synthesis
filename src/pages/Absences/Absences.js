import { useState } from "react";
import Select from "react-select";
import useAuth from "../../context/Auth/AuthContext.js";
import useNotesOfUser from "../../hooks/notes/useAbsencesOfUser.js";
import useStudies from "../../hooks/studies/useStudies.js";
import Loader from "../../components/Loader/Loader.js";
import "./Absences.css";
import {Link} from "react-router-dom";

function Absences() {
	/* ---- States ---------------------------------- */
	const { user } = useAuth();
	const study = useStudies({ userID: user.user_id });
    

	/* ---- Page content ---------------------------- */
	return (
		<div className="Absences">
			<Link to="/">&lt;-- Retour</Link>
			<h2>Absences de {user.first_name} {user.last_name}</h2>
			<h3>Campus de {user.campus.name}</h3>
			<div>
				{(!notes.isUsable() || !study.isUsable()) ? ((notes.isLoading || study.isLoading) && <Loader/>) : (
					<>
						<Select
							options={yearsOptions.filter(o => o.value <= study.data.current_level)}
							defaultValue={selectedYears}
							onChange={setSelectedYears}
							isMulti/>
						{notes.data.map((module, mIndex) => {
							ects.total += module.ects;
							ects.current += (module.notes.reduce((acc, note) => acc + note.note, 0) / module.notes.length) >= 10 ? module.ects : 0;
							return (
								<Collapsible key={`module-${mIndex}`} title={module.year + module.name}>
									{module.notes.map((note, nIndex) => (
										<p key={`module-${mIndex}-note-${nIndex}`}>{note.note}</p>
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

export default Absences;
