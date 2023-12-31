import { Suspense, lazy } from "react";
import { Navigate, useRoutes } from "react-router-dom";

// layouts
import DashboardLayout from "../layouts/dashboard";

// config
import { DEFAULT_PATH } from "../config";
import LoadingScreen from "../components/LoadingScreen";
import AuthLayout from "../layouts/main";

const Loadable = (Component) => (props) => {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Component {...props} />
    </Suspense>
  );
};

export default function Router() {
  return useRoutes([
    {
      path:"/auth",
      element:<AuthLayout />,
      children:[
        { element: <LoginPage />, path:"login" },
        { element: <RegisterPage />, path:"register" },
        { element: <ResetPasswordPage />, path:"reset-password" },
        { element: <NewPasswordPage />, path:"new-password" },
        { element: <VerifyPage />, path:"verify" },
      ]
    },
    {
      path: "/",
      element: <DashboardLayout />,
      //It will load all data while having Dashboard component as parent
      children: [
        { element: <Navigate to={DEFAULT_PATH} replace />, index: true },
        { path: "app", element: <GeneralApp /> },
        { path: "settings", element: <Settings /> },
        { path: "group", element: <GroupPage /> },
        { path: "call", element: <CallPage /> },
        { path: "profile", element: <ProfilePage /> },
        
        { path: "404", element: <Page404 /> },
        //It's fallback in case path does not match any of the above one
        { path: "*", element: <Navigate to="/404" replace /> },
      ],
    },
    { path: "*", element: <Navigate to="/404" replace /> },
  ]);
}

const GeneralApp = Loadable(
  lazy(() => import("../pages/dashboard/GeneralApp")),
);
const LoginPage = Loadable(
  lazy(() => import("../pages/auth/Login")),
)
const VerifyPage = Loadable(
  lazy(() => import("../pages/auth/Verify")),
)
const RegisterPage = Loadable(
  lazy(() => import("../pages/auth/Register")),
)
const ResetPasswordPage = Loadable(
  lazy(() => import("../pages/auth/ResetPassword")),
)
const NewPasswordPage = Loadable(
  lazy(() => import("../pages/auth/NewPassword")),
)
const Settings = Loadable(
  lazy(() => import("../pages/dashboard/Settings")),
);
const GroupPage = Loadable(
  lazy(() => import("../pages/dashboard/Group")),
);
const CallPage = Loadable(
  lazy(() => import("../pages/dashboard/Call")),
);
const ProfilePage = Loadable(
  lazy(() => import("../pages/dashboard/Profile")),
);
const Page404 = Loadable(lazy(() => import("../pages/Page404")));
