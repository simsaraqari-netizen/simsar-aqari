import React from 'react';
import { Property } from '../types';
import { Building2, Clock, Star, Share2, MapPin } from 'lucide-react';

interface PropertyCardProps {
  property: Property;
  onClick: (property: Property) => void;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property, onClick }) => {
  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: property.title,
        url: window.location.href,
      });
    }
  };

  return (
    <div 
      onClick={() => onClick(property)}
      className={`bg-white rounded-2xl overflow-hidden border border-slate-100 flex gap-4 p-3 cursor-pointer hover:shadow-xl transition-all duration-300 ${property.featured ? 'border-brand-orange/30 ring-1 ring-brand-orange/10' : ''}`}
    >
      <div className="relative w-24 h-24 sm:w-32 sm:h-32 shrink-0 rounded-xl overflow-hidden bg-slate-100">
        {property.images && property.images.length > 0 ? (
          <img src={property.images[0]} alt={property.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-brand-navy/5 text-brand-navy/20">
            <Building2 className="w-8 h-8" />
          </div>
        )}
        {property.featured && (
          <div className="absolute top-2 right-2 bg-brand-orange text-white text-[8px] font-black px-1.5 py-0.5 rounded flex items-center gap-1 shadow-sm">
            <Star className="w-2 h-2 fill-white" />
            مميز
          </div>
        )}
      </div>

      <div className="flex-1 flex flex-col justify-between py-1 min-w-0">
        <div>
          <div className="flex items-center gap-1 mb-1">
            <span className={`text-[8px] font-black px-2 py-0.5 rounded ${property.listingType === 'للبيع' ? 'bg-emerald-100 text-emerald-600' : 'bg-brand-navy/10 text-brand-navy'}`}>
              {property.listingType}
            </span>
            <span className="text-[8px] font-bold text-slate-400">• {property.type}</span>
          </div>
          <h3 className="text-sm font-black text-brand-navy truncate mb-1">{property.title}</h3>
          <div className="flex items-center gap-1 text-slate-400">
            <MapPin className="w-3 h-3" />
            <span className="text-[10px] font-bold truncate">{property.area}، {property.governorate}</span>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-slate-50 pt-2 mt-2">
          <span className="text-brand-orange font-black text-sm">
            {property.price > 0 ? `${property.price.toLocaleString()} د.ك` : 'على السوم'}
          </span>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-[9px] text-slate-400 font-bold">
              <Clock className="w-3 h-3 opacity-50" />
              منذ قليل
            </div>
            <button onClick={handleShare} className="text-slate-300 hover:text-brand-navy transition-colors">
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;