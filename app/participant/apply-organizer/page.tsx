// 'use client';

// import { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { useAuth } from '@/app/providers/auth-provider';
// import { cn } from '@/app/lib/utils';
// import {
//   Building,
//   ChevronRight,
//   Gamepad2,
//   CheckCircle2,
//   Info,
//   ArrowLeft,
//   Loader2,
//   FileText,
//   Users,
//   ShieldCheck,
//   AlertCircle
// } from 'lucide-react';

// export default function OrganizerApplicationPage() {
//   const { user, submitOrganizerApplication } = useAuth();
//   const router = useRouter();
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [submitted, setSubmitted] = useState(false);

//   const [formData, setFormData] = useState({
//     fullName: user?.name || '',
//     email: user?.email || '',
//     mobile: user?.phone || '',
//     experience: '',
//     reason: '',
//     sampleTournament: '',
//   });

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!submitOrganizerApplication) return;

//     setIsSubmitting(true);
//     const success = await submitOrganizerApplication(formData);
//     setIsSubmitting(false);

//     if (success) {
//       setSubmitted(true);
//     }
//   };

//   if (submitted || user?.organizerApplication?.status === 'PENDING') {
//     return (
//       <div className="max-w-2xl mx-auto py-12 px-4">
//         <div className="bg-netflix-gray-900/50 border border-white/5 rounded-3xl p-10 text-center animate-in fade-in zoom-in duration-500">
//           <div className="w-20 h-20 bg-netflix-blue/10 rounded-full flex items-center justify-center mx-auto mb-8 shadow-glow-blue">
//             <Loader2 className="w-10 h-10 text-netflix-blue animate-spin" />
//           </div>
//           <h2 className="text-3xl font-black text-white italic uppercase tracking-widest mb-4 leading-tight">Application Pending</h2>
//           <p className="text-netflix-gray-400 font-medium mb-8 leading-relaxed">
//             Our admin team is currently reviewing your organizer application.
//             We check past history, identity, and abuse risk to maintain platform trust.
//           </p>
//           <div className="bg-netflix-black border border-white/5 rounded-2xl p-6 mb-8 text-left space-y-4">
//             <div className="flex items-center gap-3">
//               <CheckCircle2 className="w-5 h-5 text-live-green" />
//               <p className="text-sm text-netflix-gray-300">Identity check in progress</p>
//             </div>
//             <div className="flex items-center gap-3 opacity-50">
//               <div className="w-5 h-5 border-2 border-netflix-gray-700 rounded-full" />
//               <p className="text-sm text-netflix-gray-500">Reputation verification</p>
//             </div>
//             <div className="flex items-center gap-3 opacity-50">
//               <div className="w-5 h-5 border-2 border-netflix-gray-700 rounded-full" />
//               <p className="text-sm text-netflix-gray-500">Hosting rights activation</p>
//             </div>
//           </div>
//           <button
//             onClick={() => router.push('/participant/dashboard')}
//             className="w-full btn-repeat-primary py-4 text-base"
//           >
//             BACK TO DASHBOARD
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-4xl mx-auto py-12 px-4">
//       <div className="mb-12">
//         <button
//           onClick={() => router.back()}
//           className="inline-flex items-center gap-2 text-[10px] font-black text-netflix-gray-500 hover:text-white uppercase tracking-[0.2em] mb-8 transition-colors group"
//         >
//           <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
//           Return
//         </button>
//         <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
//           <div>
//             <div className="flex items-center gap-2 text-netflix-blue text-[10px] font-black uppercase tracking-[0.2em] mb-3">
//               <Building className="w-3 h-3" />
//               Host Evolution
//             </div>
//             <h1 className="text-4xl md:text-7xl font-black text-black italic tracking-widest uppercase leading-[0.9]">
//               BECOME AN<br />ORGANIZER
//             </h1>
//           </div>
//           <div className="bg-netflix-blue/10 border border-netflix-blue/20 rounded-2xl p-6 max-w-sm">
//             <p className="text-xs text-netflix-blue font-bold leading-relaxed">
//               Anyone can apply, but only trusted hosts can create tournaments. Build your reputation and scale your community.
//             </p>
//           </div>
//         </div>
//       </div>

//       <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
//         {/* Left Column: Form (8 cols) */}
//         <div className="lg:col-span-8 space-y-8">
//           <div className="bg-netflix-gray-900/50 border border-white/5 rounded-3xl p-8 backdrop-blur-sm space-y-8">

