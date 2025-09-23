import api from "./apiClient";

function buildQuery(params = {}) {
  const qp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v == null || v === "") return;
    qp.set(k, String(v));
  });
  const qs = qp.toString();
  return qs ? `?${qs}` : "";
}

export async function getItems(params = {}) {
  const qs = buildQuery(params);
  const res = await api.apiGet(`/api/v1/items${qs}`);
  return { items: res.data || [], meta: res.meta || {} };
}

export async function getItem(id) {
  const res = await api.apiGet(`/api/v1/items/${id}`);
  return res.data;
}

export async function getSelfItems(params = {}) {
  const qs = buildQuery(params);
  const res = await api.apiGet(`/api/v1/items/self${qs}`);
  return { items: res.data || [], meta: res.meta || {} };
}

export async function createItem(payload) {
  const res = await api.apiPost(`/api/v1/items`, payload);
  return res.data;
}

export async function updateItem(id, payload) {
  const res = await api.apiPatch(`/api/v1/items/${id}`, payload);
  return res.data;
}

export async function deleteItem(id) {
  return api.apiDelete(`/api/v1/items/${id}`);
}

export async function addItemPhotos(id, photos) {
  const res = await api.apiPost(`/api/v1/items/${id}/photos`, { photos });
  return res.data || res;
}
export async function deleteItemPhoto(itemId, photoId) {
  return api.apiDelete(`/api/v1/items/${itemId}/photos/${photoId}`);
}

export default {
  getItems,
  getSelfItems,
  getItem,
  createItem,
  updateItem,
  deleteItem,
  addItemPhotos,
  deleteItemPhoto,
};
