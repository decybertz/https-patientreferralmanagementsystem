-- Create referral templates table
CREATE TABLE public.referral_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL,
  specialty text,
  medical_summary_template text,
  reason_template text,
  default_urgency urgency_level DEFAULT 'routine',
  is_system boolean DEFAULT false,
  created_by uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.referral_templates ENABLE ROW LEVEL SECURITY;

-- Anyone can view system templates, users can view their own
CREATE POLICY "Users can view system templates and own templates" 
ON public.referral_templates 
FOR SELECT 
USING (is_system = true OR created_by = auth.uid() OR has_role(auth.uid(), 'admin'::app_role));

-- Users can create their own templates
CREATE POLICY "Users can create own templates" 
ON public.referral_templates 
FOR INSERT 
WITH CHECK (created_by = auth.uid() AND is_system = false);

-- Users can update their own templates
CREATE POLICY "Users can update own templates" 
ON public.referral_templates 
FOR UPDATE 
USING (created_by = auth.uid() OR has_role(auth.uid(), 'admin'::app_role));

-- Users can delete their own templates
CREATE POLICY "Users can delete own templates" 
ON public.referral_templates 
FOR DELETE 
USING (created_by = auth.uid() OR has_role(auth.uid(), 'admin'::app_role));

-- Create patient follow-ups table
CREATE TABLE public.patient_followups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  referral_id uuid NOT NULL REFERENCES referrals(id) ON DELETE CASCADE,
  followup_type text NOT NULL CHECK (followup_type IN ('reminder', 'outcome', 'satisfaction')),
  scheduled_date timestamp with time zone NOT NULL,
  completed_at timestamp with time zone,
  notes text,
  outcome_status text,
  satisfaction_rating integer CHECK (satisfaction_rating >= 1 AND satisfaction_rating <= 5),
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.patient_followups ENABLE ROW LEVEL SECURITY;

-- Users can view follow-ups for their referrals
CREATE POLICY "Users can view followups for their referrals" 
ON public.patient_followups 
FOR SELECT 
USING (
  has_role(auth.uid(), 'admin'::app_role) OR 
  EXISTS (
    SELECT 1 FROM referrals r 
    WHERE r.id = patient_followups.referral_id 
    AND (r.from_hospital_id = get_user_hospital(auth.uid()) OR r.to_hospital_id = get_user_hospital(auth.uid()))
  )
);

-- Users can create follow-ups for their referrals
CREATE POLICY "Users can create followups for their referrals" 
ON public.patient_followups 
FOR INSERT 
WITH CHECK (
  created_by = auth.uid() AND
  EXISTS (
    SELECT 1 FROM referrals r 
    WHERE r.id = patient_followups.referral_id 
    AND (r.from_hospital_id = get_user_hospital(auth.uid()) OR r.to_hospital_id = get_user_hospital(auth.uid()))
  )
);

-- Users can update follow-ups they created
CREATE POLICY "Users can update own followups" 
ON public.patient_followups 
FOR UPDATE 
USING (created_by = auth.uid() OR has_role(auth.uid(), 'admin'::app_role));

-- Users can delete follow-ups they created
CREATE POLICY "Users can delete own followups" 
ON public.patient_followups 
FOR DELETE 
USING (created_by = auth.uid() OR has_role(auth.uid(), 'admin'::app_role));

-- Insert some system templates
INSERT INTO public.referral_templates (name, category, specialty, medical_summary_template, reason_template, default_urgency, is_system) VALUES
('Cardiac Consultation', 'Cardiac', 'Cardiology', 'Patient presents with [symptoms]. ECG shows [findings]. Blood pressure: [BP]. Heart rate: [HR].', 'Cardiac evaluation required for [condition]. Suspected [diagnosis].', 'urgent', true),
('Orthopedic Referral', 'Orthopedic', 'Orthopedics', 'Patient has [injury/condition] affecting [body part]. X-ray/MRI shows [findings]. Pain level: [1-10].', 'Orthopedic consultation for [condition]. Patient requires [treatment type].', 'routine', true),
('Oncology Consultation', 'Oncology', 'Oncology', 'Patient diagnosed with [cancer type]. Staging: [stage]. Pathology: [findings]. Tumor markers: [values].', 'Oncology evaluation for [cancer type]. Treatment planning required.', 'urgent', true),
('Neurology Referral', 'Neurology', 'Neurology', 'Patient presents with [symptoms]. Neurological exam: [findings]. CT/MRI brain: [results].', 'Neurological assessment for [condition]. Possible [diagnosis].', 'urgent', true),
('Gastroenterology Consult', 'Gastroenterology', 'Gastroenterology', 'Patient reports [symptoms]. Duration: [time]. Labs: [findings]. Previous endoscopy: [results].', 'GI evaluation for [condition]. Endoscopy/colonoscopy may be indicated.', 'routine', true),
('Pulmonology Referral', 'Pulmonology', 'Pulmonology', 'Patient with [respiratory symptoms]. SpO2: [value]. Chest X-ray: [findings]. PFT: [results if available].', 'Pulmonary consultation for [condition]. Assessment of lung function needed.', 'routine', true);