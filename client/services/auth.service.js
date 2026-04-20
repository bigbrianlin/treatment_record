import axios from "axios";
// get the API URL from environment variables
const API_URL = process.env.NEXT_PUBLIC_API_URL + "/api/auth";

class AuthService {
  /**
   * login user
   * @param {string} username
   * @param {string} password
   * @returns
   */
  async login(username, password) {
    try {
      const response = await axios.post(API_URL + "/login", { username, password }, { withCredentials: true });
      if (response.data.token && response.data.user) {
        const authData = {
          token: response.data.token,
          user: response.data.user,
        };
        localStorage.setItem("auth", JSON.stringify(authData));
      }
      return response.data;
    } catch (err) {
      throw err;
    }
  }

  /**
   * register user
   * @param {string} username
   * @param {string} password
   * @param {string} role
   * @returns
   */
  register(username, password, role) {
    return axios.post(API_URL + "/register", {
      username,
      password,
      role,
    });
  }
  /**
   * get current user
   * @returns
   */
  getCurrentUser() {
    if (typeof window !== "undefined") {
      const auth = localStorage.getItem("auth");
      return auth ? JSON.parse(auth).user : null;
    }
    return null;
  }

  /**
   * get current user token
   * @returns
   */
  getToken() {
    if (typeof window !== "undefined") {
      const auth = localStorage.getItem("auth");
      return auth ? JSON.parse(auth).token : null;
    }
    return null;
  }

  updateToken(newToken) {
    if (typeof window !== "undefined") {
      const authStr = localStorage.getItem("auth");
      if (authStr) {
        const authData = JSON.parse(authStr);
        authData.token = newToken;
        localStorage.setItem("auth", JSON.stringify(authData));
      }
    }
  }

  async logout() {
    try {
      await axios.post(API_URL + "/logout", {}, { withCredentials: true });
    } catch (err) {
      console.error("Logout API failed, but will still clear local storage", err);
    } finally {
      if (typeof window !== "undefined") {
        localStorage.removeItem("auth");
      }
    }
  }
}

export default new AuthService();
