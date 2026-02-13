// import { Card } from '@/app/components/ui/card';
// import { APP_NAME, LEGAL } from '@/app/lib/constants';
// import { Scale } from 'lucide-react';

// export const metadata = {
//   title: `Terms of Service - ${APP_NAME}`,
//   description: 'Terms of Service and User Agreement for BattleGround Arena',
// };

// export default function TermsPage() {
//   return (
//     <div className="section-padding-md ">
//       <div className="main-container max-w-4xl">
//         <div className="text-center mb-12">
//           <div className="w-16 h-16 rounded-2xl bg-netflix-blue/10 border border-netflix-blue/20 flex items-center justify-center mx-auto mb-6 shadow-glow-blue">
//             <Scale className="h-8 w-8 text-netflix-blue" />
//           </div>
//           <h1 className="text-5xl md:text-7xl font-bold text-black mb-4 uppercase tracking-widest leading-tight" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>Terms of Service</h1>
//           <p className="text-neutral-500">Last updated: January 1, 2026</p>
//         </div>

//         <Card padding="lg" className="prose prose-invert prose-neutral max-w-none bg-white border border-white/5 shadow-3xl rounded-[2.5rem] p-12">
//           <h2>1. Introduction</h2>
//           <p>
//             Welcome to {APP_NAME}. These Terms of Service (&quot;Terms&quot;) govern your access to and use of our
//             platform, which facilitates skill-based gaming tournaments for BGMI and PUBG Mobile.
//           </p>
//           <p>
//             By accessing or using {APP_NAME}, you agree to be bound by these Terms. If you do not agree,
//             please do not use our platform.
//           </p>

//           <div className="bg-primary-50 border border-primary-200 rounded-lg p-4 my-6 not-prose">
//             <h3 className="font-semibold text-primary-900 mb-2">Platform Status Declaration</h3>
//             <p className="text-sm text-primary-800">{LEGAL.INTERMEDIARY_DISCLAIMER}</p>
//           </div>

//           <h2>2. Eligibility</h2>
//           <ul>
//             <li><strong>Age Requirement:</strong> You must be at least 18 years of age to create an account and participate in tournaments.</li>
//             <li><strong>Geographic Restrictions:</strong> Our services may not be available in certain states/regions due to local regulations.</li>
//             <li><strong>Account Requirements:</strong> You must provide accurate and complete information during registration.</li>
//           </ul>

//           <h2>3. Skill-Based Gaming Declaration</h2>
//           <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 my-6 not-prose">
//             <p className="text-sm text-blue-800">{LEGAL.SKILL_BASED_DECLARATION}</p>
//           </div>
//           <p>
//             All competitions on this platform are determined by participant skill, knowledge, and strategic
//             decision-making. There are no elements of chance or luck that influence the outcome of competitions.
//           </p>

//           <h2>4. User Responsibilities</h2>
//           <p>As a user of {APP_NAME}, you agree to:</p>
//           <ul>
//             <li>Provide accurate personal information and maintain its accuracy</li>
//             <li>Not use cheats, hacks, exploits, or any unauthorized modifications in games</li>
//             <li>Not engage in match-fixing, collusion, or any form of fraudulent behavior</li>
//             <li>Respect other participants and maintain sportsman-like conduct</li>
//             <li>Comply with all applicable laws and regulations</li>
//             <li>Not create multiple accounts</li>
//           </ul>

//           <h2>5. Tournament Participation</h2>
//           <h3>5.1 Registration</h3>
//           <p>
//             When you register for a tournament, you agree to the specific rules set by the tournament organizer
//             and commit to participating if accepted.
//           </p>

//           <h3>5.2 Entry Fees</h3>
//           <p>
//             Entry fees are collected through our secure payment partner (Razorpay) and held in escrow until
//             the tournament concludes. Entry fees are used to form the prize pool.
//           </p>

//           <h3>5.3 Results and Disputes</h3>
//           <p>
//             Match results are submitted by organizers with evidence. Disputes must be raised within 30 minutes
//             of match completion. Admin decisions on disputes are final.
//           </p>

//           <h2>6. Prizes and Payouts</h2>
//           <ul>
//             <li>Prize distributions are based on tournament-specific rules published before registration</li>
//             <li>All payouts require admin verification and approval</li>
//             <li>Payouts are processed within 48-72 hours of admin approval</li>
//             <li>KYC verification may be required before receiving payouts</li>
//             <li>Platform may deduct applicable service fees from prize amounts</li>
//           </ul>

