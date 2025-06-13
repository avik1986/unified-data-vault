
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Navigation from "./components/Navigation";
import Dashboard from "./pages/Dashboard";
import Categories from "./pages/Categories";
import Geographies from "./pages/Geographies";
import Roles from "./pages/Roles";
import Users from "./pages/Users";
import Attributes from "./pages/Attributes";
import Entities from "./pages/Entities";
import ApprovalRules from "./pages/ApprovalRules";
import Approvals from "./pages/Approvals";
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
                <Route path="/geographies" element={<Geographies />} />
                <Route path="/roles" element={<Roles />} />
                <Route path="/users" element={<Users />} />
                <Route path="/attributes" element={<Attributes />} />
                <Route path="/entities" element={<Entities />} />
                <Route path="/approval-rules" element={<ApprovalRules />} />
                <Route path="/approvals" element={<Approvals />} />
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
