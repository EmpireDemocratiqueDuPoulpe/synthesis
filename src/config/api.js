import API from "../global/Endpoint.js";

export default {
	url: "https://localhost:8443/v1",
	users: {
		logIn: new API.POST("/users/login"),
		authenticate: new API.POST("/users/authenticate").mustThrow(false),
		getAll: new API.GET("/users/all")
	},
	permissions: {
		getAll: new API.GET("/permissions/all")
	},
	notes: {
		getAllOfUser: new API.GET("/notes/by-user-id/{userID}")
	},
	comptas: {
		getByUserID: new API.GET("/comptas/by-user-id/{userID}")
	}
};
