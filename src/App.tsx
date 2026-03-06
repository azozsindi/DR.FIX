/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { cn } from './lib/utils';
import { db } from './firebase';
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
  deleteDoc 
} from 'firebase/firestore';
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  onAuthStateChanged, 
  signOut,
  User as FirebaseUser
} from 'firebase/auth';
import { auth } from './firebase';

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

// --- Components ---

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-brand-black/80 backdrop-blur-lg border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="relative flex items-center justify-center">
            <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center border border-white/10 shadow-lg">
              <span className="text-brand-red font-display font-black text-lg italic tracking-tighter leading-none">
                Dr.Fix
              </span>
            </div>
          </div>
        </div>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8 text-sm font-bold uppercase tracking-widest">
          <a href="#services" className="hover:text-brand-red transition-colors">الخدمات</a>
          <a href="#offers" className="hover:text-brand-red transition-colors">العروض</a>
          <a href="#process" className="hover:text-brand-red transition-colors">كيف نعمل</a>
          <a href="#booking" className="hover:text-brand-red transition-colors">احجز موعداً</a>
          <a href="#contact" className="px-4 py-2 bg-brand-red rounded-full text-white font-display font-bold red-glow-hover transition-all">اتصل بنا</a>
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
              <a href="#services" onClick={() => setIsOpen(false)} className="hover:text-brand-red transition-colors">الخدمات</a>
              <a href="#offers" onClick={() => setIsOpen(false)} className="hover:text-brand-red transition-colors">العروض</a>
              <a href="#process" onClick={() => setIsOpen(false)} className="hover:text-brand-red transition-colors">كيف نعمل</a>
              <a href="#booking" onClick={() => setIsOpen(false)} className="hover:text-brand-red transition-colors">احجز موعداً</a>
              <a href="#contact" onClick={() => setIsOpen(false)} className="bg-brand-red px-6 py-3 rounded-xl text-center font-display">اتصل بنا</a>
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
    <motion.div 
      animate={{ 
        x: [0, 10, 0],
        y: [0, 10, 0]
      }}
      transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
      className="absolute inset-0 z-0 opacity-10 md:opacity-20"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-brand-red/20 via-transparent to-transparent" />
      <div className="grid grid-cols-6 md:grid-cols-12 h-full w-full border-x border-white/5">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="border-r border-white/5 h-full" />
        ))}
      </div>
    </motion.div>

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
          <a href="#booking" className="px-8 py-4 bg-brand-red text-white font-display font-black rounded-xl red-glow-hover transition-all flex items-center justify-center gap-3 text-lg">
            احجز موعدك الآن
            <Car className="w-6 h-6" />
          </a>
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

const ServiceCard = ({ icon: Icon, title, description, onClick }: { icon: any, title: string, description: string, onClick?: () => void }) => (
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
);

