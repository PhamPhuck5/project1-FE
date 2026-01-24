import api from "../axios.js";

// GET /api/group/groups
export const getUserGroups = async (signal) => {
  const response = await api.get("/api/group/groups", { signal });
  return response.data;
};

// POST /api/group/create
export const createGroup = async (data, signal) => {
  const response = await api.post("/api/group/create", data, { signal });
  return response.data;
};

// DELETE /api/group/:id
export const deleteGroup = async (groupId, signal) => {
  const response = await api.delete(`/api/group/${groupId}`, { signal });
  return response.data;
};

// POST /api/group/request-join
export const requestJoinGroup = async (groupId, signal) => {
  const response = await api.post(
    "/api/group/request-join",
    { groupId },
    { signal }
  );
  return response.data;
};

// POST /api/group/leave
export const leaveGroup = async (groupId, signal) => {
  const response = await api.post("/api/group/leave", { groupId }, { signal });
  return response.data;
};

// PUT /api/group/set-admin
export const setAdmin = async (userId, groupId, isAdmin, signal) => {
  const response = await api.put(
    "/api/group/set-admin",
    { userId, groupId, isAdmin },
    { signal }
  );
  return response.data;
};

// GET /api/group/:id/requesting-users
export const getAllRequestingUsers = async (groupId, signal) => {
  const response = await api.get(`/api/group/${groupId}/requesting-users`, {
    signal,
  });
  return response.data;
};

// POST /api/group/accept-request
export const acceptJoinRequest = async (groupId, memberId, signal) => {
  const response = await api.post(
    "/api/group/accept-request",
    { groupId, memberId },
    { signal }
  );
  return response.data;
};
