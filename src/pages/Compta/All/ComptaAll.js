import useAuth from "../../../context/Auth/AuthContext.js";
import { useState } from "react";
import useStudents from "../../../hooks/students/useStudents.js";
import Loader from "../../../components/Loader/Loader.js";
import { clickOnEnter } from "../../../global/Functions.js";
import "./ComptaAll.css";

function ComptaAll() {
	/* ---- States ---------------------------------- */
	const { hasPermission, permissions } = useAuth();

	const students = useStudents({
		expand: ["compta", (hasPermission(permissions.READ_CAMPUS) ? "campus~" : "")]
	});
	const [selectedStudent, setSelectedStudent] = useState(null);
	
	/* ---- Functions ------------------------------- */
	const selectStudent = student => {
		setSelectedStudent(student.user_id);
	};
	
	/* ---- Page content ---------------------------- */
	return (
		<div className="Compta ComptaAll">
			{!students.isUsable() ? (students.isLoading && <Loader/>) : (
				<>
					<div className="student_list">
						{students.data.map(student => (
							<div className="student_list_item" key={`student-compta-list-student-${student.user_id}`} onClick={() => selectStudent(student)} onKeyDown={e => clickOnEnter(e, selectStudent, student)} role="button" tabIndex={0}>
								<p className="student_name">{student.first_name} {student.last_name}</p>
								<p className="student_email">E-Mail: {student.email}</p>
								<p className="student_campus">Campus: {student.campus.name}</p>
								<p className="student_region">Pays: {student.region}</p>
							</div>
						))}
					</div>
					
					<div className="student_compta_infos">
						{selectedStudent && (() => {
							const student = students.data.filter(s => s.user_id === selectedStudent)[0];
							const remaining = student.compta.payment_due - student.compta.paid;
							const remainingClass = remaining > 0 ? "remaining_red" : "remaining_green";

							return (
								<>
									<p className="student_name">{student.first_name} {student.last_name}</p>
									<p>Type de paiement: {student.compta.payment_type}</p>
									<p>Somme dûe: {student.compta.payment_due} &euro;</p>
									<p>Somme pay&eacute;e: {student.compta.paid} &euro;</p>
									<p>Total restant: <span className={remainingClass}>{(remaining > 0) && "+"}{remaining} &euro;</span></p>
									<br/>
									<p className="student_campus">Campus: {student.campus.name}</p>
									<p className="student_region">Pays: {student.region}</p>
								</>
							);
						})()}
					</div>
				</>
			)}
		</div>
	);
}

export default ComptaAll;
