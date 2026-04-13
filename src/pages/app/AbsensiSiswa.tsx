import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Student } from '@/types';
import { Button } from '@/components/ui/Button';
import { GraduationCap, Search, Check, X, AlertCircle, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { cn } from '@/lib/utils';

export default function AbsensiSiswa() {
  const { profile } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [kelas, setKelas] = useState('Semua');
  const [attendance, setAttendance] = useState<Record<string, 'Hadir' | 'Izin' | 'Sakit' | 'Alpa'>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, []);

  async function fetchStudents() {
    setLoading(true);
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .order('nama', { ascending: true });

    if (data) setStudents(data);
    setLoading(false);
  }

  const filteredStudents = students.filter(s => {
    const matchesSearch = s.nama.toLowerCase().includes(search.toLowerCase()) || s.nis.includes(search);
    const matchesKelas = kelas === 'Semua' || s.kelas === kelas;
    return matchesSearch && matchesKelas;
  });

  const uniqueKelas = ['Semua', ...Array.from(new Set(students.map(s => s.kelas)))];

  const handleStatusChange = (studentId: string, status: 'Hadir' | 'Izin' | 'Sakit' | 'Alpa') => {
    setAttendance(prev => ({ ...prev, [studentId]: status }));
  };

  const handleSubmit = async () => {
    if (Object.keys(attendance).length === 0) {
      alert('Silahkan pilih status absensi minimal satu siswa.');
      return;
    }

    setSubmitting(true);
    const today = new Date().toISOString().split('T')[0];
    
    const records = Object.entries(attendance).map(([studentId, status]) => ({
      student_id: studentId,
      teacher_id: profile?.id,
      tanggal: today,
      status: status
    }));

    try {
      const { error } = await supabase.from('attendance_students').insert(records);
      if (error) throw error;
      alert('Absensi siswa berhasil disimpan!');
      setAttendance({});
    } catch (error: any) {
      alert(error.message || 'Gagal menyimpan absensi.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Absensi Siswa</h1>
          <p className="text-slate-500 mt-1 font-medium">Lakukan absensi harian untuk siswa di kelas anda.</p>
        </div>
        <Button 
          onClick={handleSubmit} 
          disabled={submitting || Object.keys(attendance).length === 0}
          className="rounded-2xl px-8 font-black h-14 shadow-lg shadow-red-100"
        >
          {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Simpan Absensi'}
        </Button>
      </div>

      <div className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-100 flex flex-wrap gap-4 items-center">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input 
            placeholder="Cari Nama atau NIS..." 
            className="pl-10 rounded-xl"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
          {uniqueKelas.map(k => (
            <button
              key={k}
              onClick={() => setKelas(k)}
              className={cn(
                'px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap',
                kelas === k ? 'bg-primary text-white shadow-md' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
              )}
            >
              {k}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredStudents.map((student) => (
            <div key={student.id} className="bg-white p-6 rounded-[24px] shadow-sm border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-6 hover:border-primary/20 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-primary-light text-primary flex items-center justify-center font-black">
                  {student.nama.charAt(0)}
                </div>
                <div>
                  <h3 className="font-black text-slate-900 leading-tight">{student.nama}</h3>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">NIS: {student.nis} • Kelas: {student.kelas}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {['Hadir', 'Izin', 'Sakit', 'Alpa'].map((status) => (
                  <button
                    key={status}
                    onClick={() => handleStatusChange(student.id, status as any)}
                    className={cn(
                      'px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border-2',
                      attendance[student.id] === status
                        ? status === 'Hadir' ? 'bg-green-500 border-green-500 text-white' :
                          status === 'Izin' ? 'bg-amber-500 border-amber-500 text-white' :
                          status === 'Sakit' ? 'bg-blue-500 border-blue-500 text-white' :
                          'bg-red-500 border-red-500 text-white'
                        : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'
                    )}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          ))}

          {filteredStudents.length === 0 && (
            <div className="text-center py-20 bg-white rounded-[40px] border border-dashed border-slate-200">
              <GraduationCap className="w-12 h-12 text-slate-200 mx-auto mb-4" />
              <p className="text-slate-400 font-bold">Tidak ada data siswa ditemukan.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
