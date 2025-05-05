
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardHeader from '@/components/layout/DashboardHeader';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Loader2, Save, ArrowLeft, Upload, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { InvoiceTemplate, useInvoiceTemplates } from '@/hooks/useInvoiceTemplates';
import { fontFamilies, fontSizes, alignmentOptions, tableStyles } from '@/components/settings/SettingsConstants';
import { Helmet } from 'react-helmet-async';
import { Input as ColorInput } from "@/components/ui/input";

const InvoiceTemplateEditor = () => {
  const { templateId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const {
    templates,
    isLoading: isLoadingTemplates,
    addTemplate,
    updateTemplate,
    fetchTemplates
  } = useInvoiceTemplates();

  // Create refs to prevent infinite loops
  const initialLoadComplete = useRef(false);
  const defaultTemplateCreated = useRef(false);
  
  const [template, setTemplate] = useState<InvoiceTemplate | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('layout');
  const [name, setName] = useState('');
  const [layoutConfig, setLayoutConfig] = useState<any>({});
  const [styleConfig, setStyleConfig] = useState<any>({});
  const [contentConfig, setContentConfig] = useState<any>({});

  // Debug logs
  useEffect(() => {
    console.log('TemplateEditor: Component mounted');
    console.log('TemplateEditor: templateId:', templateId);
    console.log('TemplateEditor: templates count:', templates.length);
    console.log('TemplateEditor: isLoadingTemplates:', isLoadingTemplates);
  }, []);

  // Additional debug for state updates
  useEffect(() => {
    console.log('TemplateEditor: templates updated:', templates);
  }, [templates]);

  // Load template data when component mounts or templateId changes
  useEffect(() => {
    const loadTemplate = async () => {
      if (initialLoadComplete.current) {
        console.log('TemplateEditor: Initial load already complete, skipping duplicate load');
        return;
      }
      
      console.log('TemplateEditor: Loading template data...');
      setIsLoading(true);
      
      try {
        console.log('TemplateEditor: Fetching templates...');
        await fetchTemplates();
        console.log('TemplateEditor: Templates fetched successfully');
        
        if (templateId) {
          console.log('TemplateEditor: Looking for template with ID:', templateId);
          const foundTemplate = templates.find(t => t.id === templateId);
          if (foundTemplate) {
            console.log('TemplateEditor: Template found:', foundTemplate);
            setTemplate(foundTemplate);
            setName(foundTemplate.name);
            setLayoutConfig(foundTemplate.layout_config);
            setStyleConfig(foundTemplate.style_config);
            setContentConfig(foundTemplate.content_config);
          } else {
            console.log('TemplateEditor: Template not found with ID:', templateId);
            toast({
              title: "Template not found",
              description: "The requested template could not be found.",
              variant: "destructive",
            });
            navigate('/dashboard/templates');
          }
        } else {
          console.log('TemplateEditor: No templateId, creating new template');
          // Initialize with default values for a new template
          const defaultLayout = {
            header: true,
            businessInfo: true,
            clientInfo: true,
            invoiceInfo: true,
            itemTable: true,
            summary: true,
            notes: true,
            footer: true,
            discounts: true,
            logo: true
          };

          const defaultStyle = {
            fontFamily: 'Inter, sans-serif',
            fontSize: '16px',
            primaryColor: '#6366f1',
            secondaryColor: '#f3f4f6',
            textColor: '#111827',
            borderStyle: '1px solid #e5e7eb',
            headerAlignment: 'left',
            logoPosition: 'left',
            tableStyle: 'bordered'
          };

          const defaultContent = {
            headerText: 'INVOICE',
            footerText: 'Thank you for your business',
            notesLabel: 'Notes',
            termsLabel: 'Terms & Conditions',
            discountLabel: 'Discount'
          };

          setLayoutConfig(defaultLayout);
          setStyleConfig(defaultStyle);
          setContentConfig(defaultContent);
          setName('New Template');
        }
        
        initialLoadComplete.current = true;
      } catch (error) {
        console.error('TemplateEditor: Error loading template:', error);
        toast({
          title: "Failed to load template",
          description: "There was an error loading the template data.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
        console.log('TemplateEditor: Loading complete, isLoading set to false');
      }
    };

    loadTemplate();
  }, [templateId, fetchTemplates, toast, navigate]);

  // Create a default template if no templates exist - with guard against infinite loops
  useEffect(() => {
    const createDefaultTemplate = async () => {
      // Only proceed if we're done loading, there are no templates, and we haven't tried to create one yet
      if (!isLoadingTemplates && templates.length === 0 && !defaultTemplateCreated.current) {
        defaultTemplateCreated.current = true; // Set flag to prevent multiple creation attempts
        
        try {
          const defaultName = "Default Template";
          console.log("TemplateEditor: Creating default template:", defaultName);
          const createdTemplate = await addTemplate(defaultName);
          console.log("TemplateEditor: Default template created successfully:", createdTemplate);
          
          toast({
            title: "Default template created",
            description: "A default template has been created for you.",
          });
          
          // If we're on the new template page, redirect to the newly created template
          if (!templateId) {
            navigate(`/dashboard/templates/${createdTemplate.id}`);
          }
        } catch (error) {
          console.error("TemplateEditor: Error creating default template:", error);
          defaultTemplateCreated.current = false; // Reset flag if there was an error
        }
      }
    };
    
    createDefaultTemplate();
  }, [isLoadingTemplates, templates.length, addTemplate, toast, navigate, templateId]);

  const handleSaveTemplate = async () => {
    if (!name.trim()) {
      toast({
        title: "Template name required",
        description: "Please provide a name for your template.",
        variant: "destructive",
      });
      return;
    }

    console.log('TemplateEditor: Saving template...', { name, templateId: template?.id });
    setIsSaving(true);
    try {
      const templateData = {
        name,
        layout_config: layoutConfig,
        style_config: styleConfig,
        content_config: contentConfig
      };

      console.log('TemplateEditor: Template data to save:', templateData);

      if (template) {
        // Update existing template
        console.log('TemplateEditor: Updating existing template');
        await updateTemplate(template.id, templateData);
        toast({
          title: "Template updated",
          description: `${name} has been updated successfully.`,
        });
      } else {
        // Create new template
        console.log('TemplateEditor: Creating new template');
        const newTemplate = await addTemplate(name);
        console.log('TemplateEditor: New template created:', newTemplate);
        await updateTemplate(newTemplate.id, templateData);
        toast({
          title: "Template created",
          description: `${name} has been created successfully.`,
        });
        navigate(`/dashboard/templates/${newTemplate.id}`);
      }
    } catch (error) {
      console.error('TemplateEditor: Error saving template:', error);
      toast({
        title: "Failed to save template",
        description: "There was an issue saving your template.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
      console.log('TemplateEditor: Save operation completed');
    }
  };

  // Handle layout configuration changes
  const handleLayoutChange = (key: string, value: boolean) => {
    console.log(`TemplateEditor: Layout change - ${key}:`, value);
    setLayoutConfig((prev: any) => ({
      ...prev,
      [key]: value
    }));
  };

  // Handle style configuration changes
  const handleStyleChange = (key: string, value: string) => {
    console.log(`TemplateEditor: Style change - ${key}:`, value);
    setStyleConfig((prev: any) => ({
      ...prev,
      [key]: value
    }));
  };

  // Handle content configuration changes
  const handleContentChange = (key: string, value: string) => {
    console.log(`TemplateEditor: Content change - ${key}:`, value);
    setContentConfig((prev: any) => ({
      ...prev,
      [key]: value
    }));
  };

  // Generate invoice preview HTML based on template configurations
  const generatePreviewHtml = () => {
    const { fontFamily, fontSize, primaryColor, secondaryColor, textColor, tableStyle } = styleConfig;
    const { headerText, footerText, notesLabel, termsLabel, discountLabel } = contentConfig;
    
    return `
      <div style="font-family: ${fontFamily}; font-size: ${fontSize}; color: ${textColor}; padding: 20px;">
        ${layoutConfig.header ? `<div style="margin-bottom: 20px; text-align: ${styleConfig.headerAlignment};">
          <h1 style="color: ${primaryColor}; margin: 0;">${headerText}</h1>
        </div>` : ''}
        
        ${layoutConfig.logo ? `<div style="text-align: ${styleConfig.logoPosition}; margin-bottom: 20px;">
          <div style="display: inline-block; width: 100px; height: 100px; background: ${secondaryColor}; border: 2px dashed ${primaryColor}; display: flex; align-items: center; justify-content: center;">Logo</div>
        </div>` : ''}
        
        <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
          ${layoutConfig.businessInfo ? `<div style="flex: 1;">
            <h3 style="margin: 0; font-size: 0.9em; color: ${textColor};">FROM</h3>
            <p style="margin: 5px 0; font-weight: bold;">Your Business Name</p>
            <p style="margin: 5px 0;">123 Business Street<br>City, State 12345<br>business@example.com</p>
          </div>` : ''}
          
          ${layoutConfig.clientInfo ? `<div style="flex: 1; text-align: right;">
            <h3 style="margin: 0; font-size: 0.9em; color: ${textColor};">BILL TO</h3>
            <p style="margin: 5px 0; font-weight: bold;">Client Name</p>
            <p style="margin: 5px 0;">456 Client Avenue<br>City, State 67890<br>client@example.com</p>
          </div>` : ''}
        </div>
        
        ${layoutConfig.invoiceInfo ? `<div style="background-color: ${secondaryColor}; padding: 15px; margin-bottom: 20px; border-radius: 4px;">
          <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px;">
            <div>
              <h4 style="margin: 0; font-size: 0.8em;">INVOICE #</h4>
              <p style="margin: 5px 0;">INV-1001</p>
            </div>
            <div>
              <h4 style="margin: 0; font-size: 0.8em;">DATE</h4>
              <p style="margin: 5px 0;">05/03/2025</p>
            </div>
            <div>
              <h4 style="margin: 0; font-size: 0.8em;">DUE DATE</h4>
              <p style="margin: 5px 0;">06/03/2025</p>
            </div>
            <div>
              <h4 style="margin: 0; font-size: 0.8em;">STATUS</h4>
              <p style="margin: 5px 0; background-color: ${primaryColor}; color: white; display: inline-block; padding: 2px 8px; border-radius: 2px; font-size: 0.8em;">UNPAID</p>
            </div>
          </div>
        </div>` : ''}
        
        ${layoutConfig.itemTable ? `<div style="margin-bottom: 20px;">
          <table style="width: 100%; border-collapse: collapse; ${tableStyle === 'bordered' ? 'border: 1px solid #e5e7eb;' : ''} ${tableStyle === 'striped' ? 'border: none;' : ''}">
            <thead>
              <tr style="background-color: ${primaryColor}; color: white;">
                <th style="padding: 10px; text-align: left;">Item</th>
                <th style="padding: 10px; text-align: right;">Quantity</th>
                <th style="padding: 10px; text-align: right;">Rate</th>
                <th style="padding: 10px; text-align: right;">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr style="${tableStyle === 'bordered' ? 'border-bottom: 1px solid #e5e7eb;' : ''} ${tableStyle === 'striped' ? 'background-color: #f9fafb;' : ''}">
                <td style="padding: 10px;">Website Design</td>
                <td style="padding: 10px; text-align: right;">1</td>
                <td style="padding: 10px; text-align: right;">$800.00</td>
                <td style="padding: 10px; text-align: right;">$800.00</td>
              </tr>
              <tr style="${tableStyle === 'bordered' ? 'border-bottom: 1px solid #e5e7eb;' : ''}">
                <td style="padding: 10px;">SEO Services</td>
                <td style="padding: 10px; text-align: right;">2</td>
                <td style="padding: 10px; text-align: right;">$150.00</td>
                <td style="padding: 10px; text-align: right;">$300.00</td>
              </tr>
            </tbody>
          </table>
        </div>` : ''}
        
        ${layoutConfig.summary ? `<div style="display: flex; justify-content: flex-end; margin-bottom: 20px;">
          <div style="width: 300px;">
            <div style="display: flex; justify-content: space-between; padding: 5px 0;">
              <span>Subtotal:</span>
              <span>$1,100.00</span>
            </div>
            
            ${layoutConfig.discounts ? `<div style="display: flex; justify-content: space-between; padding: 5px 0;">
              <span>${discountLabel}:</span>
              <span>$100.00</span>
            </div>` : ''}
            
            <div style="display: flex; justify-content: space-between; padding: 5px 0; border-bottom: 1px solid #e5e7eb;">
              <span>Tax (10%):</span>
              <span>$100.00</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 5px 0; font-weight: bold;">
              <span>Total:</span>
              <span style="color: ${primaryColor};">$1,100.00</span>
            </div>
          </div>
        </div>` : ''}
        
        ${layoutConfig.notes ? `<div style="background-color: ${secondaryColor}; padding: 15px; margin-bottom: 20px; border-radius: 4px;">
          <h3 style="margin: 0 0 10px; font-size: 1em;">${notesLabel}</h3>
          <p style="margin: 0;">Thank you for your business. Payment is due within 30 days.</p>
          
          <h3 style="margin: 20px 0 10px; font-size: 1em;">${termsLabel}</h3>
          <p style="margin: 0;">Late payments are subject to a 1.5% monthly fee.</p>
        </div>` : ''}
        
        ${layoutConfig.footer ? `<div style="text-align: center; padding-top: 20px; margin-top: 40px; border-top: 1px solid #e5e7eb; font-size: 0.9em; color: #6b7280;">
          ${footerText}
        </div>` : ''}
      </div>
    `;
  };

  // Render debug info when loading
  if (isLoading || isLoadingTemplates) {
    return (
      <div className="min-h-screen bg-gray-50">
        <DashboardHeader />
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center py-12 gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <div className="text-center">
              <p>Loading template editor...</p>
              <p className="text-sm text-muted-foreground">Templates count: {templates.length}</p>
              <p className="text-sm text-muted-foreground">Template ID: {templateId || 'New template'}</p>
              <p className="text-sm text-muted-foreground">Creating default template: {defaultTemplateCreated.current ? 'Yes' : 'No'}</p>
              <p className="text-sm text-muted-foreground">Initial load complete: {initialLoadComplete.current ? 'Yes' : 'No'}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>{template ? `Edit ${name}` : 'New Template'} | FinanceFlow</title>
        <meta name="description" content="Edit invoice template design and layout" />
      </Helmet>
      
      <DashboardHeader />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate('/dashboard/invoices')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Invoices
            </Button>
            <h1 className="text-2xl font-bold">{template ? `Edit Template: ${name}` : 'Create New Template'}</h1>
          </div>
          <Button onClick={handleSaveTemplate} disabled={isSaving}>
            {isSaving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
            Save Template
          </Button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Debug info */}
          <div className="lg:col-span-5 mb-4 p-4 bg-gray-100 rounded-md">
            <h3 className="font-medium mb-2">Debug Information</h3>
            <div className="text-sm">
              <p>Templates loaded: {templates.length}</p>
              <p>Current template ID: {template?.id || 'New template'}</p>
              <p>Template name: {name}</p>
              <p>Active tab: {activeTab}</p>
              <p>Default template created: {defaultTemplateCreated.current ? 'Yes' : 'No'}</p>
              <p>Initial load complete: {initialLoadComplete.current ? 'Yes' : 'No'}</p>
            </div>
          </div>
          
          {/* Editor Panel */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Template Settings</CardTitle>
                <CardDescription>Customize your invoice template</CardDescription>
                <Input 
                  placeholder="Template Name" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  className="mt-2"
                />
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="layout">Layout</TabsTrigger>
                    <TabsTrigger value="style">Style</TabsTrigger>
                    <TabsTrigger value="content">Content</TabsTrigger>
                  </TabsList>
                  
                  {/* Layout Tab */}
                  <TabsContent value="layout" className="space-y-4 pt-4">
                    <div className="space-y-4">
                      <h3 className="text-sm font-medium">Toggle Sections</h3>
                      {Object.entries({
                        header: "Header",
                        logo: "Logo",
                        businessInfo: "Business Information",
                        clientInfo: "Client Information",
                        invoiceInfo: "Invoice Details",
                        itemTable: "Items Table",
                        discounts: "Discounts",
                        summary: "Summary",
                        notes: "Notes & Terms",
                        footer: "Footer"
                      }).map(([key, label]) => (
                        <div key={key} className="flex items-center justify-between">
                          <Label htmlFor={key}>{label}</Label>
                          <Switch 
                            id={key} 
                            checked={layoutConfig[key] || false}
                            onCheckedChange={(checked) => handleLayoutChange(key, checked)}
                          />
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                  
                  {/* Style Tab */}
                  <TabsContent value="style" className="space-y-4 pt-4">
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="fontFamily">Font Family</Label>
                          <Select 
                            value={styleConfig.fontFamily} 
                            onValueChange={(value) => handleStyleChange('fontFamily', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select font family" />
                            </SelectTrigger>
                            <SelectContent>
                              {fontFamilies.map((font) => (
                                <SelectItem key={font.value} value={font.value}>{font.label}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="fontSize">Font Size</Label>
                          <Select 
                            value={styleConfig.fontSize} 
                            onValueChange={(value) => handleStyleChange('fontSize', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select font size" />
                            </SelectTrigger>
                            <SelectContent>
                              {fontSizes.map((size) => (
                                <SelectItem key={size.value} value={size.value}>{size.label}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <Separator />
                        
                        <div className="space-y-2">
                          <Label htmlFor="primaryColor">Primary Color</Label>
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-6 h-6 rounded border"
                              style={{ backgroundColor: styleConfig.primaryColor }}
                            />
                            <ColorInput
                              id="primaryColor"
                              type="color"
                              value={styleConfig.primaryColor}
                              onChange={(e) => handleStyleChange('primaryColor', e.target.value)}
                              className="w-full"
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="secondaryColor">Secondary Color</Label>
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-6 h-6 rounded border"
                              style={{ backgroundColor: styleConfig.secondaryColor }}
                            />
                            <ColorInput
                              id="secondaryColor"
                              type="color"
                              value={styleConfig.secondaryColor}
                              onChange={(e) => handleStyleChange('secondaryColor', e.target.value)}
                              className="w-full"
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="textColor">Text Color</Label>
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-6 h-6 rounded border"
                              style={{ backgroundColor: styleConfig.textColor }}
                            />
                            <ColorInput
                              id="textColor"
                              type="color"
                              value={styleConfig.textColor}
                              onChange={(e) => handleStyleChange('textColor', e.target.value)}
                              className="w-full"
                            />
                          </div>
                        </div>
                        
                        <Separator />
                        
                        <div className="space-y-2">
                          <Label htmlFor="headerAlignment">Header Alignment</Label>
                          <Select 
                            value={styleConfig.headerAlignment} 
                            onValueChange={(value) => handleStyleChange('headerAlignment', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select alignment" />
                            </SelectTrigger>
                            <SelectContent>
                              {alignmentOptions.map((alignment) => (
                                <SelectItem key={alignment.value} value={alignment.value}>{alignment.label}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="logoPosition">Logo Position</Label>
                          <Select 
                            value={styleConfig.logoPosition} 
                            onValueChange={(value) => handleStyleChange('logoPosition', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select position" />
                            </SelectTrigger>
                            <SelectContent>
                              {alignmentOptions.map((position) => (
                                <SelectItem key={position.value} value={position.value}>{position.label}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="tableStyle">Table Style</Label>
                          <Select 
                            value={styleConfig.tableStyle} 
                            onValueChange={(value) => handleStyleChange('tableStyle', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select table style" />
                            </SelectTrigger>
                            <SelectContent>
                              {tableStyles.map((style) => (
                                <SelectItem key={style.value} value={style.value}>{style.label}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  {/* Content Tab */}
                  <TabsContent value="content" className="space-y-4 pt-4">
                    <div className="grid grid-cols-1 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="headerText">Header Text</Label>
                        <Input 
                          id="headerText" 
                          value={contentConfig.headerText || ''} 
                          onChange={(e) => handleContentChange('headerText', e.target.value)} 
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="footerText">Footer Text</Label>
                        <Input 
                          id="footerText" 
                          value={contentConfig.footerText || ''} 
                          onChange={(e) => handleContentChange('footerText', e.target.value)} 
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="notesLabel">Notes Label</Label>
                        <Input 
                          id="notesLabel" 
                          value={contentConfig.notesLabel || ''} 
                          onChange={(e) => handleContentChange('notesLabel', e.target.value)} 
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="termsLabel">Terms Label</Label>
                        <Input 
                          id="termsLabel" 
                          value={contentConfig.termsLabel || ''} 
                          onChange={(e) => handleContentChange('termsLabel', e.target.value)} 
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="discountLabel">Discount Label</Label>
                        <Input 
                          id="discountLabel" 
                          value={contentConfig.discountLabel || ''} 
                          onChange={(e) => handleContentChange('discountLabel', e.target.value)} 
                        />
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
          
          {/* Preview Panel */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle>Template Preview</CardTitle>
                <CardDescription>This is how your invoice will look</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded-md overflow-auto max-h-[800px] p-4">
                  <div dangerouslySetInnerHTML={{ __html: generatePreviewHtml() }} />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceTemplateEditor;
