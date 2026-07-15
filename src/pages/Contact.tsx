import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'General Inquiry',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    // Reset state after simulated send
    setTimeout(() => {
      setFormData({ name: '', email: '', subject: 'General Inquiry', message: '' });
    }, 100);
  };

  return (
    <div className="py-6 max-w-5xl mx-auto space-y-12 animate-fade-in">
      <div className="space-y-2 text-center md:text-left">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Contact Portal Support</h1>
        <p className="text-slate-600">Have questions about listings, application processes, or credentials? Submit an official ticket below.</p>
      </div>

      <div className="grid md:grid-cols-5 gap-8">
        {/* Contact Info */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-slate-900 text-white rounded-2xl p-6 space-y-6 shadow-md">
            <h3 className="text-lg font-bold">Official Headquarters</h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              Office of Public Affairs & Information Services<br />
              Constitutional Square, Block C<br />
              Washington, DC 20001
            </p>

            <hr className="border-slate-800" />

            <div className="space-y-4 text-sm">
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-blue-400" />
                <span>+1 (800) 555-0199 (Toll-Free)</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-blue-400" />
                <span>support@government-portal.gov</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-blue-400" />
                <span>Washington, DC</span>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 text-sm text-blue-800 space-y-2">
            <h4 className="font-bold">Standard Processing Times</h4>
            <p className="leading-relaxed">
              Standard inquiries are processed and replied to within **3 to 5 business days**. Security clearances or grant evaluations may require additional cycles.
            </p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="md:col-span-3 bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
          {submitted ? (
            <div className="text-center py-12 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900">Official Inquiry Received</h3>
              <p className="text-slate-600 max-w-sm mx-auto text-sm leading-relaxed">
                Thank you for contacting us. A validation code has been sent to your registered address. We will inspect your request shortly.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-4 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-lg text-sm transition"
              >
                Submit another inquiry
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="name" className="text-xs font-bold text-slate-700 uppercase tracking-wide">Full Name</label>
                  <input
                    id="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="email" className="text-xs font-bold text-slate-700 uppercase tracking-wide">Email Address</label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    placeholder="john.doe@example.com"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="subject" className="text-xs font-bold text-slate-700 uppercase tracking-wide">Inquiry Topic</label>
                <select
                  id="subject"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                >
                  <option value="General Inquiry">General Inquiry</option>
                  <option value="Government Jobs Support">Government Jobs Support</option>
                  <option value="Procurement & Tenders">Procurement & Tenders</option>
                  <option value="Grants & Funding Programs">Grants & Funding Programs</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="message" className="text-xs font-bold text-slate-700 uppercase tracking-wide">Official Message Details</label>
                <textarea
                  id="message"
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  placeholder="Provide precise details regarding your agency, application code, or proposal issue..."
                />
              </div>

              <button
                type="submit"
                className="w-full inline-flex items-center justify-center px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-lg transition gap-2 shadow-sm"
              >
                Send Message <Send className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
