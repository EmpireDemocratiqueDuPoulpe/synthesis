import { useLocation, useNavigate } from "react-router-dom";
import useAuth, { states } from "../../context/Auth/AuthContext.js";
import usePageDisplay from "../../context/PageDisplay/PageDisplay.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { solid } from "@fortawesome/fontawesome-svg-core/import.macro";
import AppNav from "../../components/App/AppNav/AppNav.js";
import UserIcon from "../../components/UserIcon/UserIcon.js";
import RoutesBuilder from "../../components/Routes/RoutesBuilder/RoutesBuilder.js";
import { eventOnElement } from "../../global/Functions.js";
import { Routes } from "../../config/config.js";
import "./App.css";

function App() {
	/* ---- States ---------------------------------- */
	const location = useLocation();
	const navigate = useNavigate();
	const { status, user } = useAuth();
	const pageDisplay = usePageDisplay();
	
	/* ---- Page content ---------------------------- */
	// TODO: Choose between french/english urls
	return (
		<div className={`App ${pageDisplay.theme}`}>
			{pageDisplay.navMenu && <AppNav/>}
			
			<div className="App-page">
				{pageDisplay.header && (
					<div className="App-header">
						<button className="back-btn" onClick={() => navigate(-1)} disabled={location.pathname === "/"}>
							<FontAwesomeIcon icon={solid("arrow-left-long")} size="1x"/>
						</button>
						
						{status === states.CONNECTED && (
							<div className="header-settings">
								<div className="header-user">
									<UserIcon user={user}/>
								</div>
								
								<div className="header-theme" {...eventOnElement(pageDisplay.switchTheme)}>
									<FontAwesomeIcon icon={pageDisplay.theme === "light" ? solid("moon") : solid("sun")}/>
								</div>
							</div>
						)}
					</div>
				)}
				
				<div className={`App-body ${pageDisplay.padding ? "padding" : "no-padding"}`}>
					<RoutesBuilder routes={Routes}/>
				</div>
			</div>
		</div>
	);
}

export default App;
