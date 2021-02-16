/**
 * This file generates the graphql.schema that will be passed into the codegen plugin
 *
 * DISCLAIMER!!!
 * The server must be built before running this program
 *
 */

import fs from 'fs-extra';
import path from 'path';
import { printSchema } from 'graphql/utilities';

import { schema } from '../dist/routes/graphql';

async function buildSchema() {
	await fs.outputFile(path.join(__dirname, '../generated/schema.graphql'), printSchema(schema));
}

async function run() {
	await buildSchema();
	console.log('  ✔ Schema build complete!');
	console.log('  ✔ Generated schema.graphql');
}

run().catch((e) => {
	console.log(e);
	process.exit(0);
});
