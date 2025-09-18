import axios from "axios";
import AuthService from "./auth.service";
// get the API URL from environment variables
const API_URL = process.env.NEXT_PUBLIC_API_URL + "/api/patients";

const getAuthHeader = () => {
  const token = AuthService.getToken();
  if (token) {
    return { headers: { Authorization: token } };
  }
  return {};
};

class PatientService {
  // Get all patients
  getAllPatients() {
    return axios.get(API_URL, getAuthHeader());
  }
}

export default new PatientService();
