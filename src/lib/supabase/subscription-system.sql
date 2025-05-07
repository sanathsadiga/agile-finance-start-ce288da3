
-- Subscription system tables

-- Create plans table to store subscription plan details
CREATE TABLE IF NOT EXISTS plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(12, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'usd',
  interval TEXT NOT NULL CHECK (interval IN ('month', 'year')),
  interval_count INTEGER NOT NULL DEFAULT 1,
  trial_period_days INTEGER,
  features JSONB,
  metadata JSONB,
  stripe_price_id TEXT,
  is_active BOOLEAN DEFAULT true
);

-- Create subscriptions table to link users with their subscription plans
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_id UUID NOT NULL REFERENCES plans(id),
  status TEXT NOT NULL CHECK (status IN (
    'active', 'canceled', 'incomplete', 'incomplete_expired', 
    'past_due', 'trialing', 'unpaid'
  )),
  current_period_start TIMESTAMP WITH TIME ZONE NOT NULL,
  current_period_end TIMESTAMP WITH TIME ZONE NOT NULL,
  cancel_at_period_end BOOLEAN DEFAULT false,
  canceled_at TIMESTAMP WITH TIME ZONE,
  trial_start TIMESTAMP WITH TIME ZONE,
  trial_end TIMESTAMP WITH TIME ZONE,
  stripe_subscription_id TEXT,
  stripe_customer_id TEXT,
  metadata JSONB
);

-- Create subscription_logs table to track subscription lifecycle events
CREATE TABLE IF NOT EXISTS subscription_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  subscription_id UUID REFERENCES subscriptions(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  previous_status TEXT,
  new_status TEXT,
  details JSONB,
  notes TEXT
);

-- Create subscription_invoices table to link subscriptions with invoices
CREATE TABLE IF NOT EXISTS subscription_invoices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  subscription_id UUID REFERENCES subscriptions(id) ON DELETE CASCADE,
  invoice_id UUID REFERENCES invoices(id) ON DELETE SET NULL,
  amount DECIMAL(12, 2) NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('draft', 'open', 'paid', 'uncollectible', 'void')),
  due_date TIMESTAMP WITH TIME ZONE,
  paid_at TIMESTAMP WITH TIME ZONE,
  stripe_invoice_id TEXT,
  metadata JSONB
);

-- Enable Row Level Security
ALTER TABLE plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_invoices ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for plans
CREATE POLICY "Plans are viewable by everyone" 
ON plans FOR SELECT 
USING (is_active = true);

CREATE POLICY "Only admins can insert plans" 
ON plans FOR INSERT 
WITH CHECK (auth.uid() IN (SELECT id FROM auth.users WHERE raw_user_meta_data->>'isAdmin' = 'true'));

CREATE POLICY "Only admins can update plans" 
ON plans FOR UPDATE 
USING (auth.uid() IN (SELECT id FROM auth.users WHERE raw_user_meta_data->>'isAdmin' = 'true'));

-- Create RLS policies for subscriptions
CREATE POLICY "Users can view their own subscriptions" 
ON subscriptions FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Service role can insert subscriptions" 
ON subscriptions FOR INSERT 
WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Service role can update subscriptions" 
ON subscriptions FOR UPDATE 
USING (auth.role() = 'service_role');

-- Create RLS policies for subscription_logs
CREATE POLICY "Users can view their own subscription logs" 
ON subscription_logs FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Service role can insert subscription logs" 
ON subscription_logs FOR INSERT 
WITH CHECK (auth.role() = 'service_role');

-- Create RLS policies for subscription_invoices
CREATE POLICY "Users can view their own subscription invoices" 
ON subscription_invoices FOR SELECT 
USING (auth.uid() IN (
  SELECT user_id FROM subscriptions WHERE id = subscription_id
));

CREATE POLICY "Service role can insert subscription invoices" 
ON subscription_invoices FOR INSERT 
WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Service role can update subscription invoices" 
ON subscription_invoices FOR UPDATE 
USING (auth.role() = 'service_role');

-- Insert sample subscription plans
INSERT INTO plans (name, description, price, currency, interval, features, metadata)
VALUES 
(
  'Basic',
  'Perfect for freelancers and small businesses just getting started',
  9.99,
  'usd',
  'month',
  jsonb_build_array(
    'Up to 20 invoices per month',
    'Basic expense tracking',
    'Essential financial reports',
    'Email support'
  ),
  '{}'::jsonb
),
(
  'Professional',
  'Ideal for growing businesses with increased invoicing needs',
  19.99,
  'usd',
  'month',
  jsonb_build_array(
    'Unlimited invoices',
    'Advanced expense tracking',
    'Comprehensive financial reports',
    'Priority email support',
    'Customizable invoice templates',
    'Client portal'
  ),
  '{}'::jsonb
),
(
  'Enterprise',
  'Complete solution for established businesses with complex needs',
  39.99,
  'usd',
  'month',
  jsonb_build_array(
    'Everything in Professional',
    'Multi-user access',
    'Advanced permissions',
    'Dedicated account manager',
    'Phone support',
    'Custom integrations',
    'API access'
  ),
  '{}'::jsonb
),
(
  'Basic Annual',
  'Perfect for freelancers and small businesses just getting started (Annual billing)',
  99.99,
  'usd',
  'year',
  jsonb_build_array(
    'Up to 20 invoices per month',
    'Basic expense tracking',
    'Essential financial reports',
    'Email support'
  ),
  '{}'::jsonb
),
(
  'Professional Annual',
  'Ideal for growing businesses with increased invoicing needs (Annual billing)',
  199.99,
  'usd',
  'year',
  jsonb_build_array(
    'Unlimited invoices',
    'Advanced expense tracking',
    'Comprehensive financial reports',
    'Priority email support',
    'Customizable invoice templates',
    'Client portal'
  ),
  '{}'::jsonb
),
(
  'Enterprise Annual',
  'Complete solution for established businesses with complex needs (Annual billing)',
  399.99,
  'usd',
  'year',
  jsonb_build_array(
    'Everything in Professional',
    'Multi-user access',
    'Advanced permissions',
    'Dedicated account manager',
    'Phone support',
    'Custom integrations',
    'API access'
  ),
  '{}'::jsonb
);
