
import React, { useState, useEffect, useRef } from 'react';
import { X, Phone, Lock, Eye, EyeOff, UserPlus, LogIn, ShieldCheck, ArrowRight, RefreshCw, CheckCircle2, User } from 'lucide-react';

interface LoginModalProps {
  onClose: () => void;
  onSuccess: (phone: string, name?: string) => void;
}

type ModalView = 'main' | 'otp' | 'forgot_password' | 'reset_password' | 'success';
type AuthMode = 'login' | 'register';

// دالة توحيد الأرقام: تحويل الأرقام العربية (٠١٢٣) إلى إنجليزية (0123)
const normalizeNumbers = (str: string) => {
  const arabicDigits = '٠١٢٣٤٥٦٧٨٩';
  return str.replace(/[٠-٩]/g, (d) => arabicDigits.indexOf(d).toString());
};

const LoginModal: React.FC<LoginModalProps> = ({ onClose, onSuccess }) => {
  const [view, setView] = useState<ModalView>('main');
  const [mode, setMode] = useState<AuthMode>('login');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '']);
  const [timer, setTimer] = useState(60);
  const [isLoading, setIsLoading] = useState(false);
  
  const otpRefs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];

  useEffect(() => {
    let interval: any;
    if (view === 'otp' && timer > 0) {
      interval = setInterval(() => setTimer(t => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [view, timer]);

  const handleInitialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const unifiedPhone = normalizeNumbers(phone);

    if (mode === 'login') {
      setTimeout(() => {
        setIsLoading(false);
        onSuccess(unifiedPhone, name || 'شركة الصقر العقارية');
      }, 1200);
    } else {
      setTimeout(() => {
        setIsLoading(false);
        setView('otp');
        setTimer(60);
      }, 1000);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    // توحيد الرقم المدخل في الـ OTP
    const normalizedValue = normalizeNumbers(value);
    const lastDigit = normalizedValue.length > 0 ? normalizedValue[normalizedValue.length - 1] : '';
    
    if (lastDigit && !/^\d$/.test(lastDigit)) return; // التأكد أنه رقم فقط

    const newOtp = [...otp];
    newOtp[index] = lastDigit;
    setOtp(newOtp);

    if (lastDigit && index < 3) {
      otpRefs[index + 1].current?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs[index - 1].current?.focus();
    }
  };

  const handleVerifyOtp = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      if (view === 'otp') {
        setView('success');
        setTimeout(() => onSuccess(normalizeNumbers(phone), name), 1500);
      }
    }, 1200);
  };

  const handleForgotPassword = () => {
    const unifiedPhone = normalizeNumbers(phone);
    if (unifiedPhone.length >= 8) {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        setView('otp');
        setTimer(60);
      }, 1000);
    } else {
      alert('يرجى إدخال رقم الهاتف أولاً');
    }
  };

  const isFormValid = mode === 'login' 
    ? (phone.length >= 8 && password.length >= 6)
    : (name.trim().length >= 2 && phone.length >= 8 && password.length >= 6);

  const isOtpComplete = otp.every(v => v !== '');

  const renderHeader = (title: string, subtitle: string) => (
    <div className="flex flex-col items-center mb-8">
      <div className="w-20 h-20 bg-brand-light rounded-3xl flex items-center justify-center mb-6 shadow-sm border border-slate-100 relative">
         <img 
           src="https://storage.googleapis.com/static.smart-re.com/logos/simsar_logo.png" 
           alt="لوجو" 
           className="h-14 w-auto"
           onError={(e) => { e.currentTarget.style.display = 'none'; }}
         />
         {isLoading && (
           <div className="absolute inset-0 bg-white/60 rounded-3xl flex items-center justify-center">
             <RefreshCw className="w-8 h-8 text-brand-orange animate-spin" />
           </div>
         )}
      </div>
      <h2 className="text-2xl font-black text-brand-navy">{title}</h2>
      <p className="text-slate-500 text-center mt-2 font-medium text-sm px-4">{subtitle}</p>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-brand-navy/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-[40px] p-8 relative shadow-2xl animate-in zoom-in-95 duration-300 font-tajawal overflow-hidden">
        
        {view !== 'main' && view !== 'success' && (
          <button 
            onClick={() => setView('main')}
            className="absolute top-6 left-6 p-2 hover:bg-slate-100 rounded-full transition-colors flex items-center gap-1 text-slate-400 font-bold text-xs"
          >
            <span>رجوع</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
        
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 hover:bg-slate-100 rounded-full transition-colors"
        >
          <X className="w-6 h-6 text-slate-400" />
        </button>

        {view === 'main' && (
          <>
            {renderHeader(
              mode === 'login' ? 'تسجيل الدخول' : 'التسجيل', 
              mode === 'login' ? 'مرحباً بعودتك! ادخل بياناتك للمتابعة' : 'أنشئ حساباً جديداً لتبدأ في عرض عقاراتك'
            )}
            
            <form onSubmit={handleInitialSubmit} className="space-y-4">
              {mode === 'register' && (
                <div className="relative group animate-in slide-in-from-top duration-300">
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-orange transition-colors">
                    <User className="w-4 h-4" />
                  </div>
                  <input 
                    type="text"
                    placeholder="الاسم"
                    className="w-full py-4 pr-11 pl-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-brand-orange/10 focus:border-brand-orange outline-none text-right font-bold text-lg text-brand-navy transition-all"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    autoFocus
                  />
                </div>
              )}

              <div className="flex gap-2">
                <div className="flex-1 relative group">
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-orange transition-colors">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input 
                    type="tel"
                    placeholder="رقم الهاتف"
                    className="w-full py-4 pr-11 pl-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-brand-orange/10 focus:border-brand-orange outline-none text-right font-bold text-lg text-brand-navy transition-all"
                    value={phone}
                    onChange={(e) => setPhone(normalizeNumbers(e.target.value).replace(/\D/g, ''))}
                  />
                </div>
                <div className="w-20 bg-brand-navy text-white rounded-2xl flex items-center justify-center font-black text-sm shadow-inner">
                  +965
                </div>
              </div>

              <div className="relative group">
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-orange transition-colors">
                  <Lock className="w-4 h-4" />
                </div>
                <input 
                  type={showPassword ? 'text' : 'password'}
                  placeholder="كلمة المرور"
                  className="w-full py-4 pr-11 pl-14 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-brand-orange/10 focus:border-brand-orange outline-none text-right font-bold text-lg text-brand-navy transition-all"
                  value={password}
                  onChange={(e) => setPassword(normalizeNumbers(e.target.value))}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-brand-navy transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {mode === 'login' && (
                <div className="text-left">
                  <button 
                    type="button" 
                    onClick={handleForgotPassword}
                    className="text-[11px] font-bold text-slate-400 hover:text-brand-orange transition-colors"
                  >
                    نسيت كلمة المرور؟
                  </button>
                </div>
              )}
              
              <button 
                type="submit"
                disabled={!isFormValid || isLoading}
                className="w-full bg-brand-navy text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-brand-navy/20 transition-all hover:bg-[#0f2038] disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] flex items-center justify-center gap-3 mt-4"
              >
                <span>{isLoading ? 'جاري التحميل...' : (mode === 'login' ? 'دخول' : 'تسجيل')}</span>
                {!isLoading && (mode === 'login' ? <LogIn className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />)}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-slate-100">
              <button 
                type="button"
                onClick={() => {
                  setMode(mode === 'login' ? 'register' : 'login');
                  setName('');
                }}
                className="w-full text-center text-brand-navy font-bold text-sm hover:text-brand-orange transition-all"
              >
                {mode === 'login' ? 'ليس لديك حساب؟ سجل الآن' : 'لديك حساب بالفعل؟ سجل دخولك'}
              </button>
            </div>
          </>
        )}

        {view === 'otp' && (
          <div className="animate-in slide-in-from-left duration-300">
            {renderHeader('رمز التحقق', `أدخل الرمز المرسل إلى الرقم ${phone}***`)}
            
            <div className="flex justify-center gap-3 mb-8" dir="ltr">
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  ref={otpRefs[idx]}
                  type="text"
                  inputMode="numeric"
                  className="w-14 h-16 text-center text-2xl font-black bg-slate-50 border-2 border-slate-200 rounded-2xl focus:border-brand-orange focus:ring-4 focus:ring-brand-orange/10 outline-none transition-all"
                  value={digit}
                  onChange={(e) => handleOtpChange(idx, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                  autoFocus={idx === 0}
                />
              ))}
            </div>

            <button 
              onClick={handleVerifyOtp}
              disabled={!isOtpComplete || isLoading}
              className="w-full bg-brand-orange text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-brand-orange/20 transition-all hover:bg-opacity-90 disabled:opacity-50 active:scale-[0.98] flex items-center justify-center gap-3"
            >
              <span>{isLoading ? 'جاري التحقق...' : 'تحقق الآن'}</span>
              <ShieldCheck className="w-6 h-6" />
            </button>

            <div className="mt-8 text-center">
              {timer > 0 ? (
                <p className="text-sm font-bold text-slate-400">
                  إعادة إرسال الرمز خلال <span className="text-brand-navy">{timer} ثانية</span>
                </p>
              ) : (
                <button 
                  onClick={() => { setTimer(60); setOtp(['','','','']); }}
                  className="text-brand-orange font-black text-sm flex items-center justify-center gap-2 mx-auto"
                >
                  <RefreshCw className="w-4 h-4" />
                  إعادة إرسال الرمز
                </button>
              )}
            </div>
          </div>
        )}

        {view === 'success' && (
          <div className="flex flex-col items-center justify-center py-12 animate-in zoom-in duration-500">
            <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mb-6">
              <CheckCircle2 className="w-16 h-16 text-emerald-500" />
            </div>
            <h2 className="text-2xl font-black text-brand-navy">تم بنجاح!</h2>
            <p className="text-slate-500 mt-2 font-bold">مرحباً بك يا {name || 'مستخدمنا الجديد'}</p>
          </div>
        )}

        {view === 'main' && (
          <div className="mt-8 p-4 bg-slate-50 rounded-2xl border border-slate-100">
             <p className="text-[10px] text-slate-400 text-center leading-relaxed">
              باستخدامك لتطبيق <span className="text-brand-navy font-bold">السمسار العقاري</span>، أنت توافق على شروط الاستخدام المعتمدة في دولة الكويت وسياسة خصوصية البيانات.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginModal;
