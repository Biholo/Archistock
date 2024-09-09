import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Register.scss";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import ArchistockApiService from "../../services/ArchistockApiService";
import { useAuth, setCookie } from "../../contexts/AuthContext";
import Card from "../../components/Card/Card";
import { toast } from "react-toastify";

const Register = () => {
  const archistockApiService = new ArchistockApiService();
  const { loggedIn, setUser } = useAuth();

  const navigate = useNavigate();
  const [msgError, setMsgError] = useState<string>("");
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [validEmail , setValidEmail] = useState<boolean>(false);
  const [conditionsAccepted, setConditionsAccepted] = useState<boolean>(false);
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

  const [formData, setFormData] = useState({
    fullName: '',
    expirationDate: '',
    cardNumber: '',
    cvv: ''
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
        setMsgError("Veuillez renseigner tous les champs.");
        toast.error("Veuillez renseigner tous les champs.");
        return;
      }
      if(!validEmail) {
        setMsgError("Le mail est déjà utilisé.");
        toast.error("Le mail est déjà utilisé.");
        return;
      }
      if (!validatePhone(newUser.phoneNumber)) {
        setMsgError("Veuillez entrer un numéro de téléphone valide.");
        toast.error("Veuillez entrer un numéro de téléphone valide.");
        return;
      }
      if (newUser.password.length < 8) {
        setMsgError("Le mot de passe doit contenir au moins 8 caractères.");
        toast.error("Le mot de passe doit contenir au moins 8 caractères.");
        return;
      }
      if (newUser.password !== newUser.passwordConfirm) {
        setMsgError("Les mots de passe ne correspondent pas.");
        toast.error("Les mots de passe ne correspondent pas.");
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
        toast.error("Veuillez renseigner tous les champs");
        return;
      }
      setCurrentStep(currentStep + 1);
    } else if (currentStep === 3) {
      if(currentStep === 3 && !conditionsAccepted) {
        setMsgError("Veuillez accepter les conditions générales");
        toast.error("Veuillez accepter les conditions générales");
        return;
      }
      archistockApiService.registerUser(newUser, address).then((res) => {
        if (res && res.accessToken) {
          setCookie("accessToken", res.accessToken, 1);
          setCookie("refreshToken", res.refreshToken, 1);
          setUser(res.user);
          navigate("/storage");
          toast.success("Inscription réussie.");
        }
      });
    }
  };

  const handleInputChange = (e: any, type: string) => {
    setMsgError("");
    // if email change and respect regex, api call
    if(type === 'user' && e.target.name === 'email') {
        if(validateEmail(e.target.value)) {
            console.log(e.target.value);
            archistockApiService.isEmailAvailable(e.target.value).then((res:any) => {
              if(!res.unique) {
                  setMsgError("L'email est déjà utilisé.");
                  toast.error("L'email est déjà utilisé.");
                  setValidEmail(false);
              } else {
                  setValidEmail(true);
              }
          });
        }
    }

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

  const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // if card number change, format it
      if (e.target.name === 'cardNumber') {
           const value = e.target.value.replace(/\D/g, '').substring(0, 16);
           const cardNumber = value.match(/.{1,4}/g)?.join(' ') || '';
           setFormData({
             ...formData,
             [e.target.name]: cardNumber
           });
      } else if (e.target.name === 'expirationDate') {
           const value = e.target.value.replace(/\D/g, '').substring(0, 4);
           const expirationDate = value.match(/.{1,2}/g)?.join('/') || '';
           setFormData({
             ...formData,
             [e.target.name]: expirationDate
           });
      } else {
           setFormData({
             ...formData,
             [e.target.name]: e.target.value
           });
      }
 };

  return (
    <div className="flex flex-row justify-center items-center w-full h-full">
       <Card css="max-w-[1000px] w-1/2">
        <h1 className="text-4xl text-black text-center font-bold">🧷Archistock</h1>
        <p className="text-sm text-slate-400 text-center">1.0.0</p>
        <hr className="w-full h-[1px] mx-auto my-4 bg-slate-400 border-0 rounded md:my-5" />
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
        </>
      )}
      {currentStep === 3 && (
        <>
          <h2 className="text-2xl text-black font-bold text-center">
            Paiement
          </h2>
          <p className="text-black text-center">Pour terminer votre inscription, vous devez souscrire à notre abonnement de 20 Go. Après l'inscription, vous aurez la possibilité d'étendre votre stockage.</p>
          <form className="mt-3 text-center sm:mt-0 sm:text-left w-full">
            <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-headline">
                Purchase Basic Subscription <span className='text-xl font-bold'>(20 GB)</span> - <span className='text-xl font-bold'>20€/month</span>
            </h3>
            <hr className='m-3'/>
            <div className='flex flex-col mt-3'>
                <p>Card information</p>
                <Input 
                    type='text' 
                    placeholder='John Doe' 
                    css='mt-2 w-full' 
                    label='Full Name' 
                    name='fullName'
                    value={formData.fullName}
                    onChange={handlePaymentChange}
                    required={true} 
                />
                <Input 
                    type='text' 
                    placeholder='1234 5678 9101 1121' 
                    css='mt-2 w-full' 
                    label='Card Number' 
                    name='cardNumber'
                    value={formData.cardNumber}
                    onChange={handlePaymentChange}
                    required={true} 
                />
                <div className='flex flex-row flex-wrap gap-2 w-full'>
                    <Input 
                        type='text' 
                        placeholder='MM/YY' 
                        css='mt-2 w-full' 
                        label='Expiration Date' 
                        name='expirationDate'
                        value={formData.expirationDate}
                        onChange={handlePaymentChange}
                        required={true} 
                    />
                    <Input 
                        type='text' 
                        placeholder='123' 
                        css='mt-2 w-full' 
                        label='CVV' 
                        name='cvv'
                        value={formData.cvv}
                        onChange={handlePaymentChange}
                        required={true} 
                    />
                </div>
            </div>
            <div className="divider">OR</div>
            <div className='flex justify-between mt-3 gap-2'>
              <Button color="warning" css="w-1/2">Pay with <img className='-ml-1.5 w-14 mb-0 mt-1' src='https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/PayPal2007.svg/300px-PayPal2007.svg.png' /></Button>
              <Button color="danger" css="w-1/2">Pay with <img className='-ml-2.5 w-14 mb-0' src='https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg' /></Button>
            </div>
            <div className='flex flex-row items-center mt-3'>
              <input type='checkbox' className='mr-2' onChange={() => setConditionsAccepted(!conditionsAccepted)} />
              <label className='text-sm text-black'>I accept the general conditions</label>
            </div>
          </form>
        </>
      )}
      {msgError && <p className="text-red-400">{msgError}</p>}
      <div className={currentStep > 1 ? "grid grid-cols-2 gap-4" : "flex"}>
        {currentStep > 1 && (
          <Button
            color="neutral"
            css="w-full"
            onClick={() => setCurrentStep(currentStep - 1)}
          >
            Retour
          </Button>
        )}
        {currentStep < 3 && (
          <Button color="primary" css="w-full" onClick={handleNextStep}>
            Suivant
          </Button>
        )}
        {currentStep === 3 && (
          <Button color="success" css="w-full" onClick={handleNextStep}>
            Finaliser
          </Button>
        )}
      </div>
      <hr className="w-full h-[1px] mx-auto my-4 bg-slate-400 border-0 rounded md:my-5" />
      <a href="/login" className="text-md text-slate-400 text-center">
        Je possède déjà un compte
      </a>
      <p className="text-xs mt-3 text-slate-400 text-center">© 2024 Archistock. Tous droits réservés.</p>
      
      </Card>
    </div>
  );
};

export default Register;
