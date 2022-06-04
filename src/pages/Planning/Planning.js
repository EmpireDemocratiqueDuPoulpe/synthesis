import { Link } from "react-router-dom";
import useAuth from "../../context/Auth/AuthContext.js";
import usePlanning from "../../hooks/planning/usePlanning.js";
import Loader from "../../components/Loader/Loader.js";
import Kalend, { CalendarView } from "kalend";
import "kalend/dist/styles/index.css";
import "./Planning.css";
import {useState} from "react";
import Select from "react-select";
//import {useState} from "react";

function Planning() {
	/* ---- States ---------------------------------- */
	const { user } = useAuth();

	const yearsOptions = [
		{ value: 1, label: "A.Sc.1" },
		{ value: 2, label: "A.Sc.2" },
		{ value: 3, label: "B.Sc" },
		{ value: 4, label: "M.Eng.1" },
		{ value: 5, label: "M.Eng.2" }
	];
	const [selectedYears, setSelectedYears] = useState(
		user.study ? yearsOptions.filter(yo => yo.value <= user.study.current_level) : yearsOptions
	);

	const campusesOptions = [
		{ value: 10000, label: "Caen" },
		{ value: 10001, label: "Distanciel" },
		{ value: 10002, label: "Lille" },
		{ value: 10003, label: "Lyon" },
		{ value: 10004, label: "Paris" },
		{ value: 10005, label: "Tours" }
	];
	const [selectedCampuses, setSelectedCampuses] = useState(
		user.campus ? campusesOptions.filter(c => c.value === user.campus.campus_id) : campusesOptions
	);

	const eventTypesOptions = [
		{ value: "module", label: "Cours" },
		{ value: "misc", label: "Divers" }
	];
	const [selectedEventTypes, setSelectedEventTypes] = useState(eventTypesOptions);

	const planning = usePlanning({ years: selectedYears.map(y => y.value), eventTypes: selectedEventTypes.map(e => e.value), campuses: selectedCampuses.map(c => c.value)});

	/* ---- Page content ---------------------------- */
	return (
		<div className="Planning">
			<Link to="/">&lt;-- Retour</Link>
			<h2>Planning</h2>

			{!planning.isUsable() ? (planning.isLoading && <Loader/>) : (
				<div>
					<span>Année(s)</span>
					<Select
						options={yearsOptions}
						defaultValue={selectedYears}
						onChange={setSelectedYears}
						isMulti
					/>
					<span>Campus</span>
					<Select
						options={campusesOptions}
						defaultValue={selectedCampuses}
						onChange={setSelectedCampuses}
						isMulti
					/>
					<span>Type(s) d&apos;évènement(s)</span>
					<Select
						options={eventTypesOptions}
						defaultValue={selectedEventTypes}
						onChange={setSelectedEventTypes}
						isMulti
					/>
					<Kalend
						events={planning.data.map((event)=> ({
							id: event.planning_id,
							key: `planning-event-${event.planning_id}`,
							startAt: event.start_date,
							endAt: event.end_date,
							timezoneStartAt: "Europe/Paris", // optional
							summary: event.module ? event.module.year + event.module.name : event.event_name,
							color: event.event_type === "module" ? "blue" : (event.event_type === "misc" ? "orange" : "gray"),
							calendarID: "planning"
						})).flat(1)}
						initialDate={new Date().toISOString()}
						hourHeight={10}
						initialView={CalendarView.MONTH}
						disabledViews={[CalendarView.DAY]}
						timeFormat={"24"}
						weekDayStart={"Monday"}
						//showWeekNumbers={true}
						calendarIDsHidden={["planning"]}
						language={"fr"}
						draggingDisabledConditions={{calendarID: "planning"}}
					/>
				</div>

			)}

		</div>
	);
}

export default Planning;
