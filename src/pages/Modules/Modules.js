import { useState } from "react";
import Select from "react-select";
import useAuth from "../../context/Auth/AuthContext.js";
import useModules from "../../hooks/modules/useModules.js";
import Loader from "../../components/Loader/Loader.js";
import "kalend/dist/styles/index.css";
import "./Modules.css";

function Modules() {
	/* ---- States ---------------------------------- */
	const { user } = useAuth();
	const [yearsOptions] = useState([
		{ value: 1, label: "A.Sc.1" },
		{ value: 2, label: "A.Sc.2" },
		{ value: 3, label: "B.Sc" },
		{ value: 4, label: "M.Eng.1" },
		{ value: 5, label: "M.Eng.2" }
	]);
	const [selectedYears, setSelectedYears] = useState(
		user.study ? yearsOptions.filter(yo => yo.value <= user.study.current_level) : yearsOptions
	);
	const modules = useModules({ years: selectedYears.map(y => y.value) });

	/* ---- Page content ---------------------------- */
	return (
		<div className="Modules">
			<h2>Liste des cours</h2>

			{!modules.isUsable() ? (modules.isLoading && <Loader/>) : (
				<div>
					{!user.study ? null : (
						<Select
							options={yearsOptions}
							defaultValue={selectedYears}
							onChange={setSelectedYears}
							isMulti/>

					)}

					{modules.data.map(module => {
						return (
							<div key={`modules-list-module-${module.module_id}`}>
								<p>{module.year}{module.name}{(module.users && module.users.length > 0) && (" - " + module.users.map(prof => (
									`${prof.first_name} ${prof.last_name}`
								)).join(", "))}</p>
							</div>
						);
					})}
				</div>
			)}

		</div>
	);
}

export default Modules;
