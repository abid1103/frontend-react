import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000",
  withCredentials: true
});

// adminLogin: after successful login, if an access_token is returned in JSON,
// store it in memory (or localStorage) and set default Authorization header.
export const adminLogin = async (email, password) => {
  const res = await API.post("/admin/login", { email, password });
  // if backend returns access_token in body (we added that), set Authorization header
  if (res.data && res.data.access_token) {
    const token = res.data.access_token;
    // store in localStorage (or memory) if you prefer
    localStorage.setItem("admin_jwt", token);
    API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }
  return res;
};

export const fetchUsers = () => API.get("/admin/users");
export const deleteUser = (id) => API.delete(`/admin/users/${id}`);
export const updateRole = (id, role) =>
  API.put(`/admin/users/${id}`, { role });

export const logout = () => {
  // optional: clear stored token
  localStorage.removeItem("admin_jwt");
  delete API.defaults.headers.common["Authorization"];
  return API.post("/logout");
};
