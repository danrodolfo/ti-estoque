import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { usePermissions } from "@/hooks/usePermissions";
import { supabase } from "@/integrations/supabase/client";
import { Trash2, UserPlus, Shield } from "lucide-react";

interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  role?: string;
}

interface UserPermission {
  user_id: string;
  can_view_estoque: boolean;
  can_add_estoque: boolean;
  can_edit_estoque: boolean;
  can_delete_estoque: boolean;
  can_view_movimentados: boolean;
  can_add_movimentados: boolean;
  can_edit_movimentados: boolean;
  can_delete_movimentados: boolean;
  can_view_comodato: boolean;
  can_add_comodato: boolean;
  can_edit_comodato: boolean;
  can_delete_comodato: boolean;
  can_view_dashboard: boolean;
}

const Configuracoes = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { isAdmin, loading: permLoading } = usePermissions();
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserPassword, setNewUserPassword] = useState("");
  const [newUserName, setNewUserName] = useState("");
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [userPermissions, setUserPermissions] = useState<UserPermission | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [permDialogOpen, setPermDialogOpen] = useState(false);

  useEffect(() => {
    if (!permLoading && !isAdmin) {
      navigate("/estoque");
      toast({
        title: "Acesso negado",
        description: "Apenas administradores podem acessar esta página.",
        variant: "destructive",
      });
    }
  }, [isAdmin, permLoading, navigate, toast]);

  useEffect(() => {
    if (user && isAdmin) {
      fetchUsers();
    }
  }, [user, isAdmin]);

  const fetchUsers = async () => {
    setLoading(true);
    
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select(`
        id,
        email,
        full_name,
        user_roles (role)
      `)
      .order('email');

    if (error) {
      toast({
        title: "Erro ao carregar usuários",
        description: error.message,
        variant: "destructive",
      });
    } else {
      const usersWithRoles = profiles?.map(profile => ({
        ...profile,
        role: (profile as any).user_roles?.[0]?.role || 'user'
      })) || [];
      setUsers(usersWithRoles);
    }
    
    setLoading(false);
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Criar função edge para criar usuários
    toast({
      title: "Funcionalidade em desenvolvimento",
      description: "A criação de usuários será implementada em breve.",
    });
    
    setDialogOpen(false);
    setNewUserEmail("");
    setNewUserPassword("");
    setNewUserName("");
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Tem certeza que deseja remover este usuário?")) return;

    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', userId);

    if (error) {
      toast({
        title: "Erro ao remover usuário",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Usuário removido",
        description: "O usuário foi removido com sucesso.",
      });
      fetchUsers();
    }
  };

  const handleToggleRole = async (userId: string, currentRole: string) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    
    if (newRole === 'admin') {
      // Add admin role
      const { error } = await supabase
        .from('user_roles')
        .insert({ user_id: userId, role: 'admin' });
      
      if (error) {
        toast({
          title: "Erro ao alterar role",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Role alterada",
          description: "Usuário agora é administrador.",
        });
        fetchUsers();
      }
    } else {
      // Remove admin role
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId)
        .eq('role', 'admin');
      
      if (error) {
        toast({
          title: "Erro ao alterar role",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Role alterada",
          description: "Usuário agora é usuário comum.",
        });
        fetchUsers();
      }
    }
  };

  const handleOpenPermissions = async (userId: string) => {
    setSelectedUser(userId);
    
    const { data, error } = await supabase
      .from('user_permissions')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      toast({
        title: "Erro ao carregar permissões",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setUserPermissions(data || {
        user_id: userId,
        can_view_estoque: true,
        can_add_estoque: false,
        can_edit_estoque: false,
        can_delete_estoque: false,
        can_view_movimentados: true,
        can_add_movimentados: false,
        can_edit_movimentados: false,
        can_delete_movimentados: false,
        can_view_comodato: true,
        can_add_comodato: false,
        can_edit_comodato: false,
        can_delete_comodato: false,
        can_view_dashboard: true,
      });
      setPermDialogOpen(true);
    }
  };

  const handleUpdatePermissions = async () => {
    if (!selectedUser || !userPermissions) return;

    const { error } = await supabase
      .from('user_permissions')
      .upsert({
        user_id: selectedUser,
        ...userPermissions
      });

    if (error) {
      toast({
        title: "Erro ao atualizar permissões",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Permissões atualizadas",
        description: "As permissões foram atualizadas com sucesso.",
      });
      setPermDialogOpen(false);
    }
  };

  const updatePermission = (key: keyof UserPermission, value: boolean) => {
    if (!userPermissions) return;
    setUserPermissions({
      ...userPermissions,
      [key]: value
    });
  };

  if (permLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-subtle">
        <Navigation />
        <main className="container mx-auto px-4 py-8">
          <p className="text-center text-muted-foreground">Carregando...</p>
        </main>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Configurações</h1>
            <p className="text-muted-foreground">Gerencie usuários e permissões do sistema</p>
          </div>
          
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="h-4 w-4 mr-2" />
                Novo Usuário
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Criar Novo Usuário</DialogTitle>
                <DialogDescription>
                  Adicione um novo usuário ao sistema
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateUser} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome Completo</Label>
                  <Input
                    id="name"
                    value={newUserName}
                    onChange={(e) => setNewUserName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newUserEmail}
                    onChange={(e) => setNewUserEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Senha</Label>
                  <Input
                    id="password"
                    type="password"
                    value={newUserPassword}
                    onChange={(e) => setNewUserPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                </div>
                <Button type="submit" className="w-full">
                  Criar Usuário
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Usuários do Sistema</CardTitle>
            <CardDescription>
              Gerencie os usuários e suas permissões
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>E-mail</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((userItem) => (
                  <TableRow key={userItem.id}>
                    <TableCell className="font-medium">
                      {userItem.full_name || "Sem nome"}
                    </TableCell>
                    <TableCell>{userItem.email}</TableCell>
                    <TableCell>
                      <Badge variant={userItem.role === 'admin' ? 'default' : 'secondary'}>
                        {userItem.role === 'admin' ? 'Administrador' : 'Usuário'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleRole(userItem.id, userItem.role || 'user')}
                        disabled={userItem.id === user?.id}
                      >
                        <Shield className="h-4 w-4 mr-2" />
                        {userItem.role === 'admin' ? 'Remover Admin' : 'Tornar Admin'}
                      </Button>
                      {userItem.role !== 'admin' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenPermissions(userItem.id)}
                        >
                          Permissões
                        </Button>
                      )}
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteUser(userItem.id)}
                        disabled={userItem.id === user?.id}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Dialog open={permDialogOpen} onOpenChange={setPermDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Gerenciar Permissões</DialogTitle>
              <DialogDescription>
                Configure as permissões do usuário para cada módulo
              </DialogDescription>
            </DialogHeader>
            {userPermissions && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Estoque TI</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="view-estoque">Visualizar</Label>
                      <Switch
                        id="view-estoque"
                        checked={userPermissions.can_view_estoque}
                        onCheckedChange={(checked) => updatePermission('can_view_estoque', checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="add-estoque">Adicionar</Label>
                      <Switch
                        id="add-estoque"
                        checked={userPermissions.can_add_estoque}
                        onCheckedChange={(checked) => updatePermission('can_add_estoque', checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="edit-estoque">Editar</Label>
                      <Switch
                        id="edit-estoque"
                        checked={userPermissions.can_edit_estoque}
                        onCheckedChange={(checked) => updatePermission('can_edit_estoque', checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="delete-estoque">Excluir</Label>
                      <Switch
                        id="delete-estoque"
                        checked={userPermissions.can_delete_estoque}
                        onCheckedChange={(checked) => updatePermission('can_delete_estoque', checked)}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Movimentados</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="view-mov">Visualizar</Label>
                      <Switch
                        id="view-mov"
                        checked={userPermissions.can_view_movimentados}
                        onCheckedChange={(checked) => updatePermission('can_view_movimentados', checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="add-mov">Adicionar</Label>
                      <Switch
                        id="add-mov"
                        checked={userPermissions.can_add_movimentados}
                        onCheckedChange={(checked) => updatePermission('can_add_movimentados', checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="edit-mov">Editar</Label>
                      <Switch
                        id="edit-mov"
                        checked={userPermissions.can_edit_movimentados}
                        onCheckedChange={(checked) => updatePermission('can_edit_movimentados', checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="delete-mov">Excluir</Label>
                      <Switch
                        id="delete-mov"
                        checked={userPermissions.can_delete_movimentados}
                        onCheckedChange={(checked) => updatePermission('can_delete_movimentados', checked)}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Comodato</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="view-com">Visualizar</Label>
                      <Switch
                        id="view-com"
                        checked={userPermissions.can_view_comodato}
                        onCheckedChange={(checked) => updatePermission('can_view_comodato', checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="add-com">Adicionar</Label>
                      <Switch
                        id="add-com"
                        checked={userPermissions.can_add_comodato}
                        onCheckedChange={(checked) => updatePermission('can_add_comodato', checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="edit-com">Editar</Label>
                      <Switch
                        id="edit-com"
                        checked={userPermissions.can_edit_comodato}
                        onCheckedChange={(checked) => updatePermission('can_edit_comodato', checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="delete-com">Excluir</Label>
                      <Switch
                        id="delete-com"
                        checked={userPermissions.can_delete_comodato}
                        onCheckedChange={(checked) => updatePermission('can_delete_comodato', checked)}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Dashboard</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="view-dash">Visualizar</Label>
                      <Switch
                        id="view-dash"
                        checked={userPermissions.can_view_dashboard}
                        onCheckedChange={(checked) => updatePermission('can_view_dashboard', checked)}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Button onClick={handleUpdatePermissions} className="w-full">
                  Salvar Permissões
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default Configuracoes;
