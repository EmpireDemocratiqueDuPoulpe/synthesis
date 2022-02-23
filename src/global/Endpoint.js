import { isFunction } from "lodash-es";
import urljoin from "url-join";
import { API } from "../config/config.js";

/*****************************************************
 * API Endpoint
 *****************************************************/

class Endpoint {
	#url = null;
	#headers = { "Accept": "application/json" };
	#authHeaders = { "Brokilone": "Miam le bon bois" };
	#throwOnCode = true;

	constructor(url) {
		this.url(url);
	}

	/* ---- Setters --------------------------------- */
	url(url) {
		this.#url = url;
		return this;
	}

	headers(headers, override = false) {
		if (!headers) return this;

		if (override) {
			this.#headers = headers;
		} else {
			this.#headers = { ...this.#headers, ...headers };
		}

		return this;
	}

	mustThrow(enable = true) {
		this.#throwOnCode = !!enable;
		return this;
	}

	/* ---- Getters --------------------------------- */
	getURL()      { return urljoin(API.url, this.#url); }
	getHeaders()  { return { ...this.#headers, ...this.#authHeaders }; }
	isThrowing()  { return this.#throwOnCode; }

	/* ---- Functions ------------------------------- */
	async fetch(uri, options) {
		const opts = {
			method: options.method,
			headers: { ...this.getHeaders(), ...options.headers },
			mode: "cors",
			credentials: "include",
		};

		if (options.body) {
			opts.body = JSON.stringify(options.body);
		}

		return new Promise((resolve, reject) => {
			fetch(uri, opts)
				.then(response => response.text().then(text => ({ status: (response.ok ? true : !this.isThrowing()), data: text })))
				.then(response => ({ ...response, data: (response.data ? JSON.parse(response.data) : {}) }))
				.then(response => response.status ? resolve(response.data) : reject(response.data))
				.catch(reject);
		});
	}
}

/*****************************************************
 * Payloads
 *****************************************************/

class BodyPayload extends Endpoint {
	#verbHeaders = {};
	#bodyBuilder = null;
	#stringify = true;

	/* ---- Setters --------------------------------- */
	verbHeaders(headers) {
		this.#verbHeaders = headers;
		return this;
	}

	body(builder) {
		if (isFunction(builder)) {
			this.#bodyBuilder = builder;
		}

		return this;
	}

	stringify(enable = true) {
		this.#stringify = !!enable;
		return this;
	}

	/* ---- Getters --------------------------------- */
	// TODO: Check args.reduce
	getBody(...args) {
		return this.willStringify()
			? this.#bodyBuilder
				? this.#bodyBuilder.call(this, ...args)
				: args.reduce((acc, value) => ({ ...acc, ...value }), {})
			: args;
	}

	willStringify() { return this.#stringify; }

	/* ---- Functions ------------------------------- */
	async fetch(method, ...args) {
		const options = {
			method: method,
			headers: this.#verbHeaders,
			body: this.getBody(...args)
		};

		return super.fetch(this.getURL(), options);
	}
}

class URIPayload extends Endpoint {
	#paramsBuilder = null;

	/* ---- Setters --------------------------------- */
	params(builder) {
		if (isFunction(builder)) {
			this.#paramsBuilder = builder;
		}

		return this;
	}

	/* ---- Getters --------------------------------- */
	// TODO: Check args.reduce
	getParams(...args) {
		return this.#paramsBuilder
			? this.#paramsBuilder.call(this, ...args)
			: args.reduce((acc, value) => ({ ...acc, ...value }), {});
	}

	#toQueryStr(...args) {
		const params = this.getParams(...args);
		const queryStr = [];

		Object.entries(params).forEach(([prop, value]) => {
			if (value === undefined || value === null) return;
			queryStr.push(`${prop}=${value}`);
		});

		return queryStr.length > 0 ? `?${queryStr.join("&")}` : "";
	}

	/* ---- Functions ------------------------------- */
	async fetch(method, ...args) {
		const uri = urljoin(this.getURL(), this.#toQueryStr(...args));
		const options = {
			method: method,
			headers: {}
		};

		return super.fetch(uri, options);
	}
}

/*****************************************************
 * Verbs
 *****************************************************/

class POST extends BodyPayload {
	constructor(url) {
		super(url);
		this.verbHeaders({ "Content-Type": "application/json" });
	}

	async fetch(...args) {
		return super.fetch("POST", ...args);
	}
}

class GET extends URIPayload {
	async fetch(...args) {
		return super.fetch("GET", ...args);
	}
}

class PUT extends BodyPayload {
	constructor(url) {
		super(url);
		this.verbHeaders({ "Content-Type": "application/json" });
	}

	async fetch(...args) {
		return super.fetch("PUT", ...args);
	}
}

class DELETE extends BodyPayload {
	constructor(url) {
		super(url);
		this.verbHeaders({ "Content-Type": "application/json" });
	}

	async fetch(...args) {
		return super.fetch("DELETE", ...args);
	}
}

/*****************************************************
 * Export
 *****************************************************/

export default { POST, GET, PUT, DELETE };
