
import React from 'react';
import { InvoiceTemplate } from '@/hooks/useInvoiceTemplates';
import { Card, CardContent } from "@/components/ui/card";

interface InvoiceTemplatePreviewProps {
  template: InvoiceTemplate;
}

const InvoiceTemplatePreview: React.FC<InvoiceTemplatePreviewProps> = ({ template }) => {
  const { layout_config: layout, style_config: style, content_config: content } = template;
  
  // Generate a sample invoice for preview
  const sampleInvoice = {
    invoice_number: 'INV-1001',
    issue_date: '2025-05-03',
    due_date: '2025-06-02',
    client_name: 'Sample Client',
    business_name: 'Your Business',
    subtotal: 1000,
    tax_amount: 100,
    total: 1100,
    items: [
      { description: 'Service 1', quantity: 2, rate: 250, amount: 500 },
      { description: 'Service 2', quantity: 1, rate: 500, amount: 500 }
    ],
    notes: 'Thank you for your business.',
    terms: 'Payment due within 30 days.'
  };

  // Replace tokens with values
  const replaceTokens = (text: string) => {
    return text
      .replace(/{{invoice_number}}/g, sampleInvoice.invoice_number)
      .replace(/{{issue_date}}/g, sampleInvoice.issue_date)
      .replace(/{{due_date}}/g, sampleInvoice.due_date)
      .replace(/{{client_name}}/g, sampleInvoice.client_name)
      .replace(/{{business_name}}/g, sampleInvoice.business_name)
      .replace(/{{subtotal}}/g, `$${sampleInvoice.subtotal.toFixed(2)}`)
      .replace(/{{tax_amount}}/g, `$${sampleInvoice.tax_amount.toFixed(2)}`)
      .replace(/{{total}}/g, `$${sampleInvoice.total.toFixed(2)}`);
  };

  const getTableStyle = () => {
    switch (style.tableStyle) {
      case 'bordered':
        return 'border-collapse border border-gray-200';
      case 'borderless':
        return 'border-collapse';
      case 'striped':
        return 'border-collapse border-none [&_tr:nth-child(odd)]:bg-gray-50';
      default:
        return 'border-collapse border border-gray-200';
    }
  };

  // Use CSS variables for styling
  const previewStyle = {
    '--font-family': style.fontFamily,
    '--font-size': style.fontSize,
    '--primary-color': style.primaryColor,
    '--secondary-color': style.secondaryColor,
    '--text-color': style.textColor,
    '--border-style': style.borderStyle,
    '--header-alignment': style.headerAlignment,
    '--logo-position': style.logoPosition,
  } as React.CSSProperties;

  return (
    <div className="overflow-auto">
      <Card className="w-full max-w-[800px] mx-auto">
        <CardContent className="p-6">
          <div
            style={previewStyle}
            className="preview-container p-8 font-sans text-gray-800"
            style={{
              fontFamily: style.fontFamily,
              fontSize: style.fontSize,
              color: style.textColor,
            }}
          >
            {/* Header */}
            {layout.header && (
              <div 
                className="mb-8" 
                style={{ textAlign: style.headerAlignment as 'left' | 'center' | 'right' }}
              >
                <div 
                  className="text-2xl font-bold" 
                  style={{ color: style.primaryColor }}
                >
                  {replaceTokens(content.headerText)}
                </div>
              </div>
            )}
            
            <div className="flex justify-between mb-8 flex-col md:flex-row gap-4">
              {/* Business Info */}
              {layout.businessInfo && (
                <div className="md:w-1/2">
                  <div className="text-sm font-bold mb-1">FROM</div>
                  <div className="font-bold">{sampleInvoice.business_name}</div>
                  <div>123 Business Street</div>
                  <div>Businesstown, BZ 12345</div>
                  <div>business@example.com</div>
                </div>
              )}
              
              {/* Client Info */}
              {layout.clientInfo && (
                <div className="md:w-1/2">
                  <div className="text-sm font-bold mb-1">BILL TO</div>
                  <div className="font-bold">{sampleInvoice.client_name}</div>
                  <div>456 Client Avenue</div>
                  <div>Clientville, CL 67890</div>
                  <div>client@example.com</div>
                </div>
              )}
            </div>
            
            {/* Invoice Info */}
            {layout.invoiceInfo && (
              <div 
                className="mb-8 p-4 rounded" 
                style={{ backgroundColor: style.secondaryColor }}
              >
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <div className="text-xs font-bold">INVOICE #</div>
                    <div>{sampleInvoice.invoice_number}</div>
                  </div>
                  <div>
                    <div className="text-xs font-bold">DATE</div>
                    <div>{sampleInvoice.issue_date}</div>
                  </div>
                  <div>
                    <div className="text-xs font-bold">DUE DATE</div>
                    <div>{sampleInvoice.due_date}</div>
                  </div>
                  <div>
                    <div className="text-xs font-bold">STATUS</div>
                    <div 
                      className="inline-block px-2 py-1 rounded text-xs font-bold" 
                      style={{ backgroundColor: style.primaryColor, color: '#fff' }}
                    >
                      UNPAID
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Items Table */}
            {layout.itemTable && (
              <div className="mb-8 overflow-x-auto">
                <table className={`w-full ${getTableStyle()}`}>
                  <thead>
                    <tr style={{ backgroundColor: style.primaryColor, color: '#fff' }}>
                      <th className="p-2 text-left">Item</th>
                      <th className="p-2 text-right">Quantity</th>
                      <th className="p-2 text-right">Rate</th>
                      <th className="p-2 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sampleInvoice.items.map((item, index) => (
                      <tr 
                        key={index} 
                        className="border-b"
                        style={{ borderBottomStyle: style.borderStyle ? 'solid' : 'none' }}
                      >
                        <td className="p-2">{item.description}</td>
                        <td className="p-2 text-right">{item.quantity}</td>
                        <td className="p-2 text-right">${item.rate.toFixed(2)}</td>
                        <td className="p-2 text-right">${item.amount.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            
            {/* Summary */}
            {layout.summary && (
              <div className="flex justify-end mb-8">
                <div className="w-full md:w-1/3">
                  <div className="flex justify-between py-2">
                    <div>Subtotal</div>
                    <div>${sampleInvoice.subtotal.toFixed(2)}</div>
                  </div>
                  <div 
                    className="flex justify-between py-2 border-b" 
                    style={{ borderBottomStyle: style.borderStyle ? 'solid' : 'none' }}
                  >
                    <div>Tax (10%)</div>
                    <div>${sampleInvoice.tax_amount.toFixed(2)}</div>
                  </div>
                  <div className="flex justify-between py-2 font-bold">
                    <div>Total</div>
                    <div style={{ color: style.primaryColor }}>
                      ${sampleInvoice.total.toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Notes */}
            {layout.notes && (
              <div 
                className="mb-8 p-4 rounded" 
                style={{ backgroundColor: style.secondaryColor }}
              >
                <div className="text-sm font-bold mb-2">
                  {content.notesLabel}
                </div>
                <div>{sampleInvoice.notes}</div>
                
                <div className="mt-4 text-sm font-bold mb-2">
                  {content.termsLabel}
                </div>
                <div>{sampleInvoice.terms}</div>
              </div>
            )}
            
            {/* Footer */}
            {layout.footer && (
              <div 
                className="text-center text-sm mt-8 pt-4 border-t"
                style={{ borderTopStyle: style.borderStyle ? 'solid' : 'none' }}
              >
                {replaceTokens(content.footerText)}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InvoiceTemplatePreview;
