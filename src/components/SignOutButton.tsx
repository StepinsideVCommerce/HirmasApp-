import React from "react";
import { Button } from "./ui/button";

export default function SignOutButton({
  onSignOut,
}: {
  onSignOut: () => void;
}) {
  return (
    <Button
      onClick={onSignOut}
      className="fixed top-4 right-4 z-50 bg-gradient-to-r from-red-600 to-pink-500 hover:from-red-700 hover:to-pink-600 text-white font-semibold px-4 py-2 rounded-lg shadow-lg transition-all duration-200"
    >
      Sign Out
    </Button>
  );
}
