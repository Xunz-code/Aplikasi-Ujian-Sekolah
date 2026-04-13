import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { 
  LayoutDashboard, 
  UserCheck, 
  Users, 
  UserCog, 
  GraduationCap, 
  FileText,
  LogOut,
  School
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './ui/Button';

export function Sidebar() {
  const { profile, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  const menuItems = [
    {
      title: 'Dashboard',
      icon: LayoutDashboard,
      path: '/app/dashboard',
      roles: ['admin', 'guru', 'tendik'],
    },
    {
      title: 'Absensi Karyawan',
      icon: UserCheck,
      path: '/app/absensi-karyawan',
      roles: ['admin', 'guru', 'tendik'],
    },
    {
      title: 'Absensi Siswa',
      icon: GraduationCap,
      path: '/app/absensi-siswa',
      roles: ['admin', 'guru'],
    },
    {
      title: 'Data Siswa',
      icon: Users,
      path: '/app/data-siswa',
      roles: ['admin'],
    },
    {
      title: 'User Management',
      icon: UserCog,
      path: '/app/user-management',
      roles: ['admin'],
    },
    {
      title: 'Rekap Absensi',
      icon: FileText,
      path: '/app/rekap-absensi',
      roles: ['admin', 'guru'],
    },
  ];

  const filteredMenu = menuItems.filter(item => 
    profile && item.roles.includes(profile.role)
  );

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col h-screen sticky top-0">
      <div className="p-6 flex items-center gap-3 border-b border-slate-100">
        <div className="bg-primary p-2 rounded-lg">
          <School className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="font-bold text-slate-900 leading-tight">SMK Prima</h1>
          <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Unggul & Berprestasi</p>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {filteredMenu.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all group',
                isActive 
                  ? 'bg-primary text-white shadow-md shadow-red-100' 
                  : 'text-slate-600 hover:bg-primary-light hover:text-primary'
              )}
            >
              <item.icon className={cn('w-5 h-5', isActive ? 'text-white' : 'text-slate-400 group-hover:text-primary')} />
              {item.title}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-100">
        <div className="bg-slate-50 p-4 rounded-2xl mb-4">
          <p className="text-xs text-slate-500 font-medium mb-1">Logged in as</p>
          <p className="text-sm font-bold text-slate-900 truncate">{profile?.full_name}</p>
          <p className="text-[10px] text-primary font-bold uppercase tracking-wider">{profile?.role}</p>
        </div>
        <Button 
          variant="ghost" 
          className="w-full justify-start gap-3 text-slate-600 hover:text-red-600 hover:bg-red-50"
          onClick={handleLogout}
        >
          <LogOut className="w-5 h-5" />
          Logout
        </Button>
      </div>
    </aside>
  );
}
