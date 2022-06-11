import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { solid } from "@fortawesome/fontawesome-svg-core/import.macro";
import "./ModuleNotes.css";

function ModuleNotes({ module }) {

	/* ---- Page content ---------------------------- */
	return (
		<div className="module_box">
			<div className="note_root">
				<div className="note_ects_img">
					<FontAwesomeIcon className="invisible_icon" icon={solid("circle-check")} size="xl"/>
				</div>
				<div className="note_infos">
					<span className="module_box-title" >{module.long_name ?? "LOREM IPSUM DIVAETO"}</span>
					<div className="note_misc">
						<span className="note_title">{module.year + module.name}</span>
						{ !!module.users.length && (
							<span>{ module.users.map(prof => (
								`${prof.first_name} ${prof.last_name}`)).join(", ")}
							</span>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
ModuleNotes.propTypes = {
	module: PropTypes.shape({
		name: PropTypes.string.isRequired,
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

export default ModuleNotes;
