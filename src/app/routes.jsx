import { createBrowserRouter } from "react-router-dom";
import { AppLayout } from "../components/layout/AppLayout";
import { InvoicesList } from "../modules/invoices/components/InvoicesList";
import { PaymentsList } from "../modules/payments/components/PaymentsList";
import { VendorsList } from "../modules/vendors/components/VendorsList";
import { LoginPage } from "../modules/auth/pages/LoginPage";
import { SignupPage } from "../modules/auth/pages/SignupPage";
import { Dashboard } from "./pages/Dashboard";
import { NotFound } from "./pages/NotFound";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/signup",
    element: <SignupPage />,
  },
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "invoices",
        element: <InvoicesList />,
      },
      {
        path: "vendors",
        element: <VendorsList />,
      },
      {
        path: "payments",
        element: <PaymentsList />,
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);