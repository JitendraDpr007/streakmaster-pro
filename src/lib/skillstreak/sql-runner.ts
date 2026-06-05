import type { Database, SqlJsStatic } from "sql.js";

let sqlPromise: Promise<SqlJsStatic> | null = null;

export async function getSql(): Promise<SqlJsStatic> {
  if (!sqlPromise) {
    sqlPromise = (async () => {
      const initSqlJs = (await import("sql.js")).default;
      return initSqlJs({
        locateFile: (file: string) => `https://sql.js.org/dist/${file}`,
      });
    })();
  }
  return sqlPromise;
}

export interface SqlResult {
  columns: string[];
  rows: unknown[][];
  error?: string;
}

export async function runSql(
  schema: string,
  seed: string,
  query: string,
): Promise<SqlResult> {
  try {
    const SQL = await getSql();
    const db: Database = new SQL.Database();
    if (schema.trim()) db.exec(schema);
    if (seed.trim()) db.exec(seed);
    const res = db.exec(query);
    db.close();
    if (!res.length) return { columns: [], rows: [] };
    return {
      columns: res[0].columns,
      rows: res[0].values as unknown[][],
    };
  } catch (e) {
    return { columns: [], rows: [], error: (e as Error).message };
  }
}

export function compareResults(
  a: { columns: string[]; rows: unknown[][] },
  b: { columns: string[]; rows: unknown[][] },
): boolean {
  if (a.columns.length !== b.columns.length) return false;
  if (a.rows.length !== b.rows.length) return false;
  // normalize: stringify each row
  const norm = (r: unknown[][]) =>
    r.map((row) => row.map((v) => (v == null ? "" : String(v))).join("\u0001")).sort();
  const na = norm(a.rows);
  const nb = norm(b.rows);
  return na.every((v, i) => v === nb[i]);
}
