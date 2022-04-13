import { LogLevel } from "@azure/msal-browser";

export default {
	msal: {
		auth: {
			clientId: "5aff06de-e68d-400c-acdd-a2c5a6ca035b",
			authority: "https://login.microsoftonline.com/1dc8f08a-46f6-4cdb-b8ff-03e46c14979d",
			/*authority: "https://login.microsoftonline.com/2f829691-1a58-4bf9-a2ee-fcfbafb54e22",*/
			/*authority: "https://login.microsoftonline.com/1dc8f08a-46f6-4cdb-b8ff-03e46c14979d",*/
			knownAuthorities: [],
			redirectUri: "https://localhost:3000/blank.html",
			postLogoutRedirectUri: "https://localhost:3000/logout",
			navigateToLoginRequestUrl: false,
		},
		cache: {
			cacheLocation: "sessionStorage",
			storeAuthStateInCookie: false,
		},
		system: {
			loggerOptions: {
				loggerCallback: (level, message, containsPii) => {
					if (containsPii) return;

					switch (level) {
						case LogLevel.Error:
							console.error(message);
							break;
						case LogLevel.Info:
							console.info(message);
							break;
						case LogLevel.Verbose:
							console.debug(message);
							break;
						case LogLevel.Warning:
							console.warn(message);
							break;
					}
				},
				piiLoggingEnabled: false,
			},
			windowHashTimeout: 60000,
			iframeHashTimeout: 6000,
			loadFrameTimeout: 0,
		}
	},
	login: {
		scopes: [ "User.Read" ]
	},
	graph: {
		graphMeEndpoint: "https://graph.microsoft.com/v1.0/me"
	}
};