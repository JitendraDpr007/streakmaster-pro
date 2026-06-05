import { lazy, Suspense, useState } from "react";
import type { Question } from "@/lib/skillstreak/data";
import { runSql, compareResults, type SqlResult } from "@/lib/skillstreak/sql-runner";
import { useUser } from "@/lib/skillstreak/store";

const Editor = lazy(() => import("@monaco-editor/react").then((m) => ({ default: m.default })));

export function SqlSolver({ question }: { question: Question }) {
  const { user, recordSolve } = useUser();
  const solved = user.solved.includes(question.id);
  const [code, setCode] = useState("-- Write your SQL here\nSELECT ");
  const [result, setResult] = useState<SqlResult | null>(null);
  const [running, setRunning] = useState(false);
  const [passed, setPassed] = useState(false);

  const run = async () => {
    setRunning(true);
    setPassed(false);
    const r = await runSql(question.sqlSchema ?? "", question.sqlSeed ?? "", code);
    setResult(r);
    if (!r.error && question.sqlExpected) {
      const ok = compareResults(r, question.sqlExpected);
      setPassed(ok);
      if (ok && !solved) recordSolve(question.id, question.xp, 0);
    }
    setRunning(false);
  };

  return (
    <div className="space-y-4">
      <Block title="PROBLEM">
        <p className="whitespace-pre-line text-[13px] leading-relaxed text-foreground/85">
          {question.problemStatement || question.question}
        </p>
      </Block>

      {question.sqlSchema && (
        <Block title="SCHEMA">
          <pre className="overflow-x-auto rounded-xl border border-white/10 bg-black/50 p-3 font-mono text-[11px] leading-relaxed text-cyan">
            {question.sqlSchema}
          </pre>
        </Block>
      )}

      {question.sqlExpected && (
        <Block title="EXPECTED OUTPUT">
          <ResultTable result={question.sqlExpected as SqlResult} />
        </Block>
      )}

      <Block title="YOUR QUERY">
        <div className="overflow-hidden rounded-xl border border-white/10">
          <Suspense
            fallback={
              <div className="h-[240px] bg-black/50 p-3 font-mono text-[12px] text-muted-foreground">
                Loading editor…
              </div>
            }
          >
            <Editor
              height="240px"
              defaultLanguage="sql"
              theme="vs-dark"
              value={code}
              onChange={(v) => setCode(v ?? "")}
              options={{
                fontSize: 13,
                minimap: { enabled: false },
                lineNumbers: "on",
                scrollBeyondLastLine: false,
                automaticLayout: true,
              }}
            />
          </Suspense>
        </div>
      </Block>

      <button
        onClick={run}
        disabled={running}
        className="w-full rounded-xl bg-lime py-3 text-sm font-bold text-primary-foreground active:scale-[0.97] disabled:opacity-50"
      >
        {running ? "Running…" : "▶ Run query"}
      </button>

      {result && (
        <Block title="RESULT">
          {result.error ? (
            <pre className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 font-mono text-[11px] text-red-300">
              {result.error}
            </pre>
          ) : (
            <>
              <ResultTable result={result} />
              {question.sqlExpected && (
                <div
                  className={`mt-2 rounded-xl border p-3 text-[12px] font-bold ${
                    passed
                      ? "border-easy/40 bg-easy/10 text-easy"
                      : "border-hard/40 bg-hard/10 text-hard"
                  }`}
                >
                  {passed
                    ? `✓ Passed — matches expected. +${question.xp} XP`
                    : "✗ Output doesn't match expected. Check column order & values."}
                </div>
              )}
            </>
          )}
        </Block>
      )}
    </div>
  );
}

function ResultTable({ result }: { result: SqlResult }) {
  if (!result.columns.length) {
    return <p className="text-[12px] text-muted-foreground">No rows.</p>;
  }
  return (
    <div className="overflow-x-auto rounded-xl border border-white/10">
      <table className="w-full font-mono text-[11px]">
        <thead className="bg-white/5">
          <tr>
            {result.columns.map((c) => (
              <th key={c} className="px-3 py-2 text-left font-bold text-lime">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {result.rows.map((row, i) => (
            <tr key={i} className="border-t border-white/5">
              {row.map((cell, j) => (
                <td key={j} className="px-3 py-1.5 text-foreground/80">
                  {cell == null ? <span className="text-muted-foreground">NULL</span> : String(cell)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-1.5 text-[10px] font-bold tracking-widest text-muted-foreground">{title}</p>
      {children}
    </div>
  );
}
