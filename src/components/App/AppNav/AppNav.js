import { useState } from "react";
import useClassName from "../../../hooks/className/useClassName.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { solid } from "@fortawesome/fontawesome-svg-core/import.macro";
import NavBuilder from "../../Routes/NavBuilder/NavBuilder.js";
import { Routes } from "../../../config/config.js";
import "./AppNav.css";

function AppNav() {
	/* ---- States ---------------------------------- */
	const [isOpen, setOpen] = useState(false);
	const classes = useClassName(hook => {
		hook.set("App-nav");
		hook.setIf(isOpen, "open");
	}, [isOpen]);
	
	/* ---- Page content ---------------------------- */
	return (
		<nav className={classes}>
			<button className="app-nav-btn" onClick={() => setOpen(!isOpen)}>
				<FontAwesomeIcon icon={isOpen ? solid("xmark") : solid("bars")}/>
			</button>
			<NavBuilder routes={Routes}/>
		</nav>
	);
}

export default AppNav;