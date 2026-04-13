import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/Button';
import { CheckCircle2, Clock, AlertCircle, Loader2, UserCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AbsensiKaryawan() {
  const { profile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [alreadyAbsen, setAlreadyAbsen] = useState(false);
  const [lastAbsen, setLastAbsen] = useState<any>(null);

  useEffect(() => {
    checkTodayAttendance();
  }, []);

  async function checkTodayAttendance() {
    if (!profile) return;
    const today = new Date().toISOString().split('T')[0];
    
    const { data, error } = await supabase
      .from('attendance_employees')
      .select('*')
      .eq('user_id', profile.id)
      .eq('tanggal', today)
      .maybeSingle();

    if (data) {
      setAlreadyAbsen(true);
      setLastAbsen(data);
    }
  }

  const handleAbsen = async (status: 'Hadir' | 'Izin' | 'Sakit') => {
    if (!profile) return;
    setLoading(true);

    try {
      const { error } = await supabase
        .from('attendance_employees')
        .insert({
          user_id: profile.id,
          status: status
        });

      if (error) throw error;
      
      await checkTodayAttendance();
      alert('Absensi berhasil dicatat!');
    } catch (error: any) {
      alert(error.message || 'Gagal mencatat absensi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-black text-slate-900">Absensi Mandiri</h1>
        <p className="text-slate-500 max-w-lg mx-auto font-medium">
          Silahkan lakukan absensi harian anda. Pastikan anda berada di lingkungan sekolah saat melakukan absensi.
        </p>
      </div>

      {alreadyAbsen ? (
        <div className="bg-white p-12 rounded-[48px] shadow-xl shadow-slate-200/50 border border-slate-100 text-center space-y-8 animate-in zoom-in duration-500">
          <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-green-100">
            <CheckCircle2 className="w-12 h-12" />
          </div>
          <div>
            <h2 className="text-3xl font-black text-slate-900">Sudah Absen Hari Ini</h2>
            <p className="text-slate-500 mt-2 font-medium">Terima kasih telah melakukan absensi tepat waktu.</p>
          </div>
          
          <div className="grid grid-cols-2 gap-6 max-w-md mx-auto">
            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Waktu Absen</p>
              <p className="text-xl font-black text-slate-900">{lastAbsen?.waktu}</p>
            </div>
            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Status</p>
              <p className="text-xl font-black text-green-600 uppercase tracking-wider">{lastAbsen?.status}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white p-12 rounded-[48px] shadow-xl shadow-slate-200/50 border border-slate-100">
          <div className="flex items-center justify-center gap-4 mb-12">
            <Clock className="w-8 h-8 text-primary animate-pulse" />
            <span className="text-3xl font-black text-slate-900 tabular-nums">
              {new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>

          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { id: 'Hadir', label: 'Hadir', color: 'bg-green-500', icon: UserCheck },
              { id: 'Izin', label: 'Izin', color: 'bg-amber-500', icon: AlertCircle },
              { id: 'Sakit', label: 'Sakit', color: 'bg-blue-500', icon: AlertCircle },
            ].map((option) => (
              <button
                key={option.id}
                disabled={loading}
                onClick={() => handleAbsen(option.id as any)}
                className="group relative bg-slate-50 p-10 rounded-[32px] border-2 border-transparent hover:border-primary hover:bg-white hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 text-center"
              >
                <div className={cn('w-16 h-16 rounded-2xl flex items-center justify-center text-white mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300', option.color)}>
                  <option.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-black text-slate-900">{option.label}</h3>
                <p className="text-xs text-slate-400 mt-2 font-bold uppercase tracking-widest">Pilih Status</p>
              </button>
            ))}
          </div>

          {loading && (
            <div className="mt-12 flex items-center justify-center gap-3 text-primary font-bold">
              <Loader2 className="w-6 h-6 animate-spin" />
              Memproses Absensi...
            </div>
          )}
        </div>
      )}

      <div className="bg-amber-50 border border-amber-100 p-8 rounded-[32px] flex gap-6 items-start">
        <div className="bg-amber-100 p-3 rounded-2xl text-amber-600">
          <AlertCircle className="w-6 h-6" />
        </div>
        <div>
          <h4 className="font-black text-amber-900 mb-1 uppercase tracking-tight">Catatan Penting</h4>
          <p className="text-sm text-amber-800 leading-relaxed font-medium">
            Absensi hanya dapat dilakukan satu kali dalam sehari. Jika terjadi kesalahan input atau kendala teknis, silahkan hubungi bagian administrasi sekolah untuk perbaikan data.
          </p>
        </div>
      </div>
    </div>
  );
}
