import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import urljoin from "url-join";
import useAuth from "../../../context/Auth/AuthContext.js";
import useJobOffers from "../../../hooks/jobOffers/useJobOffers.js";
import useJobDomains from "../../../hooks/jobDomains/useJobDomains.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { solid } from "@fortawesome/fontawesome-svg-core/import.macro";
import Loader from "../../../components/Loader/Loader.js";
import Button from "../../../components/Button/Button.js";
import { isoStrToDate, formatBytes } from "../../../global/Functions.js";
import { API } from "../../../config/config.js";
import "./JobOfferByID.css";

function JobOfferByID() {
	/* ---- States ---------------------------------- */
	const { jobOfferID } = useParams();
	const { permissions, hasPermission } = useAuth();
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
			{(!jobOffer.isUsable() || !jobDomains.isUsable()) ? ((jobOffer.isLoading || jobDomains.isLoading) && <Loader/>) : (
				<>
					{hasPermission(permissions.EDIT_INTERNSHIP_OFFERS) && (
						<>
							<Button onClick={() => setIsUpdating(!isUpdating)}>{isUpdating ? "Annuler" : "Modifier"}</Button>
							<Button onClick={handleDelete} color="red" icon={<FontAwesomeIcon icon={solid("trash")}/>}>Supprimer</Button>
						</>
					)}
					
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
							<h3 className="job-offer-title">{jobOffer.data.title}</h3>
							<p className="job-offer-type">{jobOffer.data.type}</p>
							<p className="job-offer-company">
								<FontAwesomeIcon className="job-info-icon" icon={solid("building")}/> {jobOffer.data.company_name}
							</p>
							<p className="job-offer-location">
								<FontAwesomeIcon className="job-info-icon" icon={solid("location-pin")}/> {jobOffer.data.city}, {jobOffer.data.postal_code}
							</p>
							{jobOffer.data.expiration_date && ((() => {
								const expDate = isoStrToDate(jobOffer.data.expiration_date);
								const expired = new Date() > expDate;
								
								return (
									<p className={`job-offer-exp-date${expired ? " expired" : ""}`}>
										<FontAwesomeIcon className="job-info-icon" icon={solid("clock")}/> {expDate.toLocaleDateString()}{expired ? " [EXPIRÉE]" : ""}
									</p>
								);
							})())}
							
							<div className="job-offer-domains">
								{jobOffer.data.jobDomains.map((domain, index) => (
									<span key={`job-offer-${jobOffer.data.job_offer_id}-domain-${domain.job_domain_id}`}>
										{domain.name}
										{(index < (jobOffer.data.jobDomains.length - 1)) ? ", " : ""}
									</span>
								))}
							</div>
							
							{(jobOffer.data.attachements && (jobOffer.data.attachements.length > 0)) && (
								<div className="job-offer-files">
									<div className="files-label">
										<span>Fichiers</span>
									</div>
									
									<div className="files-wrapper">
										{jobOffer.data.attachements.map((attachement, index) => (
											<a
												key={`job-offer-${jobOffer.data.job_offer_id}-attachement-${attachement.attachement_id}`}
												className="file"
												href={urljoin(API.files, attachement.path)}
												target="_blank"
												rel="noreferrer"
											>
												{attachement.name} ({formatBytes(attachement.size)}){index < (jobOffer.data.attachements.length - 1) ? ", " : ""}
											</a>
										))}
									</div>
								</div>
							)}
							
							<ReactMarkdown className="job-offer-content" remarkPlugins={[remarkGfm]}>
								{jobOffer.data.content}
							</ReactMarkdown>
						</>
					)}
				</>
			)}
		</div>
	);
}

export default JobOfferByID;
