import {
  Sidebar, 
  SidebarContent, 
  SidebarHeader, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton, 
  SidebarFooter 
} from "@/components/ui/sidebar";
import { mockCollections } from "@/lib/mock-data";
import { Home, ShoppingBag, Tag } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export const AppSidebar = () => {
  const location = useLocation();

  return (
    <Sidebar>
      <SidebarHeader>
        <Link to="/" className="flex items-center gap-2 group">
          <ShoppingBag className="h-6 w-6 text-primary transition-transform group-hover:scale-110" />
          <span className="text-2xl font-bold bg-gradient-accent bg-clip-text text-transparent">
            Smoke Oasis
          </span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <Link to="/">
              <SidebarMenuButton isActive={location.pathname === '/'}>
                <Home className="h-4 w-4" />
                Inicio
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <Link to="/productos">
              <SidebarMenuButton isActive={location.pathname === '/productos'}>
                <ShoppingBag className="h-4 w-4" />
                Productos
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
          
          {mockCollections.map(collection => (
            <SidebarMenuItem key={collection.node.id}>
              <Link to={`/productos#${collection.node.handle}`}>
                <SidebarMenuButton>
                  <Tag className="h-4 w-4" />
                  {collection.node.title}
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        {/* Puedes agregar aquí información del usuario o un botón de logout */}
      </SidebarFooter>
    </Sidebar>
  );
}
