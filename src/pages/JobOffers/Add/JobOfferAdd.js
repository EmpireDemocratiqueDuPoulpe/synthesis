import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useJobOffers from "../../../hooks/jobOffers/useJobOffers.js";
import useJobDomains from "../../../hooks/jobDomains/useJobDomains.js";
import Loader from "../../../components/Loader/Loader.js";

function JobOfferAdd() {
	/* ---- States ---------------------------------- */
	const jobOffers = useJobOffers({}, { enabled: false });
	const jobDomains = useJobDomains();
	const [jobOffer, setJobOffer] = useState({
		title: "",
		type: "stage",
		company_name: "",
		city: "",
		postal_code: "",
		expiration_date: "",
		domains: [],
		content: "",
		attachements: []
	});
	const navigate = useNavigate();

	/* ---- Functions ------------------------------- */
	const handleChange = event => {
		const value = event.target.type === "checkbox" ? event.target.checked : event.target.value;
		setJobOffer(prevState => ({ ...prevState, [event.target.name]: value }));
	};
	
	const handleDomainsChange = event => {
		setJobOffer(prevState => ({
			...prevState,
			[event.target.name]: Array.from(event.target.selectedOptions, (opt => opt.value))
		}));
	};
	
	const handleFilesChange = event => {
		setJobOffer(prevState => ({ ...prevState, attachements: event.target.files ? Array.from(event.target.files) : [] }));
	};
	
	const handleSubmit = event => {
		event.preventDefault();
		const formData = new FormData();
		
		const objToFormData = (objName, obj, exclude) => {
			Object.entries(obj).forEach(([key, value]) => {
				if (exclude.includes(key)) return;
				
				let formattedKey = key.split(".").map(k => `[${k}]`).join("");
				formData.append(`${objName}${formattedKey}`, `${value}`);
			});
		};
		
		const arrayToFormData = (arrName, arr) => {
			arr.forEach(value => {
				formData.append(`${arrName}[]`, value);
			});
		};

		objToFormData("jobOffer", jobOffer, ["attachements", "domains"]);
		arrayToFormData("attachements", jobOffer.attachements);
		arrayToFormData("jobOffer[job_domains]", jobOffer.domains);
		
		// Send the new job offer
		jobOffers.add.mutate(formData, {
			onSuccess: () => navigate("/jobs/offers")
		});
	};

	/* ---- Page content ---------------------------- */
	return (
		<div className="JobOffers JobOffersAdd">
			<Link to="/jobs/offers">&lt;-- Retour</Link>
			
			{!jobDomains.isUsable() ? (jobDomains.isLoading && <Loader/>) : (
				<form onSubmit={handleSubmit} encType="multipart/form-data">
					<fieldset>
						<legend>Offre d&apos;emploi</legend>
						
						<label>
								Titre*
							<input type="text" name="title" value={jobOffer.title} onChange={handleChange} required/>
						</label>
						<br/>
						
						<label>
								Type*
							<select name="type" value={jobOffer.type} onChange={handleChange} required>
								<option value="stage">Stage</option>
								<option value="alternance">Alternance</option>
							</select>
						</label>
						<br/>
						
						<label>
								Entreprise*
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
							Domaines
							<select name="domains" value={jobOffer.domains} onChange={handleDomainsChange} multiple>
								{jobDomains.data.map(jobDomain => (
									<option key={`job-offer-domain-${jobDomain.job_domain_id}`} value={jobDomain.job_domain_id}>{jobDomain.name}</option>
								))}
							</select>
						</label>
						
						<label>
								Message
							<textarea name="content" value={jobOffer.content} onChange={handleChange}/>
						</label>
						<br/>
						
						<label>
								Fichiers joints
							<input type="file" name="attachements" onChange={handleFilesChange} multiple/>
						</label>
						<br/>
						
						<input type="submit" value="Ajouter"/>
					</fieldset>
				</form>
			)}

			{JSON.stringify(jobOffer)}
		</div>
	);
}

export default JobOfferAdd;
