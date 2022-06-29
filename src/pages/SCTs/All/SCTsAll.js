import { useState } from "react";
import { Link } from "react-router-dom";
import useAuth from "../../../context/Auth/AuthContext.js";
import useSCTs from "../../../hooks/scts/useSCTs.js";
import useModules from "../../../hooks/modules/useModules.js";
import Loader from "../../../components/Loader/Loader.js";
import Inputs from "../../../components/Inputs/Inputs.js";
import SearchBar from "../../../components/SearchBar/SearchBar.js";
import Table from "../../../components/Table/Table.js";
import TableFilters from "../../../components/Table/TableFilters/TableFilters.js";
import {filterObj, isoStrToDate, sortObjectArr} from "../../../global/Functions.js";

const searchableColumns = ["first_name", "last_name", "birth_date", "email", "campus.name", "region"];

function SCTsAll() {
	/* ---- States ---------------------------------- */
	const { hasPermission, permissions } = useAuth();
	const [sortBy, setSortBy] = useState("first_name");
	const [search, setSearch] = useState("");
	const scts = useSCTs({
		expand: [
			(hasPermission(permissions.READ_CAMPUS) ? "campus~" : ""), (hasPermission(permissions.READ_MODULES) ? "module~" : "")
		].filter(Boolean)
	});
	const modules = useModules({}, { enabled: sortBy === "modules" });
	
	const sortAndFilter = data => {
		return data.sort((a, b) => sortObjectArr(sortBy, a, b)).filter(o => filterObj(o, searchableColumns, search));
	};
	
	/* ---- Functions ------------------------------- */
	const handleSortChange = event => {
		setSortBy(event.target.value);
	};
	
	/* ---- Page content ---------------------------- */
	return (
		<div className="SCTs SCTsAll">
			<h2 className="page_title">Liste des SCTs</h2>
			<TableFilters>
				<Inputs.Select
					name="sctsSelect"
					value={sortBy}
					onChange={handleSortChange}
					options={[
						{value:"first_name", label:"Prénom"},
						{value:"last_name", label:"Nom"},
						{value:"email", label:"Adresse email"},
						{value:"birthdate", label:"Date de naissance", disabled: true},
						{value:"study.current_level", label:"Niveau actuel"},
						(hasPermission(permissions.READ_CAMPUS) ? ({value:"campus.name", label:"Campus"}) : null),
						{value:"region", label:"Région"},
						(hasPermission(permissions.READ_MODULES) ? ({value: "modules", label: "Modules"}) : null)
					].filter(Boolean)}
					disabled={sortBy !== "modules" ? (!scts.isUsable()) : (!scts.isUsable() || !modules.isUsable())}
				>
					Trier par
				</Inputs.Select>
				
				<SearchBar placeholder="Rechercher" value={search} setValue={setSearch}/>
			</TableFilters>
			
			{!scts.isUsable() ? (scts.isLoading && <Loader/>) : (
				<>
					{sortBy !== "modules" ? (
						<Table data={sortAndFilter(scts.data)} keyProp={"user_id"} header={
							<>
								<th>Pr&eacute;nom</th>
								<th>Nom</th>
								<th>Adresse e-mail</th>
								<th>Date de naissance</th>
								{hasPermission(permissions.READ_CAMPUS) && <th>Campus</th>}
								<th>R&eacute;gion</th>
								{hasPermission(permissions.READ_MODULES) && <th>Modules</th>}
								<th>Actions</th>
							</>
						} body={row => (
							<>
								<td className="sct-first-name">{row.first_name}</td>
								<td className="sct-last-name">{row.last_name}</td>
								<td className="sct-email">{row.email}</td>
								<td className="sct-birth-date">{isoStrToDate(row.birth_date).toLocaleDateString()}</td>
								{hasPermission(permissions.READ_CAMPUS) && <td className="sct-campus">{row.campus?.name}</td>}
								<td className="sct-region">{row.region}</td>
								{hasPermission(permissions.READ_MODULES) && (
									<td className="sct-modules">
										{row.modules.map(module => `${module.year}${module.name}`).join(", ")}
									</td>
								)}
								<td className="sct-action"><Link to={`/user/${row.uuid}`}>Vers le profil</Link></td>
							</>
						)}/>
					) : (!modules.isUsable() ? (modules.isLoading && <Loader/>) : (modules.data.map(module => {
						const s = scts.data.filter(s => s.modules.some(m => m.module_id === module.module_id));
						
						return s.length === 0 ? null : (
							<div key={`scts-list-module-${module.module_id}`}>
								<h2>{module.year}{module.name}</h2>
								<Table data={sortAndFilter(s)} keyProp={"user_id"} perPage={5} header={
									<>
										<th>Pr&eacute;nom</th>
										<th>Nom</th>
										<th>Adresse e-mail</th>
										<th>Date de naissance</th>
										{hasPermission(permissions.READ_CAMPUS) && <th>Campus</th>}
										<th>R&eacute;gion</th>
										<th>Actions</th>
									</>
								} body={row => (
									<>
										<td className="sct-first-name">{row.first_name}</td>
										<td className="sct-last-name">{row.last_name}</td>
										<td className="sct-email">{row.email}</td>
										<td className="sct-birth-date">{isoStrToDate(row.birth_date).toLocaleDateString()}</td>
										{hasPermission(permissions.READ_CAMPUS) && <td className="sct-campus">{row.campus.name}</td>}
										<td className="sct-region">{row.region}</td>
										<td className="sct-action"><Link to={`/user/${row.uuid}`}>Vers le profil</Link></td>
									</>
								)}/>
							</div>
						);
					})))}
				</>
			)}
		</div>
	);
}

export default SCTsAll;
