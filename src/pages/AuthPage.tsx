import React, { useState } from "react";
import bcrypt from "bcryptjs";
import { hermasAdminSupabase } from "../integrations/supabase/client";
import { Database } from "../integrations/supabase/types";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { useToast } from "../hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Label } from "../components/ui/label";
import { Eye, EyeOff, Lock, Mail, User, Phone } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";

const saltRounds = 10;

type ShiftManager = Database["public"]["Tables"]["ShiftManagers"]["Row"];

type AuthMode = "signin" | "signup";
const GOLD = "#D4AF37";
export default function AuthPage({
  onAuthSuccess,
}: {
  onAuthSuccess: (user: ShiftManager) => void;
}) {
  // Remove mode, use tab for logic and UI
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    eventCode: "",
  });
  const [countryCode, setCountryCode] = useState("+1");
  const [events, setEvents] = useState<any[]>([]);
  React.useEffect(() => {
    async function fetchEvents() {
      const { data, error } = await hermasAdminSupabase
        .from("Events")
        .select("id, event_code");
      if (!error && data) setEvents(data);
    }
    fetchEvents();
  }, []);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const [tab, setTab] = useState<"login" | "signup">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => {
      const updated = { ...prev, [name]: value };
      if (name === "password" || name === "confirmPassword") {
        if (
          updated.password &&
          updated.confirmPassword &&
          updated.password !== updated.confirmPassword
        ) {
          setPasswordError("Passwords do not match");
        } else {
          setPasswordError(null);
        }
      }
      return updated;
    });
  };

  const resetForm = () =>
    setForm({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      phoneNumber: "",
      eventCode: "",
    });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (
      !form.email ||
      !form.password ||
      (tab === "signup" &&
        (!form.firstName ||
          !form.phoneNumber ||
          !form.confirmPassword ||
          !form.eventCode))
    ) {
      toast({ title: "All fields are required", variant: "destructive" });
      setLoading(false);
      return;
    }
    if (tab === "signup") {
      if (form.password !== form.confirmPassword) {
        toast({ title: "Passwords do not match", variant: "destructive" });
        setLoading(false);
        return;
      }
      // Check event code
      const eventMatch = events.find(
        (ev) => String(ev.event_code) === String(form.eventCode)
      );
      if (!eventMatch) {
        toast({ title: "Invalid event code", variant: "destructive" });
        setLoading(false);
        return;
      }
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
      const fullPhoneNumber = `${countryCode}${form.phoneNumber}`;
      const { data, error } = await hermasAdminSupabase
        .from("ShiftManagers")
        .insert([
          {
            firstName: form.firstName,
            lastName: form.lastName,
            email: form.email,
            password: hash,
            phoneNumber: fullPhoneNumber,
            event_id: eventMatch.id,
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
      // Fetch event object and add to shift manager
      let eventObj = null;
      if (data?.event_id) {
        const { data: eventData } = await hermasAdminSupabase
          .from("Events")
          .select("*")
          .eq("id", data.event_id)
          .maybeSingle();
        if (eventData) eventObj = eventData;
      }
      const shiftManagerWithEvent = { ...data, event: eventObj };
      toast({ title: "Sign up successful", variant: "default" });
      onAuthSuccess(shiftManagerWithEvent);
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
      // Fetch event object and add to shift manager
      let eventObj = null;
      if (user?.event_id) {
        const { data: eventData } = await hermasAdminSupabase
          .from("Events")
          .select("*")
          .eq("id", user.event_id)
          .maybeSingle();
        if (eventData) eventObj = eventData;
      }
      const shiftManagerWithEvent = { ...user, event: eventObj };
      toast({ title: "Sign in successful", variant: "default" });
      onAuthSuccess(shiftManagerWithEvent);
      resetForm();
      navigate("/ride-requests");
    }
    setLoading(false);
  };

  return (
    <div
      className="w-screen h-screen flex items-center justify-center relative overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse at center, #181818 0%, #0a0a0a 100%)",
      }}
    >
      {/* subtle gold glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute -top-24 -left-24 w-72 h-72 rounded-full opacity-20 blur-3xl"
          style={{ background: GOLD }}
        />
        <div
          className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full opacity-15 blur-3xl"
          style={{ background: GOLD }}
        />
      </div>

      {/* widened container */}
      <div className="relative z-10 w-full max-w-xl">
        {/* Logo + title */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-4">
            <img
              src="https://hirmasgroup.com/wp-content/themes/bootscore-child-main/img/logo/logo.svg"
              alt="Hirmas Logo"
              className="h-12 w-auto"
            />
          </div>
          <div
            className="mx-auto"
            style={{
              width: 180,
              height: 2,
              background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`,
            }}
          />
          <p className="text-neutral-300 mt-4 text-lg">
            Organizing exhibitions and conferences Company
          </p>
        </div>

        <Card
          className="border-0 bg-white"
          style={{
            borderRadius: 20,
            boxShadow:
              "0 16px 36px rgba(0,0,0,0.35), 0 0 16px rgba(212,175,55,0.18)",
          }}
        >
          <CardContent className="pb-8 pt-4">
            <Tabs
              value={tab}
              onValueChange={(v) => setTab(v as "login" | "signup")}
              className="space-y-8"
            >
              {/* Elegant segmented toggle (bigger) */}
              <div className="relative">
                <TabsList
                  className="grid w-full grid-cols-2 rounded-full p-0"
                  style={{
                    background: "black",
                    border: `1px solid ${GOLD}80`,
                    boxShadow: "inset 0 0 12px rgba(212,175,55,0.12)",
                    backdropFilter: "blur(6px)",
                    position: "relative",
                    height: 48, // taller control
                  }}
                >
                  {/* sliding pill (full height / half width / black bg) */}
                  <span
                    aria-hidden
                    className="absolute top-0 bottom-0 rounded-full transition-all duration-300"
                    style={{
                      left: tab === "login" ? "0%" : "50%",
                      width: "50%",
                      background: "black",
                      border: `1px solid ${GOLD}`,
                      boxShadow: "0 0 14px rgba(212,175,55,0.45)",
                    }}
                  />
                  <TabsTrigger
                    value="login"
                    className="relative z-10 rounded-full font-semibold transition-colors"
                    style={{ color: GOLD, fontSize: 16 }}
                  >
                    Sign In
                  </TabsTrigger>
                  <TabsTrigger
                    value="signup"
                    className="relative z-10 rounded-full font-semibold transition-colors"
                    style={{ color: GOLD, fontSize: 16 }}
                  >
                    Sign Up
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* Login */}
              <TabsContent value="login" className="space-y-5">
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <Label
                      htmlFor="login-email"
                      className="text-neutral-700 text-base"
                    >
                      Email
                    </Label>
                    <div className="relative">
                      <Mail
                        className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5"
                        style={{ color: GOLD }}
                      />
                      <Input
                        id="login-email"
                        name="email"
                        type="email"
                        placeholder="Enter your email"
                        className="pl-12 bg-white border-neutral-200 text-black placeholder:text-neutral-400 focus-visible:ring-1 text-base h-12"
                        style={{
                          borderColor: "rgba(0,0,0,0.15)",
                          outline: "none",
                          boxShadow: "none",
                        }}
                        onFocus={(e) =>
                          (e.currentTarget.style.borderColor = GOLD)
                        }
                        onBlur={(e) =>
                          (e.currentTarget.style.borderColor =
                            "rgba(0,0,0,0.15)")
                        }
                        value={form.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="login-password"
                      className="text-neutral-700 text-base"
                    >
                      Password
                    </Label>
                    <div className="relative">
                      <Lock
                        className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5"
                        style={{ color: GOLD }}
                      />
                      <Input
                        id="login-password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        className="pl-12 pr-12 bg-white border-neutral-200 text-black placeholder:text-neutral-400 focus-visible:ring-1 text-base h-12"
                        style={{
                          borderColor: "rgba(0,0,0,0.15)",
                          outline: "none",
                          boxShadow: "none",
                        }}
                        onFocus={(e) =>
                          (e.currentTarget.style.borderColor = GOLD)
                        }
                        onBlur={(e) =>
                          (e.currentTarget.style.borderColor =
                            "rgba(0,0,0,0.15)")
                        }
                        value={form.password}
                        onChange={handleChange}
                        required
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2"
                        style={{ color: GOLD }}
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label="Toggle password visibility"
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="text-right">
                    <Button
                      variant="ghost"
                      className="text-sm p-0 h-auto"
                      style={{ color: GOLD }}
                    >
                      Forgot password?
                    </Button>
                  </div>

                  <Button
                    type="submit"
                    className="w-full rounded-lg transition-all duration-300 text-base h-12"
                    style={{
                      background: "#000",
                      color: GOLD,
                      border: `1px solid ${GOLD}`,
                      boxShadow: "0 0 0 rgba(212,175,55,0)",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.boxShadow =
                        "0 0 10px rgba(212,175,55,0.55)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.boxShadow =
                        "0 0 0 rgba(212,175,55,0)")
                    }
                  >
                    Sign In
                  </Button>
                </form>
              </TabsContent>

              {/* Signup */}
              <TabsContent value="signup" className="space-y-5">
                <form onSubmit={handleSubmit} className="space-y-5">
                  <Label
                    htmlFor="event-code"
                    className="text-neutral-700 text-base"
                  >
                    Event Code
                  </Label>
                  <div className="relative">
                    <Input
                      id="event-code"
                      name="eventCode"
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]{6}"
                      maxLength={6}
                      placeholder="Enter 6-digit event code"
                      className="pl-12 bg-white border-neutral-200 text-black placeholder:text-neutral-400 focus-visible:ring-1 text-base h-12"
                      style={{
                        borderColor: "rgba(0,0,0,0.15)",
                        outline: "none",
                        boxShadow: "none",
                      }}
                      onFocus={(e) =>
                        (e.currentTarget.style.borderColor = GOLD)
                      }
                      onBlur={(e) =>
                        (e.currentTarget.style.borderColor = "rgba(0,0,0,0.15)")
                      }
                      value={form.eventCode}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <Label
                        htmlFor="first-name"
                        className="text-neutral-700 text-base"
                      >
                        First Name
                      </Label>
                      <div className="relative">
                        <User
                          className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5"
                          style={{ color: GOLD }}
                        />
                        <Input
                          id="first-name"
                          name="firstName"
                          placeholder="First name"
                          className="pl-12 bg-white border-neutral-200 text-black placeholder:text-neutral-400 focus-visible:ring-1 text-base h-12"
                          style={{
                            borderColor: "rgba(0,0,0,0.15)",
                            outline: "none",
                            boxShadow: "none",
                          }}
                          onFocus={(e) =>
                            (e.currentTarget.style.borderColor = GOLD)
                          }
                          onBlur={(e) =>
                            (e.currentTarget.style.borderColor =
                              "rgba(0,0,0,0.15)")
                          }
                          value={form.firstName}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="last-name"
                        className="text-neutral-700 text-base"
                      >
                        Last Name
                      </Label>
                      <div className="relative">
                        <User
                          className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5"
                          style={{ color: GOLD }}
                        />
                        <Input
                          id="last-name"
                          name="lastName"
                          placeholder="Last name"
                          className="pl-12 bg-white border-neutral-200 text-black placeholder:text-neutral-400 focus-visible:ring-1 text-base h-12"
                          style={{
                            borderColor: "rgba(0,0,0,0.15)",
                            outline: "none",
                            boxShadow: "none",
                          }}
                          onFocus={(e) =>
                            (e.currentTarget.style.borderColor = GOLD)
                          }
                          onBlur={(e) =>
                            (e.currentTarget.style.borderColor =
                              "rgba(0,0,0,0.15)")
                          }
                          value={form.lastName}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="signup-email"
                      className="text-neutral-700 text-base"
                    >
                      Email
                    </Label>
                    <div className="relative">
                      <Mail
                        className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5"
                        style={{ color: GOLD }}
                      />
                      <Input
                        id="signup-email"
                        name="email"
                        type="email"
                        placeholder="Enter your email"
                        className="pl-12 bg-white border-neutral-200 text-black placeholder:text-neutral-400 focus-visible:ring-1 text-base h-12"
                        style={{
                          borderColor: "rgba(0,0,0,0.15)",
                          outline: "none",
                          boxShadow: "none",
                        }}
                        onFocus={(e) =>
                          (e.currentTarget.style.borderColor = GOLD)
                        }
                        onBlur={(e) =>
                          (e.currentTarget.style.borderColor =
                            "rgba(0,0,0,0.15)")
                        }
                        value={form.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="phone"
                      className="text-neutral-700 text-base"
                    >
                      Phone Number
                    </Label>
                    <div className="flex gap-2 items-center">
                      <select
                        name="countryCode"
                        defaultValue="+1"
                        className="bg-white border border-neutral-200 text-black text-base h-12 rounded px-2 focus-visible:ring-1"
                        style={{ borderColor: "rgba(0,0,0,0.15)" }}
                        onChange={(e) => setCountryCode(e.target.value)}
                      >
                        <option value="+1">🇺🇸 +1</option>
                        <option value="+44">🇬🇧 +44</option>
                        <option value="+971">🇦🇪 +971</option>
                        <option value="+91">🇮🇳 +91</option>
                        <option value="+20">🇪🇬 +20</option>
                        <option value="+61">🇦🇺 +61</option>
                        <option value="+49">🇩🇪 +49</option>
                        <option value="+33">🇫🇷 +33</option>
                        <option value="+966">🇸🇦 +966</option>
                        <option value="+81">🇯🇵 +81</option>
                        {/* Add more as needed */}
                      </select>
                      <div className="relative w-full">
                        <Phone
                          className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5"
                          style={{ color: GOLD }}
                        />
                        <Input
                          id="phone"
                          name="phoneNumber"
                          type="tel"
                          placeholder="Enter your phone number"
                          className="pl-12 bg-white border-neutral-200 text-black placeholder:text-neutral-400 focus-visible:ring-1 text-base h-12"
                          style={{
                            borderColor: "rgba(0,0,0,0.15)",
                            outline: "none",
                            boxShadow: "none",
                          }}
                          onFocus={(e) =>
                            (e.currentTarget.style.borderColor = GOLD)
                          }
                          onBlur={(e) =>
                            (e.currentTarget.style.borderColor =
                              "rgba(0,0,0,0.15)")
                          }
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="signup-password"
                      className="text-neutral-700 text-base"
                    >
                      Password
                    </Label>
                    <div className="relative">
                      <Lock
                        className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5"
                        style={{ color: GOLD }}
                      />
                      <Input
                        id="signup-password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a password"
                        className="pl-12 pr-12 bg-white border-neutral-200 text-black placeholder:text-neutral-400 focus-visible:ring-1 text-base h-12"
                        style={{
                          borderColor: "rgba(0,0,0,0.15)",
                          outline: "none",
                          boxShadow: "none",
                        }}
                        onFocus={(e) =>
                          (e.currentTarget.style.borderColor = GOLD)
                        }
                        onBlur={(e) =>
                          (e.currentTarget.style.borderColor =
                            "rgba(0,0,0,0.15)")
                        }
                        value={form.password}
                        onChange={handleChange}
                        required
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2"
                        style={{ color: GOLD }}
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label="Toggle password visibility"
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="confirm-password"
                      className="text-neutral-700 text-base"
                    >
                      Confirm Password
                    </Label>
                    <div className="relative">
                      <Lock
                        className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5"
                        style={{ color: GOLD }}
                      />
                      <Input
                        id="confirm-password"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        className="pl-12 pr-12 bg-white border-neutral-200 text-black placeholder:text-neutral-400 focus-visible:ring-1 text-base h-12"
                        style={{
                          borderColor: "rgba(0,0,0,0.15)",
                          outline: "none",
                          boxShadow: "none",
                        }}
                        onFocus={(e) =>
                          (e.currentTarget.style.borderColor = GOLD)
                        }
                        onBlur={(e) =>
                          (e.currentTarget.style.borderColor =
                            "rgba(0,0,0,0.15)")
                        }
                        value={form.confirmPassword}
                        onChange={handleChange}
                        required
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2"
                        style={{ color: GOLD }}
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        aria-label="Toggle confirm password visibility"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full rounded-lg transition-all duration-300 text-base h-12"
                    style={{
                      background: "#000",
                      color: GOLD,
                      border: `1px solid ${GOLD}`,
                      boxShadow: "0 0 0 rgba(212,175,55,0)",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.boxShadow =
                        "0 0 10px rgba(212,175,55,0.55)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.boxShadow =
                        "0 0 0 rgba(212,175,55,0)")
                    }
                  >
                    Create Account
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-6 text-sm text-neutral-300">
          <p>By continuing, you agree to our</p>
          <div className="flex items-center justify-center gap-4 mt-1">
            <Button
              variant="ghost"
              className="p-0 h-auto text-sm"
              style={{ color: GOLD }}
            >
              Terms of Service
            </Button>
            <span>•</span>
            <Button
              variant="ghost"
              className="p-0 h-auto text-sm"
              style={{ color: GOLD }}
            >
              Privacy Policy
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