const Services = ({ onServiceSelect }: { onServiceSelect: (type: string) => void }) => (
  <section id="services" className="py-16 md:py-24 bg-brand-dark">
    <div className="max-w-7xl mx-auto px-4 md:px-6">
      <div className="text-center mb-12 md:mb-16">
        <h2 className="text-3xl md:text-5xl font-display font-black mb-4 italic uppercase">خدماتنا <span className="text-brand-red">الشاملة</span></h2>
        <div className="w-20 md:w-24 h-1.5 bg-brand-red mx-auto rounded-full" />
      </div>

      <div className="flex overflow-x-auto pb-8 gap-6 md:gap-8 snap-x snap-mandatory no-scrollbar">
        <div className="flex gap-6 md:gap-8">
          <div className="min-w-[280px] md:min-w-[350px] snap-center">
            <ServiceCard 
              icon={Car} 
              title="خدمة من الباب للباب" 
              description="نستلم سيارتك من بيتك، نسوي الصيانة اللازمة، نغسلها، ونسلمها لك جاهزة."
              onClick={() => onServiceSelect('home-service')}
            />
          </div>
          <div className="min-w-[280px] md:min-w-[350px] snap-center">
            <ServiceCard 
              icon={Wrench} 
              title="ميكانيكا عامة" 
              description="إصلاح المحركات، الجيربوكس، وأنظمة التعليق بأعلى معايير الجودة."
              onClick={() => onServiceSelect('mechanic')}
            />
          </div>
          <div className="min-w-[280px] md:min-w-[350px] snap-center">
            <ServiceCard 
              icon={Zap} 
              title="كهرباء السيارات" 
              description="فحص وإصلاح الأنظمة الكهربائية، البطاريات، والدينامو بدقة متناهية."
              onClick={() => onServiceSelect('electric')}
            />
          </div>
          <div className="min-w-[280px] md:min-w-[350px] snap-center">
            <ServiceCard 
              icon={Cpu} 
              title="برمجة وفحص كمبيوتر" 
              description="أحدث أجهزة الفحص لتشخيص الأعطال وبرمجة الحساسات والأنظمة الذكية."
              onClick={() => onServiceSelect('programming')}
            />
          </div>
          <div className="min-w-[280px] md:min-w-[350px] snap-center">
            <ServiceCard 
              icon={Hammer} 
              title="سمكرة وطلاء" 
              description="إصلاح الحوادث وإعادة طلاء السيارة بألوان مطابقة تماماً للوكالة."
              onClick={() => onServiceSelect('bodywork')}
            />
          </div>
          <div className="min-w-[280px] md:min-w-[350px] snap-center">
            <ServiceCard 
              icon={Shield} 
              title="صيانة دورية" 
              description="تغيير الزيوت، الفلاتر، وفحص السوائل لضمان أداء مثالي لسيارتك."
              onClick={() => onServiceSelect('maintenance')}
            />
          </div>
          <div className="min-w-[280px] md:min-w-[350px] snap-center">
            <ServiceCard 
              icon={Zap} 
              title="تكييف السيارات" 
              description="فحص تسريب الفريون، تعبئة الفريون، وإصلاح الكمبروسر."
              onClick={() => onServiceSelect('ac')}
            />
          </div>
          <div className="min-w-[280px] md:min-w-[350px] snap-center">
            <ServiceCard 
              icon={Wrench} 
              title="فرامل ومساعدات" 
              description="تغيير الفحمات، خرط الهوبات، وإصلاح نظام التعليق والمساعدات."
              onClick={() => onServiceSelect('brakes')}
            />
          </div>
          <div className="min-w-[280px] md:min-w-[350px] snap-center">
            <ServiceCard 
              icon={Shield} 
              title="فحص قبل الشراء" 
              description="فحص شامل ودقيق للسيارة قبل شرائها لضمان سلامة قرارك."
              onClick={() => onServiceSelect('inspection')}
            />
          </div>
          <div className="min-w-[280px] md:min-w-[350px] snap-center">
            <ServiceCard 
              icon={Car} 
              title="إطارات وميزان" 
              description="تغيير الإطارات، ترصيص، وميزان ليزر لضمان ثبات السيارة."
              onClick={() => onServiceSelect('tires')}
            />
          </div>
          <div className="min-w-[280px] md:min-w-[350px] snap-center">
            <ServiceCard 
              icon={Zap} 
              title="البطاريات والتشغيل" 
              description="فحص نظام التشغيل، تغيير البطاريات، وإصلاح السلف والدينامو."
              onClick={() => onServiceSelect('battery')}
            />
          </div>
          <div className="min-w-[280px] md:min-w-[350px] snap-center">
            <ServiceCard 
              icon={Hammer} 
              title="تلميع ونانو سيراميك" 
              description="تلميع خارجي وداخلي وحماية نانو سيراميك للحفاظ على لمعة سيارتك."
              onClick={() => onServiceSelect('detailing')}
            />
          </div>
        </div>
      </div>
    </div>
  </section>
);

