import { useState } from "react";
import { Link } from "react-router-dom";
import useJobOffers from "../../../hooks/jobOffers/useJobOffers.js";
import { isoStrToDate } from "../../../global/Functions.js";
import Loader from "../../../components/Loader/Loader.js";

function JobOffersAll() {
	/* ---- States ---------------------------------- */
	const [expired, setExpired] = useState(false);
	const jobOffers = useJobOffers({ expired });

	/* ---- Page content ---------------------------- */
	return (
		<div className="JobOffers JobOffersAll">
			<Link to="/jobs/offers/add">+ Ajouter</Link>

			<label>
				<input type="checkbox" value={expired} onChange={(e) => setExpired(e.target.checked)}/>
				Afficher les offres ayant expir&eacute;es
			</label>

			{!jobOffers.isUsable() ? (jobOffers.isLoading && <Loader/>) : (jobOffers.data.map((offer) => (
				<div key={`job-offer-${offer.job_offer_id}`} className="job-offer">
					<Link to={`/jobs/offer/${offer.job_offer_id}`} style={
						offer.expiration_date ? (new Date() > isoStrToDate(offer.expiration_date) ? { textDecoration: "line-through" } : null) : null
					}>
						<h3>{offer.title}</h3>
						<p>{offer.type}</p>
						<p>{offer.company_name}</p>
						<p>{offer.city}, {offer.postal_code}</p>
						<p>{offer.expiration_date}</p>
					</Link>

					<div>
						{offer.jobDomains.map((domain) => (
							<span key={`job-offer-${offer.job_offer_id}-domain-${domain.job_domain_id}`}>{domain.name}</span>
						))}
					</div>
				</div>
			)))}
		</div>
	);
}

export default JobOffersAll;
