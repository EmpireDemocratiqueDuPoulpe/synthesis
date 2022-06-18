import { useState, Fragment } from "react";
import useAuth from "../../../context/Auth/AuthContext.js";
import useStudents from "../../../hooks/students/useStudents.js";
import Loader from "../../../components/Loader/Loader.js";
import { Scrollbars } from "react-custom-scrollbars-2";
import Button from "../../../components/Button/Button.js";
import { clickOnEnter, toCurrency } from "../../../global/Functions.js";
import "./ComptaAll.css";

function ComptaAll() {
	/* ---- States ---------------------------------- */
	const { hasPermission, permissions } = useAuth();
	const students = useStudents({
		expand: ["compta", (hasPermission(permissions.READ_CAMPUS) ? "campus~" : "")]
	});
	const [selectedStudent, setSelectedStudent] = useState(null);
	
	/* ---- Functions ------------------------------- */
	const generateStudents = students => {
		const studentsByCampus = [];
		
		students.forEach(student => {
			const campusName = student?.campus.name ?? "Sans campus";
			let index = studentsByCampus.findIndex(c => c.name === campusName);
			
			if (index === -1) {
				studentsByCampus.push({ name: campusName, students: [] });
				index = studentsByCampus.length - 1;
			}
			
			studentsByCampus[index].students.push(
				<div className="student_list_item" key={`student-compta-list-student-${student.user_id}`} onClick={() => selectStudent(student)} onKeyDown={e => clickOnEnter(e, selectStudent, student)} role="button" tabIndex={0}>
					<p className="student_name">{student.first_name} {student.last_name}</p>
					<p className="student_email">{student.email}</p>
					<p className="student_region">{student.region}</p>
				</div>
			);
		});
		
		return studentsByCampus;
	};
	
	const selectStudent = student => {
		setSelectedStudent(student.user_id);
	};
	
	/* ---- Page content ---------------------------- */
	return (
		<div className="Compta ComptaAll">
			<h2 className="page_title">Comptabilité</h2>
			
			<div className="student_list_root">
				{!students.isUsable() ? (students.isLoading && <Loader/>) : (
					<>
						<Scrollbars className="student_list-scrollbar" style={{ height: "calc(100vh - 41px - (25px * 2) - 68px - 40px)" }}>
							<div className="student_list">
								{generateStudents(students.data).map(campus => (
									<Fragment key={`student-list-of-${campus.name}`}>
										<div className="campus-name">
											{campus.name}
										</div>
										{campus.students}
									</Fragment>
								))}
							</div>
						</Scrollbars>

						<div className={`student_compta_infos${selectedStudent ? "" : " no-student"}`}>
							{selectedStudent && (() => {
								const student = students.data.filter(s => s.user_id === selectedStudent)[0];
								const remaining = student.compta.payment_due - student.compta.paid;
								const remainingClass = remaining > 0 ? "remaining_red" : "remaining_green";

								return (
									<>
										<h3 className="student_name">{student.first_name} {student.last_name}</h3>
										<p><span className="bold">Type de paiement :</span> {student.compta.payment_type}</p>
										<p><span className="bold">Somme dûe :</span> {toCurrency(student.compta.payment_due)}</p>
										<p><span className="bold">Somme pay&eacute;e :</span> {toCurrency(student.compta.paid)}</p>
										<p><span className="bold">Balance :</span> <span className={remainingClass}>{toCurrency(remaining, { plusSign: true, inverted: true })}</span></p>
										
										<Button link={{ to: `/user/${student.uuid}` }} outlined>
											Voir le profil
										</Button>
									</>
								);
							})()}
						</div>
					</>
				)}
			</div>

		</div>
	);
}

export default ComptaAll;
