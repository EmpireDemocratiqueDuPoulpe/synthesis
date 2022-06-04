import { useState } from "react";
import useAuth from "../../../context/Auth/AuthContext.js";
import useStudents from "../../../hooks/students/useStudents.js";
import Loader from "../../../components/Loader/Loader.js";
import SearchBar from "../../../components/SearchBar/SearchBar.js";
import { sortObjectArr } from "../../../global/Functions.js";

function StudentsOld() {
	/* ---- States ---------------------------------- */
	const { hasPermission, permissions } = useAuth();
	const [sortBy, setSortBy] = useState("first_name");
	const [search, setSearch] = useState("");
	const students = useStudents({
		onlyOld: true,
		expand: [(hasPermission(permissions.READ_CAMPUS) ? "campus" : "")].filter(Boolean)
	});
	
	/* ---- Functions ------------------------------- */
	const handleSortChange = event => {
		setSortBy(event.target.value);
	};
	
	/* ---- Page content ---------------------------- */
	return (
		<div className="Students StudentsOld">
			<select value={sortBy} onChange={handleSortChange} disabled={!students.isUsable()}>
				<option value="first_name">Pr&eacute;nom</option>
				<option value="last_name">Nom</option>
				<option value="email">Adresse email</option>
				<option value="birthdate" disabled>Date de naissance</option>
				<option value="study.current_level">Niveau actuel</option>
				{hasPermission(permissions.READ_CAMPUS) && <option value="campus.name">Campus</option>}
				<option value="region">R&eacute;gion</option>
			</select>
			
			<SearchBar placeholder="Rechercher" value={search} setValue={setSearch} disabled/>
			
			{!students.isUsable() ? (students.isLoading && <Loader/>) : (
				<table>
					<thead>
						<tr>
							<th>Pr&eacute;nom</th>
							<th>Nom</th>
							<th>Adresse e-mail</th>
							<th>Date de naissance</th>
							<th>Niveau de sortie</th>
							<th>Date de sortie</th>
							{hasPermission(permissions.READ_CAMPUS) && <th>Campus</th>}
							<th>R&eacute;gion</th>
						</tr>
					</thead>
					
					<tbody>
						{students.data.sort((a, b) => sortObjectArr(sortBy, a, b)).map(student => (
							<tr key={`students-old-list-student-${student.user_id}`}>
								<td className="student-old-first-name">{student.first_name}</td>
								<td className="student-old-last-name">{student.last_name}</td>
								<td className="student-old-email">{student.email}</td>
								<td className="student-old-birth-date">{student.birth_date}</td>
								<td className="student-old-exit-level">{student.study.exit_level}</td>
								<td className="student-old-exit-date">{student.study.exit_date}</td>
								{hasPermission(permissions.READ_CAMPUS) && <td className="student-old-campus">{student.campus.name}</td>}
								<td className="student-old-region">{student.region}</td>
							</tr>
						))}
					</tbody>
				</table>
			)}
		</div>
	);
}

export default StudentsOld;
