import axios from "axios";

const API = axios.create({
  baseURL: "",
  withCredentials: true
});

export const adminLogin = async (email, password) => {
  const res = await API.post("/api/admin/login", { email, password });

  if (res.data && res.data.access_token) {
    const token = res.data.access_token;
    localStorage.setItem("admin_jwt", token);
    API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }
  return res;
};

export const fetchUsers = () => API.get("/api/admin/users");

export const deleteUser = (id) =>
  API.delete(`/api/admin/users/${id}`);

export const updateRole = (id, role) =>
  API.put(`/api/admin/users/${id}`, { role });

export const logout = () => {
  localStorage.removeItem("admin_jwt");
  delete API.defaults.headers.common["Authorization"];
  return API.post("/api/logout");
};
