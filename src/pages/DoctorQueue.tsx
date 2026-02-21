import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Building2, UserCheck, SkipForward, Clock, Activity, CheckCircle2, Bell } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

interface Patient {
  id: string;
  queueNumber: number;
  name: string;
  age: number;
  gender: string;
  symptoms: string;
  insurance: string;
  status: "Waiting" | "In-Consultation" | "Completed";
  checkInTime: string;
}

const initialPatients: Patient[] = [
  { id: "1", queueNumber: 1, name: "James Mwangi", age: 34, gender: "Male", symptoms: "Chest pain, shortness of breath", insurance: "NHIF", status: "In-Consultation", checkInTime: "08:15" },
  { id: "2", queueNumber: 2, name: "Mary Njeri", age: 28, gender: "Female", symptoms: "Persistent headache, dizziness", insurance: "AAR", status: "Waiting", checkInTime: "08:22" },
  { id: "3", queueNumber: 3, name: "Peter Ochieng", age: 45, gender: "Male", symptoms: "Joint pain, swelling in knee", insurance: "NHIF", status: "Waiting", checkInTime: "08:30" },
  { id: "4", queueNumber: 4, name: "Grace Akinyi", age: 52, gender: "Female", symptoms: "Fatigue, frequent urination", insurance: "Jubilee", status: "Waiting", checkInTime: "08:35" },
  { id: "5", queueNumber: 5, name: "David Kipchoge", age: 19, gender: "Male", symptoms: "Sore throat, fever", insurance: "None", status: "Waiting", checkInTime: "08:40" },
];

const DoctorQueue = () => {
  const [patients, setPatients] = useState<Patient[]>(initialPatients);
  const [notification, setNotification] = useState<string | null>(null);

  const currentPatient = patients.find((p) => p.status === "In-Consultation");
  const waitingPatients = patients.filter((p) => p.status === "Waiting");
  const completedPatients = patients.filter((p) => p.status === "Completed");

  const handleComplete = () => {
    if (!currentPatient) return;

    setPatients((prev) => {
      const updated = prev.map((p) => (p.id === currentPatient.id ? { ...p, status: "Completed" as const } : p));
      const nextWaiting = updated.find((p) => p.status === "Waiting");
      if (nextWaiting) {
        const msg = `🔔 ${nextWaiting.name}, it is your turn! Please proceed to Dr. Amina Wanjiku — Room R-101.`;
        setNotification(msg);
        toast.success(msg);
        return updated.map((p) => (p.id === nextWaiting.id ? { ...p, status: "In-Consultation" as const } : p));
      }
      toast.info("No more patients in the queue.");
      return updated;
    });

    setTimeout(() => setNotification(null), 5000);
  };

  const handleSkip = () => {
    if (!currentPatient) return;

    setPatients((prev) => {
      // Move current to end of waiting
      const withoutCurrent = prev.filter((p) => p.id !== currentPatient.id);
      const nextWaiting = withoutCurrent.find((p) => p.status === "Waiting");
      const requeued = { ...currentPatient, status: "Waiting" as const };

      if (nextWaiting) {
        const msg = `🔔 ${nextWaiting.name}, it is your turn! Please proceed to Dr. Amina Wanjiku — Room R-101.`;
        setNotification(msg);
        toast.success(msg);
        return [
          ...withoutCurrent.map((p) => (p.id === nextWaiting.id ? { ...p, status: "In-Consultation" as const } : p)),
          requeued,
        ];
      }
      return [...withoutCurrent, requeued];
    });

    setTimeout(() => setNotification(null), 5000);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-primary-foreground py-4 border-b">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary-foreground/20 flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold">Doctor's Queue</h1>
              <p className="text-xs opacity-80">Dr. Amina Wanjiku — Room R-101</p>
            </div>
          </Link>
          <Button asChild variant="secondary" size="sm">
            <Link to="/queue-status">Hospital Dashboard</Link>
          </Button>
        </div>
      </div>

      {/* Notification Banner */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-emerald-500 text-white py-3 px-4"
          >
            <div className="container mx-auto flex items-center gap-2 text-sm font-medium">
              <Bell className="w-4 h-4 flex-shrink-0" />
              {notification}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Current Patient */}
        <Card className="border-primary/30 bg-primary/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Activity className="w-4 h-4 text-primary" />
              Current Patient
            </CardTitle>
          </CardHeader>
          <CardContent>
            {currentPatient ? (
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-foreground">{currentPatient.name}</h3>
                    <p className="text-sm text-muted-foreground">{currentPatient.age} yrs, {currentPatient.gender} · Queue #{currentPatient.queueNumber}</p>
                  </div>
                  <Badge variant="default" className="gap-1"><Activity className="w-3 h-3" /> In-Consultation</Badge>
                </div>
                <div className="bg-background rounded-lg p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Symptoms</span>
                    <span className="text-foreground font-medium">{currentPatient.symptoms}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Insurance</span>
                    <span className="text-foreground font-medium">{currentPatient.insurance}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Check-in Time</span>
                    <span className="text-foreground font-medium">{currentPatient.checkInTime}</span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button onClick={handleComplete} className="flex-1 gap-2">
                    <CheckCircle2 className="w-4 h-4" /> Mark Completed
                  </Button>
                  <Button onClick={handleSkip} variant="outline" className="flex-1 gap-2">
                    <SkipForward className="w-4 h-4" /> Skip / Next
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-6">No patient currently in consultation.</p>
            )}
          </CardContent>
        </Card>

        {/* Waiting List */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-500" />
              Waiting ({waitingPatients.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {waitingPatients.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No patients waiting.</p>
            ) : (
              waitingPatients.map((p, i) => (
                <motion.div
                  key={p.id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/40 border border-border/50"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 flex items-center justify-center text-sm font-bold">
                      {i + 1}
                    </span>
                    <div>
                      <p className="font-medium text-foreground text-sm">{p.name}</p>
                      <p className="text-xs text-muted-foreground">{p.symptoms}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Queue #{p.queueNumber}</p>
                    <p className="text-xs text-muted-foreground">{p.checkInTime}</p>
                  </div>
                </motion.div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Completed */}
        {completedPatients.length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                Completed ({completedPatients.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {completedPatients.map((p) => (
                <div key={p.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/20 opacity-60">
                  <div className="flex items-center gap-3">
                    <UserCheck className="w-5 h-5 text-emerald-500" />
                    <p className="font-medium text-foreground text-sm">{p.name}</p>
                  </div>
                  <p className="text-xs text-muted-foreground">Queue #{p.queueNumber}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default DoctorQueue;
