
import { supabase } from './client';

// Function to initialize database tables if they don't exist
export async function initializeDatabase() {
  try {
    // Check if users table exists
    const { data: tableExists, error: checkError } = await supabase
      .from('users')
      .select('id')
      .limit(1);
    
    if (checkError && checkError.code === '42P01') { // Table doesn't exist error
      console.log('Creating database tables...');
      
      // Create users table
      const { error: createError } = await supabase.rpc('create_users_table');
      
      if (createError) {
        console.error('Error creating tables:', createError);
        return false;
      }
      
      console.log('Database tables created successfully');
      return true;
    }
    
    console.log('Database tables already exist');
    return true;
  } catch (error) {
    console.error('Error initializing database:', error);
    return false;
  }
}

export async function createAdminUser() {
  try {
    // First create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: 'admin@allstar.com',
      password: 'Admin@123',
    });
    
    if (authError) {
      console.error('Error creating admin auth user:', authError);
      return null;
    }
    
    if (!authData.user) {
      console.error('No user data returned from auth signup');
      return null;
    }
    
    // Now insert user data into users table
    const { data: userData, error: userError } = await supabase
      .from('users')
      .insert([
        {
          id: authData.user.id,
          email: authData.user.email,
          name: 'Administrator',
          role: 'admin',
          is_active: true
        }
      ])
      .select();
    
    if (userError) {
      console.error('Error creating admin user data:', userError);
      return null;
    }
    
    console.log('Admin user created successfully');
    return userData[0];
  } catch (error) {
    console.error('Error in createAdminUser:', error);
    return null;
  }
}

export async function createTestUsers() {
  const testUsers = [
    {
      email: 'gerente@allstar.com',
      password: 'Gerente@123',
      name: 'Gerente Teste',
      role: 'manager'
    },
    {
      email: 'vendedor@allstar.com',
      password: 'Vendedor@123',
      name: 'Vendedor Teste',
      role: 'staff'
    }
  ];
  
  const results = [];
  
  for (const user of testUsers) {
    try {
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: user.email,
        password: user.password,
      });
      
      if (authError) {
        console.error(`Error creating ${user.email} auth user:`, authError);
        results.push({ email: user.email, success: false, error: authError });
        continue;
      }
      
      if (!authData.user) {
        console.error(`No user data returned for ${user.email}`);
        results.push({ email: user.email, success: false, error: 'No user data returned' });
        continue;
      }
      
      // Insert user data
      const { data: userData, error: userError } = await supabase
        .from('users')
        .insert([
          {
            id: authData.user.id,
            email: authData.user.email,
            name: user.name,
            role: user.role,
            is_active: true
          }
        ])
        .select();
      
      if (userError) {
        console.error(`Error creating ${user.email} user data:`, userError);
        results.push({ email: user.email, success: false, error: userError });
        continue;
      }
      
      results.push({ email: user.email, success: true, data: userData[0] });
      console.log(`Test user ${user.email} created successfully`);
      
    } catch (error) {
      console.error(`Error creating ${user.email}:`, error);
      results.push({ email: user.email, success: false, error });
    }
  }
  
  return results;
}

// SQL commands to run in Supabase SQL Editor to set up tables
export const setupSql = `
-- Create users table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  role TEXT CHECK (role IN ('admin', 'manager', 'staff')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  is_active BOOLEAN DEFAULT TRUE
);

-- Create RLS policies for users table
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own data
CREATE POLICY users_read_own ON public.users 
  FOR SELECT 
  USING (auth.uid() = id);

-- Policy: Admin users can read all data
CREATE POLICY admin_read_all ON public.users 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Function to get current user
CREATE OR REPLACE FUNCTION public.get_current_user()
RETURNS SETOF public.users
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT * FROM public.users WHERE id = auth.uid();
$$;

-- Create stored procedure to create all tables (can be called from code)
CREATE OR REPLACE FUNCTION create_users_table()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    email TEXT NOT NULL UNIQUE,
    name TEXT,
    role TEXT CHECK (role IN ('admin', 'manager', 'staff')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    is_active BOOLEAN DEFAULT TRUE
  );
  
  -- Create RLS policies
  ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
  
  -- Policy: Users can read their own data
  DROP POLICY IF EXISTS users_read_own ON public.users;
  CREATE POLICY users_read_own ON public.users 
    FOR SELECT 
    USING (auth.uid() = id);
  
  -- Policy: Admin users can read all data
  DROP POLICY IF EXISTS admin_read_all ON public.users;
  CREATE POLICY admin_read_all ON public.users 
    FOR SELECT 
    USING (
      EXISTS (
        SELECT 1 FROM public.users 
        WHERE id = auth.uid() AND role = 'admin'
      )
    );
END;
$$;
`;
