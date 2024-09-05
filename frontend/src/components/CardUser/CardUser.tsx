import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const CardUser = ({ user }) => {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate(`/storage/user/${user.id}`);
  };

  return (
    <div className="card card-background m-3">
      <div className="card-body">
        <h5 className="card-title">{`${user.firstName} ${user.lastName}`}</h5>
        <p className="card-text">
          <strong>Stockage utilisé :</strong> {user.usedStorage} Mo
        </p>
        <p className="card-text">
          <strong>Stockage disponible :</strong> {user.availableStorage} Mo
        </p>
        <button className="btn btn-primary" onClick={handleButtonClick}>
          Voir les fichiers
        </button>
      </div>
    </div>
  );
};

export default CardUser;
