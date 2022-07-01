import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { createContext, useContext, useState } from "react";
import { auth } from "./setup";
import { BACKEND_URL } from "./const";

const authCtx = createContext({
  signInWithGoogle: null,
  signOut: null,
  user: null,
});

function useAuthProvider() {
  const [user, setUser] = useState(null);
  const [isGoogleSignIn, setIsGoogleSignIn] = useState(false);
  const googleAuthProvider = new GoogleAuthProvider();

  const signInWithGoogle = () => {
    return signInWithPopup(auth, googleAuthProvider).then(async (result) => {
      fetch(`${BACKEND_URL}/api/postAltLogin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: result.user.displayName,
          age: "-1",
          email: result.user.email
        }),
      })
      .then(req => req.json())
      .then(data => {
        if (data.status === "error") {
          console.log("Error occurred while adding 3rd party account user to database");
        } else {
          let user = data.user;
          user.photoURL = result.user.photoURL;
          setUser(user);
          localStorage.setItem('user', JSON.stringify(user));
        }
      });
      setIsGoogleSignIn(true);
    });
  };

  const signOut = () => {
    if (isGoogleSignIn) {
      return auth.signOut().then(() => {
        setUser(false);
        localStorage.setItem("user", "");
      });
    }
    setUser(false);
    localStorage.setItem("user", "");
  };

  const signInUserPass = async (givenEmail, givenPassword) => {
    const res = await fetch(`${BACKEND_URL}/api/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: givenEmail,
        password: givenPassword,
      }),
    });
    const data = await res.json();
    if (data.status === "ok") {
      setUser(data.user);
      setIsGoogleSignIn(false);
      localStorage.setItem("user", JSON.stringify(data.user));
      return signInResultCodes.SUCCESS;
    }
    return data.errorCode;
  };

  const signUpUser = async (givenName, givenAge, givenEmail, givenPassword) => {
    const userStatus = await hasUser(givenEmail);
    if (userStatus === hasUserResultCodes.NO_SUCH_USER) {
      const req = await fetch(`${BACKEND_URL}/api/signUpUser`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: givenName,
          age: givenAge,
          email: givenEmail,
          password: givenPassword,
        }),
      });
      const data = await req.json();
      if (data.status === "ok") {
        return true;
      }
      return false;
    }
    return false;
  };

  const hasUser = async (givenEmail) => {
    const req = await fetch(`${BACKEND_URL}/api/hasUser`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: givenEmail,
      }),
    });

    const data = await req.json();
    if (data.status === "ok") {
      if (data.hasUser) {
        if (data.isVerified) {
          return hasUserResultCodes.HAS_USER;
        }
        return hasUserResultCodes.UNVERIFIED_USER;
      }
      return hasUserResultCodes.NO_SUCH_USER;
    }
    if (data.status === "error") {
      if (data.statusCode === hasUserResultCodes.ALTERNATE_SIGN_IN) {
        return hasUserResultCodes.ALTERNATE_SIGN_IN;
      }
    }
    return hasUserResultCodes.UNKNOWN_ERROR;
  };

  return {
    hasUser,
    signInWithGoogle,
    signInUserPass,
    signUpUser,
    signOut,
    user,
    setUser,
    isGoogleSignIn,
  };
}

export const signInResultCodes = {
  SUCCESS: 0,
  INVALID_PASSWORD: 1,
  NO_SUCH_USER: 2,
  UNKNOWN: 3,
  EMAIL_NOT_VERIFIED: 4,
};

export const signInResultTexts = [
  "Login successful", // Return code 0
  "Invalid password", // Return code 1
  "No such user", // Return code 2
  "Unknown error occurred", // Return code 3
  "Email not verified", //Return code 4
];

export const hasUserResultCodes = {
  HAS_USER: 0,
  NO_SUCH_USER: 1,
  UNVERIFIED_USER: 2,
  UNKNOWN_ERROR: 3,
  ALTERNATE_SIGN_IN: 4
};

export const hasUserResultTexts = [
  "",
  "No such user",
  "Email not verified",
  "Unknown error occurred",
  "User uses 3rd party sign in method"
];

export const useAuth = () => {
  return useContext(authCtx);
};

export function AuthProvider(props) {
  const children = props.children;
  const authProvider = useAuthProvider();
  return <authCtx.Provider value={authProvider}>{children}</authCtx.Provider>;
}
