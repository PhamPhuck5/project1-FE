import api from "../axios.js";

// POST /api/event/create
export const createEvent = async (data, signal) => {
  // data: { groupId, name, categoryId, date, length }
  const response = await api.post("/api/event/create", data, { signal });
  return response.data;
};

// DELETE /api/event/
// Backend đọc req.body.eventId và req.body.groupId
export const deleteEvent = async (eventId, groupId, signal) => {
  const response = await api.delete("/api/event/", {
    data: { eventId, groupId },
    signal,
  });
  return response.data;
};