//           <h2>7. Organizer Responsibilities</h2>
//           <p>Tournament organizers on our platform agree to:</p>
//           <ul>
//             <li>Conduct tournaments fairly and transparently</li>
//             <li>Submit accurate match results with evidence</li>
//             <li>Respond to participant queries in a timely manner</li>
//             <li>Comply with all platform rules and guidelines</li>
//             <li>Not engage in fraudulent or deceptive practices</li>
//           </ul>

//           <h2>8. Prohibited Activities</h2>
//           <p>The following activities are strictly prohibited:</p>
//           <ul>
//             <li>Use of cheats, hacks, or unauthorized software</li>
//             <li>Match-fixing or result manipulation</li>
//             <li>Collusion between participants</li>
//             <li>Creating multiple accounts</li>
//             <li>Fraudulent payment activities</li>
//             <li>Harassment or abuse of other users</li>
//             <li>Impersonation of other users or organizers</li>
//           </ul>

//           <h2>9. Account Termination</h2>
//           <p>
//             We reserve the right to suspend or terminate accounts that violate these Terms. In case of
//             termination for violations, any pending payouts may be forfeited.
//           </p>

//           <h2>10. Limitation of Liability</h2>
//           <p>
//             {APP_NAME} acts solely as a technology intermediary. We are not liable for:
//           </p>
//           <ul>
//             <li>Actions or decisions of tournament organizers</li>
//             <li>Game server issues or technical problems with the games</li>
//             <li>Disputes between participants</li>
//             <li>Loss of participation due to technical issues on participant&apos;s end</li>
//           </ul>

//           <h2>11. Governing Law</h2>
//           <p>
//             These Terms are governed by the laws of India. Any disputes shall be subject to the exclusive
//             jurisdiction of courts in Bangalore, Karnataka.
//           </p>

//           <h2>12. Changes to Terms</h2>
//           <p>
//             We may update these Terms from time to time. We will notify users of significant changes via
//             email or platform notification. Continued use after changes constitutes acceptance.
//           </p>

//           <h2>13. Contact Information</h2>
//           <p>
//             For questions about these Terms, contact us at:<br />
//             Email: legal@bgmi-arena.com<br />
//             Grievance Officer: grievance@bgmi-arena.com
//           </p>
//         </Card>
//       </div>
//     </div>
//   );
// }








// import { Card } from '@/app/components/ui/card';
// import { APP_NAME, LEGAL } from '@/app/lib/constants';
// import { Scale, FileText, AlertCircle, ShieldCheck } from 'lucide-react';

// export const metadata = {
//   title: `Terms of Service - ${APP_NAME}`,
//   description: 'Terms of Service and User Agreement for BattleGround Arena',
// };

// export default function TermsPage() {
//   return (
//     <div className="min-h-screen bg-neutral-50 py-12 md:py-24 px-4 sm:px-6">
//       <div className="max-w-4xl mx-auto">
//         {/* Header Section */}
//         <div className="text-center mb-16">
//           <div className="inline-flex items-center justify-center p-4 mb-6 rounded-2xl bg-white border border-neutral-200 shadow-sm">
//             <Scale className="h-8 w-8 text-neutral-900" />
//           </div>
//           <h1 className="text-4xl md:text-6xl font-black text-neutral-900 mb-6 uppercase tracking-tight">
//             Terms of Service
//           </h1>
//           <div className="flex items-center justify-center gap-2 text-neutral-500 text-sm font-medium">
//             <FileText className="w-4 h-4" />
//             <p>Last updated: January 1, 2026</p>
//           </div>
//         </div>

//         {/* Main Content Card */}
//         <Card className="bg-white border border-neutral-200 shadow-xl shadow-neutral-200/40 rounded-3xl overflow-hidden">
          
//           {/* Document Header / Intro */}
//           <div className="p-8 md:p-12 border-b border-neutral-100 bg-neutral-50/50">
//             <h2 className="text-2xl font-bold text-neutral-900 mb-4">1. Introduction</h2>
//             <p className="text-neutral-600 leading-relaxed mb-6">
//               Welcome to {APP_NAME}. These Terms of Service (&quot;Terms&quot;) govern your access to and use of our
//               platform, which facilitates skill-based gaming tournaments for BGMI and PUBG Mobile.
//               By accessing or using {APP_NAME}, you agree to be bound by these Terms.
//             </p>

