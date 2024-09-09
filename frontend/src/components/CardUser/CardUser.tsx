import React from "react";
import { useNavigate } from "react-router-dom";

const CardUser = ({ userStorage }) => {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate(`/storage/user/${userStorage.id}`);
  };

  return (
    userStorage && (
      <div className="card card-background m-3">
        <div className="card-body">
          <h5 className="card-title">{`${userStorage.firstName} ${userStorage.lastName}`}</h5>
          <p className="card-text">
            <strong>Nombre d'abonnements :</strong> {userStorage.nbSubs}
          </p>
          <p className="card-text">
            <strong>Stockage utilisé :</strong> {(userStorage.usedStorage / 1000).toFixed(2)} Go
          </p>
          <p className="card-text">
            <strong>Stockage disponible :</strong> {(userStorage.totalStorage / 1000).toFixed(2)} Go
          </p>
          <p className="card-text">
            <strong>Nombre de fichiers :</strong> {userStorage.nbFiles}
          </p>
          <button className="btn btn-primary text-white" onClick={handleButtonClick}>
            Voir les fichiers
          </button>
        </div>
      </div>
    )
  );
};

export default CardUser;
