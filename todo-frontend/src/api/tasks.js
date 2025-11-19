import api from "./axios";

export const getTasks = (token) => {
  return api.get("/tasks", {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const createTask = (token, data) => {
  return api.post("/tasks", data, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const updateTaskApi = (token, id, data) => {
  return api.put(`/tasks/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const deleteTaskApi = (token, id) => {
  return api.delete(`/tasks/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
