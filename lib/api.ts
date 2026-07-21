import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

// Helper functions for our AI & CRUD endpoints
export const ApiService = {
  // Upload & Process Resume Version
  uploadResumeVersion: async (resumeId: number, userId: number, file: File) => {
    const formData = new FormData();
    formData.append("user_id", userId.toString());
    formData.append("file", file);

    const response = await api.post(`/resumeversions/upload/${resumeId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  // Get single resume version details
  getResumeVersion: async (versionId: number) => {
    const response = await api.get(`/resumeversions/${versionId}`);
    return response.data;
  },

  // Generate Compatibility Report
  generateCompatibilityReport: async (resumeVersionId: number, jobId: number) => {
    const response = await api.post(`/compatibilityreports/generate?resume_version_id=${resumeVersionId}&job_id=${jobId}`);
    return response.data;
  },

  // Generate Cover Letter
  generateCoverLetter: async (resumeVersionId: number, jobId: number, tone: string = "Professional") => {
    const response = await api.post(`/coverletters/generate?resume_version_id=${resumeVersionId}&job_id=${jobId}&tone=${tone}`);
    return response.data;
  },
};
