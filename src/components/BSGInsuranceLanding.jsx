import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowRight, 
  FileText, 
  Clock, 
  Brain,
  Users,
  TrendingDown,
  RefreshCw,
  Mail,
  AlertCircle,
  ChevronDown,
  Play,
  Pause,
  RotateCcw,
  CheckCircle,
  Target,
  BarChart3
} from 'lucide-react';

const BSGInsuranceLanding = () => {
  const [activeTimelineItem, setActiveTimelineItem] = useState(null);
  const [visibleSection, setVisibleSection] = useState('hero');
  const [isLifeAnimating, setIsLifeAnimating] = useState(false);
  const [counters, setCounters] = useState({ admin: 0, chasing: 0, compliance: 0, actual: 0 });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSection(entry.target.id);
          }
        });
      },
      { threshold: 0.3 }
    );

    const sections = document.querySelectorAll('section[id]');
    sections.forEach(section => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  // Animate counters when timeline section is visible
  useEffect(() => {
    if (visibleSection === 'timeline') {
      const targets = { admin: 20, chasing: 25, compliance: 15, actual: 40 };
      
      Object.keys(targets).forEach(key => {
        const target = targets[key];
        let current = 0;
        const increment = target / 60;
        
        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            current = target;
            clearInterval(timer);
          }
          setCounters(prev => ({ ...prev, [key]: Math.floor(current) }));
        }, 25);
      });
    }
  }, [visibleSection]);

  const timelineData = [
    { 
      key: 'admin',
      percentage: 20, 
      label: "Policy Processing", 
      description: "Manual data entry, document handling, PDF processing",
      color: "text-red-700", 
      bg: "bg-red-50",
      icon: FileText,
      hoverColor: "hover:bg-red-100"
    },
    { 
      key: 'chasing',
      percentage: 25, 
      label: "Client Follow-ups", 
      description: "Renewal tracking, birthday calls, policy reviews",
      color: "text-amber-700", 
      bg: "bg-amber-50",
      icon: RefreshCw,
      hoverColor: "hover:bg-amber-100"
    },
    { 
      key: 'compliance',
      percentage: 15, 
      label: "Compliance Work", 
      description: "UAE DPDPA reporting, documentation, regulatory tasks",
      color: "text-orange-700", 
      bg: "bg-orange-50",
      icon: AlertCircle,
      hoverColor: "hover:bg-orange-100"
    },
    { 
      key: 'actual',
      percentage: 40, 
      label: "Client Relations", 
      description: "Building relationships, closing deals, strategic growth",
      color: "text-emerald-700", 
      bg: "bg-emerald-50",
      icon: Brain,
      hoverColor: "hover:bg-emerald-100"
    }
  ];

  const inefficiencyAreas = [
    { 
      icon: FileText, 
      title: "Policy Document Chaos", 
      description: "Hours spent manually entering data from PDF applications and policy documents",
      impact: "3-4 hours daily"
    },
    { 
      icon: AlertCircle, 
      title: "Compliance Documentation Hell", 
      description: "UAE DPDPA requirements, regulatory reporting, endless paperwork",
      impact: "1-2 days monthly"
    },
    { 
      icon: RefreshCw, 
      title: "Client Follow-up Gaps", 
      description: "Missed renewal opportunities, birthday calls, policy review schedules",
      impact: "20-30% revenue loss"
    },
    { 
      icon: BarChart3, 
      title: "Commission Reconciliation", 
      description: "Spreadsheet nightmares, manual calculations, tracking errors",
      impact: "5-10% discrepancies"
    },
    { 
      icon: Mail, 
      title: "Endless Administrative Tasks", 
      description: "Email management, appointment scheduling, data updates",
      impact: "2-3 hours daily"
    },
    { 
      icon: Users, 
      title: "Staff Training & Turnover", 
      description: "Constant hiring, training costs, knowledge gaps when employees leave",
      impact: "30-50k AED annually"
    }
  ];

  const LifeGrid = () => {
    const totalDays = 365; // Full year
    const inefficientDays = Math.floor(totalDays * 0.6); // 60% inefficient

    return (
      <div className="relative">
        <div className="grid grid-cols-20 gap-1 max-w-4xl mx-auto mb-8">
          {Array.from({ length: totalDays }, (_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-sm transition-all duration-500 ${
                isLifeAnimating
                  ? i < inefficientDays
                    ? 'bg-red-500 shadow-sm'
                    : 'bg-emerald-500 shadow-sm'
                  : 'bg-gray-200'
              }`}
              style={{
                animationDelay: isLifeAnimating ? `${i * 3}ms` : '0ms'
              }}
            />
          ))}
        </div>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-8 mb-8 text-sm">
          <div className="flex items-center justify-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <span className="text-slate-600">Admin-Heavy Days (60%)</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <div className="w-4 h-4 bg-emerald-500 rounded"></div>
            <span className="text-slate-600">Client-Focused Days (40%)</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={() => setIsLifeAnimating(!isLifeAnimating)}
            className="bg-slate-800 text-white px-6 py-3 rounded-lg hover:bg-slate-700 transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 shadow-lg"
          >
            {isLifeAnimating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {isLifeAnimating ? 'Pause Animation' : 'Visualize Your Year'}
          </button>
          <button
            onClick={() => setIsLifeAnimating(false)}
            className="border border-slate-300 text-slate-700 px-6 py-3 rounded-lg hover:bg-slate-50 transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-stone-50 text-slate-800">
      
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-md border-b border-stone-200 z-50 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="font-semibold text-slate-800">BSG Support</div>
          <div className="hidden md:flex gap-8 text-sm">
            <a href="#timeline" className="text-slate-600 hover:text-slate-800 transition-colors">Reality Check</a>
            <a href="#waste" className="text-slate-600 hover:text-slate-800 transition-colors">Hidden Costs</a>
            <a href="#solution" className="text-slate-600 hover:text-slate-800 transition-colors">Solution</a>
          </div>
          <button className="bg-slate-800 text-white px-6 py-2 rounded-lg text-sm hover:bg-slate-700 transition-all duration-300 hover:scale-105 shadow-lg">
            Get Your Audit
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="hero" className="pt-24 pb-16 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-emerald-50 opacity-60"></div>
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-light text-slate-800 mb-6 leading-tight">
            Your Insurance Business Is 
            <span className="block font-medium text-slate-700 mt-2 bg-gradient-to-r from-red-600 to-amber-600 bg-clip-text text-transparent">
              Drowning in Admin Work
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            While you're processing policies and chasing renewals in the UAE market, 
            your competitors are growing. See the hidden cost of inefficiency.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <button className="group bg-slate-800 text-white px-8 py-4 rounded-lg hover:bg-slate-700 transition-all duration-300 hover:scale-105 hover:shadow-xl flex items-center justify-center gap-2">
              Discover Your Hidden Costs
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="border border-slate-300 text-slate-700 px-8 py-4 rounded-lg hover:bg-slate-50 transition-all duration-300 hover:scale-105 hover:shadow-lg">
              Free Efficiency Audit
            </button>
          </div>

          <div className="flex justify-center animate-bounce">
            <ChevronDown className="w-6 h-6 text-slate-400" />
          </div>
        </div>
      </section>

      {/* Timeline Section - Insurance Broker's Reality */}
      <section id="timeline" className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-light mb-6 text-slate-800">
              An Insurance Broker's Day — The Reality
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              In the UAE insurance market, where time is commission and relationships are everything, 
              here's where your energy actually goes.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {timelineData.map((item, index) => (
              <div
                key={index}
                className={`${item.bg} rounded-2xl p-8 text-center border border-stone-200 transition-all duration-500 cursor-pointer ${item.hoverColor} hover:shadow-xl hover:scale-105 hover:-translate-y-2`}
                onMouseEnter={() => setActiveTimelineItem(index)}
                onMouseLeave={() => setActiveTimelineItem(null)}
              >
                <div className="flex justify-center mb-6">
                  <div className={`w-16 h-16 rounded-full bg-white shadow-lg flex items-center justify-center transition-all duration-300 ${
                    activeTimelineItem === index ? 'scale-110 shadow-xl' : ''
                  }`}>
                    <item.icon className={`w-8 h-8 ${item.color}`} />
                  </div>
                </div>
                
                <div className={`text-5xl font-light mb-4 ${item.color} transition-all duration-300 ${
                  activeTimelineItem === index ? 'scale-110' : ''
                }`}>
                  {counters[item.key]}%
                </div>
                
                <div className="text-lg font-semibold text-slate-800 mb-3">{item.label}</div>
                <div className="text-sm text-slate-600 leading-relaxed">{item.description}</div>
              </div>
            ))}
          </div>
          
          <div className="bg-gradient-to-r from-red-50 to-amber-50 rounded-2xl p-8 md:p-12 text-center border border-red-200 shadow-lg">
            <div className="max-w-3xl mx-auto">
              <p className="text-2xl md:text-3xl text-slate-800 mb-4 leading-relaxed">
                Only <span className="font-bold text-emerald-700 text-4xl">40%</span> of your time 
                goes to what actually grows your business.
              </p>
              <p className="text-lg text-slate-600">
                The rest? Administrative tasks that could be automated or delegated. 
                In the competitive UAE insurance market, this inefficiency is costing you clients.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Hidden Inefficiency Areas */}
      <section id="waste" className="py-20 px-6 bg-stone-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-light mb-6 text-slate-800">
              The Mountain of Hidden Inefficiencies
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Each day, these inefficiencies compound. What starts as "just a few tasks" 
              becomes a mountain that buries your growth potential.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {inefficiencyAreas.map((area, index) => (
              <div 
                key={index} 
                className="bg-white rounded-xl p-8 border border-stone-200 hover:shadow-xl transition-all duration-500 hover:scale-105 hover:-translate-y-2 group"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 group-hover:bg-red-200 transition-colors duration-300">
                    <area.icon className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800 mb-2">{area.title}</h3>
                    <p className="text-slate-600 text-sm leading-relaxed mb-3">{area.description}</p>
                    <div className="inline-block bg-red-50 text-red-700 px-3 py-1 rounded-full text-xs font-medium">
                      Impact: {area.impact}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="bg-white rounded-xl p-8 border-l-4 border-red-500 shadow-lg">
            <div className="text-center">
              <p className="text-2xl md:text-3xl text-slate-800 italic mb-4">
                "Every hour spent on admin is an hour not spent growing your client base."
              </p>
              <p className="text-lg text-slate-600">
                In the UAE's competitive insurance landscape, this inefficiency 
                isn't just costing money — it's costing market share.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Business Life Visualization */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-light mb-6 text-slate-800">
            Your Business Year, Visualized
          </h2>
          <p className="text-xl text-slate-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            Each square represents a working day in your insurance business. 
            See how inefficiency compounds over time — and what you could accomplish instead.
          </p>
          
          <div className="bg-slate-50 rounded-2xl p-8 md:p-12 border border-stone-200 shadow-lg">
            <LifeGrid />
            
            <div className="bg-white rounded-xl p-8 mt-8 border border-stone-200">
              <p className="text-xl md:text-2xl text-slate-800 mb-4">
                Every red day is a day you're working IN your business instead of ON it.
              </p>
              <p className="text-lg text-slate-600">
                Imagine if 60% of your year was spent building client relationships, 
                developing new products, and growing your market presence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Turning Point */}
      <section className="py-16 px-6 bg-slate-800 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-full px-8 py-4 mb-8 border border-white/20">
            <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
            <span className="font-medium">The moment you take control</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-light mb-6 leading-relaxed">
            Stop accepting this mountain of inefficiency as normal.
          </h2>
          
          <p className="text-xl text-slate-300 mb-8">
            BSG Support specializes in taking that mountain down.
          </p>
        </div>
      </section>

      {/* Solution Section */}
      <section id="solution" className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-light mb-6 text-slate-800">
              We Take The Mountain Down
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              BSG Support transforms your insurance operations with UAE-compliant, 
              AI-augmented solutions designed specifically for the MENA insurance market.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-light mb-8 text-slate-800">How We Transform Your Operations</h3>
              <div className="space-y-6">
                <div className="flex gap-4 p-4 rounded-lg hover:bg-stone-50 transition-colors duration-300">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="w-5 h-5 text-emerald-700" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800 mb-2">Dedicated Insurance Specialists</h4>
                    <p className="text-slate-600">UAE-trained professionals who understand insurance workflows and compliance requirements.</p>
                  </div>
                </div>
                
                <div className="flex gap-4 p-4 rounded-lg hover:bg-stone-50 transition-colors duration-300">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-1">
                    <Target className="w-5 h-5 text-blue-700" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800 mb-2">AI-Powered Document Processing</h4>
                    <p className="text-slate-600">OCR technology for Arabic/English documents, automated data entry, policy processing.</p>
                  </div>
                </div>
                
                <div className="flex gap-4 p-4 rounded-lg hover:bg-stone-50 transition-colors duration-300">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 mt-1">
                    <BarChart3 className="w-5 h-5 text-purple-700" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800 mb-2">Compliance-First Approach</h4>
                    <p className="text-slate-600">UAE DPDPA, GDPR, and insurance regulatory compliance built into every process.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-slate-50 rounded-2xl p-8 border border-stone-200">
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-6 bg-slate-800 rounded-xl flex items-center justify-center">
                  <Users className="w-10 h-10 text-white" />
                </div>
                <h4 className="text-xl font-semibold text-slate-800 mb-4">Three Business Models</h4>
                <div className="text-left space-y-4">
                  <div className="flex items-start gap-3 p-3 bg-white rounded-lg">
                    <CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-medium text-slate-800">Staff Augmentation</div>
                      <div className="text-sm text-slate-600">Full-time dedicated team members</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-white rounded-lg">
                    <CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-medium text-slate-800">Task-Based Support</div>
                      <div className="text-sm text-slate-600">Project work and specific deliverables</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-white rounded-lg">
                    <CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-medium text-slate-800">Packaged Solutions</div>
                      <div className="text-sm text-slate-600">Complete back-office operations</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-6 bg-gradient-to-br from-slate-800 to-slate-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-light mb-6 leading-tight">
            Ready to focus on growing your business 
            <span className="block text-emerald-400 font-normal">instead of drowning in admin?</span>
          </h2>
          <p className="text-xl text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Get a free efficiency audit of your insurance operations. 
            See exactly where you're losing time and money — and how to fix it.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:info@bsgsupport.com"
              className="bg-white text-slate-800 px-8 py-4 rounded-lg hover:bg-stone-100 transition-all duration-300 hover:scale-105 hover:shadow-xl font-semibold flex items-center justify-center gap-2"
            >
              Get Your Free Insurance Operations Audit
              <ArrowRight className="w-5 h-5" />
            </a>
            <button className="border border-white/30 text-white px-8 py-4 rounded-lg hover:bg-white/10 transition-all duration-300 hover:scale-105 backdrop-blur-sm">
              Calculate Your Hidden Costs
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-stone-100 border-t border-stone-200">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="font-semibold text-slate-800 mb-4 md:mb-0">BSG Support</div>
          <div className="text-sm text-slate-600 text-center md:text-right">
            <div>Specialized support for UAE insurance professionals</div>
            <div className="text-xs text-slate-500 mt-1">UAE DPDPA Compliant • ISO Standards • GDPR Ready</div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default BSGInsuranceLanding;
