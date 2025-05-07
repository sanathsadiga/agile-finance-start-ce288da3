
-- Create blogs table
CREATE TABLE IF NOT EXISTS blogs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT NOT NULL,
  excerpt TEXT,
  author UUID REFERENCES auth.users(id),
  author_name TEXT,
  author_avatar TEXT,
  featured_image TEXT,
  published BOOLEAN DEFAULT FALSE,
  published_at TIMESTAMP WITH TIME ZONE,
  category TEXT,
  tags TEXT[]
);

-- Create documentation table
CREATE TABLE IF NOT EXISTS documentation (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  section TEXT,
  order_index INTEGER,
  author UUID REFERENCES auth.users(id),
  last_updated_by UUID REFERENCES auth.users(id)
);

-- Enable Row Level Security
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE documentation ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for blogs
CREATE POLICY "Public blogs are viewable by everyone" 
ON blogs FOR SELECT 
USING (published = true);

CREATE POLICY "Users can insert their own blogs" 
ON blogs FOR INSERT 
WITH CHECK (auth.uid() = author);

CREATE POLICY "Users can update their own blogs" 
ON blogs FOR UPDATE 
USING (auth.uid() = author);

-- Create RLS policies for documentation
CREATE POLICY "Documentation is viewable by everyone" 
ON documentation FOR SELECT 
USING (true);

CREATE POLICY "Only admins can insert documentation" 
ON documentation FOR INSERT 
WITH CHECK (auth.uid() IN (SELECT id FROM auth.users WHERE raw_user_meta_data->>'isAdmin' = 'true'));

CREATE POLICY "Only admins can update documentation" 
ON documentation FOR UPDATE 
USING (auth.uid() IN (SELECT id FROM auth.users WHERE raw_user_meta_data->>'isAdmin' = 'true'));

-- Insert sample blog posts
INSERT INTO blogs (title, slug, content, excerpt, author_name, featured_image, published, published_at, category, tags)
VALUES 
(
  'How to Manage Business Finances Effectively', 
  'how-to-manage-business-finances', 
  '# How to Manage Business Finances Effectively

Managing your business finances effectively is crucial for long-term success. Here are some practical tips to help you stay organized and make informed financial decisions.

## 1. Separate Personal and Business Finances

One of the most important steps in managing business finances is to keep them separate from your personal finances. Open a dedicated business bank account and use a business credit card for all company expenses.

## 2. Track All Income and Expenses

Maintain accurate records of all financial transactions. Use accounting software to track income, expenses, invoices, and receipts. This will make tax time easier and provide valuable insights into your business performance.

## 3. Set Up a Budget and Stick to It

Create a realistic budget for your business and review it regularly. A budget helps you allocate resources efficiently and identify areas where you can cut costs.

## 4. Monitor Cash Flow

Cash flow is the lifeblood of any business. Monitor it closely to ensure you have enough cash on hand to cover expenses and invest in growth opportunities.

## 5. Plan for Taxes

Set aside money for taxes throughout the year rather than scrambling to find funds when tax deadlines approach. Consider working with a tax professional to maximize deductions and minimize liabilities.

## 6. Build an Emergency Fund

Unexpected expenses can arise at any time. Having a financial cushion will help your business weather tough times without taking on debt.

## 7. Review Financial Statements Regularly

Review your income statement, balance sheet, and cash flow statement at least monthly. These documents provide a snapshot of your business''s financial health and can help you identify trends and make informed decisions.

By implementing these strategies, you can take control of your business finances and set yourself up for long-term success.',
  'In this blog, we share practical tips on how small business owners can manage their finances and stay organized for long-term success.',
  'Finance Expert',
  'https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80',
  true,
  NOW(),
  'Finance',
  ARRAY['finance', 'business', 'accounting']
),
(
  'Top 5 Accounting Mistakes to Avoid', 
  'top-5-accounting-mistakes', 
  '# Top 5 Accounting Mistakes to Avoid

Proper accounting is essential for business success, but many entrepreneurs make common mistakes that can lead to financial troubles. Here are the top five accounting errors to avoid:

## 1. Mixing Personal and Business Expenses

Combining personal and business finances makes it difficult to track business performance and complicates tax preparation. Always maintain separate accounts and credit cards for your business.

## 2. Neglecting to Track Small Expenses

Small expenses may seem insignificant individually, but they add up over time. Tracking all expenses, no matter how small, gives you an accurate picture of your business spending and ensures you don''t miss out on tax deductions.

## 3. DIY Accounting Without Proper Knowledge

While it''s tempting to save money by handling accounting yourself, this can lead to costly mistakes if you lack expertise. Consider investing in accounting software or hiring a professional to ensure accuracy.

## 4. Forgetting to Reconcile Accounts

Regular reconciliation of your bank statements and accounting records helps catch errors and prevent fraud. Make this a monthly practice to maintain financial accuracy.

## 5. Poor Record Keeping

Disorganized or incomplete financial records can cause numerous problems, from tax issues to cash flow challenges. Implement a systematic approach to storing and organizing financial documents, preferably digitally for easy retrieval.

By avoiding these common accounting pitfalls, you can maintain healthier finances and focus on growing your business rather than fixing preventable problems.',
  'Avoid common accounting mistakes with these tips that can save you time and money while keeping your business finances in check.',
  'Accounting Professional',
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2426&q=80',
  true,
  NOW(),
  'Accounting',
  ARRAY['accounting', 'mistakes', 'best practices']
),
(
  'The Benefits of Automating Your Invoicing', 
  'benefits-of-automating-invoicing', 
  '# The Benefits of Automating Your Invoicing

Automating your invoicing process can transform how your business handles billing and collections. Here are the key benefits of making the switch to automated invoicing:

## 1. Time Savings

Manual invoicing is time-consuming. Creating invoices, sending them to clients, and tracking payments can take hours each week. Automation reduces this to minutes, freeing up time for more valuable activities.

## 2. Fewer Errors

Manual data entry inevitably leads to mistakes. Automated systems reduce human error by calculating totals, taxes, and discounts automatically, ensuring accuracy in every invoice.

## 3. Faster Payments

Automated invoicing solutions can send invoices immediately upon job completion, include payment links for instant transactions, and set up automatic reminders for overdue invoices. This streamlined process typically results in quicker payments.

## 4. Improved Cash Flow

Getting paid faster and more consistently improves your cash flow. Better cash flow means more stability and opportunities for growth investment.

## 5. Enhanced Professionalism

Well-designed, consistent invoices with your branding create a professional impression. Automated systems ensure every invoice looks polished and contains all required information.

## 6. Better Tracking and Reporting

Automated systems provide valuable insights into your billing patterns, payment trends, and outstanding accounts. These analytics can help you make informed business decisions.

## 7. Environmentally Friendly

Digital invoices eliminate the need for paper, printing, and physical storage, reducing your business''s environmental footprint.

Implementing an automated invoicing system may require some initial setup time and possibly a financial investment, but the long-term benefits far outweigh these costs. Whether you''re a freelancer or running a large business, invoice automation can significantly improve your efficiency and bottom line.',
  'Automation is the future! Learn how automating your invoicing process can streamline your workflow and improve cash flow.',
  'Tech Specialist',
  'https://images.unsplash.com/photo-1556155092-490a1ba16284?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80',
  true,
  NOW(),
  'Technology',
  ARRAY['automation', 'invoicing', 'tech']
);

