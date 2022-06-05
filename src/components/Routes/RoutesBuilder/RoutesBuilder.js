import { Routes, Route } from "react-router-dom";
import PropTypes from "prop-types";
import ProtectedRoute from "../ProtectedRoute/ProtectedRoute.js";

function RoutesBuilder({ routes }) {
	/* ---- Page content ---------------------------- */
	return (
		<Routes>
			{routes.map(route => (
				<Route key={`route-${route.path}`} path={route.path} element={route.protected ? (
					<ProtectedRoute permissions={route.permissions}>
						<route.element/>
					</ProtectedRoute>
				) : <route.element/>}/>
			))}
		</Routes>
	);
}
RoutesBuilder.propTypes = {
	routes: PropTypes.arrayOf(
		PropTypes.shape({
			path: PropTypes.string.isRequired,
			element: PropTypes.func.isRequired,
			protected: PropTypes.bool,
		})
	).isRequired
};

export default RoutesBuilder;
