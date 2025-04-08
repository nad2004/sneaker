import { StrictMode } from 'react';
import VnpayReturn from './page/checkout/PaymentReturn.tsx';
import { Admin, Resource, CustomRoutes } from 'react-admin';
import authProvider from './admin/component/authProvider.tsx';
import CustomLayout from './admin/layouts/default';
import {
  ProductList,
  UnpublishProductList,
  CategoryCreate,
  CategoryEdit,
  UserList,
  Category,
  ProductEdit,
  UserEdit,
  OrderShow,
  ProductCreate,
  OrderList,
} from './admin/pages/Page';
import myDataProvider from './admin/component/customDataProvider';
import Dashboard from './admin/pages/Dashboard';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ProductListPage from './components/ProductList';
import ProductDetails from './components/ProductDetails';
import Layout from './components/Layout/Layout';
import Cart from './page/cart/Cart';
import CheckOutList from './page/checkout/CheckOutList';
import SearchResults from './page/search/SearchResults';
import SignInPage from './page/auth/SignIn.tsx';
import SignUpPage from './page/auth/SignUp.tsx';
import UserProfile from './page/user/Profile';
import { useState } from 'react';
import HomePage from './page/home/Home.tsx';
import VerifyOtp from './page/auth/VerifyOtpPage';
import Order from './page/user/Order.tsx';
import ForgotPasswordPage from './page/auth/ForgotPasswordPage.tsx';
import ResetPasswordPage from './page/auth/ResetPasswordPage.tsx';
import VerifyOtpLossPW from './page/auth/VerifyOtpLossPW.tsx';
import AdminChatPage from './page/adminchat/adminchat.tsx';
export default function App() {
  const [search, setSearch] = useState('');
  return (
    <>
      <Router>
        <Routes>
          {/* Các route frontend */}
          <Route path="/" element={<Layout search={search} setSearch={setSearch} />}>
            <Route index element={<HomePage />} />
            <Route
              path="/shop"
              element={<ProductListPage search={search} setSearch={setSearch} />}
            />
            <Route path="/product-details/:id" element={<ProductDetails />} />
            <Route path="/search-product" element={<SearchResults search={search} />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<CheckOutList />} />
            <Route path="/user-profile" element={<UserProfile />} />
            <Route path="/user-order" element={<Order />} />
            <Route path="/login" element={<SignInPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/payment-return" element={<VnpayReturn />} />
            <Route path="/admin-chat" element={<AdminChatPage />} />
          </Route>

          {/* Các route authentication */}
          <Route path="/verify-otp/:userId" element={<VerifyOtp />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/verify-otppw" element={<VerifyOtpLossPW />} />
        </Routes>
      </Router>
      <Router basename="/admin">
        <Routes>
          {/* Định tuyến vào Admin */}
          <Route
            path="/*"
            element={
              <Admin
                authProvider={authProvider}
                dashboard={Dashboard}
                loginPage={SignInPage}
                dataProvider={myDataProvider}
                layout={CustomLayout}
                // Phần này cần đồng bộ với Router basename
              >
                <CustomRoutes>
                  {/* Điều hướng chính xác đến /admin/dashboard */}
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/order/:orderId" element={<OrderShow />} />
                </CustomRoutes>

                {/* Resource tương ứng */}
                <Resource name="dashboard" options={{ label: 'Dashboard' }} />
                <Resource name="product-unpublish" list={UnpublishProductList} edit={ProductEdit} />
                <Resource
                  name="product"
                  list={ProductList}
                  create={ProductCreate}
                  edit={ProductEdit}
                />
                <Resource name="user" list={UserList} edit={UserEdit} />
                <Resource
                  name="category"
                  list={Category}
                  edit={CategoryEdit}
                  create={CategoryCreate}
                />
                <Resource name="order" list={OrderList} />
              </Admin>
            }
          />
        </Routes>
      </Router>
    </>
  );
}
