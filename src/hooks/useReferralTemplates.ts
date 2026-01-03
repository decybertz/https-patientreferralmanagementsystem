import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface ReferralTemplate {
  id: string;
  name: string;
  category: string;
  specialty: string | null;
  medical_summary_template: string | null;
  reason_template: string | null;
  default_urgency: 'emergency' | 'urgent' | 'routine';
  is_system: boolean;
  created_by: string | null;
  created_at: string;
}

export const useReferralTemplates = () => {
  const { currentUser } = useAuth();
  const [templates, setTemplates] = useState<ReferralTemplate[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTemplates = async () => {
    try {
      const { data, error } = await supabase
        .from('referral_templates')
        .select('*')
        .order('is_system', { ascending: false })
        .order('name');

      if (error) throw error;
      setTemplates(data || []);
    } catch (error) {
      console.error('Error fetching templates:', error);
      toast.error('Failed to load templates');
    } finally {
      setLoading(false);
    }
  };

  const createTemplate = async (template: {
    name: string;
    category: string;
    specialty?: string;
    medical_summary_template?: string;
    reason_template?: string;
    default_urgency?: 'emergency' | 'urgent' | 'routine';
  }) => {
    if (!currentUser) {
      toast.error('You must be logged in to create templates');
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('referral_templates')
        .insert({
          ...template,
          created_by: currentUser.id,
          is_system: false,
        })
        .select()
        .single();

      if (error) throw error;
      
      setTemplates(prev => [...prev, data]);
      toast.success('Template created successfully');
      return data;
    } catch (error) {
      console.error('Error creating template:', error);
      toast.error('Failed to create template');
      return null;
    }
  };

  const updateTemplate = async (id: string, updates: Partial<ReferralTemplate>) => {
    try {
      const { data, error } = await supabase
        .from('referral_templates')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      setTemplates(prev => prev.map(t => t.id === id ? data : t));
      toast.success('Template updated successfully');
      return data;
    } catch (error) {
      console.error('Error updating template:', error);
      toast.error('Failed to update template');
      return null;
    }
  };

  const deleteTemplate = async (id: string) => {
    try {
      const { error } = await supabase
        .from('referral_templates')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setTemplates(prev => prev.filter(t => t.id !== id));
      toast.success('Template deleted successfully');
      return true;
    } catch (error) {
      console.error('Error deleting template:', error);
      toast.error('Failed to delete template');
      return false;
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  return {
    templates,
    loading,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    refetch: fetchTemplates,
  };
};
