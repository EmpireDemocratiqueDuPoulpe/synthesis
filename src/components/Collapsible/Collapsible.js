import { useState } from "react";
import PropTypes from "prop-types";
import useClassName from "../../hooks/ClassName/useClassName.js";
import { clickOnEnter } from "../../global/Functions.js";
import "./Collapsible.css";

function Collapsible({ title, children }) {
	/* ---- States ---------------------------------- */
	const [isCollapsed, setCollapse] = useState(true);
	const classes = useClassName(hook => {
		hook.set("collapsible");
		hook.setIfElse(isCollapsed, "hide", "show", "state");
	}, [isCollapsed]);

	/* ---- Functions ------------------------------- */
	const handleClick = () => setCollapse(!isCollapsed);

	/* ---- Page content ---------------------------- */
	return (
		<div className={classes}>
			<span className="collapsible-title" onClick={handleClick} onKeyPress={e => clickOnEnter(e, handleClick)} role="button" tabIndex={0}>{title}</span>
			<div className="collapsible-content">
				{children}
			</div>
		</div>
	);
}
Collapsible.propTypes = {
	title: PropTypes.string.isRequired,
	children: PropTypes.node
};

export default Collapsible;