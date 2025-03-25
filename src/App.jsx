import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";

const Product = lazy(() => import("./pages/Product"));
const Pricing = lazy(() => import("./pages/Pricing"));
const Homepage = lazy(() => import("./pages/Homepage"));
const PageNotFound = lazy(() => import("./pages/PageNotFound"));
const AppLayout = lazy(() => import("./pages/AppLayout"));
const Login = lazy(() => import("./pages/Login"));
const CityList = lazy(() => import("./components/CityList"));
const CountryList = lazy(() => import("./components/CountryList"));
const City = lazy(() => import("./components/City"));
const Form = lazy(() => import("./components/Form"));
const ProtectedRoute = lazy(() => import("./pages/ProtectedRoute"));

import { CitiesProvider } from "./context/CitiesContext";
import { AuthProvider } from "./context/AuthContext";
import Spinner from "./components/Spinner";

function App() {
  return (
    <AuthProvider>
      <CitiesProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={
              <Suspense fallback={<Spinner />}>
                <Homepage />
              </Suspense>
            } />
            <Route path="app" element={
              <Suspense fallback={<Spinner />}>
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              </Suspense>
            }>
              <Route index element={<Navigate replace to="cities" />} />
              <Route path="cities" element={
                <Suspense fallback={<Spinner />}>
                  <CityList />
                </Suspense>
              } />
              <Route path="cities/:id" element={
                <Suspense fallback={<Spinner />}>
                  <City />
                </Suspense>
              } />
              <Route path="countries" element={
                <Suspense fallback={<Spinner />}>
                  <CountryList />
                </Suspense>
              } />
              <Route path="form" element={
                <Suspense fallback={<Spinner />}>
                  <Form />
                </Suspense>
              } />
            </Route>
            <Route path="product" element={
              <Suspense fallback={<Spinner />}>
                <Product />
              </Suspense>
            } />
            <Route path="login" element={
              <Suspense fallback={<Spinner />}>
                <Login />
              </Suspense>
            } />
            <Route path="pricing" element={
              <Suspense fallback={<Spinner />}>
                <Pricing />
              </Suspense>
            } />
            <Route path="*" element={
              <Suspense fallback={<Spinner />}>
                <PageNotFound />
              </Suspense>
            } />
          </Routes>
        </BrowserRouter>
      </CitiesProvider>
    </AuthProvider>
  );
}

export default App;
