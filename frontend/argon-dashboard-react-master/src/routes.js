/*!

=========================================================
* Argon Dashboard React - v1.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import Dashboard from "views/Dashboard.js";
import Login from "views/Login.js";
import Users from "views/Users.js";
import History from "views/History.js";

var routes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: "ni ni-circle-08 text-yellow",
    component: Dashboard,
    layout: "/user",
    role: ['admin', 'user']
  },
  {
    path: "/login",
    name: "Login",
    icon: "ni ni-key-25 text-info",
    component: Login,
    layout: "/auth",
    role: []
  },
  {
    path: "/users",
    name: "Users",
    icon: "ni ni-single-02 text-primary",
    component: Users,
    layout: "/user",
    role: ['admin']
  },
  {
    path: "/history",
    name: "history",
    icon: "ni ni-single-02 text-primary",
    component: History,
    layout: "/user",
    role: ['admin']
  }
];
export default routes;
