import { Link } from "react-router-dom";
import useAuth, { states } from "../../context/Auth/AuthContext.js";

function AuthorizedLinks() {
	/* ---- States ---------------------------------- */
	const auth = useAuth();

	/* ---- Functions ------------------------------- */
	const hasPermission = (permission) => {
		return auth.user ? (auth.user.position.permissions.includes(permission)) : false;
	};

	/* ---- Page content ---------------------------- */
	return auth.status !== states.CONNECTED ? null : (
		<div className="authorized-links">
			<ul>
				{hasPermission(auth.permissions.READ_STUDENTS) && (<li><Link to="#">&Eacute;tudiants</Link></li>)}
				{hasPermission(auth.permissions.READ_SCTS) && (<li><Link to="#">SCTs</Link></li>)}
				{hasPermission(auth.permissions.READ_PLANNINGS) && (<li><Link to="#">Planning</Link></li>)}
				{hasPermission(auth.permissions.READ_CAMPUS) && (<li><Link to="#">Campus</Link></li>)}
				{hasPermission(auth.permissions.READ_MODULES) && (<li><Link to="#">Modules</Link></li>)}
				{hasPermission(auth.permissions.READ_NOTES) && (<li><Link to="#">Notes</Link></li>)}
				{hasPermission(auth.permissions.READ_RESITS) && (<li><Link to="#">Resits</Link></li>)}
				{hasPermission(auth.permissions.READ_INTERNSHIP_OFFERS) && (<li><Link to="#">Offres de stages</Link></li>)}
				{hasPermission(auth.permissions.READ_COMPTA) && (<li><Link to="#">Comptabilité</Link></li>)}
				{hasPermission(auth.permissions.MANAGE_PARTNERSHIPS) && (<li><Link to="#">Partenaires</Link></li>)}
				{hasPermission(auth.permissions.SEND_MAILS) && (<li><Link to="#">Envoyer un mail</Link></li>)}
				{hasPermission(auth.permissions.SYNC_DATA) && (<li><Link to="#">Synchroniser les données</Link></li>)}
				{hasPermission(auth.permissions.EXPORT_DATA) && (<li><Link to="#">Exporter les données</Link></li>)}
			</ul>
		</div>
	);
}

export default AuthorizedLinks;