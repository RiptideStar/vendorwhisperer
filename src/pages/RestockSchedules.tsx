
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

interface RestockSchedule {
  id: string;
  frequency_days: number;
  last_check_date: string;
  next_check_date: string;
  active: boolean;
  inventory_item: {
    name: string;
    current_stock: number;
    reorder_point: number;
    unit: string;
    vendor: {
      name: string;
    };
  };
}

const RestockSchedules = () => {
  const { data: schedules, isLoading } = useQuery({
    queryKey: ["restock-schedules"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("restock_schedules")
        .select(`
          *,
          inventory_item:inventory_items (
            name,
            current_stock,
            reorder_point,
            unit,
            vendor:vendors (
              name
            )
          )
        `);

      if (error) throw error;
      return data as RestockSchedule[];
    },
  });

  if (isLoading) {
    return <div className="p-4">Loading restock schedules...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Restock Schedules</h1>
          <Button>Add Schedule</Button>
        </div>
        
        <Card>
          <div className="p-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead>Vendor</TableHead>
                  <TableHead>Frequency</TableHead>
                  <TableHead>Last Check</TableHead>
                  <TableHead>Next Check</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Stock Level</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {schedules?.map((schedule) => (
                  <TableRow key={schedule.id}>
                    <TableCell className="font-medium">
                      {schedule.inventory_item.name}
                    </TableCell>
                    <TableCell>{schedule.inventory_item.vendor.name}</TableCell>
                    <TableCell>Every {schedule.frequency_days} days</TableCell>
                    <TableCell>
                      {schedule.last_check_date 
                        ? format(new Date(schedule.last_check_date), 'MMM d, yyyy')
                        : 'Never'}
                    </TableCell>
                    <TableCell>
                      {schedule.next_check_date 
                        ? format(new Date(schedule.next_check_date), 'MMM d, yyyy')
                        : 'Not scheduled'}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={schedule.active ? "bg-success" : "bg-secondary"}
                      >
                        {schedule.active ? "Active" : "Paused"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          schedule.inventory_item.current_stock <= schedule.inventory_item.reorder_point
                            ? "bg-destructive"
                            : "bg-success"
                        }
                      >
                        {schedule.inventory_item.current_stock} {schedule.inventory_item.unit}
                      </Badge>
                    </TableCell>
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

export default RestockSchedules;
