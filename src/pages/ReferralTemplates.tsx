import { useState } from 'react';
import Navigation from '@/components/Navigation';
import { useReferralTemplates, ReferralTemplate } from '@/hooks/useReferralTemplates';
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
  FileText, 
  Heart, 
  Brain, 
  Bone, 
  Activity, 
  Stethoscope,
  Trash2,
  Edit,
  Copy,
  Loader2,
  Bookmark
} from 'lucide-react';
import { toast } from 'sonner';

const categoryIcons: Record<string, React.ElementType> = {
  'Cardiac': Heart,
  'Neurology': Brain,
  'Orthopedic': Bone,
  'Oncology': Activity,
  'Gastroenterology': Stethoscope,
  'Pulmonology': Stethoscope,
};

const ReferralTemplates = () => {
  const { templates, loading, createTemplate, deleteTemplate } = useReferralTemplates();
  const [createOpen, setCreateOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    specialty: '',
    medical_summary_template: '',
    reason_template: '',
    default_urgency: 'routine' as 'emergency' | 'urgent' | 'routine',
  });

  const systemTemplates = templates.filter(t => t.is_system);
  const myTemplates = templates.filter(t => !t.is_system);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.category) {
      toast.error('Name and category are required');
      return;
    }

    setIsSubmitting(true);
    const result = await createTemplate(formData);
    setIsSubmitting(false);

    if (result) {
      setFormData({
        name: '',
        category: '',
        specialty: '',
        medical_summary_template: '',
        reason_template: '',
        default_urgency: 'routine',
      });
      setCreateOpen(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this template?')) {
      await deleteTemplate(id);
    }
  };

  const handleCopyToClipboard = (template: ReferralTemplate) => {
    const text = `${template.medical_summary_template || ''}\n\n${template.reason_template || ''}`;
    navigator.clipboard.writeText(text);
    toast.success('Template copied to clipboard');
  };

  const TemplateCard = ({ template }: { template: ReferralTemplate }) => {
    const IconComponent = categoryIcons[template.category] || FileText;
    
    return (
      <Card className="hover:border-primary/50 transition-colors">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <IconComponent className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-base">{template.name}</CardTitle>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary" className="text-xs">
                    {template.category}
                  </Badge>
                  {template.specialty && (
                    <Badge variant="outline" className="text-xs">
                      {template.specialty}
                    </Badge>
                  )}
                  {template.is_system && (
                    <Badge className="text-xs bg-primary/20 text-primary hover:bg-primary/30">
                      <Bookmark className="w-3 h-3 mr-1" />
                      System
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            <Badge 
              variant={
                template.default_urgency === 'emergency' ? 'destructive' : 
                template.default_urgency === 'urgent' ? 'default' : 'secondary'
              }
            >
              {template.default_urgency}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {template.medical_summary_template && (
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1">Medical Summary</p>
              <p className="text-sm text-foreground line-clamp-2">
                {template.medical_summary_template}
              </p>
            </div>
          )}
          {template.reason_template && (
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1">Reason</p>
              <p className="text-sm text-foreground line-clamp-2">
                {template.reason_template}
              </p>
            </div>
          )}
          <div className="flex gap-2 pt-2">
            <Button 
              size="sm" 
              variant="outline" 
              className="flex-1"
              onClick={() => handleCopyToClipboard(template)}
            >
              <Copy className="w-4 h-4 mr-1" />
              Copy
            </Button>
            {!template.is_system && (
              <Button 
                size="sm" 
                variant="ghost" 
                className="text-destructive hover:text-destructive"
                onClick={() => handleDelete(template.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
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
            <h1 className="text-2xl font-bold text-foreground">Referral Templates</h1>
            <p className="text-muted-foreground">Pre-built and custom templates for common referral types</p>
          </div>
          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create Template
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Create Custom Template</DialogTitle>
                <DialogDescription>
                  Create a reusable template for common referral types
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreate} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Template Name</Label>
                    <Input
                      id="name"
                      placeholder="e.g., Diabetes Follow-up"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Input
                      id="category"
                      placeholder="e.g., Endocrinology"
                      value={formData.category}
                      onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="specialty">Specialty</Label>
                    <Input
                      id="specialty"
                      placeholder="e.g., Internal Medicine"
                      value={formData.specialty}
                      onChange={(e) => setFormData(prev => ({ ...prev, specialty: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="urgency">Default Urgency</Label>
                    <Select
                      value={formData.default_urgency}
                      onValueChange={(value) => setFormData(prev => ({ 
                        ...prev, 
                        default_urgency: value as 'emergency' | 'urgent' | 'routine' 
                      }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="routine">Routine</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                        <SelectItem value="emergency">Emergency</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="summary">Medical Summary Template</Label>
                  <Textarea
                    id="summary"
                    placeholder="Use [placeholder] for variable parts..."
                    rows={3}
                    value={formData.medical_summary_template}
                    onChange={(e) => setFormData(prev => ({ ...prev, medical_summary_template: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reason">Reason for Referral Template</Label>
                  <Textarea
                    id="reason"
                    placeholder="Use [placeholder] for variable parts..."
                    rows={3}
                    value={formData.reason_template}
                    onChange={(e) => setFormData(prev => ({ ...prev, reason_template: e.target.value }))}
                  />
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setCreateOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                    Create Template
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Tabs defaultValue="system" className="space-y-6">
          <TabsList>
            <TabsTrigger value="system">
              System Templates ({systemTemplates.length})
            </TabsTrigger>
            <TabsTrigger value="custom">
              My Templates ({myTemplates.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="system">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {systemTemplates.map(template => (
                <TemplateCard key={template.id} template={template} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="custom">
            {myTemplates.length === 0 ? (
              <Card className="p-8 text-center">
                <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-semibold text-foreground mb-2">No Custom Templates</h3>
                <p className="text-muted-foreground mb-4">
                  Create your own templates for frequently used referral types
                </p>
                <Button onClick={() => setCreateOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Template
                </Button>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {myTemplates.map(template => (
                  <TemplateCard key={template.id} template={template} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default ReferralTemplates;
