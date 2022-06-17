import { useState } from "react";
import { Link } from "react-router-dom";
import useStudents from "../../hooks/students/useStudents.js";
import Loader from "../../components/Loader/Loader.js";
import SearchBar from "../../components/SearchBar/SearchBar.js";
import {sortObjectArr, isoStrToDate, filterObj} from "../../global/Functions.js";
import Inputs from "../../components/Inputs/Inputs.js";

const searchableColumns = ["first_name", "last_name", "birth_date", "study.current_level", "email", "jobs[0].company_name", "jobs[0].start_date", "jobs[0].end_date", "jobs[0].type", "region"];

function Jobs() {
	/* ---- States ---------------------------------- */
	const [sortBy, setSortBy] = useState("first_name");
	const [search, setSearch] = useState("");
	const students = useStudents({ expand: ["job<current>"] });
	
	/* ---- Functions ------------------------------- */
	const handleSortChange = event => {
		setSortBy(event.target.value);
	};
	
	/* ---- Page content ---------------------------- */
	return (
		<div className="Jobs">
			<h2 className="page_title">Stages/alternances</h2>
			<div className="filters-root">
				<Inputs.Select
					name="jobsSelect"
					value={sortBy}
					onChange={handleSortChange}
					options={[
						{value:"first_name", label:"Prénom"},
						{value:"last_name", label:"Nom"},
						{value:"email", label:"Adresse email"},
						{value:"study.current_level", label:"Niveau actuel"},
						{value:"region", label:"Région"},
						{value:"jobs[0].type", label:"Stage/Alternance"},
						{value:"jobs[0].company_name", label:"Entreprise"},
						{value:"jobs[0].start_date", label:"Date de début"},
						{value:"jobs[0].end_date", label:"Date de fin"}
					].filter(Boolean)}
					disabled={!students.isUsable()}
				>
					Trier par
				</Inputs.Select>

				<SearchBar placeholder="Rechercher" value={search} setValue={setSearch}/>
			</div>
			
			{!students.isUsable() ? (students.isLoading && <Loader/>) : (
				<div>
					<div className="TableMainWrapper">
						<table className="TableMain">
							<thead>
								<tr>
									<th>Pr&eacute;nom</th>
									<th>Nom</th>
									<th>Adresse e-mail</th>
									<th>Niveau actuel</th>
									<th>R&eacute;gion</th>
									<th>Stage/Alternance</th>
									<th>Entreprise</th>
									<th>Du</th>
									<th>Au</th>
									<th>Actions</th>
								</tr>
							</thead>

							<tbody>
								{students.data.sort((a, b) => sortObjectArr(sortBy, a, b)).filter(o => filterObj(o, searchableColumns, search)).map(student => (
									<tr key={`hired-students-list-student-${student.user_id}`}>
										<td className="hired-student-first-name">{student.first_name}</td>
										<td className="hired-student-last-name">{student.last_name}</td>
										<td className="hired-student-email">{student.email}</td>
										<td className="hired-student-current-level">{student.study.current_level}</td>
										<td className="hired-student-region">{student.region}</td>
										<td className="hired-student-job-type">{student.jobs[0].type === "contratpro" ? "Contrat de professionalisation" : "Stage"}</td>
										<td className="hired-student-job-company">{student.jobs[0].company_name}</td>
										<td className="hired-student-job-start">{isoStrToDate(student.jobs[0].start_date).toLocaleDateString()}</td>
										<td className="hired-student-job-end">{isoStrToDate(student.jobs[0].end_date).toLocaleDateString()}</td>
										<td className="student-action"><Link to={`/student/${student.uuid}`}>Vers le profil</Link></td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			)}
		</div>
	);
}

export default Jobs;
