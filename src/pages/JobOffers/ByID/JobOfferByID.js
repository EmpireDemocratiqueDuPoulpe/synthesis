import { useState, useEffect } from "react";
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
import Inputs from "../../../components/Inputs/Inputs";
import {FormProvider, useForm} from "react-hook-form";

function JobOfferByID() {
	/* ---- States ---------------------------------- */
	const { jobOfferID } = useParams();
	const { permissions, hasPermission } = useAuth();
	const [isUpdating, setIsUpdating] = useState(false);
	const form = useForm();
	const jobOffer = useJobOffers({ id: jobOfferID }, {});
	useEffect(() => {
		if (jobOffer.isUsable()) {
			form.reset({
				job_offer_id: jobOffer.data.job_offer_id,
				title: jobOffer.data.title,
				type: jobOffer.data.type,
				company_name: jobOffer.data.company_name,
				address_city: jobOffer.data.city,
				address_postal_code: jobOffer.data.postal_code,
				expiration_date: isoStrToDate(jobOffer.data.expiration_date).toLocaleDateString("fr-FR").split("/").reverse().join("-"),
				domains: jobOffer.data.jobDomains.map(jd => jd.job_domain_id),
				content: jobOffer.data.content,
			});
		}
	}, [form, jobOffer.data]);

	const jobDomains = useJobDomains({}, { enabled: isUpdating });
	const navigate = useNavigate();

	/* ---- Functions ------------------------------- */
	
	const handleUpdate = data => {
		jobOffer.update.mutate(data, {
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
						<FormProvider {...form}>
							<form onSubmit={form.handleSubmit(handleUpdate)}>
								<Inputs.Text name="title" required>
									Titre
								</Inputs.Text>

								<Inputs.Select name="type" options={[ {value: "stage", label: "Stage"}, {value: "alternance", label: "Alternance"} ]} required>
									Type
								</Inputs.Select>

								<Inputs.Text name="company_name" required>
									Entreprise
								</Inputs.Text>

								<Inputs.Address name="address">
									Adresse
								</Inputs.Address>

								<Inputs.Date name="expiration_date">
									Date d&apos;expiration
								</Inputs.Date>

								<Inputs.Select name="domains" options={jobDomains.data.map(jd => ({ value: jd.job_domain_id, label: jd.name }))} multiple>
									Domaines
								</Inputs.Select>

								<Inputs.Textarea name="content" resize={false}>
									Message
								</Inputs.Textarea>

								<input type="submit" className="button" value="Mettre à jour"/>
							</form>
						</FormProvider>
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
