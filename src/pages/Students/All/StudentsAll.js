import { Link } from "react-router-dom";
import useAuth from "../../../context/Auth/AuthContext.js";
import Loader from "../../../components/Loader/Loader.js";
import useStudents from "../../../hooks/students/useStudents.js";

function StudentsAll() {
	/* ---- States ---------------------------------- */
	const { permissions } = useAuth();
	const students = useStudents({
		expand: [
			(permissions.READ_CAMPUS ? "campus" : ""), (permissions.READ_MODULES ? "module" : ""),
			(permissions.READ_ECTS ? "ects" : "")
		].filter(Boolean)
	});
	
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
							{permissions.READ_CAMPUS && <th>Campus</th>}
							<th>Region</th>
							{permissions.READ_MODULES && <th>Modules</th>}
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
								{permissions.READ_CAMPUS && <td className="student-campus">{student.campus.name}</td>}
								<td className="student-region">{student.region}</td>
								{permissions.READ_MODULES && (
									<td className="student-modules">{student.modules.map(module => `${module.year}${module.name}${
										(module.notes.reduce((acc, value) => acc + value.note, 0) / module.notes.length) >= 10 ? "✓" : "×"
									}`).join(", ")}</td>
								)}
							</tr>
						))}
					</tbody>
				</table>
			)}
		</div>
	);
}

export default StudentsAll;
