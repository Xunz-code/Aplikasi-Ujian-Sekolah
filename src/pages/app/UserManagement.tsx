import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Profile, UserRole } from '@/types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { UserCog, Plus, Search, Trash2, Edit2, Loader2, ShieldCheck, Mail } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function UserManagement() {
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ email: '', full_name: '', role: 'guru' as UserRole });
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    setLoading(true);
    const { data } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
    if (data) setUsers(data);
    setLoading(false);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingId) {
        const { error } = await supabase.from('profiles').update({
          full_name: formData.full_name,
          role: formData.role
        }).eq('id', editingId);
        if (error) throw error;
      } else {
        // Note: Creating a user in Auth from client is restricted.
        // In a real app, this would call an Edge Function or use the Admin API.
        alert('Penambahan user baru memerlukan integrasi Supabase Auth Admin API (Edge Functions). Untuk demo ini, silahkan gunakan fitur registrasi Supabase.');
      }

      setIsModalOpen(false);
      setFormData({ email: '', full_name: '', role: 'guru' });
      setEditingId(null);
      fetchUsers();
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user: Profile) => {
    setFormData({ email: user.email, full_name: user.full_name, role: user.role });
    setEditingId(user.id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Yakin ingin menghapus user ini?')) return;
    const { error } = await supabase.from('profiles').delete().eq('id', id);
    if (!error) fetchUsers();
  };

  const filteredUsers = users.filter(u => 
    u.full_name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900">User Management</h1>
          <p className="text-slate-500 mt-1 font-medium">Kelola hak akses dan data pengguna sistem.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="rounded-2xl px-8 font-black h-14 shadow-lg shadow-red-100 gap-2">
          <Plus className="w-5 h-5" /> Tambah User
        </Button>
      </div>

      <div className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-100">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input 
            placeholder="Cari Nama atau Email..." 
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
                <th className="p-6 text-xs font-black text-slate-400 uppercase tracking-widest">Pengguna</th>
                <th className="p-6 text-xs font-black text-slate-400 uppercase tracking-widest">Role</th>
                <th className="p-6 text-xs font-black text-slate-400 uppercase tracking-widest">Email</th>
                <th className="p-6 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-primary-light text-primary flex items-center justify-center font-black">
                        {user.full_name.charAt(0)}
                      </div>
                      <span className="font-bold text-slate-900">{user.full_name}</span>
                    </div>
                  </td>
                  <td className="p-6">
                    <span className={cn(
                      'px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider',
                      user.role === 'admin' ? 'bg-red-100 text-red-600' :
                      user.role === 'guru' ? 'bg-blue-100 text-blue-600' :
                      'bg-amber-100 text-amber-600'
                    )}>
                      {user.role}
                    </span>
                  </td>
                  <td className="p-6 font-medium text-slate-500">{user.email}</td>
                  <td className="p-6 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => handleEdit(user)} className="p-2 text-slate-400 hover:text-primary hover:bg-primary-light rounded-lg transition-all">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(user.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
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
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-md rounded-[40px] p-10 shadow-2xl animate-in zoom-in duration-300">
            <h2 className="text-2xl font-black text-slate-900 mb-8">{editingId ? 'Edit User' : 'Tambah User Baru'}</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nama Lengkap</label>
                <Input 
                  required
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  placeholder="Contoh: Ahmad Fauzi"
                  className="rounded-2xl h-12"
                />
              </div>
              {!editingId && (
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email</label>
                  <Input 
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="name@school.sch.id"
                    className="rounded-2xl h-12"
                  />
                </div>
              )}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Role / Jabatan</label>
                <select 
                  className="flex h-12 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                >
                  <option value="guru">Guru</option>
                  <option value="tendik">Tenaga Kependidikan</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>
              <div className="flex gap-4 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} className="flex-1 rounded-2xl h-12 font-bold">Batal</Button>
                <Button type="submit" className="flex-1 rounded-2xl h-12 font-black">Simpan User</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
