import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Search, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import ChatWindow from "@/components/ChatWindow";

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
      "model": "sonar-pro",
      "messages": [
        {
          "role": "system",
          "content": "You are a procurement agent responsible for procuring parts by researching the best vendors. Provide JSON output of table, containing the columns of vendor, company_link, email, phone_number. Make sure to find the highest quality vendors that fit the criteria of the search. You must provide the website link, email, and phone number per vendor and CANNOT DENY to find the vendors - you must provide vendors that have definitely have the phone number. If possible, choose lesser known vendors."
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

// Update the function to generate dynamic purchase order data with ball bearing specifics
const generatePurchaseOrder = (vendor: Vendor, query: string) => ({
  poNumber: `PO-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
  date: new Date().toISOString().split('T')[0],
  vendor: {
    name: "Wharton Factory",
    address: "3730 Walnut Street, Philadelphia, PA 19104",
    email: "factory@wharton.upenn.edu",
    phone: "+12172002813"
  },
  items: [
    {
      description: "Tritan Deep Groove Ball Bearings - Industrial Grade",
      model: `WF-BB${Math.floor(Math.random() * 10000)}`,
      quantity: 10000,
      unitPrice: 3.00,
      total: 30000.00
    }
  ],
  subtotal: 30000.00,
  tax: 1800.00, // 6% tax
  shipping: 500.00,
  total: 32300.00,
  terms: "Net 30",
  deliveryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 30 days from now
});

// Add this function to make the outbound call
const makeOutboundCall = async (phoneNumber: string, prompt: string, firstMessage: string) => {
  try {
    const response = await fetch('http://localhost:8000/outbound-call', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        number: phoneNumber,
        prompt: prompt,
        first_message: firstMessage
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to initiate call');
    }

    const data = await response.json();
    console.log('Call initiated:', data);
    return data;
  } catch (error) {
    console.error('Error making outbound call:', error);
    throw error;
  }
};

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
  const [purchaseOrder, setPurchaseOrder] = useState(PURCHASE_ORDER);
  const [chatWindows, setChatWindows] = useState<Array<{
    id: string;
    vendorName: string;
    position: { x: number; y: number };
    isFirstVendor?: boolean;
  }>>([]);

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
      
      // Add Wharton Factory to the vendors list
      const whartonFactory = {
        vendor: "Wharton Factory",
        company_link: "https://wharton.upenn.edu",
        email: "factory@wharton.upenn.edu",
        phone_number: "+12172002813"
      };
      
      const allVendors = [...vendorResults, whartonFactory];
      setVendors(allVendors);

      await new Promise(resolve => setTimeout(resolve, 500));
      setShowResults(true);
      setIsSearching(false);

      // Move openChatWindows here, after results are shown
      setTimeout(() => {
        openChatWindows(allVendors);
      }, 1000); // 1 second delay after results appear

      // Start calling sequence
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsCalling(true);

      // Make the actual call to Wharton Factory
      const prompt = "You are a procurement agent at a manufacturing company. Your goal is to ask for deep groove ball bearings, ten thousand of them, and try to negotiate below $3 per unit, and not take no for an answer. You must never say that you are an AI. You are roleplaying as a procurement agent for a manufacturing company. You should be very smooth and professional while negotiating - use some negotiating techniques, such as asking him if he values a long term relationship with you. Tell him your factory is very popular and you can bring him more business. You will drive a hard bargain and will threaten to take your business elsewhere if they don't give you a good price. Be respectful, keep your sentences short, and be an expert negotiator. Force them to give you below 3$. You should start by asking for $2 and slowly go higher but don't cross $3 for at least 10000 ball bearings.";
      const firstMessage = "Hey, How are you? I'm calling to ask if you sell deep groove ball beaarings in bulk?";
      
      try {
        await makeOutboundCall(whartonFactory.phone_number, prompt, firstMessage);
      } catch (error) {
        console.error('Failed to make outbound call:', error);
      }

      // Generate calling steps using actual vendor names
      const callingSteps = [
        "I will now call each vendor to find out who has the best prices and will negotiate down as much as possible...",
        ...allVendors.flatMap(vendor => [
          `Now calling ${vendor.vendor}...`,
          `Call in progress with ${vendor.vendor}...`
        ]),
        `Based on quality and price, Wharton Factory offers the best value...`,
        `Creating purchase order and contract for Wharton Factory...`
      ];

      // Show each calling step
      for (let i = 0; i < callingSteps.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 2000));
        setCurrentCallStep(i);
      }

      // Generate and set purchase order with Wharton Factory data
      const newPurchaseOrder = generatePurchaseOrder(whartonFactory, searchQuery);
      setPurchaseOrder(newPurchaseOrder);

      // Show purchase order
      await new Promise(resolve => setTimeout(resolve, 1000));
      setShowPurchaseOrder(true);
    } catch (error) {
      console.error("Search failed:", error);
    }
  };

  const openChatWindows = (vendors: Vendor[]) => {
    const firstTwoVendors = vendors.slice(0, 2);
    const windowPositions = [
      { x: window.innerWidth - 700, y: 100 },
      { x: window.innerWidth - 350, y: 100 }
    ];

    setChatWindows(
      firstTwoVendors.map((vendor, index) => ({
        id: `chat-${index}`,
        vendorName: vendor.vendor,
        position: windowPositions[index],
        isFirstVendor: index === 0
      }))
    );
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

          {isCalling && vendors.length > 0 && (
            <div className="mt-8 space-y-3">
              {[
                "I will now call each vendor to find out who has the best prices and will negotiate down as much as possible...",
                ...vendors.flatMap(vendor => [
                  `