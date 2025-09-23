import api from "./apiClient";

export async function markSeen(itemId) {
  const res = await api.apiPost(`/api/v1/items/${itemId}/seen`);
  return res;
}

export async function listSeen(itemId, { limit = 50, offset = 0 } = {}) {
  const qs = `?limit=${limit}&offset=${offset}`;
  const res = await api.apiGet(`/api/v1/items/${itemId}/seen${qs}`);
  return { seen: res.data || [], meta: res.meta || {} };
}

export async function unmarkSeen(itemId, seenId) {
  return api.apiDelete(`/api/v1/items/${itemId}/seen/${seenId}`);
}

export default { markSeen, listSeen, unmarkSeen };
