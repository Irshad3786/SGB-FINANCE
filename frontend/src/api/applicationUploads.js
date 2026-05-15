import apiClient from "./axios";

export const uploadApplicationDocument = async ({
  vehicleNumber,
  personType,
  documentName,
  file,
}) => {
  const formData = new FormData();
  formData.append("vehicleNumber", vehicleNumber);
  formData.append("personType", personType);
  formData.append("documentName", documentName);
  formData.append("file", file);

  const response = await apiClient.post(
    "/api/subadmin/management/uploads",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};

export const getApplicationDocumentSignedUrl = async ({ key }) => {
  const response = await apiClient.get("/api/subadmin/management/uploads/signed-url", {
    params: { key },
  });

  return response.data;
};
