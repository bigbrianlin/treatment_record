import axios from "axios";
import AuthService from "./auth.service";

// get the API URL from environment variables
const API_URL = process.env.NEXT_PUBLIC_API_URL + "/api/users";

const getAuthHeader = () => {
  const token = AuthService.getToken();
  if (token) {
    return { headers: { Authorization: token } };
  }
  return {};
};

class UserService {
  async changePassword(oldPassword, newPassword) {
    const response = await axios.put(API_URL + "/change-password", { oldPassword, newPassword }, getAuthHeader());

    if (response.data) {
      const authStr = localStorage.getItem("auth");

      if (authStr) {
        let authData = JSON.parse(authStr);
        authData.user.mustChangePassword = false;
        localStorage.setItem("auth", JSON.stringify(authData));
      }
    }
    return response.data;
  }
}

export default new UserService();
