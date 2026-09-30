import { useState } from "react";
import { sendContactMessage } from "../apis/contactApi";

const contactInfo = [
  {
    icon: "📧",
    label: "Email",
    value: "civicpulsecontact@gmail.com",
    href: "mailto:civicpulsecontact@gmail.com",
  },
  { icon: "📍", label: "Headquarters", value: "Abuja, FCT, Nigeria" },
  { icon: "🐦", label: "Twitter / X", value: "@CivicPulseNG" },
  { icon: "💼", label: "LinkedIn", value: "CivicPulse Nigeria" },
];

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const update = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    setError("");
    try {
      await sendContactMessage(form);
      setForm({ name: "", email: "", subject: "", message: "" });
      setSubmitted(true);
    } catch (err) {
      setError(
        err.response?.data?.errors?.[0]?.message ||
          err.response?.data?.message ||
          "Could not send your message. Please try again.",
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-full bg-white">
      {/* Hero */}
      <section className="bg-[#F8FAFC] border-b border-[#E2E8F0] py-14 md:py-20">
        <div className="max-w-3xl mx-auto px-4 md:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-[#0F766E]/10 text-[#0F766E] text-[12px] font-600 uppercase tracking-wider px-3 py-1 rounded-full mb-5">
            Get in Touch
          </div>

          <h1 className="font-display font-800 text-[#1E293B] text-4xl md:text-5xl leading-tight mb-4">
            We&apos;d love to hear from you
          </h1>

          <p className="text-[#64748B] text-lg leading-relaxed">
            Have a question, partnership inquiry, or feedback? Reach out and our
            team will get back to you as soon as possible.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-14 md:py-20">
        <div className="max-w-5xl mx-auto px-4 md:px-8">
          <div className="grid md:grid-cols-5 gap-10">
            {/* Form */}
            <div className="md:col-span-3">
              {submitted ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-[#0F766E]/10 flex items-center justify-center mx-auto mb-5">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#0F766E"
                      strokeWidth="2.5"
                      className="w-8 h-8"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>

                  <h2 className="font-display font-800 text-[#1E293B] text-2xl mb-2">
                    Message sent!
                  </h2>

                  <p className="text-[#64748B] text-[15px] mb-6">
                    Thank you for reaching out. We will respond within 2
                    business days.
                  </p>

                  <button
                    onClick={() => setSubmitted(false)}
                    className="text-[#0F766E] font-500 text-sm hover:underline"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-[13px] font-500 text-[#1E293B] mb-1.5">
                        Full Name
                      </label>

                      <input
                        required
                        value={form.name}
                        onChange={update("name")}
                        placeholder="Amara Okafor"
                        className="w-full px-3.5 py-2.5 bg-white border border-[#E2E8F0] rounded-xl text-[14px] text-[#1E293B] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#0F766E]/20 focus:border-[#0F766E] transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-[13px] font-500 text-[#1E293B] mb-1.5">
                        Email Address
                      </label>

                      <input
                        required
                        type="email"
                        value={form.email}
                        onChange={update("email")}
                        placeholder="you@example.com"
                        className="w-full px-3.5 py-2.5 bg-white border border-[#E2E8F0] rounded-xl text-[14px] text-[#1E293B] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#0F766E]/20 focus:border-[#0F766E] transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[13px] font-500 text-[#1E293B] mb-1.5">
                      Subject
                    </label>

                    <select
                      required
                      value={form.subject}
                      onChange={update("subject")}
                      className="w-full px-3.5 py-2.5 bg-white border border-[#E2E8F0] rounded-xl text-[14px] text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#0F766E]/20 focus:border-[#0F766E] transition-colors appearance-none cursor-pointer"
                    >
                      <option value="">Select a subject...</option>
                      <option>General Enquiry</option>
                      <option>Partnership / Organisation</option>
                      <option>Community Support</option>
                      <option>Technical Issue</option>
                      <option>Press / Media</option>
                      <option>Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[13px] font-500 text-[#1E293B] mb-1.5">
                      Message
                    </label>

                    <textarea
                      required
                      value={form.message}
                      onChange={update("message")}
                      placeholder="Tell us how we can help..."
                      minLength={10}
                      rows={6}
                      className="w-full px-3.5 py-2.5 bg-white border border-[#E2E8F0] rounded-xl text-[14px] text-[#1E293B] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#0F766E]/20 focus:border-[#0F766E] transition-colors resize-none"
                    />
                  </div>

                  {error && (
                    <p className="text-[13px] text-[#DC2626]">{error}</p>
                  )}

                  <button
                    type="submit"
                    disabled={sending}
                    className="w-full bg-[#0F766E] hover:bg-[#115E59] text-white font-600 text-[14px] py-3 rounded-xl transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {sending ? "Sending..." : "Send Message"}
                  </button>
                </form>
              )}
            </div>

            {/* Contact info */}
            <div className="md:col-span-2 space-y-6">
              <div>
                <h2 className="font-display font-700 text-[#1E293B] text-lg mb-2">
                  Contact information
                </h2>

                <p className="text-[#64748B] text-[13px] leading-relaxed">
                  We typically respond within 2 business days. For urgent
                  community matters, please use the support option.
                </p>
              </div>

              <div className="space-y-3">
                {contactInfo.map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center gap-3 p-3.5 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]"
                  >
                    <a href=""></a>
                    <span className="text-xl shrink-0">{item.icon}</span>

                    <div>
                      <div className="text-[11px] font-600 text-[#94A3B8] uppercase tracking-wide">
                        {item.label}
                      </div>

                      {item.href ? (
                        <a
                          href={item.href}
                          className="text-[13px] font-500 text-[#0F766E] hover:underline"
                        >
                          {item.value}
                        </a>
                      ) : (
                        <div className="text-[13px] font-500 text-[#1E293B]">
                          {item.value}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* <div className="bg-[#0F766E]/5 border border-[#0F766E]/15 rounded-xl p-4">
                <h3 className="font-display font-700 text-[#1E293B] text-[13px] mb-1">
                  Want to bring CivicPulse to your community?
                </h3>

                <p className="text-[#64748B] text-[12px] leading-relaxed mb-3">
                  We partner with local organisations, government bodies, and
                  NGOs to deploy CivicPulse in new regions.
                </p>

                <button
                  onClick={() => onNavigate("signup")}
                  className="text-[12px] font-600 text-[#0F766E] hover:underline"
                >
                  Learn about partnerships →
                </button>
              </div> */}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
