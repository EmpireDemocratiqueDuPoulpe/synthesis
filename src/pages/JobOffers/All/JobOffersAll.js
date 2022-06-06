import { useState } from "react";
import { Link } from "react-router-dom";
import useJobOffers from "../../../hooks/jobOffers/useJobOffers.js";
import { isoStrToDate } from "../../../global/Functions.js";
import Loader from "../../../components/Loader/Loader.js";
import "./JobOffersAll.css";

function JobOffersAll() {
	/* ---- States ---------------------------------- */
	const [expired, setExpired] = useState(false);
	const jobOffers = useJobOffers({ expired });

	/* ---- Page content ---------------------------- */
	return (
		<div className="JobOffers JobOffersAll">
			<Link to="/jobs/offers/add">+ Ajouter</Link>

			<label>
				<input type="checkbox" value={expired} onChange={(e) => setExpired(e.target.checked)} checked={expired}/>
				Afficher les offres ayant expir&eacute;es
			</label>

			{!jobOffers.isUsable() ? (jobOffers.isLoading && <Loader/>) : (
				<div className="job-offers">
					{jobOffers.data.map((offer) => {
						const expDate = offer.expiration_date ? isoStrToDate(offer.expiration_date) : null;
						const expired = expDate ? (new Date() > expDate) : false;
						
						return (
							<div key={`job-offer-${offer.job_offer_id}`} className={`job-offer${expired ? " expired" : ""}`}>
								<Link to={`/jobs/offer/${offer.job_offer_id}`}>
									<h3 className="job-offer-title">
										{offer.title}
										{expDate && <span className="job-offer-exp-date">{expDate.toLocaleDateString()} {expired ? " [EXPIRÉE]" : ""}</span>}
									</h3>
									<p className="job-offer-company">{offer.company_name}, {offer.city}, {offer.postal_code}</p>
									<p className="job-offer-type">{offer.type}</p>
									
									<div className="job-offer-domains">
										{offer.jobDomains.map((domain, index) => (
											<span key={`job-offer-${offer.job_offer_id}-domain-${domain.job_domain_id}`}>
												{domain.name}
												{(index < (offer.jobDomains.length - 1)) ? ", " : ""}
											</span>
										))}
									</div>
								</Link>
							</div>
						);
					})}
				</div>
			)}
		</div>
	);
}

export default JobOffersAll;
