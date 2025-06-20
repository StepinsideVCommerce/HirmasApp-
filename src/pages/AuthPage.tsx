import React, { useState } from "react";
import bcrypt from "bcryptjs";
import { hermasAdminSupabase } from "../integrations/supabase/client";
import { Database } from "../integrations/supabase/types";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { useToast } from "../hooks/use-toast";
import { useNavigate } from "react-router-dom";

const saltRounds = 10;

type ShiftManager = Database["public"]["Tables"]["ShiftManagers"]["Row"];

type AuthMode = "signin" | "signup";

export default function AuthPage({
  onAuthSuccess,
}: {
  onAuthSuccess: (user: ShiftManager) => void;
}) {
  const [mode, setMode] = useState<AuthMode>("signin");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phoneNumber: "",
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const resetForm = () =>
    setForm({ name: "", email: "", password: "", phoneNumber: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (
      !form.email ||
      !form.password ||
      (mode === "signup" && (!form.name || !form.phoneNumber))
    ) {
      toast({ title: "All fields are required", variant: "destructive" });
      setLoading(false);
      return;
    }
    if (mode === "signup") {
      // Check if email exists
      const { data: exists } = await hermasAdminSupabase
        .from("ShiftManagers")
        .select("id")
        .eq("email", form.email)
        .maybeSingle();
      if (exists) {
        toast({ title: "Email already exists", variant: "destructive" });
        setLoading(false);
        return;
      }
      // Hash password
      const hash = await bcrypt.hash(form.password, saltRounds);
      const { data, error } = await hermasAdminSupabase
        .from("ShiftManagers")
        .insert([
          {
            name: form.name,
            email: form.email,
            password: hash,
            phoneNumber: form.phoneNumber,
          },
        ])
        .select()
        .maybeSingle();
      if (error || !data) {
        toast({
          title: "Sign up failed",
          description: error?.message,
          variant: "destructive",
        });
        setLoading(false);
        return;
      }
      toast({ title: "Sign up successful", variant: "default" });
      onAuthSuccess(data);
      resetForm();
      navigate("/ride-requests");
    } else {
      // Sign in
      const { data: user, error } = await hermasAdminSupabase
        .from("ShiftManagers")
        .select("*")
        .eq("email", form.email)
        .maybeSingle();
      if (error) {
        toast({
          title: "Sign in failed",
          description: error.message,
          variant: "destructive",
        });
        setLoading(false);
        return;
      }
      if (!user) {
        toast({ title: "Invalid email or password", variant: "destructive" });
        setLoading(false);
        return;
      }
      const match = await bcrypt.compare(form.password, user.password);
      if (!match) {
        toast({ title: "Invalid email or password", variant: "destructive" });
        setLoading(false);
        return;
      }
      toast({ title: "Sign in successful", variant: "default" });
      onAuthSuccess(user);
      resetForm();
      navigate("/ride-requests");
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900">
      <div className="w-full max-w-md p-8 rounded-2xl shadow-2xl border border-slate-800 bg-gradient-to-br from-slate-800/90 to-blue-900/80 relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/20 rounded-full blur-2xl animate-pulse" />
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-indigo-400/20 rounded-full blur-2xl animate-pulse" />
        <h2 className="text-3xl font-extrabold mb-8 text-center text-white drop-shadow-lg tracking-tight">
          {mode === "signup"
            ? "Create Your Shift Manager Account"
            : "Welcome Back, Shift Manager"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {mode === "signup" && (
            <Input
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              disabled={loading}
              required
              className="bg-slate-900/80 border-slate-700 text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500"
            />
          )}
          <Input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            disabled={loading}
            required
            className="bg-slate-900/80 border-slate-700 text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500"
          />
          <Input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            disabled={loading}
            required
            className="bg-slate-900/80 border-slate-700 text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500"
          />
          {mode === "signup" && (
            <Input
              name="phoneNumber"
              placeholder="Phone Number"
              value={form.phoneNumber}
              onChange={handleChange}
              disabled={loading}
              required
              className="bg-slate-900/80 border-slate-700 text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500"
            />
          )}
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-500 hover:from-blue-700 hover:to-indigo-600 text-white font-semibold py-2 rounded-lg shadow-lg transition-all duration-200"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z"
                  ></path>
                </svg>
                Please wait...
              </span>
            ) : mode === "signup" ? (
              "Sign Up"
            ) : (
              "Sign In"
            )}
          </Button>
        </form>
        <div className="mt-6 text-center">
          <button
            type="button"
            className="text-blue-400 hover:text-blue-300 underline font-medium transition-colors duration-150"
            onClick={() => setMode(mode === "signup" ? "signin" : "signup")}
            disabled={loading}
          >
            {mode === "signup"
              ? "Already have an account? Sign In"
              : "Don’t have an account? Sign Up"}
          </button>
        </div>
      </div>
    </div>
  );
}
