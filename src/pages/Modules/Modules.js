import { useState } from "react";
import Select from "react-select";
import useAuth from "../../context/Auth/AuthContext.js";
import useModules from "../../hooks/modules/useModules.js";
import Loader from "../../components/Loader/Loader.js";
import Module from "../../components/Module/Module.js";
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
							{ selectedYears.some(y => y.value === 1) && <>
								<h1 className="year_title">A.Sc.1</h1>
								<hr/>
								<div className="modulesRoot">
									{modules.data.filter(y => y.year === 1).map(module => {
										return (
											<Module key={`modules-list-module-${module.module_id}`} module={module}/>
										);
									})}
								</div>
							</>
							}
							{ selectedYears.some(y => y.value === 2) && <>
								<h1 className="year_title">A.Sc.2</h1>
								<hr/>
								<div className="modulesRoot">
									{modules.data.filter(y => y.year === 2).map(module => {
										return (
											<Module key={`modules-list-module-${module.module_id}`} module={module}/>
										);
									})}
								</div>
							</>
							}
							{ selectedYears.some(y => y.value === 3) && <>
								<h1 className="year_title">B.Sc</h1>
								<hr/>
								<div className="modulesRoot">
									{modules.data.filter(y => y.year === 3).map(module => {
										return (
											<Module key={`modules-list-module-${module.module_id}`} module={module}/>
										);
									})}
								</div>
							</>
							}
							{ selectedYears.some(y => y.value === 4) && <>
								<h1 className="year_title">M.Eng.1</h1>
								<hr/>
								<div className="modulesRoot">
									{modules.data.filter(y => y.year === 4).map(module => {
										return (
											<Module key={`modules-list-module-${module.module_id}`} module={module}/>
										);
									})}
								</div>
							</>
							}
							{ selectedYears.some(y => y.value === 5) && <>
								<h1 className="year_title">M.Eng.2</h1>
								<hr/>
								<div className="modulesRoot">
									{modules.data.filter(y => y.year === 5).map(module => {
										return (
											<Module key={`modules-list-module-${module.module_id}`} module={module}/>
										);
									})}
								</div>
							</>
							}
						</div>
					</div>
				</div>
			)}

		</div>
	);
}

export default Modules;
