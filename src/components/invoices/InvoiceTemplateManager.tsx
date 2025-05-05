
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Loader2, Plus, Check, Copy, Trash, PenLine, Star, StarOff } from "lucide-react";
import { InvoiceTemplate, useInvoiceTemplates } from "@/hooks/useInvoiceTemplates";
import InvoiceTemplateEditor from "./InvoiceTemplateEditor";
import InvoiceTemplatePreview from "./InvoiceTemplatePreview";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNavigate } from 'react-router-dom';

interface InvoiceTemplateManagerProps {
  onSelectTemplate?: (template: InvoiceTemplate) => void;
  onClose: () => void;
}

const InvoiceTemplateManager: React.FC<InvoiceTemplateManagerProps> = ({ 
  onSelectTemplate, 
  onClose
}) => {
  const navigate = useNavigate();
  const {
    templates,
    isLoading,
    addTemplate,
    updateTemplate,
    setDefaultTemplate,
    deleteTemplate,
    duplicateTemplate
  } = useInvoiceTemplates();

  const [activeTab, setActiveTab] = useState('gallery');
  const [selectedTemplate, setSelectedTemplate] = useState<InvoiceTemplate | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [newTemplateName, setNewTemplateName] = useState('');

  // Handle creating a new template
  const handleCreateTemplate = async () => {
    try {
      if (!newTemplateName.trim()) {
        setNewTemplateName('New Template');
      }
      const template = await addTemplate(newTemplateName.trim() || 'New Template');
      setNewTemplateName('');
      setSelectedTemplate(template);
      setIsEditorOpen(true);
    } catch (error) {
      console.error('Error creating template:', error);
    }
  };

  // Handle navigating to the template editor page
  const handleNavigateToTemplateEditor = () => {
    navigate('/dashboard/templates');
    onClose();
  };

  // Handle editing an existing template
  const handleEditTemplate = (template: InvoiceTemplate) => {
    setSelectedTemplate(template);
    setIsEditorOpen(true);
  };

  // Handle saving a template
  const handleSaveTemplate = async (updatedTemplate: Partial<InvoiceTemplate>) => {
    try {
      if (selectedTemplate) {
        await updateTemplate(selectedTemplate.id, updatedTemplate);
        setIsEditorOpen(false);
      }
    } catch (error) {
      console.error('Error updating template:', error);
    }
  };

  // Handle setting a template as default
  const handleSetDefaultTemplate = async (templateId: string) => {
    try {
      await setDefaultTemplate(templateId);
    } catch (error) {
      console.error('Error setting default template:', error);
    }
  };

  // Handle duplicating a template
  const handleDuplicateTemplate = async (templateId: string) => {
    try {
      await duplicateTemplate(templateId);
    } catch (error) {
      console.error('Error duplicating template:', error);
    }
  };

  // Handle deleting a template
  const handleDeleteTemplate = async (templateId: string) => {
    try {
      await deleteTemplate(templateId);
    } catch (error) {
      console.error('Error deleting template:', error);
    }
  };

  // Handle template selection
  const handleSelectTemplate = (template: InvoiceTemplate) => {
    if (onSelectTemplate) {
      onSelectTemplate(template);
      onClose();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Choose Template</h3>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleNavigateToTemplateEditor}
        >
          Manage All Templates
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      ) : templates.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500 mb-4">No templates found</p>
          <Button onClick={handleCreateTemplate}>
            <Plus className="h-4 w-4 mr-2" />
            Create Your First Template
          </Button>
        </div>
      ) : (
        <ScrollArea className="h-[400px] pr-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {templates.map((template) => (
              <Card key={template.id} className={`overflow-hidden ${template.is_default ? 'border-primary' : ''}`}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-xl">{template.name}</CardTitle>
                    {template.is_default && (
                      <Badge variant="default">Default</Badge>
                    )}
                  </div>
                  <CardDescription>
                    Last updated: {new Date(template.updated_at).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-2 h-[200px] overflow-hidden">
                  <div className="scale-[0.4] origin-top-left">
                    <InvoiceTemplatePreview template={template} />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between bg-gray-50 border-t">
                  <div className="flex space-x-2">
                    {!template.is_default && (
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleSetDefaultTemplate(template.id)} 
                        title="Set as default"
                      >
                        <Star className="h-4 w-4" />
                      </Button>
                    )}
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleEditTemplate(template)} 
                      title="Edit template"
                    >
                      <PenLine className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleDuplicateTemplate(template.id)} 
                      title="Duplicate template"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    {!template.is_default && (
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleDeleteTemplate(template.id)}
                        title="Delete template"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <Button 
                    onClick={() => handleSelectTemplate(template)} 
                    size="sm" 
                    variant={onSelectTemplate ? "default" : "outline"}
                  >
                    {onSelectTemplate ? "Select" : "Preview"}
                    {template.is_default && <Check className="ml-2 h-4 w-4" />}
                  </Button>
                </CardFooter>
              </Card>
            ))}
            
            {/* Add New Template Card */}
            <Card onClick={handleCreateTemplate} className="flex flex-col items-center justify-center h-full cursor-pointer hover:border-primary transition-all overflow-hidden">
              <CardContent className="flex flex-col items-center justify-center h-full p-10">
                <div className="rounded-full bg-gray-100 p-4 mb-4">
                  <Plus className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-medium text-lg text-center">Create New Template</h3>
                <p className="text-sm text-center text-gray-500 mt-2">
                  Design a custom invoice template
                </p>
              </CardContent>
            </Card>
          </div>
        </ScrollArea>
      )}

      {/* Template Editor Dialog */}
      <Dialog open={isEditorOpen} onOpenChange={setIsEditorOpen}>
        <DialogContent className="max-w-4xl h-[90vh] flex flex-col overflow-hidden">
          <DialogHeader>
            <DialogTitle>{selectedTemplate?.name || 'Edit Template'}</DialogTitle>
            <DialogDescription>
              Customize your invoice template
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col md:flex-row gap-4 flex-grow overflow-hidden">
            <div className="md:w-1/2 overflow-y-auto px-1 pb-16">
              {selectedTemplate && (
                <InvoiceTemplateEditor
                  template={selectedTemplate}
                  onSave={handleSaveTemplate}
                  onCancel={() => setIsEditorOpen(false)}
                />
              )}
            </div>
            <div className="md:w-1/2 overflow-y-auto border-l pl-4">
              <h3 className="font-medium text-gray-500 mb-4">Preview</h3>
              {selectedTemplate && <InvoiceTemplatePreview template={selectedTemplate} />}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InvoiceTemplateManager;
