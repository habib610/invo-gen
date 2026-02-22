import { createBrowserRouter, Navigate } from "react-router-dom";
import { AppLayout } from "../components/layout/AppLayout";
import { InvoicesList } from "../modules/invoices/components/InvoicesList";
import { PaymentsList } from "../modules/payments/components/PaymentsList";
import { VendorsList } from "../modules/vendors/components/VendorsList";
import { Dashboard } from "./pages/Dashboard";

export const router = createBrowserRouter([
{
  path: "/",
  element: <AppLayout />,
  children: [
  {
    index: true,
    element: <Dashboard />
  },
  {
    path: "invoices",
    element: <InvoicesList />
  },
  {
    path: "vendors",
    element: <VendorsList />
  },
  {
    path: "payments",
    element: <PaymentsList />
  },
  {
    path: "*",
    element: <Navigate to="/" replace />
  }]

}]
);