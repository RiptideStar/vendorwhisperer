
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import DashboardHeader from "@/components/DashboardHeader";
import DashboardStats from "@/components/DashboardStats";
import VendorList from "@/components/VendorList";
import ActiveOrders from "@/components/ActiveOrders";
import ShipmentMap from "@/components/ShipmentMap";
import InventoryManagement from "@/components/InventoryManagement";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <DashboardHeader />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
          <DashboardStats />
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3 mb-6">
          <InventoryManagement />
          <Card className="md:col-span-1">
            <VendorList />
          </Card>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          <Card className="col-span-1 xl:col-span-2">
            <ActiveOrders />
          </Card>
          <Card className="md:col-span-1">
            <ShipmentMap />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
