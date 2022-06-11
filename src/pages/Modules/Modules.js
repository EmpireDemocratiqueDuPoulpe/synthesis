import { useState } from "react";
import Select from "react-select";
import useAuth from "../../context/Auth/AuthContext.js";
import useModules from "../../hooks/modules/useModules.js";
import Loader from "../../components/Loader/Loader.js";
import Module from "../../components/Modules/Module.js";
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
	//////////////////////////////////////////
	/*const elements = document.querySelectorAll(".module");

	window.addEventListener("scroll", function() {
		elements.forEach(function ( element){
			var position = element.getBoundingClientRect();

			if(position.top < window.innerHeight && position.bottom >= 0) {
				if(element.classList.contains("hide_module")){
					element.classList.remove("hide_module");
				}
				if(!element.classList.contains("show_module")){
					element.classList.add("show_module");
				}
			}else{
				if(!element.classList.contains("hide_module")){
					element.classList.add("hide_module");
				}
				if(element.classList.contains("show_module")){
					element.classList.remove("show_module");
				}
			}
		});
	});*/

	const generateModules = (modules) => {
		const modulesByYear = [];
		const promos = ["B.Eng.1", "B.Eng.2", "B.Eng.3", "M.Eng.1", "M.Eng.2"];

		modules.forEach(module => {
			let index = modulesByYear.findIndex(y => y.year === module.year);

			if (index === -1) {
				modulesByYear.push({ year: module.year, promo: promos[module.year - 1], modules: [] });
				index = modulesByYear.length - 1;
			}

			modulesByYear[index].modules.push(<Module key={module.module_id} module={module} />);
		});

		return modulesByYear;
	};
	
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
					<div>
						<div>
							{ generateModules(modules.data).map(year => (
								<div key={year.year}>
									<h3>{year.promo}</h3>
									<div className="modules_list">{year.modules}</div>
								</div>
							)) }
						</div>
					</div>
				</div>
			)}

		</div>
	);
}

export default Modules;
