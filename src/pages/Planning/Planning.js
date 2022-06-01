import { Link } from "react-router-dom";
import useAuth from "../../context/Auth/AuthContext.js";
import usePlanning from "../../hooks/planning/usePlanning.js";
import Loader from "../../components/Loader/Loader.js";
import Kalend, { CalendarView } from "kalend";
import "kalend/dist/styles/index.css";
import "./Planning.css";

function Planning() {
	/* ---- States ---------------------------------- */
	const { user } = useAuth();
	const planning = usePlanning({
		years: [user.study ? user.study.current_level : ""],
		campuses: [user.campus ? user.campus.campus_id : ""]});

	/* ---- Page content ---------------------------- */
	return (
		<div className="Planning">
			<Link to="/">&lt;-- Retour</Link>
			<h2>Planning</h2>
			{!planning.isUsable() ? (planning.isLoading && <Loader/>) : (
				<Kalend
					events={planning.data.map((event)=> {
						return {
							key: event.planning_id,
							startAt: event.start_date,
							endAt: event.end_date,
							timezoneStartAt: "Europe/Paris", // optional
							summary: event.event_name,
							color: "blue",
							calendarID: "planning"
						};
					}).flat(1)}
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
			)}

		</div>
	);
}

export default Planning;
