import { useState } from "react";
import Collapsible from "../../components/Collapsible/Collapsible.js";
import "./Notes.css";

function Notes() {
	/* ---- States ---------------------------------- */
	const firstName = "Jean-Michel";
	const lastName = "Eudes";
	const campus = "Isle McDonald";
	const [notes] = useState([
		{moduleName: "1WORK", note: 10.5},
		{moduleName: "1TEAM", note: 15.0},
		{moduleName: "2JAVA", note: 16.25}
	]);

	/* ---- Page content ---------------------------- */
	return (
		<>
			<h2>Notes de {firstName} {lastName}</h2>
			<h3>Campus de {campus}</h3>
			<div>
				{notes.map((module, index) => {
					return (
						<Collapsible key={`module-${index}-note`} title={module.moduleName}>
							<p>{module.note}</p>
						</Collapsible>
					);
				})}
			</div>
		</>
	);
}

export default Notes;