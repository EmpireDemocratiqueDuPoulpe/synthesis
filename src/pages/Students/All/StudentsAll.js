import { useState } from "react";
import { Link } from "react-router-dom";
import useAuth from "../../../context/Auth/AuthContext.js";
import Loader from "../../../components/Loader/Loader.js";
import useStudents from "../../../hooks/students/useStudents.js";
import useModules from "../../../hooks/modules/useModules.js";
import { sortObjectArr } from "../../../global/Functions.js";

function StudentsAll() {
	/* ---- States ---------------------------------- */
	const { permissions } = useAuth();
	const [sortBy, setSortBy] = useState("first_name");
	const students = useStudents({
		expand: [
			(permissions.READ_CAMPUS ? "campus" : ""), (permissions.READ_MODULES ? "module" : ""),
			(permissions.READ_ECTS ? "ects" : "")
		].filter(Boolean)
	});
	const modules = useModules({}, { enabled: sortBy === "modules" });
	
	/* ---- Functions ------------------------------- */
	const handleSortChange = event => {
		setSortBy(event.target.value);
	};
	
	const sortStudentsByPassed = students => {
		return students.sort((studA, studB) => (
			(studA.hasPassed === studB.hasPassed) ? 0 : (
				studA.hasPassed ? 1 : (
					studB.hasPassed ? 1 : (
						studA.hasPassed === false ? 1 : -1
					)
				)
			)
		));
	};
	
	const hasPassed = (student, module) => {
		student.hasPassed = (!module || !module.notes) ? null : (
			module.notes.length === 0 ? null : (
				(module.notes.reduce((acc, value) => acc + value.note, 0) / module.notes.length) >= 10
			)
		);
		student.noteCalc = true;
		
		return student;
	};
	
	/* ---- Page content ---------------------------- */
	return (
		<div className="Students StudentsAll">
			<Link to="/">&lt;-- Retour</Link>
			
			<select value={sortBy} onChange={handleSortChange}>
				<option value="first_name">Pr&eacute;nom</option>
				<option value="last_name">Nom</option>
				<option value="email">Adresse email</option>
				<option value="birthdate" disabled>Date de naissance</option>
				<option value="study.current_level">Niveau actuel</option>
				{permissions.READ_CAMPUS && <option value="campus.name">Campus</option>}
				<option value="region">R&eacute;gion</option>
				{permissions.READ_MODULES && <option value="modules">Modules</option>}
			</select>
			
			{!students.isUsable() ? (students.isLoading && <Loader/>) : (
				<>
					{sortBy !== "modules" ? (
						<table>
							<thead>
								<tr>
									<th>Pr&eacute;nom</th>
									<th>Nom</th>
									<th>Adresse e-mail</th>
									<th>Date de naissance</th>
									<th>Niveau actuel</th>
									{permissions.READ_CAMPUS && <th>Campus</th>}
									<th>R&eacute;gion</th>
									{permissions.READ_MODULES && <th>Modules</th>}
								</tr>
							</thead>
							
							<tbody>
								{students.data.sort((a, b) => sortObjectArr(sortBy, a, b)).map(student => (
									<tr key={`students-list-student-${student.user_id}`}>
										<td className="student-first-name">{student.first_name}</td>
										<td className="student-last-name">{student.last_name}</td>
										<td className="student-email">{student.email}</td>
										<td className="student-birth-date">{student.birth_date}</td>
										<td className="student-current-level">{student.study.current_level}</td>
										{permissions.READ_CAMPUS && <td className="student-campus">{student.campus.name}</td>}
										<td className="student-region">{student.region}</td>
										{permissions.READ_MODULES && (
											<td className="student-modules">
												{student.modules.map(module =>
													`${module.year}${module.name}(${hasPassed(student, module).hasPassed === null ? "N/A" : (student.hasPassed ? "✓" : "×")})`
												).join(", ")}
											</td>
										)}
									</tr>
								))}
							</tbody>
						</table>
					) : (!modules.isUsable() ? (modules.isLoading && <Loader/>) : (modules.data.map(module => {
						const studs = students.data.filter(s => s.modules.some(m => m.module_id === module.module_id));
						
						return studs.length === 0 ? null : (
							<div key={`students-list-module-${module.module_id}`}>
								<h2>{module.year}{module.name}</h2>
								<table>
									<thead>
										<tr>
											<th>Pr&eacute;nom</th>
											<th>Nom</th>
											<th>Adresse e-mail</th>
											<th>Date de naissance</th>
											<th>Niveau actuel</th>
											{permissions.READ_CAMPUS && <th>Campus</th>}
											<th>R&eacute;gion</th>
											<th>Valid&eacute;</th>
										</tr>
									</thead>
									
									<tbody>
										{studs.map(s => hasPassed(s, s.modules.filter(m => m.module_id === module.module_id)[0])).sort(sortStudentsByPassed).map(student => (
											<tr key={`students-list-student-${student.user_id}`}>
												<td className="student-first-name">{student.first_name}</td>
												<td className="student-last-name">{student.last_name}</td>
												<td className="student-email">{student.email}</td>
												<td className="student-birth-date">{student.birth_date}</td>
												<td className="student-current-level">{student.study.current_level}</td>
												{permissions.READ_CAMPUS && <td className="student-campus">{student.campus.name}</td>}
												<td className="student-region">{student.region}</td>
												<td className="student-modules">{student.hasPassed === null ? "N/A" : (student.hasPassed ? "✓" : "×")}</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						);
					})))}
				</>
			)}
		</div>
	);
}

export default StudentsAll;
