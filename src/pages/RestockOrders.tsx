
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { PhoneCall } from "lucide-react";

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
  const { data: todaySchedules, isLoading: schedulesLoading } = useQuery({
    queryKey: ["today-restock-schedules"],
    queryFn: async () => {
      const today = new Date().toISOString().split('T')[0];

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
        .eq('next_check_date', today);

      if (error) {
        console.error('Error fetching restock schedules:', error);
        throw error;
      }
      
      console.log('Fetched schedules:', data);
      return data as RestockSchedule[];
    },
  });

  const handleCallVendor = (phone: string) => {
    window.location.href = `tel:${phone}`;
  };

  if (schedulesLoading) {
    return <div className="p-4">Loading scheduled orders...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <div className="flex flex-col mb-6">
          <h1 className="text-3xl font-bold">Routine Restock</h1>
          <h2 className="text-lg text-muted-foreground mt-2">
            Orders Expected on {format(new Date(), 'MMMM d, yyyy')}
          </h2>
        </div>
        
        <Card>
          <div className="p-6">
            {todaySchedules && todaySchedules.length > 0 ? (
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
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No orders scheduled for today
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default RestockOrders;
