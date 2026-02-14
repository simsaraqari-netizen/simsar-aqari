import React, { useState, useMemo } from 'react';
import { Property, UserRole, User, Company } from '../types';
import { MOCK_PROPERTIES, MOCK_USERS } from '../constants';
import { 
  LayoutDashboard, 
  PlusCircle, 
  Users, 
  CreditCard, 
  Settings, 
  LogOut, 
  TrendingUp, 
  Eye, 
  Star,
  Edit2,
  CheckCircle2,
  UserPlus,
  ArrowUpRight,
  ShieldCheck,
  Building2,
  Clock,
  MoreVertical,
  PauseCircle,
  Trash2
} from 'lucide-react';

interface DashboardProps {
  user: User;
  company: Company;
  onLogout: () => void;
  onBackToHome: () => void;
}

const formatTimeAgo = (date: Date) => {
  const diffInMs = Date.now() - date.getTime();
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  if (diffInHours < 24) return `منذ ${diffInHours} س`;
  return `منذ ${Math.floor(diffInHours / 24)} يوم`;
};

const Dashboard: React.FC<DashboardProps> = ({ user, company, onLogout, onBackToHome }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'my-ads' | 'team'>('overview');
  
  // تصفية الإعلانات بناءً على الصلاحيات
  const displayAds = useMemo(() => {
    return user.role === UserRole.ADMIN 
      ? MOCK_PROPERTIES 
      : MOCK_PROPERTIES.filter(p => p.postedBy === user.id);
  }, [user]);

  const StatCard = ({ title, value, icon: Icon, color = "text-brand-navy", subtitle }: any) => (
    <div className="bg-white/40 backdrop-blur-xl p-5 rounded-[20px] border border-white/60 shadow-sm flex flex-col gap-3 group hover:bg-white/60 transition-all duration-300">
      <div className="flex justify-between items-start">
        <div className="p-2 bg-brand-navy/5 rounded-xl text-brand-navy group-hover:scale-110 transition-transform">
          <Icon className="w-4 h-4" />
        </div>
        <ArrowUpRight className="w-3 h-3 text-slate-300" />
      </div>
      <div>
        <p className="text-slate-400 text-[9px] font-bold mb-0.5">{title}</p>
        <p className={`text-lg font-black ${color}`}>{value}</p>
        {subtitle && <p className="text-[8px] text-slate-400 mt-1">{subtitle}</p>}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F0F4F8] flex flex-col font-tajawal pb-24">
      {/* Navbar */}
      <nav className="px-6 py-4 flex justify-between items-center bg-white/30 backdrop-blur-md border-b border-white/40 sticky top-0 z-50">
        <div className="flex items-center gap-2">
           <div className="w-8 h-8 bg-brand-navy rounded-lg flex items-center justify-center">
             <ShieldCheck className="w-5 h-5 text-brand-orange" />
           </div>
           <span className="font-black text-brand-navy text-sm">أوتاد الإداري</span>
        </div>
        <button onClick={onLogout} className="text-slate-400 hover:text-red-500 transition-colors">
          <LogOut className="w-5 h-5" />
        </button>
      </nav>

      {/* Hero Profile */}
      <header className="px-4 pt-6 pb-2">
        <div className="bg-brand-navy rounded-[24px] p-6 text-white relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-orange/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
          
          <div className="relative z-10 flex flex-col gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 flex items-center justify-center p-1 overflow-hidden">
                <img src="https://storage.googleapis.com/static.smart-re.com/logos/simsar_logo.png" className="w-full h-auto brightness-0 invert" alt="Logo" />
              </div>
              <div>
                <h1 className="text-lg font-black">{company.name}</h1>
                <p className="text-white/60 text-[10px] font-bold mt-1 flex items-center gap-1">
                   <CheckCircle2 className="w-3 h-3 text-brand-orange" />
                   حساب شركة موثق
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
               <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10">
                  <p className="text-white/50 text-[8px] font-bold mb-1">الرصيد الكلي</p>
                  <p className="text-lg font-black">{company.totalCredits - company.usedCredits} <span className="text-[10px] opacity-40">د.ك</span></p>
               </div>
               <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10">
                  <p className="text-white/50 text-[8px] font-bold mb-1">موظفين نشطين</p>
                  <p className="text-lg font-black">{MOCK_USERS.length} <span className="text-[10px] opacity-40">أفراد</span></p>
               </div>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 px-4 space-y-6 mt-4">
        {/* Tabs */}
        <div className="flex bg-white/50 backdrop-blur-md p-1 rounded-[16px] shadow-sm border border-white/60">
          {[
            { id: 'overview', label: 'الرئيسية', icon: LayoutDashboard },
            { id: 'my-ads', label: 'الإعلانات', icon: Star },
            { id: 'team', label: 'الفريق', icon: Users, adminOnly: true }
          ].map((tab) => (
            (!tab.adminOnly || user.role === UserRole.ADMIN) && (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[10px] font-black transition-all ${activeTab === tab.id ? 'bg-brand-navy text-white shadow-lg' : 'text-slate-400'}`}
              >
                <tab.icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            )
          ))}
        </div>

        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-3">
              <StatCard title="إجمالي الإعلانات" value={displayAds.length} icon={CheckCircle2} subtitle="نشط الآن" />
              <StatCard title="المشاهدات اليومية" value="1.2K" icon={Eye} subtitle="+5% عن أمس" />
              <StatCard title="نقاط الموظفين" value="185" icon={CreditCard} subtitle="موزعة" />
              <StatCard title="كفاءة النشر" value="94%" icon={TrendingUp} subtitle="ممتاز" />
            </div>

            <button className="w-full bg-brand-orange text-white p-4 rounded-[16px] shadow-lg shadow-brand-orange/20 flex items-center justify-between group">
              <div className="text-right">
                <h4 className="text-xs font-black mb-1">نشر إعلان جديد</h4>
                <p className="text-[9px] opacity-80">سيتم الخصم من رصيدك: 1 نقطة</p>
              </div>
              <PlusCircle className="w-6 h-6 group-active:scale-90 transition-transform" />
            </button>
          </div>
        )}

        {activeTab === 'team' && user.role === UserRole.ADMIN && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex justify-between items-center">
               <h3 className="font-black text-brand-navy text-sm">إدارة الموظفين</h3>
               <button className="bg-brand-navy text-white px-3 py-1.5 rounded-lg text-[9px] font-bold flex items-center gap-1.5 shadow-sm">
                 <UserPlus className="w-3.5 h-3.5" />
                 إضافة موظف
               </button>
            </div>

            <div className="space-y-3">
              {MOCK_USERS.map((member) => (
                <div key={member.id} className="bg-white/60 backdrop-blur-xl p-4 rounded-[20px] border border-white/80 shadow-sm flex items-center gap-3">
                  <div className="w-10 h-10 bg-brand-navy text-white rounded-xl flex items-center justify-center font-black text-xs">
                    {member.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-[11px] font-black text-brand-navy truncate">{member.name}</h4>
                    <p className="text-[9px] text-slate-400 font-bold">{member.role === UserRole.ADMIN ? 'مدير الوكالة' : 'وكيل عقاري'}</p>
                    <div className="mt-2 flex items-center gap-4">
                       <div className="flex items-center gap-1 text-[8px] font-bold text-slate-500">
                          <Star className="w-2.5 h-2.5 text-brand-orange" />
                          {MOCK_PROPERTIES.filter(p => p.postedBy === member.id).length} إعلانات
                       </div>
                       <div className="flex items-center gap-1 text-[8px] font-bold text-slate-500">
                          <CreditCard className="w-2.5 h-2.5 text-emerald-500" />
                          {member.usedCredits} / {member.assignedCredits} نقطة
                       </div>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {/* Fixed Settings2 to Settings as per imports */}
                    <button className="p-2 bg-slate-50 rounded-lg text-slate-400 hover:text-brand-navy"><Settings className="w-3.5 h-3.5" /></button>
                    <button className="p-2 bg-slate-50 rounded-lg text-slate-400 hover:text-red-500"><PauseCircle className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {(activeTab === 'my-ads' || activeTab === 'overview') && (
          <div className="space-y-4">
            <h3 className="font-black text-brand-navy text-sm px-1">
               {activeTab === 'overview' ? 'آخر التحديثات' : 'إعلاناتك النشطة'}
            </h3>
            <div className="space-y-3 pb-20">
              {displayAds.map((prop) => (
                <div key={prop.id} className="bg-white/40 backdrop-blur-md rounded-[14px] overflow-hidden border border-white/60 flex flex-col w-full shadow-sm">
                  <div className="flex p-2.5 gap-3">
                    <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-slate-200">
                      <img src={prop.images[0]} className="w-full h-full object-cover" alt="" />
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                      <h3 className="text-[11px] font-black text-brand-navy truncate mb-1">{prop.title}</h3>
                      <div className="flex items-center gap-2">
                         <span className="text-[9px] font-black text-brand-orange">{prop.price.toLocaleString()} د.ك</span>
                         <span className="text-[8px] text-slate-400 font-bold">• {prop.area}</span>
                      </div>
                    </div>
                    {user.role === UserRole.ADMIN && (
                       <div className="self-center pr-2">
                          <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[8px] font-black text-brand-navy border border-white" title={`بواسطة: ${MOCK_USERS.find(u => u.id === prop.postedBy)?.name}`}>
                            {MOCK_USERS.find(u => u.id === prop.postedBy)?.name[0]}
                          </div>
                       </div>
                    )}
                  </div>
                  <div className="flex items-center justify-between px-3 py-2 bg-white/30 border-t border-white/40">
                    <div className="flex items-center gap-3">
                       <div className="flex items-center gap-1 text-[8px] font-bold text-slate-400">
                          <Eye className="w-3 h-3" /> 245
                       </div>
                       <div className="flex items-center gap-1 text-[8px] font-bold text-slate-400">
                          <Clock className="w-3 h-3" /> {formatTimeAgo(prop.postedAt)}
                       </div>
                    </div>
                    <div className="flex gap-2">
                       <button className="flex items-center gap-1 px-3 py-1 bg-brand-navy text-white rounded-lg text-[8px] font-black shadow-sm">
                         <Edit2 className="w-2.5 h-2.5" /> تعديل
                       </button>
                       <button className="p-1.5 bg-white border border-slate-100 rounded-lg text-slate-400">
                         <MoreVertical className="w-3 h-3" />
                       </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Footer Nav */}
      <div className="fixed bottom-6 left-6 right-6 z-50">
        <button 
          onClick={onBackToHome}
          className="w-full bg-brand-navy text-white h-14 rounded-[16px] font-black text-sm flex items-center justify-center gap-3 shadow-xl active:scale-95 transition-all"
        >
          <Building2 className="w-5 h-5 text-brand-orange" />
          زيارة الموقع العام
        </button>
      </div>
    </div>
  );
};

export default Dashboard;