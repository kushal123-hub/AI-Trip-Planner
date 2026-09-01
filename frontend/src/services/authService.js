import API from "../api/api";
import { setToken, removeToken } from "../utils/auth";

export const login = async (email, password) => {
  const formData = new URLSearchParams();
  formData.append("username", email);
  formData.append("password", password);

  const response = await API.post("/auth/login", formData, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  if (response.data.access_token) {
    setToken(response.data.access_token);
  }
  return response.data;
};

export const register = async (username, email, password) => {
  const response = await API.post("/auth/register", {
    username,
    email,
    password,
  });
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await API.get("/auth/me");
  return response.data;
};

export const logout = () => {
  removeToken();
};
