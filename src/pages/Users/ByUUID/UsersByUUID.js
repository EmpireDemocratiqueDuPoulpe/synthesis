import { useState, useCallback, useEffect } from "react";
import { useParams } from "react-router-dom";
import useClassName from "../../../hooks/className/useClassName.js";
import useUsers from "../../../hooks/users/useUsers.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { regular, solid } from "@fortawesome/fontawesome-svg-core/import.macro";
import Loader from "../../../components/Loader/Loader.js";
import Button from "../../../components/Button/Button.js";
import { DeckGL } from "@deck.gl/react";
import { MapView, COORDINATE_SYSTEM } from "@deck.gl/core";
import { TileLayer } from "@deck.gl/geo-layers";
import { BitmapLayer, IconLayer } from "@deck.gl/layers";
import { Scrollbars } from "react-custom-scrollbars-2";
import { calcECTS, sortDate, isoStrToDate, toNumeralAdjective, capitalize } from "../../../global/Functions.js";
import teamsIcon from "../../../assets/images/teams_icon/Teams-16x16.png";
import mapPin from "../../../assets/images/map_pin/map_pin_atlas.png";
import pinMapping from "../../../assets/images/map_pin/map_pin_mapping.json";
import "./UsersByUUID.css";

/*****************************************************
 * Constants
 *****************************************************/

const INITIAL_VIEW = {
	latitude: 47.65,
	longitude: 7,
	zoom: 15,
	maxZoom: 20,
	maxPitch: 89,
	bearing: 0
};

const devicePixelRatio = (typeof window !== "undefined" && window.devicePixelRatio) || 1;

/*****************************************************
 * UsersByUUID
 *****************************************************/

