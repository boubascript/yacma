import React, { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import ProtectedRoute from "components/ProtectedRoute";
import Home from "pages/Home";
import Login from "pages/Login";
import Register from "pages/Register";
import Profile from "pages/Profile";
import { auth, IUser, db } from "config/firebase";
import { UserContext, UserInfo } from "utils/auth";

const App: React.FunctionComponent = () => {
  const [user, setUser] = useState<IUser>(auth.currentUser);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loadingAuthState, setLoadingAuthState] = useState(true);

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoadingAuthState(false);
      if (user) {
        db.collection("users")
          .where("email", "==", auth.currentUser!.email)
          .get()
          .then((querySnapshot) => {
            const docData = querySnapshot.docs[0].data();
            let data: UserInfo = {
              email: docData.email,
              firstName: docData.firstName,
              lastName: docData.lastName,
              isAdmin: docData.isAdmin,
            };
            setUserInfo(data);
          });
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
        <UserContext.Provider value={{ user, userInfo }}>
          <Switch>
            <ProtectedRoute exact path="/me" component={Profile} />
            <Route path="/register" component={Register} />
            <Route path="/login" component={Login} />
            <Route component={Home} />
          </Switch>
        </UserContext.Provider>
      </BrowserRouter>
    </div>
  );
};

export default App;