//             {/* Callout Box - Neutral Style */}
//             <div className="flex gap-4 p-5 bg-white border border-neutral-200 rounded-xl shadow-sm">
//               <ShieldCheck className="w-6 h-6 text-neutral-800 flex-shrink-0 mt-1" />
//               <div>
//                 <h3 className="font-bold text-neutral-900 text-sm uppercase tracking-wide mb-1">Platform Status Declaration</h3>
//                 <p className="text-sm text-neutral-600 leading-relaxed">{LEGAL.INTERMEDIARY_DISCLAIMER}</p>
//               </div>
//             </div>
//           </div>

//           {/* Main Prose Content */}
//           <div className="p-8 md:p-12 space-y-12">
            
//             {/* Section 2 */}
//             <section>
//               <h2 className="text-2xl font-bold text-neutral-900 mb-6 flex items-center gap-3">
//                 <span className="flex items-center justify-center w-8 h-8 rounded-full bg-neutral-100 text-neutral-900 text-sm">2</span>
//                 Eligibility
//               </h2>
//               <ul className="grid gap-3 pl-2">
//                 {[
//                   { title: "Age Requirement", desc: "You must be at least 18 years of age to create an account." },
//                   { title: "Geographic Restrictions", desc: "Services may not be available in certain states/regions." },
//                   { title: "Account Requirements", desc: "You must provide accurate information during registration." }
//                 ].map((item, i) => (
//                   <li key={i} className="flex gap-3 text-neutral-600">
//                     <div className="h-1.5 w-1.5 rounded-full bg-neutral-400 mt-2.5 flex-shrink-0" />
//                     <span><strong className="text-neutral-900">{item.title}:</strong> {item.desc}</span>
//                   </li>
//                 ))}
//               </ul>
//             </section>

//             <hr className="border-neutral-100" />

//             {/* Section 3 */}
//             <section>
//               <h2 className="text-2xl font-bold text-neutral-900 mb-6 flex items-center gap-3">
//                 <span className="flex items-center justify-center w-8 h-8 rounded-full bg-neutral-100 text-neutral-900 text-sm">3</span>
//                 Skill-Based Gaming
//               </h2>
              
//               <div className="bg-neutral-100 rounded-xl p-6 mb-6">
//                 <p className="text-neutral-700 italic font-medium leading-relaxed">
//                   &quot;{LEGAL.SKILL_BASED_DECLARATION}&quot;
//                 </p>
//               </div>
//               <p className="text-neutral-600 leading-relaxed">
//                 All competitions on this platform are determined by participant skill, knowledge, and strategic
//                 decision-making. There are no elements of chance or luck that influence the outcome.
//               </p>
//             </section>

//             <hr className="border-neutral-100" />

//             {/* Section 4 */}
//             <section>
//               <h2 className="text-2xl font-bold text-neutral-900 mb-6 flex items-center gap-3">
//                 <span className="flex items-center justify-center w-8 h-8 rounded-full bg-neutral-100 text-neutral-900 text-sm">4</span>
//                 User Responsibilities
//               </h2>
//               <p className="text-neutral-600 mb-4">As a user of {APP_NAME}, you agree to:</p>
//               <div className="grid md:grid-cols-2 gap-4">
//                 {[
//                   "Provide accurate personal information",
//                   "No cheats, hacks, or exploits",
//                   "No match-fixing or collusion",
//                   "Maintain sportsman-like conduct",
//                   "Comply with applicable laws",
//                   "Do not create multiple accounts"
//                 ].map((rule, i) => (
//                   <div key={i} className="flex items-center gap-3 p-3 rounded-lg border border-neutral-100 bg-neutral-50/50">
//                     <div className="w-1.5 h-1.5 rounded-full bg-neutral-900" />
//                     <span className="text-neutral-700 text-sm font-medium">{rule}</span>
//                   </div>
//                 ))}
//               </div>
//             </section>

//             <hr className="border-neutral-100" />

