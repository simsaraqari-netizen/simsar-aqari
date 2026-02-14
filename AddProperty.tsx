
import React, { useState } from 'react';
import { PropertyType, ListingType, User, Company } from '../types';
import { KUWAIT_LOCATION_DATA } from '../constants';
import { 
  X, 
  Camera, 
  MapPin, 
  Building2, 
  Tag, 
  Info, 
  ChevronLeft, 
  CheckCircle2,
  Star,
  PlusCircle,
  RefreshCw,
  Phone,
  Hash,
  FileText
} from 'lucide-react';

interface AddPropertyProps {
  user: User;
  company?: Company;
  onClose: () => void;
  onSuccess: (propertyData: any) => void;
}

const AddProperty: React.FC<AddPropertyProps> = ({ user, company, onClose, onSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: PropertyType.APARTMENT,
    listingType: ListingType.RENT,
    governorate: '',
    area: '',
    price: '',
    phone: user.phone,
    propertyCode: '',
    licenseNumber: '',
    isFeatured: false,
    acceptedTerms: false
  });

  const [images, setImages] = useState<File[]>([]);

  // Text Sanitization Logic: Allows Arabic, English, Numbers, Spaces, and Commas. Blocks Emojis.
  const sanitizeInput = (text: string) => {
    // Allows Arabic range, Basic Latin (Eng), Numbers, Space, Comma (Ar/En)
    return text.replace(/[^\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF0-9a-zA-Z\s،,.]/g, '');
  };

  const handleTextChange = (field: 'title' | 'description', value: string) => {
    const sanitized = sanitizeInput(value);
    const limit = field === 'title' ? 100 : 500;
    setFormData(prev => ({ ...prev, [field]: sanitized.slice(0, limit) }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      if (images.length + newFiles.length > 10) {
        alert("الحد الأقصى المسموح به هو 10 صور فقط");
        return;
      }
      setImages(prev => [...prev, ...newFiles]);
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.acceptedTerms) return;
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      onSuccess({
        ...formData,
        images: images.length > 0 ? images.map(i => URL.createObjectURL(i)) : [],
        price: formData.price ? parseInt(formData.price) : 0
      });
      setIsSubmitting(false);
    }, 1200);
  };

  const canSubmit = formData.title.length > 5 && 
                    formData.description.length > 10 && 
                    formData.governorate && 
                    formData.area && 
                    formData.phone &&
                    formData.acceptedTerms;

  return (
    <div className="fixed inset-0 z-[110] bg-brand-navy/60 backdrop-blur-md flex flex-col sm:items-center sm:justify-center font-tajawal">
      <div className="bg-white w-full max-w-2xl h-full sm:h-[90vh] sm:rounded-[32px] shadow-2xl overflow-hidden flex flex-col animate-in slide-in-from-bottom duration-300">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-20">
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-brand-orange/10 rounded-xl flex items-center justify-center text-brand-orange">
                <PlusCircle className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-black text-brand-navy">أضف إعلانك</h2>
           </div>
           <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-full text-slate-400 transition-colors">
             <X className="w-6 h-6" />
           </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
          
          {/* Section 1: Content */}
          <div className="space-y-4">
             <div className="space-y-2">
                <label className="text-xs font-black text-brand-navy flex justify-between">
                  <span>عنوان الإعلان (مطلوب)</span>
                  <span className={`text-[10px] font-bold ${formData.title.length >= 100 ? 'text-red-500' : 'text-slate-400'}`}>{formData.title.length}/100</span>
                </label>
                <input 
                  type="text"
                  required
                  placeholder="مثال: شقة للبيع في حولي تشطيب ديلوكس"
                  className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-brand-orange font-bold text-sm transition-all"
                  value={formData.title}
                  onChange={(e) => handleTextChange('title', e.target.value)}
                />
             </div>

             <div className="space-y-2">
                <label className="text-xs font-black text-brand-navy flex justify-between">
                  <span>تفاصيل العقار (مطلوب)</span>
                  <span className={`text-[10px] font-bold ${formData.description.length >= 500 ? 'text-red-500' : 'text-slate-400'}`}>{formData.description.length}/500</span>
                </label>
                <textarea 
                  required
                  rows={4}
                  placeholder="اكتب مواصفات العقار بالكامل هنا..."
                  className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-brand-orange font-bold text-sm transition-all resize-none"
                  value={formData.description}
                  onChange={(e) => handleTextChange('description', e.target.value)}
                />
                <p className="text-[9px] text-slate-400 font-bold">ملاحظة: يمنع استخدام الرموز التعبيرية والايقونات.</p>
             </div>
          </div>

          {/* Section 2: Types */}
          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-2">
                <label className="text-xs font-black text-brand-navy">نوع العقار</label>
                <div className="relative">
                  <select 
                    className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold text-sm appearance-none cursor-pointer"
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value as PropertyType})}
                  >
                    {Object.values(PropertyType).map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                  <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 pointer-events-none" />
                </div>
             </div>
             <div className="space-y-2">
                <label className="text-xs font-black text-brand-navy">الغرض من الإعلان</label>
                <div className="relative">
                  <select 
                    className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold text-sm appearance-none cursor-pointer"
                    value={formData.listingType}
                    onChange={(e) => setFormData({...formData, listingType: e.target.value as ListingType})}
                  >
                    {Object.values(ListingType).map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                  <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 pointer-events-none" />
                </div>
             </div>
          </div>

          {/* Section 3: Location */}
          <div className="space-y-4 pt-2">
             <h3 className="text-sm font-black text-brand-navy border-r-4 border-brand-orange pr-3 uppercase">الموقع</h3>
             <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-500">المحافظة</label>
                  <select 
                    required
                    className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold text-sm"
                    value={formData.governorate}
                    onChange={(e) => setFormData({...formData, governorate: e.target.value, area: ''})}
                  >
                    <option value="">اختر المحافظة</option>
                    {Object.keys(KUWAIT_LOCATION_DATA).map(gov => <option key={gov} value={gov}>{gov}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-500">المنطقة / المدينة</label>
                  <select 
                    required
                    disabled={!formData.governorate}
                    className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold text-sm disabled:opacity-50"
                    value={formData.area}
                    onChange={(e) => setFormData({...formData, area: e.target.value})}
                  >
                    <option value="">اختر المنطقة</option>
                    {formData.governorate && KUWAIT_LOCATION_DATA[formData.governorate].map(area => (
                      <option key={area} value={area}>{area}</option>
                    ))}
                  </select>
                </div>
             </div>
          </div>

          {/* Section 4: Details */}
          <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="space-y-2">
                <label className="text-xs font-black text-brand-navy">السعر (اختياري)</label>
                <input 
                  type="number"
                  placeholder="د.ك (اختياري)"
                  className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold text-sm"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-brand-navy">رقم الهاتف (مطلوب)</label>
                <div className="relative">
                  <input 
                    type="tel"
                    required
                    placeholder="رقم التواصل"
                    className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold text-sm"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 pointer-events-none" />
                </div>
              </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-500">كود العقار (اختياري)</label>
                <div className="relative">
                  <input 
                    type="text"
                    placeholder="كود خاص"
                    className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold text-sm"
                    value={formData.propertyCode}
                    onChange={(e) => setFormData({...formData, propertyCode: e.target.value})}
                  />
                  <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 pointer-events-none" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-500">رقم الترخيص (اختياري)</label>
                <div className="relative">
                  <input 
                    type="text"
                    placeholder="رقم ترخيص الإعلان"
                    className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold text-sm"
                    value={formData.licenseNumber}
                    onChange={(e) => setFormData({...formData, licenseNumber: e.target.value})}
                  />
                  <FileText className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 pointer-events-none" />
                </div>
              </div>
          </div>

          {/* Section 5: Media */}
          <div className="space-y-4 pt-2">
             <div className="flex justify-between items-center">
                <h3 className="text-sm font-black text-brand-navy border-r-4 border-brand-orange pr-3 uppercase">صور العقار (اختياري)</h3>
                <span className="text-[10px] font-bold text-slate-400">{images.length} / 10</span>
             </div>
             
             <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                <label className="aspect-square bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-100 transition-colors gap-1 group">
                   <Camera className="w-6 h-6 text-slate-300 group-hover:text-brand-orange transition-colors" />
                   <span className="text-[9px] font-bold text-slate-400">إضافة صور</span>
                   <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageChange} />
                </label>
                
                {images.map((file, idx) => (
                  <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden shadow-sm">
                     <img src={URL.createObjectURL(file)} className="w-full h-full object-cover" alt="" />
                     <button 
                       type="button"
                       onClick={() => removeImage(idx)}
                       className="absolute top-1 left-1 bg-red-500 text-white p-1 rounded-lg"
                     >
                       <X className="w-3 h-3" />
                     </button>
                  </div>
                ))}
             </div>
          </div>

          {/* Section 6: Payment / Terms */}
          <div className="space-y-4 p-5 bg-brand-navy/[0.03] rounded-3xl border border-brand-navy/5">
             <div className="flex items-center justify-between">
                <div>
                   <h4 className="text-xs font-black text-brand-navy">تكلفة الإعلان</h4>
                   <p className="text-[10px] text-slate-400 font-bold">خصم من رصيد المحفظة</p>
                </div>
                <div className="text-left">
                   <span className="text-lg font-black text-brand-navy">5 د.ك</span>
                   <span className="block text-[9px] text-emerald-500 font-black">مجاني حالياً</span>
                </div>
             </div>

             <div className="pt-4 border-t border-slate-100">
                <label className="flex items-center gap-3 cursor-pointer group">
                   <input 
                     type="checkbox"
                     className="hidden peer"
                     checked={formData.isFeatured}
                     onChange={(e) => setFormData({...formData, isFeatured: e.target.checked})}
                   />
                   <div className="w-6 h-6 rounded-lg border-2 border-slate-200 flex items-center justify-center peer-checked:bg-brand-orange peer-checked:border-brand-orange transition-all">
                      <Star className="w-3.5 h-3.5 text-white fill-current" />
                   </div>
                   <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-brand-navy">إعلان مميز</span>
                        <span className="bg-brand-orange/10 text-brand-orange text-[9px] px-2 py-0.5 rounded-full font-black">1 د.ك</span>
                      </div>
                      <p className="text-[9px] text-slate-400 font-bold">يظهر في مقدمة البحث وبألوان لافتة.</p>
                   </div>
                </label>
             </div>

             <div className="pt-4 border-t border-slate-100">
                <label className="flex items-center gap-3 cursor-pointer">
                   <input 
                     type="checkbox"
                     required
                     className="hidden peer"
                     checked={formData.acceptedTerms}
                     onChange={(e) => setFormData({...formData, acceptedTerms: e.target.checked})}
                   />
                   <div className="w-5 h-5 rounded-md border-2 border-slate-200 flex items-center justify-center peer-checked:bg-brand-navy peer-checked:border-brand-navy transition-all">
                      <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                   </div>
                   <span className="text-[11px] font-bold text-slate-500">أوافق على شروط الاستخدام وقواعد النشر.</span>
                </label>
             </div>
          </div>
        </form>

        {/* Action Button */}
        <div className="p-6 bg-white border-t border-slate-100">
           <button 
             onClick={handleSubmit}
             disabled={!canSubmit || isSubmitting}
             className="w-full bg-brand-navy text-white h-14 rounded-2xl font-black text-base flex items-center justify-center gap-3 shadow-xl disabled:opacity-50 transition-all active:scale-95"
           >
             {isSubmitting ? <RefreshCw className="w-5 h-5 animate-spin" /> : <span>نشر الإعلان الآن</span>}
             {!isSubmitting && <ChevronLeft className="w-5 h-5" />}
           </button>
        </div>
      </div>
    </div>
  );
};

export default AddProperty;
