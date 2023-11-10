import { createRoot } from 'react-dom/client'
import ChatBox from '/components/ChatBox'
import ColleagueChat from '/pages/ColleagueChat'
import Login from '/pages/Auth/Login'
import SignUp from '/pages/Auth/SignUp'
import GetOTPForgotPassword from '/pages/Auth/GetOTPForgotPassword'
import ForgotPassword from './pages/Auth/ForgotPassword'
import VerifyForgetPassword from '/pages/Auth/VerifyForgetPassword'
import UserSetting from '/pages/UserSetting'
import Notification from './pages/Notification'
import Workspace from './pages/Workspace'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import './index.css'
import WManager from './pages/WorkspaceManager/'
import Account from './pages/UserSetting/Account'
import Profile from './pages/UserSetting/Profile'
import WSetting from './pages/WorkspaceSetting'
import Overview from './pages/WorkspaceSetting/Overview'
import MemberManage from './pages/WorkspaceSetting/MemberManage'
import InviteMember from './pages/WorkspaceSetting/InviteMember'

const router = createBrowserRouter([
   {
      path: "/",
      element: <WManager />,
   },
   {
      path: "/userSetting",
      element: <UserSetting />,
      children: [
         { index: true, element: <Account />},
         {
            path: "Profile",
            element: <Profile />
         },
      ]
   },
   {
      path: "/WorkspaceSetting",
      element: <WSetting />,
      children: [
         { index: true, element: <Overview />},
         {
            path: "Members",
            element: <MemberManage />
         },
         {
            path: "Invites",
            element: <InviteMember />
         }
      ]
   },
   {
      path: "/colleague",
      element: <ColleagueChat />
   },
   {
      path: "login",
      element: <Login />
   },
   {
      path: "signup",
      element: <SignUp />
   },
   {
      path: "get-otp-forget-password",
      element: <GetOTPForgotPassword />
   },
   {
      path: "forgot-password",
      element: <ForgotPassword />
   },
   {
      path: "verify-forget-password",
      element: <VerifyForgetPassword />
   },
   {
      path: "notification",
      element: <Notification />
   },
   {
      path: "workspace",
      element: <Workspace />
   }
])
const App = function(){
   return (
      <RouterProvider router={router} />
   )
} 
const node = document.querySelector("#root")
const root = createRoot(node)
root.render(<App />)
