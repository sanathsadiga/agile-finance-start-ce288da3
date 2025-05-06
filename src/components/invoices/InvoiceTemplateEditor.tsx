import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Save, X } from "lucide-react";
import { InvoiceTemplate } from "@/hooks/useInvoiceTemplates";
import { fontFamilies, fontSizes, alignmentOptions, tableStyles } from '@/components/settings/SettingsConstants';
import LogoUploader from './LogoUploader';

interface InvoiceTemplateEditorProps {
  template: InvoiceTemplate;
  onSave: (template: Partial<InvoiceTemplate>) => Promise<void>;
  onCancel: () => void;
}

const InvoiceTemplateEditor: React.FC<InvoiceTemplateEditorProps> = ({ 
  template, 
  onSave, 
  onCancel 
}) => {
  const [activeTab, setActiveTab] = useState('layout');
  const [name, setName] = useState(template.name);
  const [layoutConfig, setLayoutConfig] = useState(template.layout_config);
  const [styleConfig, setStyleConfig] = useState(template.style_config);
  const [contentConfig, setContentConfig] = useState(template.content_config);
  const [logo, setLogo] = useState<string | null>(template.logo || null);
  const [isSaving, setIsSaving] = useState(false);

  // Handle saving the template
  const handleSaveTemplate = async () => {
    if (!name.trim()) {
      return;
    }

    setIsSaving(true);
    try {
      await onSave({
        name,
        layout_config: layoutConfig,
        style_config: styleConfig,
        content_config: contentConfig,
        logo: logo
      });
    } catch (error) {
      console.error('Error saving template:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // Handle layout configuration changes
  const handleLayoutChange = (key: string, value: boolean) => {
    setLayoutConfig((prev: any) => ({
      ...prev,
      [key]: value
    }));
  };

  // Handle style configuration changes
  const handleStyleChange = (key: string, value: string) => {
    setStyleConfig((prev: any) => ({
      ...prev,
      [key]: value
    }));
  };

  // Handle content configuration changes
  const handleContentChange = (key: string, value: string) => {
    setContentConfig((prev: any) => ({
      ...prev,
      [key]: value
    }));
  };

  // Handle logo changes
  const handleLogoChange = (newLogo: string | null) => {
    setLogo(newLogo);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Input 
          placeholder="Template Name" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          className="max-w-sm"
        />
        <div className="flex gap-2">
          <Button variant="outline" onClick={onCancel}>
            <X className="h-4 w-4 mr-1" />
            Cancel
          </Button>
          <Button onClick={handleSaveTemplate} disabled={isSaving}>
            {isSaving ? (
              <div className="h-4 w-4 mr-1 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <Save className="h-4 w-4 mr-1" />
            )}
            Save Template
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="layout">Layout</TabsTrigger>
          <TabsTrigger value="style">Style</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
        </TabsList>

        {/* Layout Tab */}
        <TabsContent value="layout" className="space-y-6 pt-4">
          {/* Logo Uploader */}
          <LogoUploader initialLogo={logo} onLogoChange={handleLogoChange} />
          
          <Separator />
          
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
          <Card>
            <CardHeader>
              <CardTitle>Typography & Colors</CardTitle>
              <CardDescription>Customize the look and feel of your invoice</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="font-family">Font Family</Label>
                    <Select 
                      value={styleConfig.fontFamily} 
                      onValueChange={(value) => 
                        setStyleConfig(prev => ({ ...prev, fontFamily: value }))
                      }
                    >
                      <SelectTrigger id="font-family">
                        <SelectValue placeholder="Select font family" />
                      </SelectTrigger>
                      <SelectContent>
                        {fontFamilies.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="font-size">Font Size</Label>
                    <Select 
                      value={styleConfig.fontSize} 
                      onValueChange={(value) => 
                        setStyleConfig(prev => ({ ...prev, fontSize: value }))
                      }
                    >
                      <SelectTrigger id="font-size">
                        <SelectValue placeholder="Select font size" />
                      </SelectTrigger>
                      <SelectContent>
                        {fontSizes.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Separator />
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="primary-color">Primary Color</Label>
                    <div className="flex items-center space-x-2">
                      <Input 
                        id="primary-color" 
                        type="color" 
                        value={styleConfig.primaryColor}
                        onChange={(e) => 
                          setStyleConfig(prev => ({ ...prev, primaryColor: e.target.value }))
                        }
                        className="w-10 h-10 p-1 bg-transparent border rounded"
                      />
                      <Input 
                        type="text" 
                        value={styleConfig.primaryColor}
                        onChange={(e) => 
                          setStyleConfig(prev => ({ ...prev, primaryColor: e.target.value }))
                        }
                        className="flex-1"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="secondary-color">Secondary Color</Label>
                    <div className="flex items-center space-x-2">
                      <Input 
                        id="secondary-color" 
                        type="color" 
                        value={styleConfig.secondaryColor}
                        onChange={(e) => 
                          setStyleConfig(prev => ({ ...prev, secondaryColor: e.target.value }))
                        }
                        className="w-10 h-10 p-1 bg-transparent border rounded"
                      />
                      <Input 
                        type="text" 
                        value={styleConfig.secondaryColor}
                        onChange={(e) => 
                          setStyleConfig(prev => ({ ...prev, secondaryColor: e.target.value }))
                        }
                        className="flex-1"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="text-color">Text Color</Label>
                    <div className="flex items-center space-x-2">
                      <Input 
                        id="text-color" 
                        type="color" 
                        value={styleConfig.textColor}
                        onChange={(e) => 
                          setStyleConfig(prev => ({ ...prev, textColor: e.target.value }))
                        }
                        className="w-10 h-10 p-1 bg-transparent border rounded"
                      />
                      <Input 
                        type="text" 
                        value={styleConfig.textColor}
                        onChange={(e) => 
                          setStyleConfig(prev => ({ ...prev, textColor: e.target.value }))
                        }
                        className="flex-1"
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="header-alignment">Header Alignment</Label>
                    <Select 
                      value={styleConfig.headerAlignment} 
                      onValueChange={(value: 'left' | 'center' | 'right') => 
                        setStyleConfig(prev => ({ ...prev, headerAlignment: value }))
                      }
                    >
                      <SelectTrigger id="header-alignment">
                        <SelectValue placeholder="Select alignment" />
                      </SelectTrigger>
                      <SelectContent>
                        {alignmentOptions.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="logo-position">Logo Position</Label>
                    <Select 
                      value={styleConfig.logoPosition} 
                      onValueChange={(value: 'left' | 'center' | 'right') => 
                        setStyleConfig(prev => ({ ...prev, logoPosition: value }))
                      }
                    >
                      <SelectTrigger id="logo-position">
                        <SelectValue placeholder="Select position" />
                      </SelectTrigger>
                      <SelectContent>
                        {alignmentOptions.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="table-style">Table Style</Label>
                    <Select 
                      value={styleConfig.tableStyle} 
                      onValueChange={(value: 'bordered' | 'borderless' | 'striped') => 
                        setStyleConfig(prev => ({ ...prev, tableStyle: value }))
                      }
                    >
                      <SelectTrigger id="table-style">
                        <SelectValue placeholder="Select table style" />
                      </SelectTrigger>
                      <SelectContent>
                        {tableStyles.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <Label htmlFor="border-style">Border Style</Label>
                  <Input 
                    id="border-style" 
                    value={styleConfig.borderStyle}
                    onChange={(e) => 
                      setStyleConfig(prev => ({ ...prev, borderStyle: e.target.value }))
                    }
                    placeholder="1px solid #e5e7eb"
                  />
                  <p className="text-xs text-gray-500">
                    Examples: "1px solid #e5e7eb", "2px dashed #000", "none"
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Content Tab */}
        <TabsContent value="content" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Custom Text & Labels</CardTitle>
              <CardDescription>Customize text content in your invoice</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="header-text">Header Text</Label>
                  <Input 
                    id="header-text" 
                    value={contentConfig.headerText}
                    onChange={(e) => 
                      setContentConfig(prev => ({ ...prev, headerText: e.target.value }))
                    }
                    placeholder="INVOICE"
                  />
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <Label htmlFor="footer-text">Footer Text</Label>
                  <Input 
                    id="footer-text" 
                    value={contentConfig.footerText}
                    onChange={(e) => 
                      setContentConfig(prev => ({ ...prev, footerText: e.target.value }))
                    }
                    placeholder="Thank you for your business"
                  />
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <Label htmlFor="notes-label">Notes Label</Label>
                  <Input 
                    id="notes-label" 
                    value={contentConfig.notesLabel}
                    onChange={(e) => 
                      setContentConfig(prev => ({ ...prev, notesLabel: e.target.value }))
                    }
                    placeholder="Notes"
                  />
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <Label htmlFor="terms-label">Terms Label</Label>
                  <Input 
                    id="terms-label" 
                    value={contentConfig.termsLabel}
                    onChange={(e) => 
                      setContentConfig(prev => ({ ...prev, termsLabel: e.target.value }))
                    }
                    placeholder="Terms & Conditions"
                  />
                </div>

                <Accordion type="single" collapsible>
                  <AccordionItem value="dynamic-fields">
                    <AccordionTrigger>Available Dynamic Fields</AccordionTrigger>
                    <AccordionContent>
                      <div className="bg-gray-50 p-4 rounded-md">
                        <p className="text-sm mb-2">You can use these tokens in your content:</p>
                        <ul className="text-sm space-y-1">
                          <li><code>{"{{invoice_number}}"}</code> - The invoice number</li>
                          <li><code>{"{{issue_date}}"}</code> - Date the invoice was issued</li>
                          <li><code>{"{{due_date}}"}</code> - Due date for payment</li>
                          <li><code>{"{{client_name}}"}</code> - Client's name</li>
                          <li><code>{"{{business_name}}"}</code> - Your business name</li>
                          <li><code>{"{{subtotal}}"}</code> - Subtotal amount</li>
                          <li><code>{"{{tax_amount}}"}</code> - Tax amount</li>
                          <li><code>{"{{total}}"}</code> - Total amount</li>
                        </ul>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InvoiceTemplateEditor;
