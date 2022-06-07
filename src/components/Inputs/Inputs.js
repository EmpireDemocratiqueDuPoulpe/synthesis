import PropTypes from "prop-types";
import useClassName from "../../hooks/className/useClassName.js";
import "./Inputs.css";

function Checkbox({ value, setValue, children }) {
	/* ---- States ---------------------------------- */
	const classes = useClassName(hook => {
		hook.set("input");
		hook.set("checkbox");
		hook.setIf(!!value, "active");
	}, [value]);
	
	/* ---- Functions ------------------------------- */
	const handleChange = event => setValue(event.target.checked);
	
	/* ---- Page content ---------------------------- */
	return (
		<label className={classes}>
			<span>
				<input type="checkbox" value={value} onChange={handleChange} checked={!!value}/>
				<span className="input-label">{children}</span>
			</span>
		</label>
	);
}
Checkbox.propTypes = {
	value: PropTypes.any.isRequired,
	setValue: PropTypes.func.isRequired,
	children: PropTypes.node,
};

export default { Checkbox };
