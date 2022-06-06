import { NavLink as ReactNavLink } from "react-router-dom";
import PropTypes from "prop-types";
import useAuth from "../../../../context/Auth/AuthContext.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./NavLink.css";

function NavLink({ route }) {
	/* ---- States ---------------------------------- */
	const auth = useAuth();
	
	/* ---- Page content ---------------------------- */
	return (
		<ReactNavLink
			className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
			to={route.link.override ? route.link.override(auth) : route.path}
		>
			{route.link.icon && (
				<span className="link-icon">
					<FontAwesomeIcon icon={route.link.icon.file}/>
				</span>
			)}
			<span className="link-label">{route.link.label}</span>
		</ReactNavLink>
	);
}
NavLink.propTypes = {
	route: PropTypes.shape({
		path: PropTypes.string.isRequired,
		link: PropTypes.shape({
			label: PropTypes.string.isRequired,
			override: PropTypes.func,
			icon: PropTypes.shape({ file: PropTypes.any.isRequired }),
		}).isRequired,
	}).isRequired
};

export default NavLink;
