
import React, { useState, useMemo } from 'react';
import { PropertyType, ListingType, FilterState } from '../types';
import { KUWAIT_LOCATION_DATA } from '../constants';
import { X, Search, MapPin, Building, Briefcase, Check, ArrowLeft } from 'lucide-react';

interface FilterSidebarProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  onClose?: () => void;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({ filters, setFilters, onClose }) => {
  const [showAreaSuggestions, setShowAreaSuggestions] = useState(false);

  // قائمة بكافة المناطق للبحث السريع
  const allAreas = useMemo(() => {
    return Object.values(KUWAIT_LOCATION_DATA).flat();
  }, []);

  // تصفية المناطق بناءً على البحث النصي
  const areaSuggestions = useMemo(() => {
    if (!filters.searchQuery.trim()) return [];
    return allAreas.filter(area => 
      area.includes(filters.searchQuery) && !filters.areas.includes(area)
    ).slice(0, 5); // عرض أول 5 نتائج فقط
  }, [filters.searchQuery, allAreas, filters.areas]);

  const toggleListingType = (type: ListingType) => {
    setFilters(prev => ({
      ...prev,
      listingTypes: prev.listingTypes.includes(type)
        ? prev.listingTypes.filter(t => t !== type)
        : [...prev.listingTypes, type]
    }));
  };

  const togglePropertyType = (type: PropertyType) => {
    setFilters(prev => ({
      ...prev,
      propertyTypes: prev.propertyTypes.includes(type)
        ? prev.propertyTypes.filter(t => t !== type)
        : [...prev.propertyTypes, type]
    }));
  };

  const toggleGovernorate = (gov: string) => {
    setFilters(prev => {
      const isSelected = prev.governorates.includes(gov);
      const newGovs = isSelected ? prev.governorates.filter(g => g !== gov) : [...prev.governorates, gov];
      const areasToRemove = KUWAIT_LOCATION_DATA[gov];
      const newAreas = isSelected ? prev.areas.filter(a => !areasToRemove.includes(a)) : prev.areas;
      return { ...prev, governorates: newGovs, areas: newAreas };
    });
  };

  const toggleArea = (area: string) => {
    setFilters(prev => ({
      ...prev,
      areas: prev.areas.includes(area) ? prev.areas.filter(a => a !== area) : [...prev.areas, area]
    }));
  };

  const selectSuggestedArea = (area: string) => {
    // العثور على المحافظة التي تنتمي إليها المنطقة المختارة
    const gov = Object.keys(KUWAIT_LOCATION_DATA).find(g => KUWAIT_LOCATION_DATA[g].includes(area));
    
    setFilters(prev => ({
      ...prev,
      searchQuery: '', // تفريغ خانة البحث بعد الاختيار
      areas: prev.areas.includes(area) ? prev.areas : [...prev.areas, area],
      governorates: gov && !prev.governorates.includes(gov) ? [...prev.governorates, gov] : prev.governorates
    }));
    setShowAreaSuggestions(false);
  };

  const availableAreas = filters.governorates.length > 0 
    ? filters.governorates.flatMap(gov => KUWAIT_LOCATION_DATA[gov]) 
    : [];

  const handleReset = () => {
    setFilters({
      searchQuery: '',
      listingTypes: [],
      propertyTypes: [],
      minPrice: 0,
      maxPrice: 0,
      minRooms: 0,
      governorates: [],
      areas: []
    });
  };

