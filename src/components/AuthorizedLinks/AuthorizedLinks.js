import { Link } from "react-router-dom";
import useAuth, { states } from "../../context/Auth/AuthContext.js";

function AuthorizedLinks() {
	/* ---- States ---------------------------------- */
	const { status, user, permissions } = useAuth();

	/* ---- Functions ------------------------------- */
	const hasPermission = (permission) => {
		return user ? (user.position.permissions.includes(permission)) : false;
	};

	/* ---- Page content ---------------------------- */
	return (status !== states.CONNECTED) ? null : (
		<div className="authorized-links">
			<ul>
				{hasPermission(permissions.READ_STUDENTS) && (<li><Link to="/students">&Eacute;tudiants</Link></li>)}
				{hasPermission(permissions.READ_SCTS) && (<li><Link to="#">SCTs</Link></li>)}
				{hasPermission(permissions.READ_PLANNINGS) && (<li><Link to="#">Planning</Link></li>)}
				{hasPermission(permissions.READ_MODULES) && (<li><Link to="/modules">Modules</Link></li>)}
				{hasPermission(permissions.READ_NOTES) && (<li><Link to="/notes">Notes</Link></li>)}
				{hasPermission(permissions.READ_RESITS) && (<li><Link to="#">Resits</Link></li>)}
				{hasPermission(permissions.READ_INTERNSHIP_OFFERS) && (<li><Link to="/jobs/offers">Offres de stages</Link></li>)}
				{hasPermission(permissions.READ_COMPTA) && (<li><Link to="/comptabilite">Comptabilité</Link></li>)}
				{hasPermission(permissions.MANAGE_PARTNERSHIPS) && (<li><Link to="#">Partenaires</Link></li>)}
				{hasPermission(permissions.SEND_MAILS) && (<li><Link to="#">Envoyer un mail</Link></li>)}
				{hasPermission(permissions.SYNC_DATA) && (<li><Link to="#">Synchroniser les données</Link></li>)}
				{hasPermission(permissions.EXPORT_DATA) && (<li><Link to="#">Exporter les données</Link></li>)}
			</ul>
		</div>
	);
}

export default AuthorizedLinks;
