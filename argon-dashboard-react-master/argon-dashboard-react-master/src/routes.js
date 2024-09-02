import Index from "views/Index.js";
import Login from "views/examples/Login.js";
import RoleManagement from "views/examples/RoleManagement.js";
import UserManagement from "views/examples/UserManagement";
import EmployeeList from "views/examples/EmployeeList";
import AttendanceList from "views/examples/AttendanceList";
import AttendanceTable from "views/examples/AttendanceTable";

const userRole = localStorage.getItem("role"); // Get role from localStorage
console.log('User Role:', userRole); // Log the user role to debug

const routes = [
 /* {
    path: "/index",
    name: "Dashboard",
    icon: "ni ni-ui-04 text-black",
    component: <Index />,
    layout: "/admin",
  },*/
  (userRole === "Admin" || userRole === "RH") && {
    path: "/attendances",
    name: "Productions",
    icon: "ni ni-calendar-grid-58 text-purple",
    component: <AttendanceList />,
    layout: "/admin",
  },
  (userRole === "Admin" || userRole === "RH") && {
    path: "/productionreport",
    name: "ProductionReport",
    icon: "ni ni-calendar-grid-58 text-orange",
    component: <AttendanceTable />,
    layout: "/admin",
  },
  userRole === "Admin" && {
    path: "/roles",
    name: "Roles",
    icon: "ni ni-book-bookmark text-blue",
    component: <RoleManagement />,
    layout: "/admin",
  },
  userRole === "Admin" && {
    path: "/users",
    name: "Users",
    icon: "ni ni-single-02 text-green",
    component: <UserManagement />,
    layout: "/admin",
  },
  (userRole === "Admin" || userRole === "RH") && {
    path: "/employees",
    name: "Agents",
    icon: "ni ni-badge text-red",
    component: <EmployeeList />,
    layout: "/admin",
  },


  {
    path: "/login",
    component: <Login />,
    layout: "/auth",
  },
].filter(Boolean); // Remove falsy values (e.g., `false` or `null`)

export default routes;
