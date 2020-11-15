import { createContext } from "react";
import { auth, IUser } from "config/firebase";

// TODO: add other relevant user info to context type
export interface AuthContext {
  user: IUser;
}

export const UserContext = createContext<AuthContext>({
  user: null,
});

export interface UserInfo {
  email: string;
  password: string;
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
      // TODO: Add other user provided data to firestore
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
export const loginUser = async (userinfo: UserInfo): Promise<any> => {
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
