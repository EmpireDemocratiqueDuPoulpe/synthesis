function Login() {
	return (
		<>
			<h1>Connexion</h1>

			<fieldset>
				<legend>yo</legend>

				<label>
					<span>E-mail</span>
					<input type="email" name="email"/>
				</label>

				<label>
					<span>Mot de passe</span>
					<input type="password" name="password"/>
				</label>

				<input type="submit" value="Se connecter"/>
			</fieldset>
		</>
	);
}

export default Login;