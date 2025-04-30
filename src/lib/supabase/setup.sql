
-- Create tables
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  company_name TEXT,
  email TEXT NOT NULL UNIQUE,
  avatar_url TEXT
);

CREATE TABLE IF NOT EXISTS invoices (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES auth.users NOT NULL,
  date TEXT NOT NULL,
  due_date TEXT,
  customer TEXT,
  email TEXT,
  amount DECIMAL NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('paid', 'pending', 'overdue', 'draft', 'unpaid')),
  description TEXT,
  notes TEXT
);

CREATE TABLE IF NOT EXISTS expenses (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES auth.users NOT NULL,
  date TEXT NOT NULL,
  amount DECIMAL NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  vendor TEXT,
  receipt BOOLEAN,
  notes TEXT
);

-- Set up Row Level Security

-- Enable RLS on tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile" 
ON profiles FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
ON profiles FOR UPDATE 
USING (auth.uid() = id);

-- Add a policy to allow inserting profiles
CREATE POLICY "Users can insert their own profile" 
ON profiles FOR INSERT 
WITH CHECK (auth.uid() = id);

-- Allow service role to insert profiles (for signup)
CREATE POLICY "Service role can insert any profile" 
ON profiles FOR INSERT 
WITH CHECK (auth.role() = 'service_role' OR auth.uid() = id);

-- Invoices policies
CREATE POLICY "Users can view their own invoices" 
ON invoices FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own invoices" 
ON invoices FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own invoices" 
ON invoices FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own invoices" 
ON invoices FOR DELETE 
USING (auth.uid() = user_id);

-- Expenses policies
CREATE POLICY "Users can view their own expenses" 
ON expenses FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own expenses" 
ON expenses FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own expenses" 
ON expenses FOR UPDATE 
USING (auth.uid() = user_id);

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

-- Triggers to automatically update the updated_at column
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON profiles
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_invoices_updated_at
BEFORE UPDATE ON invoices
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_expenses_updated_at
BEFORE UPDATE ON expenses
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
