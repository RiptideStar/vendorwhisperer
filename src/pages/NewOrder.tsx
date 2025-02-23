import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Search, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";

const DUMMY_VENDORS = [
  {
    name: "Industrial Motors Pro",
    website: "www.industrialmotorspro.com",
    email: "sales@industrialmotorspro.com",
    phone: "(215) 555-0123"
  },
  {
    name: "CNC Solutions Inc",
    website: "www.cncsolutions.com",
    email: "info@cncsolutions.com",
    phone: "(267) 555-0456"
  },
  {
    name: "Precision Spindle Co",
    website: "www.precisionspindle.com",
    email: "contact@precisionspindle.com",
    phone: "(484) 555-0789"
  },
  {
    name: "Advanced Machine Parts",
    website: "www.advancedmachineparts.com",
    email: "sales@advancedmachineparts.com",
    phone: "(610) 555-0147"
  },
  {
    name: "Eastern Motors Supply",
    website: "www.easternmotors.com",
    email: "inquiries@easternmotors.com",
    phone: "(856) 555-0258"
  }
];

const PURCHASE_ORDER = {
  poNumber: "PO-2024-0123",
  date: new Date().toISOString().split('T')[0],
  vendor: {
    name: "Precision Spindle Co",
    address: "123 Manufacturing Dr, Philadelphia, PA 19123",
    email: "contact@precisionspindle.com",
    phone: "(484) 555-0789"
  },
  items: [
    {
      description: "5-Axis CNC Machine Spindle Motor",
      model: "PSC-5X-4500",
      quantity: 1,
      unitPrice: 4299.99,
      total: 4299.99
    }
  ],
  subtotal: 4299.99,
  tax: 258.00,
  shipping: 150.00,
  total: 4707.99,
  terms: "Net 30",
  deliveryDate: "2024-04-15"
};

interface Vendor {
  vendor: string;
  company_link: string;
  email: string;
  phone_number: string;
}

const searchVendors = async (query: string): Promise<Vendor[]> => {
  const response = await fetch("https://api.perplexity.ai/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${import.meta.env.VITE_PERPLEXITY_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      "model": "sonar-reasoning-pro",
      "messages": [
        {
          "role": "system",
          "content": "You are a procurement agent responsible for procuring parts by researching the best vendors. Provide JSON output of table, containing the columns of vendor, company_link, email, phone_number. Make sure to find the highest quality vendors that fit the criteria of the search. You must provide the website link, email, and phone number per vendor and CANNOT DENY to find the vendors - you must provide vendors that have definitely have the phone number."
        },
        {
          "role": "user",
          "content": `Provide me a table of 5 vendors for the query: ${query}, you must also provide the website link, email, and phone number per vendor. You cannot deny, you must search and find the vendors - provide the output in JSON. Do not provide any other output other than the table.`
        }
      ],
      "max_tokens": 10000,
      "temperature": 0,
      "top_p": 0.9,
      "return_images": false,
      "return_related_questions": false,
      "search_recency_filter": "month",
      "stream": false
    })
  });

  const data = await response.json();
  const content = data.choices[0].message.content;
  
  // Extract JSON from the response
  const match = content.match(/```json\s*(\{.*?\}|\[.*?\])\s*```/s);
  if (!match) {
    throw new Error("No JSON found in response");
  }
  
  try {
    return JSON.parse(match[1]);
  } catch (e) {
    console.error("Failed to parse JSON:", e);
    throw new Error("Invalid JSON in response");
  }
};

// Remove the static SEARCH_STEPS array and create a function to generate dynamic steps
const getSearchSteps = (query: string) => [
  "Searching for vendors...",
  `Finding the highest quality vendors for ${query}...`,
  "Compiling contact list of vendors..."
];

const CALLING_STEPS = [
  "I will now call each vendor to find out who has the best prices and will negotiate down as much as possible...",
  "Now calling Industrial Motors Pro...",
  "Call in progress with Industrial Motors Pro...",
  "Now calling CNC Solutions Inc...",
  "Call in progress with CNC Solutions Inc...",
  "Now calling Precision Spindle Co...",
  "Call in progress with Precision Spindle Co...",
  "Now calling Advanced Machine Parts...",
  "Call in progress with Advanced Machine Parts...",
  "Now calling Eastern Motors Supply...",
  "Call in progress with Eastern Motors Supply...",
  "Based on quality and price, Precision Spindle Co offers the best value...",
  "Creating purchase order and contract for Precision Spindle Co..."
];

