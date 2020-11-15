import React, { useContext } from "react";
import { Route, Redirect, RouteProps } from "react-router-dom";
import { UserContext } from "utils/auth";

/**
 * ProtectedRoute
 * Takes an object containing:
 *    The component that needs to be protected
 *    All props, such as the other reducers from the store
 * Returns a Route that:
 *    Contains all props
 *    Renders an object that:
 *      Takes the props
 *      Checks if the user is authenticated or has the required auth access if specified
 *        And if so, renders the component, passing along all props
 *        Otherwise, does not render the component and redirects to "/login"
 *        (or specified redirect)
 */

interface ProtectedRouteProps extends RouteProps {
  requiredAuthRole?: string;
  redirect?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  requiredAuthRole,
  redirect,
  ...props
}) => {
  const { user } = useContext(UserContext);

  //TODO: Add condition for whether user has required access level
  if (!user) {
    const renderComponent = () => (
      <Redirect
        to={{
          pathname: redirect ? redirect : "/",
          state: { from: props.location },
        }}
      />
    );
    return <Route {...props} component={renderComponent} render={undefined} />;
  }

  return <Route {...props} />;
};

export default ProtectedRoute;
