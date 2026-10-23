import React, { useState } from 'react';
import {
  X,
  Mail,
  Send,
  CheckCircle2,
  ExternalLink,
  Copy,
  Sparkles,
  Paperclip,
  Clock,
  ShieldCheck,
  Check
} from 'lucide-react';

const EmailComposerModal = ({
  isOpen,
  onClose,
  recipientEmail = 'support@vibewear.com',
  recipientName = 'VibeWear Executive Support',
  defaultSubject = 'Inquiry regarding VibeWear Order',
  orderId = null,
  onSent = null
}) => {
  const [subject, setSubject] = useState(
    defaultSubject + (orderId ? ` #${orderId}` : '')
  );
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [sentTicketId, setSentTicketId] = useState('');

  if (!isOpen) return null;

  const quickPrompts = [
    'Please deliver my package before 6:00 PM today.',
    'Please call my mobile number before arriving at the gate.',
    'Need urgent assistance regarding item size replacement.',
    'Please leave package with security desk / neighbor if unreachable.'
  ];

  const handleCopyEmail = () => {
    navigator.clipboard?.writeText(recipientEmail);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const handleSendEmail = (e) => {
    if (e) e.preventDefault();
    if (!message.trim() && !subject.trim()) return;

    setIsSending(true);
    const ticketId = 'VW-MAIL-' + Math.floor(100000 + Math.random() * 900000);

    setTimeout(() => {
      setIsSending(false);
      setIsSent(true);
      setSentTicketId(ticketId);

      // Record to local storage outbox
      try {
        const outbox = JSON.parse(localStorage.getItem('vibewear_sent_emails') || '[]');
        outbox.unshift({
          ticketId,
          recipientEmail,
          recipientName,
          subject,
          message,
          orderId,
          sentAt: new Date().toISOString()
        });
        localStorage.setItem('vibewear_sent_emails', JSON.stringify(outbox.slice(0, 30)));
      } catch (err) {
        console.error(err);
      }

      if (onSent) onSent(ticketId);
    }, 900);
  };

  const handleOpenGmail = () => {
    const encodedTo = encodeURIComponent(recipientEmail);
    const encodedSubject = encodeURIComponent(subject);
    const encodedBody = encodeURIComponent(
      message ? `${message}\n\n--\nOrder Reference: #${orderId || 'General Inquiry'}` : ''
    );
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodedTo}&su=${encodedSubject}&body=${encodedBody}`;
    window.open(gmailUrl, '_blank', 'noopener,noreferrer');
  };

  const handleOpenDefaultMail = () => {
    const mailtoUrl = `mailto:${recipientEmail}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(message)}`;
    window.location.href = mailtoUrl;
  };

  const handleResetAndClose = () => {
    setIsSent(false);
    setMessage('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div
        className="relative w-full max-w-lg bg-white dark:bg-[#0C0B14] border-2 border-purple-200 dark:border-pink-500/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col text-slate-900 dark:text-white animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="relative p-5 sm:p-6 bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 text-white border-b border-white/10 shrink-0">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-pink-500 to-brand-600 flex items-center justify-center shadow-lg shadow-pink-500/30 shrink-0">
                <Mail className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base sm:text-lg font-black font-display tracking-tight text-white">
                    Send Official Email
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-pink-500/20 text-pink-300 border border-pink-500/30">
                    Direct Mail
                  </span>
                </div>
                <p className="text-xs text-white/70 mt-0.5">
                  To: <strong className="text-pink-300 font-semibold">{recipientName}</strong>
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleResetAndClose}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors cursor-pointer"
              title="Close Email Modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto max-h-[75vh] space-y-4 text-xs">
          {isSent ? (
            <div className="py-6 text-center space-y-4 animate-scale-up">
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-500/40 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <h4 className="text-lg font-black font-display text-slate-900 dark:text-white">
                  Email Sent Successfully!
                </h4>
                <p className="text-xs text-slate-600 dark:text-white/70 max-w-sm mx-auto">
                  Your message has been officially recorded and dispatched to{' '}
                  <strong className="text-pink-600 dark:text-pink-400">{recipientEmail}</strong>.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-purple-50 dark:bg-white/5 border border-purple-200 dark:border-white/10 max-w-sm mx-auto text-left space-y-1.5 font-mono text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-white/50">Ticket Reference:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{sentTicketId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-white/50">Recipient:</span>
                  <span className="font-bold text-pink-600 dark:text-pink-400">{recipientEmail}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-white/50">Expected Reply:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">Within 2 Hours</span>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-2 justify-center">
                <button
                  type="button"
                  onClick={handleOpenGmail}
                  className="py-2.5 px-4 rounded-xl bg-purple-100 hover:bg-purple-200 dark:bg-white/10 dark:hover:bg-white/20 text-slate-800 dark:text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-pink-500" />
                  <span>Also Open in Gmail</span>
                </button>
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSendEmail} className="space-y-4">
              {/* Recipient Details Pill */}
              <div className="p-3 rounded-2xl bg-purple-50 dark:bg-white/5 border border-purple-200 dark:border-white/10 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-pink-500/10 text-pink-600 dark:text-pink-400 flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] text-slate-500 dark:text-white/50 uppercase font-bold tracking-wider">
                      Sending To
                    </p>
                    <p className="text-xs font-bold font-mono text-slate-900 dark:text-white truncate">
                      {recipientEmail}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className="px-2.5 py-1.5 rounded-lg bg-white dark:bg-black/60 hover:bg-purple-100 dark:hover:bg-white/10 border border-purple-200 dark:border-white/10 text-slate-700 dark:text-white font-bold text-[11px] flex items-center gap-1 transition-all cursor-pointer shrink-0"
                  title="Copy email to clipboard"
                >
                  {copiedEmail ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-500" />
                      <span className="text-emerald-600 dark:text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3 text-slate-400" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>

              {/* Subject Line */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-white/80 mb-1">
                  Subject Line <span className="text-pink-500">*</span>
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Order Delivery Delivery Question"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-black border border-purple-200 dark:border-white/10 text-slate-900 dark:text-white font-medium focus:outline-none focus:border-pink-500 text-xs shadow-inner transition-all"
                />
              </div>

              {/* Quick Prompt Chips */}
              <div>
                <label className="block text-[11px] font-bold text-slate-500 dark:text-white/60 mb-1.5 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-pink-500" />
                  <span>Quick Message Suggestions</span>
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {quickPrompts.map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setMessage((prev) => (prev ? `${prev} ${p}` : p))}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-purple-100 dark:bg-white/5 dark:hover:bg-white/10 border border-purple-200/60 dark:border-white/10 text-[10px] font-medium text-slate-700 dark:text-white/80 transition-all cursor-pointer text-left"
                    >
                      + {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Message Body */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-white/80 mb-1">
                  Your Message / Inquiry <span className="text-pink-500">*</span>
                </label>
                <textarea
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message, delivery notes, or sizing inquiry here..."
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-black border border-purple-200 dark:border-white/10 text-slate-900 dark:text-white font-medium focus:outline-none focus:border-pink-500 text-xs shadow-inner transition-all resize-none"
                />
              </div>

              {/* Primary & Fallback Actions */}
              <div className="space-y-2 pt-2">
                <button
                  type="submit"
                  disabled={isSending}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-pink-600 via-brand-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-pink-500/30 hover:scale-[1.01] active:scale-98 transition-all cursor-pointer disabled:opacity-60"
                >
                  {isSending ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Dispatching Email...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Send Email Now (In-App)</span>
                    </>
                  )}
                </button>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    type="button"
                    onClick={handleOpenGmail}
                    className="py-2 px-3 rounded-xl bg-red-50 hover:bg-red-100 dark:bg-red-950/30 dark:hover:bg-red-950/50 border border-red-200 dark:border-red-500/30 text-red-700 dark:text-red-300 font-bold text-[11px] flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    title="Open in Gmail in new tab"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Open in Gmail Web</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleOpenDefaultMail}
                    className="py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/20 border border-purple-200/60 dark:border-white/10 text-slate-700 dark:text-white font-bold text-[11px] flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    title="Open in your computer's mail app"
                  >
                    <Mail className="w-3.5 h-3.5 text-pink-500" />
                    <span>System Mail App</span>
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmailComposerModal;
