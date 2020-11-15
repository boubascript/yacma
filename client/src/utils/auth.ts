import { createContext } from "react";
import { auth, IUser, db } from "config/firebase";
import "firebase/firestore";

// TODO: add other relevant user info to context type
export interface AuthContext {
  user: IUser;
}

export const UserContext = createContext<AuthContext>({
  user: null,
});

export interface UserAuthInfo {
  email: string;
  password: string;
}

export interface UserInfo extends UserAuthInfo {
  firstName: string;
  lastName: string;
  isAdmin: number;
}

/**
 * @desc Register user
 * @return
 * @param {*} user
 */
export const registerUser = async (userinfo: UserInfo): Promise<any> => {
  return auth
    .createUserWithEmailAndPassword(userinfo.email, userinfo.password)
    .then((user) => {
      console.log("id" + auth.currentUser!.uid);
      db.collection("users").doc(auth.currentUser!.uid).set({
        email: userinfo.email,
        firstName: userinfo.firstName,
        lastName: userinfo.lastName,
        isAdmin: Boolean(userinfo.isAdmin), //convert to bool
      });
      return { user: user };
    })
    .catch((err) => {
      return { error: err };
    });
};

/**
 * @desc Login user
 * @return
 * @param {*} user
 */
export const loginUser = async (userinfo: UserAuthInfo): Promise<any> => {
  return auth
    .signInWithEmailAndPassword(userinfo.email, userinfo.password)
    .then((user) => {
      return { user: user };
    })
    .catch((err) => {
      return { error: err };
    });
};

/**
 * @desc Logout user
 * @return
 * @param {*} user
 */
export const logoutUser = async (): Promise<any> => {
  return auth
    .signOut()
    .then(() => {
      return { success: true };
    })
    .catch((err) => {
      return { error: err };
    });
};
