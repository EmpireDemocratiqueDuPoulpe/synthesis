import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import { CookiesProvider } from "react-cookie";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { MessageProvider } from "./context/Message/MessageContext.js";
import { AuthProvider } from "./context/Auth/AuthContext.js";
import App from "./pages/App/App.js";
// import reportWebVitals from "./reportWebVitals.js";
import "normalize.css";
import "./index.css";

const queryClient = new QueryClient();

ReactDOM.render(
	<Router>
		<CookiesProvider>
			<MessageProvider>
				<AuthProvider>
					<QueryClientProvider client={queryClient}>
						<React.StrictMode>
							<App/>
						</React.StrictMode>

						<ReactQueryDevtools initialIsOpen={false} toggleButtonProps={{ style: {opacity: 0.5} }}/>
					</QueryClientProvider>
				</AuthProvider>
			</MessageProvider>
		</CookiesProvider>
	</Router>,
	document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// TODO: reportWebVitals();
