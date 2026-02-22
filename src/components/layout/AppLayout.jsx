import { CreditCard, FileText, LayoutDashboard, Users } from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";

export function AppLayout() {
  const navItems = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/invoices", icon: FileText, label: "Invoices" },
  { to: "/vendors", icon: Users, label: "Vendors" },
  { to: "/payments", icon: CreditCard, label: "Payment Methods" }];


  return (
    <div className="flex h-screen bg-gray-50 text-gray-900 font-sans">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
                <div className="p-6 border-b border-gray-200">
                    <h1 className="text-2xl font-bold tracking-tight text-primary-600">
                        InvoGen
                    </h1>
                </div>
                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    {navItems.map((item) =>
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium ${
            isActive ?
            "bg-primary-50 text-primary-700" :
            "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}`

            }>
            
                            <item.icon className="w-5 h-5" />
                            {item.label}
                        </NavLink>
          )}
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto flex flex-col">
                <header className="h-16 bg-white border-b border-gray-200 flex items-center px-8">
                    {/* Header area for future user profile / breadcrumbs */}
                    <div className="flex-1"></div>
                </header>
                <div className="p-8 flex-1 max-w-7xl mx-auto w-full">
                    <Outlet />
                </div>
            </main>
        </div>);

}