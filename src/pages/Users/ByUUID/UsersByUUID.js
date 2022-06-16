import { useParams } from "react-router-dom";
import useAuth from "../../../context/Auth/AuthContext.js";
import useUsers from "../../../hooks/users/useUsers.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { regular } from "@fortawesome/fontawesome-svg-core/import.macro";
import Loader from "../../../components/Loader/Loader.js";
import { calcECTS, sortDate, isoStrToDate } from "../../../global/Functions.js";
import teamsIcon from "../../../assets/images/teams_icon/Teams-16x16.png";

function UsersByUUID() {
	/* ---- States ---------------------------------- */
	const { UUID } = useParams();
	const { hasPermission, permissions } = useAuth();
	const user = useUsers({ UUID, expand: [
		(hasPermission(permissions.READ_CAMPUS) ? "campus~" : ""), "study~",
		(hasPermission(permissions.READ_MODULES) ? "module~" : ""), (hasPermission(permissions.READ_ECTS) ? "ects~" : ""),
		(hasPermission(permissions.READ_STUDENTS_JOBS) ? "job~" : ""), (hasPermission(permissions.READ_COMPTA) ? "compta~" : ""),
	].filter(Boolean)
	});

	/* ---- Page content ---------------------------- */
	return (
		<div className="Users UsersByUUID">
			{!user.isUsable() ? (user.isLoading && <Loader/>) : (
				<>
					<a href={`mailto:${user.data.email}`}>
						<FontAwesomeIcon icon={regular("envelope")} size="1x"/> Envoyer un mail
					</a>

					<a href={`https://teams.microsoft.com/l/chat/0/0?users=${user.data.email}`} target="_blank" rel="noreferrer">
						<img src={teamsIcon} alt="Microsoft Teams"/> Envoyer un message
					</a>

					<h2>{user.data.first_name} {user.data.last_name}</h2>
					<p>{user.data.position.name}</p>
					<p>{user.data.email}</p>

					<div>
						<h3>Informations</h3>
						<p>{user.data.birth_date}</p>
						<p>{user.data.street_address}</p>
						<p>{user.data.gender}</p>
						<p>{user.data.region}</p>
					</div>

					{(hasPermission(permissions.READ_CAMPUS) && user.data.campus) && (
						<div>
							<h3>Campus de {user.data.campus.name}</h3>
							<p>{user.data.campus.address_street}, {user.data.campus.address_city} ({user.data.campus.address_postal_code})</p>
						</div>
					)}

					{(user.data.study || user.data.modules) && (
						<div>
							{user.data.study && (
								<>
									<h3>Études</h3>
									<p>Arriv&eacute; en: {user.data.study.entry_level}{user.data.study.entry_date && ` le ${user.data.study.entry_date}`}</p>
									<p>{user.data.study.exit_level || user.data.study.exit_date ? (
										`Parti${user.data.study.exit_level && ` en ${user.data.study.exit_level}`}${user.data.study.exit_date && ` le ${user.data.study.exit_date}`}`
									) : `En ${user.data.study.current_level}`}</p>
								</>
							)}

							{(hasPermission(permissions.READ_MODULES) && user.data.modules) && (
								<div>
									<h4>Modules</h4>
									<ul>
										{user.data.modules.map(module => (
											<li key={`user-profile-module-${module.module_id}`}>
												{module.year}{module.name}{hasPermission(permissions.READ_ECTS) && (
													<>
													- {calcECTS(module).ects}/{module.ects} ECTS
														<ul>
															{module.notes && (module.notes.map(note => (
																<li key={`user-profile-module-${module.module_id}-note-${note.note_id}`}>{note.note}/20</li>
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
					)}

					{(hasPermission(permissions.READ_STUDENTS_JOBS) && user.data.jobs) && (
						<div>
							<h3>Stages et alternances</h3>

							<ul>
								{user.data.jobs.sort(sortDate).map(job => (
									<li key={`user-profile-job-${job.job_id}`}>
										<span>{job.type}: {job.company_name}</span> <br/>
										<span>Du {isoStrToDate(job.start_date).toLocaleDateString()}{job.end_date && (` au ${isoStrToDate(job.end_date).toLocaleDateString()}`)}</span>
									</li>
								))}
							</ul>
						</div>
					)}
				</>
			)}
		</div>
	);
}

export default UsersByUUID;