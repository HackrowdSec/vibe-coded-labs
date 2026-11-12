// ClinicSlot client. Talks to the data API straight from the browser.
const DATA_URL = "/rest/v1";
const ANON_KEY = "anon_sample_clinicslot_public_key_0001";
const api = (table, opts = {}) => fetch(`${DATA_URL}/${table}`, { ...opts, headers: { apikey: ANON_KEY, ...(opts.headers || {}) } }).then((r) => r.json());
