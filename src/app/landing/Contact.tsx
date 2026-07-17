'use client';

import { useState } from 'react';

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setName('');
      setEmail('');
      setMessage('');
      setTimeout(() => setSuccess(false), 3000);
    }, 1200);
  };

  return (
    <section className="py-20 bg-bg-secondary/40 border-t border-border-primary/50 relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-12 space-y-4">
          <h2 className="text-xs font-bold text-accent-color uppercase tracking-widest">Get In Touch</h2>
          <h3 className="text-3xl font-extrabold text-text-primary tracking-tight">Have Questions?</h3>
          <p className="text-text-secondary text-sm max-w-lg mx-auto">
            Drop us a message, and our support team will get back to you within 24 hours.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-bg-secondary border border-border-primary rounded-2xl p-8 shadow-xl relative overflow-hidden">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-2 uppercase tracking-wider">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Jane Smith"
                  className="w-full px-4 py-3 rounded-xl bg-bg-primary border border-border-primary text-text-primary placeholder-text-secondary/40 focus:border-accent-color focus:ring-4 focus:ring-accent-color-glow outline-none transition-all text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-2 uppercase tracking-wider">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jane@example.com"
                  className="w-full px-4 py-3 rounded-xl bg-bg-primary border border-border-primary text-text-primary placeholder-text-secondary/40 focus:border-accent-color focus:ring-4 focus:ring-accent-color-glow outline-none transition-all text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-2 uppercase tracking-wider">
                Your Message
              </label>
              <textarea
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell us what you need help with..."
                className="w-full px-4 py-3 rounded-xl bg-bg-primary border border-border-primary text-text-primary placeholder-text-secondary/40 focus:border-accent-color focus:ring-4 focus:ring-accent-color-glow outline-none transition-all text-sm resize-none"
              />
            </div>

            {success && (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium text-center">
                ✔ Message sent successfully! We will get in touch soon.
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl bg-accent-color hover:bg-accent-color-hover text-white font-bold text-sm shadow-lg hover:shadow-accent-color/30 transition-all cursor-pointer flex items-center justify-center gap-2 hover:scale-[1.01]"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Sending message...</span>
                </>
              ) : (
                <span>Send Message</span>
              )}
            </button>
          </form>
        </div>

      </div>
    </section>
  );
}
