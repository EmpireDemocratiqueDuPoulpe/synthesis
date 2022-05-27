import { Link } from "react-router-dom";
import useAuth from "../../context/Auth/AuthContext.js";
import usePlanning from "../../hooks/planning/usePlanning.js";
import Loader from "../../components/Loader/Loader.js";
import Kalend, { CalendarView } from "kalend";
import "kalend/dist/styles/index.css";
import "./Planning.css";
import {useState} from "react";

function Planning() {
	/* ---- States ---------------------------------- */
	const { user } = useAuth();

	const [planningEvents, setPlanningEvents] = useState([]);

	const planning = usePlanning({year: user.study ? user.study.current_level : "", eventType: "module"}, {
		onSuccess: data => {
			let events = [];
			data.map((event)=> {
				events.push({
					startAt: event.date,
					endAt: event.date,
					timezoneStartAt: "Europe/Paris", // optional
					summary: event.event_name,
					color: "blue",
					calendarID: "planning",
					key: event.planning_id
				});
			});
			setPlanningEvents(events);
			console.log(data);
		},
		onError: () => console.log("Error retrieving events"),
		retry: 0
	});

	/* ---- Page content ---------------------------- */
	return (
		<div className="Modules">
			<Link to="/">&lt;-- Retour</Link>
			<h2>Planning</h2>
			<Kalend
				events={planningEvents}
				initialDate={new Date().toISOString()}
				hourHeight={10}
				initialView={CalendarView.MONTH}
				disabledViews={[CalendarView.DAY]}
				timeFormat={"24"}
				weekDayStart={"Monday"}
				showWeekNumbers={true}
				calendarIDsHidden={["planning"]}
				language={"fr"}
				draggingDisabledConditions={{calendarID: "planning"}}
			/>
			{!planning.isUsable() ? (planning.isLoading && <Loader/>) : (
				console.log(planning)
			)}

		</div>
	);
}

export default Planning;
