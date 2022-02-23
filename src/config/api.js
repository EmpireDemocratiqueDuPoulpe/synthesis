import API from "../global/Endpoint.js";

export default {
	url: "https://localhost:8443/v1",
	users: {
		logIn: new API.POST("/users/login"),
		authenticate: new API.POST("/users/authenticate").mustThrow(false)
	}
};