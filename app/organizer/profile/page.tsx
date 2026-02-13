'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/app/lib/utils';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/app/lib/redux/store';
import { fetchProfile, createProfile, updateProfile } from '@/app/lib/redux/slices/profileSlice';
import { Card, CardHeader, CardTitle, CardContent } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { useAuth } from '@/app/providers/auth-provider';
import { useToast } from '@/app/components/ui/toast';
import { Avatar } from '@/app/components/ui/avatar';
import { formatDate } from '@/app/lib/utils';
import {
  User,
  Mail,
  Phone,
  Gamepad2,
  Shield,
  CheckCircle,
  AlertCircle,
  Save,
  MapPin,
  Calendar,
  Wallet,
  ShieldCheck,
  Edit2,
  Building,
  Globe,
  Clock,
  TrendingUp,
  Award,
  Trophy
} from 'lucide-react';
import { mockTournaments } from '@/app/lib/mock-data';

export default function OrganizerProfilePage() {
  const { user } = useAuth();
  const dispatch = useDispatch<AppDispatch>();
  const { success, error: showError } = useToast();
  const { data: profile, loading, error: profileError, hasProfile } = useSelector((state: any) => state.profile);
  
  const [isEditing, setIsEditing] = useState(false);
  const [mounted, setMounted] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    bgmiId: '',
    upiId: '',
    organizationName: '',
    website: '',
    description: '',
    gstNumber: '',
  });

  useEffect(() => {
    setMounted(true);
    dispatch(fetchProfile());
  }, [dispatch]);

  useEffect(() => {
    if (profile) {
      setFormData({
        fullName: profile.fullName || user?.name || '',
        phoneNumber: profile.phoneNumber || user?.phone || '',
        bgmiId: profile.bgmiId || '',
        upiId: profile.upiId || '',
        organizationName: profile.organizationName || '',
        website: profile.website || '',
        description: profile.description || '',
        gstNumber: profile.gstNumber || '',
      });
      setIsEditing(false);
    } else {
      setFormData(prev => ({
        ...prev,
        fullName: user?.name || '',
        phoneNumber: user?.phone || '',
      }));
      setIsEditing(false);
    }
  }, [profile, user]);

  const handleSave = async () => {
    try {
      if (hasProfile) {
        await dispatch(updateProfile(formData)).unwrap();
        success('Profile Updated', 'Organizer profile has been updated!');
        setIsEditing(false);
      } else {
        await dispatch(createProfile(formData)).unwrap();
        success('Profile Created', 'Organizer profile has been created!');
      }
    } catch (err: any) {
      showError('Error', err || 'Failed to save profile');
    }
  };

  // Calculate organizer stats
  const myTournaments = mockTournaments.filter(t => t.organizerId === user?.id);
  const stats = {
    totalTournaments: myTournaments.length,
    activeTournaments: myTournaments.filter(t => 
      ['REGISTRATION_OPEN', 'LIVE', 'IN_PROGRESS'].includes(t.status)
    ).length,
    completedTournaments: myTournaments.filter(t => t.status === 'COMPLETED').length,
    totalPrizePool: myTournaments.reduce((sum, t) => sum + t.prizePool, 0),
    totalParticipants: myTournaments.reduce((sum, t) => sum + t.currentParticipants, 0),
  };

  const kycStatusConfig = {
    NOT_SUBMITTED: { label: 'Not Submitted', color: 'bg-amber-50 border-amber-200 text-amber-500', icon: AlertCircle },
    PENDING: { label: 'Under Review', color: 'bg-blue-50 border-blue-200 text-blue-600', icon: Clock },
    APPROVED: { label: 'Verified', color: 'bg-green-50 border-green-200 text-green-600', icon: CheckCircle },
    REJECTED: { label: 'Rejected', color: 'bg-red-50 border-red-200 text-netflix-red', icon: AlertCircle },
  };

  const kycInfo = (kycStatusConfig as Record<string, any>)[profile?.kycStatus || user?.kycStatus || 'NOT_SUBMITTED'];
  const KycIcon = kycInfo.icon;

  if (loading && !profile) {
    return (
      <div className="section-padding-sm flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-netflix-red"></div>
      </div>
    );
  }

  return (
    <div className="section-padding-sm space-y-12 bg-[#fcfcfc] min-h-screen pb-24">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-zinc-100">
        <div>
          <h1 className="text-4xl md:text-6xl font-black text-zinc-900 uppercase tracking-widest leading-tight" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
            {hasProfile ? 'Organizer Dashboard' : 'Setup Organization'}
          </h1>
          <p className="text-zinc-400 font-bold uppercase tracking-widest text-sm mt-2">Manage your organization profile & tournaments</p>
        </div>
        <div className="flex items-center gap-4">
          {!isEditing && hasProfile ? (
            <Button variant="primary" onClick={() => setIsEditing(true)} className="px-8 py-6 text-sm font-black uppercase tracking-widest rounded-2xl">
              <Edit2 className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          ) : (
            <>
              {hasProfile && (
                <Button variant="secondary" onClick={() => setIsEditing(false)} className="px-8 py-6 text-sm font-black uppercase tracking-widest bg-zinc-100 text-zinc-900 hover:bg-zinc-200 border-none rounded-2xl">
                  Cancel
                </Button>
              )}
              <Button variant="primary" onClick={handleSave} className="px-8 py-6 text-sm font-black uppercase tracking-widest rounded-2xl">
                <Save className="h-4 w-4 mr-2" />
                {hasProfile ? 'Save Changes' : 'Create Profile'}
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Overview */}
        <Card className="lg:col-span-1 bg-white border-none shadow-xl shadow-zinc-200/50 rounded-4xl overflow-hidden">
          <CardContent className="text-center pt-8 pb-10">
            <div className="relative inline-block mb-6">
              <div className="mx-auto w-32 h-32 rounded-4xl bg-blue-600 flex items-center justify-center text-white text-4xl font-black border-4 border-zinc-50 shadow-xl">
                {mounted ? (profile?.fullName || user?.name || 'O').charAt(0) : 'O'}
              </div>
              <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-green-500 rounded-xl border-4 border-white flex items-center justify-center shadow-lg">
                <ShieldCheck className="w-5 h-5 text-white" />
              </div>
            </div>
            <h2 className="text-2xl font-black text-zinc-900 uppercase tracking-widest mb-1">
              {mounted && (profile?.fullName || user?.name || 'New Organization')}
            </h2>
            <p className="text-zinc-400 font-bold text-xs uppercase tracking-widest mb-6">{mounted && user?.email}</p>
            {mounted && (
              <div className="inline-flex px-4 py-1.5 bg-blue-50 text-blue-600 text-[10px] font-black rounded-lg uppercase tracking-[0.2em] border border-blue-100">
                OFFICIAL ORGANIZER
              </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-zinc-100">
              <div>
                <p className="text-2xl font-black text-zinc-900 leading-none mb-1">{stats.totalTournaments}</p>
                <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Total</p>
              </div>
              <div>
                <p className="text-2xl font-black text-netflix-red leading-none mb-1">{stats.activeTournaments}</p>
                <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Active</p>
              </div>
              <div>
                <p className="text-2xl font-black text-green-600 leading-none mb-1">{stats.completedTournaments}</p>
                <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Done</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Organization Details */}
          <Card className="bg-white border-none shadow-xl shadow-zinc-200/50 rounded-4xl overflow-hidden">
            <CardHeader className="border-b border-zinc-100 bg-zinc-50/50">
              <CardTitle className="flex items-center gap-4 text-zinc-900 uppercase tracking-widest text-lg font-black" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                <div className="w-1.5 h-6 bg-blue-600 rounded-full shadow-glow-blue" />
                Organization Details
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Legal Full Name</label>
                  {isEditing || !hasProfile ? (
                    <Input
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="Enter legal name"
                      className="mt-2 bg-zinc-50 border-zinc-100 text-zinc-900 font-bold h-12 rounded-xl"
                    />
                  ) : (
                    <p className="text-lg font-bold text-zinc-900 uppercase tracking-widest min-h-12 flex items-center">{formData.fullName || 'NOT SET'}</p>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Organization Name</label>
                  {isEditing || !hasProfile ? (
                    <Input
                      value={formData.organizationName}
                      onChange={(e) => setFormData({ ...formData, organizationName: e.target.value })}
                      placeholder="e.g. Mortal Esports"
                      className="mt-2 bg-zinc-50 border-zinc-100 text-zinc-900 font-bold h-12 rounded-xl"
                    />
                  ) : (
                    <p className="text-lg font-bold text-zinc-900 uppercase tracking-widest min-h-12 flex items-center">{formData.organizationName || 'NOT SET'}</p>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Website / Portfolio</label>
                  {isEditing || !hasProfile ? (
                    <Input
                      value={formData.website}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                      placeholder="https://yourpage.com"
                      className="mt-2 bg-zinc-50 border-zinc-100 text-zinc-900 font-bold h-12 rounded-xl"
                    />
                  ) : (
                    <p className="text-lg font-bold text-zinc-900 tracking-widest min-h-12 flex items-center">{formData.website || 'NOT SET'}</p>
                  )}
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-zinc-50 rounded-xl flex items-center justify-center shrink-0 border border-zinc-100 mt-1">
                    <Mail className="h-5 w-5 text-zinc-400" />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Contact Email</label>
                    <p className="text-base font-bold text-zinc-900 tracking-widest truncate max-w-[200px]">{mounted && user?.email}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-zinc-50 rounded-xl flex items-center justify-center shrink-0 border border-zinc-100 mt-1">
                    <Phone className="h-5 w-5 text-zinc-400" />
                  </div>
                  <div className="flex-1">
                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Contact Number</label>
                    {isEditing || !hasProfile ? (
                      <Input
                        value={formData.phoneNumber}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, phoneNumber: e.target.value })}
                        placeholder="9876543210"
                        className="mt-2 bg-zinc-50 border-zinc-100 text-zinc-900 font-bold h-12 rounded-xl"
                      />
                    ) : (
                      <p className="text-lg font-bold text-zinc-900 tracking-widest mt-1">{formData.phoneNumber || 'NOT SET'}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-zinc-50 rounded-xl flex items-center justify-center shrink-0 border border-zinc-100 mt-1">
                    <Wallet className="h-5 w-5 text-zinc-400" />
                  </div>
                  <div className="flex-1">
                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">UPI ID (For Payments)</label>
                    {isEditing || !hasProfile ? (
                      <Input
                        value={formData.upiId}
                        onChange={(e) => setFormData({ ...formData, upiId: e.target.value })}
                        placeholder="org@upi"
                        className="mt-2 bg-zinc-50 border-zinc-100 text-zinc-900 font-bold h-12 rounded-xl"
                      />
                    ) : (
                      <p className="text-lg font-bold text-zinc-900 tracking-widest mt-1">{formData.upiId || 'NOT SET'}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-zinc-100">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Organization Description</label>
                  {isEditing || !hasProfile ? (
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Tell us about your organization..."
                      className="w-full mt-2 bg-zinc-50 border border-zinc-100 text-zinc-900 font-bold p-4 rounded-xl min-h-32 focus:outline-none focus:ring-2 focus:ring-blue-500/10 transition-all"
                    />
                  ) : (
                    <p className="text-sm font-medium text-zinc-600 leading-relaxed mt-2">{formData.description || 'No description provided.'}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Legal Information */}
          <Card className="bg-white border-none shadow-xl shadow-zinc-200/50 rounded-4xl overflow-hidden">
            <CardHeader className="border-b border-zinc-100 bg-zinc-50/50">
              <CardTitle className="flex items-center gap-4 text-zinc-900 uppercase tracking-widest text-lg font-black" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                <div className="w-1.5 h-6 bg-amber-500 rounded-full shadow-glow-amber" />
                Legal & Gaming Info
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">GST Number (Optional)</label>
                  {isEditing || !hasProfile ? (
                    <Input
                      value={formData.gstNumber}
                      onChange={(e) => setFormData({ ...formData, gstNumber: e.target.value })}
                      placeholder="GSTIN"
                      className="mt-2 bg-zinc-50 border-zinc-100 text-zinc-900 font-mono tracking-widest h-12 rounded-xl"
                    />
                  ) : (
                    <p className="text-lg font-bold text-zinc-900 font-mono tracking-widest mt-1">{formData.gstNumber || 'NOT PROVIDED'}</p>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">BGMI Admin ID (For Verification)</label>
                  {isEditing || !hasProfile ? (
                    <Input
                      value={formData.bgmiId}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, bgmiId: e.target.value })}
                      placeholder="Enter Player ID"
                      className="mt-2 bg-zinc-50 border-zinc-100 text-zinc-900 font-mono tracking-widest h-12 rounded-xl"
                    />
                  ) : (
                    <p className="text-lg font-bold text-zinc-900 font-mono tracking-widest mt-1">{formData.bgmiId || 'NOT SET'}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Verification Status */}
          <Card className="bg-white border-none shadow-xl shadow-zinc-200/50 rounded-4xl overflow-hidden">
            <CardHeader className="border-b border-zinc-100 bg-zinc-50/50">
              <CardTitle className="flex items-center gap-4 text-zinc-900 uppercase tracking-widest text-lg font-black" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                <div className="w-1.5 h-6 bg-green-500 rounded-full shadow-glow-green" />
                verification status
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-8 p-8 bg-zinc-50 rounded-4xl border border-zinc-100">
                <div className="flex items-center gap-6">
                  <div className={cn(
                    "w-16 h-16 rounded-2xl flex items-center justify-center border-2 shadow-sm transition-all",
                    kycInfo.color
                  )}>
                    <KycIcon className="h-8 w-8" />
                  </div>
                  <div>
                    <p className="text-xl font-black text-zinc-900 uppercase tracking-widest mb-1">Account Standing</p>
                    <div className={cn(
                      "inline-flex px-3 py-1 rounded text-[10px] font-black uppercase tracking-widest border",
                      kycInfo.color
                    )}>
                      {kycInfo.label}
                    </div>
                  </div>
                </div>
                {profile?.kycStatus === 'NOT_SUBMITTED' && (
                  <Button variant="primary" className="w-full md:w-auto px-10 py-6 text-sm font-black uppercase tracking-widest bg-netflix-red hover:bg-[#b00710] text-white rounded-2xl">
                    Submit Documents
                  </Button>
                )}
              </div>
              <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mt-6 leading-relaxed max-w-2xl">
                Official organizer status requires valid PAN/GST details. Verification typically takes 24-48 hours.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
