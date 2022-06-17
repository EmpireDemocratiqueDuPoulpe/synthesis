import { useParams } from "react-router-dom";
import useUsers from "../../../hooks/users/useUsers.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { regular } from "@fortawesome/fontawesome-svg-core/import.macro";
import Loader from "../../../components/Loader/Loader.js";
import { calcECTS, sortDate, isoStrToDate } from "../../../global/Functions.js";
import teamsIcon from "../../../assets/images/teams_icon/Teams-16x16.png";

function UsersByUUID() {
	/* ---- States ---------------------------------- */
	const { UUID } = useParams();
	const user = useUsers({
		UUID, expand: [ "campus~", "study~", "module~", "ects~", "job~", "compta~" ]
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

					{user.data.campus && (
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

							{user.data.modules && (
								<div>
									<h4>Modules</h4>
									<ul>
										{user.data.modules.map(module => (
											<li key={`user-profile-module-${module.module_id}`}>
												{module.year}{module.name}{(module.notes && module.notes.length > 0) && (
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

					{user.data.jobs && (
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

					{user.data.compta && (
						<div>
							<h3>Comptabilit&eacute;</h3>
							<p>Type de paiement: {user.data.compta.payment_type}</p>
							<p>Somme d&ucirc;e : {user.data.compta.payment_due} &euro;</p>
							<p>Somme pay&eacute;e : {user.data.compta.paid} &euro;</p>
							{(() => {
								const remaining = user.data.compta.payment_due - user.data.compta.paid;
								const remainingColor = remaining > 0 ? "remaining_red" : "remaining_green";

								return <p className={remainingColor}>Balance : {(remaining > 0) && "+"}{remaining} &euro;</p>;
							})()}
						</div>
					)}
				</>
			)}
		</div>
	);
}

export default UsersByUUID;