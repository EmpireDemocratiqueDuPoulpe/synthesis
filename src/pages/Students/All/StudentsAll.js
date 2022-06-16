import { useState } from "react";
import { Link } from "react-router-dom";
import useAuth from "../../../context/Auth/AuthContext.js";
import useStudents from "../../../hooks/students/useStudents.js";
import useModules from "../../../hooks/modules/useModules.js";
import Loader from "../../../components/Loader/Loader.js";
import SearchBar from "../../../components/SearchBar/SearchBar.js";
import { hasPassed, sortStudentsByPassed, sortObjectArr } from "../../../global/Functions.js";
import Inputs from "../../../components/Inputs/Inputs.js";
import "./StudentAll.css";

function StudentsAll() {
	/* ---- States ---------------------------------- */
	const { hasPermission, permissions } = useAuth();
	const [sortBy, setSortBy] = useState("first_name");
	const [search, setSearch] = useState("");
	const students = useStudents({
		expand: [
			(hasPermission(permissions.READ_CAMPUS) ? "campus" : ""), (hasPermission(permissions.READ_MODULES) ? "module~" : ""),
			(hasPermission(permissions.READ_ECTS) ? "ects~" : "")
		].filter(Boolean)
	});
	const modules = useModules({}, { enabled: sortBy === "modules" });
	
	/* ---- Functions ------------------------------- */
	const handleSortChange = event => {
		setSortBy(event.target.value);
	};
	
	/* ---- Page content ---------------------------- */
	return (
		<div className="Students StudentsAll">
			<h2>Liste des étudiants</h2>
			<Inputs.Select
				name="studentsSelect"
				value={sortBy}
				onChange={handleSortChange}
				options={[
					{value:"first_name", label:"Prénom"},
					{value:"last_name", label:"Nom"},
					{value:"email", label:"Adresse email"},
					{value:"birthdate", label:"Date de naissance", disabled: true},
					(hasPermission(permissions.READ_CAMPUS) ? ({value:"campus.name", label:"Campus"}) : null),
					{value:"region", label:"Région"},
					(hasPermission(permissions.READ_MODULES) ? ({value: "modules", label: "Modules"}) : null)
				].filter(Boolean)}
				disabled={sortBy !== "modules" ? (!students.isUsable()) : (!students.isUsable() || !modules.isUsable())}
			>
				Trier par
			</Inputs.Select>
			
			<SearchBar placeholder="Rechercher" value={search} setValue={setSearch} disabled/>
			
			{!students.isUsable() ? (students.isLoading && <Loader/>) : (
				<>
					{sortBy !== "modules" ? (
						<div className="TableMainWrapper">
							<table className="TableMain">
								<thead>
									<tr>
										<th>Pr&eacute;nom</th>
										<th>Nom</th>
										<th>Adresse e-mail</th>
										<th>Date de naissance</th>
										<th>Niveau actuel</th>
										{hasPermission(permissions.READ_CAMPUS) && <th>Campus</th>}
										<th>R&eacute;gion</th>
										{hasPermission(permissions.READ_MODULES) && <th>Modules</th>}
										<th>Actions</th>
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
											{hasPermission(permissions.READ_CAMPUS) && <td className="student-campus">{student.campus.name}</td>}
											<td className="student-region">{student.region}</td>
											{hasPermission(permissions.READ_MODULES) && (
												<td className="student-modules">
													{student.modules.map((module, m_index) => (
														<span key={`student-modules-module-${module.module_id}`}>
															{module.year}{module.name}
															{hasPermission(permissions.READ_ECTS) && (
																<span className={`student-module ${hasPassed(student, module).hasPassed === null ? "unknown" : (student.hasPassed ? "passed" : "not-passed")}`}>
																&nbsp;({student.hasPassed === null ? "N/A" : (student.hasPassed ? "✓" : "×")}
																&nbsp;-&nbsp;{student.hasPassed ? module.ects : 0} ECTS)
																	{m_index < (student.modules.length - 1) && ", "}
																</span>
															)}
														</span>
													))}
												</td>
											)}
											<td className="student-action"><Link to={`/student/${student.uuid}`}>Vers le profil</Link></td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					) : (!modules.isUsable() ? (modules.isLoading && <Loader/>) : (modules.data.map(module => {
						const studs = students.data.filter(s => s.modules.some(m => m.module_id === module.module_id));
						
						return studs.length === 0 ? null : (
							<div key={`students-list-module-${module.module_id}`}>
								<h2>{module.year}{module.name}</h2>
								<div className="TableMainWrapper">
									<table className="TableMain">
										<thead>
											<tr>
												<th>Pr&eacute;nom</th>
												<th>Nom</th>
												<th>Adresse e-mail</th>
												<th>Date de naissance</th>
												<th>Niveau actuel</th>
												{hasPermission(permissions.READ_CAMPUS) && <th>Campus</th>}
												<th>R&eacute;gion</th>
												{hasPermission(permissions.READ_ECTS) && (
													<>
														<th>ECTS accumul&eacute;s</th>
														<th>ECTS totaux</th>
														<th>Valid&eacute;</th>
													</>
												)}
												<th>Actions</th>
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
													{hasPermission(permissions.READ_CAMPUS) && <td className="student-campus">{student.campus.name}</td>}
													<td className="student-region">{student.region}</td>
													{hasPermission(permissions.READ_ECTS) && (
														<>
															<td className="student-ects">{student.hasPassed ? module.ects : 0} ECTS</td>
															<td className="student-module-ects">{module.ects} ECTS</td>
															<td className="student-modules">{student.hasPassed === null ? "N/A" : (student.hasPassed ? "✓" : "×")}</td>
														</>
													)}
													<td className="student-action"><Link to={`/student/${student.uuid}`}>Vers le profil</Link></td>
												</tr>
											))}
										</tbody>
									</table>
								</div>
							</div>
						);
					})))}
				</>
			)}
		</div>
	);
}

export default StudentsAll;
