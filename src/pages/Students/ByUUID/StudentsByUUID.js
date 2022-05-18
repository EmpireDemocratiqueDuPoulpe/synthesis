import { useParams, useNavigate } from "react-router-dom";
import useAuth from "../../../context/Auth/AuthContext.js";
import useStudents from "../../../hooks/students/useStudents.js";
import Loader from "../../../components/Loader/Loader.js";
import { calcECTS } from "../../../global/Functions.js";

function StudentsByUUID() {
	/* ---- States ---------------------------------- */
	const { UUID } = useParams();
	const { hasPermission, permissions } = useAuth();
	const student = useStudents({ UUID, expand: [
		(hasPermission(permissions.READ_CAMPUS) ? "campus" : ""), (hasPermission(permissions.READ_MODULES) ? "module" : ""),
		(hasPermission(permissions.READ_ECTS) ? "ects" : "")
	].filter(Boolean)
	});
	const navigate = useNavigate();
	
	/* ---- Page content ---------------------------- */
	return (
		<div className="Students StudentsByUUID">
			<button onClick={() => navigate(-1)}>&lt;-- Retour</button>
			
			{!student.isUsable() ? (student.isLoading && <Loader/>) : (
				<>
					<h2>{student.data.first_name} {student.data.last_name}</h2>
					<p>{student.data.position.name}</p>
					<p>{student.data.email}</p>
					
					<div>
						<h3>Informations</h3>
						<p>{student.data.birth_date}</p>
						<p>{student.data.street_address}</p>
						<p>{student.data.gender}</p>
						<p>{student.data.region}</p>
					</div>
					
					{hasPermission(permissions.READ_CAMPUS) && (
						<div>
							<h3>Campus de {student.data.campus.name}</h3>
							<p>{student.data.campus.address_street}, {student.data.campus.address_city} ({student.data.campus.address_postal_code})</p>
						</div>
					)}
					
					<div>
						<h3>Études</h3>
						<p>Arriv&eacute; en: {student.data.study.entry_level}{student.data.study.entry_date && ` le ${student.data.study.entry_date}`}</p>
						<p>{student.data.study.exit_level || student.data.study.exit_date ? (
							`Parti${student.data.study.exit_level && ` en ${student.data.study.exit_level}`}${student.data.study.exit_date && ` le ${student.data.study.exit_date}`}`
						) : `En ${student.data.study.current_level}`}</p>
						
						{hasPermission(permissions.READ_MODULES) && (
							<div>
								<h4>Modules</h4>
								<ul>
									{student.data.modules.map(module => (
										<li key={`student-profile-module-${module.module_id}`}>
											{module.year}{module.name}{hasPermission(permissions.READ_ECTS) && (
												<>
													- ${calcECTS(module).ects}/${module.ects} ECTS
													<ul>
														{module.notes && (module.notes.map(note => (
															<li key={`student-profile-module-${module.module_id}-note-${note.note_id}`}>{note.note}/20</li>
														)))}
													</ul>
												</>
											)}
										</li>
									))}
								</ul>
							</div>
						)}
					</div>
				</>
			)}
		</div>
	);
}

export default StudentsByUUID;
