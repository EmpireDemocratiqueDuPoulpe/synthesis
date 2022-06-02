import { useState } from "react";
import { Link } from "react-router-dom";
import useStudents from "../../../hooks/students/useStudents.js";
import Loader from "../../../components/Loader/Loader.js";
import { clickOnEnter } from "../../../global/Functions.js";

function ComptaAll() {
	/* ---- States ---------------------------------- */
	const students = useStudents({ expand: "compta" });
	const [selectedStudent, setSelectedStudent] = useState(null);
	
	/* ---- Functions ------------------------------- */
	const selectStudent = student => {
		setSelectedStudent(student.user_id);
	};
	
	/* ---- Page content ---------------------------- */
	return (
		<div className="Compta ComptaAll">
			<Link to="/">&lt;-- Retour</Link>
			{!students.isUsable() ? (students.isLoading && <Loader/>) : (
				<>
					<div>
						{students.data.map(student => (
							<div key={`student-compta-list-student-${student.user_id}`} onClick={() => selectStudent(student)} onKeyDown={e => clickOnEnter(e, selectStudent, student)} role="button" tabIndex={0}>
								<p>{student.first_name} {student.last_name}</p>
								<p>{student.email}</p>
							</div>
						))}
					</div>
					
					<div>
						{selectedStudent && (() => {
							const student = students.data.filter(s => s.user_id === selectedStudent)[0];
							
							return (
								<>
									<p>{student.first_name} {student.last_name}</p>
									<p>Paiement: {student.compta.payment_type}</p>
									<p>Doit: {student.compta.payment_due} &euro;</p>
									<p>A payé: {student.compta.paid ? "oui" : "non"}</p>
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