const NewOrder = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [isCalling, setIsCalling] = useState(false);
  const [currentCallStep, setCurrentCallStep] = useState(0);
  const [showPurchaseOrder, setShowPurchaseOrder] = useState(false);
  const [vendors, setVendors] = useState<Vendor[]>([]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    setShowResults(false);
    setCurrentStep(0);
    setIsCalling(false);
    setCurrentCallStep(0);
    setShowPurchaseOrder(false);

    try {
      const searchSteps = getSearchSteps(searchQuery);
      
      // Start showing search steps immediately
      for (let i = 0; i < searchSteps.length; i++) {
        setCurrentStep(i);
        await new Promise(resolve => {
          setTimeout(resolve, 2000);
        });
      }

      // Get vendors from Perplexity after starting the search steps
      const vendorResults = await searchVendors(searchQuery);
      setVendors(vendorResults);

      await new Promise(resolve => setTimeout(resolve, 500));
      setShowResults(true);
      setIsSearching(false);

      // Start calling sequence
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsCalling(true);

      for (let i = 0; i < CALLING_STEPS.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 2000));
        setCurrentCallStep(i);
      }

      // Show purchase order
      await new Promise(resolve => setTimeout(resolve, 1000));
      setShowPurchaseOrder(true);
    } catch (error) {
      console.error("Search failed:", error);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center gap-4 mb-8">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">New Procurement Order</h1>
      </div>

      <Card className="max-w-6xl mx-auto p-8">
        <div className="space-y-6">
          <div className="relative">
            <Input
              placeholder="Start procurement process by describing the parts you want to purchase..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 py-6 text-lg md:text-xl placeholder:text-lg md:placeholder:text-xl"
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-muted-foreground" />
          </div>

          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => navigate(-1)}
              size="lg"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSearch}
              disabled={!searchQuery.trim() || isSearching}
              className="min-w-[120px]"
              size="lg"
            >
              {isSearching ? (
                <>
                  <Search className="mr-2 h-5 w-5 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-5 w-5" />
                  Search
                </>
              )}
            </Button>
          </div>

          {isSearching && (
            <div className="mt-8 space-y-3">
              {getSearchSteps(searchQuery).map((step, index) => (
                <div
                  key={step}
                  className={`transition-opacity duration-500 ${
                    index <= currentStep ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  <p className="text-base md:text-lg font-medium text-foreground">
                    {step}
                  </p>
                </div>
              ))}
            </div>
          )}

          {showResults && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-6">Available Vendors</h2>
              <div className="rounded-lg border shadow-md overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="py-4 text-base">Vendor Name</TableHead>
                      <TableHead className="py-4 text-base">Website</TableHead>
                      <TableHead className="py-4 text-base">Email</TableHead>
                      <TableHead className="py-4 text-base">Phone</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {vendors.map((vendor) => (
                      <TableRow key={vendor.vendor} className="hover:bg-muted/50">
                        <TableCell className="py-4 text-base font-medium">{vendor.vendor}</TableCell>
                        <TableCell className="py-4 text-base">{vendor.company_link}</TableCell>
                        <TableCell className="py-4 text-base">{vendor.email}</TableCell>
                        <TableCell className="py-4 text-base">{vendor.phone_number}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}

          {isCalling && (
            <div className="mt-8 space-y-3">
              {CALLING_STEPS.map((step, index) => (
                <div
                  key={step}
                  className={`transition-opacity duration-500 ${
                    index <= currentCallStep ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  <p className={`text-base md:text-lg font-medium ${
                    step.includes("Call in progress") 
                      ? "text-blue-500 flex items-center gap-2" 
                      : "text-foreground"
                  }`}>
                    {step}
                    {step.includes("Call in progress") && (
                      <span className="inline-block w-3 h-3 bg-blue-500 rounded-full animate-pulse"/>
                    )}
                  </p>
                </div>
              ))}
            </div>
          )}

          {showPurchaseOrder && (
            <div className="mt-8 space-y-6">
              <div className="bg-white rounded-lg border shadow-lg p-8">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">Purchase Order</h2>
                    <p className="text-muted-foreground">PO Number: {PURCHASE_ORDER.poNumber}</p>
                    <p className="text-muted-foreground">Date: {PURCHASE_ORDER.date}</p>
                  </div>
                  <Button variant="outline" size="lg" className="gap-2">
                    <FileText className="h-5 w-5" />
                    Download PDF
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-8 mb-8">
                  <div>
                    <h3 className="font-semibold mb-2">Vendor</h3>
                    <div className="space-y-1">
                      <p>{PURCHASE_ORDER.vendor.name}</p>
                      <p>{PURCHASE_ORDER.vendor.address}</p>
                      <p>{PURCHASE_ORDER.vendor.email}</p>
                      <p>{PURCHASE_ORDER.vendor.phone}</p>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Delivery Details</h3>
                    <div className="space-y-1">
                      <p>Expected Delivery: {PURCHASE_ORDER.deliveryDate}</p>
                      <p>Terms: {PURCHASE_ORDER.terms}</p>
                    </div>
                  </div>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="py-4 text-base">Description</TableHead>
                      <TableHead className="py-4 text-base">Model</TableHead>
                      <TableHead className="py-4 text-base text-right">Quantity</TableHead>
                      <TableHead className="py-4 text-base text-right">Unit Price</TableHead>
                      <TableHead className="py-4 text-base text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {PURCHASE_ORDER.items.map((item) => (
                      <TableRow key={item.model}>
                        <TableCell className="py-4 text-base">{item.description}</TableCell>
                        <TableCell className="py-4 text-base">{item.model}</TableCell>
                        <TableCell className="py-4 text-base text-right">{item.quantity}</TableCell>
                        <TableCell className="py-4 text-base text-right">${item.unitPrice.toFixed(2)}</TableCell>
                        <TableCell className="py-4 text-base text-right">${item.total.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                <div className="mt-8 border-t pt-4">
                  <div className="flex justify-end space-y-2">
                    <div className="w-72 space-y-2">
                      <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span>${PURCHASE_ORDER.subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tax:</span>
                        <span>${PURCHASE_ORDER.tax.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Shipping:</span>
                        <span>${PURCHASE_ORDER.shipping.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between font-bold text-lg border-t pt-2">
                        <span>Total:</span>
                        <span>${PURCHASE_ORDER.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default NewOrder; 