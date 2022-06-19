import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { solid } from "@fortawesome/fontawesome-svg-core/import.macro";
import "./ModuleNotes.css";
import {useEffect, useState} from "react";
import useClassName from "../../hooks/className/useClassName";
import {clickOnEnter} from "../../global/Functions";

function Module({ module }) {
	/* ---- States ---------------------------------- */
	const [isCollapsed, setCollapse] = useState(true);

	const classes = useClassName(hook => {
		hook.set("module_box");
		hook.setIfElse(isCollapsed, "hide", "show", "state");
		hook.setIfElse(isCollapsed, "plus_icon", "minus_icon", "icon");
	}, [isCollapsed]);

	//const users_height = module.users.length;
	useEffect(() => {
		const module_boxes = document.querySelectorAll(".module_box.hide");

		for (const module_box of module_boxes) {
			if (!isCollapsed) {
				module_box.classList.add("not_selected");
			} else {
				module_box.classList.remove("not_selected");
			}
		}
	}, [isCollapsed]);

	/* ---- Functions ------------------------------- */
	const handleClick = () => setCollapse(!isCollapsed);

	/* ---- Page content ---------------------------- */
	return (
		<div className={classes}>
			<div className="note_root" onClick={handleClick} onKeyDown={e => clickOnEnter(e, handleClick)} role="button" tabIndex={0}>
				<div className="note_ects_img">
					<FontAwesomeIcon className="invisible_icon" icon={solid("circle-check")} size="xl"/>
				</div>
				<div className="note_infos">
					<span className="module_box-title" >{module.long_name ?? "LOREM IPSUM DIVAETO"}</span>
					<div className="note_misc">
						<span className="note_title">{module.year + module.name}</span>
					</div>
				</div>
			</div>
			<div className="module_box-content" /*style={{ top: `calc(-${users_height}em + 110px)`, height: `${users_height}em` }}*/>
				{module.users.map(user => (
					<p key={`users-list-module-${module.module_id}-note-${user.user_id}`}>
						{user.first_name} {user.last_name}
					</p>
				))}
			</div>
		</div>
	);
}
Module.propTypes = {
	module: PropTypes.shape({
		name: PropTypes.string.isRequired,
		module_id: PropTypes.number.isRequired,
		long_name: PropTypes.string,
		year: PropTypes.number.isRequired,
		users: PropTypes.arrayOf(
			PropTypes.shape({
				first_name: PropTypes.string.isRequired,
				last_name: PropTypes.string.isRequired
			})
		).isRequired
	}).isRequired
};

export default Module;
