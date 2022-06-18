import { useState } from "react";
import useAuth from "../../../context/Auth/AuthContext.js";
import useClassName from "../../../hooks/className/useClassName.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { solid } from "@fortawesome/fontawesome-svg-core/import.macro";
import NavBuilder from "../../Routes/NavBuilder/NavBuilder.js";
import { Routes } from "../../../config/config.js";
import "./AppNav.css";

function AppNav() {
	/* ---- States ---------------------------------- */
	const [isOpen, setOpen] = useState(false);
	const auth = useAuth();
	const classes = useClassName(hook => {
		hook.set("App-nav");
		hook.setIf(isOpen, "open");
	}, [isOpen]);
	
	/* ---- Page content ---------------------------- */
	return (
		<nav className={classes}>
			<div className="App-nav-fixed">
				<button className="app-nav-btn" onClick={() => setOpen(!isOpen)}>
					<FontAwesomeIcon icon={isOpen ? solid("xmark") : solid("bars")}/>
				</button>
				
				<NavBuilder routes={Routes}/>
				
				<button className="app-nav-btn logout-btn" onClick={() => auth.setDisconnected()}>
					<FontAwesomeIcon icon={solid("right-from-bracket")}/>
				</button>
			</div>
		</nav>
	);
}

export default AppNav;
