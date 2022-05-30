import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { createContext, useContext, useEffect, useState } from 'react';
import { auth } from './setup';
import Axios from "axios";
import { BACKEND_URL } from './const';

const authCtx = createContext({
    signInWithGoogle: null,
    signOut: null,
    user: null
});

function useAuthProvider() {
    const [ user, setUser ] = useState(null);
    const [ isGoogleSignIn, setIsGoogleSignIn ] = useState(false);
    const googleAuthProvider = new GoogleAuthProvider();

    const [ listOfUsers, setListOfUsers ] = useState([]);
    useEffect(() => {
        Axios.get(`${BACKEND_URL}/getUsers`).then((response) => {
            setListOfUsers(response.data);
        }).catch((err) => {
            console.log(err);
        });
    }, []);

    const signInWithGoogle = () => {
        return signInWithPopup(auth, googleAuthProvider).then((result) => {
            setUser(result.user);
            setIsGoogleSignIn(true);
        });
    };

    const signOut = () => {
        if (isGoogleSignIn) {
            return auth.signOut().then(() => {
                setUser(false);
            });
        }
        setUser(false);
    };

    const signInUserPass = (username, password) => {
        return listOfUsers.some((knownUser) => {
            if(knownUser.username === username && knownUser.password === password) {
                setUser(knownUser);
                setIsGoogleSignIn(false);
                return true;
            }
            return false;
        });
    };

    return {
        signInWithGoogle,
        signInUserPass,
        signOut,
        user,
        isGoogleSignIn
    };
}

export const useAuth = () => {
    return useContext(authCtx);
};

export function AuthProvider(props) {
    const children = props.children;
    const authProvider = useAuthProvider();
    return (
        <authCtx.Provider value={ authProvider } >{ children }</authCtx.Provider>
    );
}