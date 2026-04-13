export type UserRole = 'admin' | 'guru' | 'tendik';

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  created_at: string;
}

export interface Student {
  id: string;
  nis: string;
  nama: string;
  kelas: string;
  created_at: string;
}

export interface EmployeeAttendance {
  id: string;
  user_id: string;
  tanggal: string;
  waktu: string;
  status: 'Hadir' | 'Izin' | 'Sakit' | 'Alpa';
}

export interface StudentAttendance {
  id: string;
  student_id: string;
  teacher_id: string;
  tanggal: string;
  status: 'Hadir' | 'Izin' | 'Sakit' | 'Alpa';
  keterangan?: string;
  created_at: string;
}
