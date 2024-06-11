const API_BASE_URL = "http://localhost:8000";

const fileApi = {
  getAll: () =>
    fetch(`${API_BASE_URL}/file/all`, {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((response) => response.json()),
};

export { fileApi };
