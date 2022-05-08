import { useState } from "react";
import { Link } from "react-router-dom";
import Select from "react-select";
import useAuth from "../../context/Auth/AuthContext.js";
import useModules from "../../hooks/modules/useModules.js";
import useStudies from "../../hooks/studies/useStudies.js";
import Loader from "../../components/Loader/Loader.js";
import "./Modules.css";

function Modules() {
	/* ---- States ---------------------------------- */
	const { user } = useAuth();
	const study = useStudies({ userID: user.user_id }, {
		onSuccess: data => {
			const usableYears = yearsOptions.filter(y => y.value <= data.current_level);
			setYearsOptions(usableYears);
			setSelectedYears(usableYears);
		},
		onError: () => setNoStudy(true),
		retry: 0
	});
	const [noStudy, setNoStudy] = useState(false);
	const [yearsOptions, setYearsOptions] = useState([
		{ value: 1, label: "A.Sc.1" },
		{ value: 2, label: "A.Sc.2" },
		{ value: 3, label: "B.Sc" },
		{ value: 4, label: "M.Eng.1" },
		{ value: 5, label: "M.Eng.2" }
	]);
	const [selectedYears, setSelectedYears] = useState([]);
	const modules = useModules({ years: noStudy ? null : selectedYears.map(y => y.value) }, {
		enabled: study.isUsable() || noStudy
	});

	/* ---- Page content ---------------------------- */
	return (
		<div className="Modules">
			<Link to="/">&lt;-- Retour</Link>
			<h2>Liste des cours</h2>
			
			{(!modules.isUsable() || (!study.isUsable() && !noStudy)) ? ((modules.isLoading || study.isLoading) && <Loader/>) : (
				<div>
					{noStudy ? null : (
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
