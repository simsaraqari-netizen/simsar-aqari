
import React, { useState, useMemo } from 'react';
import { MOCK_PROPERTIES, MOCK_USERS } from './constants';
import { Property, FilterState, User, UserRole, Company } from './types';
import PropertyCard from './components/PropertyCard';
import FilterSidebar from './components/FilterSidebar';
import PropertyDetails from './components/PropertyDetails';
import LoginModal from './components/LoginModal';
import HeroSearch from './components/HeroSearch';
import Dashboard from './components/Dashboard';
import AddProperty from './components/AddProperty';
import { 
  SlidersHorizontal, 
  User as UserIcon, 
  PlusCircle,
  LayoutDashboard
} from 'lucide-react';

const App: React.FC = () => {
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    listingTypes: [],
    propertyTypes: [],
    minPrice: 0,
    maxPrice: 0,
    minRooms: 0,
    governorates: [],
    areas: []
  });

  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [showLogin, setShowLogin] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showAddProperty, setShowAddProperty] = useState(false);
  const [view, setView] = useState<'home' | 'dashboard'>('home');

  const company: Company = {
    id: 'comp_otad',
    name: 'أوتاد العقارية',
    totalCredits: 1000,
    usedCredits: 150,
    packageType: 'PREMIUM'
  };

  const filteredProperties = useMemo(() => {
    return MOCK_PROPERTIES.filter(p => {
      const matchSearch = !filters.searchQuery || 
        p.title.includes(filters.searchQuery) || 
        p.area.includes(filters.searchQuery);
      
      const matchListingType = filters.listingTypes.length === 0 || filters.listingTypes.includes(p.listingType);
      const matchPropertyType = filters.propertyTypes.length === 0 || filters.propertyTypes.includes(p.type);
      const matchGov = filters.governorates.length === 0 || filters.governorates.includes(p.governorate);
      const matchArea = filters.areas.length === 0 || filters.areas.includes(p.area);
      
      return matchSearch && matchListingType && matchPropertyType && matchGov && matchArea;
    });
  }, [filters]);

  const handleLoginSuccess = (phone: string, name?: string) => {
    const foundUser = MOCK_USERS.find(u => u.phone === phone);
    if (foundUser) {
      setUser(foundUser);
    } else {
      setUser({
        id: 'new_user',
        name: name || 'مستخدم جديد',
        phone,
        role: UserRole.EMPLOYEE,
        companyId: 'comp_otad',
        assignedCredits: 10,
        usedCredits: 0
      });
    }
    setShowLogin(false);
  };

  const handleAddClick = () => {
    if (!user) {
      setShowLogin(true);
    } else {
      setShowAddProperty(true);
    }
  };

  if (view === 'dashboard' && user) {
    return (
      <Dashboard 
        user={user} 
        company={company} 
        onLogout={() => { setUser(null); setView('home'); }} 
        onBackToHome={() => setView('home')} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-tajawal">
      {/* الشريط العلوي القديم (Header) */}
      <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 px-6 py-4 flex justify-between items-center border-b border-slate-100 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-brand-navy rounded-xl flex items-center justify-center p-1.5 shadow-sm">
            <img src="https://storage.googleapis.com/static.smart-re.com/logos/simsar_logo.png" className="h-full w-auto brightness-0 invert" alt="السمسار" />
          </div>
          <h1 className="font-black text-brand-navy text-xl hidden sm:block">السمسار</h1>
        </div>

        <div className="flex items-center gap-2">
          {/* زر إضافة إعلان - مكان جديد بارز في الأعلى */}
          <button 
            onClick={handleAddClick}
            className="flex items-center gap-2 px-4 py-2 bg-brand-orange text-white rounded-xl font-black text-xs shadow-lg shadow-brand-orange/20 active:scale-95 transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span className="hidden xs:block">أضف إعلان</span>
          </button>

          <button 
            onClick={() => setShowFilters(true)}
            className="p-2.5 bg-slate-50 rounded-xl text-brand-navy hover:bg-slate-100 transition-colors border border-slate-100"
          >
            <SlidersHorizontal className="w-5 h-5" />
          </button>
          
          {user ? (
            <button 
              onClick={() => setView('dashboard')}
              className="flex items-center gap-2 bg-brand-navy/5 px-3 py-2 rounded-xl border border-brand-navy/10 hover:bg-brand-navy/10 transition-colors"
            >
              <span className="text-xs font-black text-brand-navy hidden sm:block">{user.name}</span>
              <div className="w-8 h-8 bg-brand-navy text-white rounded-lg flex items-center justify-center text-xs font-black">
                <LayoutDashboard className="w-4 h-4" />
              </div>
            </button>
          ) : (
            <button 
              onClick={() => setShowLogin(true)}
              className="px-6 py-2.5 bg-brand-navy text-white rounded-xl font-black text-xs shadow-lg shadow-brand-navy/20 active:scale-95 transition-all"
            >
              دخول
            </button>
          )}
        </div>
      </nav>

      {/* قسم البحث */}
      <HeroSearch 
        filters={filters} 
        setFilters={setFilters} 
        onSearch={() => {}} 
      />

      {/* المحتوى الرئيسي */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6 px-1">
          <div className="border-r-4 border-brand-orange pr-4">
            <h2 className="text-xl font-black text-brand-navy">أحدث الإعلانات</h2>
            <p className="text-slate-400 text-[10px] font-bold">عروض عقارية حصرية في الكويت</p>
          </div>
          <span className="text-[10px] font-bold text-slate-400 bg-white px-3 py-1 rounded-full border border-slate-100">
            {filteredProperties.length} عقار
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {filteredProperties.length > 0 ? (
            filteredProperties.map(property => (
              <PropertyCard 
                key={property.id} 
                property={property} 
                onClick={setSelectedProperty} 
              />
            ))
          ) : (
            <div className="py-20 text-center bg-white rounded-3xl border border-dashed border-slate-200">
              <p className="text-slate-400 font-bold">لا توجد نتائج بحث تطابق خياراتك</p>
            </div>
          )}
        </div>
      </main>

      {/* مودال الفلاتر (Sidebar) */}
      {showFilters && (
        <div className="fixed inset-0 z-[70] bg-black/40 backdrop-blur-sm">
          <div className="absolute inset-y-0 left-0 w-full max-w-md bg-white shadow-2xl animate-in slide-in-from-left duration-500 overflow-hidden">
            <FilterSidebar 
              filters={filters} 
              setFilters={setFilters} 
              onClose={() => setShowFilters(false)} 
            />
          </div>
        </div>
      )}

      {/* تفاصيل العقار */}
      {selectedProperty && (
        <PropertyDetails 
          property={selectedProperty} 
          onClose={() => setSelectedProperty(null)} 
        />
      )}

      {/* نافذة إضافة عقار */}
      {showAddProperty && user && (
        <AddProperty 
          user={user}
          company={company}
          onClose={() => setShowAddProperty(false)}
          onSuccess={(data) => {
            console.log("New Property:", data);
            setShowAddProperty(false);
            alert("تم إرسال إعلانك بنجاح!");
          }}
        />
      )}

      {/* نافذة تسجيل الدخول */}
      {showLogin && (
        <LoginModal 
          onClose={() => setShowLogin(false)} 
          onSuccess={handleLoginSuccess} 
        />
      )}

      <footer className="bg-white border-t border-slate-100 py-12 px-6 mt-20 text-center">
        <img src="https://storage.googleapis.com/static.smart-re.com/logos/simsar_logo.png" className="h-8 w-auto mx-auto grayscale opacity-20 mb-4" alt="" />
        <p className="text-slate-300 text-[10px] font-bold">© 2024 السمسار العقاري - دليلك الأول في الكويت</p>
      </footer>
    </div>
  );
};

export default App;
