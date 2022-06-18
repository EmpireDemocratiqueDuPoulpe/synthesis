import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import useAuth from "../../context/Auth/AuthContext.js";
import usePlanning from "../../hooks/planning/usePlanning.js";
import useCampuses from "../../hooks/campuses/useCampuses.js";
import Loader from "../../components/Loader/Loader.js";
import Kalend, { CalendarView } from "kalend";
import Inputs from "../../components/Inputs/Inputs.js";
import TableFilters from "../../components/Table/TableFilters/TableFilters.js";
import "kalend/dist/styles/index.css";
import "./Planning.css";

const yearsOptions = [
	{ value: 1, label: "A.Sc.1" },
	{ value: 2, label: "A.Sc.2" },
	{ value: 3, label: "B.Sc" },
	{ value: 4, label: "M.Eng.1" },
	{ value: 5, label: "M.Eng.2" }
];

const eventTypesOptions = [
	{ value: "module", label: "Cours" },
	{ value: "misc", label: "Divers" }
];

function Planning() {
	/* ---- States ---------------------------------- */
	const { user } = useAuth();
	const form = useForm();
	const filters = form.watch();

	const campuses = useCampuses({}, {
		onSuccess: data => {
			const mappedData = data.map(c => ({ value: c.campus_id, label: c.name }));
			setCampusesOptions(mappedData);
			setSelectedCampuses(mappedData.filter(c => c.value === user.campus.campus_id));
		}
	});
	const planning = usePlanning({ years: filters.yearsSelect, eventTypes: filters.eventsSelect, campuses: filters.campusesSelect});

	const [selectedYears] = useState(user.study ? yearsOptions.filter(yo => yo.value <= user.study.current_level) : yearsOptions);
	const [campusesOptions, setCampusesOptions] = useState([]);
	const [selectedCampuses, setSelectedCampuses] = useState(user.campus ? [{ value: user.campus.campus_id, label: user.campus.name}] : []);
	const [selectedEventTypes] = useState(eventTypesOptions);

	/* ---- Page content ---------------------------- */
	return (
		<div className="Planning">
			<h2 className="page_title">Planning</h2>

			{(!planning.isUsable() || !campuses.isUsable()) ? ((planning.isLoading || campuses.isLoading) && <Loader/>) : (
				<div>
					<TableFilters>
						<FormProvider {...form}>
							<form className="filters-root">
								<Inputs.Select name="yearsSelect" defaultValue={selectedYears} options={yearsOptions} multiple>
									Promo
								</Inputs.Select>
								
								<Inputs.Select name="campusesSelect" defaultValue={selectedCampuses} options={campusesOptions} multiple>
									Campus
								</Inputs.Select>
								
								<Inputs.Select name="eventsSelect" defaultValue={selectedEventTypes} options={eventTypesOptions} multiple>
									Type d&apos;évènement
								</Inputs.Select>
							</form>
						</FormProvider>
					</TableFilters>
					
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
						isNewEventOpen={false}
					/>
				</div>
			)}

		</div>
	);
}

export default Planning;
