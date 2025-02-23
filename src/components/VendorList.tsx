
import { ScrollArea } from "@/components/ui/scroll-area";
import { Phone, MapPin, CheckCircle } from "lucide-react";

const vendors = [
  {
    name: "TechSupply Co",
    status: "Available",
    location: "San Francisco, CA",
    lastContact: "2 hours ago",
  },
  {
    name: "Global Electronics",
    status: "Busy",
    location: "New York, NY",
    lastContact: "5 hours ago",
  },
  {
    name: "FastShip Inc",
    status: "Available",
    location: "Chicago, IL",
    lastContact: "1 day ago",
  },
];

const VendorList = () => {
  return (
    <div className="p-6">
      <h2 className="text-lg font-semibold mb-4">Top Vendors</h2>
      <ScrollArea className="h-[400px]">
        <div className="space-y-4">
          {vendors.map((vendor) => (
            <div
              key={vendor.name}
              className="p-4 rounded-lg border bg-card text-card-foreground hover:bg-accent transition-colors"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-medium">{vendor.name}</h3>
                  <div className="flex items-center text-sm text-muted-foreground mt-1">
                    <MapPin className="h-3 w-3 mr-1" />
                    {vendor.location}
                  </div>
                </div>
                <div className="flex items-center">
                  <span
                    className={`h-2 w-2 rounded-full ${
                      vendor.status === "Available" ? "bg-success" : "bg-warning"
                    } mr-2`}
                  />
                  <span className="text-sm text-muted-foreground">
                    {vendor.status}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <Phone className="h-3 w-3 mr-1" />
                  Last contact: {vendor.lastContact}
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  98% success
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default VendorList;
