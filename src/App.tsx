
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Navigation from "./components/Navigation";
import Dashboard from "./pages/Dashboard";
import Categories from "./pages/Categories";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen flex w-full bg-gray-50">
            <Navigation />
            <main className="flex-1 p-8">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/categories" element={<Categories />} />
                <Route path="/geographies" element={<div>Geographies - Coming Soon</div>} />
                <Route path="/roles" element={<div>Roles - Coming Soon</div>} />
                <Route path="/users" element={<div>Users - Coming Soon</div>} />
                <Route path="/attributes" element={<div>Attributes - Coming Soon</div>} />
                <Route path="/entities" element={<div>Entities - Coming Soon</div>} />
                <Route path="/approval-rules" element={<div>Approval Rules - Coming Soon</div>} />
                <Route path="/approvals" element={<div>Approvals - Coming Soon</div>} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
