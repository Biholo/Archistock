import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Register.scss";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import ArchistockApiService from "../../services/ArchistockApiService";
import { useAuth, setCookie } from "../../contexts/AuthContext";

const Register = () => {
  const archistockApiService = new ArchistockApiService();
  const { loggedIn, setUser } = useAuth();

  const navigate = useNavigate();
  const [msgError, setMsgError] = useState<string>("");
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [newUser, setNewUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
    passwordConfirm: "",
  });

  const [address, setAddress] = useState({
    street: "",
    city: "",
    postalCode: "",
    country: "",
  });

  useEffect(() => {
    if (loggedIn) {
      navigate("/storage");
    }
  }, [loggedIn]);

  const handleRegisterClick = () => {
    navigate("/");
  };

  const validateEmail = (email: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    const re = /^\d{10}$/; // Assuming a 10-digit phone number
    return re.test(phone);
  };

  const handleNextStep = () => {
    if (currentStep === 1) {
      if (
        newUser.firstName === "" ||
        newUser.lastName === "" ||
        newUser.email === "" ||
        newUser.phoneNumber === "" ||
        newUser.password === "" ||
        newUser.passwordConfirm === ""
      ) {
        setMsgError("Veuillez renseigner tous les champs");
        return;
      }
      if (!validateEmail(newUser.email)) {
        setMsgError("Veuillez entrer une adresse email valide");
        return;
      }
      if (!validatePhone(newUser.phoneNumber)) {
        setMsgError("Veuillez entrer un numéro de téléphone valide");
        return;
      }
      if (newUser.password.length < 6) {
        setMsgError("Le mot de passe doit contenir au moins 6 caractères");
        return;
      }
      if (newUser.password !== newUser.passwordConfirm) {
        setMsgError("Les mots de passe ne correspondent pas");
        return;
      }
      setMsgError(""); // Clear error message if all validations pass
      setCurrentStep(currentStep + 1);
    } else if (currentStep === 2) {
      if (
        address.street === "" ||
        address.city === "" ||
        address.postalCode === "" ||
        address.country === ""
      ) {
        setMsgError("Veuillez renseigner tous les champs");
        return;
      }
      setCurrentStep(currentStep + 1);
    } else if (currentStep === 3) {
      archistockApiService.registerUser(newUser, address).then((res) => {
        if (res && res.accessToken) {
          setCookie("accessToken", res.accessToken, 1);
          setCookie("refreshToken", res.refreshToken, 1);
          setUser(res.user);
          navigate("/storage");
        }
      });
    }
  };

  const handleInputChange = (e: any, type: string) => {
    setMsgError("");
    if (type === "address") {
      setAddress({
        ...address,
        [e.target.name]: e.target.value,
      });
    } else if (type === "user") {
      setNewUser({
        ...newUser,
        [e.target.name]: e.target.value,
      });
    }
  };

  return (
    <div className="register flex items-center justify-center h-full">
      <div className="card p-2">
        <div className="top flex flex-col items-center py-4">
          <h1>🔗Archistock</h1>
          <p>1.0.0</p>
        </div>
        <div className="main-content flex flex-col justify-center">
          <h2 className="text-center mb-5">
            {currentStep === 3 ? "Choix de paiement" : "Inscription"}
          </h2>
          {currentStep === 1 && (
            <>
              <div className="flex mb-3">
                <Input
                  value={newUser.firstName}
                  css={"w-full mr-2"}
                  onChange={(e) => handleInputChange(e, "user")}
                  name="firstName"
                  label="Prénom"
                  type="text"
                  labelWeight="bold"
                  placeholder="Veuillez renseigner votre prénom"
                  required={true}
                />
                <Input
                  value={newUser.lastName}
                  css={"w-full ml-2"}
                  onChange={(e) => handleInputChange(e, "user")}
                  name="lastName"
                  label="Nom"
                  type="text"
                  labelWeight="bold"
                  placeholder="Veuillez renseigner votre nom"
                  required={true}
                />
              </div>
              <Input
                value={newUser.email}
                css={"w-full mb-3"}
                onChange={(e) => handleInputChange(e, "user")}
                name="email"
                label="Email"
                type="email"
                labelWeight="bold"
                placeholder="Veuillez renseigner votre adresse email"
                required={true}
              />
              <Input
                value={newUser.phoneNumber}
                css={"w-full mb-3"}
                onChange={(e) => handleInputChange(e, "user")}
                name="phoneNumber"
                label="Numéro de téléphone"
                type="tel"
                labelWeight="bold"
                placeholder="Veuillez renseigner votre numéro de téléphone"
                required={true}
              />
              <Input
                value={newUser.password}
                css={"w-full mb-3"}
                onChange={(e) => handleInputChange(e, "user")}
                name="password"
                label="Mot de passe"
                type="password"
                labelWeight="bold"
                placeholder="Veuillez renseigner votre mot de passe"
                required={true}
              />
              <Input
                value={newUser.passwordConfirm}
                css={"w-full mb-3"}
                onChange={(e) => handleInputChange(e, "user")}
                name="passwordConfirm"
                label="Confirmation du mot de passe"
                type="password"
                labelWeight="bold"
                placeholder="Veuillez renseigner votre mot de passe"
                required={true}
              />
              <p>{msgError}</p>
              <button
                className="w-full p-2 mt-4"
                onClick={(e) => handleNextStep()}
              >
                Poursuivre
              </button>
            </>
          )}
          {currentStep === 2 && (
            <>
              <Input
                value={address.street}
                css={"w-full mb-3"}
                onChange={(e) => handleInputChange(e, "address")}
                name="street"
                label="Adresse"
                type="text"
                labelWeight="bold"
                placeholder="Veuillez renseigner votre adresse"
                required={true}
              />
              <Input
                value={address.city}
                css={"w-full mb-3"}
                onChange={(e) => handleInputChange(e, "address")}
                name="city"
                label="Ville"
                type="text"
                labelWeight="bold"
                placeholder="Veuillez renseigner votre ville"
                required={true}
              />
              <Input
                value={address.postalCode}
                css={"w-full mb-3"}
                onChange={(e) => handleInputChange(e, "address")}
                name="postalCode"
                label="Code postal"
                type="text"
                labelWeight="bold"
                placeholder="Veuillez renseigner votre code postal"
                required={true}
              />
              <Input
                value={address.country}
                css={"w-full mb-3"}
                onChange={(e) => handleInputChange(e, "address")}
                name="country"
                label="Pays"
                type="text"
                labelWeight="bold"
                placeholder="Veuillez renseigner votre pays"
                required={true}
              />
              <p>{msgError}</p>
              <div className="flex mt-4">
                <button
                  className="p-2 w-2/5 before-btn"
                  onClick={(e) => setCurrentStep(currentStep - 1)}
                >
                  Retour
                </button>
                <button
                  className="p-2 w-3/5 ml-2"
                  onClick={(e) => handleNextStep()}
                >
                  Poursuivre
                </button>
              </div>
            </>
          )}
          {currentStep === 3 && (
            <>
              <p>
                Pour finaliser la création de votre espace, nous vous
                attribuerons 20 Go de stockage.
              </p>
              <div className="item-payment p-5">
                <input type="radio" name="payment" id="cb" />
                <div className="flex">
                  <img
                    className="mr-2"
                    src="/images/mastercard.png"
                    alt="MasterCard logo"
                  />
                  <img
                    className="mr-2"
                    src="/images/maestro.png"
                    alt="Maestro logo"
                  />
                  <img src="/images/visa.png" alt="Visa logo" />
                </div>
              </div>
              <div className="item-payment p-5">
                <input type="radio" name="payment" id="paypal" />
                <div>
                  <img src="/images/paypal-logo.png" alt="Paypal Logo" />
                </div>
              </div>
              <div className="flex mt-4">
                <button
                  className="p-2 w-2/5 before-btn"
                  onClick={(e) => setCurrentStep(currentStep - 1)}
                >
                  Retour
                </button>
                <button
                  className="p-2 w-3/5 ml-2"
                  onClick={(e) => handleNextStep()}
                >
                  Poursuivre
                </button>
              </div>
            </>
          )}
        </div>
        <div className="flex flex-col items-center py-4 bottom">
          <button className="py-1" onClick={handleRegisterClick}>
            Je possède déjà un compte
          </button>
          <p className="right mt-5">archistock 2024®</p>
        </div>
      </div>
    </div>
  );
};

export default Register;
