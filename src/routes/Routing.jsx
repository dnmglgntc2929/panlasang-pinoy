import React from "react";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "../pages/LandingPage";
import LoginPage from "../pages/LoginPage";
import Pricing from "../pages/AboutUs";
import Product from "../pages/ContactUs";
import SignUp from "../pages/SignUp";
import ReqAut from "../utils/ReqAuth";
import { AuthProvider } from "../services/Authentication";
import Dashboard from "../model/productPages/Dashboard";
import Settings from "../model/productPages/Settings";
import Talk from "../model/productPages/Talk";

export default function Navigation() {
  return (
    <>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />

            <Route
              path="/dashboard"
              element={
                <ReqAut>
                  <Dashboard />
                </ReqAut>
              }
            />

            <Route
              path="/settings"
              element={
                <ReqAut>
                  <Settings />
                </ReqAut>
              }
            />

            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/talk"
              element={
                <ReqAut>
                  <Talk />
                </ReqAut>
              }
            />
            <Route path="/product" element={<Product />} />
            <Route index path="/pricing" element={<Pricing />} />
            <Route path="/signup" element={<SignUp />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </>
  );
}