-- Insert sample documentation
INSERT INTO documentation (title, slug, content, category, section, order_index)
VALUES 
(
  'Getting Started with FinanceFlow', 
  'getting-started', 
  '# Getting Started with FinanceFlow

Welcome to FinanceFlow! This guide will help you set up your account and start managing your finances more effectively.

## Creating Your Account

1. Click the "Sign up" button in the top right corner of the homepage.
2. Enter your email address and create a strong password.
3. Fill in your business information to personalize your experience.
4. Verify your email address by clicking the link sent to your inbox.

## Setting Up Your Profile

1. Navigate to "Settings" from the dashboard.
2. Complete your business profile by adding details like your company name, address, and logo.
3. Configure your invoice settings, including default payment terms and invoice numbering.
4. Set up tax rates if applicable to your business.

## Creating Your First Invoice

1. Go to "Invoices" in the sidebar menu.
2. Click "Create New Invoice."
3. Add your client''s information or select from existing clients.
4. Add line items with descriptions, quantities, and prices.
5. Set the issue date and due date.
6. Preview your invoice and make any necessary adjustments.
7. Click "Save" to store as a draft or "Send" to email to your client.

## Tracking Expenses

1. Navigate to "Expenses" in the sidebar menu.
2. Click "Add Expense" to record a new expense.
3. Enter details such as the date, amount, category, and vendor.
4. Upload a receipt image if available.
5. Save the expense to include it in your financial reports.

## Viewing Reports

1. Go to "Reports" in the sidebar menu.
2. Select the type of report you want to view (e.g., Profit & Loss, Cash Flow).
3. Set the date range for your report.
4. Export or print reports as needed for your records.

Congratulations! You''ve completed the basic setup of your FinanceFlow account. Explore the other features to discover more ways to streamline your financial management.',
  'Getting Started',
  'User Guide',
  1
),
(
  'API Documentation', 
  'api-documentation', 
  '# FinanceFlow API Documentation

This guide provides information about the FinanceFlow API endpoints, authentication methods, and usage examples.

## Authentication

All API requests require authentication using an API key. You can generate an API key in your account settings.

**Headers:**
```
Authorization: Bearer YOUR_API_KEY
Content-Type: application/json
```

## Endpoints

### Invoices

#### List Invoices

```
GET /api/v1/invoices
```

**Query Parameters:**
- `limit` (optional): Number of invoices to return (default: 50)
- `offset` (optional): Number of invoices to skip (default: 0)
- `status` (optional): Filter by status (draft, sent, paid, overdue)

**Response:**
```json
{
  "invoices": [
    {
      "id": "inv_123456",
      "customer": "Client Name",
      "amount": 1500.00,
      "date": "2023-04-15",
      "due_date": "2023-05-15",
      "status": "paid"
    },
    ...
  ],
  "total_count": 120
}
```

#### Get Invoice Details

```
GET /api/v1/invoices/{invoice_id}
```

**Response:**
```json
{
  "id": "inv_123456",
  "number": "INV-1001",
  "customer": {
    "name": "Client Name",
    "email": "client@example.com",
    "address": "123 Main St"
  },
  "items": [
    {
      "description": "Web Development",
      "quantity": 10,
      "unit_price": 150.00,
      "amount": 1500.00
    }
  ],
  "subtotal": 1500.00,
  "tax": 75.00,
  "total": 1575.00,
  "date": "2023-04-15",
  "due_date": "2023-05-15",
  "status": "paid",
  "notes": "Thank you for your business"
}
```

### Expenses

#### List Expenses

```
GET /api/v1/expenses
```

**Query Parameters:**
- `limit` (optional): Number of expenses to return (default: 50)
- `offset` (optional): Number of expenses to skip (default: 0)
- `category` (optional): Filter by category

**Response:**
```json
{
  "expenses": [
    {
      "id": "exp_789012",
      "date": "2023-04-10",
      "amount": 250.75,
      "category": "Office Supplies",
      "vendor": "Office Depot"
    },
    ...
  ],
  "total_count": 85
}
```

## Error Handling

The API returns standard HTTP status codes:

- 200: Success
- 400: Bad Request
- 401: Unauthorized
- 404: Resource Not Found
- 500: Server Error

Error responses include a message:

```json
{
  "error": {
    "message": "Invalid invoice ID",
    "code": "invalid_id"
  }
}
```

## Rate Limiting

API requests are limited to 100 requests per minute per API key. If you exceed this limit, you will receive a 429 Too Many Requests response.

## Webhooks

You can configure webhooks to receive real-time updates when events occur in your account. Set up webhooks in your account settings.

Available events:
- `invoice.created`
- `invoice.paid`
- `expense.created`
- `client.created`

For more information or support with the API, contact our developer support team.',
  'API',
  'Developer',
  1
),
(
  'Frequently Asked Questions', 
  'faq', 
  '# Frequently Asked Questions

## General Questions

### What is FinanceFlow?

FinanceFlow is an all-in-one financial management platform designed for small businesses and freelancers. It helps you create professional invoices, track expenses, monitor cash flow, and generate financial reports.

### How secure is my financial data?

We take security very seriously. FinanceFlow uses bank-level encryption for all data, implements two-factor authentication, and regularly undergoes security audits. Your data is backed up daily and stored securely in the cloud.

### Can I access FinanceFlow on my mobile device?

Yes, FinanceFlow is fully responsive and works on smartphones and tablets. We also offer dedicated mobile apps for iOS and Android for an optimized mobile experience.

## Account & Billing

### How much does FinanceFlow cost?

FinanceFlow offers several pricing plans to meet different needs:
- Free: Basic invoicing and expense tracking for solo entrepreneurs
- Starter: $9.99/month for additional features like recurring invoices
- Professional: $19.99/month for advanced reporting and multiple users
- Enterprise: Contact sales for custom pricing

### Can I change my plan later?

Yes, you can upgrade or downgrade your plan at any time. When upgrading, you'll gain immediate access to additional features. When downgrading, changes take effect at the end of your billing cycle.

### How do I cancel my subscription?

To cancel your subscription, go to Settings > Billing and click "Cancel Subscription." You'll continue to have access to your current plan until the end of your billing period.

## Invoicing

### Can I customize my invoice templates?

Yes, FinanceFlow offers several professional invoice templates that you can customize with your logo, colors, and business information. Premium plans include advanced customization options.

### How do I send invoices to clients?

You can send invoices directly from FinanceFlow via email. The system allows you to include a personalized message, and clients receive a professional email with a PDF attachment and a link to pay online.

### Can clients pay invoices online?

Yes, FinanceFlow supports online payments through integrations with popular payment processors like Stripe, PayPal, and Square. Clients can pay with credit cards or other supported payment methods.

## Expenses

### Can I import expenses from my bank?

Yes, premium plans include bank connections that allow you to import transactions directly from your bank accounts. You can also manually upload bank statements in CSV format.

### How do I categorize expenses?

FinanceFlow offers standard expense categories aligned with tax reporting requirements. You can also create custom categories to match your specific business needs.

### Can I attach receipts to expenses?

Yes, you can upload digital copies of receipts and attach them to expense entries. This helps maintain organized records for tax purposes and audits.

## Support

### How can I get help if I have questions?

We offer several support channels:
- Knowledge base with detailed guides and tutorials
- Email support for all customers
- Live chat support for premium plans
- Phone support for enterprise customers

### Do you offer training for new users?

Yes, we provide free onboarding webinars twice weekly, video tutorials, and step-by-step guides to help you get started. Enterprise plans include personalized training sessions.

### Can I suggest new features?

Absolutely! We value customer feedback and regularly implement user-suggested features. You can submit feature requests through the "Feedback" option in your account settings.',
  'FAQs',
  'Support',
  1
);
