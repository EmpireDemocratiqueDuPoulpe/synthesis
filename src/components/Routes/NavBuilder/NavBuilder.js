import PropTypes from "prop-types";
import useAuth, { states } from "../../../context/Auth/AuthContext.js";
import NavLink from "./NavLink/NavLink.js";
import "./NavBuilder.css";

function NavBuilder({ routes }) {
	/* ---- States ---------------------------------- */
	const auth = useAuth();

	/* ---- Page content ---------------------------- */
	return (
		<ul className="nav-links">
			{routes.filter(r => ((r.link && (!r.link.if || r.link.if(auth))) && (!r.protected || (auth.status === states.CONNECTED && (!r.permissions || auth.hasPermission(r.permissions)))))).map(route => (
				<li key={`nav-links-link-${route.link.label}-to-${route.path}`} >
					<NavLink route={route}/>
				</li>
			))}
		</ul>
	);
}
NavBuilder.propTypes = {
	routes: PropTypes.arrayOf(PropTypes.object).isRequired
};

export default NavBuilder;
