
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { InvoiceTemplate, LayoutConfig, StyleConfig, ContentConfig } from "@/hooks/useInvoiceTemplates";

interface InvoiceTemplateEditorProps {
  template: InvoiceTemplate | null;
  onSave: (template: Partial<InvoiceTemplate>) => void;
  onCancel: () => void;
}

const InvoiceTemplateEditor: React.FC<InvoiceTemplateEditorProps> = ({
  template,
  onSave,
  onCancel
}) => {
  const [name, setName] = useState('');
  const [activeTab, setActiveTab] = useState('layout');
  const [layoutConfig, setLayoutConfig] = useState<LayoutConfig>({
    header: true,
    businessInfo: true,
    clientInfo: true,
    invoiceInfo: true,
    itemTable: true,
    summary: true,
    notes: true,
    footer: true
  });
  const [styleConfig, setStyleConfig] = useState<StyleConfig>({
    fontFamily: 'Inter, sans-serif',
    fontSize: '16px',
    primaryColor: '#6366f1',
    secondaryColor: '#f3f4f6',
    textColor: '#111827',
    borderStyle: '1px solid #e5e7eb',
    headerAlignment: 'left',
    logoPosition: 'left',
    tableStyle: 'bordered'
  });
  const [contentConfig, setContentConfig] = useState<ContentConfig>({
    headerText: 'INVOICE',
    footerText: 'Thank you for your business',
    notesLabel: 'Notes',
    termsLabel: 'Terms & Conditions'
  });

  useEffect(() => {
    if (template) {
      setName(template.name);
      setLayoutConfig(template.layout_config);
      setStyleConfig(template.style_config);
      setContentConfig(template.content_config);
    }
  }, [template]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const updatedTemplate: Partial<InvoiceTemplate> = {
      name,
      layout_config: layoutConfig,
      style_config: styleConfig,
      content_config: contentConfig
    };
    
    onSave(updatedTemplate);
  };

  const fontOptions = [
    { value: 'Inter, sans-serif', label: 'Inter' },
    { value: 'Arial, sans-serif', label: 'Arial' },
    { value: 'Georgia, serif', label: 'Georgia' },
    { value: 'Courier New, monospace', label: 'Courier New' },
    { value: 'Roboto, sans-serif', label: 'Roboto' },
    { value: 'Montserrat, sans-serif', label: 'Montserrat' }
  ];

  const fontSizeOptions = [
    { value: '12px', label: 'Small' },
    { value: '14px', label: 'Medium' },
    { value: '16px', label: 'Large' },
    { value: '18px', label: 'X-Large' }
  ];

  const alignmentOptions = [
    { value: 'left', label: 'Left' },
    { value: 'center', label: 'Center' },
    { value: 'right', label: 'Right' }
  ];

  const tableStyleOptions = [
    { value: 'bordered', label: 'Bordered' },
    { value: 'borderless', label: 'Borderless' },
    { value: 'striped', label: 'Striped' }
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="template-name">Template Name</Label>
        <Input 
          id="template-name" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          className="mb-4"
          placeholder="My Custom Template"
          required
        />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="layout">Layout</TabsTrigger>
          <TabsTrigger value="style">Style</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
        </TabsList>

        {/* Layout Configuration */}
        <TabsContent value="layout" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Layout Elements</CardTitle>
              <CardDescription>Choose which sections to display on your invoice</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="header-toggle">Header</Label>
                  <Switch 
                    id="header-toggle"
                    checked={layoutConfig.header}
                    onCheckedChange={(checked) => 
                      setLayoutConfig(prev => ({ ...prev, header: checked }))
                    }
                  />
                </div>
                <Separator />
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="business-info-toggle">Business Information</Label>
                  <Switch 
                    id="business-info-toggle"
                    checked={layoutConfig.businessInfo}
                    onCheckedChange={(checked) => 
                      setLayoutConfig(prev => ({ ...prev, businessInfo: checked }))
                    }
                  />
                </div>
                <Separator />
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="client-info-toggle">Client Information</Label>
                  <Switch 
                    id="client-info-toggle"
                    checked={layoutConfig.clientInfo}
                    onCheckedChange={(checked) => 
                      setLayoutConfig(prev => ({ ...prev, clientInfo: checked }))
                    }
                  />
                </div>
                <Separator />
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="invoice-info-toggle">Invoice Information</Label>
                  <Switch 
                    id="invoice-info-toggle"
                    checked={layoutConfig.invoiceInfo}
                    onCheckedChange={(checked) => 
                      setLayoutConfig(prev => ({ ...prev, invoiceInfo: checked }))
                    }
                  />
                </div>
                <Separator />
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="item-table-toggle">Item Table</Label>
                  <Switch 
                    id="item-table-toggle"
                    checked={layoutConfig.itemTable}
                    onCheckedChange={(checked) => 
                      setLayoutConfig(prev => ({ ...prev, itemTable: checked }))
                    }
                  />
                </div>
                <Separator />
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="summary-toggle">Summary</Label>
                  <Switch 
                    id="summary-toggle"
                    checked={layoutConfig.summary}
                    onCheckedChange={(checked) => 
                      setLayoutConfig(prev => ({ ...prev, summary: checked }))
                    }
                  />
                </div>
                <Separator />
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="notes-toggle">Notes</Label>
                  <Switch 
                    id="notes-toggle"
                    checked={layoutConfig.notes}
                    onCheckedChange={(checked) => 
                      setLayoutConfig(prev => ({ ...prev, notes: checked }))
                    }
                  />
                </div>
                <Separator />
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="footer-toggle">Footer</Label>
                  <Switch 
                    id="footer-toggle"
                    checked={layoutConfig.footer}
                    onCheckedChange={(checked) => 
                      setLayoutConfig(prev => ({ ...prev, footer: checked }))
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Style Configuration */}
        <TabsContent value="style" className="space-y-6">
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
                        {fontOptions.map(option => (
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
                        {fontSizeOptions.map(option => (
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
                        {tableStyleOptions.map(option => (
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

        {/* Content Configuration */}
        <TabsContent value="content" className="space-y-6">
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
                          <li><code>{{invoice_number}}</code> - The invoice number</li>
                          <li><code>{{issue_date}}</code> - Date the invoice was issued</li>
                          <li><code>{{due_date}}</code> - Due date for payment</li>
                          <li><code>{{client_name}}</code> - Client's name</li>
                          <li><code>{{business_name}}</code> - Your business name</li>
                          <li><code>{{subtotal}}</code> - Subtotal amount</li>
                          <li><code>{{tax_amount}}</code> - Tax amount</li>
                          <li><code>{{total}}</code> - Total amount</li>
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

      <div className="sticky bottom-0 bg-white p-4 border-t flex justify-end space-x-2 -mx-6 -mb-6 pt-4 shadow-md">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit">Save Template</Button>
      </div>
    </form>
  );
};

export default InvoiceTemplateEditor;
