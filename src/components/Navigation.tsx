import { Link, useLocation, useNavigate } from "react-router-dom";
import { Package, ArrowLeftRight, FileBox, BarChart3, LogOut, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { usePermissions } from "@/hooks/usePermissions";
import { useToast } from "@/hooks/use-toast";

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signOut } = useAuth();
  const { isAdmin } = usePermissions();
  
  const isActive = (path: string) => location.pathname === path;
  
  const navItems = [
    { path: "/estoque", label: "Estoque TI", icon: Package },
    { path: "/movimentados", label: "Movimentados", icon: ArrowLeftRight },
    { path: "/comodato", label: "Comodato", icon: FileBox },
    { path: "/dashboard", label: "Dashboard", icon: BarChart3 },
  ];

  const handleLogout = async () => {
    const { error } = await signOut();
    if (error) {
      toast({
        title: "Erro ao sair",
        description: error.message,
        variant: "destructive",
      });
    } else {
      navigate("/");
      toast({
        title: "Logout realizado",
        description: "Você saiu do sistema com sucesso.",
      });
    }
  };

  return (
    <nav className="bg-card border-b border-border shadow-soft">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Package className="h-8 w-8 text-primary" />
              <span className="ml-2 text-xl font-semibold text-foreground">
                Controle de Estoque TI
              </span>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-4">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      isActive(item.path)
                        ? "bg-accent text-accent-foreground"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {item.label}
                  </Link>
                );
              })}
              {isAdmin && (
                <Link
                  to="/configuracoes"
                  className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive("/configuracoes")
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Configurações
                </Link>
              )}
            </div>
          </div>
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-muted-foreground hover:text-foreground"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
