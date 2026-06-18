import "./lib/error-capture";
import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";
import server from "./server";

async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!body.includes('"unhandled":true') || !body.includes('"message":"HTTPError"')) {
    return response;
  }

  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

function createRequest(req: any): Request {
  const protocol = req.headers["x-forwarded-proto"] || "http";
  const host = req.headers.host || "localhost";
  const url = new URL(req.url, `${protocol}://${host}`);

  const headers = new Headers();
  for (const [key, value] of Object.entries(req.headers || {})) {
    if (Array.isArray(value)) {
      for (const item of value) {
        if (item != null) headers.append(key, String(item));
      }
    } else if (value != null) {
      headers.set(key, String(value));
    }
  }

  const init: RequestInit = {
    method: req.method,
    headers,
    body: ["GET", "HEAD"].includes(req.method) ? undefined : req,
  };

  return new Request(url.href, init);
}

export default async function handler(req: any, res: any) {
  try {
    const request = createRequest(req);
    const response = await server.fetch(request, process.env, undefined);
    const normalized = await normalizeCatastrophicSsrResponse(response);

    res.statusCode = normalized.status;
    for (const [name, value] of normalized.headers) {
      res.setHeader(name, value);
    }

    const body = await normalized.arrayBuffer();
    res.end(Buffer.from(body));
  } catch (error) {
    console.error(error);
    const response = new Response(renderErrorPage(), {
      status: 500,
      headers: { "content-type": "text/html; charset=utf-8" },
    });
    res.statusCode = response.status;
    res.setHeader("content-type", "text/html; charset=utf-8");
    res.end(await response.text());
  }
}
