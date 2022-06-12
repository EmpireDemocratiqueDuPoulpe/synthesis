import PropTypes from "prop-types";
import "./ModulesRoot.css";

function ModulesRoot({ modules, year }) {

	/* ---- Page content ---------------------------- */
	return (<>
		<div className="modulesRoot">
			{modules.filter(m => m.year === year).map(module => {
				return (
					<div className="module hide_module" key={`modules-list-module-${module.module_id}`}>
						<h3 className="module_name">{module.year}{module.name}{(module.users && module.users.length > 0)}</h3>
						<h4 className="module_longname">{module.long_name}</h4>
						<p>{module.users.map(prof => (
							`${prof.first_name} ${prof.last_name}`
						)).join(", ")}</p>
						<p className="module_description">{module.description}</p>
					</div>
				);
			})}
		</div>
	</>
	);
}
ModulesRoot.propTypes = {
	modules: PropTypes.array.isRequired,
	year: PropTypes.number.isRequired
};

export default ModulesRoot;