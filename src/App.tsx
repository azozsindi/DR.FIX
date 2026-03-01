/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Wrench, 
  Zap, 
  Car, 
  Shield, 
  Cpu, 
  Camera, 
  Upload, 
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
  HelpCircle
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useDropzone } from 'react-dropzone';
import { cn } from './lib/utils';

// --- Types ---
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
          <div className="w-9 h-9 md:w-10 md:h-10 bg-brand-red rounded-lg flex items-center justify-center red-glow">
            <Wrench className="text-white w-5 h-5 md:w-6 md:h-6" />
          </div>
          <span className="text-xl md:text-2xl font-display font-black tracking-tighter italic">
            DR.<span className="text-brand-red">FIX</span>
          </span>
        </div>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8 text-sm font-bold uppercase tracking-widest">
          <a href="#services" className="hover:text-brand-red transition-colors">الخدمات</a>
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

const BookingForm = ({ selectedService }: { selectedService?: string }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<BookingFormData>();

  React.useEffect(() => {
    if (selectedService) {
      setValue('serviceType', selectedService);
    }
  }, [selectedService, setValue]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(prev => [...prev, ...acceptedFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif'],
      'video/*': ['.mp4', '.mov', '.avi']
    },
    multiple: true
  } as any);

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: BookingFormData) => {
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
      `*رقم الجوال:* ${data.phone}\n\n` +
      (files.length > 0 ? `_ملاحظة: تم إرفاق ${files.length} ملفات توضيحية_` : '');

    // Try to use Native Share API if files are present and supported
    if (files.length > 0 && navigator.canShare && navigator.canShare({ files })) {
      try {
        await navigator.share({
          files: files,
          title: 'طلب حجز Dr. Fix',
          text: messageText,
        });
        setIsSubmitted(true);
        setTimeout(() => {
          setIsSubmitted(false);
          reset();
          setFiles([]);
        }, 5000);
        return;
      } catch (error) {
        console.log('Share failed or cancelled', error);
        // Fallback to WhatsApp URL if sharing was cancelled or failed
      }
    }

    // Fallback to standard WhatsApp URL (Text only)
    const whatsappUrl = `https://wa.me/966546870807?text=${encodeURIComponent(messageText)}`;
    window.open(whatsappUrl, '_blank');
    
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      reset();
      setFiles([]);
    }, 5000);
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

            <div className="space-y-4">
              <label className="text-xs md:text-sm font-display font-bold text-gray-400 uppercase tracking-wider">رفع الصور والفيديو</label>
              <div 
                {...getRootProps()} 
                className={cn(
                  "border-2 border-dashed rounded-2xl p-6 md:p-8 text-center transition-all cursor-pointer",
                  isDragActive ? "border-brand-red bg-brand-red/5" : "border-white/10 hover:border-brand-red/50"
                )}
              >
                <input {...getInputProps()} />
                <Upload className="w-8 h-8 md:w-10 md:h-10 text-brand-red mx-auto mb-4" />
                <p className="text-base md:text-lg font-bold mb-1">اسحب الملفات هنا أو انقر للاختيار</p>
                <p className="text-xs md:text-sm text-gray-500">يمكنك رفع صور أو فيديوهات توضح المشكلة</p>
              </div>

              {files.length > 0 && (
                <div className="grid grid-cols-3 md:grid-cols-4 gap-2 md:gap-4 mt-4">
                  {files.map((file, index) => (
                    <div key={index} className="relative group rounded-lg overflow-hidden border border-white/10 aspect-square bg-white/5">
                      {file.type.startsWith('image/') ? (
                        <img 
                          src={URL.createObjectURL(file)} 
                          alt="preview" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Camera className="w-6 h-6 md:w-8 md:h-8 text-gray-500" />
                        </div>
                      )}
                      <button 
                        type="button"
                        onClick={() => removeFile(index)}
                        className="absolute top-1 right-1 bg-brand-red p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3 md:w-4 md:h-4 text-white" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
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

const TestimonialCard = ({ name, comment, rating }: { name: string, comment: string, rating: number }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="glass-card p-6 border-white/5 hover:border-brand-red/30 transition-all shadow-xl"
  >
    <div className="flex gap-1 mb-4">
      {[...Array(5)].map((_, i) => (
        <Star key={i} className={cn("w-4 h-4", i < rating ? "text-yellow-500 fill-yellow-500" : "text-gray-600")} />
      ))}
    </div>
    <p className="text-gray-300 italic mb-6 leading-relaxed">"{comment}"</p>
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 bg-brand-red/20 rounded-full flex items-center justify-center font-bold text-brand-red">
        {name[0]}
      </div>
      <span className="font-bold text-sm">{name}</span>
    </div>
  </motion.div>
);

const Testimonials = () => (
  <section id="testimonials" className="py-24 bg-brand-dark relative overflow-hidden">
    <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-5xl font-display font-black mb-4 italic uppercase">ماذا يقول <span className="text-brand-red">عملاؤنا؟</span></h2>
        <div className="w-20 md:w-24 h-1.5 bg-brand-red mx-auto rounded-full" />
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <TestimonialCard 
          name="أحمد الزهراني" 
          comment="خدمة ممتازة جداً، استلموا السيارة من البيت ورجعوها في نفس اليوم نظيفة ومصلحة. المهندس محمد قمة في الأخلاق والأمانة." 
          rating={5} 
        />
        <TestimonialCard 
          name="خالد الحربي" 
          comment="أفضل مركز صيانة تعاملت معه في جدة. دقة في المواعيد وشغل احترافي وسعر منافس جداً مقارنة بالوكالة." 
          rating={5} 
        />
        <TestimonialCard 
          name="سارة الغامدي" 
          comment="وفروا علي عناء الذهاب للورشة، الخدمة من الباب للباب مريحة جداً. شكراً دكتور فيكس على الاحترافية." 
          rating={5} 
        />
      </div>
    </div>
  </section>
);

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

const Footer = () => (
  <footer className="bg-brand-black border-t border-white/5 py-12">
    <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-12">
      <div className="col-span-2">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 bg-brand-red rounded flex items-center justify-center">
            <Wrench className="text-white w-5 h-5" />
          </div>
          <span className="text-xl font-display font-black italic tracking-tighter">
            DR.<span className="text-brand-red">FIX</span>
          </span>
        </div>
        <p className="text-gray-500 max-w-sm leading-relaxed">
          مركز الصيانة الأفضل في المنطقة. خبرة تمتد لسنوات في التعامل مع كافة أنواع السيارات والمشاكل التقنية والميكانيكية.
        </p>
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
    <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-white/5 text-center text-gray-600 text-sm font-mono">
      &copy; {new Date().getFullYear()} DR. FIX AUTO SERVICES. ALL RIGHTS RESERVED.
    </div>
  </footer>
);

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

const FloatingSocials = () => (
  <div className="fixed right-4 bottom-20 md:bottom-6 md:left-6 z-50 flex flex-col gap-3 md:gap-4">
    <motion.a 
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 0.8 }}
      whileHover={{ scale: 1.1 }}
      href="https://www.snapchat.com/add/drfix.6556" 
      target="_blank" 
      rel="noopener noreferrer"
      className="w-10 h-10 md:w-12 md:h-12 bg-[#FFFC00] text-black rounded-full flex items-center justify-center shadow-lg hover:shadow-[#FFFC00]/20 transition-all"
      title="Snapchat"
    >
      <svg viewBox="0 0 24 24" className="w-5 h-5 md:w-6 md:h-6 fill-current" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2.75c-3.15 0-5.75 2.35-5.75 5.25 0 .35.03.7.1 1.03-.05.02-.1.04-.15.07-.45.25-.7.75-.7 1.3 0 .4.15.75.4 1 .05.05.1.1.15.15-.05.15-.1.3-.1.45 0 .85.7 1.55 1.55 1.55.15 0 .3-.02.45-.07.05.1.1.2.15.3.4.8 1.2 1.3 2.1 1.3.1 0 .2 0 .3-.02.1.35.4.62.8.62s.7-.27.8-.62c.1.02.2.02.3.02.9 0 1.7-.5 2.1-1.3.05-.1.1-.2.15-.3.15.05.3.07.45.07.85 0 1.55-.7 1.55-1.55 0-.15-.05-.3-.1-.45.05-.05.1-.1.15-.15.25-.25.4-.6.4-1 0-.55-.25-1.05-.7-1.3-.05-.03-.1-.05-.15-.07.07-.33.1-.68.1-1.03 0-2.9-2.6-5.25-5.75-5.25zM12 19c-3.5 0-6.5-1.5-8.5-4 0-1.5 1.5-2.5 3-2.5.5 0 1 .1 1.5.3.5-.8 1.5-1.3 2.5-1.3.1 0 .2 0 .3.02.1-.35.4-.62.8-.62s.7.27.8.62c.1-.02.2-.02.3-.02 1 0 2 .5 2.5 1.3.5-.2 1-.3 1.5-.3 1.5 0 3 1 3 2.5-2 2.5-5 4-8.5 4z"/>
      </svg>
    </motion.a>
    <motion.a 
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 1.0 }}
      whileHover={{ scale: 1.1 }}
      href="https://www.instagram.com/dr.fix1" 
      target="_blank" 
      rel="noopener noreferrer"
      className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-pink-500/20 transition-all"
      title="Instagram"
    >
      <Instagram className="w-5 h-5 md:w-6 md:h-6" />
    </motion.a>
  </div>
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
      <FloatingSocials />
      <Hero />
      <Services onServiceSelect={handleServiceSelect} />
      <Process />
      <Testimonials />
      <BookingForm selectedService={selectedService} />
      <FAQ />
      <Footer />
    </div>
  );
}
