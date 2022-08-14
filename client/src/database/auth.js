import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { createContext, useContext, useState } from "react";
import { auth } from "./setup";
import { BACKEND_URL } from "./const";
import jwt from "jsonwebtoken";
import { JWT_EXPIRES_IN, JWT_SECRET } from "../utils/jwt-config";

const authCtx = createContext({
  hasUser: null,
  signInWithGoogle: null,
  signInUserPass: null,
  signUpUser: null,
  signOut: null,
  user: null,
  setUser: null,
  isUserLoaded: false,
  setIsUserLoaded: null,
  isGoogleSignIn: false
});

function useAuthProvider() {
  const [user, setUser] = useState(null);
  const [isUserLoaded, setIsUserLoaded] = useState(false);
  const [isGoogleSignIn, setIsGoogleSignIn] = useState(false);
  const googleAuthProvider = new GoogleAuthProvider();

  const signInWithGoogle = () => {
    if (auth) {
      return signInWithPopup(auth, googleAuthProvider).then(async (result) => {
        const token = jwt.sign(
          {},
          JWT_SECRET,
          {expiresIn: JWT_EXPIRES_IN}
        );
        fetch(`${BACKEND_URL}/api/user/postAltLogin`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": token
          },
          body: JSON.stringify({
            name: result.user.displayName,
            age: "-1",
            email: result.user.email,
            photoURL: result.user.photoURL
          }),
        })
        .then(req => {
          req.json().then(data => {
            if (req.status === 200) {
              try {
                let user = {...data.user};
                const token = user.token;
                if (!token) {
                  console.log("Google sign in security error: Missing JWT token from server response");
                } else {
                  const jwtResult = jwt.verify(token, JWT_SECRET);
                  user.id = jwtResult.id;
                  user.photoURL = result.user.photoURL;
                  delete user.token;
                  setUser(user);
                  localStorage.setItem('user', JSON.stringify(user));
                }
              } catch (error) {
                console.log(error);
              }
            } else {
              console.log(data.error);
            }
          });
        });
        setIsGoogleSignIn(true);
      });
    }
    console.log("Error performing Google account sign in: Invalid Firebase Authenticator object");
  };

  const signOut = () => {
    if (isGoogleSignIn) {
      if (auth) {
        return auth.signOut().then(() => {
          setUser(null);
          localStorage.setItem("user", "");
        });
      }
      console.log("Error performing Google account sign out: Invalid Firebase Authenticator object");
      return;
    }
    setUser(null);
    localStorage.setItem("user", "");
  };

  const signInUserPass = async (givenEmail, givenPassword) => {
    const token = jwt.sign(
      {},
      JWT_SECRET,
      {expiresIn: JWT_EXPIRES_IN}
    );
    const res = await fetch(`${BACKEND_URL}/api/user/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": token
      },
      body: JSON.stringify({
        email: givenEmail,
        password: givenPassword,
      }),
    });
    const data = await res.json();
    if (res.status === 200) {
      const token = data.user.token;
      if (!token) {
        return signInResultCodes.INVALID_JWT;
      }
      try {
        const jwtResult = jwt.verify(token, JWT_SECRET);
        let thisUser = {...data.user, id: jwtResult.id};
        delete thisUser.token;
        setUser(thisUser);
        setIsGoogleSignIn(false);
        localStorage.setItem("user", JSON.stringify(thisUser));
        return signInResultCodes.SUCCESS;
      } catch (error) {
        console.log(error);
        return signInResultCodes.INVALID_JWT;
      }
    }
    return data.errorCode;
  };

  const signUpUser = async (givenName, givenAge, givenEmail, givenPassword) => {
    const userStatus = await hasUser(givenEmail);
    if (userStatus === hasUserResultCodes.NO_SUCH_USER) {
      const token = jwt.sign(
        {},
        JWT_SECRET,
        {expiresIn: JWT_EXPIRES_IN}
      );
      const req = await fetch(`${BACKEND_URL}/api/user/signUp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token
        },
        body: JSON.stringify({
          name: givenName,
          age: givenAge,
          email: givenEmail,
          password: givenPassword,
        }),
      });
      const data = await req.json();
      if (req.status === 200) {
        const token = data.token;
        if (!token) {
          console.log("LoaNUS sign up security issue: Missing JWT token in backend response");
          return false;
        }
        try {
          const jwtResult = jwt.verify(token, JWT_SECRET);
          if (jwtResult.id) {
            return true;
          }
          console.log("LoaNUS sign up security issue: Invalid Jwt token in backend response");
          return false;
        } catch (error) {
          console.log(error);
          return false;
        }
      }
      console.log(data.error);
      return false;
    }
    return false;
  };

  const hasUser = async (givenEmail) => {
    const token = jwt.sign(
      {},
      JWT_SECRET,
      {expiresIn: JWT_EXPIRES_IN}
    );
    const req = await fetch(`${BACKEND_URL}/api/user/hasUser`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": token
      },
      body: JSON.stringify({
        email: givenEmail,
      }),
    });

    const data = await req.json();
    if (req.status === 200) {
      if (data.hasUser) {
        if (data.isVerified) {
          return hasUserResultCodes.HAS_USER;
        }
        return hasUserResultCodes.UNVERIFIED_USER;
      }
      return hasUserResultCodes.NO_SUCH_USER;
    }
    if (req.status === 400) {
      if (data.errorCode === hasUserResultCodes.ALTERNATE_SIGN_IN) {
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
    isUserLoaded,
    setIsUserLoaded,
    isGoogleSignIn
  };
}

export const signInResultCodes = {
  SUCCESS: 0,
  INVALID_PASSWORD: 1,
  NO_SUCH_USER: 2,
  UNKNOWN: 3,
  EMAIL_NOT_VERIFIED: 4,
  ALTERNATE_SIGN_IN: 5,
  INVALID_JWT: 6,
  SERVER_ERROR: 7
};

export const signInResultTexts = [
  "Login successful", // Return code 0
  "Invalid password", // Return code 1
  "No such user", // Return code 2
  "Unknown error occurred", // Return code 3
  "Email not verified", //Return code 4
  "Sign in with Google instead?", //Return code 5
  "Server error, please try again", //Return code 6
  "Server error, please contact an admin" //Return code 7
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
