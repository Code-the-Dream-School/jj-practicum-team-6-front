import api from "./apiClient";

export async function postComment(itemId, body) {
  const res = await api.apiPost(`/api/v1/items/${itemId}/comments`, { body });
  return res.data;
}

export async function listComments(itemId, { limit = 20, offset = 0 } = {}) {
  const qs = `?limit=${limit}&offset=${offset}`;
  try {
    const res = await api.apiGet(`/api/v1/items/${itemId}/comments${qs}`);
    return { comments: res.data || [], meta: res.meta || {} };
  } catch (err) {
    const code = err?.code || err?.error?.code || err?.status || null;
    if (code === "RESOURCE_NOT_FOUND" || code === 404) {
      return { comments: [], meta: {} };
    }
    throw err;
  }
}

export async function deleteComment(commentId) {
  return api.apiDelete(`/api/v1/comments/${commentId}`);
}

export default { postComment, listComments, deleteComment };
