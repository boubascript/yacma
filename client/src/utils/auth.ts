import { createContext } from "react";
import { auth, IUser, db, UserCredential, AuthError } from "config/firebase";
import "firebase/firestore";

export interface AuthContext {
  user: IUser | null;
  userData: UserData | null;
  addCourseContext: (newCourse: string) => void;
}

export const UserContext = createContext<AuthContext>({
  user: null,
  userData: null,
  addCourseContext: () => {},
});

interface AuthResult {
  user?: IUser;
  error?: AuthError;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface UserData {
  email: string;
  firstName: string;
  lastName: string;
  isAdmin: boolean;
  courses: string[];
}

export interface RegisterData extends UserData {
  password: string;
}

/**
 * @desc Register user
 * @return
 * @param {*} user
 */
export const registerUser = async (
  userinfo: RegisterData
): Promise<AuthResult> => {
  return auth
    .createUserWithEmailAndPassword(userinfo.email, userinfo.password)
    .then(({ user }: UserCredential) => {
      const { password, ...newUserInfo } = userinfo; // submit data without passwords
      db.collection("users")
        .doc(user!.uid)
        .set(newUserInfo as UserData);
      return { user: user! };
    })
    .catch((err: AuthError) => {
      return { error: err };
    });
};

/**
 * @desc Login user
 * @return
 * @param {*} user
 */
export const loginUser = async ({
  email,
  password,
}: LoginData): Promise<AuthResult> => {
  return auth
    .signInWithEmailAndPassword(email, password)
    .then(({ user }: UserCredential) => {
      return { user: user! };
    })
    .catch((err: AuthError) => {
      return { error: err };
    });
};

/**
 * @desc Logout user
 * @return error object or nothing
 * @param {*} user
 */
export const logoutUser = async (): Promise<AuthError | void> => {
  return auth.signOut().catch((err: AuthError) => {
    return err;
  });
};
