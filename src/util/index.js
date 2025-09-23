export async function getAllData(baseUrl) {
  const url = `${baseUrl?.replace(/\/$/, "") || ""}/healthz`;
  const res = await fetch(url, { headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error(`Health check failed: ${res.status}`);
  const body = await res.json();
  const msg = body?.message || body?.data?.status || "ok";
  return { data: msg };
}
