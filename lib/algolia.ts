import algoliasearch from "algoliasearch";

const client = algoliasearch(
	process.env.ALGOLIA_CREDS_ID,
	process.env.ALGOLIA_CREDS_APIKEY
);
export const index = client.initIndex("pets");
