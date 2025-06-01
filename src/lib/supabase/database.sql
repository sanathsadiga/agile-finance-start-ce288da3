
-- Create content tables for blog and documentation

-- Blog table to store blog posts
CREATE TABLE IF NOT EXISTS blogs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT NOT NULL,
  content TEXT,
  author_name TEXT,
  featured_image TEXT,
  published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  category TEXT,
  tags TEXT[] DEFAULT '{}',
  published BOOLEAN DEFAULT true
);

-- Documentation table for help pages and guides
CREATE TABLE IF NOT EXISTS documentation (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  published BOOLEAN DEFAULT true
);

-- Add is_admin column to profile table if it doesn't exist
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;

-- Create subscription_logs table to track subscription events if it doesn't exist
CREATE TABLE IF NOT EXISTS subscription_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  subscription_id UUID REFERENCES subscriptions(id) ON DELETE SET NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  event_type TEXT NOT NULL,
  previous_status TEXT,
  new_status TEXT,
  details JSONB,
  notes TEXT
);

-- Enable Row Level Security
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE documentation ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for blogs
CREATE POLICY "Public can view published blogs" 
ON blogs FOR SELECT 
USING (published = true);

CREATE POLICY "Admin users can edit blogs" 
ON blogs FOR ALL 
USING (
  auth.uid() IN (
    SELECT id FROM profiles WHERE is_admin = true
  )
);

-- Create RLS policies for documentation
CREATE POLICY "Public can view published documentation" 
ON documentation FOR SELECT 
USING (published = true);

CREATE POLICY "Admin users can edit documentation" 
ON documentation FOR ALL 
USING (
  auth.uid() IN (
    SELECT id FROM profiles WHERE is_admin = true
  )
);

-- Insert sample blog data
INSERT INTO blogs (title, slug, excerpt, content, author_name, featured_image, category, tags, published)
VALUES 
(
  'How to Manage Business Finances Effectively',
  'how-to-manage-business-finances',
  'In this blog, we share practical tips on how small business owners can manage their finances and stay organized.',
  'In today''s competitive business landscape, effective financial management is crucial for small business success. This blog post explores practical strategies for managing finances, from setting up proper accounting systems to planning for taxes and unexpected expenses. We''ll cover best practices, common pitfalls to avoid, and tools that can help streamline your financial processes.',
  'Finance Expert',
  'https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3',
  'Finance',
  ARRAY['finance', 'business', 'accounting'],
  true
),
(
  'Top 5 Accounting Mistakes to Avoid',
  'top-5-accounting-mistakes',
  'Avoid common accounting mistakes with these tips that can save you time and money while keeping your business finances in check.',
  'Proper accounting is the backbone of financial health for any business. However, many entrepreneurs make critical mistakes that can lead to cash flow problems, tax issues, or even legal troubles. This article highlights the five most common accounting errors and provides actionable advice on how to avoid them, ensuring your business maintains accurate financial records.',
  'Accounting Professional',
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3',
  'Accounting',
  ARRAY['accounting', 'mistakes', 'best practices'],
  true
),
(
  'The Benefits of Automating Your Invoicing',
  'benefits-of-automating-invoicing',
  'Automation is the future! Learn how automating your invoicing process can streamline your workflow and improve cash flow.',
  'Manual invoicing is time-consuming and prone to errors. By implementing automated invoicing systems, businesses can save countless hours, reduce mistakes, and get paid faster. This comprehensive guide explores the key benefits of invoice automation, from improved accuracy to better client relationships, and provides practical steps for transitioning from manual to automated processes.',
  'Tech Specialist',
  'https://images.unsplash.com/photo-1556155092-490a1ba16284?ixlib=rb-4.0.3',
  'Technology',
  ARRAY['automation', 'invoicing', 'tech'],
  true
);

-- Insert sample documentation data
INSERT INTO documentation (title, slug, content, category, order_index, published)
VALUES 
(
  'Getting Started with FinanceFlow',
  'getting-started',
  '# Welcome to FinanceFlow\n\nThis guide will help you get started with our financial management platform. FinanceFlow simplifies invoicing, expense tracking, and financial reporting for small businesses and freelancers.\n\n## Quick Start\n\n1. **Create your account**: Sign up with your email or Google account.\n2. **Set up your profile**: Add your business information and logo.\n3. **Create your first invoice**: Click on the Invoices tab and then "New Invoice".\n4. **Track expenses**: Navigate to the Expenses section to start recording your business expenses.\n\nFor more detailed instructions, explore our documentation sections.',
  'Getting Started',
  1,
  true
),
(
  'Creating and Managing Invoices',
  'creating-invoices',
  '# Invoice Management Guide\n\n## Creating a New Invoice\n\nTo create a new invoice, navigate to the Invoices tab and click the "New Invoice" button. You''ll need to:\n\n1. Select a client or add a new one\n2. Add line items with descriptions and prices\n3. Set payment terms and due date\n4. Preview and send your invoice\n\n## Managing Existing Invoices\n\nFrom the Invoices dashboard, you can:\n\n- **View status**: See which invoices are paid, pending, or overdue\n- **Send reminders**: Automatically notify clients about upcoming or overdue payments\n- **Record payments**: Mark invoices as paid once you receive payment\n- **Generate reports**: Track your income and outstanding receivables\n\n## Invoice Templates\n\nFinanceFlow offers customizable invoice templates to match your brand identity. To access templates:\n\n1. Go to Settings > Invoice Templates\n2. Choose a template or customize an existing one\n3. Add your logo and adjust colors as needed',
  'Features',
  1,
  true
),
(
  'Expense Tracking and Management',
  'expenses',
  '# Expense Management\n\n## Recording Expenses\n\nTracking expenses is essential for accurate financial reporting and tax preparation. With FinanceFlow, you can:\n\n1. **Add expenses**: Enter expense details including amount, date, category, and vendor\n2. **Attach receipts**: Upload digital copies of receipts for your records\n3. **Categorize expenses**: Organize expenditures for better financial analysis\n4. **Track recurring expenses**: Set up regular expenses that occur on a schedule\n\n## Expense Reports\n\nGenerate comprehensive expense reports to:\n\n- Analyze spending patterns\n- Prepare for tax filing\n- Monitor project-specific expenses\n- Review expenses by category or time period\n\n## Expense Policies\n\nSet up expense policies to maintain consistency in your financial records:\n\n1. Define approved expense categories\n2. Set spending limits by category\n3. Establish approval workflows for larger expenses',
  'Features',
  2,
  true
);

-- Add support@econatuarls.site as admin user if not exists
DO $$
DECLARE
  support_user_id UUID;
BEGIN
  -- First check if user exists in auth.users
  SELECT id INTO support_user_id FROM auth.users WHERE email = 'support@econatuarls.life';
  
  IF support_user_id IS NULL THEN
    -- User doesn't exist, we'll create a placeholder record in profiles
    -- In production, you would typically create the user through auth API first
    INSERT INTO profiles (id, first_name, last_name, email, is_admin)
    VALUES (
      uuid_generate_v4(),
      'Support',
      'Admin',
      'support@econatuarls.life',
      true
    );
  ELSE
    -- User exists, update profile to ensure admin status
    UPDATE profiles
    SET is_admin = true
    WHERE id = support_user_id;
  END IF;
END $$;