//             {/* Section 1: Contact */}
//             <div className="space-y-6">
//               <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-3 border-b border-white/5 pb-4">
//                 <Info className="w-4 h-4 text-netflix-blue" />
//                 Contact Information
//               </h3>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div className="space-y-2">
//                   <label className="text-[10px] font-black text-netflix-gray-500 uppercase tracking-widest">Full Name</label>
//                   <input
//                     required
//                     type="text"
//                     value={formData.fullName}
//                     onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
//                     className="w-full bg-netflix-black border border-white/5 rounded-xl py-4 px-5 text-white focus:outline-none focus:border-netflix-blue transition-all"
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <label className="text-[10px] font-black text-netflix-gray-500 uppercase tracking-widest">Email Address</label>
//                   <input
//                     required
//                     type="email"
//                     value={formData.email}
//                     onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//                     className="w-full bg-netflix-black border border-white/5 rounded-xl py-4 px-5 text-white focus:outline-none focus:border-netflix-blue transition-all"
//                   />
//                 </div>
//               </div>
//             </div>

//             {/* Section 2: Experience */}
//             <div className="space-y-6">
//               <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-3 border-b border-white/5 pb-4">
//                 <Gamepad2 className="w-4 h-4 text-live-green" />
//                 Experience & Vision
//               </h3>
//               <div className="space-y-6">
//                 <div className="space-y-2">
//                   <label className="text-[10px] font-black text-netflix-gray-500 uppercase tracking-widest">Past Organizing Experience (Optional)</label>
//                   <textarea
//                     rows={3}
//                     value={formData.experience}
//                     onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
//                     placeholder="List past events, communities or platforms you've used..."
//                     className="w-full bg-netflix-black border border-white/5 rounded-xl py-4 px-5 text-white focus:outline-none focus:border-live-green transition-all resize-none"
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <label className="text-[10px] font-black text-netflix-gray-500 uppercase tracking-widest">Why do you want to organize? (Required)</label>
//                   <textarea
//                     required
//                     rows={3}
//                     value={formData.reason}
//                     onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
//                     placeholder="Tell us about your community and goal..."
//                     className="w-full bg-netflix-black border border-white/5 rounded-xl py-4 px-5 text-white focus:outline-none focus:border-live-green transition-all resize-none"
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <label className="text-[10px] font-black text-netflix-gray-500 uppercase tracking-widest">Sample Tournament Draft (Match Type, Entry, Prize)</label>
//                   <input
//                     type="text"
//                     value={formData.sampleTournament}
//                     onChange={(e) => setFormData({ ...formData, sampleTournament: e.target.value })}
//                     placeholder="e.g. Classic Squad, ₹50 Entry, ₹5000 Prize"
//                     className="w-full bg-netflix-black border border-white/5 rounded-xl py-4 px-5 text-white focus:outline-none focus:border-live-green transition-all"
//                   />
//                 </div>
//               </div>
//             </div>

//             <button
//               type="submit"
//               disabled={isSubmitting}
//               className="w-full btn-repeat-primary py-5 text-lg flex items-center justify-center gap-3"
//             >
//               {isSubmitting ? (
//                 <Loader2 className="w-6 h-6 animate-spin" />
//               ) : (
//                 <>SUBMIT APPLICATION <ChevronRight className="w-6 h-6" /></>
//               )}
//             </button>
//           </div>
//         </div>

//         {/* Right Column: Benefits (4 cols) */}
//         <div className="lg:col-span-4 space-y-6">
//           <div className="bg-netflix-gray-900/50 border border-white/5 rounded-3xl p-8 sticky top-24">
//             <h4 className="text-xs font-black text-white uppercase tracking-widest mb-8 flex items-center gap-2">
//               <ShieldCheck className="w-4 h-4 text-netflix-red" />
//               Why Organize with Us?
//             </h4>
//             <div className="space-y-8">
//               <BenefitItem
//                 icon={<FileText className="text-netflix-blue" />}
//                 title="Technology Intermediary"
//                 desc="We handle the legal compliance and intermediary disclaimers so you can focus on the game."
//               />
//               <BenefitItem
//                 icon={<ShieldCheck className="text-live-green" />}
//                 title="Secure Escrow"
//                 desc="Platform collects all entry fees. Payouts are released only after result verification."
//               />
//               <BenefitItem
//                 icon={<Users className="text-purple-500" />}
//                 title="Automated Operations"
//                 desc="Automated room codes, points calculation, and slot management for zero chaos."
//               />
//             </div>

