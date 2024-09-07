import React, {useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import Card from "../../components/Card/Card";
import ArchistockApiService from "../../services/ArchistockApiService";
import { useAuth, setCookie } from "../../contexts/AuthContext";

const Login = () => {
    const {loggedIn, setUser, setLoggedIn} = useAuth();
    const archistockApiService = new ArchistockApiService();
    const navigate = useNavigate();
    const [loginUser, setLoginUser] = useState({
        email: '',
        password: ''
    });

    useEffect(() => {
        console.log(loggedIn);
        if(loggedIn) {
            navigate("/storage");
        }
    }, [loggedIn]);


    const handleRegisterClick = () => {
        navigate("/register");
    };


    const handleLogin = () => {
        archistockApiService.loginUser(loginUser).then((res) => {
            console.log(res);
            if(res && res.accessToken) {
                setCookie("accessToken", res.accessToken, 1);
                setCookie("refreshToken", res.refreshToken, 1)
                setUser(res.user);
                setLoggedIn(true);
                navigate("/storage");
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
       <div className="flex flex-row justify-center items-center w-full h-full">
            <Card css="max-w-[1000px] w-1/2">
            <h1 className="text-4xl text-black text-center font-bold">🧷Archistock</h1>
            <p className="text-sm text-slate-400 text-center">1.0.0</p>
            <hr className="w-full h-[1px] mx-auto my-4 bg-slate-400 border-0 rounded md:my-5" />
            <h2 className="text-2xl text-black font-bold text-center">Connexion</h2>
            <Input label="Email" name="email" required={true} type="email" placeholder="Email" value={loginUser.email} onChange={handleChangeInput} />
            <Input label="Mot de passe" name="password" required={true} type="password" placeholder="Password" value={loginUser.password} onChange={handleChangeInput} />
            <a href="/forgot-password" className="text-xs text-slate-400 text-right">Mot de passe oublié ?</a>
            <Button color="primary" css="w-full mt-4" onClick={handleLogin}>Connexion</Button>
            <hr className="w-full h-[1px] mx-auto my-4 bg-slate-400 border-0 rounded md:my-5" />
            <Button color="neutral" css="w-full" onClick={handleRegisterClick}>Créer un compte</Button>
            
            </Card>
         </div>
    );
};

export default Login;
