import { useState } from 'react';
import Navigation from '@/components/Navigation';
import { usePatientFollowups, PatientFollowup } from '@/hooks/usePatientFollowups';
import { useReferrals } from '@/hooks/useReferrals';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Plus, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Calendar,
  User,
  Star,
  FileText,
  Loader2,
  Bell,
  ThumbsUp
} from 'lucide-react';
import { format, formatDistanceToNow, isPast } from 'date-fns';

const followupTypeConfig = {
  reminder: { label: 'Reminder', icon: Bell, color: 'bg-blue-500' },
  outcome: { label: 'Outcome Check', icon: FileText, color: 'bg-green-500' },
  satisfaction: { label: 'Satisfaction', icon: ThumbsUp, color: 'bg-purple-500' },
};

const PatientFollowups = () => {
  const { followups, loading, createFollowup, completeFollowup, deleteFollowup, getPendingFollowups, getUpcomingFollowups } = usePatientFollowups();
  const { referrals } = useReferrals();
  const [createOpen, setCreateOpen] = useState(false);
  const [completeOpen, setCompleteOpen] = useState<PatientFollowup | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    referral_id: '',
    followup_type: 'reminder' as 'reminder' | 'outcome' | 'satisfaction',
    scheduled_date: '',
    notes: '',
  });
  const [completeData, setCompleteData] = useState({
    notes: '',
    outcome_status: '',
    satisfaction_rating: 0,
  });

  const pendingFollowups = getPendingFollowups();
  const upcomingFollowups = getUpcomingFollowups();
  const completedFollowups = followups.filter(f => f.completed_at);

  const completedReferrals = referrals.filter(r => r.status === 'completed');

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.referral_id || !formData.scheduled_date) return;

    setIsSubmitting(true);
    const result = await createFollowup({
      referral_id: formData.referral_id,
      followup_type: formData.followup_type,
      scheduled_date: new Date(formData.scheduled_date).toISOString(),
      notes: formData.notes,
    });
    setIsSubmitting(false);

    if (result) {
      setFormData({
        referral_id: '',
        followup_type: 'reminder',
        scheduled_date: '',
        notes: '',
      });
      setCreateOpen(false);
    }
  };

  const handleComplete = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!completeOpen) return;

    setIsSubmitting(true);
    await completeFollowup(completeOpen.id, {
      notes: completeData.notes,
      outcome_status: completeData.outcome_status || undefined,
      satisfaction_rating: completeData.satisfaction_rating || undefined,
    });
    setIsSubmitting(false);
    setCompleteOpen(null);
    setCompleteData({ notes: '', outcome_status: '', satisfaction_rating: 0 });
  };

  const FollowupCard = ({ followup, showComplete = false }: { followup: PatientFollowup; showComplete?: boolean }) => {
    const config = followupTypeConfig[followup.followup_type];
    const IconComponent = config.icon;
    const isOverdue = isPast(new Date(followup.scheduled_date)) && !followup.completed_at;
    
    return (
      <Card className={`${isOverdue ? 'border-destructive' : ''}`}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg ${config.color} flex items-center justify-center`}>
                <IconComponent className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  {config.label}
                  {isOverdue && (
                    <Badge variant="destructive" className="text-xs">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      Overdue
                    </Badge>
                  )}
                  {followup.completed_at && (
                    <Badge variant="secondary" className="text-xs bg-green-500/20 text-green-600">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Completed
                    </Badge>
                  )}
                </CardTitle>
                <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                  <User className="w-3 h-3" />
                  {followup.referral?.patient_name || 'Unknown Patient'}
                  {followup.referral?.patient_code && (
                    <Badge variant="outline" className="text-xs">
                      {followup.referral.patient_code}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            {format(new Date(followup.scheduled_date), 'PPP')}
            <span className="text-xs">
              ({formatDistanceToNow(new Date(followup.scheduled_date), { addSuffix: true })})
            </span>
          </div>
          {followup.notes && (
            <p className="text-sm text-foreground">{followup.notes}</p>
          )}
          {followup.outcome_status && (
            <div>
              <p className="text-xs font-medium text-muted-foreground">Outcome</p>
              <p className="text-sm">{followup.outcome_status}</p>
            </div>
          )}
          {followup.satisfaction_rating && (
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-4 h-4 ${
                    star <= followup.satisfaction_rating!
                      ? 'text-yellow-500 fill-yellow-500'
                      : 'text-muted-foreground'
                  }`}
                />
              ))}
            </div>
          )}
          {showComplete && !followup.completed_at && (
            <Button 
              size="sm" 
              className="w-full"
              onClick={() => setCompleteOpen(followup)}
            >
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Complete Follow-up
            </Button>
          )}
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Patient Follow-ups</h1>
            <p className="text-muted-foreground">Track patient outcomes and schedule reminders</p>
          </div>
          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Schedule Follow-up
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Schedule Follow-up</DialogTitle>
                <DialogDescription>
                  Create a follow-up reminder for a completed referral
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreate} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="referral">Select Referral</Label>
                  <Select
                    value={formData.referral_id}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, referral_id: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a referral..." />
                    </SelectTrigger>
                    <SelectContent>
                      {completedReferrals.map(referral => (
                        <SelectItem key={referral.id} value={referral.id}>
                          {referral.patient.name} - {referral.patientCode || referral.id.slice(0, 8)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="type">Follow-up Type</Label>
                    <Select
                      value={formData.followup_type}
                      onValueChange={(value) => setFormData(prev => ({ 
                        ...prev, 
                        followup_type: value as 'reminder' | 'outcome' | 'satisfaction'
                      }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="reminder">Reminder</SelectItem>
                        <SelectItem value="outcome">Outcome Check</SelectItem>
                        <SelectItem value="satisfaction">Satisfaction Survey</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="date">Scheduled Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.scheduled_date}
                      onChange={(e) => setFormData(prev => ({ ...prev, scheduled_date: e.target.value }))}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    placeholder="Add any notes for this follow-up..."
                    value={formData.notes}
                    onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  />
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setCreateOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting || !formData.referral_id}>
                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                    Schedule
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-destructive/10 flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-destructive" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{pendingFollowups.length}</p>
                  <p className="text-sm text-muted-foreground">Overdue</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{upcomingFollowups.length}</p>
                  <p className="text-sm text-muted-foreground">Upcoming</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-green-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{completedFollowups.length}</p>
                  <p className="text-sm text-muted-foreground">Completed</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="pending" className="space-y-6">
          <TabsList>
            <TabsTrigger value="pending" className="relative">
              Pending
              {pendingFollowups.length > 0 && (
                <Badge variant="destructive" className="ml-2 h-5 px-1.5 text-xs">
                  {pendingFollowups.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="upcoming">
              Upcoming ({upcomingFollowups.length})
            </TabsTrigger>
            <TabsTrigger value="completed">
              Completed ({completedFollowups.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending">
            {pendingFollowups.length === 0 ? (
              <Card className="p-8 text-center">
                <CheckCircle2 className="w-12 h-12 mx-auto text-green-500 mb-4" />
                <h3 className="font-semibold text-foreground mb-2">All Caught Up!</h3>
                <p className="text-muted-foreground">No overdue follow-ups</p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pendingFollowups.map(followup => (
                  <FollowupCard key={followup.id} followup={followup} showComplete />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="upcoming">
            {upcomingFollowups.length === 0 ? (
              <Card className="p-8 text-center">
                <Calendar className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-semibold text-foreground mb-2">No Upcoming Follow-ups</h3>
                <p className="text-muted-foreground mb-4">Schedule a follow-up to track patient outcomes</p>
                <Button onClick={() => setCreateOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Schedule Follow-up
                </Button>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {upcomingFollowups.map(followup => (
                  <FollowupCard key={followup.id} followup={followup} showComplete />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="completed">
            {completedFollowups.length === 0 ? (
              <Card className="p-8 text-center">
                <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-semibold text-foreground mb-2">No Completed Follow-ups</h3>
                <p className="text-muted-foreground">Completed follow-ups will appear here</p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {completedFollowups.map(followup => (
                  <FollowupCard key={followup.id} followup={followup} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Complete Dialog */}
        <Dialog open={!!completeOpen} onOpenChange={(open) => !open && setCompleteOpen(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Complete Follow-up</DialogTitle>
              <DialogDescription>
                Record the outcome of this follow-up
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleComplete} className="space-y-4">
              {completeOpen?.followup_type === 'outcome' && (
                <div className="space-y-2">
                  <Label htmlFor="outcome">Outcome Status</Label>
                  <Select
                    value={completeData.outcome_status}
                    onValueChange={(value) => setCompleteData(prev => ({ ...prev, outcome_status: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select outcome..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="improved">Patient Improved</SelectItem>
                      <SelectItem value="stable">Stable Condition</SelectItem>
                      <SelectItem value="worsened">Condition Worsened</SelectItem>
                      <SelectItem value="recovered">Fully Recovered</SelectItem>
                      <SelectItem value="ongoing">Ongoing Treatment</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
              {completeOpen?.followup_type === 'satisfaction' && (
                <div className="space-y-2">
                  <Label>Satisfaction Rating</Label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setCompleteData(prev => ({ ...prev, satisfaction_rating: star }))}
                        className="p-1"
                      >
                        <Star
                          className={`w-8 h-8 ${
                            star <= completeData.satisfaction_rating
                              ? 'text-yellow-500 fill-yellow-500'
                              : 'text-muted-foreground'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="completeNotes">Notes</Label>
                <Textarea
                  id="completeNotes"
                  placeholder="Add follow-up notes..."
                  value={completeData.notes}
                  onChange={(e) => setCompleteData(prev => ({ ...prev, notes: e.target.value }))}
                />
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setCompleteOpen(null)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  Complete
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default PatientFollowups;
