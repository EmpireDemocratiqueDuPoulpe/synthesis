import PropTypes from "prop-types";
import Inputs from "../Inputs/Inputs.js";

function SearchBar({ placeholder, value, setValue, disabled }) {
	/* ---- Functions ------------------------------- */
	const handleChange = event => {
		setValue(event.target.value);
	};
	
	/* ---- Page content ---------------------------- */
	return (
		<div className="search-bar">
			<Inputs.Text placeholder={placeholder} value={value} onChange={handleChange} disabled={disabled} name="search-bar">Rechercher</Inputs.Text>
		</div>
	);
}
SearchBar.propTypes = {
	placeholder: PropTypes.string,
	value: PropTypes.string.isRequired,
	setValue: PropTypes.func.isRequired,
	disabled: PropTypes.bool
};
SearchBar.defaultProps = { disabled: false };

export default SearchBar;
