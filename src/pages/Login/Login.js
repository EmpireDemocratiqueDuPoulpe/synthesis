import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useForm, FormProvider } from "react-hook-form";
import useAuth, { states } from "../../context/Auth/AuthContext.js";
import usePageDisplay from "../../context/PageDisplay/PageDisplay.js";
import Inputs from "../../components/Inputs/Inputs.js";
import "./Login.css";

function Login() {
	/* ---- States ---------------------------------- */
	const form = useForm({ defaultValues: {email: "jay.rate@forni.te", password: "Mot De P4sse"} });
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
				</div>
			)}
		</div>
	);
}

export default Login;
