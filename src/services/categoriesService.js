import api from "./apiClient";

export async function getCategories(params = {}) {
  const qp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v == null || v === "") return;
    qp.set(k, String(v));
  });
  const qs = qp.toString() ? `?${qp.toString()}` : "";
  const res = await api.apiGet(`/api/v1/categories${qs}`);
  const raw = res.data || [];
  return raw.map((c) =>
    typeof c === "string"
      ? { id: c, name: c }
      : { id: c.id ?? c.name, name: c.name ?? String(c.id) }
  );
}

export default { getCategories };
