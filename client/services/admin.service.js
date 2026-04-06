import axios from "axios";
import AuthService from "./auth.service";

const API_URL = process.env.NEXT_PUBLIC_API_URL + "/api/admin";

const getAuthHeader = () => {
  const token = AuthService.getToken();
  if (token) {
    return { headers: { Authorization: token } };
  }
  return {};
};

class AdminService {
  async getAllUsers() {
    try {
      const response = await axios.get(API_URL + "/users", getAuthHeader());
      return response.data;
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  }

  async getUserById(userId) {
    try {
      const response = await axios.get(API_URL + `/users/${userId}`, getAuthHeader());
      return response.data;
    } catch (error) {
      console.error("Error fetching user:", error);
      throw error;
    }
  }

  async createUser(userData) {
    try {
      const response = await axios.post(API_URL + "/users", userData, getAuthHeader());
      return response.data;
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }
}

export default new AdminService();
