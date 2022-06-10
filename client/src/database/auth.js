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

    const signInUserPass = async (givenUsername, givenPassword) => {
        const res = await fetch(`${BACKEND_URL}/api/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: givenUsername,
                password: givenPassword
            })
        });
        const data = await res.json();
        if (data.status === 'ok') {
            return true;
        }
        console.log(data.error);
        return false;
    };

    const signUpUser = async (givenName, givenAge, givenUsername, givenPassword) => {
        const isRegistered = await hasUser(givenUsername);
        if (!isRegistered) {
            const req = await fetch(`${BACKEND_URL}/api/signUpUser`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: givenName,
                    age: givenAge,
                    username: givenUsername,
                    password: givenPassword
                })
            });
            if (req.body.status === 'ok') {
                return true;
            }
            return false;
        }
        return false;
    }

    const hasUser = async (givenUsername) => {
        const req = await fetch(`${BACKEND_URL}/api/hasUser`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: givenUsername
            })
        });

        const data = await req.json();
        if (data.status === 'ok') {
            return data.hasUser;
        }
        return false;
    }

    return {
        hasUser,
        signInWithGoogle,
        signInUserPass,
        signUpUser,
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