import { SQLiteDatabaseClient } from "@abaplint/database-sqlite";

/**
 * Bootstraps the ABAP runtime database context.
 *
 * @param {object} abap    - The ABAP runtime instance.
 * @param {object} schemas - DDL schemas keyed by dialect (e.g. schemas.sqlite).
 * @param {string} insert  - Seed DML statements to populate initial data.
 */
export async function setup(abap, schemas, insert) {
  const db = new SQLiteDatabaseClient();
  abap.context.databaseConnections["DEFAULT"] = db;

  await run("connect", () => db.connect());
  await run("schema",  () => db.execute(schemas.sqlite));
  await run("insert",  () => db.execute(insert));
}

/**
 * Executes a labelled async step and re-throws any error with context so the
 * caller can immediately identify which step failed.
 *
 * @param {string}   label - Human-readable name of the step.
 * @param {Function} fn    - Async factory that performs the step.
 */
async function run(label, fn) {
  try {
    await fn();
  } catch (err) {
    throw new Error(`setup: ${label} failed — ${err.message}`);
  }
}
