import { Link } from "react-router-dom";
import Loader from "../../../components/Loader/Loader.js";
import useStudents from "../../../hooks/students/useStudents.js";

function StudentsAll() {
	/* ---- States ---------------------------------- */
	const students = useStudents({ withModules: true });
	
	/* ---- Page content ---------------------------- */
	return (
		<div className="Students StudentsAll">
			<Link to="/">&lt;-- Retour</Link>
			
			{!students.isUsable() ? (students.isLoading && <Loader/>) : (
				<table>
					<thead>
						<tr>
							<th>Pr&eacute;nom</th>
							<th>Nom</th>
							<th>Adresse e-mail</th>
							<th>Date de naissance</th>
							<th>Niveau actuel</th>
							<th>Campus</th>
							<th>Region</th>
							<th>Modules</th>
						</tr>
					</thead>
					
					<tbody>
						{students.data.map(student => (
							<tr key={`students-list-student-${student.user_id}`}>
								<td className="student-first-name">{student.first_name}</td>
								<td className="student-last-name">{student.last_name}</td>
								<td className="student-email">{student.email}</td>
								<td className="student-birth-date">{student.birth_date}</td>
								<td className="student-current-level">{student.study.current_level}</td>
								<td className="student-campus">{student.campus.name}</td>
								<td className="student-region">{student.region}</td>
								<td className="student-modules">{student.modules.map(m => `${m.year}${m.name}`).join(", ")}</td>
							</tr>
						))}
					</tbody>
				</table>
			)}
		</div>
	);
}

export default StudentsAll;
