import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import urljoin from "url-join";
import useMessage from "../../context/Message/MessageContext.js";
import { API } from "../../config/config.js";

function JobOffer() {
	/* ---- States ---------------------------------- */
	const { jobOfferID } = useParams();
	const messages = useMessage();
	const [jobOffer, setJobOffer] = useState(null);

	/* ---- Effects --------------------------------- */
	useEffect(() => {
		const isFetching = false;

		if (!isFetching) {
			API.jobOffers.getByID.fetch({ jobOfferID })
				.then(response => setJobOffer(response.jobOffer))
				.catch(err => messages.add("error", err.error));
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	/* ---- Page content ---------------------------- */
	return (
		<div className="JobOffer">
			<Link to="/jobs/offers">&lt;-- Retour</Link>

			{jobOffer && (
				<>
					<h3>{jobOffer.title}</h3>
					<p>{jobOffer.type}</p>
					<p>{jobOffer.company_name}</p>
					<p>{jobOffer.city}, {jobOffer.postal_code}</p>
					<div>
						{jobOffer.jobDomains.map((domain) => (
							<span key={`job-offer-${jobOffer.job_offer_id}-domain-${domain.job_domain_id}`}>{domain.name}</span>
						))}
					</div>

					{jobOffer.attachements && (
						<div>
							<span>Fichiers :</span>
							{jobOffer.attachements.map((attachement) => (
								<a
									key={`job-offer-${jobOffer.job_offer_id}-attachement-${attachement.attachement_id}`}
									href={urljoin(API.files, attachement.path)}
									target="_blank"
									rel="noreferrer"
								>
									{attachement.name} ({attachement.size})
								</a>
							))}
						</div>
					)}


					<div>{jobOffer.content}</div>
				</>
			)}
		</div>
	);
}

export default JobOffer;