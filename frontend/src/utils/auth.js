export const getToken = () => localStorage.getItem("token");

export const setToken = (token) => localStorage.setItem("token", token);

export const removeToken = () => localStorage.removeItem("token");

export const isAuthenticated = () => {
  const token = getToken();
  if (!token) return false;
  try {
    // Optionally check if token is expired
    const payload = JSON.parse(atob(token.split(".")[1]));
    if (payload.exp && Date.now() >= payload.exp * 1000) {
      removeToken();
      return false;
    }
  } catch (e) {
    return false;
  }
  return true;
};
