import React, { useState, useRef } from "react"; // removed useMemo
import { Button } from "@/components/ui/button";
import { Phone, Headphones } from "lucide-react"; // updated icon import to include Headphones

interface Order {
  orderNumber: string;
  vendorId: string;
  orderedProduct: string;
  shippingStatus: string;
  expected_delivery: string; // new field
}

// Updated orders array with 10 more examples
const orders: Order[] = [
  { orderNumber: "001", vendorId: "V001", orderedProduct: "Widget A", shippingStatus: "Processing", expected_delivery: "2023-11-15" },
  { orderNumber: "002", vendorId: "V002", orderedProduct: "Widget B", shippingStatus: "Shipped", expected_delivery: "2023-11-10" },
  { orderNumber: "003", vendorId: "V003", orderedProduct: "Widget C", shippingStatus: "Processing", expected_delivery: "2023-11-17" },
  { orderNumber: "004", vendorId: "V004", orderedProduct: "Widget D", shippingStatus: "Shipped", expected_delivery: "2023-11-12" },
  { orderNumber: "005", vendorId: "V005", orderedProduct: "Widget E", shippingStatus: "Processing", expected_delivery: "2023-11-16" },
  { orderNumber: "006", vendorId: "V006", orderedProduct: "Widget F", shippingStatus: "Shipped", expected_delivery: "2023-11-11" },
  { orderNumber: "007", vendorId: "V007", orderedProduct: "Widget G", shippingStatus: "Delayed", expected_delivery: "2023-11-05" },
  { orderNumber: "008", vendorId: "V008", orderedProduct: "Widget H", shippingStatus: "Shipped", expected_delivery: "2023-11-13" },
  { orderNumber: "009", vendorId: "V009", orderedProduct: "Widget I", shippingStatus: "Processing", expected_delivery: "2023-11-18" },
  { orderNumber: "010", vendorId: "V010", orderedProduct: "Widget J", shippingStatus: "Delayed", expected_delivery: "2023-11-07" },
  { orderNumber: "011", vendorId: "V011", orderedProduct: "Widget K", shippingStatus: "Processing", expected_delivery: "2023-11-19" },
  { orderNumber: "012", vendorId: "V012", orderedProduct: "Widget L", shippingStatus: "Shipped", expected_delivery: "2023-11-14" },
];

// Updated helper for color coding status text with "Delayed" status in bold
const getStatusColor = (status: string) => {
  if (status === "Processing") return "text-yellow-600";
  if (status === "Shipped") return "text-green-600";
  if (status === "Delayed") return "text-red-600 font-bold";  // added font-bold for Delayed
  return "text-gray-600";
};

