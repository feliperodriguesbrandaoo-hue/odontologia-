import React, { useState, useEffect, useRef } from 'react';
import { 
  Phone, 
  MapPin, 
  Clock, 
  Instagram, 
  MessageSquare, 
  ChevronRight, 
  ShieldCheck, 
  Star, 
  Menu, 
  X,
  Send,
  Sparkles,
  Stethoscope,
  Smile,
  CheckCircle2,
  ArrowRight,
  Zap,
  Monitor,
  Home,
  User,
  Activity,
  UserCheck,
  MoreVertical,
  Heart,
  Check,
  Share2,
  Navigation,
  Play,
  Bookmark,
  ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getChatResponse } from './services/geminiService';
import Markdown from 'react-markdown';

// Colors based on user request: Radiant Blue and Gold
const COLORS = {
  primary: '#003366', // Radiant Blue (Dark Sky Blue)
  accent: '#D4AF37',  // Gold
  accentLight: '#F4D03F',
};

const SPECIALTIES = [
  { 
    title: 'Dor Orofacial', 
    description: 'A dor orofacial é uma dor na região da cabeça, na face, pescoço, boca ou mandíbula. Seja qual for a localização, a explicação para esse desconforto pode ser algo simples, como uma cárie, ou a causa pode ser mais difícil de identificar.',
  },
  { 
    title: 'Implantodontia', 
    description: 'Com técnicas aplicáveis a pacientes de todas as idades, a partir da fase adulta, os implantes realizados na Royal Odontologia são personalizados e especializados, promovendo resultados satisfatórios com o mínimo de transtorno e desconforto para os pacientes.',
  },
  { 
    title: 'Endodontia', 
    description: 'A especialidade da odontologia responsável pelo tratamento de doenças que acometem a polpa dentária, o sistema de canais radiculares e os tecidos periapicais é chamada de Endodontia. O principal objetivo dos tratamentos endodônticos é manter o dente na cavidade bucal e a saúde dos tecidos.',
  },
  { 
    title: 'Ortodontia', 
    description: 'A tortuosidade dos dentes pode dificultar a higienização correta e levar à perda precoce em virtude da deterioração e da doença periodontal – consequências da dificuldade da escovação.',
  },
  { 
    title: 'Cirurgias Regenerativas', 
    description: 'A cirurgia regenerativa é indicada quando há a perda óssea em função de alguma doença na boca e serve para a restauração dos tecidos e da fixação perdida pelos dentes na cavidade oral.',
  },
];

const DIFFERENTIATORS = [
  {
    title: 'Laboratório Próprio',
    description: 'Laboratório próprio em nossa clínica, de alta tecnologia. Utilizamos o sistema CAD/CAM que permite a criação de próteses, lentes de cerâmica dental e outras restaurações dentárias através de escaneamento digital e usinagem computadorizada. Isso reduz a precisão e qualidade no final do tratamento.',
    icon: <Home className="w-8 h-8" />
  },
  {
    title: 'Laser',
    description: 'Terapia na rotina de procedimentos odontológicos, com diversas áreas de atuação. Como em cirurgias, estética, remoção de facetas laminadas, restaurações, tratamento de sensibilidade entre outros benefícios.',
    icon: <Zap className="w-8 h-8" />
  },
  {
    title: 'Fluxo Digital',
    description: 'Na odontologia refere-se à incorporação de tecnologias digitais avançadas. Sendo assim em vez de usar moldagens tradicionais, a digitalização intraoral é realizada com scanners 3D. Favorecendo diagnósticos e agilizando tratamentos que envolvam o laboratório.',
    icon: <Monitor className="w-8 h-8" />
  }
];

