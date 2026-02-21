import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building2, Users, Clock, Activity, CheckCircle2, AlertCircle, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

type QueueStatus = "Waiting" | "In-Consultation" | "Completed";

interface QueueEntry {
  id: string;
  queueNumber: number;
  patientName: string;
  department: string;
  doctor: string;
  roomNumber: string;
  status: QueueStatus;
  checkInTime: string;
  insurance: string;
  insuranceVerified: boolean;
}

const mockQueue: QueueEntry[] = [
  { id: "1", queueNumber: 1, patientName: "James Mwangi", department: "General Practice", doctor: "Dr. Amina Wanjiku", roomNumber: "R-101", status: "In-Consultation", checkInTime: "08:15", insurance: "NHIF", insuranceVerified: true },
  { id: "2", queueNumber: 2, patientName: "Mary Njeri", department: "General Practice", doctor: "Dr. Amina Wanjiku", roomNumber: "R-101", status: "Waiting", checkInTime: "08:22", insurance: "AAR", insuranceVerified: true },
  { id: "3", queueNumber: 3, patientName: "Peter Ochieng", department: "Cardiology", doctor: "Dr. Peter Kamau", roomNumber: "R-205", status: "In-Consultation", checkInTime: "08:30", insurance: "NHIF", insuranceVerified: false },
  { id: "4", queueNumber: 4, patientName: "Grace Akinyi", department: "Pediatrics", doctor: "Dr. Grace Muthoni", roomNumber: "R-110", status: "Waiting", checkInTime: "08:35", insurance: "Jubilee", insuranceVerified: true },
  { id: "5", queueNumber: 5, patientName: "David Kipchoge", department: "Orthopedics", doctor: "Dr. Sarah Njeri", roomNumber: "R-302", status: "Waiting", checkInTime: "08:40", insurance: "None", insuranceVerified: false },
  { id: "6", queueNumber: 6, patientName: "Lucy Wambui", department: "General Practice", doctor: "Dr. John Omondi", roomNumber: "R-102", status: "In-Consultation", checkInTime: "08:10", insurance: "NHIF", insuranceVerified: true },
  { id: "7", queueNumber: 7, patientName: "Samuel Rotich", department: "ENT", doctor: "Dr. Lucy Achieng", roomNumber: "R-210", status: "Completed", checkInTime: "07:50", insurance: "Britam", insuranceVerified: true },
  { id: "8", queueNumber: 8, patientName: "Anne Chebet", department: "Dermatology", doctor: "Dr. James Otieno", roomNumber: "R-215", status: "Waiting", checkInTime: "08:50", insurance: "CIC", insuranceVerified: true },
  { id: "9", queueNumber: 9, patientName: "Brian Otieno", department: "Cardiology", doctor: "Dr. Peter Kamau", roomNumber: "R-205", status: "Waiting", checkInTime: "08:55", insurance: "NHIF", insuranceVerified: true },
  { id: "10", queueNumber: 10, patientName: "Faith Wanjiku", department: "Gynecology", doctor: "Dr. Faith Wambui", roomNumber: "R-310", status: "In-Consultation", checkInTime: "08:20", insurance: "Madison", insuranceVerified: true },
];

const statusConfig: Record<QueueStatus, { color: string; icon: React.ReactNode }> = {
  Waiting: { color: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400", icon: <Clock className="w-3 h-3" /> },
  "In-Consultation": { color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400", icon: <Activity className="w-3 h-3" /> },
  Completed: { color: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400", icon: <CheckCircle2 className="w-3 h-3" /> },
};

const QueueDashboard = () => {
  const [filter, setFilter] = useState<string>("all");
  const [deptFilter, setDeptFilter] = useState<string>("all");

  const departments = [...new Set(mockQueue.map((q) => q.department))];

  const filtered = mockQueue.filter((q) => {
    if (filter !== "all" && q.status !== filter) return false;
    if (deptFilter !== "all" && q.department !== deptFilter) return false;
    return true;
  });

  const waiting = mockQueue.filter((q) => q.status === "Waiting").length;
  const inConsultation = mockQueue.filter((q) => q.status === "In-Consultation").length;
  const completed = mockQueue.filter((q) => q.status === "Completed").length;

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
              <h1 className="text-lg font-bold">MedRefer Queue</h1>
              <p className="text-xs opacity-80">Hospital Dashboard</p>
            </div>
          </Link>
          <div className="flex items-center gap-3">
            <Button asChild variant="secondary" size="sm">
              <Link to="/patient-intake">Patient Intake</Link>
            </Button>
            <Button asChild variant="secondary" size="sm">
              <Link to="/doctor-queue">Doctor View</Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total Patients", value: mockQueue.length, icon: Users, color: "text-primary" },
            { label: "Waiting", value: waiting, icon: Clock, color: "text-amber-500" },
            { label: "In Consultation", value: inConsultation, icon: Activity, color: "text-blue-500" },
            { label: "Completed", value: completed, icon: CheckCircle2, color: "text-emerald-500" },
          ].map((s) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <Card>
                <CardContent className="p-4 flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg bg-muted flex items-center justify-center ${s.color}`}>
                    <s.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{s.value}</p>
                    <p className="text-xs text-muted-foreground">{s.label}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[180px]"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Waiting">Waiting</SelectItem>
              <SelectItem value="In-Consultation">In-Consultation</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
            </SelectContent>
          </Select>
          <Select value={deptFilter} onValueChange={setDeptFilter}>
            <SelectTrigger className="w-[200px]"><SelectValue placeholder="Department" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              {departments.map((d) => (
                <SelectItem key={d} value={d}>{d}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon"><RefreshCw className="w-4 h-4" /></Button>
        </div>

        {/* Queue Table */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Users className="w-4 h-4 text-primary" />
              Live Queue ({filtered.length} patients)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left p-3 font-medium text-muted-foreground">#</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">Patient</th>
                    <th className="text-left p-3 font-medium text-muted-foreground hidden md:table-cell">Department</th>
                    <th className="text-left p-3 font-medium text-muted-foreground hidden lg:table-cell">Doctor</th>
                    <th className="text-left p-3 font-medium text-muted-foreground hidden lg:table-cell">Room</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">Status</th>
                    <th className="text-left p-3 font-medium text-muted-foreground hidden md:table-cell">Check-In</th>
                    <th className="text-left p-3 font-medium text-muted-foreground hidden sm:table-cell">Insurance</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((q) => {
                    const sc = statusConfig[q.status];
                    return (
                      <tr key={q.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                        <td className="p-3 font-bold text-foreground">{q.queueNumber}</td>
                        <td className="p-3 font-medium text-foreground">{q.patientName}</td>
                        <td className="p-3 text-muted-foreground hidden md:table-cell">{q.department}</td>
                        <td className="p-3 text-muted-foreground hidden lg:table-cell">{q.doctor}</td>
                        <td className="p-3 text-muted-foreground hidden lg:table-cell">{q.roomNumber}</td>
                        <td className="p-3">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${sc.color}`}>
                            {sc.icon} {q.status}
                          </span>
                        </td>
                        <td className="p-3 text-muted-foreground hidden md:table-cell">{q.checkInTime}</td>
                        <td className="p-3 hidden sm:table-cell">
                          <div className="flex items-center gap-1.5">
                            <span className="text-muted-foreground">{q.insurance}</span>
                            {q.insurance !== "None" && (
                              q.insuranceVerified
                                ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                                : <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default QueueDashboard;
