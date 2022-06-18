import { useState } from "react";
import { Link } from "react-router-dom";
import useAuth from "../../context/Auth/AuthContext.js";
import useResitStudents from "../../hooks/resits/useResitStudents.js";
import useModules from "../../hooks/modules/useModules.js";
import SearchBar from "../../components/SearchBar/SearchBar.js";
import Loader from "../../components/Loader/Loader.js";
import Inputs from "../../components/Inputs/Inputs.js";
import Table from "../../components/Table/Table.js";
import { hasPassed, sortStudentsByPassed, sortObjectArr, filterObj } from "../../global/Functions.js";
import "./Resits.css";

const searchableColumns = ["first_name", "last_name", "birth_date", "study.current_level", "email", "campus.name", "region"];

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
	
	const sortAndFilter = data => {
		return data.sort((a, b) => sortObjectArr(sortBy, a, b)).filter(o => filterObj(o, searchableColumns, search));
	};
	
	/* ---- Page content ---------------------------- */
	return (
		<div className="Resits">
			<h2 className="page_title">Resits</h2>
			<div className="filters-root">
				<Inputs.Select
					name="resitsSelect"
					value={sortBy}
					onChange={handleSortChange}
					options={[
						{value:"first_name", label:"Prénom"},
						{value:"last_name", label:"Nom"},
						{value:"email", label:"Adresse email"},
						{value:"birthdate", label:"Date de naissance", disabled: true},
						{value:"study.current_level", label:"Niveau actuel"},
						(hasPermission(permissions.READ_CAMPUS) ? ({value:"campus.name", label:"Campus"}) : null),
						{value:"region", label:"Région"},
						(hasPermission(permissions.READ_MODULES) ? ({value: "modules", label: "Modules"}) : null)
					].filter(Boolean)}
					disabled={sortBy !== "modules" ? (!resitStudents.isUsable()) : (!resitStudents.isUsable() || !modules.isUsable())}
				>
					Trier par
				</Inputs.Select>

				<SearchBar placeholder="Rechercher" value={search} setValue={setSearch}/>
			</div>
			
			{!resitStudents.isUsable() ? (resitStudents.isLoading && <Loader/>) : (
				<>
					{sortBy !== "modules" ? (
						<Table data={sortAndFilter(resitStudents.data)} keyProp="user_id" header={
							<>
								<th>Pr&eacute;nom</th>
								<th>Nom</th>
								<th>Adresse e-mail</th>
								<th>Date de naissance</th>
								<th>Niveau actuel</th>
								{hasPermission(permissions.READ_CAMPUS) && <th>Campus</th>}
								<th>R&eacute;gion</th>
								{hasPermission(permissions.READ_MODULES) && <th>Modules</th>}
								<th>Actions</th>
							</>
						} body={row => (
							<>
								<td className="resit-student-first-name">{row.first_name}</td>
								<td className="resit-student-last-name">{row.last_name}</td>
								<td className="resit-student-email">{row.email}</td>
								<td className="resit-student-birth-date">{row.birth_date}</td>
								<td className="resit-student-current-level">{row.study.current_level}</td>
								{hasPermission(permissions.READ_CAMPUS) && <td className="resit-student-campus">{row.campus.name}</td>}
								<td className="resit-student-region">{row.region}</td>
								{hasPermission(permissions.READ_MODULES) && (
									<td className="resit-student-modules">
										{row.modules.map((module, m_index) => (
											<span key={`resit-student-modules-module-${module.module_id}`}>
												{module.year}{module.name}
												{hasPermission(permissions.READ_ECTS) && (
													<span className={`resit-student-module ${hasPassed(row, module).hasPassed === null ? "unknown" : (row.hasPassed ? "passed" : "not-passed")}`}>
																&nbsp;({row.hasPassed === null ? "N/A" : (row.hasPassed ? "✓" : "×")}
																	&nbsp;-&nbsp;{row.hasPassed ? module.ects : 0} ECTS)
														{m_index < (row.modules.length - 1) && ", "}
													</span>
												)}
											</span>
										))}
									</td>
								)}
								<td className="resit-student-action"><Link to={`/student/${row.uuid}`}>Vers le profil</Link></td>
							</>
						)}/>
					) : (!modules.isUsable() ? (modules.isLoading && <Loader/>) : (modules.data.map(module => {
						const studs = resitStudents.data.filter(s => s.modules.some(m => m.module_id === module.module_id));
						
						return studs.length === 0 ? null : (
							<div key={`resit-students-list-module-${module.module_id}`}>
								<h2>{module.year}{module.name}</h2>
								
								<Table data={studs.map(s => hasPassed(s, s.modules.filter(m => m.module_id === module.module_id)[0])).sort(sortStudentsByPassed)} keyProp="user_id" perPage={5} header={
									<>
										<th>Pr&eacute;nom</th>
										<th>Nom</th>
										<th>Adresse e-mail</th>
										<th>Date de naissance</th>
										<th>Niveau actuel</th>
										{hasPermission(permissions.READ_CAMPUS) && <th>Campus</th>}
										<th>R&eacute;gion</th>
										{hasPermission(permissions.READ_ECTS) && <th>Moyenne</th>}
										<th>Actions</th>
									</>
								} body={row => (
									<>
										<td className="resit-student-first-name">{row.first_name}</td>
										<td className="resit-student-last-name">{row.last_name}</td>
										<td className="resit-student-email">{row.email}</td>
										<td className="resit-student-birth-date">{row.birth_date}</td>
										<td className="resit-student-current-level">{row.study.current_level}</td>
										{hasPermission(permissions.READ_CAMPUS) && <td className="resit-student-campus">{row.campus.name}</td>}
										<td className="resit-student-region">{row.region}</td>
										{hasPermission(permissions.READ_ECTS) && <td className="resit-student-mean">{row[`mean-${module.module_id}`]}/20</td>}
										<td className="resit-student-action"><Link to={`/student/${row.uuid}`}>Vers le profil</Link></td>
									</>
								)}/>
							</div>
						);
					})))}
				</>
			)}
		</div>
	);
}

export default Resits;
