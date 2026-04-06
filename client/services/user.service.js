import api from "./api";

const API_URL = "/api/users";

class UserService {
  async changePassword(oldPassword, newPassword) {
    const response = await api.put(API_URL + "/change-password", {
      oldPassword,
      newPassword,
    });

    if (response.data) {
      // Retrieve data using the "auth" key
      const authStr = localStorage.getItem("auth");

      if (authStr) {
        let authData = JSON.parse(authStr);
        // Update the password change status
        authData.user.mustChangePassword = false;
        localStorage.setItem("auth", JSON.stringify(authData));
      }
    }
    return response.data;
  }
}

export default new UserService();
