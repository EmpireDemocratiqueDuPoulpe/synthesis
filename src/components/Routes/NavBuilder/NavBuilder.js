import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import useAuth, { states } from "../../../context/Auth/AuthContext.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./NavBuilder.css";

function NavBuilder({ routes }) {
	/* ---- States ---------------------------------- */
	const auth = useAuth();

	/* ---- Page content ---------------------------- */
	return (
		<ul className="nav-links">
			{routes.filter(r => ((r.link && (!r.link.if || r.link.if(auth))) && (!r.protected || (auth.status === states.CONNECTED && (!r.permissions || auth.hasPermission(r.permissions)))))).map(route => (
				<li key={`nav-links-link-${route.link.label}-to-${route.path}`} >
					<Link to={route.link.override ? route.link.override(auth) : route.path}>
						{route.link.icon && (
							<span className="link-icon">
								<FontAwesomeIcon icon={route.link.icon.file}/>
							</span>
						)}
						<span>{route.link.label}</span>
					</Link>
				</li>
			))}
		</ul>
	);
}
NavBuilder.propTypes = {
	routes: PropTypes.arrayOf(
		PropTypes.shape({
		})
	).isRequired
};

export default NavBuilder;
