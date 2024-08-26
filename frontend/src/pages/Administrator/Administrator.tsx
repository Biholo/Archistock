// pages/Administrator/Administrator.js

import React, { useEffect, useState, useMemo } from "react";
import ArchistockApiService from "../../services/ArchistockApiService";
import CardUser from "../../components/CardUser/CardUser";
import Input from "../../components/Input/Input";

const Administrator = () => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
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
  }, [archistockApiService]);

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
  );
};

export default Administrator;
