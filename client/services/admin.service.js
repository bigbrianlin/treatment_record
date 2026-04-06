import api from "./api";

const API_URL = "/api/admin";

class AdminService {
  async getAllUsers() {
    try {
      const response = await api.get(API_URL + "/users");
      return response.data;
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  }

  async getUserById(userId) {
    try {
      const response = await api.get(API_URL + `/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching user:", error);
      throw error;
    }
  }

  async createUser(userData) {
    try {
      const response = await api.post(API_URL + "/users", userData);
      return response.data;
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }
}

export default new AdminService();
