import { NavLink, Outlet } from "react-router-dom";
import { Home, ShoppingCart, Package, Users } from "lucide-react";

const navItems = [
  { to: "/admin/dashboard", icon: Home, label: "Dashboard" },
  { to: "/admin/products", icon: Package, label: "Productos" },
  { to: "/admin/orders", icon: ShoppingCart, label: "Pedidos" },
  { to: "/admin/customers", icon: Users, label: "Clientes" },
];

export const AdminLayout = () => {
  return (
    <div className="flex min-h-screen bg-muted/40">
      <aside className="w-64 flex-shrink-0 border-r bg-background">
        <div className="p-4">
          <h2 className="text-2xl font-bold">Admin Panel</h2>
        </div>
        <nav className="flex flex-col p-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${
                  isActive ? "bg-muted text-primary" : "text-muted-foreground"
                }`
              }
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <div className="flex-1 p-8">
        <Outlet />
      </div>
    </div>
  );
};
