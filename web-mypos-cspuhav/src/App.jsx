import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./page/home/HomePage";
import LoginPage from "./page/auth/LoginPage";
import RegisterPage from "./page/auth/RegisterPage";
import "./App.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

//  import Mainlayout from "./component/layout/Mainlayout";
import MainLayoutAuth from "./component/layout/MainLayoutAuth";
import CategoryPage from "./page/category/CategoryPage";
import EmployeePage from "./page/employee/EmployeePage";
import CustomerPage from "./page/customer/CustomerPage";
import MainLayout from "./component/layout/MainLayout";
import UserPage from "./page/user/UserPage";
import RolePage from "./page/role/RolePage";
import SupplierPage from "./page/supplier/SupplierPage";
import ProductPage from "./page/product/ProductPage";
import ExpensePage from "./page/expense/ExpensePage";
import ExpenseTypePage from "./page/expense_type/ExpenseTypePage";
import PurchasePage from "./page/purchase/PurchasePage";
import PurchaseProductPage from "./page/purchase_product/PurchaseProductPage";
import PosPage from "./page/pos/PosPage";
import OrderPage from "./page/order/OrderPage";
import PdfViewerComponent from "./page/pdf/PdfViewerComponent";
import SaleSummaryPage from "./page/report/SaleSummaryPage";
import ExpenseSummaryPage from "./page/report/ExpenseSummaryPage";
import CustomerSummaryPage from "./page/report/CustomerSummaryPage";
import TopSaleSummaryPage from "./page/report/TopSaleSummaryPage";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/employee" element={<EmployeePage />} />
          <Route path="/category" element={<CategoryPage />} />
          <Route path="/customer" element={<CustomerPage />} />
          <Route path="/supplier" element={<SupplierPage />} />
          <Route path="/user" element={<UserPage />} />
          <Route path="/role" element={<RolePage />} />
          <Route path="/product" element={<ProductPage />} />
          <Route path="/expanse" element={<ExpensePage />} />
          <Route path="/expanse_type" element={<ExpenseTypePage />} />
          <Route path="/purchase" element={<PurchasePage />} />
          <Route path="/purchase_product" element={<PurchaseProductPage />} />
          <Route path="/pos" element={<PosPage />} />
          <Route path="/order" element={<OrderPage />} />
          <Route path="/view-pdf" element={<PdfViewerComponent />} />
          <Route path="/report_sale_summary" element={<SaleSummaryPage />} />
          <Route
            path="/report_expense_summary"
            element={<ExpenseSummaryPage />}
          />
          <Route path="/new_customer" element={<CustomerSummaryPage />} />
          <Route path="/top_sale" element={<TopSaleSummaryPage />} />
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