//             <div className="mt-10 p-4 bg-netflix-red/5 border border-netflix-red/20 rounded-2xl flex gap-3">
//               <AlertCircle className="w-5 h-5 text-netflix-red shrink-0" />
//               <p className="text-[10px] text-netflix-gray-500 leading-relaxed font-medium">
//                 Admin review typically takes <span className="text-netflix-red font-black">12-24 hours</span>. Please ensure your full name matches your bank account for future payouts.
//               </p>
//             </div>
//           </div>
//         </div>
//       </form>
//     </div>
//   );
// }

// function BenefitItem({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
//   return (
//     <div className="flex gap-4">
//       <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
//         {icon}
//       </div>
//       <div>
//         <p className="text-xs font-black text-white uppercase tracking-widest mb-1">{title}</p>
//         <p className="text-[10px] text-netflix-gray-500 leading-relaxed font-medium">{desc}</p>
//       </div>
//     </div>
//   );
// }











'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/providers/auth-provider'; 
import {
  Building,
  ChevronRight,
  Gamepad2,
  CheckCircle2,
  Info,
  ArrowLeft,
  Loader2,
  FileText,
  Users,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

export default function OrganizerApplicationPage() {
  const { user, submitOrganizerApplication } = useAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    mobile: user?.phone || '',
    experience: '',
    reason: '',
    sampleTournament: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!submitOrganizerApplication) return;

    setIsSubmitting(true);
    const success = await submitOrganizerApplication(formData);
    setIsSubmitting(false);

    if (success) {
      setSubmitted(true);
    }
  };

  // PENDING STATE VIEW (Light Mode)
  if (submitted || user?.organizerApplication?.status === 'PENDING') {
    return (
      <div className="min-h-screen bg-neutral-50 text-neutral-900 py-12 px-4 flex items-center justify-center">
        <div className="max-w-2xl w-full">
          <div className="bg-white border border-neutral-200 rounded-3xl p-10 text-center shadow-xl animate-in fade-in zoom-in duration-500">
            <div className="w-20 h-20 bg-blue-50 border border-blue-100 rounded-full flex items-center justify-center mx-auto mb-8">
              <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
            </div>
            <h2 className="text-3xl font-black text-neutral-900 italic uppercase tracking-widest mb-4 leading-tight">Application Pending</h2>
            <p className="text-neutral-500 font-medium mb-8 leading-relaxed">
              Our admin team is currently reviewing your organizer application.
              We check past history, identity, and abuse risk to maintain platform trust.
            </p>
            <div className="bg-neutral-50 border border-neutral-100 rounded-2xl p-6 mb-8 text-left space-y-4">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <p className="text-sm text-neutral-600">Identity check in progress</p>
              </div>
              <div className="flex items-center gap-3 opacity-50">
                <div className="w-5 h-5 border-2 border-neutral-300 rounded-full" />
                <p className="text-sm text-neutral-500">Reputation verification</p>
              </div>
              <div className="flex items-center gap-3 opacity-50">
                <div className="w-5 h-5 border-2 border-neutral-300 rounded-full" />
                <p className="text-sm text-neutral-500">Hosting rights activation</p>
              </div>
            </div>
            <button
              onClick={() => router.push('/participant/dashboard')}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl py-4 text-base transition-colors shadow-lg shadow-blue-600/20"
            >
              BACK TO DASHBOARD
            </button>
          </div>
        </div>
      </div>
    );
  }

  // MAIN FORM VIEW (Light Mode)
  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 py-12 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Area */}
        <div className="mb-12">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-[10px] font-black text-neutral-400 hover:text-neutral-900 uppercase tracking-[0.2em] mb-8 transition-colors group"
          >
            <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
            Return
          </button>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div>
              <div className="flex items-center gap-2 text-blue-600 text-[10px] font-black uppercase tracking-[0.2em] mb-3">
                <Building className="w-3 h-3" />
                Host Evolution
              </div>
              <h1 className="text-4xl md:text-7xl font-black text-neutral-900 italic tracking-widest uppercase leading-[0.9]">
                BECOME AN<br />ORGANIZER
              </h1>
            </div>
            <div className="bg-white border border-blue-100 rounded-2xl p-6 max-w-sm shadow-sm">
              <p className="text-xs text-blue-600 font-bold leading-relaxed">
                Anyone can apply, but only trusted hosts can create tournaments. Build your reputation and scale your community.
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Form (8 cols) */}
          <div className="lg:col-span-8 space-y-8">
            <div className="bg-white border border-neutral-200 rounded-3xl p-8 shadow-xl shadow-neutral-200/50 space-y-8">

              {/* Section 1: Contact */}
              <div className="space-y-6">
                <h3 className="text-sm font-black text-neutral-900 uppercase tracking-widest flex items-center gap-3 border-b border-neutral-100 pb-4">
                  <Info className="w-4 h-4 text-blue-600" />
                  Contact Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">Full Name</label>
                    <input
                      required  
                      type="text"
                      value={formData.fullName}
                      placeholder="Enter your full name"
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full bg-neutral-50 border border-neutral-200 rounded-xl py-4 px-5 text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">Email Address</label>
                    <input
                      required
                      type="email"
                      value={formData.email}
                      placeholder="Enter your email address"
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-neutral-50 border border-neutral-200 rounded-xl py-4 px-5 text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Experience */}
              <div className="space-y-6">
                <h3 className="text-sm font-black text-neutral-900 uppercase tracking-widest flex items-center gap-3 border-b border-neutral-100 pb-4">
                  <Gamepad2 className="w-4 h-4 text-emerald-600" />
                  Experience & Vision
                </h3>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">Past Organizing Experience (Optional)</label>
                    <textarea
                      rows={3}
                      value={formData.experience}
                      onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                      placeholder="List past events, communities or platforms you've used..."
                      className="w-full bg-neutral-50 border border-neutral-200 rounded-xl py-4 px-5 text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all resize-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">Why do you want to organize? (Required)</label>
                    <textarea
                      required
                      rows={3}
                      value={formData.reason}
                      onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                      placeholder="Tell us about your community and goal..."
                      className="w-full bg-neutral-50 border border-neutral-200 rounded-xl py-4 px-5 text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all resize-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">Sample Tournament Draft (Match Type, Entry, Prize)</label>
                    <input
                      type="text"
                      value={formData.sampleTournament}
                      onChange={(e) => setFormData({ ...formData, sampleTournament: e.target.value })}
                      placeholder="e.g. Classic Squad, ₹50 Entry, ₹5000 Prize"
                      className="w-full bg-neutral-50 border border-neutral-200 rounded-xl py-4 px-5 text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-neutral-900 hover:bg-black text-white font-black rounded-xl py-5 text-lg flex items-center justify-center gap-3 transition-colors uppercase tracking-wider shadow-lg shadow-neutral-900/20"
              >
                {isSubmitting ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <>SUBMIT APPLICATION <ChevronRight className="w-6 h-6" /></>
                )}
              </button>
            </div>
          </div>

          {/* Right Column: Benefits (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white border border-neutral-200 rounded-3xl p-8 sticky top-24 shadow-xl shadow-neutral-200/50">
              <h4 className="text-xs font-black text-neutral-900 uppercase tracking-widest mb-8 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-red-600" />
                Why Organize with Us?
              </h4>
              <div className="space-y-8">
                <BenefitItem
                  icon={<FileText className="text-blue-600" />}
                  title="Technology Intermediary"
                  desc="We handle the legal compliance and intermediary disclaimers so you can focus on the game."
                />
                <BenefitItem
                  icon={<ShieldCheck className="text-emerald-600" />}
                  title="Secure Escrow"
                  desc="Platform collects all entry fees. Payouts are released only after result verification."
                />
                <BenefitItem
                  icon={<Users className="text-purple-600" />}
                  title="Automated Operations"
                  desc="Automated room codes, points calculation, and slot management for zero chaos."
                />
              </div>

              <div className="mt-10 p-4 bg-red-50 border border-red-100 rounded-2xl flex gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
                <p className="text-[10px] text-neutral-500 leading-relaxed font-medium">
                  Admin review typically takes <span className="text-red-600 font-black">12-24 hours</span>. Please ensure your full name matches your bank account for future payouts.
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

function BenefitItem({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="flex gap-4">
      <div className="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center shrink-0 border border-neutral-200">
        {icon}
      </div>
      <div>
        <p className="text-xs font-black text-neutral-900 uppercase tracking-widest mb-1">{title}</p>
        <p className="text-[10px] text-neutral-500 leading-relaxed font-medium">{desc}</p>
      </div>
    </div>
  );
}


