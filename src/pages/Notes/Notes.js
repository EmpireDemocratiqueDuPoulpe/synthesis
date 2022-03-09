import { useState } from "react";
import useAuth from "../../context/Auth/AuthContext.js";
import Collapsible from "../../components/Collapsible/Collapsible.js";
import "./Notes.css";

function Notes() {
	/* ---- States ---------------------------------- */
	const { user } = useAuth();

	const [modules] = useState([
		{moduleName: "1WORK", note: 10.5, year: 1, ects: 3},
		{moduleName: "1TEAM", note: 15.0, year: 1, ects: 2},
		{moduleName: "1PROG", note: 16.25, year: 2, ects: 4},
		{moduleName: "1PYTH", note: 10, year: 2, ects: 4},
		{moduleName: "1O365", note: 12.5, year: 2, ects: 3},
		{moduleName: "1GRAPH", note: 13, year: 2, ects: 2},
		{moduleName: "2AWSP", note: 8.75, year: 2, ects: 3},
		{moduleName: "2ALGO", note: 16, year: 2, ects: 1},
		{moduleName: "2PMGT", note: 18, year: 2, ects: 2},
		{moduleName: "2DVST", note: 14.25, year: 2, ects: 4},
		{moduleName: "2PHPD", note: 17, year: 2, ects: 3},
		{moduleName: "2UIXD", note: 15, year: 2, ects: 4},
		{moduleName: "3AGIL", note: 16.5, year: 2, ects: 2},
		{moduleName: "3DVSC", note: 14.75, year: 2, ects: 3},
		{moduleName: "3VRAR", note: 10, year: 2, ects: 4},
		{moduleName: "3BAEX", note: 13, year: 2, ects: 2},
		{moduleName: "3MERN", note: 15.25, year: 2, ects: 4},
		{moduleName: "3CCNA", note: 16, year: 2, ects: 3},
		{moduleName: "4BOSS", note: 19, year: 2, ects: 3},
		{moduleName: "4GDPR", note: 10.25, year: 2, ects: 3},
		{moduleName: "4PENE", note: 14.50, year: 2, ects: 3},
		{moduleName: "4DATA", note: 16.25, year: 2, ects: 3},
		{moduleName: "4DOKR", note: 10.75, year: 2, ects: 3},
		{moduleName: "4KUBE", note: 14, year: 2, ects: 2},
		{moduleName: "5DATA", note: 13.5, year: 2, ects: 2},
		{moduleName: "5RBIG", note: 17, year: 2, ects: 3},
		{moduleName: "5ENGL", note: 12, year: 2, ects: 4},
		{moduleName: "5MDDP", note: 13.75, year: 2, ects: 4},
		{moduleName: "5CCNA", note: 15.75, year: 2, ects: 3},
		{moduleName: "5ITIL", note: 16.25, year: 2, ects: 4}
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

				{modules.filter((m) => m.year === selectedYear).map((module, index) => {
					return (
						<Collapsible key={`module-${index}-note`} title={module.moduleName}>
							<p>{module.note}</p>
						</Collapsible>
					);
				})}
			</div>
			<p>ECTS totaux : {modules.filter((m) => (m.year === selectedYear) && (m.note >= 10)).reduce((acc, module) => acc + module.ects, 0)}/60</p>
		</>
	);
}

export default Notes;
