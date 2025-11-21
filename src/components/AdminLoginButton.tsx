import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Shield } from "lucide-react";

export function AdminLoginButton() {
  return (
    <div className="fixed bottom-6 right-6 z-40">
      <Link to="/login?admin=true">
        <Button
          size="lg"
          className="bg-gray-900 hover:bg-gray-800 text-white shadow-lg gap-2 rounded-full"
        >
          <Shield className="w-5 h-5" />
          Admin Login
        </Button>
      </Link>
    </div>
  );
}
