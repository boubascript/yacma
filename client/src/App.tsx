import React, { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import ProtectedRoute from "components/ProtectedRoute";
import Home from "pages/Home";
import Login from "pages/Login";
import Register from "pages/Register";
import Profile from "pages/Profile";
import Courses from "pages/Courses";
import AddCourseProf from "pages/AddCourseProf";
import AddCourseStudent from "pages/AddCourseStudent";
import { auth, IUser } from "config/firebase";
import { UserContext, UserData, getUserData } from "utils/auth";
import NewPost from "pages/NewPost";
import NewComment from "pages/NewComment";
import Course from "pages/Course";

const App: React.FunctionComponent = () => {
  const [user, setUser] = useState<IUser | null>(auth.currentUser);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loadingAuthState, setLoadingAuthState] = useState(true);

  const addCourseContext = async (newCourse: string) => {

    await setUserData({ ...userData!, courses: [...userData!.courses, newCourse] });
    console.log("updated courses in context");
    console.log(userData!.courses);
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
    <div>
      <BrowserRouter>
        <UserContext.Provider value={{ user, userData, addCourseContext }}>
          <Switch>
            <ProtectedRoute exact path="/me" component={Profile} />
            <ProtectedRoute exact path="/courses" component={Courses} />
            <Route path="/register" component={Register} />
            <Route path="/login" component={Login} />
            <Route path="/addCourseProf" component={AddCourseProf} />
            <Route path="/addCourseStudent" component={AddCourseStudent} />
            <Route path="/addPost" component={NewPost} />
            <Route path="/addComment" component={NewComment} />
            <Route path="/coursepage" component={Course} />
            <Route component={Home} />
          </Switch>
        </UserContext.Provider>
      </BrowserRouter>
    </div>
  );
};

export default App;
