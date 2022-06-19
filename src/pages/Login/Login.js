import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useForm, FormProvider } from "react-hook-form";
import useAuth, { states } from "../../context/Auth/AuthContext.js";
import usePageDisplay from "../../context/PageDisplay/PageDisplay.js";
import Inputs from "../../components/Inputs/Inputs.js";
import MicrosoftLogin from "../../components/Button/MicrosoftLogin/MicrosoftLogin.js";
import { ReactComponent as AppLogo } from "../../assets/images/synthesis_icon/synthesis.svg";
import "./Login.css";

function Login() {
	/* ---- States ---------------------------------- */
	const form = useForm();
	const auth = useAuth();
	const pageDisplay = usePageDisplay();
	
	/* ---- Effects --------------------------------- */
	useEffect(() => {
		pageDisplay.update({ header: false, navMenu: false, padding: false });
	}, [pageDisplay]);

	/* ---- Functions ------------------------------- */
	const handleLogin = data => {
		auth.login(data);
	};

	/* ---- Page content ---------------------------- */
	return (
		<div className="Login">
			{(auth.status === states.CONNECTED) ? <Navigate to="/" replace/> : (
				<div className="login-box">
					
					<div className="app-logo">
						<AppLogo/>
					</div>
					
					<h1>Connexion</h1>

					<FormProvider {...form}>
						<form onSubmit={form.handleSubmit(handleLogin)}>
							<Inputs.Email name="email" required>
								E-mail
							</Inputs.Email>
							
							<Inputs.Password name="password" required>
								Mot de passe
							</Inputs.Password>
							
							<input className="button primary-color" type="submit" value="Se connecter"/>
						</form>
					</FormProvider>

					<hr className="login-sep"/>
					<MicrosoftLogin style="light" disabled/>
				</div>
			)}
		</div>
	);
}

export default Login;
