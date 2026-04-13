import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { 
  Users, 
  UserCheck, 
  GraduationCap, 
  TrendingUp,
  Calendar as CalendarIcon,
  Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Dashboard() {
  const { profile } = useAuth();
  const [stats, setStats] = useState({
    totalSiswa: 0,
    totalGuru: 0,
    absensiHariIni: 0,
    kehadiranSiswa: 0
  });

  useEffect(() => {
    async function fetchStats() {
      // Fetch total students
      const { count: studentCount } = await supabase
        .from('students')
        .select('*', { count: 'exact', head: true });

      // Fetch total profiles (staff/guru)
      const { count: staffCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // Fetch attendance today
      const today = new Date().toISOString().split('T')[0];
      const { count: attendanceCount } = await supabase
        .from('attendance_employees')
        .select('*', { count: 'exact', head: true })
        .eq('tanggal', today);

      setStats({
        totalSiswa: studentCount || 0,
        totalGuru: staffCount || 0,
        absensiHariIni: attendanceCount || 0,
        kehadiranSiswa: 95 // Mock for now
      });
    }

    fetchStats();
  }, []);

  const cards = [
    {
      title: 'Total Siswa',
      value: stats.totalSiswa,
      icon: GraduationCap,
      color: 'bg-blue-500',
      trend: '+12% dari bulan lalu'
    },
    {
      title: 'Total Karyawan',
      value: stats.totalGuru,
      icon: Users,
      color: 'bg-primary',
      trend: '+2 orang baru'
    },
    {
      title: 'Absensi Karyawan',
      value: stats.absensiHariIni,
      icon: UserCheck,
      color: 'bg-green-500',
      trend: 'Hari ini'
    },
    {
      title: 'Kehadiran Siswa',
      value: `${stats.kehadiranSiswa}%`,
      icon: TrendingUp,
      color: 'bg-amber-500',
      trend: 'Sangat Baik'
    }
  ];

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Dashboard Utama</h1>
          <p className="text-slate-500 mt-1 font-medium">Selamat datang kembali, <span className="text-primary font-bold">{profile?.full_name}</span>!</p>
        </div>
        <div className="flex items-center gap-3 bg-white px-6 py-3 rounded-2xl shadow-sm border border-slate-100">
          <CalendarIcon className="w-5 h-5 text-primary" />
          <span className="text-sm font-bold text-slate-700">
            {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, i) => (
          <div key={i} className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 group">
            <div className={cn('w-14 h-14 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300', card.color)}>
              <card.icon className="w-7 h-7" />
            </div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">{card.title}</p>
            <h3 className="text-3xl font-black text-slate-900">{card.value}</h3>
            <p className="text-[10px] font-bold text-slate-400 mt-4 flex items-center gap-1">
              <span className="text-green-500">●</span> {card.trend}
            </p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-[40px] p-10 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-xl font-black text-slate-900">Aktivitas Terbaru</h2>
            <button className="text-xs font-black text-primary uppercase tracking-widest hover:underline">Lihat Semua</button>
          </div>
          
          <div className="space-y-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-6 group cursor-pointer">
                <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-primary-light group-hover:text-primary transition-colors">
                  <Clock className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-slate-900">Absensi Karyawan Berhasil</p>
                  <p className="text-xs text-slate-500 mt-1">Seseorang baru saja melakukan absensi mandiri</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-black text-slate-900">10:45 AM</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Today</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Info */}
        <div className="bg-primary rounded-[40px] p-10 text-white shadow-xl shadow-red-200 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
          <div className="relative z-10">
            <h2 className="text-xl font-black mb-6">Informasi Sekolah</h2>
            <div className="space-y-6">
              <div className="bg-white/10 p-6 rounded-3xl backdrop-blur-sm border border-white/10">
                <p className="text-xs font-bold uppercase tracking-widest opacity-60 mb-2">Akreditasi</p>
                <p className="text-2xl font-black">Grade A+</p>
              </div>
              <div className="bg-white/10 p-6 rounded-3xl backdrop-blur-sm border border-white/10">
                <p className="text-xs font-bold uppercase tracking-widest opacity-60 mb-2">Total Jurusan</p>
                <p className="text-2xl font-black">6 Program</p>
              </div>
              <div className="bg-white/10 p-6 rounded-3xl backdrop-blur-sm border border-white/10">
                <p className="text-xs font-bold uppercase tracking-widest opacity-60 mb-2">Status Sistem</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <p className="text-lg font-bold">Online & Sinkron</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
