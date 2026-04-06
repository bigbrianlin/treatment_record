import api from "./api";

const API_URL = "/api/soapNotes";

class SoapNoteService {
  // Get my SOAP notes
  getMySoapNotes() {
    return api.get(API_URL);
  }

  // Get a specific SOAP note by its ID
  getSoapNoteById(noteId) {
    return api.get(API_URL + `/${noteId}`);
  }

  // Get all SOAP notes (leader only)
  getAllSoapNotes() {
    return api.get(API_URL);
  }

  // Search SOAP notes by patient MRN or name
  searchSoapNotes(query) {
    return api.get(API_URL + "/search", {
      params: { q: query },
    });
  }

  createSoapNote(data) {
    return api.post(API_URL, data);
  }

  updateSoapNote(noteId, data) {
    return api.patch(API_URL + `/${noteId}`, data);
  }

  deleteSoapNote(noteId) {
    return api.delete(API_URL + `/${noteId}`);
  }
}

export default new SoapNoteService();
