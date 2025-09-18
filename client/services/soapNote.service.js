import axios from "axios";
import AuthService from "./auth.service";
// get the API URL from environment variables
const API_URL = process.env.NEXT_PUBLIC_API_URL + "/api/soapNotes";

const getAuthHeader = () => {
  const token = AuthService.getToken();
  if (token) {
    return { headers: { Authorization: token } };
  }
  return {};
};

class SoapNoteService {
  // Get my SOAP notes
  getMySoapNotes() {
    return axios.get(API_URL, getAuthHeader());
  }

  // Get a specific SOAP note by its ID
  getSoapNoteById(noteId) {
    return axios.get(API_URL + `/${noteId}`, getAuthHeader());
  }

  // Get all SOAP notes (leader only)
  getAllSoapNotes() {
    return axios.get(API_URL, getAuthHeader());
  }
}

export default new SoapNoteService();
