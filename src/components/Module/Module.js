import PropTypes from "prop-types";
import "./Module.css";

function Module({ module }) {
	/* ---- Page content ---------------------------- */
	return (<>
		<div className="module hide_module">
			<h3 className="module_name">{module.year}{module.name}{(module.users && module.users.length > 0)}</h3>
			<h4 className="module_longname">{module.long_name}</h4>
			<p>{module.users.map(prof => (
				`${prof.first_name} ${prof.last_name}`
			)).join(", ")}</p>
			<p className="module_description">{module.description}</p>
		</div>
	</>
	);
}
Module.propTypes = {
	module: PropTypes.object.isRequired
};

export default Module;