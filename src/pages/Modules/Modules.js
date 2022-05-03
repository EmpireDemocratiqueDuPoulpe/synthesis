import { useState } from "react";
import Select from "react-select";
import useAuth from "../../context/Auth/AuthContext.js";
import useModules from "../../hooks/modules/useModules.js";
import useStudies from "../../hooks/studies/useStudies.js";
import Collapsible from "../../components/Collapsible/Collapsible.js";
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
		}
	});
	const [yearsOptions, setYearsOptions] = useState([
		{ value: 1, label: "A.Sc.1" },
		{ value: 2, label: "A.Sc.2" },
		{ value: 3, label: "B.Sc" },
		{ value: 4, label: "M.Eng.1" },
		{ value: 5, label: "M.Eng.2" }
	]);

	const [selectedYears, setSelectedYears] = useState([]);
	const modules = useModules({ years: selectedYears.map(y => y.value) }, {
		enabled: study.isUsable()
	});

	/* ---- Page content ---------------------------- */
	return (
		<div className="Modules">
			<h2>Liste des cours</h2>
			<div>
				{(!modules.isUsable() || !study.isUsable()) ? ((modules.isLoading || study.isLoading) && <Loader/>) : (
					<>
						<Select
							options={yearsOptions}
							defaultValue={selectedYears}
							onChange={setSelectedYears}
							isMulti/>
						{modules.data.map((module, mIndex) => {
							return (
								<Collapsible key={`module-${mIndex}`} title={module.year + module.name}>
									<p key={`module-${mIndex}`}>{module.name}</p>
								</Collapsible>
							);
						})}
					</>
				)}

			</div>
		</div>
	);
}

export default Modules;
