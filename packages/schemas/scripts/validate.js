#!/usr/bin/env node
const Ajv = require('ajv');
const addFormats = require('ajv-formats');
const path = require('path');
const fs = require('fs');

const ajv = new Ajv({ strict: true, allErrors: true });
addFormats(ajv);

const schemaFiles = [
  '../intake/intake-classification.schema.json',
  '../intake/action-plan.schema.json',
  '../approvals/approval.schema.json',
  '../audit/audit-event.schema.json',
  '../research/research-brief.schema.json',
];

let allValid = true;
for (const schemaPath of schemaFiles) {
  const resolved = path.resolve(__dirname, schemaPath);
  const schema = JSON.parse(fs.readFileSync(resolved, 'utf8'));
  try {
    ajv.addSchema(schema, schema['$id']);
    ajv.compile(schema);
    console.log(`✅  ${path.basename(resolved)} — valid`);
  } catch (err) {
    console.error(`❌  ${path.basename(resolved)} — INVALID: ${err.message}`);
    allValid = false;
  }
}

if (!allValid) {
  process.exit(1);
}
console.log('\nAll schemas valid.');
