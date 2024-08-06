const API_BASE_URL = "http://localhost:8000";

const fileApi = {
  getAll: () =>
    fetch(`${API_BASE_URL}/file/all`, {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((response) => response.json()),
  getSubscription: (idFile) =>
    fetch(`${API_BASE_URL}/file/subscription/${idFile}`, {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((response) => response.json()),
};

const userApi = {
  getFilesByUserId: (userId) =>
    fetch(`${API_BASE_URL}/user/files/${userId}`, {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((response) => response.json()),
}

export { fileApi, userApi };
