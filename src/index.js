import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import { CookiesProvider } from "react-cookie";
import { PublicClientApplication } from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";
import { MessageProvider } from "./context/Message/MessageContext.js";
import { AuthProvider } from "./context/Auth/AuthContext.js";
import App from "./pages/App/App.js";
// import reportWebVitals from "./reportWebVitals.js";
import { Auth } from "./config/config.js";
import "normalize.css";
import "./index.css";

const msal = new PublicClientApplication(Auth.msal);

ReactDOM.render(
	<Router>
		<CookiesProvider>
			<MessageProvider>
				<MsalProvider instance={msal}>
					<AuthProvider>
						<React.StrictMode>
							<App/>
						</React.StrictMode>
					</AuthProvider>
				</MsalProvider>
			</MessageProvider>
		</CookiesProvider>
	</Router>,
	document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// TODO: reportWebVitals();
