import { Bell, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";

const DashboardHeader = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between mb-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Procurement Dashboard</h1>
        <p className="text-muted-foreground">Monitor orders, vendors, and shipments in real-time.</p>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input className="pl-10 w-[200px] md:w-[300px]" placeholder="Search orders, vendors..." />
        </div>
        <Button variant="outline" size="icon">
          <Bell className="h-4 w-4" />
        </Button>
        <Button onClick={() => navigate('/new-order')}>New Order</Button>
      </div>
    </div>
  );
};

export default DashboardHeader;
