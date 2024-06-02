import React, {useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import "./Login.scss";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import ArchistockApiService from "../../services/ArchistockApiService";
import { useAuth } from "../../contexts/AuthContext";

const Login = () => {
    const {loggedIn, setUser} = useAuth();
    const archistockApiService = new ArchistockApiService();
    const navigate = useNavigate();
    const [loginUser, setLoginUser] = useState({
        email: '',
        password: ''
    });

    useEffect(() => {
        console.log(loggedIn);
        if(loggedIn) {
            navigate("/user/storage");
        }
    }, [loggedIn]);


    const handleRegisterClick = () => {
        navigate("/register");
    };


    const handleLogin = () => {
        archistockApiService.loginUser(loginUser).then((res) => {
            console.log(res);
            if(res && res.accessToken) {
                localStorage.setItem('accessToken', res.accessToken);
                localStorage.setItem('refreshToken', res.refreshToken);
                setUser(res.user);
                navigate("/user/storage");
            }
        })
    }

    const handleChangeInput = (e: any) => {
        setLoginUser({
            ...loginUser,
            [e.target.name]: e.target.value
        });
    }



    return (
        <div className="login flex items-center justify-center h-full">
            <div className="card p-2">
                <div className="top flex flex-col items-center py-4">
                    <h1>🔗Archistock</h1>
                    <p>1.0.0</p>
                </div>
                <div className="main-content flex flex-col justify-center">
                    <h2 className="text-center mb-5">Connexion</h2>
                    <Input value={loginUser.email} onChange={e => handleChangeInput(e)} css={'w-full mb-3'} name="email" label="Email" type="email" labelWeight="bold" placeholder="Veuillez renseigner votre adresse email" required={true}/>
                    <Input value={loginUser.password} onChange={e => handleChangeInput(e)} css={'w-full mb-3'} name="password" label="Mot de passe" type="password" labelWeight="bold" placeholder="Veuillez renseigner votre mot de passe" required={true}/>
                    <button onClick={e => handleLogin()} className="w-full py-2">Se connecter</button>
                    <p className="text-center mt-3">mot de passe oublié</p>
                </div>
                <div className="flex flex-col items-center py-4 bottom">
                    <button className="py-1" onClick={handleRegisterClick}>Créer un compte</button>
                    <p className="right mt-5">archistock 2024®</p>
                </div>
            </div>
        </div>
    );
};

export default Login;
