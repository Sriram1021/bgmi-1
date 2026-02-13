// import { Card } from '@/app/components/ui/card';
// import { APP_NAME } from '@/app/lib/constants';
// import { Shield } from 'lucide-react';

// export const metadata = {
//   title: `Privacy Policy - ${APP_NAME}`,
//   description: 'Privacy Policy for BattleGround Arena',
// };

// export default function PrivacyPage() {
//   return (
//     <div className="section-padding-md bg-netflix-black">
//       <div className="main-container max-w-4xl">
//         <div className="text-center mb-12">
//           <div className="w-16 h-16 rounded-2xl bg-netflix-red/10 border border-netflix-red/20 flex items-center justify-center mx-auto mb-6 shadow-glow-red">
//             <Shield className="h-8 w-8 text-netflix-red" />
//           </div>
//           <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 uppercase tracking-widest leading-tight" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>Privacy Policy</h1>
//           <p className="text-neutral-500">Last updated: January 1, 2026</p>
//         </div>

//         <Card padding="lg" className="prose prose-invert prose-neutral max-w-none bg-netflix-gray-900 border border-white/5 shadow-3xl rounded-[2.5rem] p-12">
//           <h2>1. Introduction</h2>
//           <p>
//             {APP_NAME} (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to protecting your privacy. This Privacy Policy
//             explains how we collect, use, disclose, and safeguard your information when you use our platform.
//           </p>

//           <h2>2. Information We Collect</h2>

//           <h3>2.1 Information You Provide</h3>
//           <ul>
//             <li><strong>Account Information:</strong> Name, email address, phone number, date of birth, state of residence</li>
//             <li><strong>Game Information:</strong> BGMI/PUBG Mobile player IDs</li>
//             <li><strong>Payment Information:</strong> Bank account details, UPI IDs (for prize payouts)</li>
//             <li><strong>KYC Documents:</strong> Identity proof (as required for verification)</li>
//           </ul>

//           <h3>2.2 Information Collected Automatically</h3>
//           <ul>
//             <li>Device information (device type, operating system)</li>
//             <li>IP address and approximate location</li>
//             <li>Browser type and version</li>
//             <li>Usage data (pages visited, features used, timestamps)</li>
//           </ul>

//           <h2>3. How We Use Your Information</h2>
//           <p>We use collected information for:</p>
//           <ul>
//             <li>Providing and maintaining our platform</li>
//             <li>Processing tournament registrations and payouts</li>
//             <li>Verifying age eligibility (18+ requirement)</li>
//             <li>Verifying geographic eligibility</li>
//             <li>Preventing fraud and ensuring fair play</li>
//             <li>Communicating with you about tournaments and platform updates</li>
//             <li>Complying with legal obligations</li>
//             <li>Improving our services</li>
//           </ul>

//           <h2>4. Information Sharing</h2>
//           <p>We may share your information with:</p>

//           <h3>4.1 Service Providers</h3>
//           <ul>
//             <li>Payment processors (Razorpay) for handling transactions</li>
//             <li>Email service providers for communications</li>
//             <li>Cloud hosting providers for data storage</li>
//           </ul>

//           <h3>4.2 Tournament Organizers</h3>
//           <p>
//             Limited information (display name, player ID) is shared with organizers for tournament
//             management. Email addresses are masked for privacy.
//           </p>

//           <h3>4.3 Legal Requirements</h3>
//           <p>
//             We may disclose information when required by law, court order, or government request.
//           </p>

//           <h2>5. Data Security</h2>
//           <p>We implement appropriate security measures including:</p>
//           <ul>
//             <li>Encryption of data in transit (TLS/SSL)</li>
//             <li>Encryption of sensitive data at rest</li>
//             <li>Access controls and authentication</li>
//             <li>Regular security audits</li>
//             <li>Secure payment processing through certified partners</li>
//           </ul>

//           <h2>6. Data Retention</h2>
//           <p>We retain your information for as long as:</p>
//           <ul>
//             <li>Your account is active</li>
//             <li>Necessary to provide services</li>
//             <li>Required by law (financial records: 7 years)</li>
//             <li>Needed to resolve disputes</li>
//           </ul>

