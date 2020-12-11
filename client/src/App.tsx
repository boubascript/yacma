import React, { useState, useEffect } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import "./App.css";
import ProtectedRoute from "components/ProtectedRoute";
import { auth, IUser } from "config/firebase";
import { UserContext, UserData, getUserData } from "utils/auth";
import Home from "pages/Home";
import Login from "pages/Login";
import Register from "pages/Register";
import Courses from "pages/Courses";
import Course from "pages/Course";
// import Profile from "pages/Profile";

const App: React.FunctionComponent = () => {
  const [user, setUser] = useState<IUser | null>(auth.currentUser);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loadingAuthState, setLoadingAuthState] = useState(true);

  const addCourseContext = (newCourse: string) => {
    console.log(`NEW: ${newCourse}`);
    setUserData({
      ...userData!,
      courses: [...userData!.courses, newCourse],
    });
    console.log([...userData!.courses, newCourse]);
    console.log(userData!.courses);
  };

  const deleteCourseContext = (id: string) => {
    setUserData({
      ...userData!,
      courses: userData!.courses.filter((cid) => id !== cid),
    });
  };

  useEffect(() => {
    auth.onAuthStateChanged(async (user) => {
      setUser(user);
      if (user) {
        setLoadingAuthState(true);
        const data = (await getUserData(user.uid)) as UserData;
        setUserData(data!);
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
    <div style={{backgroundColor:'#eceef8', minHeight:'100vh', justifyContent: "center", alignItems: "center", textAlign: "center",}}>
      <BrowserRouter>
        <UserContext.Provider
          value={{ user, userData, addCourseContext, deleteCourseContext }}
        >
          <Switch>
            {/* <ProtectedRoute exact path="/me" component={Profile} /> */}
            <Route path="/register" component={Register} />
            <Route path="/login" component={Login} />
            <ProtectedRoute exact path="/courses" component={Courses} />
            <Route path="/coursepage" component={Course} />
            <Route component={Home} />
          </Switch>
        </UserContext.Provider>
      </BrowserRouter>
    </div>
  );
};

export default App;
