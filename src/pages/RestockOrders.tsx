
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

interface RestockOrder {
  id: string;
  quantity: number;
  status: string;
  order_date: string;
  expected_delivery: string | null;
  notes: string | null;
  inventory_item: {
    name: string;
    unit: string;
    vendor: {
      name: string;
    };
  };
}

const RestockOrders = () => {
  const { data: orders, isLoading } = useQuery({
    queryKey: ["restock-orders"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("restock_orders")
        .select(`
          *,
          inventory_item:inventory_items (
            name,
            unit,
            vendor:vendors (
              name
            )
          )
        `)
        .order('order_date', { ascending: false });

      if (error) throw error;
      return data as RestockOrder[];
    },
  });

  const getStatusBadge = (status: string) => {
    const statusStyles = {
      pending: "bg-warning",
      confirmed: "bg-info",
      shipped: "bg-primary",
      delivered: "bg-success",
      cancelled: "bg-destructive",
    };
    return (
      <Badge className={statusStyles[status as keyof typeof statusStyles]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  if (isLoading) {
    return <div className="p-4">Loading restock orders...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Restock Orders</h1>
          <Button>Create Order</Button>
        </div>
        
        <Card>
          <div className="p-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order Date</TableHead>
                  <TableHead>Item</TableHead>
                  <TableHead>Vendor</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Expected Delivery</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders?.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>
                      {format(new Date(order.order_date), 'MMM d, yyyy')}
                    </TableCell>
                    <TableCell className="font-medium">
                      {order.inventory_item.name}
                    </TableCell>
                    <TableCell>{order.inventory_item.vendor.name}</TableCell>
                    <TableCell>
                      {order.quantity} {order.inventory_item.unit}
                    </TableCell>
                    <TableCell>
                      {order.expected_delivery 
                        ? format(new Date(order.expected_delivery), 'MMM d, yyyy')
                        : 'Not set'}
                    </TableCell>
                    <TableCell>{getStatusBadge(order.status)}</TableCell>
                    <TableCell>{order.notes || '-'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default RestockOrders;
