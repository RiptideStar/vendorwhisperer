
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { format, isToday } from "date-fns";
import { PhoneCall } from "lucide-react";

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
    } | null;
  } | null;
}

interface RestockSchedule {
  id: string;
  next_check_date: string;
  inventory_item: {
    name: string;
    unit: string;
    reorder_quantity: number;
    vendor: {
      name: string;
      phone: string | null;
    } | null;
  } | null;
}

const RestockOrders = () => {
  const { data: orders, isLoading: ordersLoading } = useQuery({
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

  const { data: todaySchedules, isLoading: schedulesLoading } = useQuery({
    queryKey: ["today-restock-schedules"],
    queryFn: async () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const { data, error } = await supabase
        .from("restock_schedules")
        .select(`
          *,
          inventory_item:inventory_items (
            name,
            unit,
            reorder_quantity,
            vendor:vendors (
              name,
              phone
            )
          )
        `)
        .eq('active', true)
        .gte('next_check_date', today.toISOString())
        .lt('next_check_date', new Date(today.getTime() + 24 * 60 * 60 * 1000).toISOString());

      if (error) throw error;
      return data as RestockSchedule[];
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

  const handleCallVendor = (phone: string) => {
    window.location.href = `tel:${phone}`;
  };

  if (ordersLoading || schedulesLoading) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        {todaySchedules && todaySchedules.length > 0 && (
          <>
            <h2 className="text-xl font-semibold mb-4">Expected Orders Today</h2>
            <Card className="mb-8">
              <div className="p-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead>Vendor</TableHead>
                      <TableHead>Suggested Quantity</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {todaySchedules.map((schedule) => (
                      <TableRow key={schedule.id}>
                        <TableCell className="font-medium">
                          {schedule.inventory_item?.name || 'Unknown Item'}
                        </TableCell>
                        <TableCell>{schedule.inventory_item?.vendor?.name || 'Unknown Vendor'}</TableCell>
                        <TableCell>
                          {schedule.inventory_item?.reorder_quantity || 0} {schedule.inventory_item?.unit || 'units'}
                        </TableCell>
                        <TableCell>
                          {schedule.inventory_item?.vendor?.phone ? (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleCallVendor(schedule.inventory_item?.vendor?.phone || '')}
                            >
                              <PhoneCall className="mr-2 h-4 w-4" />
                              Call Vendor
                            </Button>
                          ) : (
                            <Badge variant="secondary">No phone number</Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </>
        )}

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Recent Restock Orders</h1>
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
                      {order.order_date 
                        ? format(new Date(order.order_date), 'MMM d, yyyy')
                        : 'Not set'}
                    </TableCell>
                    <TableCell className="font-medium">
                      {order.inventory_item?.name || 'Unknown Item'}
                    </TableCell>
                    <TableCell>
                      {order.inventory_item?.vendor?.name || 'Unknown Vendor'}
                    </TableCell>
                    <TableCell>
                      {order.quantity} {order.inventory_item?.unit || 'units'}
                    </TableCell>
                    <TableCell>
                      {order.expected_delivery 
                        ? format(new Date(order.expected_delivery), 'MMM d, yyyy')
                        : 'Not set'}
                    </TableCell>
                    <TableCell>{getStatusBadge(order.status || 'pending')}</TableCell>
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
