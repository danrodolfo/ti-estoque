import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const Movimentados = () => {
  const movimentados = [
    {
      id: 1,
      patrimonio: "NB005",
      categoria: "Notebook",
      item: "Dell Inspiron 15",
      descricao: "Notebook Dell i5 8GB RAM",
      responsavel: "Carlos Oliveira",
      dataEntrada: "2024-01-10",
      dataSaida: "2024-03-15",
      dataMovimentacao: "2024-03-15 14:30",
      localizacao: "Setor Financeiro",
      status: "Em uso"
    },
    {
      id: 2,
      patrimonio: "MO007",
      categoria: "Monitor",
      item: "Samsung 27'",
      descricao: "Monitor curvo",
      responsavel: "Ana Paula",
      dataEntrada: "2023-12-05",
      dataSaida: "2024-03-10",
      dataMovimentacao: "2024-03-10 09:15",
      localizacao: "Setor RH",
      status: "Em uso"
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Itens Movimentados</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Histórico de equipamentos que saíram do estoque
            </p>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patrimônio</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Item</TableHead>
                    <TableHead>Responsável</TableHead>
                    <TableHead>Localização</TableHead>
                    <TableHead>Data Entrada</TableHead>
                    <TableHead>Data Saída</TableHead>
                    <TableHead>Data Movimentação</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {movimentados.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.patrimonio}</TableCell>
                      <TableCell>{item.categoria}</TableCell>
                      <TableCell>{item.item}</TableCell>
                      <TableCell>{item.responsavel}</TableCell>
                      <TableCell>{item.localizacao}</TableCell>
                      <TableCell>{new Date(item.dataEntrada).toLocaleDateString('pt-BR')}</TableCell>
                      <TableCell>{new Date(item.dataSaida).toLocaleDateString('pt-BR')}</TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {item.dataMovimentacao}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-primary/10 text-primary">
                          {item.status}
                        </span>
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

export default Movimentados;
