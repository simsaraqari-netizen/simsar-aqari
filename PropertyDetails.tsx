import React from 'react';
import { Property } from '../types';
import { X, Share2, Phone, Clock, MapPin, Building2, Ruler } from 'lucide-react';

interface PropertyDetailsProps {
  property: Property;
  onClose: () => void;
}

const PropertyDetails: React.FC<PropertyDetailsProps> = ({ property, onClose }) => {
  const handleWhatsApp = () => {
    window.open(`https://wa.me/${property.whatsapp}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-[100] bg-brand-navy/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 font-tajawal">
      <div className="bg-white w-full max-w-2xl h-[90vh] sm:h-auto sm:max-h-[90vh] rounded-t-[32px] sm:rounded-[32px] overflow-hidden flex flex-col relative animate-in slide-in-from-bottom duration-300 shadow-2xl">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 z-10 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full transition-colors backdrop-blur-md"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="overflow-y-auto flex-1 pb-24">
          <div className="h-64 sm:h-80 bg-slate-100">
            {property.images && property.images.length > 0 ? (
              <img src={property.images[0]} className="w-full h-full object-cover" alt={property.title} />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-slate-200">
                <Building2 className="w-20 h-20 text-slate-400" />
              </div>
            )}
          </div>

          <div className="p-6 space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-black text-brand-navy mb-2">{property.title}</h2>
                <div className="flex items-center gap-2 text-slate-400 font-bold text-sm">
                  <MapPin className="w-4 h-4 text-brand-orange" />
                  {property.area}، {property.governorate}
                </div>
              </div>
              <div className="text-left">
                <p className="text-2xl font-black text-brand-orange">
                  {property.price > 0 ? `${property.price.toLocaleString()} د.ك` : 'على السوم'}
                </p>
                <p className="text-[10px] font-bold text-slate-400">{property.listingType}</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 py-6 border-y border-slate-100">
              <div className="text-center">
                <Ruler className="w-5 h-5 text-slate-300 mx-auto mb-1" />
                <p className="text-xs font-black text-brand-navy">{property.space || '---'} م²</p>
                <p className="text-[8px] font-bold text-slate-400">المساحة</p>
              </div>
              <div className="text-center">
                <Clock className="w-5 h-5 text-slate-300 mx-auto mb-1" />
                <p className="text-xs font-black text-brand-navy">منذ يومين</p>
                <p className="text-[8px] font-bold text-slate-400">تاريخ النشر</p>
              </div>
              <div className="text-center">
                <Building2 className="w-5 h-5 text-slate-300 mx-auto mb-1" />
                <p className="text-xs font-black text-brand-navy">{property.type}</p>
                <p className="text-[8px] font-bold text-slate-400">نوع العقار</p>
              </div>
            </div>

            <div>
              <h3 className="font-black text-brand-navy text-lg mb-3">التفاصيل</h3>
              <p className="text-slate-600 leading-relaxed font-medium text-sm whitespace-pre-wrap">
                {property.description}
              </p>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 bg-white border-t border-slate-100 flex gap-3">
          <button 
            onClick={handleWhatsApp}
            className="flex-1 bg-[#25D366] text-white py-4 rounded-2xl font-black text-base flex items-center justify-center gap-3 shadow-lg"
          >
            <span>واتساب</span>
          </button>
          <button className="w-14 h-14 bg-brand-navy text-white rounded-2xl flex items-center justify-center shadow-lg">
            <Phone className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;