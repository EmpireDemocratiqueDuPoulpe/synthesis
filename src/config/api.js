import API from "../global/Endpoint.js";

// const domain = "localhost:8443";
const domain = "synthesis-api.v6.rocks";

export default {
	domain,
	url: `https://${domain}/v1`,
	files: `https://${domain}/files`,
	users: {
		logIn: new API.POST("/users/login"),
		authenticate: new API.POST("/users/authenticate").mustThrow(false),
		getByUUID: new API.GET("/users/by-uuid/{UUID}"),
	},
	permissions: {
		getAll: new API.GET("/permissions/all")
	},
	modules: {
		getAll: new API.GET("/modules/all"),
		getAllNotesOfUser: new API.GET("/modules/notes/by-user-id/{userID}")
	},
	planning: {
		getAll: new API.GET("/planning/all"),
	},
	jobDomains: {
		getAll: new API.GET("/jobs/domains/all"),
	},
	jobOffers: {
		add: new API.POST("/jobs/offers") // <- Sending FormData
			.headers({ "Content-Type": null, "Accept": "application/json" }, true)
			.stringify(false),
		getAll: new API.GET("/jobs/offers/all"),
		getByID: new API.GET("/jobs/offers/by-id/{jobOfferID}"),
		update: new API.PUT("/jobs/offers"),
		delete: new API.DELETE("/jobs/offers/delete")
	},
	resits: {
		getStudents: new API.GET("/resits/students"),
	},
	scts: {
		getAll: new API.GET("/scts/all"),
	},
	students: {
		getAll: new API.GET("/students/all"),
		getByUUID: new API.GET("/students/by-uuid/{UUID}"),
	},
	studies: {
		getByUserID: new API.GET("/studies/by-user-id/{userID}")
	},
	comptas: {
		getByUUID: new API.GET("/comptas/by-uuid/{UUID}")
	},
	campuses: {
		getAll: new API.GET("/campuses/all"),
		getByID: new API.GET("/campuses/by-id/{campusID}"),
	},
	absences: {
		getAll: new API.GET("/absences/all"),
	},
};
