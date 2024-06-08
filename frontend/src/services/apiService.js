const API_BASE_URL = "http://localhost:8000";

const fileApi = {
  getAll: () =>
    fetch(`${API_BASE_URL}/file/all`, {
      headers: {},
    }).then((response) => response.json()),
};
