import {
  auth,
  IUser,
  db,
  UserCredential,
  AuthError,
  FieldValue,
} from "config/firebase";
import { UserContext, UserData } from "utils/auth";

export interface CourseData {
  id?: string;
  code: string;
  name: string;
  description: string;
  educator: string;
}
