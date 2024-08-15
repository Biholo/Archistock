import { useState, useEffect } from 'react'

import { useNavigate, useParams } from "react-router-dom";

import ArchistockApiService from '../../services/ArchistockApiService';
import { useAuth, setCookie } from "../../contexts/AuthContext";
import Input from "../../components/Input/Input";

const RegisterInvitation = () => {
    const { uuid } = useParams();
    const navigate = useNavigate();
    const { loggedIn, setUser } = useAuth();
    const archistockApiService = new ArchistockApiService();

    if(uuid === undefined) {
        navigate("/");
    }


    const [newUser, setNewUser] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumner: "",
        password: "",
        passwordConfirm: "",
    });
    const [messageError, setMessageError] = useState<string>("");

    useEffect(() => {
        if (loggedIn) {
            navigate("/storage");
        }
    }, [loggedIn]);

    const handleInputChange = (e: any, type: string) => {
        setMessageError("");

        setNewUser({
            ...newUser,
            [e.target.name]: e.target.value,
        });

    };

    const validateRegister = () => {
        if (
            newUser.firstName === "" ||
            newUser.lastName === "" ||
            newUser.email === "" ||
            newUser.phoneNumner === "" ||
            newUser.password === "" ||
            newUser.passwordConfirm === ""
        ) {
            setMessageError("Veuillez remplir tous les champs");
        } else if (newUser.password !== newUser.passwordConfirm) {
            setMessageError("Les mots de passe ne correspondent pas");
        } else {
            archistockApiService.registerInvitation(uuid, newUser).then((response) => {
                if (response.status === 200) {
                    setUser(response.data);
                    setCookie("accessToken", response.accessToken, 1);
                    setCookie("accessToken", response.refreshToken, 1);
                    navigate("/storage");
                }
            })
        }
    }

    return (
        <div>
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
                    value={newUser.phoneNumner}
                    css={"w-full mb-3"}
                    onChange={(e) => handleInputChange(e, "user")}
                    name="phoneNumner"
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
                <p>{messageError}</p>
                <button
                    className="w-full p-2 mt-4"
                    onClick={(e) => validateRegister()}
                >
                    Crééer mon compte
                </button>
            </>
        </div>
    )
}
export default RegisterInvitation;
