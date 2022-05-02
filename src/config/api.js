import API from "../global/Endpoint.js";

export default {
	url: "https://localhost:8443/v1",
	files: "https://localhost:8443/files",
	users: {
		logIn: new API.POST("/users/login"),
		authenticate: new API.POST("/users/authenticate").mustThrow(false),
		getAll: new API.GET("/users/all")
	},
	permissions: {
		getAll: new API.GET("/permissions/all")
	},
	modules: {
		getAllNotesOfUser: new API.GET("/modules/notes/by-user-id/{userID}")
	},
	comptas: {
		getByUserID: new API.GET("/comptas/by-user-id/{userID}")
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
		delete: new API.DELETE("/jobs/offers/delete")
	},
	studies: {
		getByUserID: new API.GET("/studies/by-user-id/{userID}")
	}
};
