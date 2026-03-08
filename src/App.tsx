/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { 
  Wrench, 
  Zap, 
  Car, 
  Shield, 
  Cpu, 
  Phone, 
  MapPin, 
  Clock,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  X,
  Hammer,
  Menu,
  Instagram,
  MessageCircle,
  Star,
  HelpCircle,
  Tag,
  Camera,
  Send,
  Loader2,
  History,
  Search,
  FileText,
  Calendar,
  Settings,
  LogOut,
  LogIn,
  Trash2,
  PlusCircle,
  User,
  MessageSquare,
  AlertCircle,
  ArrowRight,
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { cn } from './lib/utils';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import * as d3 from 'd3';
import { 
  collection, 
  addDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  serverTimestamp,
  Timestamp,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  increment,
  where,
  getDocs,
  deleteDoc,
  limit 
} from 'firebase/firestore';
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  onAuthStateChanged, 
  signOut,
  User as FirebaseUser
} from 'firebase/auth';
import { auth, db } from './firebase';

// --- Error Handling ---
enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

const handleFirestoreError = (error: unknown, operationType: OperationType, path: string | null) => {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  // We don't throw here to avoid crashing the app, but we log it as required.
};

// --- Types ---
interface TestimonialData {
  id?: string;
  name: string;
  comment: string;
  rating: number;
  reply?: string;
  createdAt: Timestamp | any;
}
interface BookingFormData {
  carMake: string;
  carModel: string;
  carYear: string;
  serviceType: string;
  description: string;
  phone: string;
}

// --- Global Auth Guard ---
const ADMIN_CREDENTIALS = {
  username: 'DRFIX',
  password: 'ADMIN2468'
};

// --- Components ---

const LoginPage = ({ onLogin }: { onLogin: () => void }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
      onLogin();
      setError('');
      navigate('/admin');
    } else {
      setError('اسم المستخدم أو كلمة المرور غير صحيحة');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card p-8 w-full max-w-md border-brand-red/20 shadow-2xl"
      >
        <div className="text-center mb-8">
          <h2 className="text-2xl font-display font-black italic uppercase">دخول <span className="text-brand-red">المسؤول</span></h2>
          <p className="text-gray-400 text-sm mt-2">يرجى إدخال بيانات الاعتماد للوصول للوحة التحكم</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">اسم المستخدم</label>
            <input 
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-brand-red transition-all"
              placeholder="Username"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">كلمة المرور</label>
            <input 
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-brand-red transition-all"
              placeholder="Password"
              required
            />
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 bg-brand-red/10 border border-brand-red/20 rounded-lg text-brand-red text-sm text-center"
            >
              {error}
            </motion.div>
          )}

          <button 
            type="submit"
            className="w-full py-4 bg-brand-red rounded-xl font-display font-black italic uppercase tracking-widest hover:bg-red-700 transition-all shadow-lg shadow-brand-red/20"
          >
            تسجيل الدخول
          </button>
        </form>
      </motion.div>
    </div>
  );
};

interface AppSettings {
  logoUrl?: string;
  siteName?: string;
}

const Navbar = ({ settings }: { settings: AppSettings }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'الرئيسية', path: '/' },
    { name: 'الخدمات', path: '/services' },
    { name: 'العروض', path: '/offers' },
    { name: 'سجل الصيانة', path: '/history' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-brand-black/80 backdrop-blur-lg border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <div className="relative flex items-center justify-center">
            <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center border border-white/10 shadow-lg overflow-hidden">
              {settings.logoUrl ? (
                <img src={settings.logoUrl} alt="Logo" className="w-full h-full object-cover" referrerPolicy="no-referrer" loading="lazy" />
              ) : (
                <span className="text-brand-red font-display font-black text-lg italic tracking-tighter leading-none">
                  Dr.Fix
                </span>
              )}
            </div>
          </div>
        </Link>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8 text-sm font-bold uppercase tracking-widest">
          {navLinks.map((link) => (
            <Link 
              key={link.path} 
              to={link.path} 
              className={cn("transition-colors hover:text-brand-red", location.pathname === link.path ? "text-brand-red" : "text-white")}
            >
              {link.name}
            </Link>
          ))}
          <Link to="/booking" className="px-4 py-2 bg-brand-red rounded-full text-white font-display font-bold red-glow-hover transition-all">احجز موعداً</Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 text-white hover:text-brand-red transition-colors"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-brand-dark border-b border-white/5 overflow-hidden"
          >
            <div className="flex flex-col p-6 gap-6 text-lg font-bold">
              {navLinks.map((link) => (
                <Link 
                  key={link.path} 
                  to={link.path} 
                  onClick={() => setIsOpen(false)}
                  className={cn("transition-colors hover:text-brand-red", location.pathname === link.path ? "text-brand-red" : "text-white")}
                >
                  {link.name}
                </Link>
              ))}
              <Link to="/booking" onClick={() => setIsOpen(false)} className="bg-brand-red px-6 py-3 rounded-xl text-center font-display">احجز موعداً</Link>
              <Link 
                to="/admin"
                onClick={() => setIsOpen(false)}
                className="text-[10px] text-gray-700 uppercase tracking-widest mt-4 self-center"
              >
                Admin Access
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Hero = () => (
  <section className="relative min-h-screen flex items-center pt-24 md:pt-20 overflow-hidden">
    {/* Background Pattern */}
    <div className="absolute inset-0 z-0 opacity-10 md:opacity-20 pointer-events-none">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-brand-red/20 via-transparent to-transparent" />
      <div className="grid grid-cols-6 md:grid-cols-12 h-full w-full border-x border-white/5">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="border-r border-white/5 h-full" />
        ))}
      </div>
    </div>

    <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10 grid lg:grid-cols-2 gap-12 items-center">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center lg:text-right"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-red/10 border border-brand-red/20 text-brand-red text-xs sm:text-sm md:text-base font-bold mb-4 md:mb-6"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-brand-red animate-pulse" />
          تحت إشراف المهندس محمد سندي
        </motion.div>
        <h1 className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-display font-black leading-tight md:leading-[1.1] mb-4 md:mb-6 italic uppercase tracking-tighter">
          نصلح سيارتك <br />
          <span className="text-brand-red relative inline-block">
            في بيتك
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ delay: 1, duration: 0.8 }}
              className="absolute -bottom-2 left-0 h-2 bg-white/10 rounded-full"
            />
          </span>
        </h1>
        <p className="text-lg md:text-xl text-gray-400 mb-8 max-w-lg mx-auto lg:mx-0 leading-relaxed">
          مركز Dr. Fix في جدة: نستلم سيارتك من بيتك، نسوي الصيانة، نغسلها، ونسلمها لباب بيتك. خدمة احترافية على مدار 24 ساعة.
        </p>
        <div className="flex flex-col sm:flex-row flex-wrap gap-4 justify-center lg:justify-start">
          <Link to="/booking" className="px-8 py-4 bg-brand-red text-white font-display font-black rounded-xl red-glow-hover transition-all flex items-center justify-center gap-3 text-lg">
            احجز موعدك الآن
            <Car className="w-6 h-6" />
          </Link>
          <div className="flex gap-2">
            <a href="tel:0546870807" className="flex-1 px-6 py-4 border border-white/10 rounded-xl font-bold flex items-center justify-center gap-3 hover:bg-white/5 transition-all cursor-pointer" title="اتصال هاتفي">
              اتصل بنا
              <Phone className="w-5 h-5" />
            </a>
            <a href="https://wa.me/966546870807" target="_blank" rel="noopener noreferrer" className="px-6 py-4 bg-[#25D366] text-white rounded-xl font-bold flex items-center justify-center gap-3 hover:bg-[#128C7E] transition-all cursor-pointer shadow-lg shadow-green-500/20" title="واتساب">
              <MessageCircle className="w-5 h-5" />
            </a>
          </div>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, rotateY: 20, rotateX: 10, scale: 0.9 }}
        animate={{ 
          opacity: 1, 
          rotateY: 0, 
          rotateX: 0, 
          scale: 1,
          y: [0, -20, 0]
        }}
        transition={{ 
          duration: 1, 
          delay: 0.2,
          y: {
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }
        }}
        className="relative px-4 md:px-0"
        style={{ transformStyle: 'preserve-3d' }}
      >
        <div className="relative z-10 rounded-2xl md:rounded-3xl overflow-hidden border border-white/10 red-glow shadow-2xl">
          <img 
            src="https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&q=80&w=1000" 
            alt="Car Maintenance" 
            className="w-full h-[250px] sm:h-[350px] md:h-[500px] object-cover"
            referrerPolicy="no-referrer"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-transparent to-transparent" />
        </div>
        {/* Decorative elements with 3D depth */}
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-10 -right-10 w-40 h-40 border border-brand-red/20 rounded-full border-dashed"
        />
        <div className="absolute -top-5 -right-5 md:-top-10 md:-right-10 w-24 h-24 md:w-40 md:h-40 bg-brand-red/20 blur-3xl rounded-full" />
        <div className="absolute -bottom-5 -left-5 md:-bottom-10 md:-left-10 w-32 h-32 md:w-60 md:h-60 bg-brand-red/10 blur-3xl rounded-full" />
      </motion.div>
    </div>
  </section>
);

