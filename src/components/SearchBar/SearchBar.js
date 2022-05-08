import PropTypes from "prop-types";

function SearchBar({ placeholder, value, setValue, disabled }) {
	/* ---- Functions ------------------------------- */
	const handleChange = event => {
		setValue(event.target.value);
	};
	
	/* ---- Page content ---------------------------- */
	return (
		<div className="search-bar">
			<input type="text" placeholder={placeholder} value={value} onChange={handleChange} disabled={disabled}/>
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
