import { useState } from "react";
import { Link } from "react-router-dom";
import useAuth from "../../../context/Auth/AuthContext.js";
import useSCTs from "../../../hooks/scts/useSCTs.js";
import useModules from "../../../hooks/modules/useModules.js";
import Loader from "../../../components/Loader/Loader.js";
import SearchBar from "../../../components/SearchBar/SearchBar.js";
import { sortObjectArr } from "../../../global/Functions.js";

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
	
	/* ---- Functions ------------------------------- */
	const handleSortChange = event => {
		setSortBy(event.target.value);
	};
	
	/* ---- Page content ---------------------------- */
	return (
		<div className="SCTs SCTsAll">
			<select value={sortBy} onChange={handleSortChange} disabled={sortBy !== "modules" ? (!scts.isUsable()) : (!scts.isUsable() || !modules.isUsable())}>
				<option value="first_name">Pr&eacute;nom</option>
				<option value="last_name">Nom</option>
				<option value="email">Adresse email</option>
				<option value="birthdate" disabled>Date de naissance</option>
				<option value="study.current_level">Niveau actuel</option>
				{hasPermission(permissions.READ_CAMPUS) && <option value="campus.name">Campus</option>}
				<option value="region">R&eacute;gion</option>
				{hasPermission(permissions.READ_MODULES) && <option value="modules">Modules</option>}
			</select>
			
			<SearchBar placeholder="Rechercher" value={search} setValue={setSearch} disabled/>
			
			{!scts.isUsable() ? (scts.isLoading && <Loader/>) : (
				<>
					{sortBy !== "modules" ? (
						<table>
							<thead>
								<tr>
									<th>Pr&eacute;nom</th>
									<th>Nom</th>
									<th>Adresse e-mail</th>
									<th>Date de naissance</th>
									{hasPermission(permissions.READ_CAMPUS) && <th>Campus</th>}
									<th>R&eacute;gion</th>
									{hasPermission(permissions.READ_MODULES) && <th>Modules</th>}
									<th>Actions</th>
								</tr>
							</thead>
							
							<tbody>
								{scts.data.sort((a, b) => sortObjectArr(sortBy, a, b)).map(sct => (
									<tr key={`scts-list-sct-${sct.user_id}`}>
										<td className="sct-first-name">{sct.first_name}</td>
										<td className="sct-last-name">{sct.last_name}</td>
										<td className="sct-email">{sct.email}</td>
										<td className="sct-birth-date">{sct.birth_date}</td>
										{hasPermission(permissions.READ_CAMPUS) && <td className="sct-campus">{sct.campus?.name}</td>}
										<td className="sct-region">{sct.region}</td>
										{hasPermission(permissions.READ_MODULES) && (
											<td className="sct-modules">
												{sct.modules.map(module => `${module.year}${module.name}`).join(", ")}
											</td>
										)}
										<td className="sct-action"><Link to={`/sct/${sct.uuid}`}>Vers le profil</Link></td>
									</tr>
								))}
							</tbody>
						</table>
					) : (!modules.isUsable() ? (modules.isLoading && <Loader/>) : (modules.data.map(module => {
						const s = scts.data.filter(s => s.modules.some(m => m.module_id === module.module_id));
						
						return s.length === 0 ? null : (
							<div key={`scts-list-module-${module.module_id}`}>
								<h2>{module.year}{module.name}</h2>
								<table>
									<thead>
										<tr>
											<th>Pr&eacute;nom</th>
											<th>Nom</th>
											<th>Adresse e-mail</th>
											<th>Date de naissance</th>
											{hasPermission(permissions.READ_CAMPUS) && <th>Campus</th>}
											<th>R&eacute;gion</th>
											<th>Actions</th>
										</tr>
									</thead>
									
									<tbody>
										{s.map(sct => (
											<tr key={`scts-list-sct-${sct.user_id}`}>
												<td className="sct-first-name">{sct.first_name}</td>
												<td className="sct-last-name">{sct.last_name}</td>
												<td className="sct-email">{sct.email}</td>
												<td className="sct-birth-date">{sct.birth_date}</td>
												{hasPermission(permissions.READ_CAMPUS) && <td className="sct-campus">{sct.campus.name}</td>}
												<td className="sct-region">{sct.region}</td>
												<td className="sct-action"><Link to={`/sct/${sct.uuid}`}>Vers le profil</Link></td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						);
					})))}
				</>
			)}
		</div>
	);
}

export default SCTsAll;