//             {/* Section 5, 6, 7 Combined for brevity in layout, but distinct headers */}
//             <div className="space-y-10">
//               <section>
//                 <h3 className="text-xl font-bold text-neutral-900 mb-4">5. Tournament Participation</h3>
//                 <div className="space-y-4 text-neutral-600">
//                   <p><strong className="text-neutral-900">Registration:</strong> Agree to rules set by the organizer.</p>
//                   <p><strong className="text-neutral-900">Entry Fees:</strong> Collected securely and held in escrow.</p>
//                   <p><strong className="text-neutral-900">Results:</strong> Disputes must be raised within 30 minutes of match completion.</p>
//                 </div>
//               </section>

//               <section>
//                 <h3 className="text-xl font-bold text-neutral-900 mb-4">6. Prizes & Payouts</h3>
//                 <ul className="space-y-2 text-neutral-600 pl-4 list-disc marker:text-neutral-300">
//                   <li>Prize distributions are based on tournament-specific rules.</li>
//                   <li>Payouts processed within 48-72 hours of verification.</li>
//                   <li>KYC verification required before withdrawal.</li>
//                 </ul>
//               </section>
//             </div>

//             <hr className="border-neutral-100" />

//             {/* Prohibited Activities - Red styled purely via neutral shades (darker) */}
//             <section>
//               <h2 className="text-2xl font-bold text-neutral-900 mb-6 flex items-center gap-3">
//                 <AlertCircle className="w-6 h-6" />
//                 8. Prohibited Activities
//               </h2>
//               <div className="bg-neutral-900 text-neutral-300 rounded-xl p-6 md:p-8">
//                  <p className="mb-4 text-white font-medium">Strictly prohibited actions that lead to immediate ban:</p>
//                  <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-2 text-sm">
//                     <li>• Use of unauthorized software</li>
//                     <li>• Match-fixing or manipulation</li>
//                     <li>• Collusion between participants</li>
//                     <li>• Creating multiple accounts</li>
//                     <li>• Fraudulent payment activities</li>
//                     <li>• Harassment or abuse</li>
//                  </ul>
//               </div>
//             </section>

//             {/* Footer Legal Sections */}
//             <div className="grid md:grid-cols-2 gap-8 pt-4">
//                <div>
//                   <h4 className="font-bold text-neutral-900 mb-2">9. Account Termination</h4>
//                   <p className="text-sm text-neutral-600">We reserve the right to suspend or terminate accounts that violate these Terms. Pending payouts may be forfeited.</p>
//                </div>
//                <div>
//                   <h4 className="font-bold text-neutral-900 mb-2">10. Limitation of Liability</h4>
//                   <p className="text-sm text-neutral-600">{APP_NAME} is a technology intermediary and is not liable for organizer decisions or game server issues.</p>
//                </div>
//                <div>
//                   <h4 className="font-bold text-neutral-900 mb-2">11. Governing Law</h4>
//                   <p className="text-sm text-neutral-600">Governed by laws of India. Exclusive jurisdiction: Bangalore, Karnataka.</p>
//                </div>
//                <div>
//                   <h4 className="font-bold text-neutral-900 mb-2">12. Changes to Terms</h4>
//                   <p className="text-sm text-neutral-600">We may update these Terms. Continued use constitutes acceptance.</p>
//                </div>
//             </div>

//             {/* Contact Box */}
//             <div className="mt-8 pt-8 border-t border-neutral-100">
//               <h2 className="text-lg font-bold text-neutral-900 mb-4">13. Contact Information</h2>
//               <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-6">
//                  <p className="text-neutral-600 mb-1">For questions about these Terms:</p>
//                  <p className="text-neutral-900 font-medium">Email: legal@bgmi-arena.com</p>
//                  <p className="text-neutral-900 font-medium">Grievance Officer: grievance@bgmi-arena.com</p>
//               </div>
//             </div>

//           </div>
//         </Card>
        
//         <p className="text-center text-neutral-400 text-sm mt-8 pb-8">
//           &copy; {new Date().getFullYear()} {APP_NAME}. All rights reserved.
//         </p>
//       </div>
//     </div>
//   );
// }







import { Card } from '@/app/components/ui/card';
import { APP_NAME, LEGAL } from '@/app/lib/constants';
import { Scale, FileText, AlertCircle, ShieldCheck, AlertTriangle } from 'lucide-react';