//           <h2>7. Your Rights</h2>
//           <p>Under applicable Indian law, you have the right to:</p>
//           <ul>
//             <li><strong>Access:</strong> Request a copy of your personal data</li>
//             <li><strong>Correction:</strong> Request correction of inaccurate data</li>
//             <li><strong>Deletion:</strong> Request deletion of your data (subject to legal requirements)</li>
//             <li><strong>Withdrawal of Consent:</strong> Withdraw consent for data processing</li>
//           </ul>
//           <p>To exercise these rights, contact us at privacy@bgmi-arena.com</p>

//           <h2>8. Cookies and Tracking</h2>
//           <p>We use cookies and similar technologies for:</p>
//           <ul>
//             <li>Authentication and session management</li>
//             <li>Remembering preferences</li>
//             <li>Analytics and performance monitoring</li>
//           </ul>
//           <p>You can control cookies through your browser settings.</p>

//           <h2>9. Third-Party Links</h2>
//           <p>
//             Our platform may contain links to third-party websites. We are not responsible for the
//             privacy practices of these external sites.
//           </p>

//           <h2>10. Children&apos;s Privacy</h2>
//           <p>
//             Our platform is not intended for users under 18 years of age. We do not knowingly collect
//             information from minors. If we discover that a minor has created an account, we will
//             immediately terminate it.
//           </p>

//           <h2>11. International Users</h2>
//           <p>
//             Our platform is operated from India and is intended for users in India. If you access
//             our platform from outside India, you consent to the transfer of your information to India.
//           </p>

//           <h2>12. Changes to This Policy</h2>
//           <p>
//             We may update this Privacy Policy periodically. We will notify you of significant changes
//             via email or platform notification. The &quot;Last updated&quot; date indicates when changes were made.
//           </p>

//           <h2>13. Contact Information</h2>
//           <p>
//             For privacy-related inquiries:<br />
//             Email: privacy@bgmi-arena.com<br /><br />
//             Grievance Officer (IT Act 2000):<br />
//             Email: grievance@bgmi-arena.com<br />
//             Response time: Within 30 days
//           </p>

//           <h2>14. Compliance</h2>
//           <p>
//             This Privacy Policy is compliant with the Information Technology Act, 2000 and the
//             Information Technology (Reasonable Security Practices and Procedures and Sensitive
//             Personal Data or Information) Rules, 2011.
//           </p>
//         </Card>
//       </div>
//     </div>
//   );
// }






