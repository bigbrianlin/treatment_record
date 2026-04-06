import api from "./api";

const API_URL = "/api/patients";

class PatientService {
  // Get all patients
  getAllPatients() {
    return api.get(API_URL);
  }

  // Get a specific patient by ID
  getPatientById(patientId) {
    return api.get(API_URL + `/${patientId}`);
  }

  createPatient(patientData) {
    return api.post(API_URL, patientData);
  }

  updatePatient(patientId, updatedData) {
    return api.patch(API_URL + `/${patientId}`, updatedData);
  }

  deletePatient(patientId) {
    return api.delete(API_URL + `/${patientId}`);
  }
}

export default new PatientService();
