import "./Home.css";
import useAuth from "../../context/Auth/AuthContext.js";
import Card from "../../components/Card/Card.js";
import { solid } from "@fortawesome/fontawesome-svg-core/import.macro";
import tableImg from "../../assets/images/table.png";
import notesImg from "../../assets/images/notes.png";
import modulesImg from "../../assets/images/modules.png";
import calendarImg from "../../assets/images/calendar.png";
import jobsImg from "../../assets/images/jobs.png";
import absencesImg from "../../assets/images/absences.png";

//import jobs from "../../assets/images/jobs.png";

function Home() {
	const auth = useAuth();
	const { hasPermission, permissions } = useAuth();

	/* ---- Page content ---------------------------- */
	return (
		<div className="Home">
			<h1 className="page_title">Home</h1>
			<div className="dashboard">
				{hasPermission(permissions.READ_SCTS) && (
					<Card link={"/scts"} fa_icon={solid("chalkboard-user")} logo={tableImg} title={"Liste des SCTs"}>
						Visionner la liste<br/>de tous les intervenants
					</Card>
				)}
				{hasPermission(permissions.READ_OLD_STUDENTS) && (
					<Card link={"/students/old"} fa_icon={solid("graduation-cap")} logo={tableImg} title={"Liste des anciens étudiants"}>
						Afficher la liste de tous les anciens &eacute;tudiants
					</Card>
				)}
				{hasPermission(permissions.READ_STUDENTS) && (
					<Card link={"/students"} fa_icon={solid("address-book")} logo={tableImg} title={"Liste des étudiants"}>
						Lister tous les &eacute;tudiants
					</Card>
				)}
				{hasPermission(permissions.READ_MODULES) && (
					<Card link={"/modules"} fa_icon={solid("book")} logo={modulesImg} title={"Liste des modules"}>
						Répertorier tous les modules
					</Card>
				)}
				{hasPermission(permissions.READ_ECTS) && (
					<Card link={"/notes"} fa_icon={solid("arrow-up-9-1")} logo={notesImg} title={"Notes"}>
						Consulter les notes
					</Card>
				)}
				{hasPermission(permissions.READ_RESITS) && (
					<Card link={"/notes"} fa_icon={solid("repeat")} logo={tableImg} title={"Rattrapages"}>
						Afficher la liste<br/>des &eacute;tudiants en rattrapages
					</Card>
				)}
				{hasPermission(permissions.READ_PLANNINGS) && (
					<Card link={"/planning"} fa_icon={solid("calendar-days")} logo={calendarImg} title={"Planning"}>
						Naviguer sur le calendrier<br/>des cours et des &eacute;v&egrave;nements
					</Card>
				)}
				{hasPermission(permissions.MANAGE_ABSENCES) && (
					<Card link={"/absences"} fa_icon={solid("calendar-xmark")} logo={absencesImg} title={"Absences"}>
						Naviguer sur<br/>le calendrier des absences
					</Card>
				)}
				{(hasPermission(permissions.READ_COMPTA) && auth.user?.position.name !== "Étudiant" )&& (
					<Card link={"/comptabilite"} fa_icon={solid("coins")} logo={tableImg} title={"Comptabilité"}>
						Visualiser la comptabilit&eacute; de tous les &eacute;tudiants
					</Card>
				)}
				{hasPermission(permissions.READ_INTERNSHIP_OFFERS) && (
					<Card link={"/jobs/offers"} fa_icon={solid("newspaper")} logo={jobsImg} title={"Offres d'emploi"}>
						Afficher les offres<br/>de stage et d&apos;alternance
					</Card>
				)}
				{hasPermission(permissions.READ_STUDENTS_JOBS) && (
					<Card link={"/jobs"} fa_icon={solid("file-contract")} logo={tableImg} title={"Stages/Alternances"}>
						Lister les stages<br/>et alternances des &eacute;tudiants
					</Card>
				)}
			</div>
		</div>
	);
}

export default Home;
