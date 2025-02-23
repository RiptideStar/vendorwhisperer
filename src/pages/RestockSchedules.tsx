import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Calendar as CalendarIcon, PhoneCall } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface RestockSchedule {
  id: string;
  frequency_days: number;
  last_check_date: string | null;
  next_check_date: string | null;
  active: boolean;
  inventory_item: {
    name: string;
    current_stock?: number;
    reorder_point?: number;
    reorder_quantity?: number;
    unit: string;
    vendor: {
      name: string;
      phone: string | null;
    };
  };
}

const RestockSchedules = () => {
  const today = new Date().toISOString().split('T')[0];
  const [date, setDate] = useState<Date>(new Date());

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
            reorder_quantity,
            unit,
            vendor:vendors (
              name,
              phone
            )
          )
        `);

      if (error) throw error;
      return data as RestockSchedule[];
    },
  });

  const { data: todaySchedules } = useQuery({
    queryKey: ["today-restock-schedules"],
    queryFn: async () => {
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

      if (error) throw error;
      return data as RestockSchedule[];
    },
  });

  const handleCallVendor = async (phone: string) => {
    //alert('handleCallVendor called'); // Debug alert
    try {
      //alert('Attempting to make call...'); // Debug alert
      const response = await fetch('http://localhost:8000/outbound-call', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          number: '+12172002813',
          prompt: "You are Eric, an outbound car sales agent. You are calling to sell a new car to the customer. Be friendly and professional and answer all questions.",
          first_message: "Hello Thor, my name is Eric, I heard you were looking for a new car! What model and color are you looking for?"
        })
      });

      //alert('Got response: ' + response.status); // Debug alert

      if (!response.ok) {
        throw new Error('Failed to initiate call');
      }
      //alert('Call initiated successfully');
    } catch (error) {
      alert('Error: ' + error.message); // Show error to user
    }
  };

  if (isLoading) {
    return <div className="p-4">Loading restock schedules...</div>;
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

        <Tabs defaultValue="today" className="space-y-4">
          <TabsList>
            <TabsTrigger value="today">Today's Orders</TabsTrigger>
            <TabsTrigger value="calendar">Calendar View</TabsTrigger>
          </TabsList>

          <TabsContent value="today">
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
                                onClick={() => {
                                  //alert('Button clicked!');  // This should show immediately
                                  console.log('Button clicked at:', new Date().toISOString());
                                  handleCallVendor(schedule.inventory_item?.vendor?.phone || '');
                                }}
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
          </TabsContent>

          <TabsContent value="calendar">
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="p-6">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(newDate) => newDate && setDate(newDate)}
                  className="rounded-md border"
                  components={{
                    DayContent: ({ date: dayDate }) => {
                      const formattedDate = dayDate.toISOString().split('T')[0];
                      const hasSchedule = schedules?.some(
                        schedule => schedule.next_check_date?.split('T')[0] === formattedDate
                      );
                      
                      return (
                        <div className="relative">
                          <div>{dayDate.getDate()}</div>
                          {hasSchedule && (
                            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
                          )}
                        </div>
                      );
                    },
                  }}
                />
              </Card>

              <Card className="p-6">
                <div className="space-y-4">
                  <h3 className="font-medium">
                    Schedules for {format(date, 'MMMM d, yyyy')}
                  </h3>
                  {schedules
                    ?.filter(schedule => 
                      schedule.next_check_date?.split('T')[0] === date.toISOString().split('T')[0]
                    )
                    .map(schedule => (
                      <div
                        key={schedule.id}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div>
                          <div className="font-medium">{schedule.inventory_item.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {schedule.inventory_item.vendor.name}
                          </div>
                        </div>
                        {schedule.inventory_item.vendor.phone && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              //console.log('Button clicked!');
                              handleCallVendor(schedule.inventory_item.vendor.phone || '');
                            }}
                          >
                            <PhoneCall className="mr-2 h-4 w-4" />
                            Call Vendor
                          </Button>
                        )}
                      </div>
                    ))}
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default RestockSchedules;
