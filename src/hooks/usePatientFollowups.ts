import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface PatientFollowup {
  id: string;
  referral_id: string;
  followup_type: 'reminder' | 'outcome' | 'satisfaction';
  scheduled_date: string;
  completed_at: string | null;
  notes: string | null;
  outcome_status: string | null;
  satisfaction_rating: number | null;
  created_by: string | null;
  created_at: string;
  referral?: {
    patient_name: string;
    patient_code: string | null;
    status: string;
  };
}

export const usePatientFollowups = (referralId?: string) => {
  const { currentUser } = useAuth();
  const [followups, setFollowups] = useState<PatientFollowup[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFollowups = async () => {
    try {
      let query = supabase
        .from('patient_followups')
        .select(`
          *,
          referral:referrals(patient_name, patient_code, status)
        `)
        .order('scheduled_date', { ascending: true });

      if (referralId) {
        query = query.eq('referral_id', referralId);
      }

      const { data, error } = await query;

      if (error) throw error;
      setFollowups((data || []) as PatientFollowup[]);
    } catch (error) {
      console.error('Error fetching followups:', error);
      toast.error('Failed to load follow-ups');
    } finally {
      setLoading(false);
    }
  };

  const createFollowup = async (followup: {
    referral_id: string;
    followup_type: 'reminder' | 'outcome' | 'satisfaction';
    scheduled_date: string;
    notes?: string;
  }) => {
    if (!currentUser) {
      toast.error('You must be logged in');
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('patient_followups')
        .insert({
          ...followup,
          created_by: currentUser.id,
        })
        .select(`
          *,
          referral:referrals(patient_name, patient_code, status)
        `)
        .single();

      if (error) throw error;
      
      setFollowups(prev => [...prev, data as PatientFollowup]);
      toast.success('Follow-up scheduled successfully');
      return data as PatientFollowup;
    } catch (error) {
      console.error('Error creating followup:', error);
      toast.error('Failed to schedule follow-up');
      return null;
    }
  };

  const completeFollowup = async (id: string, data: {
    notes?: string;
    outcome_status?: string;
    satisfaction_rating?: number;
  }) => {
    try {
      const { data: updated, error } = await supabase
        .from('patient_followups')
        .update({
          ...data,
          completed_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select(`
          *,
          referral:referrals(patient_name, patient_code, status)
        `)
        .single();

      if (error) throw error;
      
      setFollowups(prev => prev.map(f => f.id === id ? (updated as PatientFollowup) : f));
      toast.success('Follow-up completed');
      return updated as PatientFollowup;
    } catch (error) {
      console.error('Error completing followup:', error);
      toast.error('Failed to complete follow-up');
      return null;
    }
  };

  const deleteFollowup = async (id: string) => {
    try {
      const { error } = await supabase
        .from('patient_followups')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setFollowups(prev => prev.filter(f => f.id !== id));
      toast.success('Follow-up deleted');
      return true;
    } catch (error) {
      console.error('Error deleting followup:', error);
      toast.error('Failed to delete follow-up');
      return false;
    }
  };

  const getPendingFollowups = () => {
    const now = new Date();
    return followups.filter(f => 
      !f.completed_at && new Date(f.scheduled_date) <= now
    );
  };

  const getUpcomingFollowups = () => {
    const now = new Date();
    return followups.filter(f => 
      !f.completed_at && new Date(f.scheduled_date) > now
    );
  };

  useEffect(() => {
    fetchFollowups();
  }, [referralId]);

  return {
    followups,
    loading,
    createFollowup,
    completeFollowup,
    deleteFollowup,
    getPendingFollowups,
    getUpcomingFollowups,
    refetch: fetchFollowups,
  };
};
