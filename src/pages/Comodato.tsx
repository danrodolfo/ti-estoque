import { useState } from "react";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface ComodatoItem {
  id: number;
  categoria: string;
  item: string;
  descricao: string;
  quantidade: number;
  fornecedor: string;
  dataLocacao: string;
  dataDevolucao: string;
  responsavel: string;
  observacoes: string;
}

const Comodato = () => {
  const { toast } = useToast();
  const [items, setItems] = useState<ComodatoItem[]>([
    {
      id: 1,
      categoria: "Impressora",
      item: "Multifuncional HP LaserJet",
      descricao: "Impressora, scanner e copiadora",
      quantidade: 2,
      fornecedor: "HP Rental Services",
      dataLocacao: "2024-01-01",
      dataDevolucao: "2024-12-31",
      responsavel: "TI - João Silva",
      observacoes: "Contrato anual com manutenção inclusa"
    },
  ]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newItem, setNewItem] = useState<Partial<ComodatoItem>>({
    quantidade: 0,
  });

  const handleAddItem = () => {
    if (newItem.item && newItem.quantidade && newItem.fornecedor) {
      const item: ComodatoItem = {
        id: items.length + 1,
        categoria: newItem.categoria || "",
        item: newItem.item || "",
        descricao: newItem.descricao || "",
        quantidade: newItem.quantidade || 0,
        fornecedor: newItem.fornecedor || "",
        dataLocacao: newItem.dataLocacao || "",
        dataDevolucao: newItem.dataDevolucao || "",
        responsavel: newItem.responsavel || "",
        observacoes: newItem.observacoes || "",
      };
      
      setItems([...items, item]);
      setIsDialogOpen(false);
      setNewItem({ quantidade: 0 });
      
      toast({
        title: "Item adicionado!",
        description: "O item de comodato foi adicionado com sucesso.",
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
              <div>
                <CardTitle className="text-2xl font-bold">Estoque Comodato</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Equipamentos em regime de comodato/locação
                </p>
              </div>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Novo Item
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Adicionar Item de Comodato</DialogTitle>
                  </DialogHeader>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
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
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="descricao">Descrição</Label>
                      <Textarea
                        id="descricao"
                        value={newItem.descricao || ""}
                        onChange={(e) => setNewItem({...newItem, descricao: e.target.value})}
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
                    <div className="space-y-2">
                      <Label htmlFor="fornecedor">Fornecedor *</Label>
                      <Input
                        id="fornecedor"
                        value={newItem.fornecedor || ""}
                        onChange={(e) => setNewItem({...newItem, fornecedor: e.target.value})}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dataLocacao">Data Locação</Label>
                      <Input
                        id="dataLocacao"
                        type="date"
                        value={newItem.dataLocacao || ""}
                        onChange={(e) => setNewItem({...newItem, dataLocacao: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dataDevolucao">Data Devolução</Label>
                      <Input
                        id="dataDevolucao"
                        type="date"
                        value={newItem.dataDevolucao || ""}
                        onChange={(e) => setNewItem({...newItem, dataDevolucao: e.target.value})}
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
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="observacoes">Observações</Label>
                      <Textarea
                        id="observacoes"
                        value={newItem.observacoes || ""}
                        onChange={(e) => setNewItem({...newItem, observacoes: e.target.value})}
                      />
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
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Item</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead className="text-right">Quantidade</TableHead>
                    <TableHead>Fornecedor</TableHead>
                    <TableHead>Data Locação</TableHead>
                    <TableHead>Data Devolução</TableHead>
                    <TableHead>Responsável</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.categoria}</TableCell>
                      <TableCell>{item.item}</TableCell>
                      <TableCell className="max-w-xs truncate">{item.descricao}</TableCell>
                      <TableCell className="text-right">{item.quantidade}</TableCell>
                      <TableCell>{item.fornecedor}</TableCell>
                      <TableCell>{item.dataLocacao ? new Date(item.dataLocacao).toLocaleDateString('pt-BR') : '-'}</TableCell>
                      <TableCell>{item.dataDevolucao ? new Date(item.dataDevolucao).toLocaleDateString('pt-BR') : '-'}</TableCell>
                      <TableCell>{item.responsavel}</TableCell>
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

export default Comodato;
