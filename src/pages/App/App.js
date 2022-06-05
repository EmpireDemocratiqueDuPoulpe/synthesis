import { useLocation, useNavigate } from "react-router-dom";
import useAuth, { states } from "../../context/Auth/AuthContext.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { solid } from "@fortawesome/fontawesome-svg-core/import.macro";
import UserIcon from "../../components/UserIcon/UserIcon.js";
import RoutesBuilder from "../../components/Routes/RoutesBuilder/RoutesBuilder.js";
import NavBuilder from "../../components/Routes/NavBuilder/NavBuilder.js";
import { Routes } from "../../config/config.js";
import "./App.css";

function App() {
	/* ---- States ---------------------------------- */
	const location = useLocation();
	const navigate = useNavigate();
	const { status, user } = useAuth();
	
	/* ---- Page content ---------------------------- */
	// TODO: Choose between french/english urls
	return (
		<div className="App">
			<nav className="App-nav">
				<NavBuilder routes={Routes}/>
			</nav>
			
			<div className="App-page">
				<div className="App-header">
					<button className="back-btn" onClick={() => navigate(-1)} disabled={location.pathname === "/"}>
						<FontAwesomeIcon icon={solid("arrow-left-long")} size="1x"/>
					</button>
					
					{status === states.CONNECTED && (
						<div className="header-user">
							<UserIcon user={user}/>
						</div>
					)}
				</div>
				
				<div className="App-body">
					<RoutesBuilder routes={Routes}/>
				</div>
			</div>
		</div>
	);
}

export default App;
