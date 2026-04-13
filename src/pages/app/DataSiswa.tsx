import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Student } from '@/types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Users, Plus, Search, Trash2, Edit2, Loader2, GraduationCap } from 'lucide-react';

export default function DataSiswa() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ nis: '', nama: '', kelas: '' });
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  async function fetchStudents() {
    setLoading(true);
    const { data } = await supabase.from('students').select('*').order('created_at', { ascending: false });
    if (data) setStudents(data);
    setLoading(false);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingId) {
        const { error } = await supabase.from('students').update(formData).eq('id', editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('students').insert(formData);
        if (error) throw error;
      }

      setIsModalOpen(false);
      setFormData({ nis: '', nama: '', kelas: '' });
      setEditingId(null);
      fetchStudents();
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (student: Student) => {
    setFormData({ nis: student.nis, nama: student.nama, kelas: student.kelas });
    setEditingId(student.id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Yakin ingin menghapus data siswa ini?')) return;
    const { error } = await supabase.from('students').delete().eq('id', id);
    if (!error) fetchStudents();
  };

  const filteredStudents = students.filter(s => 
    s.nama.toLowerCase().includes(search.toLowerCase()) || s.nis.includes(search)
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Data Siswa</h1>
          <p className="text-slate-500 mt-1 font-medium">Kelola data seluruh siswa SMK Prima Unggul.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="rounded-2xl px-8 font-black h-14 shadow-lg shadow-red-100 gap-2">
          <Plus className="w-5 h-5" /> Tambah Siswa
        </Button>
      </div>

      <div className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-100">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input 
            placeholder="Cari Nama atau NIS..." 
            className="pl-10 rounded-xl"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-[40px] shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="p-6 text-xs font-black text-slate-400 uppercase tracking-widest">Siswa</th>
                <th className="p-6 text-xs font-black text-slate-400 uppercase tracking-widest">NIS</th>
                <th className="p-6 text-xs font-black text-slate-400 uppercase tracking-widest">Kelas</th>
                <th className="p-6 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-primary-light text-primary flex items-center justify-center font-black">
                        {student.nama.charAt(0)}
                      </div>
                      <span className="font-bold text-slate-900">{student.nama}</span>
                    </div>
                  </td>
                  <td className="p-6 font-medium text-slate-500">{student.nis}</td>
                  <td className="p-6">
                    <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold uppercase tracking-wider">
                      {student.kelas}
                    </span>
                  </td>
                  <td className="p-6 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => handleEdit(student)} className="p-2 text-slate-400 hover:text-primary hover:bg-primary-light rounded-lg transition-all">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(student.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredStudents.length === 0 && !loading && (
          <div className="text-center py-20">
            <GraduationCap className="w-12 h-12 text-slate-200 mx-auto mb-4" />
            <p className="text-slate-400 font-bold">Belum ada data siswa.</p>
          </div>
        )}
        {loading && (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-md rounded-[40px] p-10 shadow-2xl animate-in zoom-in duration-300">
            <h2 className="text-2xl font-black text-slate-900 mb-8">{editingId ? 'Edit Siswa' : 'Tambah Siswa Baru'}</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nama Lengkap</label>
                <Input 
                  required
                  value={formData.nama}
                  onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                  placeholder="Contoh: Budi Santoso"
                  className="rounded-2xl h-12"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">NIS (Nomor Induk Siswa)</label>
                <Input 
                  required
                  value={formData.nis}
                  onChange={(e) => setFormData({ ...formData, nis: e.target.value })}
                  placeholder="Contoh: 2024001"
                  className="rounded-2xl h-12"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Kelas</label>
                <Input 
                  required
                  value={formData.kelas}
                  onChange={(e) => setFormData({ ...formData, kelas: e.target.value })}
                  placeholder="Contoh: XII TKJ 1"
                  className="rounded-2xl h-12"
                />
              </div>
              <div className="flex gap-4 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} className="flex-1 rounded-2xl h-12 font-bold">Batal</Button>
                <Button type="submit" className="flex-1 rounded-2xl h-12 font-black">Simpan Data</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
