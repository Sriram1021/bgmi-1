'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Textarea } from '@/app/components/ui/textarea';
import { useToast } from '@/app/components/ui/toast';
import { 
  Building, 
  Mail, 
  MessageSquare, 
  Send, 
  LifeBuoy, 
  Clock, 
  Globe,
  Twitter,
  Instagram,
  Youtube
} from 'lucide-react';

const CATEGORIES = [
  'General Inquiry',
  'Account & Profile',
  'Tournament Issues',
  'Wallet & Payments',
  'Organizer Application',
  'Technical Bug',
  'Other',
];

export default function SupportPage() {
  const { success } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: 'General Inquiry',
    subject: '',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    success(
      'Ticket Created',
      'We have received your request and will get back to you within 24 hours.'
    );

    setFormData({
      name: '',
      email: '',
      category: 'General Inquiry',
      subject: '',
      message: '',
    });
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen  py-12 px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto text-center mb-16">
        <h1 className="text-4xl md:text-6xl font-black text-zinc-900 uppercase tracking-widest mb-4" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
          Help Center
        </h1>
        <p className="text-zinc-500 font-bold uppercase tracking-widest text-sm max-w-2xl mx-auto">
          Have a question or facing an issue? Our support team is here to help you 24/7.
        </p>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Contact Info & Help Cards */}
        <div className="space-y-6">
          <Card className="bg-white border-zinc-100 shadow-xl rounded-3xl overflow-hidden group">
            <CardContent className="p-8">
              <div className="w-12 h-12 bg-netflix-red/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Mail className="w-6 h-6 text-netflix-red" />
              </div>
              <h3 className="text-xl font-black text-zinc-900 uppercase tracking-widest mb-2">Email Support</h3>
              <p className="text-zinc-500 text-sm font-medium mb-4">Direct message our experts</p>
              <a href="mailto:support@capsro.com" className="text-zinc-900 font-bold hover:text-netflix-red transition-colors">
                support@capsro.com
              </a>
            </CardContent>
          </Card>

          <Card className="bg-white border-zinc-100 shadow-xl rounded-3xl overflow-hidden group">
            <CardContent className="p-8">
              <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Clock className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-black text-zinc-900 uppercase tracking-widest mb-2">Response Time</h3>
              <p className="text-zinc-500 text-sm font-medium mb-4">Current average wait</p>
              <p className="text-zinc-900 font-bold">Under 2 hours</p>
            </CardContent>
          </Card>

          {/* Social Links */}
          <div className="pt-6 flex gap-4">
            {[Twitter, Instagram, Youtube].map((Icon, i) => (
              <a 
                key={i} 
                href="#" 
                className="w-12 h-12 bg-zinc-50 border border-zinc-100 rounded-2xl flex items-center justify-center text-zinc-400 hover:bg-netflix-red hover:text-white hover:border-netflix-red transition-all shadow-sm"
              >
                <Icon className="w-5 h-5" />
              </a>
            ))}
          </div>
        </div>

        {/* Support Form */}
        <div className="lg:col-span-2">
          <Card className="bg-white border-zinc-100 shadow-xl rounded-[2.5rem] overflow-hidden">
            <CardHeader className="border-b border-zinc-50 bg-zinc-50/50 p-8">
              <CardTitle className="flex items-center gap-4 text-zinc-900 uppercase tracking-widest text-xl font-black">
                <div className="w-1.5 h-8 bg-netflix-red rounded-full" />
                Submit a Request
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 lg:p-12">
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <Input
                    label="Your Name"
                    placeholder="Enter full name"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="bg-zinc-50 border-zinc-200 text-zinc-900 rounded-xl"
                  />
                  <Input
                    label="Email Address"
                    type="email"
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="bg-zinc-50 border-zinc-200 text-zinc-900 rounded-xl"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="w-full">
                    <label className="block text-xs font-medium text-zinc-500 mb-1.5 uppercase tracking-widest">
                      Category
                    </label>
                    <select
                      value={formData.category}
                      onChange={e => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-2 text-sm bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 focus:outline-none focus:ring-1 focus:ring-netflix-red"
                    >
                      {CATEGORIES.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <Input
                    label="Subject"
                    placeholder="Brief summary of issue"
                    value={formData.subject}
                    onChange={e => setFormData({ ...formData, subject: e.target.value })}
                    required
                    className="bg-zinc-50 border-zinc-200 text-zinc-900 rounded-xl"
                  />
                </div>

                <Textarea
                  label="Message"
                  placeholder="Describe your issue in detail..."
                  value={formData.message}
                  onChange={e => setFormData({ ...formData, message: e.target.value })}
                  required
                  className="bg-zinc-50 border-zinc-200 text-zinc-900"
                />

                <Button
                  type="submit"
                  variant="primary"
                  disabled={isSubmitting}
                  className="w-full py-8 text-sm font-black uppercase tracking-[0.2em] shadow-lg shadow-red-500/20"
                  leftIcon={isSubmitting ? null : <Send className="w-5 h-5" />}
                >
                  {isSubmitting ? 'Sending Request...' : 'Send Message'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
