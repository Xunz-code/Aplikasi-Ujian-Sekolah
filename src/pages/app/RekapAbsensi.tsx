import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { FileText, Search, Download, Calendar as CalendarIcon, Loader2, GraduationCap, Users } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

export default function RekapAbsensi() {
  const { profile } = useAuth();
  const [activeTab, setActiveTab] = useState<'siswa' | 'karyawan'>(profile?.role === 'admin' ? 'karyawan' : 'siswa');
  const [loading, setLoading] = useState(true);
  const [records, setRecords] = useState<any[]>([]);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    fetchRecords();
  }, [activeTab, date]);

  async function fetchRecords() {
    setLoading(true);
    try {
      if (activeTab === 'siswa') {
        const { data } = await supabase
          .from('attendance_students')
          .select('*, students(nama, nis, kelas)')
          .eq('tanggal', date)
          .order('created_at', { ascending: false });
        setRecords(data || []);
      } else {
        const { data } = await supabase
          .from('attendance_employees')
          .select('*, profiles(full_name, email, role)')
          .eq('tanggal', date)
          .order('waktu', { ascending: false });
        setRecords(data || []);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Rekap Absensi</h1>
          <p className="text-slate-500 mt-1 font-medium">Laporan kehadiran harian siswa dan karyawan.</p>
        </div>
        <Button variant="outline" className="rounded-2xl px-8 font-bold h-14 gap-2">
          <Download className="w-5 h-5" /> Export PDF
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-100 flex gap-1">
          {profile?.role === 'admin' && (
            <button
              onClick={() => setActiveTab('karyawan')}
              className={cn(
                'px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2',
                activeTab === 'karyawan' ? 'bg-primary text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'
              )}
            >
              <Users className="w-4 h-4" /> Karyawan
            </button>
          )}
          <button
            onClick={() => setActiveTab('siswa')}
            className={cn(
              'px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2',
              activeTab === 'siswa' ? 'bg-primary text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'
            )}
          >
            <GraduationCap className="w-4 h-4" /> Siswa
          </button>
        </div>

        <div className="bg-white px-6 py-2 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <CalendarIcon className="w-5 h-5 text-primary" />
          <input 
            type="date" 
            className="bg-transparent border-none focus:ring-0 font-bold text-slate-700"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-[40px] shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="p-6 text-xs font-black text-slate-400 uppercase tracking-widest">
                  {activeTab === 'siswa' ? 'Nama Siswa' : 'Nama Karyawan'}
                </th>
                <th className="p-6 text-xs font-black text-slate-400 uppercase tracking-widest">
                  {activeTab === 'siswa' ? 'Kelas' : 'Jabatan'}
                </th>
                <th className="p-6 text-xs font-black text-slate-400 uppercase tracking-widest">Waktu</th>
                <th className="p-6 text-xs font-black text-slate-400 uppercase tracking-widest">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {records.map((record) => (
                <tr key={record.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center font-black">
                        {(activeTab === 'siswa' ? record.students?.nama : record.profiles?.full_name)?.charAt(0)}
                      </div>
                      <span className="font-bold text-slate-900">
                        {activeTab === 'siswa' ? record.students?.nama : record.profiles?.full_name}
                      </span>
                    </div>
                  </td>
                  <td className="p-6">
                    <span className="text-sm font-medium text-slate-500">
                      {activeTab === 'siswa' ? record.students?.kelas : record.profiles?.role}
                    </span>
                  </td>
                  <td className="p-6 font-medium text-slate-500">
                    {activeTab === 'siswa' ? new Date(record.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : record.waktu}
                  </td>
                  <td className="p-6">
                    <span className={cn(
                      'px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider',
                      record.status === 'Hadir' ? 'bg-green-100 text-green-600' :
                      record.status === 'Izin' ? 'bg-amber-100 text-amber-600' :
                      record.status === 'Sakit' ? 'bg-blue-100 text-blue-600' :
                      'bg-red-100 text-red-600'
                    )}>
                      {record.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {loading && (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        )}
        {records.length === 0 && !loading && (
          <div className="text-center py-20">
            <FileText className="w-12 h-12 text-slate-200 mx-auto mb-4" />
            <p className="text-slate-400 font-bold">Tidak ada data absensi untuk tanggal ini.</p>
          </div>
        )}
      </div>
    </div>
  );
}
