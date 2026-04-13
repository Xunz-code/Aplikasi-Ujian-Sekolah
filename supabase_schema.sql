-- SQL Schema for SMK Prima Unggul Attendance
-- Run this in your Supabase SQL Editor

-- 1. Profiles table (linked to auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT CHECK (role IN ('admin', 'guru', 'tendik')) NOT NULL DEFAULT 'guru',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Students table
CREATE TABLE students (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nis TEXT UNIQUE NOT NULL,
  nama TEXT NOT NULL,
  kelas TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Employee Attendance table
CREATE TABLE attendance_employees (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  tanggal DATE DEFAULT CURRENT_DATE NOT NULL,
  waktu TIME DEFAULT CURRENT_TIME NOT NULL,
  status TEXT CHECK (status IN ('Hadir', 'Izin', 'Sakit', 'Alpa')) NOT NULL,
  UNIQUE(user_id, tanggal)
);

-- 4. Student Attendance table
CREATE TABLE attendance_students (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES students(id) ON DELETE CASCADE NOT NULL,
  teacher_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  tanggal DATE DEFAULT CURRENT_DATE NOT NULL,
  status TEXT CHECK (status IN ('Hadir', 'Izin', 'Sakit', 'Alpa')) NOT NULL,
  keterangan TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Trigger to handle new user registration
-- The first user to sign up will be an admin.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  is_first_user BOOLEAN;
BEGIN
  SELECT NOT EXISTS (SELECT 1 FROM public.profiles) INTO is_first_user;
  
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'),
    CASE WHEN is_first_user THEN 'admin' ELSE 'guru' END
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 6. Enable RLS (Row Level Security)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_students ENABLE ROW LEVEL SECURITY;

-- 7. Policies (Basic - can be refined)
CREATE POLICY "Public profiles are viewable by everyone." ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile." ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Students viewable by authenticated users." ON students FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Only admin can manage students." ON students FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Attendance viewable by authenticated users." ON attendance_employees FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Users can insert own attendance." ON attendance_employees FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Student attendance viewable by guru and admin." ON attendance_students FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'guru'))
);
CREATE POLICY "Guru and admin can insert student attendance." ON attendance_students FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'guru'))
);
