import { useState } from "react";
import { Link } from "react-router-dom";
import Select from "react-select";
import useAuth from "../../context/Auth/AuthContext.js";
import useModules from "../../hooks/modules/useModules.js";
import useStudies from "../../hooks/studies/useStudies.js";
import usePlanning from "../../hooks/planning/usePlanning.js";
import Loader from "../../components/Loader/Loader.js";
import Kalend, { CalendarView } from "kalend";
import "kalend/dist/styles/index.css";
import "./Modules.css";

function Modules() {
	/* ---- States ---------------------------------- */
	const { user } = useAuth();
	const study = useStudies({ userID: user.user_id }, {
		onSuccess: data => {
			const usableYears = yearsOptions.filter(y => y.value <= data.current_level);
			setYearsOptions(usableYears);
			setSelectedYears(usableYears);
			setUserCurrentYear(data.current_level);
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
	const [userCurrentYear, setUserCurrentYear] = useState();
	const modules = useModules({ years: noStudy ? null : selectedYears.map(y => y.value) }, {
		enabled: study.isUsable() || noStudy
	});

	const modulesPlanning = usePlanning({ year: userCurrentYear, eventType: "module" }, {
		enabled: study.isUsable() || noStudy
	});

	/* ---- Page content ---------------------------- */
	return (
		<div className="Modules">
			<Link to="/">&lt;-- Retour</Link>
			<h2>Liste des cours</h2>
			<Kalend
				events={[
					{
						id: 1,
						startAt: "2022-05-15T18:00:00.000Z",
						endAt: "2022-05-15T19:00:00.000Z",
						timezoneStartAt: "Europe/Paris", // optional
						summary: "test",
						color: "blue",
						calendarID: "modulePlanning",
						key: 1
					},
					{
						id: 2,
						startAt: "2022-05-12T18:00:00.000Z",
						endAt: "2022-05-12T19:00:00.000Z",
						timezoneStartAt: "Europe/Paris", // optional
						summary: "woooow",
						color: "red",
						calendarID: "modulePlanning",
						key: 2
					}
				]}
				initialDate={new Date().toISOString()}
				hourHeight={10}
				initialView={CalendarView.MONTH}
				disabledViews={[CalendarView.DAY]}
				timeFormat={"24"}
				weekDayStart={"Monday"}
				showWeekNumbers={true}
				calendarIDsHidden={["modulePlanning"]}
				language={"fr"}
				draggingDisabledConditions={{calendarID: "modulePlanning"}}
			/>
			{(!modulesPlanning.isUsable() || (!study.isUsable() && !noStudy)) ? ((modulesPlanning.isLoading || study.isLoading) && <Loader/>) : (
				console.log(modulesPlanning)
			)}
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
