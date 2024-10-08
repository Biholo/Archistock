import React, { useEffect, useState, useMemo } from "react";
import ArchistockApiService from "../../services/ArchistockApiService";
import CardUser from "../../components/CardUser/CardUser";
import Input from "../../components/Input/Input";
import AdminStatistics from "../../components/AdminStatistics/AdminStatistics";

const Administrator = () => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("search"); // Par défaut sur "Recherche d'utilisateur"
  const archistockApiService = new ArchistockApiService();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await archistockApiService.findAllUserStorages();
        setUsers(data);
      } catch (error) {
        console.error("Erreur lors de la récupération des données:", error);
      }
    };
    fetchData();
  }, []);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredUsers = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return users.filter(
      (user) =>
        (user.firstName && user.firstName.toLowerCase().includes(query)) ||
        (user.lastName && user.lastName.toLowerCase().includes(query))
    );
  }, [users, searchQuery]);

  return (
    <div className="m-5">
      {/* Menu des onglets */}
      <div className="mb-4">
        <ul className="flex border-b">
          <li className="mr-4">
            <button
              className={`inline-block py-2 px-4 text-black ${
                activeTab === "search"
                  ? "border-b-2 border-blue-500 font-bold"
                  : ""
              }`}
              onClick={() => setActiveTab("search")}
              style={{
                border: "none",
                background: "none",
                cursor: "pointer",
                paddingBottom: "8px",
              }}
            >
              Recherche d'utilisateur
            </button>
          </li>
          <li className="mr-4">
            <button
              className={`inline-block py-2 px-4 text-black ${
                activeTab === "stats"
                  ? "border-b-2 border-blue-500 font-bold"
                  : ""
              }`}
              onClick={() => setActiveTab("stats")}
              style={{
                border: "none",
                background: "none",
                cursor: "pointer",
                paddingBottom: "8px",
              }}
            >
              Statistiques
            </button>
          </li>
        </ul>
      </div>

      {/* Contenu conditionnel basé sur l'onglet actif */}
      {activeTab === "search" && (
        <div>
          <div className="mb-4">
            <Input
              onChange={handleSearchChange}
              type="text"
              placeholder="Rechercher par nom ou prénom..."
              value={searchQuery}
            />
          </div>

          <div className="flex flex-row flex-wrap justify-around m-5">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <div className="col-md-4" key={user.id}>
                  <CardUser user={user} />
                </div>
              ))
            ) : (
              <p>Aucun utilisateur trouvé.</p>
            )}
          </div>
        </div>
      )}

      {activeTab === "stats" && (
        <div>
          {/* Affichage des statistiques */}
          <AdminStatistics />
        </div>
      )}
    </div>
  );
};

export default Administrator;