const SERVICES_LIST = [
  { 
    title: 'Implantes Dentários', 
    image: 'https://i.postimg.cc/GBNGq0Dd/implant.webp',
    description: 'Substituição de dentes perdidos por raízes artificiais, proporcionando um sorriso natural e funcional.' 
  },
  { 
    title: 'Aparelho Ortodôntico', 
    image: 'https://i.postimg.cc/ns5B08mx/braces.webp',
    description: 'Dispositivo utilizado para corrigir o alinhamento dos dentes e melhorar a mordida, garantindo um sorriso mais harmônico.' 
  },
  { 
    title: 'Tratamento de Canal', 
    image: 'https://i.postimg.cc/Ffq3DtSt/nerve.webp',
    description: 'Conservação do dente infectado através da limpeza e obturação dos canais radiculares.' 
  },
  { 
    title: 'Limpeza', 
    image: 'https://i.postimg.cc/p97zqNjt/tartar-plaque.webp',
    description: 'Remoção de placas bacterianas e tártaro que se acumulam nos dentes e nas gengivas.' 
  },
  { 
    title: 'Clareamento Dental', 
    image: 'https://i.postimg.cc/XZhdQM53/whitening.webp',
    description: 'Procedimento estético que remove manchas e deixa seus dentes mais brancos e brilhantes.' 
  },
  { 
    title: 'Restauração', 
    image: 'https://i.postimg.cc/VSTnDytQ/broken-tooth.webp',
    description: 'Repomos a parte danificada do seu dente, devolvendo a função e a estética.' 
  },
  { 
    title: 'Odontologia Estética', 
    image: 'https://i.postimg.cc/jW9PZVfb/Tooth.webp',
    description: 'Procedimentos estéticos que aprimoram a aparência do seu sorriso, como facetas, clareamento e remodelação dental.' 
  },
  { 
    title: 'Preventivo', 
    image: 'https://i.postimg.cc/PLcY2GDn/bacteria.webp',
    description: 'Cuidado regular com a saúde bucal, incluindo limpeza, check-ups e orientações para prevenir problemas dentários.' 
  },
  { 
    title: 'Extração', 
    image: 'https://i.postimg.cc/67SnYsZB/tooth-insurance.webp',
    description: 'Remoção segura e eficaz de dentes comprometidos, proporcionando alívio da dor e prevenindo complicações.' 
  },
];

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'model', text: string }[]>([
    { role: 'model', text: 'Olá! Sou o assistente da Royal Odontologia. Como posso ajudar você hoje?' }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;

    const userMsg = chatInput;
    setChatInput('');
    setChatMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsTyping(true);

    const history = chatMessages.map(m => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.text }]
    }));

    const response = await getChatResponse(userMsg, history);
    setIsTyping(false);
    setChatMessages(prev => [...prev, { role: 'model', text: response || '' }]);
  };

  return (
    <div className="min-h-screen font-sans selection:bg-royal-gold/30 bg-paper text-royal-blue overflow-x-hidden">
      {/* Navigation */}
      <nav className="absolute top-0 w-full z-50 bg-royal-blue shadow-md border-none">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex justify-between h-20 items-center relative">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-sm bg-white">
                <img 
                  src="https://i.postimg.cc/jdq5fcj2/unnamed-(1).jpg" 
                  alt="Logo" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>

            {/* Centered Name */}
            <div className="absolute left-1/2 -translate-x-1/2">
              <span className="text-lg md:text-3xl font-black tracking-tight gold-mirror-text uppercase whitespace-nowrap italic">Royal Odontologia</span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8">
              {['Início', 'Tratamentos', 'Especialidades', 'Diferenciais', 'Contato'].map((item) => (
                <a 
                  key={item}
                  href={`#${item.toLowerCase()}`} 
                  className="text-white/80 hover:text-royal-gold font-medium text-xs tracking-wide transition-all luxury-underline"
                >
                  {item}
                </a>
              ))}
              <a 
                href="https://wa.me/5562981685668?text=Olá!%20Gostaria%20de%20marcar%20uma%20consulta,%20vim%20pelo%20site." 
                target="_blank" 
                className="bg-royal-gold text-royal-blue px-6 py-2 rounded-full font-bold text-xs hover:bg-white transition-all flex items-center gap-2"
              >
                Agendar
              </a>
            </div>

            {/* Mobile Menu Button */}
            <button className="md:hidden text-white p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, x: '100%' }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-0 z-[100] bg-paper flex flex-col p-12"
            >
              <div className="flex justify-between items-center mb-20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-sm bg-white">
                    <img 
                      src="https://i.postimg.cc/jdq5fcj2/unnamed-(1).jpg" 
                      alt="Logo" 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <span className="text-sm font-bold tracking-widest text-royal-blue uppercase whitespace-nowrap">Royal Odontologia</span>
                </div>
                <button onClick={() => setIsMenuOpen(false)} className="text-royal-blue p-2">
                  <X size={32} />
                </button>
              </div>
              
              <div className="flex flex-col gap-8">
                {['Início', 'Tratamentos', 'Especialidades', 'Diferenciais', 'Contato'].map((item, idx) => (
                  <motion.a 
                    key={item}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + idx * 0.1 }}
                    href={`#${item.toLowerCase()}`} 
                    onClick={() => setIsMenuOpen(false)}
                    className="text-4xl font-serif font-light text-royal-blue hover:text-royal-gold transition-colors"
                  >
                    {item}
                  </motion.a>
                ))}
              </div>

              <div className="mt-auto pt-12 border-t border-royal-blue/5">
                <a 
                  href="https://wa.me/5562981685668?text=Olá!%20Gostaria%20de%20marcar%20uma%20consulta,%20vim%20pelo%20site." 
                  className="w-full bg-royal-blue text-white px-8 py-5 rounded-full font-bold text-lg text-center block"
                >
                  Agendar Consulta VIP
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section - Conversion Focused (Elementor Style) */}
      <section id="inicio" className="relative min-h-screen flex items-center pt-0 overflow-hidden bg-white">
        {/* Background Image with Professional Fade */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://i.postimg.cc/X7GjxwNm/images-2.jpg" 
            alt="Destaque Odontológico" 
            className="absolute left-0 top-0 w-[150%] md:w-full h-full object-cover object-[75%_0%] opacity-95 max-w-none"
            referrerPolicy="no-referrer"
          />
          {/* Bottom-up gradient covering the social proof and button area */}
          <div className="absolute inset-0 bg-linear-to-t from-white via-white/40 to-transparent h-[25%] top-auto"></div>
          {/* Left-to-right gradient to fade the image from the left side */}
          <div className="absolute inset-0 bg-linear-to-r from-white via-white/50 to-transparent w-[55%] md:w-[50%]"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full relative z-10 pb-32 md:pb-40">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-2xl pt-32 md:pt-40 mr-auto text-left flex flex-col items-start"
          >
            <h1 className="text-4xl md:text-7xl font-sans font-black text-royal-blue mb-6 tracking-tight uppercase leading-[1.1] drop-shadow-md">
              CONQUISTE O <br />
              <span className="relative inline-block">
                <span className="relative z-10 text-royal-gold">SORRISO PERFEITO</span>
                {/* Moving Golden Band Effect - Under the title word */}
                <div className="absolute -bottom-2 left-0 w-full h-8 -z-0 pointer-events-none overflow-hidden">
                  <motion.div 
                    initial={{ x: '-100%' }}
                    animate={{ x: '100%' }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="h-full w-full bg-linear-to-r from-transparent via-royal-gold/30 to-transparent blur-xl"
                  ></motion.div>
                  <motion.div 
                    initial={{ x: '-100%' }}
                    animate={{ x: '100%' }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.1 }}
                    className="absolute top-1/2 left-0 w-full h-[3px] bg-linear-to-r from-transparent via-royal-gold/50 to-transparent -translate-y-1/2"
                  ></motion.div>
                </div>
              </span> <br />
              QUE VOCÊ DESEJA
            </h1>
            
            <p 
              className="text-base md:text-lg text-royal-blue font-bold mb-10 leading-relaxed max-w-3xl text-left bg-white/10 backdrop-blur-[2px] p-6 rounded-[2rem] border border-white/10 shadow-sm"
              style={{ textShadow: '0 0 15px rgba(255,255,255,1), 0 0 5px rgba(255,255,255,0.8)' }}
            >
              Referência Implantes, Facetas, Aparelhos e Reabilitação Oral. Tecnologia de ponta e estética avançada para transformar sua autoestima e saúde bucal.
            </p>
            
            <div className="flex flex-wrap items-center gap-8 mb-12 justify-start">
              <div className="flex items-center gap-4">
                <div className="flex -space-x-3">
                  {[1,2,3,4].map(i => (
                    <img key={i} src={`https://i.pravatar.cc/100?img=${i+10}`} className="w-8 h-8 rounded-full border-2 border-white" alt="User" />
                  ))}
                </div>
                <div className="text-xs font-bold text-royal-blue/60">
                  <span className="text-royal-blue">+1.200</span> pacientes satisfeitos
                </div>
              </div>

              <a 
                href="https://wa.me/5562981685668?text=Olá!%20Gostaria%20de%20marcar%20uma%20consulta,%20vim%20pelo%20site." 
                className="group relative inline-flex items-center justify-center gap-3 bg-[#25D366] text-white px-8 py-4 rounded-xl font-black text-base overflow-hidden transition-all shadow-lg hover:scale-105 active:scale-95 animate-pulse-slow w-full sm:w-auto"
              >
                <span className="relative z-10 uppercase tracking-widest">FAZER AGENDAMENTO</span>
                <ChevronRight className="relative z-10 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </motion.div>
        </div>

        {/* Elementor-style Wave Divider */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0] rotate-180">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-[calc(100%+1.3px)] h-[60px] fill-white">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
          </svg>
        </div>
      </section>

      {/* New Horizontal Scrolling Services Section */}
      <section className="pt-12 pb-16 bg-white overflow-hidden border-t border-royal-blue/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 mb-8">
          <div className="text-left">
            <h2 className="text-lg md:text-xl font-black text-royal-blue mb-1 tracking-tight uppercase">Serviços Oferecidos</h2>
            <div className="w-10 h-1 bg-[#00A8B5] rounded-full"></div>
          </div>
        </div>

        <div className="relative flex overflow-hidden">
          <motion.div 
            className="flex gap-6 px-4"
            animate={{ x: [0, -3200] }}
            transition={{ 
              duration: 45, 
              repeat: Infinity, 
              ease: "linear" 
            }}
          >
            {[...SERVICES_LIST, ...SERVICES_LIST].map((service, idx) => (
              <div 
                key={idx} 
                className="flex-shrink-0 flex flex-row items-center gap-4 p-4 bg-white rounded-[25px] border border-royal-blue/5 shadow-lg shadow-royal-blue/5 hover:border-royal-gold/30 transition-all whitespace-nowrap"
              >
                <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center bg-paper rounded-xl p-1">
                  <img 
                    src={service.image} 
                    alt={service.title} 
                    className="w-full h-full object-contain"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <h4 className="text-sm font-black text-royal-blue leading-tight">{service.title}</h4>
                  <span className="w-1 h-1 bg-royal-blue/20 rounded-full"></span>
                  <p className="text-[10px] text-royal-blue/50 leading-none">
                    {service.description}
                  </p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Especialidades Section - Elementor Service Showcase */}
      <section id="especialidades" className="py-32 bg-royal-blue relative overflow-hidden">
        {/* Top Shape Divider */}
        <div className="absolute top-0 left-0 w-full overflow-hidden leading-[0]">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-[calc(100%+1.3px)] h-[60px] fill-white">
            <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"></path>
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10 pt-20">
          <div className="text-center mb-20">
            <h2 className="text-royal-gold font-black uppercase tracking-[0.3em] text-sm mb-4">Onde o Cuidado Encontra a Excelência</h2>
            <h3 className="mb-8 leading-tight">
              <span className="text-4xl md:text-7xl font-black text-white block">Pare de Conviver com a Dor:</span>
              <span className="text-royal-gold">
                <span className="text-xl md:text-3xl font-bold block mt-4 mb-2">Recupere sua Liberdade e o</span>
                <span className="text-5xl md:text-8xl font-black block">Prazer de Sorrir</span>
              </span>
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: "Dor Orofacial", bg: "https://i.postimg.cc/5yjLRmfg/images-(7).jpg", desc: "Alívio imediato e tratamento definitivo para dores complexas na face e mandíbula." },
              { title: "Implantodontia", bg: "https://i.postimg.cc/5yG77yWM/images-(8).jpg", desc: "A perfeição dos implantes suíços com planejamento digital 3D milimétrico." },
              { title: "DTM", bg: "https://i.postimg.cc/66dfFMVd/DTM-768x512.jpg", desc: "Harmonia funcional para sua articulação temporomandibular e bem-estar diário." },
              { title: "Endodontia", bg: "https://i.postimg.cc/0j8MT0x4/Endodontia.png", desc: "Tratamentos de canal em sessão única com microscopia operatória de alta precisão." },
              { title: "Ortodontia", bg: "https://i.postimg.cc/TP6RNYTc/Ortodontia-e-tratamento-ortodontico.jpg", desc: "Invisalign Doctor: a discrição que você merece com o resultado que você deseja." },
              { title: "Harmonização", bg: "https://i.postimg.cc/s2mRnYnq/images-(10).jpg", desc: "A estética facial elevada ao nível de arte, respeitando sua anatomia e identidade." }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -10 }}
                className="relative h-[580px] rounded-[40px] overflow-hidden group bg-white shadow-2xl flex flex-col"
              >
                {/* Image Area - Vitrine Style */}
                <div className="h-[60%] w-full overflow-hidden relative">
                  <img 
                    src={item.bg} 
                    alt={item.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent"></div>
                </div>
                
                {/* Content Strip (Faixa de Informação) */}
                <div className="h-[40%] w-full p-8 flex flex-col justify-between bg-white">
                  <div>
                    <h4 className="text-2xl font-black text-royal-blue mb-2 tracking-tight uppercase">{item.title}</h4>
                    <p className="text-royal-blue/70 text-sm leading-relaxed line-clamp-3">
                      {item.desc}
                    </p>
                  </div>
                  
                  {/* Buy-style Button (Botão de Ação) */}
                  <a 
                    href="https://wa.me/5562981685668?text=Olá!%20Gostaria%20de%20marcar%20uma%20consulta,%20vim%20pelo%20site."
                    target="_blank"
                    className="w-full bg-royal-gold text-royal-blue py-4 rounded-2xl font-black text-center uppercase tracking-[0.15em] text-[11px] hover:bg-royal-blue hover:text-white transition-all shadow-lg flex items-center justify-center gap-3"
                  >
                    Agendar Tratamento
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section - Elementor Social Proof */}
      <section className="py-32 bg-paper">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8 border-b border-gray-100 pb-8">
            <div className="text-left">
              <a 
                href="https://maps.app.goo.gl/q5jC7X8NDpdpBxQt5" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-royal-blue text-white px-4 py-2 rounded-full font-bold text-xs hover:bg-royal-blue/90 transition-all shadow-lg inline-flex items-center gap-2 mb-6"
              >
                <MapPin className="w-3 h-3" />
                Ver clínica no Google
              </a>
              <h2 className="text-royal-gold font-black uppercase tracking-[0.3em] text-sm mb-4">Avaliações</h2>
              <a 
                href="https://maps.app.goo.gl/q5jC7X8NDpdpBxQt5" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-6 group"
              >
                <div className="text-5xl font-bold text-gray-900 group-hover:text-royal-blue transition-colors">5,0</div>
                <div>
                  <div className="flex text-royal-gold mb-1">
                    {[1,2,3,4,5].map(i => <Star key={i} className="w-5 h-5 fill-current" />)}
                  </div>
                  <div className="text-gray-500 text-sm group-hover:underline">(5 avaliações)</div>
                </div>
              </a>
            </div>
            <div className="flex flex-col items-end gap-3">
              <a 
                href="https://maps.app.goo.gl/q5jC7X8NDpdpBxQt5" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-royal-blue font-bold text-sm hover:underline flex items-center gap-2"
              >
                Adicionar avaliação
              </a>
            </div>
          </div>

          <div className="space-y-12 max-w-3xl mx-auto">
            {[
              { 
                name: "Emilly Araùjo", 
                reviews: "4 avaliações",
                time: "6 meses atrás",
                avatar: "https://i.postimg.cc/VN2L9Bdb/Screenshot-20260307-225921.jpg",
                text: "Excelente dentista, extremamente atencioso e profissional! Sofri um acidente e ele me ajudou com todo cuidado e dedicação. O trabalho no meu implante foi impecável, superando todas as minhas expectativas. Recomendo de olhos fechados!",
                hasResponse: false
              },
              { 
                name: "Laís Silva", 
                reviews: "4 avaliações",
                time: "6 meses atrás",
                avatar: "https://i.postimg.cc/MpTWhrBk/Screenshot-20260307-225929.jpg",
                text: "Atendimento excelente, doutores extremamente atenciosos e pacientes... Levei meu pai para realizar um implante e o tratamento foi impecável!",
                hasResponse: true,
                responseText: "Olá Laís, agradecemos muito pela sua avaliação e por confiar em nossa equipe para o tratamento do seu pai. Estamos felizes em saber que ficaram satisfeitos.",
                responseTime: "6 meses atrás"
              },
              { 
                name: "Evelyn Caroline", 
                reviews: "Local Guide nível 2",
                time: "4 meses atrás",
                avatar: "https://i.postimg.cc/HxQHQqq3/Screenshot-20260307-230006.jpg",
                text: "Excelente experiência com a Royal Odontologia. O atendimento é impecável e realizam os contatos e agendamentos com bastante atenção aos detalhes. Recomendo!",
                hasResponse: false
              }
            ].map((test, idx) => (
              <div key={idx} className="border-b border-gray-100 pb-12 last:border-0">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
                      <img 
                        src={test.avatar} 
                        alt={test.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${test.name}&background=random`;
                        }}
                      />
                    </div>
                    <div>
                      <div className="font-bold text-gray-900 text-lg">{test.name}</div>
                      <div className="text-gray-500 text-sm">{test.reviews}</div>
                    </div>
                  </div>
                  <button className="text-gray-400">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <div className="flex text-royal-gold">
                    {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 fill-current" />)}
                  </div>
                  <span className="text-gray-400 text-sm">{test.time}</span>
                </div>

                <p className="text-gray-700 leading-relaxed mb-6 text-lg">
                  {test.text}
                </p>

                <div className="flex items-center gap-2 text-gray-500 text-sm mb-6">
                  <Heart className="w-4 h-4" />
                  <span>Toque e segure para reagir</span>
                </div>

                {test.hasResponse && (
                  <div className="ml-6 border-l-2 border-gray-100 pl-6 mt-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 rounded-full bg-royal-blue flex items-center justify-center">
                        <div className="text-[10px] font-bold text-white uppercase">R</div>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-gray-900 text-sm">Royal Odontologia (proprietário)</span>
                          <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                            <Check className="w-2.5 h-2.5 text-white stroke-[4]" />
                          </div>
                        </div>
                        <div className="text-gray-400 text-xs">{test.responseTime}</div>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {test.responseText}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Diferenciais Section - Horizontal Marquee */}
      <section id="diferenciais" className="py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 mb-16">
          <div className="text-center">
            <h2 className="text-royal-gold font-black uppercase tracking-[0.3em] text-sm mb-4">Por que a Royal?</h2>
            <h3 className="text-4xl md:text-5xl font-black text-royal-blue">Diferenciais Exclusivos</h3>
          </div>
        </div>

        <div className="relative">
          <motion.div 
            className="flex gap-4 w-max px-4"
            animate={{ x: [0, -1120] }}
            transition={{ 
              ease: "linear", 
              duration: 20, 
              repeat: Infinity 
            }}
          >
            {[
              {
                title: "Laboratório CAD/CAM",
                description: "Próteses e lentes criadas em minutos com precisão suíça.",
                icon: <Home className="w-5 h-5 text-royal-gold" />,
                bg: "bg-royal-blue",
                textColor: "text-white",
                descColor: "text-white/70",
                bgImage: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&q=80&w=400"
              },
              {
                title: "Laserterapia",
                description: "Procedimentos indolores e cicatrização acelerada.",
                icon: <Zap className="w-5 h-5 text-royal-gold" />,
                bg: "bg-paper",
                textColor: "text-royal-blue",
                descColor: "text-royal-blue/60"
              },
              {
                title: "Fluxo 100% Digital",
                description: "Escaneamento 3D que elimina moldagens desconfortáveis.",
                icon: <Monitor className="w-5 h-5 text-royal-gold" />,
                bg: "bg-paper",
                textColor: "text-royal-blue",
                descColor: "text-royal-blue/60"
              },
              {
                title: "Biossegurança",
                description: "Protocolos internacionais de esterilização e segurança.",
                icon: <ShieldCheck className="w-5 h-5 text-royal-blue" />,
                bg: "bg-royal-gold",
                textColor: "text-royal-blue",
                descColor: "text-royal-blue/70"
              },
              // Duplicando para loop
              {
                title: "Laboratório CAD/CAM",
                description: "Próteses e lentes criadas em minutos com precisão suíça.",
                icon: <Home className="w-5 h-5 text-royal-gold" />,
                bg: "bg-royal-blue",
                textColor: "text-white",
                descColor: "text-white/70",
                bgImage: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&q=80&w=400"
              },
              {
                title: "Laserterapia",
                description: "Procedimentos indolores e cicatrização acelerada.",
                icon: <Zap className="w-5 h-5 text-royal-gold" />,
                bg: "bg-paper",
                textColor: "text-royal-blue",
                descColor: "text-royal-blue/60"
              },
              {
                title: "Fluxo 100% Digital",
                description: "Escaneamento 3D que elimina moldagens desconfortáveis.",
                icon: <Monitor className="w-5 h-5 text-royal-gold" />,
                bg: "bg-paper",
                textColor: "text-royal-blue",
                descColor: "text-royal-blue/60"
              },
              {
                title: "Biossegurança",
                description: "Protocolos internacionais de esterilização e segurança.",
                icon: <ShieldCheck className="w-5 h-5 text-royal-blue" />,
                bg: "bg-royal-gold",
                textColor: "text-royal-blue",
                descColor: "text-royal-blue/70"
              }
            ].map((item, idx) => (
              <div 
                key={idx} 
                className={`${item.bg} ${item.textColor} p-6 rounded-[32px] w-[260px] md:w-[280px] shrink-0 shadow-lg border border-royal-blue/5 flex flex-col gap-3 relative overflow-hidden group`}
              >
                {item.bgImage && (
                  <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity">
                    <img src={item.bgImage} className="w-full h-full object-cover" alt="" />
                  </div>
                )}
                <h4 className="text-lg font-black uppercase tracking-tight leading-tight relative z-10">
                  {item.title}
                </h4>
                <div className="flex items-center gap-3 relative z-10">
                  <div className="bg-white/10 p-2 rounded-xl shrink-0">
                    {item.icon}
                  </div>
                  <p className={`${item.descColor} text-[11px] leading-snug font-medium`}>
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FAQ Section - Elementor Style */}
      <section className="py-32 bg-paper">
        <div className="max-w-4xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-20">
            <h2 className="text-royal-gold font-black uppercase tracking-[0.3em] text-sm mb-4">Dúvidas Frequentes</h2>
            <h3 className="text-4xl md:text-6xl font-black text-royal-blue">FAQ</h3>
          </div>

          <div className="space-y-4">
            {[
              { q: "O tratamento para enxaqueca dói?", a: "Não! Utilizamos técnicas minimamente invasivas e laserterapia para garantir o máximo conforto durante e após o procedimento." },
              { q: "Quanto tempo dura o tratamento?", a: "Cada caso é único, mas muitos pacientes sentem alívio imediato já nas primeiras sessões do nosso protocolo exclusivo." },
              { q: "A clínica aceita convênios?", a: "Trabalhamos no sistema de reembolso e atendimento particular VIP, garantindo a melhor tecnologia e tempo dedicado a você." },
              { 
                q: "Onde a clínica está localizada?", 
                a: (
                  <div className="space-y-4">
                    <p>
                      Estamos localizados na <strong>Av. Independência, Qd 26 LT. 10 Sala 02 - Jardim Ipiranga, Aparecida de Goiânia - GO</strong> (em frente ao Colégio Irmã Angélica).
                    </p>
                    <p>
                      Contamos com fácil acesso e estacionamento privativo para sua comodidade.
                    </p>
                    <a 
                      href="#contato" 
                      className="inline-flex items-center gap-2 text-royal-blue font-bold hover:underline"
                    >
                      <MapPin className="w-4 h-4" />
                      Ver mapa e informações detalhadas
                    </a>
                  </div>
                )
              }
            ].map((item, idx) => (
              <details key={idx} className="group bg-white rounded-3xl border border-royal-blue/5 overflow-hidden transition-all">
                <summary className="flex items-center justify-between p-8 cursor-pointer list-none">
                  <span className="text-xl font-black text-royal-blue">{item.q}</span>
                  <div className="w-10 h-10 rounded-full bg-royal-blue/5 flex items-center justify-center group-open:rotate-180 transition-transform">
                    <ChevronRight className="w-5 h-5 rotate-90" />
                  </div>
                </summary>
                <div className="px-8 pb-8 text-royal-blue/60 leading-relaxed">
                  {item.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Guarantee Section - Horizontal Marquee */}
      <section className="py-24 bg-royal-blue text-white overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
          <ShieldCheck className="w-[800px] h-[800px] absolute -top-40 -right-40" />
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-12 mb-16 relative z-10">
          <div className="text-center md:text-left">
            <h2 className="text-royal-gold font-black uppercase tracking-[0.3em] text-sm mb-4">Garantia de Satisfação</h2>
            <h3 className="text-4xl md:text-5xl font-black leading-tight">Seu Sorriso em <span className="text-royal-gold">Boas Mãos</span></h3>
          </div>
        </div>

        <div className="relative z-10">
          <motion.div 
            className="flex gap-6 w-max px-6"
            animate={{ x: [0, -1400] }}
            transition={{ 
              ease: "linear", 
              duration: 30, 
              repeat: Infinity 
            }}
          >
            {[
              {
                title: "Resultados Reais",
                description: "Não entregamos apenas tratamentos, entregamos resultados que transformam vidas.",
                icon: <ShieldCheck className="w-8 h-8 text-royal-blue" />,
                bg: "bg-white/5 backdrop-blur-xl border border-white/10"
              },
              {
                title: "Tecnologia Suíça",
                description: "Equipamentos de última geração para precisão absoluta em cada detalhe.",
                icon: <Zap className="w-8 h-8 text-royal-blue" />,
                bg: "bg-royal-gold/10 border border-royal-gold/20"
              },
              {
                title: "Conforto Total",
                description: "Protocolos exclusivos para um atendimento indolor e relaxante.",
                icon: <Smile className="w-8 h-8 text-royal-blue" />,
                bg: "bg-white/5 backdrop-blur-xl border border-white/10"
              },
              {
                title: "Biossegurança",
                description: "Protocolos internacionais de esterilização para sua total segurança.",
                icon: <ShieldCheck className="w-8 h-8 text-royal-blue" />,
                bg: "bg-royal-gold/10 border border-royal-gold/20"
              },
              // Duplicando para loop
              {
                title: "Resultados Reais",
                description: "Não entregamos apenas tratamentos, entregamos resultados que transformam vidas.",
                icon: <ShieldCheck className="w-8 h-8 text-royal-blue" />,
                bg: "bg-white/5 backdrop-blur-xl border border-white/10"
              },
              {
                title: "Tecnologia Suíça",
                description: "Equipamentos de última geração para precisão absoluta em cada detalhe.",
                icon: <Zap className="w-8 h-8 text-royal-blue" />,
                bg: "bg-royal-gold/10 border border-royal-gold/20"
              },
              {
                title: "Conforto Total",
                description: "Protocolos exclusivos para um atendimento indolor e relaxante.",
                icon: <Smile className="w-8 h-8 text-royal-blue" />,
                bg: "bg-white/5 backdrop-blur-xl border border-white/10"
              },
              {
                title: "Biossegurança",
                description: "Protocolos internacionais de esterilização para sua total segurança.",
                icon: <ShieldCheck className="w-8 h-8 text-royal-blue" />,
                bg: "bg-royal-gold/10 border border-royal-gold/20"
              }
            ].map((item, idx) => (
              <div 
                key={idx} 
                className={`${item.bg} p-6 rounded-[32px] w-[280px] md:w-[350px] shrink-0 flex items-center gap-4 group hover:border-royal-gold/50 transition-all`}
              >
                <div className="w-16 h-16 shrink-0 bg-royal-gold rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  {item.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-base md:text-lg font-black mb-1 uppercase tracking-tight break-words leading-tight">
                    {item.title}
                  </h4>
                  <p className="text-white/60 text-[10px] md:text-xs leading-relaxed line-clamp-2">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-12 mt-16 text-center md:text-left relative z-10">
          <a 
            href="https://wa.me/5562981685668?text=Olá!%20Gostaria%20de%20marcar%20uma%20consulta,%20vim%20pelo%20site." 
            className="inline-flex items-center gap-4 bg-royal-gold text-royal-blue px-10 py-5 rounded-2xl font-black text-lg hover:scale-105 transition-transform shadow-2xl"
          >
            AGENDAR MINHA AVALIAÇÃO AGORA
            <ChevronRight className="w-6 h-6" />
          </a>
        </div>
      </section>

      {/* Google Maps Style Location Section */}
      <section id="contato" className="py-24 bg-paper">
        <div className="max-w-3xl mx-auto px-4">
          <div className="bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-gray-100">
            {/* Maps Header */}
            <div className="p-6 pb-4">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-3xl font-medium text-gray-900 mb-1">Royal Odontologia</h2>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-gray-900">5,0</span>
                    <div className="flex text-[#F4B400]">
                      {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 fill-current" />)}
                    </div>
                    <span className="text-sm text-gray-500">(5)</span>
                  </div>
                  <div className="text-sm text-gray-500 mb-1">Dentista</div>
                  <div className="text-sm">
                    <span className="text-[#188038] font-medium">Aberto</span>
                    <span className="text-gray-500"> · Abre seg. a sab. às 08:30</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200">
                    <Bookmark className="w-5 h-5" />
                  </button>
                  <button className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200">
                    <Share2 className="w-5 h-5" />
                  </button>
                  <button className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                <a href="https://maps.app.goo.gl/q5jC7X8NDpdpBxQt5" target="_blank" className="flex items-center gap-2 bg-[#1A73E8] text-white px-4 py-2 rounded-full text-sm font-medium shrink-0">
                  <Navigation className="w-4 h-4 fill-current" />
                  Rotas
                </a>
                <button className="flex items-center gap-2 bg-white border border-gray-200 text-[#1A73E8] px-4 py-2 rounded-full text-sm font-medium shrink-0">
                  <Play className="w-4 h-4 fill-current" />
                  Iniciar
                </button>
                <a href="tel:+5562981685668" className="flex items-center gap-2 bg-white border border-gray-200 text-[#1A73E8] px-4 py-2 rounded-full text-sm font-medium shrink-0">
                  <Phone className="w-4 h-4 fill-current" />
                  Ligar
                </a>
                <button className="flex items-center gap-2 bg-white border border-gray-200 text-[#1A73E8] px-4 py-2 rounded-full text-sm font-medium shrink-0">
                  <Bookmark className="w-4 h-4" />
                  Salvar
                </button>
              </div>
            </div>

            {/* Photo Gallery */}
            <div className="flex gap-2 overflow-x-auto px-6 mb-6 no-scrollbar">
              <div className="w-[240px] h-[300px] rounded-2xl overflow-hidden shrink-0 shadow-md">
                <img src="https://i.postimg.cc/6pks8cHG/Screenshot-20260306-213408.jpg" className="w-full h-full object-cover" alt="Entrada Principal" />
              </div>
              <div className="flex flex-col gap-2 shrink-0">
                <div className="w-[160px] h-[146px] rounded-2xl overflow-hidden">
                  <img src="https://i.postimg.cc/YjyHDwf3/Screenshot-20260306-213412.jpg" className="w-full h-full object-cover" alt="Consultório" />
                </div>
                <div className="w-[160px] h-[146px] rounded-2xl overflow-hidden">
                  <img src="https://i.postimg.cc/6T1XbNLz/Screenshot-20260306-213415.jpg" className="w-full h-full object-cover" alt="Sala de Espera" />
                </div>
              </div>
              <div className="w-[240px] h-[300px] rounded-2xl overflow-hidden shrink-0">
                <img src="https://i.postimg.cc/vDSs2dL3/Screenshot-20260306-213422.jpg" className="w-full h-full object-cover" alt="Fachada" />
              </div>
              <div className="w-[240px] h-[300px] rounded-2xl overflow-hidden shrink-0">
                <img src="https://i.postimg.cc/23XD9fF0/Screenshot-20260306-213417.jpg" className="w-full h-full object-cover" alt="Logo" />
              </div>
              <div className="w-[240px] h-[300px] rounded-2xl overflow-hidden shrink-0">
                <img src="https://i.postimg.cc/s10rHR9n/Screenshot-20260306-213419-2.jpg" className="w-full h-full object-cover" alt="Recepção" />
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-100 px-6 mb-4 overflow-x-auto no-scrollbar whitespace-nowrap">
              {['Geral', 'Serviços', 'Avaliações', 'Fotos'].map((tab, i) => (
                <button key={tab} className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors shrink-0 ${i === 0 ? 'text-[#1A73E8] border-[#1A73E8]' : 'text-gray-500 border-transparent'}`}>
                  {tab}
                </button>
              ))}
            </div>

            {/* Info Rows */}
            <div className="px-6 pb-8 space-y-6">
              <div className="flex items-center gap-6">
                <div className="w-10 h-10 flex items-center justify-center text-gray-400">
                  <Clock className="w-6 h-6" />
                </div>
                <div className="flex-1 flex items-center justify-between">
                  <div className="text-sm">
                    <span className="text-[#188038] font-medium">Aberto</span>
                    <span className="text-gray-700"> · Abre seg. a sab. às 08:30</span>
                  </div>
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="w-10 h-10 flex items-center justify-center text-gray-400">
                  <MapPin className="w-6 h-6" />
                </div>
                <div className="text-sm text-gray-700">
                  Av. Independência, Qd 26 LT. 10 Sala 02 - Jardim Ipiranga, Aparecida de Goiânia - GO (Em frente ao Colégio Irmã Angélica)
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer - Elementor Style */}
      <footer className="bg-royal-blue py-20 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
          <div className="grid md:grid-cols-4 gap-16 mb-20">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-32 h-32 md:w-40 md:h-40 bg-white rounded-full flex items-center justify-center overflow-hidden shadow-2xl border-4 border-royal-gold/30 shrink-0 p-1">
                  <img 
                    src="https://i.postimg.cc/jdq5fcj2/unnamed-(1).jpg" 
                    alt="Royal Odontologia Logo" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div>
                  <span className="font-black text-2xl block tracking-tighter uppercase">ROYAL ODONTOLOGIA</span>
                  <span className="text-royal-gold text-[10px] uppercase tracking-[0.4em] font-black">Excelência em Aparecida de Goiânia</span>
                </div>
              </div>
              <p className="text-white/40 text-lg leading-relaxed max-w-md mb-10">
                Referência em odontologia digital e tratamentos de alta complexidade. Tecnologia suíça e atendimento VIP para você.
              </p>
              <div className="flex gap-4">
                <a href="#" className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center hover:bg-royal-gold hover:text-royal-blue transition-all">
                  <Instagram className="w-6 h-6" />
                </a>
                <a href="https://wa.me/5562981685668?text=Olá!%20Gostaria%20de%20marcar%20uma%20consulta,%20vim%20pelo%20site." className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center hover:bg-royal-gold hover:text-royal-blue transition-all">
                  <MessageSquare className="w-6 h-6" />
                </a>
              </div>
            </div>

            <div>
              <h5 className="font-black text-xl mb-8 uppercase tracking-widest text-royal-gold">Links Úteis</h5>
              <ul className="space-y-4 text-white/40 font-bold">
                <li><a href="#inicio" className="hover:text-royal-gold transition-colors">Início</a></li>
                <li><a href="#tratamentos" className="hover:text-royal-gold transition-colors">Tratamentos</a></li>
                <li><a href="#especialidades" className="hover:text-royal-gold transition-colors">Especialidades</a></li>
                <li><a href="#diferenciais" className="hover:text-royal-gold transition-colors">Diferenciais</a></li>
              </ul>
            </div>

            <div>
              <h5 className="font-black text-xl mb-8 uppercase tracking-widest text-royal-gold">Contato</h5>
              <ul className="space-y-6 text-white/40 font-bold">
                <li className="flex gap-4">
                  <MapPin className="w-5 h-5 text-royal-gold shrink-0" />
                  <span className="text-sm">Av. Independência Qd. 26 LT. 10 Sala 02, Aparecida de Goiânia - GO (Em frente ao Colégio Irmã Angélica)</span>
                </li>
                <li className="flex gap-4">
                  <Phone className="w-5 h-5 text-royal-gold shrink-0" />
                  <span className="text-sm">(62) 98168-5668</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.2em]">© 2024 Royal Odontologia. Todos os direitos reservados. CRO 12843.</p>
            <div className="flex gap-8 text-white/20 text-[10px] font-black uppercase tracking-[0.2em]">
              <a href="#" className="hover:text-white transition-colors">Privacidade</a>
              <a href="#" className="hover:text-white transition-colors">Termos</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Chatbot */}
      <div className="fixed bottom-8 right-8 z-[100]">
        <AnimatePresence>
          {isChatOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="absolute bottom-28 right-0 w-[calc(100vw-2rem)] sm:w-[450px] max-w-[500px] h-[70vh] sm:h-[600px] bg-paper rounded-[2rem] sm:rounded-[3rem] shadow-2xl border border-royal-blue/5 flex flex-col overflow-hidden"
            >
              {/* Chat Header */}
              <div className="bg-royal-blue p-6 sm:p-10 text-paper flex justify-between items-center">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center overflow-hidden border-2 border-royal-gold/30">
                    <img 
                      src="https://i.postimg.cc/jdq5fcj2/unnamed-(1).jpg" 
                      alt="Royal Odontologia" 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div>
                    <h4 className="font-serif text-2xl font-light">Royal Odontologia</h4>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-royal-gold rounded-full animate-pulse"></div>
                      <span className="text-[10px] text-paper/50 uppercase tracking-[0.3em] font-bold">Online Agora</span>
                    </div>
                  </div>
                </div>
                <button onClick={() => setIsChatOpen(false)} className="hover:bg-paper/10 p-3 rounded-full transition-colors">
                  <X className="w-8 h-8" />
                </button>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-6 sm:p-10 space-y-6 sm:space-y-8 bg-paper/50">
                {chatMessages.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[90%] sm:max-w-[85%] p-4 sm:p-6 rounded-[1.5rem] sm:rounded-[2rem] text-base sm:text-lg leading-relaxed ${
                      msg.role === 'user' 
                        ? 'bg-royal-blue text-paper rounded-tr-none' 
                        : 'bg-white text-royal-blue border border-royal-blue/5 rounded-tl-none shadow-sm'
                    }`}>
                      <Markdown>{msg.text}</Markdown>
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-white p-6 rounded-[2rem] rounded-tl-none border border-royal-blue/5 flex gap-2">
                      <div className="w-2 h-2 bg-royal-gold rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-royal-gold rounded-full animate-bounce [animation-delay:0.2s]"></div>
                      <div className="w-2 h-2 bg-royal-gold rounded-full animate-bounce [animation-delay:0.4s]"></div>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Chat Input */}
              <div className="p-3 sm:p-8 bg-white border-t border-royal-blue/5 flex gap-2 sm:gap-4 items-center">
                <input 
                  type="text" 
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Como podemos elevar seu sorriso?"
                  className="flex-1 bg-paper border-none rounded-full px-4 sm:px-8 py-3 sm:py-5 text-sm sm:text-lg focus:ring-2 focus:ring-royal-gold transition-all min-w-0"
                />
                <button 
                  onClick={handleSendMessage}
                  className="bg-royal-blue text-paper p-3 sm:p-5 rounded-full hover:bg-royal-gold hover:text-royal-blue transition-all shrink-0"
                >
                  <Send className="w-5 h-5 sm:w-7 h-7" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="w-16 h-16 md:w-20 md:h-20 bg-royal-blue text-paper rounded-full flex items-center justify-center relative group overflow-hidden shadow-2xl"
        >
          <div className="absolute inset-0 bg-royal-gold opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          {isChatOpen ? <X className="w-7 h-7 md:w-8 md:h-8 relative z-10 group-hover:text-royal-blue transition-colors" /> : <MessageSquare className="w-7 h-7 md:w-8 md:h-8 relative z-10 group-hover:text-royal-blue transition-colors" />}
        </motion.button>
      </div>

      {/* WhatsApp Button */}
      <a 
        href="https://wa.me/5562981685668?text=Olá!%20Gostaria%20de%20marcar%20uma%20consulta,%20vim%20pelo%20site." 
        target="_blank"
        className="fixed bottom-8 left-8 z-[100] w-16 h-16 md:w-20 md:h-20 bg-[#25D366] text-white rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-2xl group"
      >
        <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity rounded-full"></div>
        <Phone className="w-7 h-7 md:w-8 md:h-8" />
      </a>
    </div>
  );
}
