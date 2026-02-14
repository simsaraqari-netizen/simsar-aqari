import React, { useState, useRef, useEffect } from 'react';
import { ListingType, PropertyType, FilterState } from '../types';
import { KUWAIT_LOCATION_DATA } from '../constants';
import { ChevronDown, Check, Building2, MapPin, Search as SearchIcon } from 'lucide-react';

interface HeroSearchProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  onSearch: () => void;
}

const HeroSearch: React.FC<HeroSearchProps> = ({ filters, setFilters, onSearch }) => {
  const [openDropdown, setOpenDropdown] = useState<'area' | 'governorate' | 'propertyType' | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const availableAreas = filters.governorates.length > 0 
    ? filters.governorates.flatMap(gov => KUWAIT_LOCATION_DATA[gov]) 
    : Object.values(KUWAIT_LOCATION_DATA).flat();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
      
      let newAreas = prev.areas;
      if (isSelected) {
        const areasToRemove = KUWAIT_LOCATION_DATA[gov];
        newAreas = prev.areas.filter(a => !areasToRemove.includes(a));
      }
      
      return { ...prev, governorates: newGovs, areas: newAreas };
    });
  };

  const toggleArea = (area: string) => {
    setFilters(prev => ({
      ...prev,
      areas: prev.areas.includes(area) ? prev.areas.filter(a => a !== area) : [...prev.areas, area]
    }));
  };

  return (
    <div className="bg-brand-light pt-10 pb-16 relative overflow-hidden font-tajawal">
      <div className="absolute top-0 right-0 w-80 h-80 bg-brand-orange/5 rounded-full -mr-40 -mt-40 blur-3xl"></div>
      
      <div className="max-w-2xl mx-auto px-6 text-center relative z-10">
        <div className="flex flex-col items-center mb-6">
          <img 
            src="https://storage.googleapis.com/static.smart-re.com/logos/simsar_logo.png" 
            className="h-12 w-auto mb-4" 
            alt="Simsar Logo" 
          />
          <h1 className="text-2xl font-black text-brand-navy mb-1 leading-tight hero-title-shadow">السمسار العقاري</h1>
          <h2 className="text-sm font-bold text-brand-orange">دليلك العقاري الأذكى في الكويت</h2>
        </div>
        
        <p className="text-brand-navy/60 text-[10px] font-bold leading-relaxed mb-8 max-w-md mx-auto">
          تصفح آلاف العقارات الموثقة في كافة المحافظات والمناطق.
          بيع، شراء، إيجار، أو بدل.. كل خياراتك في مكان واحد.
        </p>

        <div className="mt-2" ref={dropdownRef}>
          <div className="bg-white rounded-[24px] border border-white p-2.5 search-box-shadow max-w-md mx-auto relative">
            
            <div className="flex gap-2 bg-slate-100/80 rounded-[18px] p-1.5 mb-2.5 shadow-inner border border-slate-100">
              {[ListingType.SALE, ListingType.EXCHANGE, ListingType.RENT].map((type) => (
                <button
                  key={type}
                  onClick={() => toggleListingType(type)}
                  className={`flex-1 py-3 rounded-[14px] font-black text-sm transition-all duration-300 ${
                    filters.listingTypes.includes(type) 
                    ? 'bg-brand-navy text-white shadow-md scale-[1.02]' 
                    : 'bg-transparent text-slate-400 hover:text-brand-navy hover:bg-white/50'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>

            <div className="px-1 space-y-1">
              <div className="relative border-b border-slate-100">
                <button 
                  onClick={() => setOpenDropdown(openDropdown === 'propertyType' ? null : 'propertyType')}
                  className="w-full py-4.5 pr-12 pl-4 bg-transparent font-bold text-slate-600 text-right text-sm flex items-center justify-between"
                >
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-navy/30">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <span className="truncate flex-1">
                    {filters.propertyTypes.length > 0 
                      ? `${filters.propertyTypes.length === 1 ? filters.propertyTypes[0] : filters.propertyTypes.length + ' أنواع عقارات'}` 
                      : 'نوع العقار'}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-slate-300 transition-transform ${openDropdown === 'propertyType' ? 'rotate-180' : ''}`} />
                </button>

                {openDropdown === 'propertyType' && (
                  <div className="absolute z-50 left-0 right-0 top-[105%] bg-white shadow-2xl rounded-2xl border border-slate-100 max-h-60 overflow-y-auto animate-in fade-in zoom-in-95 duration-200 custom-scrollbar">
                    <div className="p-2 space-y-1">
                      {Object.values(PropertyType).map(type => (
                        <div 
                          key={type}
                          onClick={() => togglePropertyType(type)}
                          className={`flex items-center justify-between px-4 py-3.5 rounded-xl transition-colors cursor-pointer ${
                            filters.propertyTypes.includes(type) ? 'bg-brand-orange/10' : 'hover:bg-slate-50'
                          }`}
                        >
                          <span className={`text-sm font-bold ${filters.propertyTypes.includes(type) ? 'text-brand-orange' : 'text-brand-navy'}`}>
                            {type}
                          </span>
                          <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                            filters.propertyTypes.includes(type) ? 'bg-brand-orange border-brand-orange' : 'border-slate-200 bg-white'
                          }`}>
                            {filters.propertyTypes.includes(type) && <Check className="w-3.5 h-3.5 text-white stroke-[3px]" />}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="relative border-b border-slate-100">
                <button 
                  onClick={() => setOpenDropdown(openDropdown === 'governorate' ? null : 'governorate')}
                  className="w-full py-4.5 pr-12 pl-4 bg-transparent font-bold text-slate-600 text-right text-sm flex items-center justify-between"
                >
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-navy/30">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <span className="truncate flex-1">
                    {filters.governorates.length > 0 
                      ? `${filters.governorates.length === 1 ? 'محافظة ' + filters.governorates[0] : filters.governorates.length + ' محافظات'}` 
                      : 'المحافظة'}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-slate-300 transition-transform ${openDropdown === 'governorate' ? 'rotate-180' : ''}`} />
                </button>

                {openDropdown === 'governorate' && (
                  <div className="absolute z-50 left-0 right-0 top-[105%] bg-white shadow-2xl rounded-2xl border border-slate-100 max-h-60 overflow-y-auto animate-in fade-in zoom-in-95 duration-200 custom-scrollbar">
                    <div className="p-2 space-y-1">
                      {Object.keys(KUWAIT_LOCATION_DATA).map(gov => (
                        <div 
                          key={gov}
                          onClick={() => toggleGovernorate(gov)}
                          className={`flex items-center justify-between px-4 py-3.5 rounded-xl transition-colors cursor-pointer ${
                            filters.governorates.includes(gov) ? 'bg-brand-orange/10' : 'hover:bg-slate-50'
                          }`}
                        >
                          <span className={`text-sm font-bold ${filters.governorates.includes(gov) ? 'text-brand-orange' : 'text-brand-navy'}`}>
                            محافظة {gov}
                          </span>
                          <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                            filters.governorates.includes(gov) ? 'bg-brand-orange border-brand-orange' : 'border-slate-200 bg-white'
                          }`}>
                            {filters.governorates.includes(gov) && <Check className="w-3.5 h-3.5 text-white stroke-[3px]" />}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="relative">
                <button 
                  onClick={() => setOpenDropdown(openDropdown === 'area' ? null : 'area')}
                  className="w-full py-4.5 pr-12 pl-4 bg-transparent font-bold text-slate-600 text-right text-sm flex items-center justify-between"
                >
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-navy/30">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <span className="truncate flex-1">
                    {filters.areas.length > 0 
                      ? `${filters.areas.length === 1 ? filters.areas[0] : filters.areas.length + ' مناطق'}` 
                      : 'المنطقة / المدينة'}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-slate-300 transition-transform ${openDropdown === 'area' ? 'rotate-180' : ''}`} />
                </button>

                {openDropdown === 'area' && (
                  <div className="absolute z-50 left-0 right-0 top-[105%] bg-white shadow-2xl rounded-2xl border border-slate-100 max-h-72 overflow-y-auto animate-in fade-in zoom-in-95 duration-200 custom-scrollbar">
                    <div className="p-2 space-y-1">
                      {availableAreas.length === 0 ? (
                        <div className="p-6 text-center text-slate-400 text-xs font-bold">يرجى اختيار محافظة أولاً لعرض المناطق</div>
                      ) : (
                        availableAreas.map(area => (
                          <div 
                            key={area}
                            onClick={() => toggleArea(area)}
                            className={`flex items-center justify-between px-4 py-3.5 rounded-xl transition-colors cursor-pointer ${
                              filters.areas.includes(area) ? 'bg-brand-orange/10' : 'hover:bg-slate-50'
                            }`}
                          >
                            <span className={`text-sm font-bold ${filters.areas.includes(area) ? 'text-brand-orange' : 'text-brand-navy'}`}>
                              {area}
                            </span>
                            <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                              filters.areas.includes(area) ? 'bg-brand-orange border-brand-orange' : 'border-slate-200 bg-white'
                            }`}>
                              {filters.areas.includes(area) && <Check className="w-3.5 h-3.5 text-white stroke-[3px]" />}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <button 
              onClick={onSearch}
              className="w-full mt-3 py-5 bg-brand-navy text-white font-black text-xl hover:bg-brand-orange transition-all rounded-[18px] flex items-center justify-center gap-3 active:scale-[0.98] shadow-lg group"
            >
              <SearchIcon className="w-6 h-6 text-brand-orange group-hover:text-white transition-colors" />
              <span>ابـحـث الآن</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSearch;