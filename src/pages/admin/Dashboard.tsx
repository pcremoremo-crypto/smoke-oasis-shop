import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, ShoppingCart, Users, Package } from "lucide-react";

export const Dashboard = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetch('/api/dashboard')
      .then(res => res.json())
      .then(setStats);
  }, []);

  if (!stats) {
    return <div>Cargando...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Ingresos Totales"
          value={`$${stats.totalRevenue.toFixed(2)}`}
          icon={DollarSign}
        />
        <StatCard 
          title="Pedidos Totales"
          value={stats.totalOrders}
          icon={ShoppingCart}
        />
        <StatCard 
          title="Clientes Totales"
          value={stats.totalCustomers}
          icon={Users}
        />
        <StatCard 
          title="Productos Totales"
          value={stats.totalProducts}
          icon={Package}
        />
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon: Icon }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
    </CardContent>
  </Card>
);