interface Offer {
  id: string;
  title: string;
  price: string;
  subtitle?: string;
  features: string[];
  icon: 'tag' | 'zap';
  createdAt: Timestamp;
}

const Offers = () => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'offers'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const results: Offer[] = [];
      snapshot.forEach((doc) => {
        results.push({ id: doc.id, ...doc.data() } as Offer);
      });
      setOffers(results);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  if (loading) return null;
  if (offers.length === 0) return null;

  return (
    <section id="offers" className="py-24 bg-brand-black relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-display font-black mb-4 italic uppercase">عروض <span className="text-brand-red">خاصة</span></h2>
          <div className="w-20 md:w-24 h-1.5 bg-brand-red mx-auto rounded-full" />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {offers.map((offer) => (
            <motion.div 
              key={offer.id}
              whileHover={{ y: -10 }}
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
              <a href="#booking" className="inline-flex items-center gap-2 text-brand-red font-bold group-hover:gap-4 transition-all">
                احجز هذا العرض الآن
                <ChevronDown className="w-4 h-4 -rotate-90" />
              </a>
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
          customerPhone: data.phone,
          carModel: `${data.carMake} ${data.carModel} ${data.carYear}`,
          serviceType: `حجز: ${serviceLabels[data.serviceType] || data.serviceType}`,
          notes: `طلب حجز تلقائي: ${data.description}`,
          cost: 0,
          serviceDate: serverTimestamp()
        });
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

const TestimonialCard = ({ name, comment, rating, reply }: { name: string, comment: string, rating: number, reply?: string }) => (
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
);

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState<TestimonialData[]>([]);
  const [loading, setLoading] = useState(true);

  const staticTestimonials = [
    { name: "أحمد", comment: "خدمة ممتازة جداً، استلموا السيارة من البيت ورجعوها في نفس اليوم نظيفة ومصلحة. المهندس محمد قمة في الأخلاق والأمانة.", rating: 5 },
    { name: "فارس", comment: "عجبني إنه يغسل السيارة قبل لا يجيبها ههههههههههههههههه، صراحة خدمة فندقية مو بس صيانة! الله يبارك لكم.", rating: 5 },
    { name: "خالد", comment: "أفضل مركز صيانة تعاملت معه في جدة. دقة في المواعيد وشغل احترافي وسعر منافس جداً مقارنة بالوكالة.", rating: 5 },
    { name: "مرام", comment: "وفروا علي عناء الذهاب للورشة، الخدمة من الباب للباب مريحة جداً. شكراً دكتور فيكس على الاحترافية.", rating: 5 },
    { name: "سلطان", comment: "المهندس محمد سندي فنان، صلح لي مشكلة في الكهرباء عجزت عنها الوكالة وبسعر معقول جداً.", rating: 5 },
    { name: "خلود", comment: "أفضل شيء إنهم يجونك لين البيت، ما عاد أشيل هم الورش والزحمة. تعامل راقي جداً.", rating: 5 }
  ];

  useEffect(() => {
    const q = query(collection(db, 'testimonials'), orderBy('createdAt', 'desc'));
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

  const displayData = testimonials.length > 0 ? testimonials : staticTestimonials;

  return (
    <section id="testimonials" className="py-24 bg-brand-dark relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-display font-black mb-4 italic uppercase">ماذا يقول <span className="text-brand-red">عملاؤنا؟</span></h2>
          <div className="w-20 md:w-24 h-1.5 bg-brand-red mx-auto rounded-full" />
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-12 h-12 text-brand-red animate-spin" />
          </div>
        ) : (
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
        )}

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
}

const AdminDashboard = () => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [records, setRecords] = useState<MaintenanceRecord[]>([]);
  const [testimonials, setTestimonials] = useState<TestimonialData[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [activeTab, setActiveTab] = useState<'maintenance' | 'testimonials' | 'offers'>('maintenance');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  // Form States
  const [formData, setFormData] = useState({
    customerPhone: '',
    carModel: '',
    serviceType: '',
    notes: '',
    cost: ''
  });

  const [offerForm, setOfferForm] = useState({
    title: '',
    price: '',
    subtitle: '',
    features: '',
    icon: 'tag' as 'tag' | 'zap'
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setIsAdmin(u?.email?.toLowerCase() === 'azozsindi23@gmail.com');
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (isAdmin) {
      // Maintenance
      const qM = query(collection(db, 'maintenance'), orderBy('serviceDate', 'desc'));
      const unsubM = onSnapshot(qM, (snapshot) => {
        const results: MaintenanceRecord[] = [];
        snapshot.forEach((doc) => {
          results.push({ id: doc.id, ...doc.data() } as MaintenanceRecord);
        });
        setRecords(results);
      });

      // Testimonials
      const qT = query(collection(db, 'testimonials'), orderBy('createdAt', 'desc'));
      const unsubT = onSnapshot(qT, (snapshot) => {
        const results: TestimonialData[] = [];
        snapshot.forEach((doc) => {
          results.push({ id: doc.id, ...doc.data() } as TestimonialData);
        });
        setTestimonials(results);
      });

      // Offers
      const qO = query(collection(db, 'offers'), orderBy('createdAt', 'desc'));
      const unsubO = onSnapshot(qO, (snapshot) => {
        const results: Offer[] = [];
        snapshot.forEach((doc) => {
          results.push({ id: doc.id, ...doc.data() } as Offer);
        });
        setOffers(results);
      });

      return () => {
        unsubM();
        unsubT();
        unsubO();
      };
    }
  }, [isAdmin]);

  const handleLogout = () => signOut(auth);

  const handleAddRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, 'maintenance'), {
        ...formData,
        cost: Number(formData.cost),
        serviceDate: serverTimestamp()
      });
      setFormData({ customerPhone: '', carModel: '', serviceType: '', notes: '', cost: '' });
      setIsAdding(false);
    } catch (error) {
      console.error("Error adding record:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, 'offers'), {
        ...offerForm,
        features: offerForm.features.split('\n').filter(f => f.trim()),
        createdAt: serverTimestamp()
      });
      setOfferForm({ title: '', price: '', subtitle: '', features: '', icon: 'tag' });
      setIsAdding(false);
    } catch (error) {
      console.error("Error adding offer:", error);
    } finally {
      setLoading(false);
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

  if (!user || !isAdmin) {
    return null;
  }

  return (
    <section id="admin" className="py-24 bg-brand-black border-t border-white/5">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-wrap justify-between items-center gap-6 mb-12">
          <div>
            <h2 className="text-3xl font-display font-black italic mb-2">لوحة تحكم <span className="text-brand-red">المدير</span></h2>
            <p className="text-gray-500">إدارة السجلات، التعليقات، والعروض</p>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsAdding(!isAdding)}
              className="flex items-center gap-2 px-6 py-3 bg-brand-red rounded-xl font-bold italic hover:bg-red-700 transition-all"
            >
              <PlusCircle className="w-5 h-5" />
              إضافة جديد
            </button>
            <button 
              onClick={handleLogout}
              className="p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all text-gray-400"
              title="تسجيل الخروج"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-white/5 pb-4">
          <button 
            onClick={() => setActiveTab('maintenance')}
            className={cn("px-4 py-2 rounded-lg font-bold transition-all", activeTab === 'maintenance' ? "bg-brand-red text-white" : "text-gray-500 hover:text-white")}
          >
            السجلات
          </button>
          <button 
            onClick={() => setActiveTab('testimonials')}
            className={cn("px-4 py-2 rounded-lg font-bold transition-all", activeTab === 'testimonials' ? "bg-brand-red text-white" : "text-gray-500 hover:text-white")}
          >
            التعليقات
          </button>
          <button 
            onClick={() => setActiveTab('offers')}
            className={cn("px-4 py-2 rounded-lg font-bold transition-all", activeTab === 'offers' ? "bg-brand-red text-white" : "text-gray-500 hover:text-white")}
          >
            العروض
          </button>
        </div>

        <AnimatePresence>
          {isAdding && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mb-12"
            >
              {activeTab === 'maintenance' && (
                <form onSubmit={handleAddRecord} className="glass-card p-8 border-brand-red/20 grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-500">رقم جوال العميل</label>
                    <input 
                      required
                      value={formData.customerPhone}
                      onChange={e => setFormData({...formData, customerPhone: e.target.value})}
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 focus:border-brand-red outline-none"
                      placeholder="05XXXXXXXX"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-500">نوع السيارة</label>
                    <input 
                      required
                      value={formData.carModel}
                      onChange={e => setFormData({...formData, carModel: e.target.value})}
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 focus:border-brand-red outline-none"
                      placeholder="مثلاً: تويوتا كامري 2022"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-500">نوع الخدمة</label>
                    <input 
                      required
                      value={formData.serviceType}
                      onChange={e => setFormData({...formData, serviceType: e.target.value})}
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 focus:border-brand-red outline-none"
                      placeholder="مثلاً: تغيير زيت وفلتر"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-500">التكلفة (ريال)</label>
                    <input 
                      type="number"
                      value={formData.cost}
                      onChange={e => setFormData({...formData, cost: e.target.value})}
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 focus:border-brand-red outline-none"
                      placeholder="0.00"
                    />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-500">ملاحظات إضافية</label>
                    <textarea 
                      value={formData.notes}
                      onChange={e => setFormData({...formData, notes: e.target.value})}
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 focus:border-brand-red outline-none resize-none"
                      rows={3}
                      placeholder="تفاصيل الصيانة..."
                    />
                  </div>
                  <div className="md:col-span-2 flex gap-4">
                    <button 
                      type="submit"
                      disabled={loading}
                      className="flex-1 bg-brand-red py-4 rounded-xl font-display font-black italic hover:bg-red-700 transition-all disabled:opacity-50"
                    >
                      {loading ? 'جاري الحفظ...' : 'حفظ السجل'}
                    </button>
                    <button 
                      type="button"
                      onClick={() => setIsAdding(false)}
                      className="px-8 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all"
                    >
                      إلغاء
                    </button>
                  </div>
                </form>
              )}

              {activeTab === 'offers' && (
                <form onSubmit={handleAddOffer} className="glass-card p-8 border-brand-red/20 grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-500">عنوان العرض</label>
                    <input 
                      required
                      value={offerForm.title}
                      onChange={e => setOfferForm({...offerForm, title: e.target.value})}
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 focus:border-brand-red outline-none"
                      placeholder="مثلاً: كشف شامل مجاني"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-500">السعر</label>
                    <input 
                      required
                      value={offerForm.price}
                      onChange={e => setOfferForm({...offerForm, price: e.target.value})}
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 focus:border-brand-red outline-none"
                      placeholder="مثلاً: 298 أو مجاني"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-500">نص فرعي (اختياري)</label>
                    <input 
                      value={offerForm.subtitle}
                      onChange={e => setOfferForm({...offerForm, subtitle: e.target.value})}
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 focus:border-brand-red outline-none"
                      placeholder="مثلاً: للسيارات 4 سلندر"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-500">الأيقونة</label>
                    <select 
                      value={offerForm.icon}
                      onChange={e => setOfferForm({...offerForm, icon: e.target.value as 'tag' | 'zap'})}
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 focus:border-brand-red outline-none"
                    >
                      <option value="tag">تاق (Tag)</option>
                      <option value="zap">برق (Zap)</option>
                    </select>
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-500">المميزات (كل سطر ميزة)</label>
                    <textarea 
                      required
                      value={offerForm.features}
                      onChange={e => setOfferForm({...offerForm, features: e.target.value})}
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 focus:border-brand-red outline-none resize-none"
                      rows={5}
                      placeholder="ميزة 1&#10;ميزة 2&#10;ميزة 3"
                    />
                  </div>
                  <div className="md:col-span-2 flex gap-4">
                    <button 
                      type="submit"
                      disabled={loading}
                      className="flex-1 bg-brand-red py-4 rounded-xl font-display font-black italic hover:bg-red-700 transition-all disabled:opacity-50"
                    >
                      {loading ? 'جاري الحفظ...' : 'حفظ العرض'}
                    </button>
                    <button 
                      type="button"
                      onClick={() => setIsAdding(false)}
                      className="px-8 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all"
                    >
                      إلغاء
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-4">
          {activeTab === 'maintenance' && (
            records.length > 0 ? (
              records.map((record) => (
                <div key={record.id} className="p-6 rounded-2xl bg-white/5 border border-white/10 flex flex-wrap justify-between items-center gap-6">
                  <div className="flex items-center gap-6">
                    <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center border border-white/10 text-brand-red">
                      <Car className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="font-bold text-lg">{record.carModel}</div>
                      <div className="text-gray-500 text-sm flex items-center gap-4">
                        <span className="flex items-center gap-1"><User className="w-3 h-3" /> {record.customerPhone}</span>
                        <span className="flex items-center gap-1"><Wrench className="w-3 h-3" /> {record.serviceType}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right hidden sm:block">
                      <div className="text-brand-red font-bold">{record.cost} ريال</div>
                      <div className="text-gray-600 text-xs">
                        {record.serviceDate?.toDate().toLocaleDateString('ar-SA')}
                      </div>
                    </div>
                    <button 
                      onClick={() => handleDelete('maintenance', record.id)}
                      className="p-3 text-gray-600 hover:text-brand-red transition-colors"
                      title="حذف"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 border border-dashed border-white/10 rounded-2xl text-gray-600">
                لا توجد سجلات حالياً.
              </div>
            )
          )}

          {activeTab === 'testimonials' && (
            testimonials.length > 0 ? (
              testimonials.map((t) => (
                <div key={t.id} className="flex flex-col gap-4">
                  <div className="p-6 rounded-2xl bg-white/5 border border-white/10 flex flex-wrap justify-between items-center gap-6">
                    <div className="flex items-center gap-6">
                      <div className="w-12 h-12 bg-brand-red/10 rounded-xl flex items-center justify-center text-brand-red">
                        <MessageSquare className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="font-bold text-lg">{t.name}</div>
                        <div className="text-gray-500 text-sm max-w-md line-clamp-1">{t.comment}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={cn("w-3 h-3", i < t.rating ? "fill-brand-red text-brand-red" : "text-gray-700")} />
                        ))}
                      </div>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => {
                            setReplyingTo(replyingTo === t.id ? null : t.id!);
                            setReplyText(t.reply || '');
                          }}
                          className={cn(
                            "px-4 py-2 rounded-lg text-xs font-bold transition-all",
                            t.reply ? "bg-green-500/10 text-green-500 border border-green-500/20" : "bg-white/5 text-gray-400 border border-white/10 hover:text-white"
                          )}
                        >
                          {t.reply ? 'تعديل الرد' : 'إضافة رد'}
                        </button>
                        <button 
                          onClick={() => handleDelete('testimonials', t.id!)}
                          className="p-3 text-gray-600 hover:text-brand-red transition-colors"
                          title="حذف"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <AnimatePresence>
                    {replyingTo === t.id && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden px-6 pb-6"
                      >
                        <div className="flex gap-4">
                          <textarea 
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            placeholder="اكتب ردك هنا..."
                            className="flex-grow bg-black/50 border border-white/10 rounded-xl px-4 py-3 focus:border-brand-red outline-none resize-none text-sm"
                            rows={2}
                          />
                          <button 
                            onClick={() => handleReply(t.id!)}
                            disabled={loading}
                            className="px-6 bg-brand-red rounded-xl font-bold italic hover:bg-red-700 transition-all disabled:opacity-50 text-sm"
                          >
                            حفظ
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))
            ) : (
              <div className="text-center py-12 border border-dashed border-white/10 rounded-2xl text-gray-600">
                لا توجد تعليقات حالياً.
              </div>
            )
          )}

          {activeTab === 'offers' && (
            offers.length > 0 ? (
              offers.map((o) => (
                <div key={o.id} className="p-6 rounded-2xl bg-white/5 border border-white/10 flex flex-wrap justify-between items-center gap-6">
                  <div className="flex items-center gap-6">
                    <div className="w-12 h-12 bg-brand-red/10 rounded-xl flex items-center justify-center text-brand-red">
                      {o.icon === 'zap' ? <Zap className="w-6 h-6" /> : <Tag className="w-6 h-6" />}
                    </div>
                    <div>
                      <div className="font-bold text-lg">{o.title}</div>
                      <div className="text-brand-red text-sm font-bold">{o.price} ريال</div>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleDelete('offers', o.id)}
                    className="p-3 text-gray-600 hover:text-brand-red transition-colors"
                    title="حذف"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))
            ) : (
              <div className="text-center py-12 border border-dashed border-white/10 rounded-2xl text-gray-600">
                لا توجد عروض حالياً.
              </div>
            )
          )}
        </div>
      </div>
    </section>
  );
};

