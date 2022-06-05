import { useState } from "react";
import { Link } from "react-router-dom";
import useStudents from "../../hooks/students/useStudents.js";
import Loader from "../../components/Loader/Loader.js";
import SearchBar from "../../components/SearchBar/SearchBar.js";
import { sortObjectArr, isoStrToDate } from "../../global/Functions.js";

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
			<select value={sortBy} onChange={handleSortChange} disabled={!students.isUsable()}>
				<option value="first_name">Pr&eacute;nom</option>
				<option value="last_name">Nom</option>
				<option value="email">Adresse email</option>
				<option value="study.current_level">Niveau actuel</option>
				<option value="region">R&eacute;gion</option>
				<option value="jobs[0].type">Stage/Alternance</option>
				<option value="jobs[0].company_name">Entreprise</option>
				<option value="jobs[0].start_date">Date de d&eacute;but</option>
				<option value="jobs[0].end_date">Date de fin</option>
			</select>
			
			<SearchBar placeholder="Rechercher" value={search} setValue={setSearch} disabled/>
			
			{!students.isUsable() ? (students.isLoading && <Loader/>) : (
				<div>
					<table>
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
							{students.data.sort((a, b) => sortObjectArr(sortBy, a, b)).map(student => (
								<tr key={`hired-students-list-student-${student.user_id}`}>
									<td className="hired-student-first-name">{student.first_name}</td>
									<td className="hired-student-last-name">{student.last_name}</td>
									<td className="hired-student-email">{student.email}</td>
									<td className="hired-student-current-level">{student.study.current_level}</td>
									<td className="hired-student-region">{student.region}</td>
									<td className="hired-student-job-type">{student.jobs[0].type}</td>
									<td className="hired-student-job-company">{student.jobs[0].company_name}</td>
									<td className="hired-student-job-start">{isoStrToDate(student.jobs[0].start_date).toLocaleDateString()}</td>
									<td className="hired-student-job-end">{isoStrToDate(student.jobs[0].end_date).toLocaleDateString()}</td>
									<td className="student-action"><Link to={`/student/${student.uuid}`}>Vers le profil</Link></td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}
		</div>
	);
}

export default Jobs;
