import { useState } from "react";
import Select from "react-select";
import useAuth from "../../context/Auth/AuthContext.js";
import useAbsences from "../../hooks/absences/useAbsences.js";
import useStudents from "../../hooks/students/useStudents.js";
import useCampuses from "../../hooks/campuses/useCampuses.js";
import Loader from "../../components/Loader/Loader.js";
import Kalend, { CalendarView } from "kalend";
import "kalend/dist/styles/index.css";
import "./Absences.css";

function Absences() {
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

	const absences = useAbsences({ userIDs: selectedStudent.map(s => s.value), years: selectedYears.map(y => y.value), campusIDs: selectedCampuses.map(c => c.value)});

	/* ---- Page content ---------------------------- */
	return (
		<div className="Planning">
			<h2>Planning</h2>

			{(!absences.isUsable() || !campuses.isUsable() || !students.isUsable()) ? ((absences.isLoading || campuses.isLoading || students.isLoading) && <Loader/>) : (
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
					<span>Étudiant(s)</span>
					<Select
						options={studentsOptions}
						defaultValue={selectedStudent}
						onChange={setSelectedStudent}
						isMulti
					/>
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
