import React, { useEffect, useState } from "react";


const Statistics: React.FC = () => {
  
  const [activeTab, setActiveTab] = useState(
    user.role === "admin" ? "admin" : "user"
  );

  const archistockApiService = new ArchistockApiService();

  useEffect(() => {
    const fetchData = async () => {
      try {
        
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [selectedInterval]);

  return (
    <div className="m-5">
      {/* Contenu des onglets */}
      {activeTab === "user" ? (
        <>
          
        </>
      ) : (
        
      )}
    </div>
  );
};

export default Statistics;
