import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "../Index";
import RestockSchedules from "./pages/RestockSchedules";
import NotFound from "./pages/NotFound";
import NewOrder from "./pages/NewOrder";
import ShipmentManagement from "./pages/ShipmentManagement"; // added import

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/restock-schedules" element={<RestockSchedules />} />
          <Route path="/new-order" element={<NewOrder />} />
          <Route path="/shipment-management" element={<ShipmentManagement />} /> {/* added route */}
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
