import React from 'react';
import { Link } from 'react-router-dom';
import { School, ArrowRight, CheckCircle2, Users, ShieldCheck, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function LandingPage() {
  const jurusans = [
    { id: 'TKJ', name: 'Teknik Komputer & Jaringan', desc: 'Mempelajari instalasi jaringan, server, dan troubleshooting komputer.' },
    { id: 'DKV', name: 'Desain Komunikasi Visual', desc: 'Fokus pada desain grafis, fotografi, videografi, dan ilustrasi digital.' },
    { id: 'AK', name: 'Akuntansi', desc: 'Mempelajari pengelolaan keuangan, perpajakan, dan audit.' },
    { id: 'BC', name: 'Broadcasting', desc: 'Keahlian dalam produksi TV, radio, dan konten digital kreatif.' },
    { id: 'MPLB', name: 'Manajemen Perkantoran', desc: 'Fokus pada administrasi bisnis, layanan logistik, dan manajemen kantor.' },
    { id: 'BD', name: 'Bisnis Digital', desc: 'Mempelajari e-commerce, digital marketing, dan analisis bisnis.' },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="bg-primary p-2 rounded-xl">
            <School className="w-6 h-6 text-white" />
          </div>
          <span className="font-extrabold text-xl tracking-tighter">SMK PRIMA UNGGUL</span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/login">
            <Button variant="ghost" className="font-bold">Login</Button>
          </Link>
          <Link to="/login">
            <Button className="rounded-full px-6 font-bold">Mulai Sekarang</Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-20 pb-32 grid lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-light text-primary rounded-full text-sm font-bold tracking-wide uppercase">
            <ShieldCheck className="w-4 h-4" />
            Sistem Absensi Terpadu
          </div>
          <h1 className="text-6xl lg:text-7xl font-black leading-[1.1] tracking-tight text-slate-900">
            Membangun Masa Depan <span className="text-primary italic">Digital</span> Bersama Kami.
          </h1>
          <p className="text-xl text-slate-500 leading-relaxed max-w-xl">
            SMK Prima Unggul adalah institusi pendidikan kejuruan yang berfokus pada keahlian industri kreatif dan teknologi informasi masa depan.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/login">
              <Button size="lg" className="rounded-full px-8 font-bold gap-2">
                Akses Dashboard <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="rounded-full px-8 font-bold">
              Profil Sekolah
            </Button>
          </div>
          <div className="flex items-center gap-8 pt-4">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-12 h-12 rounded-full border-4 border-white bg-slate-200 overflow-hidden">
                  <img src={`https://picsum.photos/seed/student${i}/100/100`} alt="student" referrerPolicy="no-referrer" />
                </div>
              ))}
            </div>
            <p className="text-sm font-medium text-slate-500">
              Bergabung dengan <span className="text-slate-900 font-bold">1,200+ Siswa</span> berprestasi
            </p>
          </div>
        </div>
        <div className="relative">
          <div className="absolute -inset-4 bg-primary/10 rounded-[40px] blur-3xl -z-10"></div>
          <div className="bg-slate-100 rounded-[40px] overflow-hidden aspect-[4/5] shadow-2xl border-8 border-white">
            <img 
              src="https://picsum.photos/seed/school/800/1000" 
              alt="SMK Prima Unggul" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          {/* Floating Cards */}
          <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-3xl shadow-xl border border-slate-100 animate-bounce-slow">
            <div className="flex items-center gap-4">
              <div className="bg-green-100 p-3 rounded-2xl text-green-600">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Kehadiran Hari Ini</p>
                <p className="text-2xl font-black text-slate-900">98.4%</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Jurusan Section */}
      <section className="bg-slate-50 py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
            <h2 className="text-sm font-black text-primary uppercase tracking-[0.2em]">Program Keahlian</h2>
            <p className="text-4xl font-black text-slate-900 leading-tight">
              Pilih Jurusan yang Sesuai dengan <span className="text-primary italic">Passion</span> Anda
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {jurusans.map((j) => (
              <div key={j.id} className="group bg-white p-10 rounded-[32px] border border-slate-100 hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500">
                <div className="w-16 h-16 bg-primary-light rounded-2xl flex items-center justify-center text-primary mb-8 group-hover:scale-110 transition-transform duration-500">
                  <GraduationCap className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-4">{j.name} <span className="text-primary">({j.id})</span></h3>
                <p className="text-slate-500 leading-relaxed">
                  {j.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="bg-primary p-2 rounded-xl">
                <School className="w-6 h-6 text-white" />
              </div>
              <span className="font-extrabold text-xl tracking-tighter">SMK PRIMA UNGGUL</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Mencetak generasi unggul, kompeten, dan berakhlak mulia di era digital.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-lg mb-6">Navigasi</h4>
            <ul className="space-y-4 text-slate-400">
              <li><Link to="/" className="hover:text-primary transition-colors">Beranda</Link></li>
              <li><Link to="/login" className="hover:text-primary transition-colors">Login Sistem</Link></li>
              <li><a href="#" className="hover:text-primary transition-colors">Profil Sekolah</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Kontak Kami</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-lg mb-6">Jurusan</h4>
            <ul className="space-y-4 text-slate-400">
              <li>TKJ - Komputer Jaringan</li>
              <li>DKV - Desain Visual</li>
              <li>AK - Akuntansi</li>
              <li>BC - Broadcasting</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-lg mb-6">Kontak</h4>
            <ul className="space-y-4 text-slate-400">
              <li>Jl. Pendidikan No. 37, Jakarta</li>
              <li>info@smkprimaunggul.sch.id</li>
              <li>(021) 1234-5678</li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 pt-20 mt-20 border-t border-slate-800 text-center text-slate-500 text-sm">
          &copy; {new Date().getFullYear()} SMK Prima Unggul. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
