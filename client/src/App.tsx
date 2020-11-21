import React, { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import ProtectedRoute from "components/ProtectedRoute";
import Home from "pages/Home";
import Login from "pages/Login";
import Register from "pages/Register";
import Profile from "pages/Profile";
import AddCourseProf from "pages/AddCourseProf";
import AddCourseStudent from "pages/AddCourseStudent"
import { auth, IUser, db } from "config/firebase";
import { UserContext, UserData } from "utils/auth";
import { getUserData } from "utils/firestore";

const App: React.FunctionComponent = () => {
  const [user, setUser] = useState<IUser | null>(auth.currentUser);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loadingAuthState, setLoadingAuthState] = useState(true);
  const addCourseContext = (newCourse: string) => {
    const currData = userData;
    currData!.courses.push(newCourse);
    setUserData(currData);
  };

  useEffect(() => {
    auth.onAuthStateChanged(async (user) => {
      setUser(user);
      if (user) {
        setLoadingAuthState(true);
        const data = await getUserData(user.uid);
        setUserData(data! as UserData);
        setLoadingAuthState(false);
      } else {
        setLoadingAuthState(false);
      }
    });
  }, []);

  if (loadingAuthState) {
    // TODO: Replace with loading animation?
    return (
      <div>
        <h1>Loading...</h1>
      </div>
    );
  }

  return (
    <div>
      <BrowserRouter>
        <UserContext.Provider value={{ user, userData, addCourseContext }}>
          <Switch>
            <ProtectedRoute exact path="/me" component={Profile} />
            <Route path="/register" component={Register} />
            <Route path="/login" component={Login} />
            <Route path="/addCourseProf" component={AddCourseProf} />
            <Route path="/addCourseStudent" component={AddCourseStudent} />
            <Route component={Home} />
          </Switch>
        </UserContext.Provider>
      </BrowserRouter>
    </div>
  );
};

export default App;
