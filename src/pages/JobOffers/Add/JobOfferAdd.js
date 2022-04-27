import { useState } from "react";
import { Link } from "react-router-dom";

function JobOfferAdd() {
	/* ---- States ---------------------------------- */
	const [jobOffer, setJobOffer] = useState({
		title: "",
		type: "stage",
		company_name: "",
		city: "",
		postal_code: "",
		expiration_date: "",
		content: "",
		attachements: ""
	});

	/* ---- Functions ------------------------------- */
	const handleChange = event => {
		const value = event.target.type === "checkbox" ? event.target.checked : event.target.value;
		setJobOffer(prevState => ({ ...prevState, [event.target.name]: value }));
	};

	/* ---- Page content ---------------------------- */
	return (
		<div className="JobOffers JobOffersAdd">
			<Link to="/jobs/offers">&lt;-- Retour</Link>

			<form>
				<fieldset>
					<legend>Offre d&apos;emploi</legend>

					<label>
						Titre
						<input type="text" name="title" value={jobOffer.title} onChange={handleChange} required/>
					</label>
					<br/>

					<label>
						Type
						<select name="type" onChange={handleChange} required>
							<option value="stage" selected={jobOffer.type === "stage"}>Stage</option>
							<option value="alternance" selected={jobOffer.type === "alternance"}>Alternance</option>
						</select>
					</label>
					<br/>

					<label>
						Entreprise
						<input type="text" name="company_name" value={jobOffer.company_name} onChange={handleChange} required/>
					</label>
					<br/>

					<label>
						Adresse
						<input type="text" name="city" placeholder="Ville" value={jobOffer.city} onChange={handleChange}/>
						<input type="text" name="postal_code" placeholder="Code postal" value={jobOffer.postal_code} onChange={handleChange}/>
					</label>
					<br/>

					<label>
						Date d&apos;expiration
						<input type="date" name="expiration_date" value={jobOffer.expiration_date} onChange={handleChange}/>
					</label>
					<br/>

					<label>
						Message
						<textarea name="content" value={jobOffer.content} onChange={handleChange}/>
					</label>
					<br/>

					<label>
						Fichiers joints
						<input type="file" name="attachements" value={jobOffer.attachements} onChange={handleChange} multiple/>
					</label>
					<br/>

					<input type="submit" value="Ajouter"/>
				</fieldset>
			</form>

			{JSON.stringify(jobOffer)}
		</div>
	);
}

export default JobOfferAdd;