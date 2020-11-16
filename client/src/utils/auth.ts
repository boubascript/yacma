import { createContext } from "react";
import { auth, IUser, db } from "config/firebase";
import "firebase/firestore";

// TODO: add other relevant user info to context type
export interface AuthContext {
  user: IUser;
  userInfo: UserInfo | null;
}

export const UserContext = createContext<AuthContext>({
  user: null,
  userInfo: null,
});

export interface UserAuthInfo {
  email: string;
  password: string;
}

export interface UserInfo {
  email: string;
  password?: string; //used only for auth, not passed in other queries
  firstName: string;
  lastName: string;
  isAdmin: boolean;
}

/**
 * @desc Register user
 * @return
 * @param {*} user
 */
export const registerUser = async (userinfo: UserInfo): Promise<any> => {
  return auth
    .createUserWithEmailAndPassword(userinfo.email, userinfo.password!) //password will definitely be passed in registration
    .then((usercred) => {
      db.collection("users")
        .doc(usercred.user!.uid)
        .set({
          email: userinfo.email,
          firstName: userinfo.firstName,
          lastName: userinfo.lastName,
          isAdmin: userinfo.isAdmin, //convert to bool
        });
      return { user: userinfo };
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
