import { Property, PropertyType, ListingType, User, UserRole } from './types';

// موظفي شركة "أوتاد العقارية" للتجربة
export const MOCK_USERS: User[] = [
  {
    id: 'usr_admin',
    name: 'أحمد الصالح',
    phone: '65814909', // الرقم المطلوب ليكون أدمن (8 أرقام)
    role: UserRole.ADMIN,
    companyId: 'comp_otad',
    assignedCredits: 1000,
    usedCredits: 150
  },
  {
    id: 'agent_1',
    name: 'فهد العتيبي',
    phone: '90001001',
    role: UserRole.EMPLOYEE,
    companyId: 'comp_otad',
    assignedCredits: 100,
    usedCredits: 45
  },
  {
    id: 'agent_2',
    name: 'سارة الكندري',
    phone: '90001002',
    role: UserRole.EMPLOYEE,
    companyId: 'comp_otad',
    assignedCredits: 50,
    usedCredits: 12
  }
];

// القائمة المحدثة لسهولة البحث
export const KUWAIT_LOCATION_DATA: Record<string, string[]> = {
  'العاصمة': ['الكويت', 'دسمان', 'الشرق', 'الصالحية', 'المرقاب', 'القبلة', 'بنيد القار', 'كيفان', 'الدسمة', 'الدعية', 'المنصورية', 'عبدالله السالم', 'النزهة', 'الفيحاء', 'الشامية', 'الروضة', 'العديلية', 'الخالدية', 'القادسية', 'قرطبة', 'السرة', 'اليرموك', 'الشويخ', 'الري', 'غرناطة', 'صليبيخات', 'الدوحة', 'النهضة', 'القيروان', 'جابر الاحمد', 'شمال غرب صليبيخات'],
  'حولي': ['حولي', 'الشعب', 'السالمية', 'الرميثية', 'الجابرية', 'مشرف', 'بيان', 'البدع', 'النقرة', 'سلوى', 'الزهراء', 'حطين', 'السلام', 'الشهداء', 'الصديق', 'مبارك عبدالله الجابر'],
  'الفروانية': ['الفروانية', 'خيطان', 'خيطان الجنوبي', 'ابرق خيطان', 'العمرية', 'الرابية', 'اشبيلية', 'جليب الشيوخ', 'الاندلس', 'الفردوس', 'العارضية', 'صباح الناصر', 'الرقعي', 'الرحاب', 'عبدالله المبارك', 'جنوب عبدالله المبارك', 'غرب عبدالله المبارك', 'الضجيج'],
  'الاحمدي': ['الاحمدي', 'الفنطاس', 'العقيلة', 'جابر العلي', 'هدية', 'الرقة', 'الظهر', 'الفحيحيل', 'المنقف', 'ابو حليفة', 'الصباحية', 'المهبولة', 'فهد الاحمد', 'علي صباح السالم (ام الهيمان)', 'ميناء عبدالله', 'بنيدر', 'الجليعة', 'الزور', 'الخيران', 'صباح الاحمد', 'خيران السكنية', 'الوفرة'],
  'مبارك الكبير': ['مبارك الكبير', 'صباح السالم', 'المسيلة', 'العدان', 'القصور', 'القرين', 'ابو فطيرة', 'الفنيطيس', 'ابو الحصانية', 'صبحان', 'اسواق القرين'],
  'الجهراء': ['الجهراء', 'الواحة', 'العيون', 'القصر', 'النسيم', 'تيماء', 'النعيم', 'كاظمة', 'الصليبية', 'سعد عبدالله', 'المطلاع', 'العبدلي', 'السالمي', 'كبد']
};

export const MOCK_PROPERTIES: Property[] = [
  {
    id: '1',
    title: 'شقة فاخرة للايجار في السالمية مطلة على البحر',
    description: 'شقة واسعة تتكون من 3 غرف نوم، صالة كبيرة، مطبخ مجهز بالكامل. تشطيب سوبر ديلوكس.',
    price: 650,
    area: 'السالمية',
    governorate: 'حولي',
    location: 'قطعة 5، شارع الخليج العربي',
    type: PropertyType.APARTMENT,
    listingType: ListingType.RENT,
    rooms: 3,
    bathrooms: 3,
    space: 180,
    images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800'],
    postedAt: new Date(Date.now() - 1000 * 60 * 30),
    whatsapp: '90001001',
    companyName: 'أوتاد العقارية',
    featured: true,
    postedBy: 'agent_1'
  },
  {
    id: '2',
    title: 'فيلا للبيع في صباح السالم زاوية',
    description: 'فيلا مودرن، 3 ادوار وسرداب، مصعد، حمام سباحة خاص. بنيان حديث 2023.',
    price: 580000,
    area: 'صباح السالم',
    governorate: 'مبارك الكبير',
    location: 'قطعة 2، شارع 10',
    type: PropertyType.VILLA,
    listingType: ListingType.SALE,
    rooms: 7,
    bathrooms: 8,
    space: 400,
    images: ['https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&q=80&w=800'],
    postedAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
    whatsapp: '90001002',
    companyName: 'أوتاد العقارية',
    postedBy: 'agent_2'
  },
  {
    id: '3',
    title: 'دور كامل للايجار في الجابرية',
    description: 'دور ثاني مع مصعد، 4 غرف ماستر، صالة واسعة جدا. موقع مميز.',
    price: 900,
    area: 'الجابرية',
    governorate: 'حولي',
    location: 'قطعة 8',
    type: PropertyType.FLOOR,
    listingType: ListingType.RENT,
    rooms: 4,
    bathrooms: 5,
    space: 320,
    images: ['https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&q=80&w=800'],
    postedAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
    whatsapp: '65814909',
    companyName: 'أوتاد العقارية',
    postedBy: 'usr_admin'
  }
];