export const metadata = {
  title: `Terms of Service - ${APP_NAME}`,
  description: 'Terms of Service and User Agreement for BattleGround Arena',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-neutral-50 py-12 md:py-24 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center p-4 mb-6 rounded-2xl bg-white border border-neutral-200 shadow-sm">
            {/* Added Red Accent */}
            <Scale className="h-8 w-8 text-red-600" />
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-neutral-900 mb-6 uppercase tracking-tight">
            Terms of Service
          </h1>
          <div className="flex items-center justify-center gap-2 text-neutral-500 text-sm font-medium">
            {/* Added Red Accent */}
            <FileText className="w-4 h-4 text-red-500" />
            <p>Last updated: January 1, 2026</p>
          </div>
        </div>

        {/* Main Content Card */}
        <Card className="bg-white border border-neutral-200 shadow-xl shadow-neutral-200/40 rounded-3xl overflow-hidden">
          
          {/* Document Header / Intro */}
          <div className="p-8 md:p-12 border-b border-neutral-100 bg-neutral-50/50">
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">1. Introduction</h2>
            <p className="text-neutral-600 leading-relaxed mb-6">
              Welcome to {APP_NAME}. These Terms of Service (&quot;Terms&quot;) govern your access to and use of our
              platform, which facilitates skill-based gaming tournaments for BGMI and PUBG Mobile.
              By accessing or using {APP_NAME}, you agree to be bound by these Terms.
            </p>

            {/* Callout Box - Neutral with Red Icon */}
            <div className="flex gap-4 p-5 bg-white border border-neutral-200 rounded-xl shadow-sm">
              <ShieldCheck className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-neutral-900 text-sm uppercase tracking-wide mb-1">Platform Status Declaration</h3>
                <p className="text-sm text-neutral-600 leading-relaxed">{LEGAL.INTERMEDIARY_DISCLAIMER}</p>
              </div>
            </div>
          </div>

          {/* Main Prose Content */}
          <div className="p-8 md:p-12 space-y-12">
            
            {/* Section 2 */}
            <section>
              <h2 className="text-2xl font-bold text-neutral-900 mb-6 flex items-center gap-3">
                {/* Red Badge */}
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-red-50 text-red-600 text-sm font-bold">2</span>
                Eligibility
              </h2>
              <ul className="grid gap-3 pl-2">
                {[
                  { title: "Age Requirement", desc: "You must be at least 18 years of age to create an account." },
                  { title: "Geographic Restrictions", desc: "Services may not be available in certain states/regions." },
                  { title: "Account Requirements", desc: "You must provide accurate information during registration." }
                ].map((item, i) => (
                  <li key={i} className="flex gap-3 text-neutral-600">
                    {/* Red Bullet */}
                    <div className="h-1.5 w-1.5 rounded-full bg-red-400 mt-2.5 flex-shrink-0" />
                    <span><strong className="text-neutral-900">{item.title}:</strong> {item.desc}</span>
                  </li>
                ))}
              </ul>
            </section>

            <hr className="border-neutral-100" />

            {/* Section 3 */}
            <section>
              <h2 className="text-2xl font-bold text-neutral-900 mb-6 flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-red-50 text-red-600 text-sm font-bold">3</span>
                Skill-Based Gaming
              </h2>
              
              {/* Quote box with Red Border accent */}
              <div className="bg-neutral-50 border-l-4 border-red-500 rounded-r-xl p-6 mb-6">
                <p className="text-neutral-700 italic font-medium leading-relaxed">
                  &quot;{LEGAL.SKILL_BASED_DECLARATION}&quot;
                </p>
              </div>
              <p className="text-neutral-600 leading-relaxed">
                All competitions on this platform are determined by participant skill, knowledge, and strategic
                decision-making. There are no elements of chance or luck that influence the outcome.
              </p>
            </section>

            <hr className="border-neutral-100" />

            {/* Section 4 */}
            <section>
              <h2 className="text-2xl font-bold text-neutral-900 mb-6 flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-red-50 text-red-600 text-sm font-bold">4</span>
                User Responsibilities
              </h2>
              <p className="text-neutral-600 mb-4">As a user of {APP_NAME}, you agree to:</p>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  "Provide accurate personal information",
                  "No cheats, hacks, or exploits",
                  "No match-fixing or collusion",
                  "Maintain sportsman-like conduct",
                  "Comply with applicable laws",
                  "Do not create multiple accounts"
                ].map((rule, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-lg border border-neutral-100 bg-neutral-50/50 hover:border-red-100 transition-colors">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                    <span className="text-neutral-700 text-sm font-medium">{rule}</span>
                  </div>
                ))}
              </div>
            </section>

            <hr className="border-neutral-100" />

            {/* Section 5, 6 Combined */}
            <div className="space-y-10">
              <section>
                <h3 className="text-xl font-bold text-neutral-900 mb-4">5. Tournament Participation</h3>
                <div className="space-y-4 text-neutral-600">
                  <p><strong className="text-neutral-900">Registration:</strong> Agree to rules set by the organizer.</p>
                  <p><strong className="text-neutral-900">Entry Fees:</strong> Collected securely and held in escrow.</p>
                  <p><strong className="text-neutral-900">Results:</strong> Disputes must be raised within 30 minutes of match completion.</p>
                </div>
              </section>

              <section>
                <h3 className="text-xl font-bold text-neutral-900 mb-4">6. Prizes & Payouts</h3>
                <ul className="space-y-2 text-neutral-600 pl-4 list-disc marker:text-red-400">
                  <li>Prize distributions are based on tournament-specific rules.</li>
                  <li>Payouts processed within 48-72 hours of verification.</li>
                  <li>KYC verification required before withdrawal.</li>
                </ul>
              </section>
            </div>

            <hr className="border-neutral-100" />

            {/* Prohibited Activities - Changed to Red Warning Style */}
            <section>
              <h2 className="text-2xl font-bold text-neutral-900 mb-6 flex items-center gap-3">
                <AlertCircle className="w-6 h-6 text-red-600" />
                8. Prohibited Activities
              </h2>
              <div className="bg-red-50 border border-red-100 rounded-xl p-6 md:p-8">
                 <p className="mb-4 text-red-900 font-bold flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    Strictly prohibited actions that lead to immediate ban:
                 </p>
                 <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-2 text-sm text-red-800/80 font-medium">
                    <li>• Use of unauthorized software</li>
                    <li>• Match-fixing or manipulation</li>
                    <li>• Collusion between participants</li>
                    <li>• Creating multiple accounts</li>
                    <li>• Fraudulent payment activities</li>
                    <li>• Harassment or abuse</li>
                 </ul>
              </div>
            </section>

            {/* Footer Legal Sections */}
            <div className="grid md:grid-cols-2 gap-8 pt-4">
               <div>
                  <h4 className="font-bold text-neutral-900 mb-2">9. Account Termination</h4>
                  <p className="text-sm text-neutral-600">We reserve the right to suspend or terminate accounts that violate these Terms. Pending payouts may be forfeited.</p>
               </div>
               <div>
                  <h4 className="font-bold text-neutral-900 mb-2">10. Limitation of Liability</h4>
                  <p className="text-sm text-neutral-600">{APP_NAME} is a technology intermediary and is not liable for organizer decisions or game server issues.</p>
               </div>
               <div>
                  <h4 className="font-bold text-neutral-900 mb-2">11. Governing Law</h4>
                  <p className="text-sm text-neutral-600">Governed by laws of India. Exclusive jurisdiction: Bangalore, Karnataka.</p>
               </div>
               <div>
                  <h4 className="font-bold text-neutral-900 mb-2">12. Changes to Terms</h4>
                  <p className="text-sm text-neutral-600">We may update these Terms. Continued use constitutes acceptance.</p>
               </div>
            </div>

            {/* Contact Box */}
            <div className="mt-8 pt-8 border-t border-neutral-100">
              <h2 className="text-lg font-bold text-neutral-900 mb-4">13. Contact Information</h2>
              <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-6">
                 <p className="text-neutral-600 mb-1">For questions about these Terms:</p>
                 <p className="text-neutral-900 font-medium">Email: <span className="text-red-600">legal@bgmi-arena.com</span></p>
                 <p className="text-neutral-900 font-medium">Grievance Officer: <span className="text-red-600">grievance@bgmi-arena.com</span></p>
              </div>
            </div>

          </div>
        </Card>
        
        <p className="text-center text-neutral-400 text-sm mt-8 pb-8">
          &copy; {new Date().getFullYear()} {APP_NAME}. All rights reserved.
        </p>
      </div>
    </div>
  );
}