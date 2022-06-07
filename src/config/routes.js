import Home from "../pages/Home/Home.js";
import Login from "../pages/Login/Login.js";
import SCTs from "../pages/SCTs/SCTs.js";
import Students from "../pages/Students/Students.js";
import Planning from "../pages/Planning/Planning.js";
import Compta from "../pages/Compta/Compta.js";
import Jobs from "../pages/Jobs/Jobs.js";
import JobOffers from "../pages/JobOffers/JobOffers.js";
import Notes from "../pages/Notes/Notes.js";
import Modules from "../pages/Modules/Modules.js";
import Resits from "../pages/Resits/Resits.js";
import Errors from "../pages/Errors/Errors.js";
import { solid } from "@fortawesome/fontawesome-svg-core/import.macro";

// TODO: Links to add :
// 	Partenaires, synchroniser les données & exporter les données.
export default [
	// Authentication
	{ path: "/login", element: Login, protected: false },
	
	// SCTs
	{
		path: "/scts",
		element: SCTs.all,
		protected: true,
		permissions: [ "READ_SCTS" ],
		link: {
			label: "SCTs",
			icon: { file: solid("chalkboard-user") },
		},
	},
	
	// Students
	{ path: "/student/:UUID", element: Students.byUUID, protected: true },
	{
		path: "/students/old",
		element: Students.old,
		protected: true,
		permissions: [ "READ_OLD_STUDENTS" ],
		link: {
			label: "Anciens étudiants",
			icon: { file: solid("graduation-cap") },
		},
	},
	{
		path: "/students",
		element: Students.all,
		protected: true,
		permissions: [ "READ_STUDENTS" ],
		link: {
			label: "Étudiants",
			icon: { file: solid("graduation-cap") },
		},
	},
	
	// Modules, notes & resits
	{
		path: "/modules",
		element: Modules,
		protected: true,
		permissions: [ "READ_MODULES" ],
		link: {
			label: "Modules",
			icon: { file: solid("book") },
		},
	},
	{
		path: "/notes",
		element: Notes,
		protected: true,
		permissions: [ "READ_ECTS" ],
		link: {
			label: "Notes",
			icon: { file: solid("arrow-up-9-1") },
		},
	},
	{
		path: "/resits",
		element: Resits,
		protected: true,
		permissions: [ "READ_RESITS" ],
		link: {
			label: "Resits",
			icon: { file: solid("repeat") },
		},
	},
	
	// Planning
	{
		path: "/planning",
		element: Planning,
		protected: true,
		permissions: [ "READ_PLANNINGS" ],
		link: {
			label: "Planning",
			icon: { file: solid("calendar") },
		},
	},
	
	// Absences
	{
		path: "/absences",
		element: () => <p>la page</p>,
		protected: true,
		permissions: [ "MANAGE_ABSENCES" ],
		link: {
			label: "Absences",
			icon: { file: solid("circle-notch") },
		},
	},
	
	// Accounting
	{
		path: "/comptabilite/:UUID",
		element: Compta.byUUID,
		protected: true,
		permissions: [ "READ_COMPTA" ],
		link: {
			label: "Comptabilité",
			if: (auth) => auth.user?.position.name === "Étudiant",
			override: (auth) => `/comptabilite/${auth.user.uuid}`,
			icon: { file: solid("receipt") },
		},
	},
	{
		path: "/comptabilite",
		element: Compta.all,
		protected: true,
		permissions: [ "READ_COMPTA" ],
		link: {
			label: "Comptabilité",
			if: (auth) => auth.user?.position.name !== "Étudiant",
			icon: { file: solid("receipt") },
		},
	},
	
	// Jobs & job offers
	{
		path: "/jobs/offer/:jobOfferID",
		element: JobOffers.byID,
		protected: true,
		permissions: [ "READ_INTERNSHIP_OFFERS" ],
	},
	{
		path: "/jobs/offers/add",
		element: JobOffers.add,
		protected: true,
		permissions: [ "EDIT_INTERNSHIP_OFFERS" ],
	},
	{
		path: "/jobs/offers",
		element: JobOffers.all,
		protected: true,
		permissions: [ "READ_INTERNSHIP_OFFERS" ],
		link: {
			label: "Offres d'emploi",
			icon: { file: solid("newspaper") },
		},
	},
	{
		path: "/jobs",
		element: Jobs,
		protected: true,
		permissions: [ "READ_STUDENTS_JOBS" ],
		link: {
			label: "Stages/Alternances",
			icon: { file: solid("newspaper") },
		},
	},
	
	// Home
	{
		path: "/",
		element: Home,
		protected: true,
		link: {
			label: "Accueil",
			icon: { file: solid("house") },
		},
	},
	
	// Errors
	{ path: "*", element: Errors.NotFound, protected: false },
];