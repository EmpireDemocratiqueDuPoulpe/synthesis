import { Link } from "react-router-dom";
import useAuth, { states } from "../../context/Auth/AuthContext.js";

function AuthorizedLinks() {
	/* ---- States ---------------------------------- */
	const { status, user, permissions, hasPermission } = useAuth();

	/* ---- Page content ---------------------------- */
	return (status !== states.CONNECTED) ? null : (
		<div className="authorized-links">
			<ul>
				{hasPermission(permissions.READ_STUDENTS) && (<li><Link to="/students">&Eacute;tudiants</Link></li>)}
				{hasPermission(permissions.READ_OLD_STUDENTS) && (<li><Link to="/students/old">Anciens &eacute;tudiants</Link></li>)}
				{hasPermission(permissions.READ_SCTS) && (<li><Link to="/scts">SCTs</Link></li>)}
				{hasPermission(permissions.READ_PLANNINGS) && (<li><Link to="/planning">Planning</Link></li>)}
				{hasPermission(permissions.READ_MODULES) && (<li><Link to="/modules">Modules</Link></li>)}
				{hasPermission(permissions.READ_ECTS) && (<li><Link to="/notes">Notes</Link></li>)}
				{hasPermission(permissions.READ_RESITS) && (<li><Link to="/resits">Resits</Link></li>)}
				{hasPermission(permissions.READ_STUDENTS_JOBS) && (<li><Link to="/jobs">Stages/Alternances</Link></li>)}
				{hasPermission(permissions.READ_INTERNSHIP_OFFERS) && (<li><Link to="/jobs/offers">Offres de stages</Link></li>)}
				{hasPermission(permissions.READ_COMPTA) && (<li><Link to={user.position.name === "Étudiant" ? `/comptabilite/${user.uuid}` : "/comptabilite"}>Comptabilité</Link></li>)}
				{hasPermission(permissions.MANAGE_PARTNERSHIPS) && (<li><Link to="#">Partenaires</Link></li>)}
				{hasPermission(permissions.MANAGE_ABSENCES) && (<li><Link to="/absences">Absences</Link></li>)}
				{hasPermission(permissions.SYNC_DATA) && (<li><Link to="#">Synchroniser les données</Link></li>)}
				{hasPermission(permissions.EXPORT_DATA) && (<li><Link to="#">Exporter les données</Link></li>)}
			</ul>
		</div>
	);
}

export default AuthorizedLinks;
