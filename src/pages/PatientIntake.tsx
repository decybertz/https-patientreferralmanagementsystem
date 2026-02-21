import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Building2, UserPlus, CheckCircle2, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const departments = [
  "General Practice",
  "Pediatrics",
  "Cardiology",
  "Orthopedics",
  "Dermatology",
  "ENT",
  "Gynecology",
  "Neurology",
];

const insuranceProviders = ["NHIF", "AAR", "Jubilee", "Britam", "CIC", "Madison", "UAP", "None / Self-Pay"];

const PatientIntake = () => {
  const [submitted, setSubmitted] = useState(false);
  const [queueNumber, setQueueNumber] = useState<number | null>(null);
  const [assignedDoctor, setAssignedDoctor] = useState("");
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    idNumber: "",
    dateOfBirth: "",
    gender: "",
    department: "",
    insuranceProvider: "",
    insuranceMemberNumber: "",
    symptoms: "",
  });

  const update = (field: string, value: string) => setForm((p) => ({ ...p, [field]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fullName || !form.phone || !form.department) {
      toast.error("Please fill in all required fields");
      return;
    }
    // Mock allocation
    const mockDoctors: Record<string, string[]> = {
      "General Practice": ["Dr. Amina Wanjiku", "Dr. John Omondi"],
      Pediatrics: ["Dr. Grace Muthoni"],
      Cardiology: ["Dr. Peter Kamau"],
      Orthopedics: ["Dr. Sarah Njeri"],
      Dermatology: ["Dr. James Otieno"],
      ENT: ["Dr. Lucy Achieng"],
      Gynecology: ["Dr. Faith Wambui"],
      Neurology: ["Dr. David Kiprop"],
    };
    const doctors = mockDoctors[form.department] || ["Dr. General Practitioner"];
    const doctor = doctors[Math.floor(Math.random() * doctors.length)];
    const queue = Math.floor(Math.random() * 15) + 1;

    setAssignedDoctor(doctor);
    setQueueNumber(queue);
    setSubmitted(true);
    toast.success("You have been added to the queue!");
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.4 }}>
          <Card className="max-w-md w-full text-center">
            <CardContent className="pt-8 pb-8 space-y-6">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-2">You're in the Queue!</h2>
                <p className="text-muted-foreground">Please wait to be called.</p>
              </div>
              <div className="bg-muted/50 rounded-xl p-6 space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground text-sm">Queue Number</span>
                  <Badge variant="default" className="text-lg px-4 py-1">{queueNumber}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground text-sm">Department</span>
                  <span className="text-sm font-medium text-foreground">{form.department}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground text-sm">Assigned Doctor</span>
                  <span className="text-sm font-medium text-foreground">{assignedDoctor}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground text-sm">Status</span>
                  <Badge variant="secondary" className="gap-1">
                    <Clock className="w-3 h-3" /> Waiting
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground text-sm">Est. Wait</span>
                  <span className="text-sm font-medium text-foreground">~{(queueNumber || 1) * 8} min</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                You will be notified when it's your turn. Please stay in the waiting area.
              </p>
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => { setSubmitted(false); setForm({ fullName: "", phone: "", idNumber: "", dateOfBirth: "", gender: "", department: "", insuranceProvider: "", insuranceMemberNumber: "", symptoms: "" }); }}>
                  New Patient
                </Button>
                <Button asChild className="flex-1">
                  <Link to="/queue-status">View Queue</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-primary-foreground py-6">
        <div className="container mx-auto px-4 flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-primary-foreground/20 flex items-center justify-center">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold">MedRefer</h1>
              <p className="text-xs opacity-80">Patient Check-In Kiosk</p>
            </div>
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <UserPlus className="w-7 h-7 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">Patient Registration</h2>
            <p className="text-muted-foreground mt-1">Enter your details to join the queue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Info */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-base">Personal Information</CardTitle>
                <CardDescription>Required fields marked with *</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Full Name *</label>
                    <Input placeholder="John Doe" value={form.fullName} onChange={(e) => update("fullName", e.target.value)} required />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Phone Number *</label>
                    <Input placeholder="0712 345 678" value={form.phone} onChange={(e) => update("phone", e.target.value)} required />
                  </div>
                </div>
                <div className="grid sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">ID/Passport No.</label>
                    <Input placeholder="12345678" value={form.idNumber} onChange={(e) => update("idNumber", e.target.value)} />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Date of Birth</label>
                    <Input type="date" value={form.dateOfBirth} onChange={(e) => update("dateOfBirth", e.target.value)} />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Gender</label>
                    <Select value={form.gender} onValueChange={(v) => update("gender", v)}>
                      <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Department */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-base">Department *</CardTitle>
                <CardDescription>Select the department you need to visit</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {departments.map((dept) => (
                    <button
                      key={dept}
                      type="button"
                      onClick={() => update("department", dept)}
                      className={`p-3 rounded-lg border text-sm font-medium transition-all text-left ${
                        form.department === dept
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border bg-card text-muted-foreground hover:border-primary/50"
                      }`}
                    >
                      {dept}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Insurance */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-base">Insurance / NHIF Details</CardTitle>
                <CardDescription>Optional — helps speed up billing</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Insurance Provider</label>
                    <Select value={form.insuranceProvider} onValueChange={(v) => update("insuranceProvider", v)}>
                      <SelectTrigger><SelectValue placeholder="Select provider" /></SelectTrigger>
                      <SelectContent>
                        {insuranceProviders.map((p) => (
                          <SelectItem key={p} value={p}>{p}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Member Number</label>
                    <Input placeholder="e.g. NHIF-123456" value={form.insuranceMemberNumber} onChange={(e) => update("insuranceMemberNumber", e.target.value)} />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Symptoms */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-base">Brief Description of Symptoms</CardTitle>
              </CardHeader>
              <CardContent>
                <textarea
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 min-h-[80px]"
                  placeholder="Briefly describe your symptoms..."
                  value={form.symptoms}
                  onChange={(e) => update("symptoms", e.target.value)}
                />
              </CardContent>
            </Card>

            <Button type="submit" className="w-full h-12 text-base" size="lg">
              <UserPlus className="w-5 h-5 mr-2" />
              Check In & Join Queue
            </Button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default PatientIntake;
