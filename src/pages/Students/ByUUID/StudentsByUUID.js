import { useParams } from "react-router-dom";
import useAuth from "../../../context/Auth/AuthContext.js";
import useStudents from "../../../hooks/students/useStudents.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { regular } from "@fortawesome/fontawesome-svg-core/import.macro";
import Loader from "../../../components/Loader/Loader.js";
import { calcECTS, sortDate, isoStrToDate } from "../../../global/Functions.js";
import teamsIcon from "../../../assets/images/teams_icon/Teams-16x16.png";

function StudentsByUUID() {
	/* ---- States ---------------------------------- */
	const { UUID } = useParams();
	const { hasPermission, permissions } = useAuth();
	const student = useStudents({ UUID, expand: [
		(hasPermission(permissions.READ_CAMPUS) ? "campus" : ""), (hasPermission(permissions.READ_MODULES) ? "module~" : ""),
		(hasPermission(permissions.READ_ECTS) ? "ects~" : ""), (hasPermission(permissions.READ_STUDENTS_JOBS) ? "job~" : "")
	].filter(Boolean)
	});
	
	/* ---- Page content ---------------------------- */
	return (
		<div className="Students StudentsByUUID">
			{!student.isUsable() ? (student.isLoading && <Loader/>) : (
				<>
					<a href={`mailto:${student.data.email}`}>
						<FontAwesomeIcon icon={regular("envelope")} size="1x"/> Envoyer un mail
					</a>
					
					<a href={`https://teams.microsoft.com/l/chat/0/0?users=${student.data.email}`} target="_blank" rel="noreferrer">
						<img src={teamsIcon} alt="Microsoft Teams"/> Envoyer un message
					</a>
					
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
													- {calcECTS(module).ects}/{module.ects} ECTS
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
					
					<div>
						<h3>Stages et alternances</h3>
						
						<ul>
							{student.data.jobs && (student.data.jobs.sort(sortDate).map(job => (
								<li key={`student-profile-job-${job.job_id}`}>
									<span>{job.type}: {job.company_name}</span> <br/>
									<span>Du {isoStrToDate(job.start_date).toLocaleDateString()}{job.end_date && (` au ${isoStrToDate(job.end_date).toLocaleDateString()}`)}</span>
								</li>
							)))}
						</ul>
					</div>
				</>
			)}
		</div>
	);
}

export default StudentsByUUID;
