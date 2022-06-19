import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import useAuth from "../../context/Auth/AuthContext.js";
import useNotesOfUser from "../../hooks/notes/useNotesOfUser.js";
import ModuleNotes from "../../components/Modules/ModuleNotes.js";
import Loader from "../../components/Loader/Loader.js";
import TableFilters from "../../components/Table/TableFilters/TableFilters.js";
import Inputs from "../../components/Inputs/Inputs.js";
import { calcECTS } from "../../global/Functions.js";
import "./Notes.css";

const yearsOptions = [
	{ value: 1, label: "B.Eng.1" },
	{ value: 2, label: "B.Eng.2" },
	{ value: 3, label: "B.Eng.3" },
	{ value: 4, label: "M.Eng.1" },
	{ value: 5, label: "M.Eng.2" }
];

function Notes() {
	/* ---- States ---------------------------------- */
	const { user } = useAuth();
	
	const [selectedYears] = useState(user.study ? [yearsOptions[user.study.current_level - 1]] : []);
	const form = useForm({ defaultValues: { years: selectedYears.map(y => y.value) }});
	const filters = form.watch();
	const ects = { current: 0, total: 0 };
	
	const notes = useNotesOfUser({ userID: user.user_id, years: filters.years });
	
	/* ---- Page content ---------------------------- */
	return (
		<div className="Notes">
			<h2 className="page_title">Notes de {user.first_name} {user.last_name}</h2>
			<h3>Campus de {user.campus.name}</h3>
			
			{(!notes.isUsable()) ? (notes.isLoading && <Loader/>) : (
				<>
					<TableFilters>
						<FormProvider {...form}>
							<form>
								<Inputs.Select name="years" options={user.study ? yearsOptions.filter(o => o.value <= user.study.current_level) : yearsOptions} multiple>
									Promo
								</Inputs.Select>
							</form>
						</FormProvider>
					</TableFilters>

					<div className="notes_main">
						{notes.data.map(module => {
							ects.total += module.ects;
							ects.current += calcECTS(module).ects;
							return (
								<ModuleNotes key={`notes-list-module-${module.module_id}`} module={module}/>
							);
						})}
					</div>
				</>
			)}
			
			<p className="total_ects" >ECTS totaux : {ects.current}/{ects.total}</p>
		</div>
	);
}

export default Notes;
