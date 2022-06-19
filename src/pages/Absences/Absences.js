import { useState } from "react";
import useAuth from "../../context/Auth/AuthContext.js";
import usePageDisplay from "../../context/PageDisplay/PageDisplay.js";
import useAbsences from "../../hooks/absences/useAbsences.js";
import useStudents from "../../hooks/students/useStudents.js";
import useCampuses from "../../hooks/campuses/useCampuses.js";
import Loader from "../../components/Loader/Loader.js";
import Kalend, { CalendarView } from "kalend";
import "kalend/dist/styles/index.css";
import "./Absences.css";
import {FormProvider, useForm} from "react-hook-form";
import Inputs from "../../components/Inputs/Inputs";

const yearsOptions = [
	{ value: 1, label: "B.Eng.1" },
	{ value: 2, label: "B.Eng.2" },
	{ value: 3, label: "B.Eng.3" },
	{ value: 4, label: "M.Eng.1" },
	{ value: 5, label: "M.Eng.2" }
];

function Absences() {
	/* ---- States ---------------------------------- */
	const { user } = useAuth();
	const pageDisplay = usePageDisplay();
	const form = useForm();
	const filters = form.watch();
	
	const [selectedYears] = useState(user.study ? yearsOptions.filter(yo => yo.value <= user.study.current_level) : yearsOptions);

	const campuses = useCampuses({}, {
		onSuccess: data => {
			const mappedData = data.map(c => ({ value: c.campus_id, label: c.name }));
			setCampusesOptions(mappedData);
			setSelectedCampuses(mappedData.filter(c => c.value === user.campus.campus_id));
		}
	});
	const [campusesOptions, setCampusesOptions] = useState([]);
	const [selectedCampuses, setSelectedCampuses] = useState([]);

	const students = useStudents({ campus: selectedCampuses.map(c => c.label), expand: ["campus"] }, {
		onSuccess: data => {
			const mappedData = data.map(s => ({ value: s.user_id, label: s.first_name + " " + s.last_name }));
			setStudentsOptions(mappedData);
			setSelectedStudent(mappedData.filter(s => user.study ? (s.user_id === user.user_id) : (s.campus.name === user.campus.name)));
		}
	});
	const [studentsOptions, setStudentsOptions] = useState([]);
	const [selectedStudent, setSelectedStudent] = useState(user.study ? [user.user_id] : []);

	const absences = useAbsences({ userIDs: filters.studentsSelect, years: filters.yearsSelect, campusIDs: filters.campusesSelect });

	/* ---- Page content ---------------------------- */
	return (
		<div className="Planning">
			<h2 className="page_title">Absences</h2>

			{(!absences.isUsable() || !campuses.isUsable() || !students.isUsable()) ? ((absences.isLoading || campuses.isLoading || students.isLoading) && <Loader/>) : (
				<div>
					<div>
						<FormProvider {...form}>
							<form className="filters-root">
								<Inputs.Select
									name="yearsSelect"
									defaultValue={selectedYears}
									options={yearsOptions}
									multiple
								>
									Année(s)
								</Inputs.Select>

								<Inputs.Select
									name="campusesSelect"
									defaultValue={selectedCampuses}
									options={campusesOptions}
									multiple
								>
									Campus
								</Inputs.Select>

								<Inputs.Select
									name="studentsSelect"
									defaultValue={selectedStudent}
									options={studentsOptions}
									multiple
								>
									Étudiant(s)
								</Inputs.Select>
							</form>
						</FormProvider>
					</div>
					<Kalend
						events={absences.data.map((absence)=> ({
							id: absence.absence_id,
							key: `absence-item-${absence.absence_id}`,
							startAt: absence.start_date,
							endAt: absence.end_date,
							timezoneStartAt: "Europe/Paris", // optional
							summary: absence.user.first_name + " " + absence.user.last_name,
							color: "orange",
							calendarID: "absences"
						})).flat(1)}
						initialDate={new Date().toISOString()}
						hourHeight={10}
						initialView={CalendarView.MONTH}
						disabledViews={[CalendarView.DAY]}
						timeFormat={"24"}
						weekDayStart={"Monday"}
						isDark={pageDisplay.theme === "dark"}
						//showWeekNumbers={true}
						calendarIDsHidden={["absences"]}
						language={"fr"}
						draggingDisabledConditions={{calendarID: "absences"}}
					/>
				</div>

			)}

		</div>
	);
}

export default Absences;
