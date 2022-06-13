import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { createContext, useContext, useState } from 'react';
import { auth } from './setup';
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

    const signInUserPass = async (givenEmail, givenPassword) => {
        const res = await fetch(`${BACKEND_URL}/api/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: givenEmail,
                password: givenPassword
            })
        });
        const data = await res.json();
        if (data.status === 'ok') {
            setUser(data.user);
            setIsGoogleSignIn(false);
            return signInResultCodes.SUCCESS;
        }
        return data.errorCode;
    };

    const signUpUser = async (givenName, givenAge, givenEmail, givenPassword) => {
        const isRegistered = await hasUser(givenEmail);
        if (!isRegistered) {
            const req = await fetch(`${BACKEND_URL}/api/signUpUser`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: givenName,
                    age: givenAge,
                    email: givenEmail,
                    password: givenPassword
                })
            });
            const data = await req.json();
            if (data.status === 'ok') {
                return true;
            }
            return false;
        }
        return false;
    }

    const hasUser = async (givenEmail) => {
        const req = await fetch(`${BACKEND_URL}/api/hasUser`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: givenEmail
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

export const signInResultCodes = {
    SUCCESS: 0,
    INVALID_PASSWORD: 1,
    NO_SUCH_USER: 2,
    UNKNOWN: 3
}

export const signInResultTexts = [
    "Login successful", // Return code 0
    "Invalid password", // Return code 1
    "No such user", // Return code 2
    "Unknown error occurred" // Return code 3
];

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