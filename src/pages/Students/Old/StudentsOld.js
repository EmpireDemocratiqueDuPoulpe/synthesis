import { Link } from "react-router-dom";
import { useState } from "react";
import useAuth from "../../../context/Auth/AuthContext.js";
import useStudents from "../../../hooks/students/useStudents.js";
import Loader from "../../../components/Loader/Loader.js";
import SearchBar from "../../../components/SearchBar/SearchBar.js";
import { sortObjectArr, filterObj } from "../../../global/Functions.js";
import Inputs from "../../../components/Inputs/Inputs";

const searchableColumns = ["first_name", "last_name", "birth_date", "study.exit_level", "study.exit_date", "email", "campus.name", "region"];

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
			<h2 className="page_title">Liste des anciens étudiants</h2>

			<div className="filters-root">
				<Inputs.Select
					name="studentsSelect"
					value={sortBy}
					onChange={handleSortChange}
					options={[
						{value:"first_name", label:"Prénom"},
						{value:"last_name", label:"Nom"},
						{value:"email", label:"Adresse email"},
						{value:"birthdate", label:"Date de naissance", disabled: true},
						{value:"study.current_level", label:"Niveau actuel"},
						(hasPermission(permissions.READ_CAMPUS) ? ({value: "campus.name", label: "Campus"}) : null),
						{value:"region", label:"Région"}

					].filter(Boolean)}
					disabled={!students.isUsable()}
				>
					Trier par
				</Inputs.Select>

				<SearchBar placeholder="Rechercher" value={search} setValue={setSearch}/>
			</div>
			
			{!students.isUsable() ? (students.isLoading && <Loader/>) : (
				<div className="TableMainWrapper">
					<table className="TableMain">
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
								<th>Actions</th>
							</tr>
						</thead>

						<tbody>
							{students.data.sort((a, b) => sortObjectArr(sortBy, a, b)).filter(o => filterObj(o, searchableColumns, search)).map(student => (
								<tr key={`students-old-list-student-${student.user_id}`}>
									<td className="student-old-first-name">{student.first_name}</td>
									<td className="student-old-last-name">{student.last_name}</td>
									<td className="student-old-email">{student.email}</td>
									<td className="student-old-birth-date">{student.birth_date}</td>
									<td className="student-old-exit-level">{student.study.exit_level}</td>
									<td className="student-old-exit-date">{student.study.exit_date}</td>
									{hasPermission(permissions.READ_CAMPUS) && <td className="student-old-campus">{student.campus.name}</td>}
									<td className="student-old-region">{student.region}</td>
									<td className="student-old-action"><Link to={`/user/${student.uuid}`}>Vers le profil</Link></td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}
		</div>
	);
}

export default StudentsOld;
