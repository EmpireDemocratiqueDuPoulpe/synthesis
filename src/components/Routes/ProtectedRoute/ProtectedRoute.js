import { useLocation, Navigate } from "react-router-dom";
import PropTypes from "prop-types";
import useAuth, { states } from "../../../context/Auth/AuthContext";

function ProtectedRoute({ permissions, children }) {
	/* ---- States ---------------------------------- */
	const { status, hasPermission } = useAuth();
	const location = useLocation();
	
	/* ---- Page content ---------------------------- */
	return status !== states.CONNECTED
		? <Navigate to="/login" state={{ from: location }} replace/>
		: ((!permissions || (permissions && hasPermission(permissions))) ? children : <Navigate to={-1} replace/>);
}
ProtectedRoute.propTypes = {
	permissions: PropTypes.arrayOf(PropTypes.string),
	children: PropTypes.node
};

export default ProtectedRoute;