const MaintenanceHistory = () => {
  const [phone, setPhone] = useState('');
  const [records, setRecords] = useState<MaintenanceRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) return;

    setLoading(true);
    setHasSearched(true);
    try {
      const q = query(
        collection(db, 'maintenance'),
        where('customerPhone', '==', phone.trim()),
        orderBy('serviceDate', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const results: MaintenanceRecord[] = [];
      querySnapshot.forEach((doc) => {
        results.push({ id: doc.id, ...doc.data() } as MaintenanceRecord);
      });
      setRecords(results);
    } catch (error) {
      console.error("Error fetching maintenance records:", error);
    } finally {
      setLoading(false);
    }
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

const Footer = () => {
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
          
          // Listen for real-time updates
          const unsubscribe = onSnapshot(statsRef, (doc) => {
            if (doc.exists()) {
              setVisitors(doc.data().visitorCount);
            }
          });
          return unsubscribe;
        }
      } catch (error) {
        console.error("Error updating visitor count:", error);
      }
    };

    updateVisitors();
  }, []);

  return (
    <footer className="bg-brand-black border-t border-white/5 py-12">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-12">
        <div className="col-span-2">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center border border-white/10 shadow-xl">
              <span className="text-brand-red font-display font-black text-xl italic tracking-tighter leading-none">
                Dr.Fix
              </span>
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
        <h4 className="font-display font-black mb-6 uppercase tracking-widest text-sm">تواصل معنا</h4>
        <ul className="space-y-4 text-gray-500">
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
        <h4 className="font-display font-black mb-6 uppercase tracking-widest text-sm">تابعنا</h4>
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
      <button 
        onClick={async () => {
          const provider = new GoogleAuthProvider();
          try {
            await signInWithPopup(auth, provider);
          } catch (error) {
            console.error("Admin login error:", error);
          }
        }}
        className="text-[10px] opacity-20 hover:opacity-100 transition-opacity uppercase tracking-tighter"
      >
        Admin Portal
      </button>
    </div>
  </footer>
  );
};

const ProcessStep = ({ number, title, description }: { number: string, title: string, description: string }) => (
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
);

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

const Stats = () => (
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
);

export default function App() {
  const [selectedService, setSelectedService] = useState<string>('');

  const handleServiceSelect = (serviceType: string) => {
    setSelectedService(serviceType);
    const bookingSection = document.getElementById('booking');
    if (bookingSection) {
      bookingSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <Stats />
      <Services onServiceSelect={handleServiceSelect} />
      <Offers />
      <Process />
      <Testimonials />
      <MaintenanceHistory />
      <AdminDashboard />
      <BookingForm selectedService={selectedService} />
      <FAQ />
      <Footer />
    </div>
  );
}