const ShipmentManagement = () => {
  const [showPreview, setShowPreview] = useState(false); // new state for hover preview
  const [tooltipPosition, setTooltipPosition] = useState<{ top: number; left: number } | null>(null);
  const statusRef = useRef<HTMLSpanElement | null>(null);

  // Fixed progress percentage
  const progress = 50;

  const handleMouseEnter = () => {
    if (statusRef.current) {
      const rect = statusRef.current.getBoundingClientRect();
      // Place tooltip to the right of the status element
      setTooltipPosition({ top: rect.top, left: rect.right + 10 });
    }
    setShowPreview(true);
  };

  const handleMouseLeave = () => {
    setShowPreview(false);
    setTooltipPosition(null);
  };

<<<<<<< HEAD
  // New handler for contacting vendor
  const handleContactVendor = (vendorId: string) => {
    // Placeholder: integrate with Twilio/ElevenLabs API here.
=======
  // New handler for contacting vendor updated to not include the phone number in client code
  const handleContactVendor = async (vendorId: string) => {
    // The API route below will use your TWILIO_PHONE_NUMBER from process.env on the server side.
    // You may derive the "to" number based on vendorId if needed.
    try {
      const res = await fetch("/api/callVendor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vendorPhone: "" }), // Leave vendorPhone empty or derive from vendorId
      });
      if (!res.ok) throw new Error("Failed to initiate call");
      const data = await res.json();
      console.log("Call initiated, SID:", data.sid);
    } catch (error) {
      console.error("Error contacting vendor:", error);
    }
>>>>>>> 6eb38b1 (No changes made)
    console.log("Initiating contact with vendor:", vendorId);
  };

  // New handler for AI call/vendor support
  const handleAICallVendor = (vendorId: string) => {
    console.log("Initiating AI call with vendor:", vendorId);
  };

  return (
    <div className="container mx-auto p-4">
      {/* Updated Follow up button with icon */}
      <div className="mb-6">
        <Button className="bg-red-600 hover:bg-red-700 text-white">
          <Headphones className="mr-2 h-4 w-4" /> {/* replaced Phone with Headphones */}
         Follow up on delays
        </Button>
      </div>
      {/* Table with smooth rounded borders */}
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order Number</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vendor ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ordered Product</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Shipping Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Expected Delivery</th> {/* new column */}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact Vendor</th> {/* new column */}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.map((order) => (
              <tr key={order.orderNumber} className={order.shippingStatus === "Delayed" ? "text-red-600 font-bold" : ""}>
                <td className="px-6 py-4 whitespace-nowrap">{order.orderNumber}</td>
                <td className="px-6 py-4 whitespace-nowrap">{order.vendorId}</td>
                <td className="px-6 py-4 whitespace-nowrap">{order.orderedProduct}</td>
                <td className="px-6 py-4 whitespace-nowrap relative">
                  <span
                    ref={order.orderNumber === "001" ? statusRef : null}
                    className={`cursor-pointer underline decoration-dotted ${
                      order.shippingStatus === "Delayed" ? "" : getStatusColor(order.shippingStatus)
                    }`}
                    onMouseEnter={() => { if(order.orderNumber === "001") handleMouseEnter(); }}
                    onMouseLeave={() => { if(order.orderNumber === "001") handleMouseLeave(); }}
                  >
                    {order.shippingStatus}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{order.expected_delivery}</td> {/* new cell */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={() => handleContactVendor(order.vendorId)}
                    title="You call"  // added tooltip text
                  >
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={() => handleAICallVendor(order.vendorId)} 
                    className="ml-2"
                    title="Let Agent call"  // added tooltip text
                  >
                    <Headphones className="h-4 w-4" />
                  </Button>
                </td> {/* new cell */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Global hover overlay preview */}
      {showPreview && tooltipPosition && (
        <div 
          className="fixed bg-white p-4 rounded shadow-lg pointer-events-auto z-10"
          style={{ top: tooltipPosition.top, left: tooltipPosition.left }}
        >
          <h3 className="text-lg font-semibold mb-2">Order Tracker</h3>
          <div className="w-64 relative mb-2">
            {/* Thicker progress bar track moved slightly upwards */}
            <div className="absolute w-full h-2 bg-gray-300 rounded-full" style={{ top: 'calc(50% - 3px)' }}></div>
            {/* Filled progress bar indicating progress */}
            <div
              className="absolute h-2 bg-blue-600 rounded-full"
              style={{ top: 'calc(50% - 3px)', width: `${progress}%` }}
            ></div>
            {/* Milestone circles centered vertically */}
            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-4 h-4 bg-green-600 rounded-full" title="Order Placed"></div>
            <div className="absolute left-1/2 top-1/2 transform -translate-y-1/2 w-4 h-4 bg-yellow-600 rounded-full" title="Order Shipped Out"></div>
            <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-4 h-4 bg-gray-600 rounded-full" title="Order Delivered"></div>
          </div>
          {/* Milestone descriptions re-arranged in a grid for extra spacing and text wrapping */}
          <div className="grid grid-cols-3 gap-4 text-xs mt-5">
            <span className="text-center whitespace-normal">Order Placed</span>
            <span className="text-center whitespace-normal">Order Shipped Out</span>
            <span className="text-center whitespace-normal">Order Delivered</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShipmentManagement;
