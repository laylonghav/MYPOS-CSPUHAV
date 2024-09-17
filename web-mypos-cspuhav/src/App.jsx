import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./page/home/HomePage";
import LoginPage from "./page/auth/LoginPage";
import RegisterPage from "./page/auth/RegisterPage";
import "./App.css";

//  import Mainlayout from "./component/layout/Mainlayout";
import MainLayoutAuth from "./component/layout/MainLayoutAuth";
import CategoryPage from "./page/category/CategoryPage";
import EmployeePage from "./page/employee/EmployeePage";
import CustomerPage from "./page/customer/CustomerPage";
import MainLayout from "./component/layout/MainLayout";
import UserPage from "./page/user/UserPage";
import RolePage from "./page/role/RolePage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/employee" element={<EmployeePage />} />
          <Route path="/category" element={<CategoryPage />} />
          <Route path="/customer" element={<CustomerPage />} />
          {/* <Route path="/category" element={<CategoryPage />} /> */}
          <Route path="/user" element={<UserPage />} />
          <Route path="/role" element={<RolePage />} />
          <Route path="*" element={<h1>404 - Route Not Found</h1>} />
        </Route>

        <Route element={<MainLayoutAuth />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="*" element={<h1>404 - Route Not Found</h1>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