  return (
    <div className="h-full bg-slate-50 flex flex-col font-tajawal">
      <div className="bg-brand-navy px-6 py-5 flex justify-between items-center text-white">
        <h2 className="text-xl font-bold">تصفية البحث</h2>
        {onClose && (
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X className="w-5 h-5 text-white" />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8 pb-48">
        {/* البحث النصي المطور مع اقتراحات المناطق */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 relative">
          <label className="flex items-center gap-2 text-sm font-bold text-brand-navy mb-3">
            <Search className="w-4 h-4 text-brand-orange" />
            بحث نصي / منطقة
          </label>
          <div className="relative">
            <input 
              type="text"
              placeholder="اكتب اسم المنطقة هنا..."
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm font-bold text-brand-navy focus:border-brand-orange transition-colors"
              value={filters.searchQuery}
              onChange={(e) => {
                setFilters(prev => ({ ...prev, searchQuery: e.target.value }));
                setShowAreaSuggestions(true);
              }}
              onFocus={() => setShowAreaSuggestions(true)}
            />
            
            {/* قائمة اقتراحات المناطق */}
            {showAreaSuggestions && areaSuggestions.length > 0 && (
              <div className="absolute z-50 left-0 right-0 top-full mt-2 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="p-2 border-b border-slate-50 bg-slate-50/50">
                  <span className="text-[10px] font-bold text-slate-400">نتائج سريعة للمناطق</span>
                </div>
                {areaSuggestions.map(area => (
                  <button
                    key={area}
                    onClick={() => selectSuggestedArea(area)}
                    className="w-full px-4 py-3 flex items-center justify-between hover:bg-brand-orange/5 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <MapPin className="w-4 h-4 text-slate-300 group-hover:text-brand-orange" />
                      <span className="text-sm font-bold text-brand-navy">{area}</span>
                    </div>
                    <ArrowLeft className="w-3 h-3 text-slate-200 group-hover:text-brand-orange opacity-0 group-hover:opacity-100 transition-all" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* المحافظات */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
          <label className="flex items-center gap-2 text-sm font-bold text-brand-navy mb-4">
            <MapPin className="w-4 h-4 text-brand-orange" />
            المحافظات
          </label>
          <div className="grid grid-cols-2 gap-2">
            {Object.keys(KUWAIT_LOCATION_DATA).map(gov => (
              <label key={gov} className="flex items-center cursor-pointer p-2 rounded-lg hover:bg-slate-50 transition-colors">
                <input 
                  type="checkbox"
                  className="peer hidden"
                  checked={filters.governorates.includes(gov)}
                  onChange={() => toggleGovernorate(gov)}
                />
                <div className={`w-4 h-4 rounded border flex items-center justify-center ml-2 ${filters.governorates.includes(gov) ? 'bg-brand-orange border-brand-orange' : 'border-slate-300 bg-white'}`}>
                  {filters.governorates.includes(gov) && <Check className="w-2.5 h-2.5 text-white" />}
                </div>
                <span className="text-slate-600 text-[11px] font-bold">محافظة {gov}</span>
              </label>
            ))}
          </div>
        </div>

        {/* المناطق */}
        <div className={`bg-white p-4 rounded-2xl shadow-sm border border-slate-100 transition-all duration-300 ${availableAreas.length === 0 ? 'opacity-50 grayscale' : 'animate-in fade-in'}`}>
          <label className="flex items-center gap-2 text-sm font-bold text-brand-navy mb-4">
            <MapPin className="w-4 h-4 text-brand-orange" />
            المناطق {availableAreas.length === 0 && <span className="text-[10px] text-slate-400 font-normal">(اختر محافظة أولاً)</span>}
          </label>
          <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto pr-1 custom-scrollbar">
            {availableAreas.length > 0 ? (
              availableAreas.map(area => (
                <label key={area} className="flex items-center cursor-pointer p-2 rounded-lg hover:bg-slate-50 transition-colors">
                  <input 
                    type="checkbox"
                    className="peer hidden"
                    checked={filters.areas.includes(area)}
                    onChange={() => toggleArea(area)}
                  />
                  <div className={`w-4 h-4 rounded border flex items-center justify-center ml-2 ${filters.areas.includes(area) ? 'bg-brand-orange border-brand-orange' : 'border-slate-300 bg-white'}`}>
                    {filters.areas.includes(area) && <Check className="w-2.5 h-2.5 text-white" />}
                  </div>
                  <span className="text-slate-600 text-[11px] font-bold">{area}</span>
                </label>
              ))
            ) : (
              <div className="col-span-2 py-4 text-center text-slate-300 text-[10px] font-bold italic">لا توجد مناطق لعرضها</div>
            )}
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
          <label className="flex items-center gap-2 text-sm font-bold text-brand-navy mb-4">
            <Briefcase className="w-4 h-4 text-brand-orange" />
            الغرض
          </label>
          <div className="flex flex-wrap gap-2">
            {Object.values(ListingType).map(type => (
              <button 
                key={type}
                onClick={() => toggleListingType(type)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                  filters.listingTypes.includes(type) 
                    ? 'bg-brand-orange border-brand-orange text-white' 
                    : 'bg-white border-slate-200 text-slate-600'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
          <label className="flex items-center gap-2 text-sm font-bold text-brand-navy mb-4">
            <Building className="w-4 h-4 text-brand-orange" />
            نوع العقار
          </label>
          <div className="grid grid-cols-2 gap-2">
            {Object.values(PropertyType).map(type => (
              <label key={type} className="flex items-center cursor-pointer p-2 rounded-lg hover:bg-slate-50 transition-colors">
                <input 
                  type="checkbox"
                  className="peer hidden"
                  checked={filters.propertyTypes.includes(type)}
                  onChange={() => togglePropertyType(type)}
                />
                <div className={`w-4 h-4 rounded border flex items-center justify-center ml-2 ${filters.propertyTypes.includes(type) ? 'bg-brand-orange border-brand-orange' : 'border-slate-300 bg-white'}`}>
                  {filters.propertyTypes.includes(type) && <Check className="w-2.5 h-2.5 text-white" />}
                </div>
                <span className="text-slate-600 text-[11px] font-bold">{type}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white p-6 border-t border-slate-200 fixed bottom-0 left-0 right-0 max-w-2xl mx-auto shadow-2xl">
        <div className="flex flex-col gap-3">
          <button 
            onClick={onClose}
            className="w-full py-4 bg-brand-orange text-white rounded-2xl font-bold text-base shadow-lg shadow-brand-orange/20 transition-all active:scale-[0.98]"
          >
            تطبيق
          </button>
          <button 
            onClick={handleReset}
            className="w-full py-3 border border-slate-200 rounded-xl text-slate-500 font-bold text-sm"
          >
            إعادة تعيين
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;
