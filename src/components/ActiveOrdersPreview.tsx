import React from "react";
import { Button } from "@/components/ui/button";
import { Truck } from "lucide-react";

const ActiveOrdersPreview = () => {
  return (
    <div className="p-4 border rounded-md">
      {/* ...existing preview header... */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Active Orders</h2>
        <Button variant="outline">
          <Truck className="mr-2 h-4 w-4" />
          Shipment Tracking
        </Button>
      </div>
      {/* ...existing code rendering active orders... */}
      <div>
        {/* Placeholder for active orders list */}
        <p>List of active orders goes here.</p>
      </div>
    </div>
  );
};

export default ActiveOrdersPreview;
