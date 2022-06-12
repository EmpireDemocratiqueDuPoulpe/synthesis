import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import useClassName from "../../hooks/className/useClassName.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { solid } from "@fortawesome/fontawesome-svg-core/import.macro";
import { clickOnEnter, calcECTS } from "../../global/Functions.js";
import "./ModuleNotes.css";

function ModuleNotes({ module }) {
	/* ---- States ---------------------------------- */
	const [isCollapsed, setCollapse] = useState(true);

	const classes = useClassName(hook => {
		hook.set("module_box");
		hook.setIfElse(isCollapsed, "hide", "show", "state");
		hook.setIfElse(isCollapsed, "plus_icon", "minus_icon", "icon");
	}, [isCollapsed]);

	const notes_height = module.notes.length * 3;
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
					<span className="note_ects">{calcECTS(module).hasPassed ? (
						<FontAwesomeIcon className="note_icon passed" icon={solid("circle-check")} size="xl"/>
					) : (
						<FontAwesomeIcon className="note_icon failed" icon={solid("circle-xmark")} size="xl"/>
					)}</span>
					<span>{isCollapsed ? (
						<FontAwesomeIcon className="module_box_icon" icon={solid("plus")} size="xl"/>
					) : (
						<FontAwesomeIcon className="module_box_icon" icon={solid("minus")} size="xl"/>
					)}</span>
				</div>
				<div className="note_infos">
					<span className="module_box-title" >{module.long_name ?? "LOREM IPSUM DIVAETO"}</span>
					<div className="note_misc">
						<span className="note_title">{module.year + module.name}</span>
						<span>{module.ects} ECTS</span>
					</div>
				</div>
			</div>
			<div className="module_box-content" style={{ top: `calc(-${notes_height}em + 110px)`, height: `${notes_height}em` }}>
				{module.notes.map(note => (
					<p key={`notes-list-module-${module.module_id}-note-${note.note_id}`}>{note.note}</p>
				))}
			</div>
		</div>
	);
}
ModuleNotes.propTypes = {
	module: PropTypes.shape({
		module_id: PropTypes.number.isRequired,
		name: PropTypes.string.isRequired,
		long_name: PropTypes.string,
		ects: PropTypes.number.isRequired,
		year: PropTypes.number.isRequired,
		notes: PropTypes.arrayOf(
			PropTypes.shape({
				note_id: PropTypes.number.isRequired,
				note: PropTypes.number.isRequired
			})
		).isRequired
	}).isRequired
};

export default ModuleNotes;
