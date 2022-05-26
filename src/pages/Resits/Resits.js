import { useState } from "react";
import { Link } from "react-router-dom";
import useAuth from "../../context/Auth/AuthContext.js";
import useResitStudents from "../../hooks/resits/useResitStudents.js";
import useModules from "../../hooks/modules/useModules.js";
import SearchBar from "../../components/SearchBar/SearchBar.js";
import Loader from "../../components/Loader/Loader.js";
import { hasPassed, sortStudentsByPassed, sortObjectArr} from "../../global/Functions.js";
import "./Resits.css";

function Resits() {
	/* ---- States ---------------------------------- */
	const { hasPermission, permissions } = useAuth();
	const [sortBy, setSortBy] = useState("first_name");
	const [search, setSearch] = useState("");
	const resitStudents = useResitStudents({
		expand: [(hasPermission(permissions.READ_CAMPUS) ? "campus" : "")].filter(Boolean)
	});
	const modules = useModules({}, { enabled: sortBy === "modules" });
	
	/* ---- Functions ------------------------------- */
	const handleSortChange = event => {
		setSortBy(event.target.value);
	};
	
	/* ---- Page content ---------------------------- */
	return (
		<div className="Resits">
			<Link to="/">&lt;-- Retour</Link>
			
			<select value={sortBy} onChange={handleSortChange} disabled={sortBy !== "modules" ? (!resitStudents.isUsable()) : (!resitStudents.isUsable() || !modules.isUsable())}>
				<option value="first_name">Pr&eacute;nom</option>
				<option value="last_name">Nom</option>
				<option value="email">Adresse email</option>
				<option value="birthdate" disabled>Date de naissance</option>
				<option value="study.current_level">Niveau actuel</option>
				{hasPermission(permissions.READ_CAMPUS) && <option value="campus.name">Campus</option>}
				<option value="region">R&eacute;gion</option>
				{hasPermission(permissions.READ_MODULES) && <option value="modules">Modules</option>}
			</select>
			
			<SearchBar placeholder="Rechercher" value={search} setValue={setSearch} disabled/>
			
			{!resitStudents.isUsable() ? (resitStudents.isLoading && <Loader/>) : (
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
									{hasPermission(permissions.READ_CAMPUS) && <th>Campus</th>}
									<th>R&eacute;gion</th>
									{hasPermission(permissions.READ_MODULES) && <th>Modules</th>}
									<th>Actions</th>
								</tr>
							</thead>
							
							<tbody>
								{resitStudents.data.sort((a, b) => sortObjectArr(sortBy, a, b)).map(resitStudent => (
									<tr key={`resit-students-list-student-${resitStudent.user_id}`}>
										<td className="resit-student-first-name">{resitStudent.first_name}</td>
										<td className="resit-student-last-name">{resitStudent.last_name}</td>
										<td className="resit-student-email">{resitStudent.email}</td>
										<td className="resit-student-birth-date">{resitStudent.birth_date}</td>
										<td className="resit-student-current-level">{resitStudent.study.current_level}</td>
										{hasPermission(permissions.READ_CAMPUS) && <td className="resit-student-campus">{resitStudent.campus.name}</td>}
										<td className="resit-student-region">{resitStudent.region}</td>
										{hasPermission(permissions.READ_MODULES) && (
											<td className="resit-student-modules">
												{resitStudent.modules.map((module, m_index) => (
													<span key={`resit-student-modules-module-${module.module_id}`}>
														{module.year}{module.name}
														{hasPermission(permissions.READ_ECTS) && (
															<span className={`resit-student-module ${hasPassed(resitStudent, module).hasPassed === null ? "unknown" : (resitStudent.hasPassed ? "passed" : "not-passed")}`}>
																&nbsp;({resitStudent.hasPassed === null ? "N/A" : (resitStudent.hasPassed ? "✓" : "×")}
																&nbsp;-&nbsp;{resitStudent.hasPassed ? module.ects : 0} ECTS)
																{m_index < (resitStudent.modules.length - 1) && ", "}
															</span>
														)}
													</span>
												))}
											</td>
										)}
										<td className="resit-student-action"><Link to={`/student/${resitStudent.uuid}`}>Vers le profil</Link></td>
									</tr>
								))}
							</tbody>
						</table>
					) : (!modules.isUsable() ? (modules.isLoading && <Loader/>) : (modules.data.map(module => {
						const studs = resitStudents.data.filter(s => s.modules.some(m => m.module_id === module.module_id));
						
						return studs.length === 0 ? null : (
							<div key={`resit-students-list-module-${module.module_id}`}>
								<h2>{module.year}{module.name}</h2>
								<table>
									<thead>
										<tr>
											<th>Pr&eacute;nom</th>
											<th>Nom</th>
											<th>Adresse e-mail</th>
											<th>Date de naissance</th>
											<th>Niveau actuel</th>
											{hasPermission(permissions.READ_CAMPUS) && <th>Campus</th>}
											<th>R&eacute;gion</th>
											{hasPermission(permissions.READ_ECTS) && <th>Moyenne</th>}
											<th>Actions</th>
										</tr>
									</thead>
									
									<tbody>
										{studs.map(s => hasPassed(s, s.modules.filter(m => m.module_id === module.module_id)[0])).sort(sortStudentsByPassed).map(resitStudent => (
											<tr key={`resit-students-list-student-${resitStudent.user_id}`}>
												<td className="resit-student-first-name">{resitStudent.first_name}</td>
												<td className="resit-student-last-name">{resitStudent.last_name}</td>
												<td className="resit-student-email">{resitStudent.email}</td>
												<td className="resit-student-birth-date">{resitStudent.birth_date}</td>
												<td className="resit-student-current-level">{resitStudent.study.current_level}</td>
												{hasPermission(permissions.READ_CAMPUS) && <td className="resit-student-campus">{resitStudent.campus.name}</td>}
												<td className="resit-student-region">{resitStudent.region}</td>
												{hasPermission(permissions.READ_ECTS) && <td className="resit-student-mean">{resitStudent[`mean-${module.module_id}`]}/20</td>}
												<td className="resit-student-action"><Link to={`/student/${resitStudent.uuid}`}>Vers le profil</Link></td>
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

export default Resits;
