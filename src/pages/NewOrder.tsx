import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

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

const SEARCH_STEPS = [
  "Searching for vendors near Philadelphia...",
  "Finding the highest quality 5-axis CNC machine spindle motors...",
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
  "Call in progress with Eastern Motors Supply..."
];

const NewOrder = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [isCalling, setIsCalling] = useState(false);
  const [currentCallStep, setCurrentCallStep] = useState(0);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    setShowResults(false);
    setCurrentStep(0);
    setIsCalling(false);
    setCurrentCallStep(0);

    // Simulate step-by-step search process
    for (let i = 0; i < SEARCH_STEPS.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setCurrentStep(i);
    }

    // Show results after steps complete
    await new Promise(resolve => setTimeout(resolve, 1000));
    setShowResults(true);
    setIsSearching(false);

    // Start calling sequence after a brief pause
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsCalling(true);

    // Simulate calling steps
    for (let i = 0; i < CALLING_STEPS.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 2000)); // Longer delay for calls
      setCurrentCallStep(i);
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
              {SEARCH_STEPS.map((step, index) => (
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
                    {DUMMY_VENDORS.map((vendor) => (
                      <TableRow key={vendor.name} className="hover:bg-muted/50">
                        <TableCell className="py-4 text-base font-medium">{vendor.name}</TableCell>
                        <TableCell className="py-4 text-base">{vendor.website}</TableCell>
                        <TableCell className="py-4 text-base">{vendor.email}</TableCell>
                        <TableCell className="py-4 text-base">{vendor.phone}</TableCell>
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
        </div>
      </Card>
    </div>
  );
};

export default NewOrder; 