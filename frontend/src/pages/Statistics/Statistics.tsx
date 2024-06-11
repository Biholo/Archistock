import React, { useEffect } from "react";
import { fileApi } from "../../services/apiService.js";

const Statistics = () => {
  useEffect(() => {
    try {
      console.log(fileApi.getAll());
    } catch (error) {
      console.error("Error fetching file statistics:", error);
    }
  }, []);

  return (
    <div>
      <p>Nombre de fichiers upload depuis la création de votre compte : </p>
      <p>Nombre de fichiers upload aujourd'hui : </p>
    </div>
  );
};

export default Statistics;
