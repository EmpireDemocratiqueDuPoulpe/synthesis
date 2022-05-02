import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import urljoin from "url-join";
import useJobOffers from "../../../hooks/jobOffers/useJobOffers.js";
import useJobDomains from "../../../hooks/jobDomains/useJobDomains.js";
import Loader from "../../../components/Loader/Loader.js";
import { API } from "../../../config/config.js";

function JobOfferByID() {
	/* ---- States ---------------------------------- */
	const { jobOfferID } = useParams();
	const [isUpdating, setIsUpdating] = useState(false);
	const [updatedOffer, setUpdatedOffer] = useState({});
	const jobOffer = useJobOffers({ id: jobOfferID }, {
		onSuccess: data => {
			// eslint-disable-next-line no-unused-vars
			const { attachements, ...offer } = data;
			offer.domains = offer.jobDomains.map(jD => jD.job_domain_id);
			delete offer.jobDomains;
			
			setUpdatedOffer(offer);
		}
	});
	const jobDomains = useJobDomains({}, { enabled: isUpdating });
	const navigate = useNavigate();

	/* ---- Functions ------------------------------- */
	const handleChange = event => {
		const value = event.target.type === "checkbox" ? event.target.checked : event.target.value;
		setUpdatedOffer(prevState => ({ ...prevState, [event.target.name]: value }));
	};
	
	const handleDomainsChange = event => {
		setUpdatedOffer(prevState => ({
			...prevState,
			[event.target.name]: Array.from(event.target.selectedOptions, (opt => opt.value))
		}));
	};
	
	const handleUpdate = event => {
		event.preventDefault();
		
		jobOffer.update.mutate(updatedOffer, {
			onSuccess: () => setIsUpdating(false)
		});
	};
	
	const handleDelete = () => {
		jobOffer.delete.mutate(jobOfferID, {
			onSuccess: () => navigate("/jobs/offers")
		});
	};

	/* ---- Page content ---------------------------- */
	return (
		<div className="JobOffers JobOfferByID">
			<Link to="/jobs/offers">&lt;-- Retour</Link>

			{(!jobOffer.isUsable() || !jobDomains.isUsable()) ? ((jobOffer.isLoading || jobDomains.isLoading) && <Loader/>) : (
				<>
					<button onClick={() => setIsUpdating(!isUpdating)}>{isUpdating ? "Annuler" : "Modifier"}</button>
					<button onClick={handleDelete}>Supprimer</button>
					
					{isUpdating ? (
						<form onSubmit={handleUpdate}>
							<label>
								Titre*
								<input type="text" name="title" value={updatedOffer.title ?? ""} onChange={handleChange} required/>
							</label>
							
							<label>
								Type*
								<select name="type" value={updatedOffer.type ?? ""} onChange={handleChange} required>
									<option value="stage">Stage</option>
									<option value="alternance">Alternance</option>
								</select>
							</label>
							
							<label>
								Entreprise*
								<input type="text" name="company_name" value={updatedOffer.company_name ?? ""} onChange={handleChange} required/>
							</label>
							
							<label>
								Adresse
								<input type="text" name="city" placeholder="Ville" value={updatedOffer.city ?? ""} onChange={handleChange}/>
								<input type="text" name="postal_code" placeholder="Code postal" value={updatedOffer.postal_code ?? ""} onChange={handleChange}/>
							</label>
							
							<label>
								Date d&apos;expiration
								<input type="date" name="expiration_date" value={updatedOffer.expiration_date ?? ""} onChange={handleChange}/>
							</label>
							
							<label>
								Domaines
								<select name="domains" value={updatedOffer.domains ?? []} onChange={handleDomainsChange} multiple>
									{jobDomains.data.map(jobDomain => (
										<option key={`job-offer-domain-${jobDomain.job_domain_id}`} value={jobDomain.job_domain_id}>{jobDomain.name}</option>
									))}
								</select>
							</label>
							
							<label>
								Message
								<textarea name="content" value={updatedOffer.content ?? ""} onChange={handleChange}/>
							</label>
							
							<input type="submit" value="Mettre à jour"/>
						</form>
					) : (
						<>
							<h3>{jobOffer.data.title}</h3>
							<p>{jobOffer.data.type}</p>
							<p>{jobOffer.data.company_name}</p>
							<p>{jobOffer.data.city}, {jobOffer.data.postal_code}</p>
							<p>{jobOffer.data.expiration_date}</p>
							
							<div>
								{jobOffer.data.jobDomains.map((domain) => (
									<span key={`job-offer-${jobOffer.data.job_offer_id}-domain-${domain.job_domain_id}`}>{domain.name}</span>
								))}
							</div>
							
							{jobOffer.data.attachements && (
								<div>
									<span>Fichiers :</span>
									{jobOffer.data.attachements.map((attachement) => (
										<a
											key={`job-offer-${jobOffer.data.job_offer_id}-attachement-${attachement.attachement_id}`}
											href={urljoin(API.files, attachement.path)}
											target="_blank"
											rel="noreferrer"
										>
											{attachement.name} ({attachement.size})
										</a>
									))}
								</div>
							)}
							
							<div>{jobOffer.data.content}</div>
						</>
					)}
				</>
			)}
		</div>
	);
}

export default JobOfferByID;
