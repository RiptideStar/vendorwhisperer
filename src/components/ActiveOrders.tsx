
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

const orders = [
  {
    id: "ORD-001",
    vendor: "TechSupply Co",
    items: "Computer Parts",
    status: "In Progress",
    date: "2024-03-20",
  },
  {
    id: "ORD-002",
    vendor: "Global Electronics",
    items: "Circuit Boards",
    status: "Pending",
    date: "2024-03-19",
  },
  {
    id: "ORD-003",
    vendor: "FastShip Inc",
    items: "Network Equipment",
    status: "Completed",
    date: "2024-03-18",
  },
];

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "completed":
      return "bg-success text-success-foreground";
    case "in progress":
      return "bg-warning text-warning-foreground";
    default:
      return "bg-secondary text-secondary-foreground";
  }
};

const ActiveOrders = () => {
  return (
    <>
      <div className="p-6">
        <h2 className="text-lg font-semibold mb-4">Active Orders</h2>
        <ScrollArea className="h-[400px] w-full">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{order.vendor}</TableCell>
                  <TableCell>{order.items}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(order.status)}>
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{order.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </div>
    </>
  );
};

export default ActiveOrders;