function UsersByUUID() {
	/* ---- States ---------------------------------- */
	const { UUID } = useParams();
	const user = useUsers({
		UUID, expand: [ "campus~", "study~", "module~", "ects~", "job~", "compta~" ]
	});
	const profileClasses = useClassName(hook => {
		hook.set("profile");

		if (user.isUsable()) {
			hook.setIf(!!user.data.campus, "has-campus");
			hook.setIf(!!user.data.study, "has-study");
			hook.setIf(!!user.data.modules, "has-modules");
			hook.setIf(!!user.data.jobs, "has-jobs");
			hook.setIf(!!user.data.compta, "has-compta");
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [user.isUsable(), user.data]);

	const [initialView, setInitialView] = useState(INITIAL_VIEW);
	const tileLayer = new TileLayer({
		// https://wiki.openstreetmap.org/wiki/Slippy_map_tilenames#Tile_servers
		// https://wiki.openstreetmap.org/wiki/Tiles
		data: [
			"https://a.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png",
			"https://b.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png",
			"https://c.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png"
		],

		// Since these OSM tiles support HTTP/2, we can make many concurrent requests
		// and we aren't limited by the browser to a certain number per domain.
		maxRequests: 20,

		pickable: true,
		autoHighlight: false,

		// https://wiki.openstreetmap.org/wiki/Zoom_levels
		minZoom: 0,

		maxZoom: 19,
		tileSize: 160,
		zoomOffset: devicePixelRatio === 1 ? -1 : 0,

		renderSubLayers: properties => {
			const { bbox: {north, east, south, west} } = properties.tile;

			return [
				new BitmapLayer(properties, { data: null, image: properties.data, bounds: [west, south, east, north] }),
				new IconLayer({
					id: `${properties.id}-icons`,
					coordinateSystem: COORDINATE_SYSTEM.LNGLAT,
					data: (user.isUsable() && user.data.campus && user.data.campus.geo_position)
						? [{name: user.data.campus.name, address: `${user.data.campus.address_street}, ${user.data.campus.address_postal_code}, ${user.data.campus.address_city}`, coordinates: [user.data.campus.geo_position.coordinates[1], user.data.campus.geo_position.coordinates[0]]}]
						: [],
					pickable: false,
					iconAtlas: mapPin,
					iconMapping: pinMapping,
					getIcon: () => "marker",
					getPosition: i => i.coordinates,
					getSize: () => 3,
					getColor: () => [241, 49, 43],
					sizeScale: 10,
				})
			];
		},
	});
	
	/* ---- Functions ------------------------------- */
	const updateView = useCallback(() => {
		if (user.isUsable() && user.data.campus && user.data.campus.geo_position) {
			const lat = user.data.campus.geo_position.coordinates[0];
			const lon = user.data.campus.geo_position.coordinates[1];

			if ((lat !== initialView.latitude) || (lon !== initialView.longitude)) {
				setInitialView(prevState => ({ ...prevState, latitude: lat, longitude: lon }));
			}
		}
	}, [initialView, user]);
	
	/* ---- Effects --------------------------------- */
	// eslint-disable-next-line react-hooks/exhaustive-deps
	useEffect(() => updateView(), [user.data?.campus?.campus_id]);

	/* ---- Page content ---------------------------- */
	return (
		<div className="Users UsersByUUID">
			{!user.isUsable() ? (user.isLoading && <Loader/>) : (
				<div className={profileClasses}>
					<div className="profile-box buttons-box no-decoration">
						<Button
							link={{ to: `mailto:${user.data.email}`, external: true }}
							icon={<FontAwesomeIcon icon={regular("envelope")} size="1x"/>}
							outlined
						>
							Envoyer un mail
						</Button>

						<Button
							link={{ to: `https://teams.microsoft.com/l/chat/0/0?users=${user.data.email}`, external: true }}
							icon={<img src={teamsIcon} alt="Microsoft Teams"/>}
							outlined
						>
							Envoyer un message
						</Button>
					</div>

					<div className="profile-box base-infos-box">
						<h2>{user.data.first_name} {user.data.last_name} <span className="user-position normal-font">{user.data.position.name}</span></h2>
						<a className="secondary-link" href={`mailto:${user.data.email}`}>{user.data.email}</a>

						<div>
							<h3>Informations</h3>
							{user.data.birth_date && <p><span className="info-label">Date de naissance :</span> {isoStrToDate(user.data.birth_date).toLocaleDateString()}</p>}
							{user.data.address_street && <p><span className="info-label">Adresse :</span> {user.data.address_street}{user.data.address_city && `, ${user.data.address_city}`}{user.data.address_postal_code && ` (${user.data.address_postal_code})`}</p>}
							{user.data.gender && <p><span className="info-label">Sexe :</span> {capitalize(user.data.gender)}</p>}
							{user.data.region && <p><span className="info-label">R&eacute;gion :</span> {user.data.region}</p>}
						</div>
					</div>

					{user.data.campus && (
						<div className="profile-box campus-box">
							<div className="campus-infos">
								{(() => {
									const isVirtual = user.data.campus.name === "Distanciel";
									return <h3>Campus {!isVirtual && "de "}{isVirtual ? user.data.campus.name.toLowerCase() : user.data.campus.name}</h3>;
								})()}
								<p>{user.data.campus.address_street}{user.data.campus.address_city && `, ${user.data.campus.address_city}`}{user.data.campus.address_postal_code && ` (${user.data.campus.address_postal_code})`}</p>
							</div>

							<div className={`map-box${user.data.campus.geo_position ? "" : " no-map"}`}>
								{user.data.campus.geo_position && (
									<DeckGL layers={[tileLayer]} views={new MapView({ repeat: true })} initialViewState={initialView} controller={true}>
										<div className="copyright">
											&copy; <a href="http://www.openstreetmap.org/copyright" rel="noreferrer" target="blank">OpenStreetMap contributors</a>
										</div>
									</DeckGL>
								)}
							</div>
						</div>
					)}

					{(user.data.study || user.data.modules) && (
						<div className="profile-box study-box">
							{user.data.study && (
								<div className="study-infos">
									<h3>Études</h3>
									<p>
										Arriv&eacute; en {user.data.study.entry_level}<sup>{toNumeralAdjective(user.data.study.entry_level, true)}</sup> année
										{user.data.study.entry_date && ` le ${isoStrToDate(user.data.study.entry_date).toLocaleDateString()}`}.
									</p>
									
									{(user.data.study.exit_level || user.data.study.exit_date) ? (
										<p>
											Parti
											{user.data.study.exit_level && (<> en {user.data.study.exit_level}<sup>{toNumeralAdjective(user.data.study.exit_level, true)}</sup> année</>)}
											{user.data.study.exit_date && (<> le {isoStrToDate(user.data.study.exit_date).toLocaleDateString()}</>)}
											.
										</p>
									) : (
										<p>Actuellement en {user.data.study.current_level}<sup>{toNumeralAdjective(user.data.study.current_level, true)}</sup> année.</p>
									)}
								</div>
							)}

							{user.data.modules && (
								<div className="module-box">
									<h3>Modules</h3>
									
									<ul className="module-list">
										<Scrollbars className="module-list-scrollbars" style={{ height: (40 * 5) /* 5 * (Height of a module) */ }}>
											{user.data.modules.map(module => (
												<li key={`user-profile-module-${module.module_id}`} className="user-module">
													{module.year}{module.name}{(module.notes && module.notes.length > 0) && (() => {
														const result = calcECTS(module);
														
														return (
															<span className={`user-module-status ${result.hasPassed ? "passed" : "not-passed"}`}>
																{result.hasPassed
																	? <FontAwesomeIcon icon={solid("circle-check")} size="1x"/>
																	: <FontAwesomeIcon icon={regular("circle-xmark")} size="1x"/>
																}
															</span>
														);
													})()}
												</li>
											))}
										</Scrollbars>
									</ul>
								</div>
							)}
						</div>
					)}

					{user.data.jobs && (
						<div className="profile-box jobs-box">
							<h3>Stages et alternances</h3>

							<ul>
								{user.data.jobs.sort(sortDate).map(job => (
									<li key={`user-profile-job-${job.job_id}`}>
										<span>{job.type}: {job.company_name}</span> <br/>
										<span>Du {isoStrToDate(job.start_date).toLocaleDateString()}{job.end_date && (` au ${isoStrToDate(job.end_date).toLocaleDateString()}`)}</span>
									</li>
								))}
							</ul>
						</div>
					)}

					{user.data.compta && (
						<div className="profile-box compta-box">
							<h3>Comptabilit&eacute;</h3>
							<p>Type de paiement: {user.data.compta.payment_type}</p>
							<p>Somme d&ucirc;e : {user.data.compta.payment_due} &euro;</p>
							<p>Somme pay&eacute;e : {user.data.compta.paid} &euro;</p>
							{(() => {
								const remaining = user.data.compta.payment_due - user.data.compta.paid;
								const remainingColor = remaining > 0 ? "remaining_red" : "remaining_green";

								return <p className={remainingColor}>Balance : {(remaining > 0) && "+"}{remaining} &euro;</p>;
							})()}
						</div>
					)}
				</div>
			)}
		</div>
	);
}

export default UsersByUUID;
