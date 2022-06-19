import PropTypes from "prop-types";
import "./TableFilters.css";

function TableFilters({ children }) {
	return (
		<div className="table-filters">
			{children}
		</div>
	);
}
TableFilters.propTypes = {
	children: PropTypes.node
};

export default TableFilters;
