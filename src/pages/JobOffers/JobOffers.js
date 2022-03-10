import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import useMessage from "../../context/Message/MessageContext.js";
import { API } from "../../config/config.js";

function JobOffers() {
	/* ---- States ---------------------------------- */
	const messages = useMessage();
	const [jobOffers, setJobOffers] = useState(null);

	/* ---- Effects --------------------------------- */
	useEffect(() => {
		const isFetching = false;

		if (!isFetching) {
			API.jobOffers.getAll.fetch()
				.then(response => setJobOffers(response.jobOffers))
				.catch(err => messages.add("error", err.error));
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	/* ---- Page content ---------------------------- */
	return (
		<div className="JobOffers">
			<Link to="/">&lt;-- Retour</Link>

			{jobOffers && (
				<>
					{jobOffers.map((offer) => {
						return (
							<div key={`job-offer-${offer.job_offer_id}`} className="job-offer">
								<Link to={`/jobs/offer/${offer.job_offer_id}`}>
									<h3>{offer.title}</h3>
									<p>{offer.type}</p>
									<p>{offer.company_name}</p>
									<p>{offer.city}, {offer.postal_code}</p>
								</Link>

								<div>
									{offer.jobDomains.map((domain) => (
										<span key={`job-offer-${offer.job_offer_id}-domain-${domain.job_domain_id}`}>{domain.name}</span>
									))}
								</div>
							</div>
						);
					})}
				</>
			)}
		</div>
	);
}

export default JobOffers;