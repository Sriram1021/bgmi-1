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
  Clock
} from 'lucide-react';

export default function ProfilePage() {
  const { user } = useAuth();
  const dispatch = useDispatch<AppDispatch>();
  const { success, error: showError } = useToast();
  const { data: profile, loading, error, hasProfile } = useSelector((state: any) => state.profile);
  const [isEditing, setIsEditing] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    bgmiId: '',
    pubgId: '',
    upiId: '',
    dateOfBirth: '',
    organizationName: '',
    website: '',
    description: '',
    gstNumber: '',
  });

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  useEffect(() => {
    if (profile) {
      setFormData({
        fullName: profile.fullName || user?.name || '',
        phoneNumber: profile.phoneNumber || user?.phone || '',
        bgmiId: profile.bgmiId || '',
        pubgId: profile.pubgId || '',
        upiId: profile.upiId || '',
        dateOfBirth: profile.dateOfBirth || '',
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

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    try {
      if (hasProfile) {
        await dispatch(updateProfile(formData)).unwrap();
        success('Profile Updated', 'Your profile has been updated successfully!');
        setIsEditing(false);
      } else {
        await dispatch(createProfile(formData)).unwrap();
        success('Profile Created', 'Your profile has been created successfully!');
      }
    } catch (err: any) {
      showError('Error', err || 'Failed to save profile');
    }
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
            {hasProfile ? 'Your Profile' : 'Create Profile'}
          </h1>
          <p className="text-zinc-400 font-bold uppercase tracking-widest text-sm mt-2">Manage your account settings & game IDs</p>
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
              <Button variant="primary" onClick={() => handleSubmit()} className="px-8 py-6 text-sm font-black uppercase tracking-widest rounded-2xl">
                <Save className="h-4 w-4 mr-2" />
                {hasProfile ? 'Save Changes' : 'Create Profile'}
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Overview */}
        <Card className="lg:col-span-1 bg-white border-zinc-100 shadow-xl rounded-4xl overflow-hidden border-none shadow-zinc-200/50">
          <CardContent className="text-center pt-8 pb-10">
            <div className="relative inline-block mb-6">
              <div className="mx-auto w-32 h-32 rounded-4xl bg-netflix-red flex items-center justify-center text-white text-4xl font-black border-4 border-zinc-50 shadow-xl">
                {mounted ? (profile?.fullName || user?.name || 'U').charAt(0) : 'U'}
              </div>
              <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-green-500 rounded-xl border-4 border-white flex items-center justify-center shadow-lg">
                <ShieldCheck className="w-5 h-5 text-white" />
              </div>
            </div>
            <h2 className="text-2xl font-black text-zinc-900 uppercase tracking-widest mb-1">
              {mounted && (profile?.fullName || user?.name || 'Gamer Name')}
            </h2>
            <p className="text-zinc-400 font-bold text-xs uppercase tracking-widest mb-6">{mounted && user?.email}</p>
            {mounted && (
              <div className={cn(
                "inline-flex px-3 py-1 text-[10px] font-black rounded uppercase tracking-[0.2em] border",
                user?.role === 'ORGANIZER' 
                  ? 'bg-blue-50 text-blue-600 border-blue-200' 
                  : 'bg-netflix-red/10 text-netflix-red border-netflix-red/20'
              )}>
                {user?.role}
              </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mt-8 pt-8 border-t border-zinc-100">
              <div>
                <p className="text-3xl font-black text-zinc-900 uppercase tracking-widest leading-none mb-2">
                  {user?.stats?.tournamentsPlayed || 0}
                </p>
                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Tournaments</p>
              </div>
              <div>
                <p className="text-3xl font-black text-green-600 uppercase tracking-widest leading-none mb-2">
                  {user?.stats?.tournamentsWon || 0}
                </p>
                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Total Wins</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <Card className="bg-white border-zinc-100 shadow-xl rounded-4xl overflow-hidden border-none shadow-zinc-200/50">
            <CardHeader className="border-b border-zinc-100 bg-zinc-50/50">
              <CardTitle className="flex items-center gap-4 text-zinc-900 uppercase tracking-widest text-lg font-black" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                <div className="w-1.5 h-6 bg-netflix-red rounded-full shadow-glow-red" />
                Personal Information
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

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-zinc-50 rounded-xl flex items-center justify-center shrink-0 border border-zinc-100 mt-1">
                    <Mail className="h-5 w-5 text-zinc-400" />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Contact Email</label>
                    <p className="text-base font-bold text-zinc-900 tracking-widest truncate max-w-[200px]">{mounted && user?.email}</p>
                    {user?.isEmailVerified && (
                      <div className="inline-flex items-center gap-1.5 text-green-600 text-[9px] font-black uppercase tracking-widest mt-1">
                        <CheckCircle className="h-3 w-3" /> VERIFIED
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-zinc-50 rounded-xl flex items-center justify-center shrink-0 border border-zinc-100 mt-1">
                    <Phone className="h-5 w-5 text-zinc-400" />
                  </div>
                  <div className="flex-1">
                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Phone Number</label>
                    {isEditing || !hasProfile ? (
                      <Input
                        value={formData.phoneNumber}
                        onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
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
                    <Calendar className="h-5 w-5 text-zinc-400" />
                  </div>
                  <div className="flex-1">
                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Date of Birth</label>
                    {isEditing || !hasProfile ? (
                      <Input
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                        className="mt-2 bg-zinc-50 border-zinc-100 text-zinc-900 font-bold h-12 rounded-xl"
                      />
                    ) : (
                      <p className="text-lg font-bold text-zinc-900 uppercase tracking-widest mt-1">
                        {formData.dateOfBirth ? formatDate(formData.dateOfBirth) : 'NOT SET'}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* UPI ID - Additional Field */}
              <div className="pt-4 border-t border-zinc-100">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-zinc-50 rounded-xl flex items-center justify-center shrink-0 border border-zinc-100 mt-1">
                    <Wallet className="h-5 w-5 text-zinc-400" />
                  </div>
                  <div className="flex-1">
                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">UPI ID (For Payouts)</label>
                    {isEditing || !hasProfile ? (
                      <Input
                        value={formData.upiId}
                        onChange={(e) => setFormData({ ...formData, upiId: e.target.value })}
                        placeholder="yourname@upi"
                        className="mt-2 bg-zinc-50 border-zinc-100 text-zinc-900 font-bold h-12 rounded-xl"
                      />
                    ) : (
                      <p className="text-lg font-bold text-zinc-900 tracking-widest mt-1">{formData.upiId || 'NOT SET'}</p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Game IDs or Organization Info based on role */}
          {user?.role === 'ORGANIZER' && (
            <Card className="bg-white border-zinc-100 shadow-xl rounded-4xl overflow-hidden border-none shadow-zinc-200/50">
              <CardHeader className="border-b border-zinc-100 bg-zinc-50/50">
                <CardTitle className="flex items-center gap-4 text-zinc-900 uppercase tracking-widest text-lg font-black" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                  <div className="w-1.5 h-6 bg-blue-500 rounded-full shadow-glow-blue" />
                  Organization Details
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Organization Name</label>
                    {isEditing || !hasProfile ? (
                      <Input
                        value={formData.organizationName}
                        onChange={(e) => setFormData({ ...formData, organizationName: e.target.value })}
                        placeholder="Org Name"
                        className="mt-2 bg-zinc-50 border-zinc-100 text-zinc-900 font-bold h-12 rounded-xl"
                      />
                    ) : (
                      <p className="text-lg font-bold text-zinc-900 uppercase tracking-widest min-h-12 flex items-center">{formData.organizationName || 'NOT SET'}</p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Website</label>
                    {isEditing || !hasProfile ? (
                      <Input
                        value={formData.website}
                        onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                        placeholder="https://example.com"
                        className="mt-2 bg-zinc-50 border-zinc-100 text-zinc-900 font-bold h-12 rounded-xl"
                      />
                    ) : (
                      <p className="text-lg font-bold text-zinc-900 tracking-widest min-h-12 flex items-center">{formData.website || 'NOT SET'}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="bg-white border-zinc-100 shadow-xl rounded-4xl overflow-hidden border-none shadow-zinc-200/50">
            <CardHeader className="border-b border-zinc-100 bg-zinc-50/50">
              <CardTitle className="flex items-center gap-4 text-zinc-900 uppercase tracking-widest text-lg font-black" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                <div className="w-1.5 h-6 bg-green-500 rounded-full shadow-glow-accent" />
                Gaming Passport
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-zinc-50 p-6 rounded-2xl border border-zinc-100">
                  <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest block mb-4">BGMI Player ID</label>
                  {isEditing || !hasProfile ? (
                    <Input
                      value={formData.bgmiId}
                      onChange={(e) => setFormData({ ...formData, bgmiId: e.target.value })}
                      placeholder="Enter your BGMI ID"
                      className="bg-white border-zinc-100 text-zinc-900 font-mono tracking-widest rounded-xl"
                    />
                  ) : (
                    <p className="text-2xl font-black text-zinc-900 font-mono tracking-[0.2em]">{formData.bgmiId || 'NOT SET'}</p>
                  )}
                </div>

                <div className="bg-zinc-50 p-6 rounded-2xl border border-zinc-100">
                  <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest block mb-4">PUBG Mobile ID</label>
                  {isEditing || !hasProfile ? (
                    <Input
                      value={formData.pubgId}
                      onChange={(e) => setFormData({ ...formData, pubgId: e.target.value })}
                      placeholder="Enter your PUBG Mobile ID"
                      className="bg-white border-zinc-100 text-zinc-900 font-mono tracking-widest rounded-xl"
                    />
                  ) : (
                    <p className="text-2xl font-black text-zinc-900 font-mono tracking-[0.2em]">{formData.pubgId || 'NOT SET'}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* KYC Status */}
          <Card className="bg-white border-zinc-100 shadow-xl rounded-4xl overflow-hidden border-none shadow-zinc-200/50">
            <CardHeader className="border-b border-zinc-100 bg-zinc-50/50">
              <CardTitle className="flex items-center gap-4 text-zinc-900 uppercase tracking-widest text-lg font-black" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                <div className="w-1.5 h-6 bg-blue-500 rounded-full shadow-glow-blue" />
                Wallet Verification
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
                    <p className="text-xl font-black text-zinc-900 uppercase tracking-widest mb-1">Identity Status</p>
                    <div className={cn(
                      "inline-flex px-3 py-1 rounded text-[10px] font-black uppercase tracking-widest border",
                      kycInfo.color
                    )}>
                      {kycInfo.label}
                    </div>
                  </div>
                </div>
                {profile?.kycStatus === 'NOT_SUBMITTED' && (
                  <Button variant="primary" className="w-full md:w-auto px-10 py-6 text-sm font-black uppercase tracking-widest rounded-2xl">
                    Complete KYC
                  </Button>
                )}
              </div>
              <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mt-6 leading-relaxed max-w-2xl">
                Note: KYC verification is mandatory for prize payouts above ₹100. Please upload your Aadhar or PAN card for instant verification.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
