import api from "./apiClient";

export async function createThread(payload) {
  const res = await api.apiPost("/api/v1/threads", payload);
  return res.data;
}

export async function listThreads(params = {}) {
  const qp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v == null || v === "") return;
    qp.set(k, String(v));
  });
  const qs = qp.toString() ? `?${qp.toString()}` : "";
  const res = await api.apiGet(`/api/v1/threads${qs}`);
  return { threads: res.data || [], meta: res.meta || {} };
}

export async function postMessage(threadId, body) {
  const res = await api.apiPost(`/api/v1/threads/${threadId}/messages`, body);
  return res.data;
}

export async function getMessages(threadId, params = {}) {
  const qp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v == null || v === "") return;
    qp.set(k, String(v));
  });
  const qs = qp.toString() ? `?${qp.toString()}` : "";
  const res = await api.apiGet(`/api/v1/threads/${threadId}/messages${qs}`);
  return { messages: res.data || [], meta: res.meta || {} };
}

export async function markThreadRead(threadId, payload = {}) {
  const res = await api.apiPost(`/api/v1/threads/${threadId}/read`, payload);
  return res.data;
}

export async function getUnreadCount() {
  const res = await api.apiGet("/api/v1/threads/unread-count");
  return res.data || {};
}

export default {
  createThread,
  listThreads,
  postMessage,
  getMessages,
  markThreadRead,
  getUnreadCount,
};
