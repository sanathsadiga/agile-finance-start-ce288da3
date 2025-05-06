import React from 'react';
import { InvoiceTemplate } from '@/hooks/useInvoiceTemplates';

interface InvoiceTemplatePreviewProps {
  template: InvoiceTemplate;
}

const InvoiceTemplatePreview: React.FC<InvoiceTemplatePreviewProps> = ({ template }) => {
  const { style_config: styleConfig, content_config: contentConfig, layout_config: layoutConfig, logo } = template;

  // Generate simplified HTML preview based on template settings
  const generatePreviewHtml = () => {
    const { fontFamily, fontSize, primaryColor, secondaryColor, textColor, tableStyle } = styleConfig;
    const { headerText, footerText, notesLabel, termsLabel, discountLabel } = contentConfig;
    
    return `
      <div style="font-family: ${fontFamily}; font-size: ${fontSize}; color: ${textColor}; padding: 20px;">
        ${layoutConfig.header ? `<div style="margin-bottom: 20px; text-align: ${styleConfig.headerAlignment};">
          <h1 style="color: ${primaryColor}; margin: 0;">${headerText}</h1>
        </div>` : ''}
        
        ${layoutConfig.logo ? `<div style="text-align: ${styleConfig.logoPosition}; margin-bottom: 20px;">
          ${logo ? 
            `<div style="display: inline-block; max-width: 100px; max-height: 100px; overflow: hidden;">
              <img src="${logo}" alt="Company Logo" style="width: 100%; height: 100%; object-fit: contain;" />
             </div>` : 
            `<div style="display: inline-block; width: 100px; height: 100px; background: ${secondaryColor}; border: 2px dashed ${primaryColor}; display: flex; align-items: center; justify-content: center;">Logo</div>`
          }
        </div>` : ''}
        
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
          <table style="width: 100%; border-collapse: collapse; ${styleConfig.tableStyle === 'bordered' ? 'border: 1px solid #e5e7eb;' : ''} ${styleConfig.tableStyle === 'striped' ? 'border: none;' : ''}">
            <thead>
              <tr style="background-color: ${primaryColor}; color: white;">
                <th style="padding: 10px; text-align: left;">Item</th>
                <th style="padding: 10px; text-align: right;">Quantity</th>
                <th style="padding: 10px; text-align: right;">Rate</th>
                <th style="padding: 10px; text-align: right;">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr style="${styleConfig.tableStyle === 'bordered' ? 'border-bottom: 1px solid #e5e7eb;' : ''} ${styleConfig.tableStyle === 'striped' ? 'background-color: #f9fafb;' : ''}">
                <td style="padding: 10px;">Website Design</td>
                <td style="padding: 10px; text-align: right;">1</td>
                <td style="padding: 10px; text-align: right;">$800.00</td>
                <td style="padding: 10px; text-align: right;">$800.00</td>
              </tr>
              <tr style="${styleConfig.tableStyle === 'bordered' ? 'border-bottom: 1px solid #e5e7eb;' : ''}">
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

  return (
    <div 
      dangerouslySetInnerHTML={{ __html: generatePreviewHtml() }} 
      className="border rounded-md overflow-hidden"
    />
  );
};

export default InvoiceTemplatePreview;
