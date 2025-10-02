import { useState } from "react";
import Navigation from "@/components/Navigation";
import AlertBadge from "@/components/AlertBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface EstoqueItem {
  id: number;
  patrimonio: string;
  categoria: string;
  item: string;
  descricao: string;
  localizacao: string;
  responsavel: string;
  dataEntrada: string;
  status: string;
  quantidade: number;
  consumo: boolean;
  imobilizado: boolean;
  observacao: string;
}

const EstoqueTI = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategoria, setFilterCategoria] = useState("todos");
  const [filterStatus, setFilterStatus] = useState("todos");
  const [items, setItems] = useState<EstoqueItem[]>([
    {
      id: 1,
      patrimonio: "NB001",
      categoria: "Notebook",
      item: "Dell Latitude 5420",
      descricao: "Notebook Dell i7 16GB RAM",
      localizacao: "TI - Sala 201",
      responsavel: "João Silva",
      dataEntrada: "2024-01-15",
      status: "Disponível",
      quantidade: 15,
      consumo: false,
      imobilizado: true,
      observacao: "Em bom estado"
    },
    {
      id: 2,
      patrimonio: "KB002",
      categoria: "Periférico",
      item: "Teclado Logitech",
      descricao: "Teclado sem fio",
      localizacao: "Almoxarifado",
      responsavel: "Maria Santos",
      dataEntrada: "2024-02-01",
      status: "Disponível",
      quantidade: 3,
      consumo: true,
      imobilizado: false,
      observacao: "Baixo estoque"
    },
    {
      id: 3,
      patrimonio: "MO003",
      categoria: "Monitor",
      item: "Monitor LG 24'",
      descricao: "Monitor Full HD",
      localizacao: "TI - Sala 203",
      responsavel: "Pedro Costa",
      dataEntrada: "2024-01-20",
      status: "Em uso",
      quantidade: 8,
      consumo: false,
      imobilizado: true,
      observacao: ""
    },
  ]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newItem, setNewItem] = useState<Partial<EstoqueItem>>({
    status: "Disponível",
    quantidade: 0,
    consumo: false,
    imobilizado: false,
  });

  const filteredItems = items.filter(item => {
    const matchesSearch = 
      item.item.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.patrimonio.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.categoria.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategoria = filterCategoria === "todos" || item.categoria === filterCategoria;
    const matchesStatus = filterStatus === "todos" || item.status === filterStatus;
    
    return matchesSearch && matchesCategoria && matchesStatus;
  });

  const handleAddItem = () => {
    if (newItem.item && newItem.quantidade) {
      const item: EstoqueItem = {
        id: items.length + 1,
        patrimonio: newItem.patrimonio || "",
        categoria: newItem.categoria || "",
        item: newItem.item || "",
        descricao: newItem.descricao || "",
        localizacao: newItem.localizacao || "",
        responsavel: newItem.responsavel || "",
        dataEntrada: new Date().toISOString().split('T')[0],
        status: newItem.status || "Disponível",
        quantidade: newItem.quantidade || 0,
        consumo: newItem.consumo || false,
        imobilizado: newItem.imobilizado || false,
        observacao: newItem.observacao || "",
      };
      
      setItems([...items, item]);
      setIsDialogOpen(false);
      setNewItem({
        status: "Disponível",
        quantidade: 0,
        consumo: false,
        imobilizado: false,
      });
      
      toast({
        title: "Item adicionado!",
        description: "O item foi adicionado ao estoque com sucesso.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="shadow-soft">
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <CardTitle className="text-2xl font-bold">Estoque TI</CardTitle>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Novo Item
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Adicionar Novo Item</DialogTitle>
                  </DialogHeader>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="patrimonio">Patrimônio</Label>
                      <Input
                        id="patrimonio"
                        value={newItem.patrimonio || ""}
                        onChange={(e) => setNewItem({...newItem, patrimonio: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="categoria">Categoria</Label>
                      <Input
                        id="categoria"
                        value={newItem.categoria || ""}
                        onChange={(e) => setNewItem({...newItem, categoria: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="item">Item *</Label>
                      <Input
                        id="item"
                        value={newItem.item || ""}
                        onChange={(e) => setNewItem({...newItem, item: e.target.value})}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="quantidade">Quantidade *</Label>
                      <Input
                        id="quantidade"
                        type="number"
                        value={newItem.quantidade || 0}
                        onChange={(e) => setNewItem({...newItem, quantidade: parseInt(e.target.value)})}
                        required
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="descricao">Descrição</Label>
                      <Textarea
                        id="descricao"
                        value={newItem.descricao || ""}
                        onChange={(e) => setNewItem({...newItem, descricao: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="localizacao">Localização</Label>
                      <Input
                        id="localizacao"
                        value={newItem.localizacao || ""}
                        onChange={(e) => setNewItem({...newItem, localizacao: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="responsavel">Responsável</Label>
                      <Input
                        id="responsavel"
                        value={newItem.responsavel || ""}
                        onChange={(e) => setNewItem({...newItem, responsavel: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="status">Status</Label>
                      <Select
                        value={newItem.status}
                        onValueChange={(value) => setNewItem({...newItem, status: value})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Disponível">Disponível</SelectItem>
                          <SelectItem value="Em uso">Em uso</SelectItem>
                          <SelectItem value="Em manutenção">Em manutenção</SelectItem>
                          <SelectItem value="Baixado">Baixado</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancelar
                    </Button>
                    <Button onClick={handleAddItem}>Adicionar</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por item, patrimônio ou categoria..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterCategoria} onValueChange={setFilterCategoria}>
                <SelectTrigger className="w-full sm:w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todas Categorias</SelectItem>
                  <SelectItem value="Notebook">Notebook</SelectItem>
                  <SelectItem value="Periférico">Periférico</SelectItem>
                  <SelectItem value="Monitor">Monitor</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full sm:w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos Status</SelectItem>
                  <SelectItem value="Disponível">Disponível</SelectItem>
                  <SelectItem value="Em uso">Em uso</SelectItem>
                  <SelectItem value="Em manutenção">Em manutenção</SelectItem>
                  <SelectItem value="Baixado">Baixado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patrimônio</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Item</TableHead>
                    <TableHead>Localização</TableHead>
                    <TableHead>Responsável</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Quantidade</TableHead>
                    <TableHead>Alerta</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.patrimonio}</TableCell>
                      <TableCell>{item.categoria}</TableCell>
                      <TableCell>{item.item}</TableCell>
                      <TableCell>{item.localizacao}</TableCell>
                      <TableCell>{item.responsavel}</TableCell>
                      <TableCell>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          item.status === "Disponível" 
                            ? "bg-success/10 text-success" 
                            : item.status === "Em uso"
                            ? "bg-primary/10 text-primary"
                            : "bg-muted text-muted-foreground"
                        }`}>
                          {item.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-right font-medium">{item.quantidade}</TableCell>
                      <TableCell>
                        <AlertBadge quantity={item.quantidade} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default EstoqueTI;
