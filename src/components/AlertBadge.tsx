import { AlertCircle, AlertTriangle, CheckCircle } from "lucide-react";

interface AlertBadgeProps {
  quantity: number;
}

const AlertBadge = ({ quantity }: AlertBadgeProps) => {
  if (quantity < 5) {
    return (
      <div className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-destructive/10 text-destructive text-sm font-medium">
        <AlertCircle className="h-4 w-4" />
        Baixo Estoque
      </div>
    );
  }
  
  if (quantity >= 5 && quantity <= 10) {
    return (
      <div className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-warning/10 text-warning-foreground text-sm font-medium">
        <AlertTriangle className="h-4 w-4" />
        Atenção
      </div>
    );
  }
  
  return (
    <div className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-success/10 text-success text-sm font-medium">
      <CheckCircle className="h-4 w-4" />
      OK
    </div>
  );
};

export default AlertBadge;
