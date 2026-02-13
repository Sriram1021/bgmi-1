'use client';

import { useState } from 'react';
import { mockUsers } from '@/app/lib/mock-data';
import { formatDate } from '@/app/lib/utils';
import { 
  Building, 
  CheckCircle2, 
  XCircle, 
  Info, 
  Search, 
  Mail, 
  Smartphone,
  Calendar,
  Eye,
  ArrowRight,
  ShieldCheck,
  Gamepad2,
  Clock,
  AlertCircle
} from 'lucide-react';
import { Modal, ModalContent } from '@/app/components/ui/modal';

export default function PendingOrganizersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedApplication, setSelectedApplication] = useState<any>(null);

  // Filter users with pending applications
  const pendingUsers = mockUsers.filter(u => 
    u.organizerApplication?.status === 'PENDING' || 
    (u.role === 'PARTICIPANT' && u.id === 'user_001') // For demo, let's assume user_001 has a pending app
  );

  // Mocking an application for user_001 for demo purposes
  const getDemoApplication = (user: any) => {
    if (user.organizerApplication) return user.organizerApplication;
    return {
      id: 'app_demo_1',
      fullName: user.name,
      email: user.email,
      mobile: '9876543210',
      experience: 'Managed a local BGMI community of 500+ players for 2 years.',
      reason: 'I want to bring professional tournament infrastructure to my community.',
      sampleTournament: 'Classic Squad, ₹50 Entry, ₹5000 Prize Pool',
      status: 'PENDING',
      submittedAt: new Date().toISOString(),
    };
  };

  const filteredApplications = pendingUsers.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-netflix-blue text-[10px] font-black uppercase tracking-[0.2em] mb-3">
            <ShieldCheck className="w-3 h-3" />
            Verification Queue
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white italic tracking-tighter uppercase leading-[0.9]">
            PENDING<br />ORGANIZERS
          </h1>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="bg-netflix-gray-900 border border-white/5 rounded-2xl p-4 flex items-center gap-4">
            <div className="text-center">
              <p className="text-2xl font-black text-white italic leading-none">{filteredApplications.length}</p>
              <p className="text-[9px] font-black text-netflix-gray-500 uppercase tracking-widest">New Requests</p>
            </div>
            <div className="w-px h-8 bg-white/5" />
            <Clock className="w-5 h-5 text-netflix-blue animate-pulse" />
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-netflix-gray-500" />
        <input 
          type="text" 
          placeholder="Search by name or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-netflix-gray-900 border border-white/5 rounded-xl py-3 pl-11 pr-4 text-sm text-white focus:outline-none focus:border-netflix-blue transition-all"
        />
      </div>

      {/* Applications List */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredApplications.map(user => {
          const app = getDemoApplication(user);
          return (
            <div key={user.id} className="bg-netflix-gray-900 border border-white/5 rounded-3xl p-6 hover:border-netflix-blue/30 transition-all group flex flex-col">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-netflix-gray-800 rounded-2xl flex items-center justify-center border border-white/5 font-black text-white italic text-lg">
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-white group-hover:text-netflix-blue transition-colors">{app.fullName}</h3>
                    <p className="text-[10px] text-netflix-gray-500 font-bold uppercase tracking-widest">{user.id}</p>
                  </div>
                </div>
                <div className="px-2 py-1 bg-netflix-blue/10 text-netflix-blue text-[8px] font-black rounded uppercase tracking-widest">
                  Pending Review
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3 text-xs text-netflix-gray-400">
                  <Mail className="w-3.5 h-3.5" />
                  {app.email}
                </div>
                <div className="flex items-center gap-3 text-xs text-netflix-gray-400">
                  <Smartphone className="w-3.5 h-3.5" />
                  {app.mobile}
                </div>
                <div className="flex items-center gap-3 text-xs text-netflix-gray-400">
                  <Calendar className="w-3.5 h-3.5" />
                  Applied {formatDate(app.submittedAt)}
                </div>
              </div>

              <button 
                onClick={() => setSelectedApplication({ ...app, userId: user.id })}
                className="mt-auto w-full py-3 bg-white/5 hover:bg-netflix-blue text-white text-[10px] font-black rounded-xl transition-all uppercase tracking-widest flex items-center justify-center gap-2"
              >
                REVIEW DOSSIER <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Review Modal */}
      <Modal isOpen={!!selectedApplication} onClose={() => setSelectedApplication(null)} size="lg">
        <ModalContent className="p-0 overflow-hidden">
          {selectedApplication && (
            <div className="p-8 space-y-8">
              <div className="flex items-center justify-between border-b border-white/5 pb-6">
                <div>
                  <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">Review Application</h3>
                  <p className="text-netflix-gray-500 text-[10px] font-bold uppercase tracking-widest mt-1">ID: {selectedApplication.id}</p>
                </div>
                <button onClick={() => setSelectedApplication(null)} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                  <XCircle className="w-6 h-6 text-netflix-gray-600" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <p className="text-[10px] font-black text-netflix-gray-500 uppercase tracking-widest mb-3">Applicant Vision</p>
                    <div className="bg-netflix-black border border-white/5 rounded-2xl p-5">
                      <p className="text-sm text-netflix-gray-300 leading-relaxed italic">&quot;{selectedApplication.reason}&quot;</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-netflix-gray-500 uppercase tracking-widest mb-3">Experience Profile</p>
                    <div className="bg-netflix-black border border-white/5 rounded-2xl p-5">
                      <p className="text-sm text-netflix-gray-300 leading-relaxed">{selectedApplication.experience}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <p className="text-[10px] font-black text-netflix-gray-500 uppercase tracking-widest mb-3">Draft Event</p>
                    <div className="bg-netflix-blue/5 border border-netflix-blue/20 rounded-2xl p-5 flex items-center gap-4">
                      <div className="w-10 h-10 bg-netflix-blue/10 rounded-xl flex items-center justify-center">
                        <Gamepad2 className="w-5 h-5 text-netflix-blue" />
                      </div>
                      <p className="text-sm font-bold text-white uppercase">{selectedApplication.sampleTournament}</p>
                    </div>
                  </div>

                  <div className="bg-netflix-gray-800 rounded-2xl p-6">
                    <h4 className="text-xs font-black text-white uppercase tracking-widest mb-4 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-netflix-red" />
                      Admin Risk Check
                    </h4>
                    <div className="space-y-3">
                      <RiskCheck label="Identity Match" passed={true} />
                      <RiskCheck label="Account Age > 30 Days" passed={true} />
                      <RiskCheck label="No Previous Bans" passed={true} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button className="flex-1 py-4 bg-white/5 hover:bg-netflix-red/20 text-netflix-red font-black rounded-2xl transition-all uppercase tracking-widest text-xs border border-white/5">
                  REJECT APPLICATION
                </button>
                <button className="flex-[2] btn-repeat-primary py-4 text-base">
                  APPROVE & ACTIVATE <CheckCircle2 className="ml-2 w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}

function RiskCheck({ label, passed }: { label: string, passed: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[10px] font-bold text-netflix-gray-400">{label}</span>
      {passed ? (
        <span className="text-[10px] font-black text-live-green uppercase">Clear</span>
      ) : (
        <span className="text-[10px] font-black text-netflix-red uppercase">Flagged</span>
      )}
    </div>
  );
}