import { Card } from '@/app/components/ui/card';
import { APP_NAME } from '@/app/lib/constants';
import { 
  Shield, 
  Lock, 
  Eye, 
  User, 
  Globe, 
  FileCheck, 
  Mail, 
  Cookie, 
  Server,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';

export const metadata = {
  title: `Privacy Policy - ${APP_NAME}`,
  description: 'Privacy Policy for BattleGround Arena',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-neutral-50 py-12 md:py-24 px-4 sm:px-6 font-sans">
      <div className="max-w-4xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center p-4 mb-6 rounded-2xl bg-white border border-neutral-200 shadow-sm">
            <Shield className="h-8 w-8 text-red-600" />
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-neutral-900 mb-6 uppercase tracking-tight">
            Privacy <span className="text-red-600">Policy</span>
          </h1>
          <div className="flex items-center justify-center gap-2 text-neutral-500 text-sm font-medium">
            <FileCheck className="w-4 h-4 text-red-500" />
            <p>Last updated: January 1, 2026</p>
          </div>
        </div>

        {/* Main Content Card */}
        <Card className="bg-white border border-neutral-200 shadow-xl shadow-neutral-200/40 rounded-3xl overflow-hidden">
          
          {/* Section 1: Introduction */}
          <div className="p-8 md:p-12 border-b border-neutral-100 bg-neutral-50/50">
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">1. Introduction</h2>
            <p className="text-neutral-600 leading-relaxed">
              <span className="font-semibold text-neutral-900">{APP_NAME}</span> (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to protecting your privacy. This Privacy Policy
              explains how we collect, use, disclose, and safeguard your information when you use our platform.
            </p>
          </div>

          {/* Main Prose Content */}
          <div className="p-8 md:p-12 space-y-12">

            {/* Section 2: Data Collection - Split Grid */}
            <section>
              <h2 className="text-2xl font-bold text-neutral-900 mb-6 flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-red-50 text-red-600 text-sm font-bold">2</span>
                Information We Collect
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                {/* Manual Input */}
                <div className="bg-white border border-neutral-200 rounded-xl p-6 shadow-sm hover:border-red-200 transition-colors">
                  <div className="flex items-center gap-2 mb-4">
                    <User className="w-5 h-5 text-red-500" />
                    <h3 className="font-bold text-neutral-900">Information You Provide</h3>
                  </div>
                  <ul className="space-y-3 text-sm text-neutral-600">
                    <li className="flex gap-2"><div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 shrink-0"></div> <span><strong>Account:</strong> Name, Email, Phone, DOB</span></li>
                    <li className="flex gap-2"><div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 shrink-0"></div> <span><strong>Game:</strong> BGMI/PUBG IDs</span></li>
                    <li className="flex gap-2"><div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 shrink-0"></div> <span><strong>Financial:</strong> UPI IDs, Bank Details</span></li>
                    <li className="flex gap-2"><div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 shrink-0"></div> <span><strong>KYC:</strong> Identity Proof Documents</span></li>
                  </ul>
                </div>

                {/* Auto Input */}
                <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Server className="w-5 h-5 text-neutral-500" />
                    <h3 className="font-bold text-neutral-900">Collected Automatically</h3>
                  </div>
                  <ul className="space-y-3 text-sm text-neutral-600">
                    <li className="flex gap-2"><div className="w-1.5 h-1.5 rounded-full bg-neutral-400 mt-2 shrink-0"></div> Device type & OS</li>
                    <li className="flex gap-2"><div className="w-1.5 h-1.5 rounded-full bg-neutral-400 mt-2 shrink-0"></div> IP Address & Location</li>
                    <li className="flex gap-2"><div className="w-1.5 h-1.5 rounded-full bg-neutral-400 mt-2 shrink-0"></div> Browser Version</li>
                    <li className="flex gap-2"><div className="w-1.5 h-1.5 rounded-full bg-neutral-400 mt-2 shrink-0"></div> Usage Timestamps</li>
                  </ul>
                </div>
              </div>
            </section>

            <hr className="border-neutral-100" />

            {/* Section 3 & 4: Usage & Sharing */}
            <div className="grid md:grid-cols-2 gap-12">
              <section>
                <h2 className="text-xl font-bold text-neutral-900 mb-4">3. How We Use Data</h2>
                <ul className="space-y-2 text-neutral-600">
                  {['Processing tournaments & payouts', 'Verifying age & geography', 'Preventing fraud & fair play', 'Improving services'].map((item, i) => (
                    <li key={i} className="flex gap-3 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-neutral-400 mt-0.5 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-neutral-900 mb-4">4. Information Sharing</h2>
                <ul className="space-y-4 text-sm text-neutral-600">
                  <li className="bg-neutral-50 p-3 rounded-lg border border-neutral-100">
                    <strong className="text-neutral-900 block mb-1">Service Providers</strong>
                    Payment processors (Razorpay), Email services, Cloud hosting.
                  </li>
                  <li className="bg-neutral-50 p-3 rounded-lg border border-neutral-100">
                    <strong className="text-neutral-900 block mb-1">Tournament Organizers</strong>
                    Limited data (Player ID, Name) shared for management.
                  </li>
                </ul>
              </section>
            </div>

            <hr className="border-neutral-100" />

            {/* Section 5: Security (Highlighted) */}
            <section>
              <h2 className="text-2xl font-bold text-neutral-900 mb-6 flex items-center gap-3">
                <Lock className="w-6 h-6 text-red-600" />
                5. Data Security
              </h2>
              <div className="bg-gradient-to-r from-neutral-900 to-neutral-800 rounded-xl p-8 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-red-600 rounded-full blur-3xl opacity-20 -mr-10 -mt-10"></div>
                <div className="relative z-10 grid sm:grid-cols-2 gap-6">
                   <div>
                     <p className="mb-4 text-neutral-300">We implement enterprise-grade security:</p>
                     <ul className="space-y-2 text-sm font-medium">
                       <li className="flex items-center gap-2"><div className="w-1 h-1 bg-red-500 rounded-full"></div> Encryption in transit (TLS/SSL)</li>
                       <li className="flex items-center gap-2"><div className="w-1 h-1 bg-red-500 rounded-full"></div> Encryption at rest</li>
                       <li className="flex items-center gap-2"><div className="w-1 h-1 bg-red-500 rounded-full"></div> Regular security audits</li>
                     </ul>
                   </div>
                   <div className="flex items-center justify-center sm:justify-end">
                      <div className="text-right">
                        <p className="text-xs text-neutral-400 uppercase tracking-widest mb-1">Payment Security</p>
                        <p className="text-lg font-bold">Verified Partners Only</p>
                      </div>
                   </div>
                </div>
              </div>
            </section>

            {/* Section 7: User Rights */}
            <section>
              <h2 className="text-2xl font-bold text-neutral-900 mb-6 flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-red-50 text-red-600 text-sm font-bold">7</span>
                Your Rights (Indian Law)
              </h2>
              <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: "Access", text: "Request copy of data" },
                  { label: "Correction", text: "Fix inaccurate data" },
                  { label: "Deletion", text: "Request removal" },
                  { label: "Withdraw", text: "Revoke consent" },
                ].map((right, i) => (
                  <div key={i} className="text-center p-4 rounded-lg border border-neutral-100 bg-neutral-50 hover:bg-white hover:border-red-200 hover:shadow-md transition-all">
                    <h4 className="font-bold text-red-600 mb-1">{right.label}</h4>
                    <p className="text-xs text-neutral-500">{right.text}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Section 10: Children's Privacy Alert */}
            <section className="bg-red-50 border border-red-100 rounded-xl p-6 flex gap-4 items-start">
              <AlertTriangle className="w-6 h-6 text-red-600 shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-red-900 text-lg mb-2">10. Children&apos;s Privacy</h3>
                <p className="text-red-800/80 text-sm leading-relaxed">
                  Our platform is not intended for users under 18 years of age. We do not knowingly collect
                  information from minors. If we discover that a minor has created an account, we will
                  immediately terminate it.
                </p>
              </div>
            </section>

            {/* Additional Sections Collapsed visually */}
            <div className="grid md:grid-cols-3 gap-8 text-sm text-neutral-500 pt-4">
              <div>
                <strong className="block text-neutral-900 flex items-center gap-2 mb-2"><Cookie className="w-4 h-4" /> Cookies</strong>
                Used for auth, sessions, and analytics. Control via browser settings.
              </div>
              <div>
                <strong className="block text-neutral-900 flex items-center gap-2 mb-2"><Globe className="w-4 h-4" /> International</strong>
                Operated from India. Using the platform implies consent to transfer data to India.
              </div>
              <div>
                <strong className="block text-neutral-900 flex items-center gap-2 mb-2"><Eye className="w-4 h-4" /> Third Parties</strong>
                We are not responsible for privacy practices of linked external sites.
              </div>
            </div>

            {/* Contact & Compliance */}
            <div className="mt-8 pt-8 border-t border-neutral-100">
              <div className="bg-neutral-50 rounded-2xl p-8 border border-neutral-200">
                <div className="grid md:grid-cols-2 gap-8">
                  
                  {/* Contact Info */}
                  <div>
                    <h3 className="font-bold text-neutral-900 mb-4 flex items-center gap-2">
                      <Mail className="w-5 h-5 text-red-600" /> Contact Us
                    </h3>
                    <div className="space-y-3 text-sm">
                      <div>
                        <p className="text-neutral-500 mb-0.5">Privacy Inquiries</p>
                        <p className="font-medium text-neutral-900">privacy@bgmi-arena.com</p>
                      </div>
                      <div>
                        <p className="text-neutral-500 mb-0.5">Grievance Officer (IT Act 2000)</p>
                        <p className="font-medium text-neutral-900">grievance@bgmi-arena.com</p>
                        <p className="text-xs text-neutral-400 mt-1">Response time: Within 30 days</p>
                      </div>
                    </div>
                  </div>

                  {/* Compliance Badge */}
                  <div className="border-l border-neutral-200 pl-0 md:pl-8 flex flex-col justify-center">
                    <h3 className="font-bold text-neutral-900 mb-2">Legal Compliance</h3>
                    <p className="text-sm text-neutral-600 leading-relaxed mb-4">
                      Compliant with Information Technology Act, 2000 and SPDI Rules, 2011.
                    </p>
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-50 text-green-700 text-xs font-bold w-fit border border-green-200">
                      <CheckCircle2 className="w-3 h-3" /> IT ACT COMPLIANT
                    </div>
                  </div>

                </div>
              </div>
            </div>

          </div>
        </Card>
        
        
      </div>
    </div>
  );
}