const ServiceCard = React.memo(({ icon: Icon, title, description, onClick }: { icon: any, title: string, description: string, onClick?: () => void }) => (
  <motion.div 
    whileHover={{ 
      y: -10,
      rotateX: 5,
      rotateY: -5,
      scale: 1.02
    }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className="glass-card p-6 md:p-8 group hover:border-brand-red/50 transition-all cursor-pointer relative overflow-hidden"
    style={{ transformStyle: 'preserve-3d' }}
  >
    <div className="absolute top-0 right-0 w-32 h-32 bg-brand-red/5 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-brand-red/10 transition-colors" />
    
    <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center mb-3 group-hover:bg-brand-red transition-colors relative z-10 shadow-lg">
      <Icon className="w-4 h-4 text-brand-red group-hover:text-white transition-colors" />
    </div>
    <h3 className="text-xl font-display font-bold mb-3 relative z-10">{title}</h3>
    <p className="text-gray-400 text-sm leading-relaxed relative z-10">{description}</p>
    
    <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity">
      <div className="w-8 h-8 rounded-full bg-brand-red/20 flex items-center justify-center">
        <ChevronDown className="w-4 h-4 text-brand-red -rotate-90" />
      </div>
    </div>
  </motion.div>
));

const STATIC_SERVICES = [
  { id: 's1', title: 'خدمة من الباب للباب', description: 'نستلم سيارتك من بيتك، نسوي الصيانة اللازمة، نغسلها، ونسلمها لك جاهزة.', icon: 'Car' },
  { id: 's2', title: 'ميكانيكا عامة', description: 'إصلاح المحركات، الجيربوكس، وأنظمة التعليق بأعلى معايير الجودة.', icon: 'Wrench' },
  { id: 's3', title: 'كهرباء وبرمجة', description: 'فحص كمبيوتر، برمجة مفاتيح، وإصلاح كافة المشاكل الكهربائية المعقدة.', icon: 'Zap' },
  { id: 's4', title: 'تكييف وتبريد', description: 'فحص تسريب الفريون، تعبئة فريون أصلي، وإصلاح الكمبروسر.', icon: 'Cpu' },
  { id: 's5', title: 'سمكرة وطلاء', description: 'إصلاح الصدمات وطلاء فرن حراري بأجود أنواع البويات العالمية.', icon: 'Hammer' },
  { id: 's6', title: 'فحص قبل الشراء', description: 'فحص شامل للسيارة (ميكانيكا، كهرباء، بودي) مع تقرير مفصل.', icon: 'Shield' },
];

const Services = ({ onServiceSelect }: { onServiceSelect: (type: string) => void }) => {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const q = query(collection(db, 'services'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const results: ServiceItem[] = [];
      snapshot.forEach((doc) => {
        results.push({ id: doc.id, ...doc.data() } as ServiceItem);
      });
      setServices(results);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'services');
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { clientWidth } = scrollRef.current;
      const scrollAmount = direction === 'left' ? -clientWidth / 2 : clientWidth / 2;
      
      scrollRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const getIcon = (iconName: string) => {
    const icons: Record<string, any> = {
      Car, Wrench, Zap, Cpu, Hammer, Shield, Star, Tool: Wrench
    };
    return icons[iconName] || Wrench;
  };

  const allServices = React.useMemo(() => {
    const merged = [...services];
    STATIC_SERVICES.forEach(staticS => {
      if (!services.some(s => s.title === staticS.title)) {
        merged.push(staticS as any);
      }
    });
    return merged;
  }, [services]);

  if (loading) return null;

  return (
    <section id="services" className="py-16 md:py-24 bg-brand-dark relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 md:mb-16 gap-4">
          <div className="text-center md:text-right">
            <h2 className="text-3xl md:text-5xl font-display font-black mb-4 italic uppercase">خدماتنا <span className="text-brand-red">الشاملة</span></h2>
            <div className="w-20 md:w-24 h-1.5 bg-brand-red mx-auto md:mx-0 rounded-full" />
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => scroll('right')}
              className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-brand-red hover:border-brand-red transition-all group"
            >
              <ChevronRight className="w-6 h-6 group-hover:scale-110 transition-transform" />
            </button>
            <button 
              onClick={() => scroll('left')}
              className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-brand-red hover:border-brand-red transition-all group"
            >
              <ChevronLeft className="w-6 h-6 group-hover:scale-110 transition-transform" />
            </button>
          </div>
        </div>

        <div 
          ref={scrollRef}
          className="flex overflow-x-auto pb-8 gap-6 md:gap-8 snap-x snap-mandatory no-scrollbar cursor-grab active:cursor-grabbing"
        >
          {allServices.map((service) => (
            <div key={service.id} className="min-w-[280px] md:min-w-[350px] snap-center">
              <ServiceCard 
                icon={getIcon(service.icon)} 
                title={service.title} 
                description={service.description}
                onClick={() => onServiceSelect(service.title)}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

interface Offer {
  id: string;
  title: string;
  price: string;
  subtitle?: string;
  features: string[];
  icon: 'tag' | 'zap';
  active?: boolean;
  createdAt: Timestamp;
}

const STATIC_OFFERS: Offer[] = [
  { id: 'o1', title: 'فحص شامل للسيارة', price: '199', subtitle: 'ريال فقط', features: ['فحص الميكانيكا', 'فحص الكهرباء', 'فحص البودي', 'تقرير مفصل'], icon: 'zap', createdAt: Timestamp.now(), active: true },
  { id: 'o2', title: 'تغيير زيت وفلتر', price: '250', subtitle: 'ريال شامل', features: ['زيت أصلي', 'فلتر وكالة', 'فحص السوائل', 'غسيل مجاني'], icon: 'tag', createdAt: Timestamp.now(), active: true },
];

const Offers = () => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'offers'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const results: Offer[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data() as Offer;
        if (data.active !== false) { // Default to active if not specified
          results.push({ id: doc.id, ...data } as Offer);
        }
      });
      setOffers(results);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'offers');
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const allOffers = React.useMemo(() => {
    const merged = [...offers];
    STATIC_OFFERS.forEach(staticOffer => {
      if (!offers.some(o => o.title === staticOffer.title)) {
        merged.push(staticOffer);
      }
    });
    return merged;
  }, [offers]);

  if (loading) return null;

  return (
    <section id="offers" className="py-24 bg-brand-black relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-display font-black mb-4 italic uppercase">عروض <span className="text-brand-red">خاصة</span></h2>
          <div className="w-20 md:w-24 h-1.5 bg-brand-red mx-auto rounded-full" />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {allOffers.map((offer) => (
            <motion.div 
              key={offer.id}
              whileHover={{ y: -10 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              className="glass-card p-8 border-brand-red/20 relative overflow-hidden group"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-brand-red" />
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 bg-brand-red/10 rounded-xl flex items-center justify-center">
                  {offer.icon === 'zap' ? <Zap className="w-6 h-6 text-brand-red" /> : <Tag className="w-6 h-6 text-brand-red" />}
                </div>
                <div className="text-left">
                  <span className="text-4xl font-display font-black text-brand-red">{offer.price}</span>
                  {offer.subtitle && <div className="text-[10px] text-brand-red font-bold uppercase mt-1">{offer.subtitle}</div>}
                </div>
              </div>
              <h3 className="text-2xl font-display font-black mb-4 italic">{offer.title}</h3>
              <ul className="space-y-3 text-gray-400 mb-8">
                {offer.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-brand-red" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link to="/booking" className="inline-flex items-center gap-2 text-brand-red font-bold group-hover:gap-4 transition-all">
                احجز هذا العرض الآن
                <ChevronDown className="w-4 h-4 -rotate-90" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const STATIC_GALLERY: GalleryItem[] = [
  { id: 'g1', title: 'صيانة محركات', imageUrl: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&q=80&w=1000', category: 'صيانة', createdAt: Timestamp.now() },
  { id: 'g2', title: 'فحص كمبيوتر', imageUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=1000', category: 'صيانة', createdAt: Timestamp.now() },
  { id: 'g3', title: 'تعديل بودي', imageUrl: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&q=80&w=1000', category: 'سمكرة', createdAt: Timestamp.now() },
  { id: 'g4', title: 'تلميع ساطع', imageUrl: 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?auto=format&fit=crop&q=80&w=1000', category: 'تلميع', createdAt: Timestamp.now() },
];

const Gallery = () => {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'gallery'), orderBy('createdAt', 'desc'), limit(8));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const results: GalleryItem[] = [];
      snapshot.forEach((doc) => {
        results.push({ id: doc.id, ...doc.data() } as GalleryItem);
      });
      setItems(results);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'gallery');
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const allItems = React.useMemo(() => {
    const merged = [...items];
    STATIC_GALLERY.forEach(staticItem => {
      if (!items.some(item => item.title === staticItem.title)) {
        merged.push(staticItem);
      }
    });
    return merged;
  }, [items]);

  if (loading) return null;

  return (
    <section id="gallery" className="py-24 bg-brand-dark">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-display font-black mb-4 italic uppercase">معرض <span className="text-brand-red">الأعمال</span></h2>
          <div className="w-20 md:w-24 h-1.5 bg-brand-red mx-auto rounded-full" />
          <p className="mt-6 text-gray-400">نفتخر بمشاركة بعض من أعمالنا الأخيرة معكم</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {allItems.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              viewport={{ once: true, margin: "-50px" }}
              className="group relative aspect-square rounded-2xl overflow-hidden border border-white/10"
            >
              <img 
                src={item.imageUrl} 
                alt={item.title} 
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6">
                <span className="text-brand-red text-xs font-bold uppercase tracking-widest mb-1">{item.category}</span>
                <h4 className="text-white font-bold">{item.title}</h4>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const BookingForm = ({ selectedService }: { selectedService?: string }) => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<BookingFormData>();

  React.useEffect(() => {
    if (selectedService) {
      setValue('serviceType', selectedService);
    }
  }, [selectedService, setValue]);

  const onSubmit = (data: BookingFormData) => {
    setIsLoading(true);

    const serviceLabels: Record<string, string> = {
      'home-service': 'خدمة من الباب للباب',
      'mechanic': 'ميكانيكا',
      'electric': 'كهرباء',
      'programming': 'برمجة',
      'bodywork': 'سمكرة وطلاء',
      'maintenance': 'صيانة دورية',
      'ac': 'تكييف',
      'brakes': 'فرامل ومساعدات',
      'inspection': 'فحص قبل الشراء',
      'tires': 'إطارات وميزان',
      'battery': 'بطاريات وتشغيل',
      'detailing': 'تلميع وحماية',
      'other': 'أخرى'
    };

    const messageText = `*طلب حجز جديد من Dr. Fix*\n\n` +
      `*ماركة السيارة:* ${data.carMake}\n` +
      `*موديل السيارة:* ${data.carModel}\n` +
      `*سنة الصنع:* ${data.carYear}\n` +
      `*نوع الخدمة:* ${serviceLabels[data.serviceType] || data.serviceType}\n` +
      `*وصف المشكلة:* ${data.description}\n` +
      `*رقم الجوال:* ${data.phone}`;

    // Create automatic maintenance record
    const createRecord = async () => {
      try {
        await addDoc(collection(db, 'maintenance'), {
          customerPhone: data.phone.trim(),
          carModel: `${data.carMake} ${data.carModel} ${data.carYear}`,
          serviceType: `حجز: ${serviceLabels[data.serviceType] || data.serviceType}`,
          notes: `طلب حجز تلقائي: ${data.description}`,
          cost: 0,
          serviceDate: serverTimestamp()
        });
        // Save phone to localStorage for auto-search in history
        localStorage.setItem('drfix_customer_phone', data.phone.trim());
      } catch (error) {
        console.error("Error creating auto record:", error);
      }
    };

    createRecord();

    // Simulate a loading process for the tire animation
    setTimeout(() => {
      setIsLoading(false);
      
      const whatsappUrl = `https://wa.me/966546870807?text=${encodeURIComponent(messageText)}`;
      window.open(whatsappUrl, '_blank');
      
      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        reset();
      }, 5000);
    }, 2000);
  };

  return (
    <section id="booking" className="py-16 md:py-24 relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 md:px-6 relative z-10">
        <motion.div 
          whileHover={{ rotateX: 2, rotateY: -2 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="glass-card p-6 md:p-12 border-brand-red/20 shadow-2xl"
          style={{ transformStyle: 'preserve-3d' }}
        >
          <div className="text-center mb-10 md:mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-black mb-4 italic">احجز <span className="text-brand-red">موعدك</span></h2>
            <p className="text-gray-400">أخبرنا عن مشكلة سيارتك وسنتواصل معك فوراً</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 md:space-y-8">
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              <div className="space-y-2">
                <label className="text-xs md:text-sm font-display font-bold text-gray-400 uppercase tracking-wider">ماركة السيارة</label>
                <input 
                  {...register('carMake', { required: true })}
                  placeholder="مثال: تويوتا"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-brand-red focus:outline-none transition-all text-sm md:text-base"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs md:text-sm font-display font-bold text-gray-400 uppercase tracking-wider">موديل السيارة</label>
                <input 
                  {...register('carModel', { required: true })}
                  placeholder="مثال: كامري"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-brand-red focus:outline-none transition-all text-sm md:text-base"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs md:text-sm font-display font-bold text-gray-400 uppercase tracking-wider">سنة الصنع</label>
                <input 
                  {...register('carYear', { required: true })}
                  placeholder="مثال: 2023"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-brand-red focus:outline-none transition-all text-sm md:text-base"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs md:text-sm font-display font-bold text-gray-400 uppercase tracking-wider">نوع الخدمة</label>
              <select 
                {...register('serviceType', { required: true })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-brand-red focus:outline-none transition-all appearance-none text-sm md:text-base"
              >
                <option value="" className="bg-brand-black">اختر الخدمة...</option>
                <option value="home-service" className="bg-brand-black">خدمة من الباب للباب</option>
                <option value="mechanic" className="bg-brand-black">ميكانيكا</option>
                <option value="electric" className="bg-brand-black">كهرباء</option>
                <option value="programming" className="bg-brand-black">برمجة</option>
                <option value="bodywork" className="bg-brand-black">سمكرة وطلاء</option>
                <option value="maintenance" className="bg-brand-black">صيانة دورية</option>
                <option value="ac" className="bg-brand-black">تكييف</option>
                <option value="brakes" className="bg-brand-black">فرامل ومساعدات</option>
                <option value="inspection" className="bg-brand-black">فحص قبل الشراء</option>
                <option value="tires" className="bg-brand-black">إطارات وميزان</option>
                <option value="battery" className="bg-brand-black">بطاريات وتشغيل</option>
                <option value="detailing" className="bg-brand-black">تلميع وحماية</option>
                <option value="other" className="bg-brand-black">أخرى</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs md:text-sm font-display font-bold text-gray-400 uppercase tracking-wider">وصف المشكلة</label>
              <textarea 
                {...register('description', { required: true })}
                rows={4}
                placeholder="اشرح لنا ما الذي تعاني منه السيارة..."
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-brand-red focus:outline-none transition-all resize-none text-sm md:text-base"
              />
            </div>

            <div className="p-4 rounded-xl bg-brand-red/5 border border-brand-red/20 flex items-start gap-3">
              <Camera className="w-5 h-5 text-brand-red shrink-0 mt-0.5" />
              <p className="text-xs md:text-sm text-gray-400 leading-relaxed">
                <strong className="text-brand-red block mb-1">ملاحظة:</strong>
                يمكنك إرسال الصور ومقاطع الفيديو التي توضح المشكلة مباشرة عبر الواتساب بعد الضغط على زر تأكيد الحجز.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-xs md:text-sm font-display font-bold text-gray-400 uppercase tracking-wider">رقم الجوال</label>
              <input 
                {...register('phone', { required: true })}
                type="tel"
                placeholder="05xxxxxxxx"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-brand-red focus:outline-none transition-all text-sm md:text-base"
              />
            </div>

            <button 
              type="submit"
              className="w-full py-4 bg-brand-red text-white font-display font-black rounded-xl red-glow-hover transition-all text-lg md:text-xl flex items-center justify-center gap-3"
            >
              تأكيد الحجز
              <CheckCircle2 className="w-5 h-5 md:w-6 md:h-6" />
            </button>
          </form>

          <AnimatePresence>
            {isLoading && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-brand-black/95 flex flex-col items-center justify-center text-center p-8 z-50 rounded-2xl"
              >
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-24 h-24 text-brand-red mb-6"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <circle cx="12" cy="12" r="3" />
                    <line x1="12" y1="2" x2="12" y2="22" />
                    <line x1="2" y1="12" x2="22" y2="12" />
                    <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
                    <line x1="4.93" y1="19.07" x2="19.07" y2="4.93" />
                  </svg>
                </motion.div>
                <h3 className="text-2xl font-black italic">جاري معالجة طلبك...</h3>
                <p className="text-gray-400 mt-2">لحظات ونفتح لك الواتساب</p>
              </motion.div>
            )}

            {isSubmitted && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="absolute inset-0 bg-brand-black/95 flex flex-col items-center justify-center text-center p-8 z-50 rounded-2xl"
              >
                <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(34,197,94,0.4)]">
                  <CheckCircle2 className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-3xl font-black mb-4 italic">تم استلام طلبك بنجاح!</h3>
                <p className="text-gray-400 text-lg">سيتواصل معك فريق Dr. Fix خلال أقل من ساعة لتأكيد الموعد.</p>
                <button 
                  onClick={() => setIsSubmitted(false)}
                  className="mt-8 text-brand-red font-bold hover:underline"
                >
                  إغلاق
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};

const TestimonialCard = React.memo(({ name, comment, rating, reply }: { name: string, comment: string, rating: number, reply?: string }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="glass-card p-6 border-white/5 hover:border-brand-red/30 transition-all shadow-xl h-full flex flex-col"
  >
    <div className="flex gap-1 mb-4">
      {[...Array(5)].map((_, i) => (
        <Star key={i} className={cn("w-4 h-4", i < rating ? "text-yellow-500 fill-yellow-500" : "text-gray-600")} />
      ))}
    </div>
    <p className="text-gray-300 italic mb-6 leading-relaxed flex-grow">"{comment}"</p>
    
    {reply && (
      <div className="mb-6 bg-brand-red/5 border-r-2 border-brand-red p-4 rounded-l-xl">
        <div className="text-[10px] font-bold text-brand-red uppercase tracking-widest mb-1">رد الإدارة</div>
        <p className="text-gray-400 text-sm italic">{reply}</p>
      </div>
    )}

    <div className="flex items-center gap-3">
      <div className="w-10 h-10 bg-brand-red/20 rounded-full flex items-center justify-center font-bold text-brand-red">
        {name[0]}
      </div>
      <span className="font-bold text-sm">{name}</span>
    </div>
  </motion.div>
));

const STATIC_TESTIMONIALS = [
  { name: "أحمد", comment: "خدمة ممتازة جداً، استلموا السيارة من البيت ورجعوها في نفس اليوم نظيفة ومصلحة. المهندس محمد قمة في الأخلاق والأمانة.", rating: 5 },
  { name: "فارس", comment: "عجبني إنه يغسل السيارة قبل لا يجيبها ههههههههههههههههه، صراحة خدمة فندقية مو بس صيانة! الله يبارك لكم.", rating: 5 },
  { name: "خالد", comment: "أفضل مركز صيانة تعاملت معه في جدة. دقة في المواعيد وشغل احترافي وسعر منافس جداً مقارنة بالوكالة.", rating: 5 },
  { name: "مرام", comment: "وفروا علي عناء الذهاب للورشة، الخدمة من الباب للباب مريحة جداً. شكراً دكتور فيكس على الاحترافية.", rating: 5 },
  { name: "سلطان", comment: "المهندس محمد سندي فنان، صلح لي مشكلة في الكهرباء عجزت عنها الوكالة وبسعر معقول جداً.", rating: 5 },
  { name: "خلود", comment: "أفضل شيء إنهم يجونك لين البيت، ما عاد أشيل هم الورش والزحمة. تعامل راقي جداً.", rating: 5 }
];

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState<TestimonialData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'testimonials'), orderBy('createdAt', 'desc'), limit(10));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as TestimonialData[];
      setTestimonials(data);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching testimonials:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const displayData = React.useMemo(() => [...testimonials, ...STATIC_TESTIMONIALS], [testimonials]);

  if (loading) return null;

  return (
    <section id="testimonials" className="py-24 bg-brand-dark relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-display font-black mb-4 italic uppercase">ماذا يقول <span className="text-brand-red">عملاؤنا؟</span></h2>
          <div className="w-20 md:w-24 h-1.5 bg-brand-red mx-auto rounded-full" />
        </div>

        <div className="flex overflow-x-auto pb-8 gap-6 md:gap-8 snap-x snap-mandatory no-scrollbar">
          <div className="flex gap-6 md:gap-8">
            {displayData.map((t, i) => (
              <div key={t.id || i} className="min-w-[280px] md:min-w-[350px] snap-center">
                <TestimonialCard 
                  name={t.name} 
                  comment={t.comment} 
                  rating={t.rating} 
                  reply={(t as any).reply}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 max-w-2xl mx-auto">
          <AddTestimonialForm />
        </div>
      </div>
    </section>
  );
};

const AddTestimonialForm = () => {
  const [rating, setRating] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<{ name: string, comment: string }>();

  const onSubmit = async (data: { name: string, comment: string }) => {
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'testimonials'), {
        name: data.name,
        comment: data.comment,
        rating: rating,
        createdAt: serverTimestamp()
      });
      setIsSuccess(true);
      reset();
      setRating(5);
      setTimeout(() => setIsSuccess(false), 3000);
    } catch (error) {
      console.error("Error adding testimonial:", error);
      alert("حدث خطأ أثناء إضافة التعليق. يرجى المحاولة مرة أخرى.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="glass-card p-8 border-brand-red/10">
      <h3 className="text-2xl font-display font-black mb-6 italic text-center">أضف <span className="text-brand-red">رأيك</span></h3>
      
      {isSuccess ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-8"
        >
          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-green-500" />
          </div>
          <p className="text-xl font-bold">شكراً لمشاركتنا رأيك!</p>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex justify-center gap-2 mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className="focus:outline-none transition-transform hover:scale-110"
              >
                <Star 
                  className={cn(
                    "w-8 h-8", 
                    star <= rating ? "text-yellow-500 fill-yellow-500" : "text-gray-600"
                  )} 
                />
              </button>
            ))}
          </div>

          <div className="space-y-2">
            <input 
              {...register('name', { required: true })}
              placeholder="اسمك"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-brand-red focus:outline-none transition-all"
            />
            {errors.name && <span className="text-brand-red text-xs">يرجى إدخال الاسم</span>}
          </div>

          <div className="space-y-2">
            <textarea 
              {...register('comment', { required: true })}
              rows={3}
              placeholder="اكتب تعليقك هنا..."
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-brand-red focus:outline-none transition-all resize-none"
            />
            {errors.comment && <span className="text-brand-red text-xs">يرجى إدخال التعليق</span>}
          </div>

          <button 
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-brand-red text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                إرسال التعليق
                <Send className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
};

interface MaintenanceRecord {
  id: string;
  customerPhone: string;
  carModel: string;
  serviceDate: Timestamp;
  serviceType: string;
  notes?: string;
  cost?: number;
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
}

interface GalleryItem {
  id: string;
  imageUrl: string;
  title: string;
  category: string;
  createdAt: Timestamp;
}

interface ServiceItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  price?: string;
  order?: number;
}

const AdminDashboard = ({ isAdmin, onLogout, settings }: { isAdmin: boolean, onLogout: () => void, settings: AppSettings }) => {
  const [records, setRecords] = useState<MaintenanceRecord[]>([]);
  const [testimonials, setTestimonials] = useState<TestimonialData[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [editingItem, setEditingItem] = useState<{ id: string, type: 'service' | 'offer' | 'gallery' | 'booking' } | null>(null);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'bookings' | 'content' | 'customers' | 'testimonials' | 'settings'>('dashboard');
  const [contentTab, setContentTab] = useState<'services' | 'offers' | 'gallery'>('services');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [searchPhone, setSearchPhone] = useState('');
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>(Notification.permission);

  // Form States
  const [formData, setFormData] = useState({
    customerPhone: '',
    carModel: '',
    serviceType: '',
    notes: '',
    cost: '',
    status: 'pending' as 'pending' | 'in-progress' | 'completed' | 'cancelled'
  });

  const [offerForm, setOfferForm] = useState({
    title: '',
    price: '',
    subtitle: '',
    features: '',
    icon: 'tag' as 'tag' | 'zap'
  });

  const [serviceForm, setServiceForm] = useState({
    title: '',
    description: '',
    icon: 'Wrench',
    price: ''
  });

  const [galleryForm, setGalleryForm] = useState({
    title: '',
    imageUrl: '',
    category: 'صيانة'
  });

  const [settingsForm, setSettingsForm] = useState({
    logoUrl: settings.logoUrl || '',
    siteName: settings.siteName || 'Dr.Fix'
  });

  useEffect(() => {
    setSettingsForm({
      logoUrl: settings.logoUrl || '',
      siteName: settings.siteName || 'Dr.Fix'
    });
  }, [settings]);

  useEffect(() => {
    if (isAdmin) {
      // Request notification permission
      if (Notification.permission === 'default') {
        Notification.requestPermission().then(permission => {
          setNotificationPermission(permission);
        });
      }

      // Maintenance
      const qM = query(collection(db, 'maintenance'), orderBy('serviceDate', 'desc'));
      let isInitialLoad = true;

      const unsubM = onSnapshot(qM, (snapshot) => {
        const results: MaintenanceRecord[] = [];
        snapshot.docChanges().forEach((change) => {
          if (change.type === "added" && !isInitialLoad) {
            const newBooking = change.doc.data() as MaintenanceRecord;
            if (Notification.permission === "granted") {
              new Notification("حجز جديد! 🚗", {
                body: `حجز جديد لسيارة ${newBooking.carModel} - ${newBooking.serviceType}`,
                icon: settings.logoUrl || "/favicon.ico"
              });
            }
          }
        });

        snapshot.forEach((doc) => {
          results.push({ id: doc.id, ...(doc.data() as any) } as MaintenanceRecord);
        });
        setRecords(results);
        isInitialLoad = false;
      }, (error) => handleFirestoreError(error, OperationType.LIST, 'maintenance'));

      // Testimonials
      const qT = query(collection(db, 'testimonials'), orderBy('createdAt', 'desc'));
      const unsubT = onSnapshot(qT, (snapshot) => {
        const results: TestimonialData[] = [];
        snapshot.forEach((doc) => {
          results.push({ id: doc.id, ...(doc.data() as any) } as TestimonialData);
        });
        setTestimonials(results);
      }, (error) => handleFirestoreError(error, OperationType.LIST, 'testimonials'));

      // Offers
      const qO = query(collection(db, 'offers'), orderBy('createdAt', 'desc'));
      const unsubO = onSnapshot(qO, (snapshot) => {
        const results: Offer[] = [];
        snapshot.forEach((doc) => {
          results.push({ id: doc.id, ...(doc.data() as any) } as Offer);
        });
        setOffers(results);
      }, (error) => handleFirestoreError(error, OperationType.LIST, 'offers'));

      // Services
      const qS = query(collection(db, 'services'));
      const unsubS = onSnapshot(qS, (snapshot) => {
        const results: ServiceItem[] = [];
        snapshot.forEach((doc) => {
          results.push({ id: doc.id, ...(doc.data() as any) } as ServiceItem);
        });
        setServices(results);
      }, (error) => handleFirestoreError(error, OperationType.LIST, 'services'));

      // Gallery
      const qG = query(collection(db, 'gallery'), orderBy('createdAt', 'desc'));
      const unsubG = onSnapshot(qG, (snapshot) => {
        const results: GalleryItem[] = [];
        snapshot.forEach((doc) => {
          results.push({ id: doc.id, ...(doc.data() as any) } as GalleryItem);
        });
        setGallery(results);
      }, (error) => handleFirestoreError(error, OperationType.LIST, 'gallery'));

      return () => {
        unsubM();
        unsubT();
        unsubO();
        unsubS();
        unsubG();
      };
    }
  }, [isAdmin]);

  const handleAddRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingItem && editingItem.type === 'booking') {
        await updateDoc(doc(db, 'maintenance', editingItem.id), {
          ...formData,
          cost: Number(formData.cost)
        });
      } else {
        await addDoc(collection(db, 'maintenance'), {
          ...formData,
          cost: Number(formData.cost),
          serviceDate: serverTimestamp(),
          status: 'pending'
        });
      }
      setFormData({ customerPhone: '', carModel: '', serviceType: '', notes: '', cost: '', status: 'pending' });
      setIsAdding(false);
      setEditingItem(null);
    } catch (error) {
      console.error("Error saving record:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = {
        ...offerForm,
        features: offerForm.features.split('\n').filter(f => f.trim()),
        updatedAt: serverTimestamp()
      };
      if (editingItem && editingItem.type === 'offer' && !editingItem.id.startsWith('static-')) {
        await updateDoc(doc(db, 'offers', editingItem.id), data);
      } else {
        await addDoc(collection(db, 'offers'), { ...data, active: true, createdAt: serverTimestamp() });
      }
      setOfferForm({ title: '', price: '', subtitle: '', features: '', icon: 'tag' });
      setIsAdding(false);
      setEditingItem(null);
    } catch (error) {
      console.error("Error saving offer:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'gallery' | 'settings') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      if (type === 'gallery') {
        setGalleryForm({ ...galleryForm, imageUrl: base64String });
      } else {
        setSettingsForm({ ...settingsForm, logoUrl: base64String });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingItem && editingItem.type === 'service') {
        await updateDoc(doc(db, 'services', editingItem.id), serviceForm);
      } else {
        await addDoc(collection(db, 'services'), serviceForm);
      }
      setServiceForm({ title: '', description: '', icon: 'Wrench', price: '' });
      setIsAdding(false);
      setEditingItem(null);
    } catch (error) {
      console.error("Error saving service:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddGallery = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = {
        ...galleryForm,
        updatedAt: serverTimestamp()
      };
      if (editingItem && editingItem.type === 'gallery' && !editingItem.id.startsWith('static-')) {
        await updateDoc(doc(db, 'gallery', editingItem.id), data);
      } else {
        await addDoc(collection(db, 'gallery'), { ...data, createdAt: serverTimestamp() });
      }
      setGalleryForm({ title: '', imageUrl: '', category: 'صيانة' });
      setIsAdding(false);
      setEditingItem(null);
    } catch (error) {
      console.error("Error saving gallery item:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (type: 'service' | 'offer' | 'gallery' | 'booking', item: any) => {
    setEditingItem({ id: item.id, type });
    if (type === 'service') {
      setServiceForm({
        title: item.title,
        description: item.description,
        icon: item.icon || 'Wrench',
        price: item.price || ''
      });
    } else if (type === 'offer') {
      setOfferForm({
        title: item.title,
        price: item.price,
        subtitle: item.subtitle,
        features: item.features.join('\n'),
        icon: item.icon
      });
    } else if (type === 'gallery') {
      setGalleryForm({
        title: item.title,
        imageUrl: item.imageUrl,
        category: item.category
      });
    } else if (type === 'booking') {
      setFormData({
        customerPhone: item.customerPhone,
        carModel: item.carModel,
        serviceType: item.serviceType,
        notes: item.notes || '',
        cost: item.cost?.toString() || '',
        status: item.status
      });
    }
    setIsAdding(true);
  };

  const handleToggleOfferStatus = async (id: string, currentStatus: boolean) => {
    try {
      await updateDoc(doc(db, 'offers', id), {
        active: !currentStatus
      });
    } catch (error) {
      console.error("Error toggling offer status:", error);
    }
  };

  const handleDelete = async (collectionName: string, id: string) => {
    if (window.confirm('هل أنت متأكد من الحذف؟')) {
      try {
        await deleteDoc(doc(db, collectionName, id));
      } catch (error) {
        console.error(`Error deleting from ${collectionName}:`, error);
      }
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: MaintenanceRecord['status']) => {
    try {
      await updateDoc(doc(db, 'maintenance', id), {
        status: newStatus
      });
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleReply = async (testimonialId: string) => {
    if (!replyText.trim()) return;
    setLoading(true);
    try {
      await updateDoc(doc(db, 'testimonials', testimonialId), {
        reply: replyText
      });
      setReplyingTo(null);
      setReplyText('');
    } catch (error) {
      console.error("Error replying to testimonial:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateDoc(doc(db, 'stats', 'global'), {
        logoUrl: settingsForm.logoUrl,
        siteName: settingsForm.siteName
      });
      alert('تم تحديث الإعدادات بنجاح');
    } catch (error) {
      console.error("Error updating settings:", error);
      handleFirestoreError(error, OperationType.UPDATE, 'stats/global');
    } finally {
      setLoading(false);
    }
  };

  const getChartData = () => {
    const last7Days = [...Array(7)].map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toLocaleDateString('ar-SA', { weekday: 'short' });
    }).reverse();

    const data = last7Days.map(day => {
      const count = records.filter(r => {
        const rDate = r.serviceDate?.toDate().toLocaleDateString('ar-SA', { weekday: 'short' });
        return rDate === day;
      }).length;
      return { name: day, bookings: count };
    });

    return data;
  };

  const getServiceStats = () => {
    const stats: Record<string, number> = {};
    records.forEach(r => {
      stats[r.serviceType] = (stats[r.serviceType] || 0) + 1;
    });
    return Object.entries(stats).map(([name, value]) => ({ name, value }));
  };

  const COLORS = ['#FF0000', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  if (!isAdmin) {
    return <Navigate to="/login" replace />;
  }

  return (
    <section id="admin" className="py-24 bg-brand-black border-t border-white/5 min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-wrap justify-between items-center gap-6 mb-12">
          <div>
            <h2 className="text-3xl font-display font-black italic mb-2">لوحة تحكم <span className="text-brand-red">المدير</span></h2>
            <div className="flex items-center gap-4 text-gray-500 text-sm">
              <span>إدارة المركز والخدمات</span>
              <span className="w-1 h-1 bg-gray-700 rounded-full" />
              <span>{records.length} حجز إجمالي</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => window.location.href = '/'}
              className="flex items-center gap-2 px-4 py-3 bg-white/5 border border-white/10 rounded-xl font-bold text-sm hover:bg-white/10 transition-all text-gray-300"
            >
              <ArrowRight className="w-4 h-4" />
              العودة للموقع
            </button>
            {notificationPermission !== 'granted' && (
              <button 
                onClick={() => {
                  Notification.requestPermission().then(setNotificationPermission);
                }}
                className="p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all text-yellow-500"
                title="تفعيل التنبيهات"
              >
                <AlertCircle className="w-5 h-5" />
              </button>
            )}
            <button 
              onClick={() => setIsAdding(true)}
              className="flex items-center gap-2 px-6 py-3 bg-brand-red rounded-xl font-bold italic hover:bg-red-700 transition-all shadow-lg shadow-brand-red/20"
            >
              <PlusCircle className="w-5 h-5" />
              إضافة جديد
            </button>
            <button 
              onClick={onLogout}
              className="p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all text-gray-400"
              title="تسجيل الخروج"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 bg-white/5 p-1 rounded-2xl border border-white/5">
          {[
            { id: 'dashboard', label: 'الإحصائيات', icon: BarChart },
            { id: 'bookings', label: 'الحجوزات', icon: Calendar },
            { id: 'content', label: 'المحتوى', icon: FileText },
            { id: 'customers', label: 'العملاء', icon: User },
            { id: 'testimonials', label: 'التعليقات', icon: MessageSquare },
            { id: 'settings', label: 'الإعدادات', icon: Settings },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all flex-1 md:flex-none justify-center",
                activeTab === tab.id 
                  ? "bg-brand-red text-white shadow-lg shadow-brand-red/20" 
                  : "text-gray-500 hover:text-white hover:bg-white/5"
              )}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && (
            <motion.div 
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Quick Actions */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <button onClick={() => setIsAdding(true)} className="p-4 glass-card border-brand-red/20 flex flex-col items-center justify-center gap-2 hover:bg-brand-red/5 transition-all group text-center">
                  <PlusCircle className="w-6 h-6 text-brand-red group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold italic">حجز جديد</span>
                </button>
                <button onClick={() => { setActiveTab('content'); setContentTab('offers'); }} className="p-4 glass-card border-white/5 flex flex-col items-center justify-center gap-2 hover:bg-white/5 transition-all group text-center">
                  <Tag className="w-6 h-6 text-brand-red group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold italic">إدارة العروض الخاصة</span>
                </button>
                <button onClick={() => { setActiveTab('content'); setContentTab('services'); }} className="p-4 glass-card border-white/5 flex flex-col items-center justify-center gap-2 hover:bg-white/5 transition-all group text-center">
                  <Wrench className="w-6 h-6 text-brand-red group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold italic">إدارة الخدمات</span>
                </button>
                <button onClick={() => { setActiveTab('content'); setContentTab('gallery'); }} className="p-4 glass-card border-white/5 flex flex-col items-center justify-center gap-2 hover:bg-white/5 transition-all group text-center">
                  <Camera className="w-6 h-6 text-brand-red group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold italic">إدارة المعرض</span>
                </button>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Stats Cards */}
              <div className="glass-card p-6 border-brand-red/20">
                <div className="text-gray-500 text-sm mb-2">إجمالي الحجوزات</div>
                <div className="text-4xl font-display font-black text-brand-red">{records.length}</div>
                <div className="mt-4 h-1 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-brand-red" style={{ width: '70%' }} />
                </div>
              </div>
              <div className="glass-card p-6 border-brand-red/20">
                <div className="text-gray-500 text-sm mb-2">إجمالي الإيرادات</div>
                <div className="text-4xl font-display font-black text-brand-red">
                  {records.reduce((acc, curr) => acc + (curr.cost || 0), 0).toLocaleString()} <span className="text-sm">ريال</span>
                </div>
                <div className="mt-4 h-1 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-brand-red" style={{ width: '85%' }} />
                </div>
              </div>
              <div className="glass-card p-6 border-brand-red/20">
                <div className="text-gray-500 text-sm mb-2">الطلبات النشطة</div>
                <div className="text-4xl font-display font-black text-brand-red">
                  {records.filter(r => r.status === 'in-progress' || r.status === 'pending').length}
                </div>
                <div className="mt-4 h-1 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-brand-red" style={{ width: '40%' }} />
                </div>
              </div>
              <div className="glass-card p-6 border-brand-red/20">
                <div className="text-gray-500 text-sm mb-2">التعليقات الجديدة</div>
                <div className="text-4xl font-display font-black text-brand-red">
                  {testimonials.filter(t => !t.reply).length}
                </div>
                <div className="mt-4 h-1 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-brand-red" style={{ width: '25%' }} />
                </div>
              </div>

              <div className="glass-card p-6 border-brand-red/20">
                <div className="text-gray-500 text-sm mb-2">إجمالي العروض</div>
                <div className="text-4xl font-display font-black text-brand-red">
                  {offers.length + STATIC_OFFERS.filter(so => !offers.some(o => o.title === so.title)).length}
                </div>
                <div className="mt-4 h-1 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-brand-red" style={{ width: '50%' }} />
                </div>
              </div>

              <div className="glass-card p-6 border-brand-red/20">
                <div className="text-gray-500 text-sm mb-2">صور المعرض</div>
                <div className="text-4xl font-display font-black text-brand-red">
                  {gallery.length + STATIC_GALLERY.filter(sg => !gallery.some(g => g.title === sg.title)).length}
                </div>
                <div className="mt-4 h-1 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-brand-red" style={{ width: '60%' }} />
                </div>
              </div>

              <div className="md:col-span-3 glass-card p-6 border-white/5">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold">آخر الحجوزات</h3>
                  <button 
                    onClick={() => setActiveTab('bookings')}
                    className="text-brand-red text-sm font-bold hover:underline"
                  >
                    عرض الكل
                  </button>
                </div>
                <div className="space-y-4">
                  {records.slice(0, 5).map((record) => (
                    <div key={record.id} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-brand-red/10 rounded-lg flex items-center justify-center text-brand-red">
                          <Car className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-bold text-sm">{record.carModel}</div>
                          <div className="text-xs text-gray-500">{record.serviceType}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold">{record.cost} ريال</div>
                        <div className={cn(
                          "text-[10px] font-bold px-2 py-0.5 rounded-full inline-block",
                          record.status === 'completed' ? "text-green-500 bg-green-500/10" :
                          record.status === 'in-progress' ? "text-blue-500 bg-blue-500/10" :
                          "text-yellow-500 bg-yellow-500/10"
                        )}>
                          {record.status === 'completed' ? 'مكتمل' : 
                           record.status === 'in-progress' ? 'قيد العمل' : 'قيد الانتظار'}
                        </div>
                      </div>
                    </div>
                  ))}
                  {records.length === 0 && (
                    <div className="text-center py-8 text-gray-500 text-sm italic">لا توجد حجوزات حالياً</div>
                  )}
                </div>
              </div>

              {/* Charts */}
              <div className="md:col-span-2 glass-card p-6 border-white/5">
                <h3 className="text-lg font-bold mb-6">حركة الحجوزات (آخر 7 أيام)</h3>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={getChartData()}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                      <XAxis dataKey="name" stroke="#666" />
                      <YAxis stroke="#666" />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#111', border: '1px solid #333' }}
                        itemStyle={{ color: '#FF0000' }}
                      />
                      <Line type="monotone" dataKey="bookings" stroke="#FF0000" strokeWidth={3} dot={{ fill: '#FF0000' }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="glass-card p-6 border-white/5">
                <h3 className="text-lg font-bold mb-6">الخدمات الأكثر طلباً</h3>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={getServiceStats()}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {getServiceStats().map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#111', border: '1px solid #333' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </motion.div>
        )}

          {activeTab === 'bookings' && (
            <motion.div 
              key="bookings"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass-card overflow-hidden border-white/5"
            >
              <div className="overflow-x-auto">
                <table className="w-full text-right">
                  <thead>
                    <tr className="bg-white/5 border-b border-white/10">
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-500">السيارة</th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-500">العميل</th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-500">الخدمة</th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-500">الحالة</th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-500">التكلفة</th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-500">إجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {records.map((record) => (
                      <tr key={record.id} className="hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-bold">{record.carModel}</div>
                          <div className="text-xs text-gray-500">{record.serviceDate?.toDate().toLocaleDateString('ar-SA')}</div>
                        </td>
                        <td className="px-6 py-4 text-sm">{record.customerPhone}</td>
                        <td className="px-6 py-4 text-sm">{record.serviceType}</td>
                        <td className="px-6 py-4">
                          <select 
                            value={record.status}
                            onChange={(e) => handleUpdateStatus(record.id, e.target.value as any)}
                            className={cn(
                              "text-xs font-bold px-3 py-1 rounded-full bg-black/50 border outline-none",
                              record.status === 'completed' ? "text-green-500 border-green-500/20" :
                              record.status === 'in-progress' ? "text-blue-500 border-blue-500/20" :
                              record.status === 'cancelled' ? "text-red-500 border-red-500/20" :
                              "text-yellow-500 border-yellow-500/20"
                            )}
                          >
                            <option value="pending">قيد الانتظار</option>
                            <option value="in-progress">قيد العمل</option>
                            <option value="completed">مكتمل</option>
                            <option value="cancelled">ملغي</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 font-bold text-brand-red">{record.cost} ريال</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => handleEdit('booking', record)}
                              className="p-2 text-gray-600 hover:text-white transition-colors"
                              title="تعديل"
                            >
                              <FileText className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleDelete('maintenance', record.id)}
                              className="p-2 text-gray-600 hover:text-brand-red transition-colors"
                              title="حذف"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {activeTab === 'content' && (
            <motion.div 
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-8"
            >
              {/* Content Sub-tabs */}
              <div className="flex gap-4 border-b border-white/5 pb-4">
                {[
                  { id: 'services', label: 'الخدمات' },
                  { id: 'offers', label: 'العروض الخاصة' },
                  { id: 'gallery', label: 'المعرض' },
                ].map((sub) => (
                  <button
                    key={sub.id}
                    onClick={() => setContentTab(sub.id as any)}
                    className={cn(
                      "px-4 py-2 rounded-lg text-sm font-bold transition-all",
                      contentTab === sub.id ? "bg-brand-red/10 text-brand-red border border-brand-red/20" : "text-gray-500 hover:text-white"
                    )}
                  >
                    {sub.label}
                  </button>
                ))}
              </div>

              {contentTab === 'services' && (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {services.length > 0 ? services.map((s) => (
                    <div key={s.id} className="glass-card p-6 border-white/5 group">
                      <div className="flex justify-between items-start mb-4">
                        <div className="w-10 h-10 bg-brand-red/10 rounded-lg flex items-center justify-center text-brand-red">
                          <Wrench className="w-5 h-5" />
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => handleEdit('service', s)} className="text-gray-600 hover:text-white transition-colors">
                            <FileText className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDelete('services', s.id)} className="text-gray-600 hover:text-brand-red transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <h4 className="font-bold mb-2">{s.title}</h4>
                      <p className="text-gray-500 text-xs line-clamp-2">{s.description}</p>
                    </div>
                  )) : (
                    <div className="md:col-span-2 lg:col-span-3 py-12 text-center glass-card border-dashed border-white/10">
                      <Wrench className="w-12 h-12 text-gray-700 mx-auto mb-4" />
                      <p className="text-gray-500 mb-6">لا توجد خدمات مضافة حالياً</p>
                      <button 
                        onClick={() => setIsAdding(true)}
                        className="px-6 py-2 bg-brand-red/10 text-brand-red border border-brand-red/20 rounded-lg font-bold text-sm hover:bg-brand-red hover:text-white transition-all"
                      >
                        إضافة أول خدمة
                      </button>
                    </div>
                  )}
                </div>
              )}

              {contentTab === 'offers' && (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...offers, ...STATIC_OFFERS.filter(so => !offers.some(o => o.title === so.title)).map(so => ({ ...so, id: 'static-' + so.id, isStatic: true }))].map((o) => (
                    <div key={o.id} className="glass-card p-6 border-white/5">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                          <div className="font-display font-black text-brand-red text-xl">{o.price}</div>
                          <button 
                            onClick={() => ! (o as any).isStatic && handleToggleOfferStatus(o.id, o.active !== false)}
                            disabled={(o as any).isStatic}
                            className={cn(
                              "text-[10px] px-2 py-1 rounded-full font-bold",
                              o.active !== false ? "bg-green-500/10 text-green-500 border border-green-500/20" : "bg-gray-500/10 text-gray-500 border border-gray-500/20",
                              (o as any).isStatic && "opacity-50 cursor-not-allowed"
                            )}
                          >
                            {o.active !== false ? 'نشط' : 'متوقف'}
                          </button>
                          {(o as any).isStatic && (
                            <span className="text-[10px] bg-brand-red/20 text-brand-red px-2 py-1 rounded-full font-bold">افتراضي</span>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => handleEdit('offer', o)} className="text-gray-600 hover:text-white transition-colors">
                            <FileText className="w-4 h-4" />
                          </button>
                          {! (o as any).isStatic && (
                            <button onClick={() => handleDelete('offers', o.id)} className="text-gray-600 hover:text-brand-red transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                      <h4 className="font-bold mb-2">{o.title}</h4>
                      <div className="text-xs text-gray-500">{o.features.length} مميزات</div>
                    </div>
                  ))}
                  {offers.length === 0 && STATIC_OFFERS.length === 0 && (
                    <div className="md:col-span-2 lg:col-span-3 py-12 text-center glass-card border-dashed border-white/10">
                      <Tag className="w-12 h-12 text-gray-700 mx-auto mb-4" />
                      <p className="text-gray-500 mb-6">لا توجد عروض مضافة حالياً</p>
                      <button 
                        onClick={() => setIsAdding(true)}
                        className="px-6 py-2 bg-brand-red/10 text-brand-red border border-brand-red/20 rounded-lg font-bold text-sm hover:bg-brand-red hover:text-white transition-all"
                      >
                        إضافة أول عرض
                      </button>
                    </div>
                  )}
                </div>
              )}

              {contentTab === 'gallery' && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[...gallery, ...STATIC_GALLERY.filter(sg => !gallery.some(g => g.title === sg.title)).map(sg => ({ ...sg, id: 'static-' + sg.id, isStatic: true }))].map((item) => (
                    <div key={item.id} className="relative group aspect-square rounded-xl overflow-hidden border border-white/10">
                      <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" loading="lazy" />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-4 text-center">
                        <div className="text-xs font-bold mb-2">{item.title}</div>
                        {(item as any).isStatic && (
                          <div className="text-[10px] bg-brand-red/20 text-brand-red px-2 py-0.5 rounded-full mb-2">افتراضي</div>
                        )}
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleEdit('gallery', item)}
                            className="p-2 bg-white/10 rounded-lg text-white hover:bg-white/20"
                          >
                            <FileText className="w-4 h-4" />
                          </button>
                          {! (item as any).isStatic && (
                            <button 
                              onClick={() => handleDelete('gallery', item.id)}
                              className="p-2 bg-brand-red rounded-lg text-white hover:bg-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  {gallery.length === 0 && STATIC_GALLERY.length === 0 && (
                    <div className="col-span-2 md:col-span-4 py-12 text-center glass-card border-dashed border-white/10">
                      <Camera className="w-12 h-12 text-gray-700 mx-auto mb-4" />
                      <p className="text-gray-500 mb-6">المعرض فارغ حالياً</p>
                      <button 
                        onClick={() => setIsAdding(true)}
                        className="px-6 py-2 bg-brand-red/10 text-brand-red border border-brand-red/20 rounded-lg font-bold text-sm hover:bg-brand-red hover:text-white transition-all"
                      >
                        إضافة أول صورة
                      </button>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'customers' && (
            <motion.div 
              key="customers"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-8"
            >
              <div className="glass-card p-8 border-white/5">
                <h3 className="text-xl font-bold mb-6">البحث عن سجل عميل</h3>
                <div className="flex gap-4">
                  <input 
                    type="tel"
                    value={searchPhone}
                    onChange={(e) => setSearchPhone(e.target.value)}
                    placeholder="أدخل رقم الجوال..."
                    className="flex-1 bg-black/50 border border-white/10 rounded-xl px-6 py-4 outline-none focus:border-brand-red transition-all"
                  />
                  <button 
                    className="px-8 bg-brand-red rounded-xl font-bold flex items-center gap-2"
                  >
                    <Search className="w-5 h-5" />
                    بحث
                  </button>
                </div>
              </div>

              {/* Customer History List */}
              <div className="space-y-4">
                <h4 className="font-bold text-gray-500">
                  {searchPhone.trim() ? `نتائج البحث (${records.filter(r => r.customerPhone.includes(searchPhone.trim())).length})` : `جميع السجلات (${records.length})`}
                </h4>
                {(searchPhone.trim() ? records.filter(r => r.customerPhone.includes(searchPhone.trim())) : records).map((record) => (
                  <div key={record.id} className="glass-card p-6 border-white/5 space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-bold text-lg">{record.carModel}</div>
                        <div className="text-sm text-gray-500">
                          {record.customerPhone} • {record.serviceDate?.toDate().toLocaleDateString('ar-SA')}
                        </div>
                      </div>
                      <div className="text-brand-red font-display font-black text-xl">{record.cost} ريال</div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="bg-white/5 p-3 rounded-lg">
                        <div className="text-gray-500 text-xs mb-1">الخدمة</div>
                        <div className="font-bold">{record.serviceType}</div>
                      </div>
                      <div className="bg-white/5 p-3 rounded-lg">
                        <div className="text-gray-500 text-xs mb-1">الحالة</div>
                        <div className={cn(
                          "font-bold",
                          record.status === 'completed' ? "text-green-500" : "text-yellow-500"
                        )}>
                          {record.status === 'completed' ? 'مكتمل' : 'قيد المعالجة'}
                        </div>
                      </div>
                    </div>
                    {record.notes && (
                      <div className="bg-white/5 p-3 rounded-lg">
                        <div className="text-gray-500 text-xs mb-1">ملاحظات الفني</div>
                        <p className="text-gray-400 italic text-xs">{record.notes}</p>
                      </div>
                    )}
                  </div>
                ))}
                {(searchPhone.trim() ? records.filter(r => r.customerPhone.includes(searchPhone.trim())) : records).length === 0 && (
                  <div className="text-center py-12 glass-card border-white/5 text-gray-500 italic">
                    لا توجد سجلات مطابقة
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'testimonials' && (
            <motion.div 
              key="testimonials"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              {[...testimonials, ...STATIC_TESTIMONIALS.map(st => ({ ...st, id: 'static-' + st.name, isStatic: true }))].map((t) => (
                <div key={t.id} className="glass-card p-6 border-white/5">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-brand-red/10 rounded-full flex items-center justify-center font-bold text-brand-red">
                        {t.name[0]}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold">{t.name}</span>
                          {t.isStatic && <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-gray-500">افتراضي</span>}
                        </div>
                        <div className="flex gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={cn("w-3 h-3", i < t.rating ? "fill-brand-red text-brand-red" : "text-gray-700")} />
                          ))}
                        </div>
                      </div>
                    </div>
                    {!t.isStatic && (
                      <button onClick={() => handleDelete('testimonials', t.id!)} className="text-gray-600 hover:text-brand-red">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <p className="text-gray-400 text-sm italic mb-4">"{t.comment}"</p>
                  
                  {!t.isStatic && (
                    <div className="mt-4">
                      {t.reply ? (
                        <div className="bg-white/5 p-4 rounded-xl border border-white/5 text-sm">
                          <div className="text-brand-red font-bold mb-1 text-xs">ردك:</div>
                          <p className="text-gray-500">{t.reply}</p>
                          <button 
                            onClick={() => {
                              setReplyingTo(t.id!);
                              setReplyText(t.reply || '');
                            }}
                            className="mt-2 text-xs text-gray-600 hover:text-white"
                          >
                            تعديل الرد
                          </button>
                        </div>
                      ) : (
                        <div className="flex flex-col gap-2">
                          {replyingTo === t.id ? (
                            <div className="flex gap-2">
                              <input 
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                className="flex-1 bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-brand-red"
                                placeholder="اكتب ردك..."
                              />
                              <button onClick={() => handleReply(t.id!)} className="px-4 bg-brand-red rounded-lg text-xs font-bold">إرسال</button>
                              <button onClick={() => setReplyingTo(null)} className="px-4 bg-white/5 rounded-lg text-xs">إلغاء</button>
                            </div>
                          ) : (
                            <button 
                              onClick={() => setReplyingTo(t.id!)}
                              className="text-xs text-brand-red font-bold hover:underline"
                            >
                              إضافة رد
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="glass-card p-8 border-white/5"
            >
              <h3 className="text-xl font-bold mb-8 flex items-center gap-2">
                <Settings className="w-5 h-5 text-brand-red" />
                إعدادات الموقع العامة
              </h3>

              <form onSubmit={handleUpdateSettings} className="max-w-2xl space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase">اسم الموقع</label>
                  <input 
                    type="text"
                    value={settingsForm.siteName}
                    onChange={e => setSettingsForm({...settingsForm, siteName: e.target.value})}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand-red"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase">رابط اللوجو (URL)</label>
                  <div className="flex flex-col gap-4">
                    <div className="flex gap-4">
                      <input 
                        type="url"
                        value={settingsForm.logoUrl}
                        onChange={e => setSettingsForm({...settingsForm, logoUrl: e.target.value})}
                        placeholder="https://example.com/logo.png"
                        className="flex-1 bg-black/50 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand-red"
                      />
                      {settingsForm.logoUrl && (
                        <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 overflow-hidden flex-shrink-0">
                          <img src={settingsForm.logoUrl} alt="Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" loading="lazy" />
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-px flex-1 bg-white/5" />
                      <span className="text-[10px] text-gray-600 uppercase font-bold">أو ارفع صورة</span>
                      <div className="h-px flex-1 bg-white/5" />
                    </div>
                    <input 
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, 'settings')}
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand-red file:bg-brand-red file:border-none file:rounded-lg file:text-white file:px-4 file:py-1 file:mr-4 file:cursor-pointer"
                    />
                  </div>
                  <p className="text-xs text-gray-500">يفضل استخدام صورة بخلفية شفافة (PNG) وبمقاس مربع.</p>
                </div>

                <button 
                  type="submit"
                  disabled={loading}
                  className="px-8 py-4 bg-brand-red rounded-xl font-bold italic hover:bg-red-700 transition-all disabled:opacity-50"
                >
                  {loading ? 'جاري الحفظ...' : 'حفظ التغييرات'}
                </button>
              </form>

              <div className="mt-12 pt-12 border-t border-white/5">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-brand-red" />
                  إدارة محتوى الموقع
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button 
                    onClick={() => { setActiveTab('content'); setContentTab('services'); }}
                    className="p-6 bg-white/5 border border-white/5 rounded-2xl hover:border-brand-red/50 transition-all text-right group"
                  >
                    <Wrench className="w-8 h-8 text-brand-red mb-4 group-hover:scale-110 transition-transform" />
                    <div className="font-bold mb-1">إدارة الخدمات</div>
                    <div className="text-xs text-gray-500">تعديل الخدمات التي تظهر للعملاء</div>
                  </button>
                  <button 
                    onClick={() => { setActiveTab('content'); setContentTab('offers'); }}
                    className="p-6 bg-white/5 border border-white/5 rounded-2xl hover:border-brand-red/50 transition-all text-right group"
                  >
                    <Tag className="w-8 h-8 text-brand-red mb-4 group-hover:scale-110 transition-transform" />
                    <div className="font-bold mb-1">إدارة العروض الخاصة</div>
                    <div className="text-xs text-gray-500">تعديل العروض الخاصة والخصومات</div>
                  </button>
                  <button 
                    onClick={() => { setActiveTab('content'); setContentTab('gallery'); }}
                    className="p-6 bg-white/5 border border-white/5 rounded-2xl hover:border-brand-red/50 transition-all text-right group"
                  >
                    <Camera className="w-8 h-8 text-brand-red mb-4 group-hover:scale-110 transition-transform" />
                    <div className="font-bold mb-1">إدارة المعرض</div>
                    <div className="text-xs text-gray-500">رفع صور جديدة لأعمال المركز</div>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Add New Modal */}
        <AnimatePresence>
          {isAdding && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsAdding(false)}
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              />
              <motion.div 
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="relative w-full max-w-2xl bg-brand-dark border border-white/10 rounded-3xl p-8 shadow-2xl overflow-y-auto max-h-[90vh]"
              >
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-2xl font-display font-black italic">
                    {editingItem ? 'تعديل' : 'إضافة'} {activeTab === 'maintenance' || activeTab === 'bookings' ? 'سجل' : 
                          activeTab === 'content' ? (contentTab === 'services' ? 'خدمة' : contentTab === 'offers' ? 'عرض' : 'صورة') : 'جديد'}
                  </h3>
                  <button onClick={() => { setIsAdding(false); setEditingItem(null); }} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {(activeTab === 'maintenance' || activeTab === 'bookings') && (
                  <form onSubmit={handleAddRecord} className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase">رقم الجوال</label>
                      <input 
                        required
                        value={formData.customerPhone}
                        onChange={e => setFormData({...formData, customerPhone: e.target.value})}
                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand-red"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase">السيارة</label>
                      <input 
                        required
                        value={formData.carModel}
                        onChange={e => setFormData({...formData, carModel: e.target.value})}
                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand-red"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase">نوع الخدمة</label>
                      <input 
                        required
                        value={formData.serviceType}
                        onChange={e => setFormData({...formData, serviceType: e.target.value})}
                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand-red"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase">التكلفة</label>
                      <input 
                        type="number"
                        value={formData.cost}
                        onChange={e => setFormData({...formData, cost: e.target.value})}
                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand-red"
                      />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase">ملاحظات</label>
                      <textarea 
                        value={formData.notes}
                        onChange={e => setFormData({...formData, notes: e.target.value})}
                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand-red h-24"
                      />
                    </div>
                    <button className="md:col-span-2 py-4 bg-brand-red rounded-xl font-bold italic">
                      {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : (editingItem ? 'تحديث السجل' : 'حفظ السجل')}
                    </button>
                  </form>
                )}

                {activeTab === 'content' && contentTab === 'services' && (
                  <form onSubmit={handleAddService} className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase">اسم الخدمة</label>
                      <input 
                        required
                        value={serviceForm.title}
                        onChange={e => setServiceForm({...serviceForm, title: e.target.value})}
                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand-red"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase">الوصف</label>
                      <textarea 
                        required
                        value={serviceForm.description}
                        onChange={e => setServiceForm({...serviceForm, description: e.target.value})}
                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand-red h-24"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase">السعر (اختياري)</label>
                      <input 
                        value={serviceForm.price}
                        onChange={e => setServiceForm({...serviceForm, price: e.target.value})}
                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand-red"
                      />
                    </div>
                    <button className="w-full py-4 bg-brand-red rounded-xl font-bold italic">
                      {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : (editingItem ? 'تحديث الخدمة' : 'إضافة الخدمة')}
                    </button>
                  </form>
                )}

                {activeTab === 'content' && contentTab === 'offers' && (
                  <form onSubmit={handleAddOffer} className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase">عنوان العرض</label>
                      <input 
                        required
                        value={offerForm.title}
                        onChange={e => setOfferForm({...offerForm, title: e.target.value})}
                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand-red"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase">السعر</label>
                      <input 
                        required
                        value={offerForm.price}
                        onChange={e => setOfferForm({...offerForm, price: e.target.value})}
                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand-red"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase">المميزات (كل سطر ميزة)</label>
                      <textarea 
                        required
                        value={offerForm.features}
                        onChange={e => setOfferForm({...offerForm, features: e.target.value})}
                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand-red h-32"
                      />
                    </div>
                    <button className="w-full py-4 bg-brand-red rounded-xl font-bold italic">إضافة العرض</button>
                  </form>
                )}

                {activeTab === 'content' && contentTab === 'gallery' && (
                  <form onSubmit={handleAddGallery} className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase">عنوان الصورة</label>
                      <input 
                        required
                        value={galleryForm.title}
                        onChange={e => setGalleryForm({...galleryForm, title: e.target.value})}
                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand-red"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase">رفع الصورة</label>
                      <div className="flex flex-col gap-4">
                        <input 
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, 'gallery')}
                          className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand-red file:bg-brand-red file:border-none file:rounded-lg file:text-white file:px-4 file:py-1 file:mr-4 file:cursor-pointer"
                        />
                        {galleryForm.imageUrl && (
                          <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-white/10">
                            <img src={galleryForm.imageUrl} alt="Preview" className="w-full h-full object-cover" loading="lazy" />
                            <button 
                              type="button"
                              onClick={() => setGalleryForm({ ...galleryForm, imageUrl: '' })}
                              className="absolute top-2 right-2 p-2 bg-black/60 rounded-full text-white hover:bg-brand-red transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <div className="h-px flex-1 bg-white/5" />
                          <span className="text-[10px] text-gray-600 uppercase font-bold">أو استخدم رابط</span>
                          <div className="h-px flex-1 bg-white/5" />
                        </div>
                        <input 
                          placeholder="https://example.com/image.jpg"
                          value={galleryForm.imageUrl}
                          onChange={e => setGalleryForm({...galleryForm, imageUrl: e.target.value})}
                          className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand-red text-sm"
                        />
                      </div>
                    </div>
                    <button 
                      type="submit" 
                      disabled={loading || !galleryForm.imageUrl}
                      className="w-full py-4 bg-brand-red rounded-xl font-bold italic disabled:opacity-50"
                    >
                      {loading ? 'جاري الحفظ...' : (editingItem ? 'تحديث الصورة' : 'إضافة للمعرض')}
                    </button>
                  </form>
                )}
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

const MaintenanceHistory = () => {
  const [phone, setPhone] = useState('');
  const [records, setRecords] = useState<MaintenanceRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    const savedPhone = localStorage.getItem('drfix_customer_phone');
    if (savedPhone) {
      setPhone(savedPhone);
      performSearch(savedPhone);
    }
  }, []);

  const performSearch = async (phoneNumber: string) => {
    if (!phoneNumber.trim()) return;

    setLoading(true);
    setHasSearched(true);
    try {
      // Try with orderBy first, if it fails (likely missing index), fallback to simple query
      let q;
      try {
        q = query(
          collection(db, 'maintenance'),
          where('customerPhone', '==', phoneNumber.trim()),
          orderBy('serviceDate', 'desc')
        );
        const querySnapshot = await getDocs(q);
        const results: MaintenanceRecord[] = [];
        querySnapshot.forEach((doc) => {
          results.push({ id: doc.id, ...(doc.data() as any) } as MaintenanceRecord);
        });
        setRecords(results);
      } catch (indexError) {
        console.warn("Composite index might be missing, falling back to simple query:", indexError);
        q = query(
          collection(db, 'maintenance'),
          where('customerPhone', '==', phoneNumber.trim())
        );
        const querySnapshot = await getDocs(q);
        const results: MaintenanceRecord[] = [];
        querySnapshot.forEach((doc) => {
          results.push({ id: doc.id, ...(doc.data() as any) } as MaintenanceRecord);
        });
        // Sort manually if index is missing
        results.sort((a, b) => {
          const dateA = a.serviceDate?.toMillis?.() || 0;
          const dateB = b.serviceDate?.toMillis?.() || 0;
          return dateB - dateA;
        });
        setRecords(results);
      }
    } catch (error) {
      console.error("Error fetching maintenance records:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(phone);
  };

  return (
    <section id="history" className="py-24 bg-black relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <motion.div 
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-red/10 border border-brand-red/20 text-brand-red text-xs font-bold uppercase tracking-widest mb-6"
          >
            <History className="w-3 h-3" />
            سجل الصيانة
          </motion.div>
          <h2 className="text-4xl md:text-6xl font-display font-black mb-6 italic tracking-tighter">
            تابع <span className="text-brand-red">تاريخ صيانة</span> سيارتك
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            أدخل رقم جوالك المسجل لدينا لاستعراض كافة عمليات الصيانة السابقة التي تمت لسيارتك في مركزنا.
          </p>
        </div>

        <div className="glass-card p-8 md:p-12 border-white/5 shadow-2xl relative overflow-hidden">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 mb-12">
            <div className="flex-1 relative">
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input 
                type="tel" 
                placeholder="أدخل رقم الجوال (مثال: 05XXXXXXXX)"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded-xl py-4 pr-12 pl-4 text-white focus:border-brand-red outline-none transition-all font-mono"
                required
              />
            </div>
            <button 
              type="submit"
              disabled={loading}
              className="bg-brand-red hover:bg-red-700 text-white font-display font-black italic px-8 py-4 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? 'جاري البحث...' : 'استعراض السجل'}
            </button>
          </form>

          {loading ? (
            <div className="flex flex-col items-center py-12">
              <div className="w-12 h-12 border-4 border-brand-red border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-gray-500">جاري استرجاع البيانات...</p>
            </div>
          ) : hasSearched ? (
            records.length > 0 ? (
              <div className="space-y-6">
                {records.map((record) => (
                  <motion.div 
                    key={record.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-brand-red/30 transition-all"
                  >
                    <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                      <div>
                        <div className="flex items-center gap-2 text-brand-red font-display font-black italic text-xl mb-1">
                          <Wrench className="w-5 h-5" />
                          {record.serviceType}
                        </div>
                        <div className="text-gray-400 flex items-center gap-2 text-sm">
                          <Calendar className="w-4 h-4" />
                          {record.serviceDate.toDate().toLocaleDateString('ar-SA', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </div>
                      </div>
                      <div className="px-4 py-2 bg-brand-red/10 rounded-lg border border-brand-red/20 text-brand-red font-bold">
                        {record.carModel}
                      </div>
                    </div>
                    {record.notes && (
                      <div className="text-gray-500 text-sm leading-relaxed bg-black/30 p-4 rounded-xl border border-white/5">
                        <FileText className="w-4 h-4 inline-block ml-2 text-gray-600" />
                        {record.notes}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white/5 rounded-2xl border border-dashed border-white/10">
                <p className="text-gray-500 mb-2">لم يتم العثور على سجلات لهذا الرقم.</p>
                <p className="text-xs text-gray-600">تأكد من إدخال الرقم الصحيح المسجل في فاتورة الصيانة.</p>
              </div>
            )
          ) : (
            <div className="text-center py-12">
              <History className="w-16 h-16 text-white/5 mx-auto mb-4" />
              <p className="text-gray-600">أدخل رقم جوالك لرؤية سجل صيانة سيارتك</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

const FAQItem = ({ question, answer }: { question: string, answer: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-white/5">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-6 flex justify-between items-center text-right hover:text-brand-red transition-colors"
      >
        <span className="text-lg font-bold">{question}</span>
        <ChevronDown className={cn("w-5 h-5 transition-transform", isOpen && "rotate-180")} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <p className="pb-6 text-gray-400 leading-relaxed">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const FAQ = () => (
  <section id="faq" className="py-24 bg-brand-black">
    <div className="max-w-3xl mx-auto px-4 md:px-6">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-5xl font-display font-black mb-4 italic uppercase">الأسئلة <span className="text-brand-red">الشائعة</span></h2>
        <div className="w-20 md:w-24 h-1.5 bg-brand-red mx-auto rounded-full" />
      </div>

      <div className="space-y-2">
        <FAQItem 
          question="هل توفرون قطع الغيار أم يشتريها العميل؟" 
          answer="نعم، نحن نوفر قطع الغيار الأصلية أو المعتمدة (حسب رغبة العميل) مع ضمان على القطع والتركيب، كما يمكن للعميل توفير القطع بنفسه إذا رغب في ذلك." 
        />
        <FAQItem 
          question="هل الخدمة متوفرة في كافة أحياء جدة؟" 
          answer="نعم، نغطي كافة أحياء مدينة جدة، ونصل إليك أينما كنت لاستلام السيارة أو صيانتها." 
        />
        <FAQItem 
          question="كم تستغرق عملية الصيانة عادةً؟" 
          answer="يعتمد ذلك على نوع العطل، ولكن أغلب الصيانات الدورية والأعطال البسيطة يتم إنجازها وتسليم السيارة في نفس اليوم." 
        />
      </div>
    </div>
  </section>
);

const Footer = React.memo(({ settings }: { settings: AppSettings }) => {
  const [visitors, setVisitors] = useState<number | null>(null);

  useEffect(() => {
    const updateVisitors = async () => {
      const statsRef = doc(db, 'stats', 'global');
      
      try {
        const statsDoc = await getDoc(statsRef);
        
        if (!statsDoc.exists()) {
          // Create initial doc
          await setDoc(statsRef, { visitorCount: 1 });
          setVisitors(1);
        } else {
          // Check if already counted in this session
          const hasVisited = sessionStorage.getItem('hasVisited');
          if (!hasVisited) {
            await updateDoc(statsRef, {
              visitorCount: increment(1)
            });
            sessionStorage.setItem('hasVisited', 'true');
          }
        }
        
        // Listen for real-time updates
        const unsubscribe = onSnapshot(statsRef, (doc) => {
          if (doc.exists()) {
            setVisitors(doc.data().visitorCount);
          }
        }, (error) => handleFirestoreError(error, OperationType.GET, 'stats/global'));
        
        return unsubscribe;
      } catch (error) {
        console.error("Error updating visitor count:", error);
        return () => {};
      }
    };

    let unsub: () => void;
    updateVisitors().then(u => unsub = u);
    
    return () => {
      if (unsub) unsub();
    };
  }, []);

  return (
    <footer className="bg-brand-black border-t border-white/5 py-12">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-12 text-right" dir="rtl">
        <div className="col-span-2">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center border border-white/10 shadow-xl overflow-hidden">
              {settings.logoUrl ? (
                <img src={settings.logoUrl} alt="Logo" className="w-full h-full object-cover" referrerPolicy="no-referrer" loading="lazy" />
              ) : (
                <span className="text-brand-red font-display font-black text-xl italic tracking-tighter leading-none">
                  Dr.Fix
                </span>
              )}
            </div>
          </div>
          <p className="text-gray-500 max-w-sm leading-relaxed">
            مركز الصيانة الأفضل في المنطقة. خبرة تمتد لسنوات في التعامل مع كافة أنواع السيارات والمشاكل التقنية والميكانيكية تحت إشراف المهندس محمد سندي.
          </p>
          
          {visitors !== null && (
            <div className="mt-8 flex items-center gap-2 text-gray-500 text-sm">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span>عدد الزيارات: {visitors.toLocaleString()}</span>
            </div>
          )}
        </div>
        
        <div>
          <h4 className="font-display font-black mb-6 uppercase tracking-widest text-sm text-brand-red">روابط سريعة</h4>
          <ul className="space-y-4 text-gray-500 font-bold">
            <li><Link to="/" className="hover:text-brand-red transition-colors">الرئيسية</Link></li>
            <li><Link to="/services" className="hover:text-brand-red transition-colors">الخدمات</Link></li>
            <li><Link to="/offers" className="hover:text-brand-red transition-colors">العروض</Link></li>
            <li><Link to="/booking" className="hover:text-brand-red transition-colors">احجز موعداً</Link></li>
          </ul>
        </div>

        <div>
        <h4 className="font-display font-black mb-6 uppercase tracking-widest text-sm text-brand-red">تواصل معنا</h4>
        <ul className="space-y-4 text-gray-500 font-bold">
          <li className="flex items-center gap-3">
            <Phone className="w-4 h-4 text-brand-red" />
            <a href="tel:0546870807" className="hover:text-brand-red transition-colors">0546870807</a>
          </li>
          <li className="flex items-center gap-3">
            <MessageCircle className="w-4 h-4 text-[#25D366]" />
            <a href="https://wa.me/966546870807" target="_blank" rel="noopener noreferrer" className="hover:text-[#25D366] transition-colors">واتساب</a>
          </li>
          <li className="flex items-center gap-3">
            <MapPin className="w-4 h-4 text-brand-red" />
            جدة، المملكة العربية السعودية
          </li>
          <li className="flex items-center gap-3">
            <Clock className="w-4 h-4 text-brand-red" />
            متاح 24 ساعة طوال الأسبوع
          </li>
        </ul>
      </div>

      <div>
        <h4 className="font-display font-black mb-6 uppercase tracking-widest text-sm text-brand-red">تابعنا</h4>
        <div className="flex gap-4">
          <motion.a 
            whileHover={{ y: -5, scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            href="https://www.snapchat.com/add/drfix.6556" 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center hover:bg-[#FFFC00] hover:text-black transition-all border border-white/10"
            title="Snapchat"
          >
            <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2.75c-3.15 0-5.75 2.35-5.75 5.25 0 .35.03.7.1 1.03-.05.02-.1.04-.15.07-.45.25-.7.75-.7 1.3 0 .4.15.75.4 1 .05.05.1.1.15.15-.05.15-.1.3-.1.45 0 .85.7 1.55 1.55 1.55.15 0 .3-.02.45-.07.05.1.1.2.15.3.4.8 1.2 1.3 2.1 1.3.1 0 .2 0 .3-.02.1.35.4.62.8.62s.7-.27.8-.62c.1.02.2.02.3.02.9 0 1.7-.5 2.1-1.3.05-.1.1-.2.15-.3.15.05.3.07.45.07.85 0 1.55-.7 1.55-1.55 0-.15-.05-.3-.1-.45.05-.05.1-.1.15-.15.25-.25.4-.6.4-1 0-.55-.25-1.05-.7-1.3-.05-.03-.1-.05-.15-.07.07-.33.1-.68.1-1.03 0-2.9-2.6-5.25-5.75-5.25zM12 19c-3.5 0-6.5-1.5-8.5-4 0-1.5 1.5-2.5 3-2.5.5 0 1 .1 1.5.3.5-.8 1.5-1.3 2.5-1.3.1 0 .2 0 .3.02.1-.35.4-.62.8-.62s.7.27.8.62c.1-.02.2-.02.3-.02 1 0 2 .5 2.5 1.3.5-.2 1-.3 1.5-.3 1.5 0 3 1 3 2.5-2 2.5-5 4-8.5 4z"/>
            </svg>
          </motion.a>
          <motion.a 
            whileHover={{ y: -5, scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            href="https://www.instagram.com/dr.fix1" 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center hover:bg-gradient-to-tr hover:from-[#f09433] hover:via-[#dc2743] hover:to-[#bc1888] hover:text-white transition-all border border-white/10"
            title="Instagram"
          >
            <Instagram className="w-6 h-6" />
          </motion.a>
        </div>
      </div>
    </div>
    <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-gray-600 text-sm font-mono">
      <div>&copy; {new Date().getFullYear()} DR. FIX AUTO SERVICES. ALL RIGHTS RESERVED.</div>
      <Link 
        to="/admin"
        className="text-[10px] md:text-xs opacity-40 hover:opacity-100 transition-opacity uppercase tracking-widest py-2 px-4 border border-white/5 rounded-lg"
      >
        Admin Portal
      </Link>
    </div>
  </footer>
  );
});

const ProcessStep = React.memo(({ number, title, description }: { number: string, title: string, description: string }) => (
  <motion.div 
    whileHover={{ scale: 1.05, rotateZ: 1 }}
    className="relative p-8 glass-card border-white/5 hover:border-brand-red/30 transition-all group shadow-xl"
    style={{ transformStyle: 'preserve-3d' }}
  >
    <motion.div 
      initial={{ scale: 0.8 }}
      whileInView={{ scale: 1 }}
      className="absolute -top-6 -right-6 w-12 h-12 bg-brand-red rounded-full flex items-center justify-center text-xl font-display font-black italic shadow-lg z-10"
    >
      {number}
    </motion.div>
    <h3 className="text-xl font-display font-bold mb-3 mt-2">{title}</h3>
    <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
    
    {/* 3D Depth effect */}
    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl md:rounded-3xl" />
  </motion.div>
));

const Process = () => (
  <section id="process" className="py-24 bg-brand-black relative overflow-hidden">
    <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-5xl font-display font-black mb-4 italic uppercase">كيف <span className="text-brand-red">نعمل؟</span></h2>
        <p className="text-gray-400 max-w-2xl mx-auto">نوفر عليك العناء، نحن نهتم بكل شيء من الباب إلى الباب</p>
      </div>

      <div className="grid md:grid-cols-4 gap-8" style={{ perspective: '2000px' }}>
        <ProcessStep 
          number="01" 
          title="احجز موعدك" 
          description="عبر الموقع أو الاتصال، حدد المشكلة والموقع."
        />
        <ProcessStep 
          number="02" 
          title="نستلم السيارة" 
          description="فريقنا يجي لين عندك ويستلم السيارة بكل أمان."
        />
        <ProcessStep 
          number="03" 
          title="صيانة وغسيل" 
          description="نسوي الصيانة اللازمة ونغسل السيارة وننظفها بالكامل."
        />
        <ProcessStep 
          number="04" 
          title="نسلمها لبيتك" 
          description="نرجع لك السيارة جاهزة ونظيفة لباب بيتك."
        />
      </div>
    </div>
  </section>
);

const Stats = React.memo(() => (
  <section className="py-12 bg-brand-black border-y border-white/5">
    <div className="max-w-7xl mx-auto px-4 md:px-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="text-4xl md:text-5xl font-display font-black text-brand-red mb-2">+5000</div>
          <div className="text-gray-400 font-bold uppercase tracking-wider text-sm">سيارة تم صيانتها</div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-center"
        >
          <div className="text-4xl md:text-5xl font-display font-black text-brand-red mb-2">100%</div>
          <div className="text-gray-400 font-bold uppercase tracking-wider text-sm">غسيل مجاني مع كل صيانة</div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-center"
        >
          <div className="text-4xl md:text-5xl font-display font-black text-brand-red mb-2">+10</div>
          <div className="text-gray-400 font-bold uppercase tracking-wider text-sm">سنوات خبرة للمهندسين</div>
        </motion.div>
      </div>
    </div>
  </section>
));

export default function App() {
  return (
    <Router>
      <MainContent />
    </Router>
  );
}

function MainContent() {
  const [selectedService, setSelectedService] = useState<string>('');
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [settings, setSettings] = useState<AppSettings>({});
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Listen for settings updates
    const statsRef = doc(db, 'stats', 'global');
    const unsubscribe = onSnapshot(statsRef, (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        setSettings({
          logoUrl: data.logoUrl,
          siteName: data.siteName
        });
      }
    }, (error) => handleFirestoreError(error, OperationType.GET, 'stats/global'));

    return unsubscribe;
  }, []);

  useEffect(() => {
    // Scroll to top on route change
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    const savedAdmin = sessionStorage.getItem('drfix_admin_logged_in');
    if (savedAdmin === 'true') {
      setIsAdminLoggedIn(true);
    }
  }, []);

  const handleAdminLoginSuccess = () => {
    setIsAdminLoggedIn(true);
    sessionStorage.setItem('drfix_admin_logged_in', 'true');
    navigate('/admin');
  };

  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
    sessionStorage.removeItem('drfix_admin_logged_in');
    navigate('/');
  };

  const handleServiceSelect = (serviceType: string) => {
    setSelectedService(serviceType);
    navigate('/booking');
  };

  return (
    <div className="min-h-screen bg-brand-black text-white">
      <Navbar settings={settings} />
      
      <main className="pt-20">
        <Routes>
          <Route path="/" element={
            <>
              <Hero />
              <Stats />
              <Services onServiceSelect={handleServiceSelect} />
              <Offers />
              <Gallery />
              <Process />
              <Testimonials />
              <FAQ />
            </>
          } />
          <Route path="/services" element={<Services onServiceSelect={handleServiceSelect} />} />
          <Route path="/offers" element={<Offers />} />
          <Route path="/booking" element={<BookingForm selectedService={selectedService} />} />
          <Route path="/history" element={<MaintenanceHistory />} />
          <Route path="/admin" element={<AdminDashboard isAdmin={isAdminLoggedIn} onLogout={handleAdminLogout} settings={settings} />} />
          <Route path="/login" element={<LoginPage onLogin={handleAdminLoginSuccess} />} />
        </Routes>
      </main>

      <Footer settings={settings} />
    </div>
  );
}
