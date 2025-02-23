
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { CalendarDays } from "lucide-react";

interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  current_stock: number;
  reorder_point: number;
  unit: string;
  vendor_id: string;
  vendor: {
    name: string;
  };
}

const InventoryManagement = () => {
  const navigate = useNavigate();
  
  const { data: inventoryItems, isLoading } = useQuery({
    queryKey: ["inventory-items"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("inventory_items")
        .select(`
          *,
          vendor:vendors(name)
        `);

      if (error) throw error;
      return data as InventoryItem[];
    },
  });

  const getStockStatus = (currentStock: number, reorderPoint: number) => {
    if (currentStock <= reorderPoint) {
      return <Badge className="bg-destructive text-destructive-foreground">Reorder</Badge>;
    }
    if (currentStock <= reorderPoint * 1.2) {
      return <Badge className="bg-warning text-warning-foreground">Low</Badge>;
    }
    return <Badge className="bg-success text-success-foreground">Good</Badge>;
  };

  if (isLoading) {
    return <div className="p-4">Loading inventory data...</div>;
  }

  return (
    <Card className="col-span-2">
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Inventory Management</h2>
          <Button 
            variant="outline"
            onClick={() => navigate('/restock-schedules')}
          >
            <CalendarDays className="mr-2 h-4 w-4" />
            Routine Restock
          </Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Item</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>Current Stock</TableHead>
              <TableHead>Reorder Point</TableHead>
              <TableHead>Vendor</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {inventoryItems?.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell>{item.sku}</TableCell>
                <TableCell>{item.current_stock} {item.unit}</TableCell>
                <TableCell>{item.reorder_point} {item.unit}</TableCell>
                <TableCell>{item.vendor?.name || "N/A"}</TableCell>
                <TableCell>
                  {getStockStatus(item.current_stock, item.reorder_point)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};

export default InventoryManagement;
