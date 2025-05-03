
-- Drop existing tables if they exist
DROP TABLE IF EXISTS tax_settings;
DROP TABLE IF EXISTS invoice_settings;
DROP TABLE IF EXISTS expenses;
DROP TABLE IF EXISTS invoices;
DROP TABLE IF EXISTS profiles;

-- Create profiles table with proper structure
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  company_name TEXT,
  email TEXT NOT NULL UNIQUE,
  avatar_url TEXT,
  email_confirmed BOOLEAN DEFAULT FALSE,
  -- Business related fields
  business_phone TEXT,
  business_website TEXT,
  business_address TEXT,
  business_city TEXT,
  business_state TEXT,
  business_postal_code TEXT,
  business_country TEXT,
  default_currency TEXT DEFAULT 'usd'
);

-- Create invoice settings table with user identification fields
CREATE TABLE IF NOT EXISTS invoice_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  user_email TEXT,
  user_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  invoice_prefix TEXT DEFAULT 'INV-',
  next_invoice_number INTEGER DEFAULT 1001,
  default_payment_terms INTEGER DEFAULT 30,
  auto_reminders BOOLEAN DEFAULT FALSE,
  logo_url TEXT,
  notes_default TEXT,
  terms_default TEXT
);

-- Create tax settings table with user identification fields
CREATE TABLE IF NOT EXISTS tax_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  user_email TEXT,
  user_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  tax_enabled BOOLEAN DEFAULT FALSE,
  default_tax_rate DECIMAL(5,2) DEFAULT 0,
  tax_name TEXT DEFAULT 'Sales Tax',
  tax_registration_number TEXT
);

-- Create expenses table
CREATE TABLE IF NOT EXISTS expenses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  user_email TEXT,
  user_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  date DATE NOT NULL,
  amount DECIMAL(15,2) NOT NULL,
  category TEXT NOT NULL,
  payment_method TEXT NOT NULL DEFAULT 'card',
  description TEXT NOT NULL,
  vendor TEXT,
  receipt BOOLEAN DEFAULT FALSE,
  receipt_url TEXT,
  notes TEXT,
  is_recurring BOOLEAN DEFAULT FALSE,
  recurrence_frequency TEXT,
  recurrence_interval INTEGER,
  recurrence_end_date DATE,
  currency TEXT DEFAULT 'usd'
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE tax_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view their own profile" 
ON profiles FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
ON profiles FOR UPDATE 
USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" 
ON profiles FOR INSERT 
WITH CHECK (auth.uid() = id);

CREATE POLICY "Service role can insert any profile" 
ON profiles FOR INSERT 
WITH CHECK (auth.role() = 'service_role' OR auth.uid() = id);

-- Create RLS policies for invoice_settings
CREATE POLICY "Users can view their own invoice settings" 
ON invoice_settings FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own invoice settings" 
ON invoice_settings FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own invoice settings" 
ON invoice_settings FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for tax_settings
CREATE POLICY "Users can view their own tax settings" 
ON tax_settings FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own tax settings" 
ON tax_settings FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own tax settings" 
ON tax_settings FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for expenses
CREATE POLICY "Users can view their own expenses" 
ON expenses FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own expenses" 
ON expenses FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own expenses" 
ON expenses FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own expenses" 
ON expenses FOR DELETE 
USING (auth.uid() = user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update the updated_at column for profiles
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON profiles
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Trigger to automatically update the updated_at column for invoice_settings
CREATE TRIGGER update_invoice_settings_updated_at
BEFORE UPDATE ON invoice_settings
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Trigger to automatically update the updated_at column for tax_settings
CREATE TRIGGER update_tax_settings_updated_at
BEFORE UPDATE ON tax_settings
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Trigger to automatically update the updated_at column for expenses
CREATE TRIGGER update_expenses_updated_at
BEFORE UPDATE ON expenses
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Create a function for automatic profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  user_full_name TEXT;
BEGIN
  -- Set email confirmed based on email_confirmed_at field
  INSERT INTO public.profiles (
    id, 
    first_name, 
    last_name, 
    email, 
    company_name,
    email_confirmed
  )
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
    COALESCE(NEW.email, ''),
    COALESCE(NEW.raw_user_meta_data->>'company_name', NULL),
    COALESCE(NEW.email_confirmed_at IS NOT NULL, FALSE)
  );
  
  -- Calculate full name for reference in settings tables
  user_full_name := COALESCE(NEW.raw_user_meta_data->>'first_name', '') || ' ' || COALESCE(NEW.raw_user_meta_data->>'last_name', '');
  
  -- Insert default invoice settings with user identification
  INSERT INTO public.invoice_settings (
    user_id, 
    user_email, 
    user_name
  )
  VALUES (
    NEW.id, 
    COALESCE(NEW.email, ''),
    user_full_name
  );
  
  -- Insert default tax settings with user identification
  INSERT INTO public.tax_settings (
    user_id, 
    user_email, 
    user_name
  )
  VALUES (
    NEW.id, 
    COALESCE(NEW.email, ''),
    user_full_name
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger the function every time a user is created
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Create a function to update email_confirmed when auth confirms email
CREATE OR REPLACE FUNCTION public.handle_email_confirmation()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if email confirmation status changed to confirmed
  IF OLD.email_confirmed_at IS NULL AND NEW.email_confirmed_at IS NOT NULL THEN
    UPDATE public.profiles
    SET email_confirmed = TRUE
    WHERE id = NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger the function when email confirmation changes
DROP TRIGGER IF EXISTS on_auth_email_confirmed ON auth.users;
CREATE TRIGGER on_auth_email_confirmed
  AFTER UPDATE OF email_confirmed_at ON auth.users
  FOR EACH ROW
  WHEN (OLD.email_confirmed_at IS NULL AND NEW.email_confirmed_at IS NOT NULL)
  EXECUTE PROCEDURE public.handle_email_confirmation();
