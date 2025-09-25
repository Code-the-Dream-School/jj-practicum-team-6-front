import api from "./apiClient";

export async function getUploadSignature(payload = {}) {
  const res = await api.apiPost("/api/v1/uploads/signature", payload);
  return res.data || res;
}

export default { getUploadSignature };
