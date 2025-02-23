import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Box, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ShipmentMap = () => {
  const navigate = useNavigate();

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Shipment Tracking</h2>
        <Button 
          onClick={() => navigate('/shipment-management')}
          className="flex items-center gap-2"
        >
          <Box className="h-4 w-4" />
          Shipment Management
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="h-[300px] w-full rounded-lg bg-slate-100 relative overflow-hidden">
        {/* Simple map visualization */}
        <div className="absolute inset-0 grid grid-cols-12 grid-rows-6 gap-0.5 p-4">
          {Array.from({ length: 72 }).map((_, i) => (
            <div key={i} className="bg-slate-200 rounded-sm" />
          ))}
        </div>
        
        {/* Shipping route visualization */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-3/4 h-0.5 bg-blue-500 relative">
            {/* Origin point */}
            <div className="absolute -left-2 -top-2 w-5 h-5">
              <MapPin className="w-5 h-5 text-blue-600" />
            </div>
            
            {/* Destination point */}
            <div className="absolute -right-2 -top-2 w-5 h-5">
              <MapPin className="w-5 h-5 text-red-600" />
            </div>
            
            {/* Moving shipment indicator */}
            <div className="absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2 left-2/3">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
            </div>
          </div>
        </div>
        
        {/* Location labels */}
        <div className="absolute bottom-4 left-4 text-sm font-medium text-slate-600">
          Philadelphia, PA
        </div>
        <div className="absolute bottom-4 right-4 text-sm font-medium text-slate-600">
          New York, NY
        </div>
      </div>
    </div>
  );
};

export default ShipmentMap;
