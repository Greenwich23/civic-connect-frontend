const steps = [
  {
    num: "01",
    label: "Report",
    desc: "Citizens identify and document local problems",
  },
  {
    num: "02",
    label: "Discuss",
    desc: "Community shares experiences and insights",
  },
  {
    num: "03",
    label: "Propose",
    desc: "Members suggest actionable solutions",
  },
  {
    num: "04",
    label: "Vote",
    desc: "Community selects the best proposal",
  },
  {
    num: "05",
    label: "Resolve",
    desc: "Authorities act and citizens verify",
  },
];

const features = [
  {
    icon: "🗺️",
    title: "Hyper-local by Default",
    desc: "Issues are organized by community, district, and city. See what matters in your neighborhood first.",
  },
  {
    icon: "🗳️",
    title: "Democratic Voting",
    desc: "Citizens vote on proposed solutions to reach community consensus before engaging authorities.",
  },
  {
    icon: "📊",
    title: "Full Transparency",
    desc: "Every issue has a public status timeline. You always know what is happening and who is responsible.",
  },
  {
    icon: "🏛️",
    title: "Direct Authority Access",
    desc: "The winning community proposal is submitted directly to the relevant government body or organization.",
  },
  {
    icon: "✅",
    title: "Resolution Verification",
    desc: "Citizens confirm whether an issue was actually fixed, holding authorities accountable beyond promises.",
  },
  {
    icon: "🤝",
    title: "Community Ownership",
    desc: "Every resident has a voice. Contribute reports, discussions, proposals, or simply show support.",
  },
];

const stats = [
  { value: "12,400+", label: "Issues reported" },
  { value: "3,800+", label: "Issues resolved" },
  { value: "89,000+", label: "Citizens engaged" },
  { value: "240+", label: "Communities active" },
];

export default function Landing({ onNavigate }) {
  return (
    <div className="min-h-full bg-white font-body">
      {/* Header */}

      {/* Hero */}
      <section className="relative overflow-hidden bg-[#F8FAFC] flex justify-between px-[100px]">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0F766E]/5 via-transparent to-[#2563EB]/5 pointer-events-none" />

        <div className="px-4 md:px-8 pt-20 pb-24 md:pt-28 md:pb-32">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-[#0F766E]/10 text-[#0F766E] text-[12px] font-600 uppercase tracking-wider px-3 py-1 rounded-full mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0F766E]" />
              Civic Community Platform
            </div>

            <h1 className="font-display font-800 text-[#1E293B] text-4xl md:text-5xl lg:text-6xl leading-tight tracking-tight mb-6">
              Make Your Community
              <br />
              <span className="text-[#0F766E]">Better. Together.</span>
            </h1>

            <p className="text-[#64748B] text-lg md:text-xl leading-relaxed mb-10 max-w-2xl">
              Report problems, share ideas, discuss solutions, and work together
              to create meaningful change in your community — with full
              transparency at every step.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={() => onNavigate("signup")}
                className="bg-[#0F766E] hover:bg-[#115E59] text-white font-600 text-[15px] px-7 py-3.5 rounded-xl transition-colors civic-shadow-md"
              >
                Get Started Free
              </button>

              <button
                onClick={() => onNavigate("citizen-issues")}
                className="border border-[#E2E8F0] text-[#1E293B] font-500 text-[15px] px-7 py-3.5 rounded-xl hover:border-[#0F766E]/30 hover:bg-[#0F766E]/5 transition-colors"
              >
                Explore Issues →
              </button>
            </div>
          </div>
        </div>

        {/* Decorative issue cards preview */}
        <div className="hidden lg:block absolute right-30 top-1/2 -translate-y-1/2 space-y-3 opacity-80">
          {[
            {
              title: "Poor road conditions in Wuse",
              status: "Under Discussion",
              supporters: 127,
              color: "text-amber-700 bg-amber-50",
            },
            {
              title: "Broken streetlights on Gana Street",
              status: "Submitted",
              supporters: 89,
              color: "text-sky-700 bg-sky-50",
            },
            {
              title: "Waste dumping near Central School",
              status: "Community Voting",
              supporters: 203,
              color: "text-orange-700 bg-orange-50",
            },
          ].map((card, i) => (
            <div
              key={i}
              className={`bg-white rounded-xl border border-[#E2E8F0] p-4 w-64 civic-shadow ${
                i === 1 ? "translate-x-4" : ""
              }`}
            >
              <div className="text-[12px] font-600 text-[#1E293B] mb-2 leading-snug">
                {card.title}
              </div>

              <div className="flex items-center justify-between">
                <span
                  className={`text-[11px] font-600 px-2 py-0.5 rounded-full ${card.color}`}
                >
                  {card.status}
                </span>

                <span className="text-[11px] text-[#64748B]">
                  ▲ {card.supporters}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section id="impact" className="border-y border-[#E2E8F0] bg-white">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <div className="font-display font-800 text-2xl md:text-3xl text-[#0F766E] mb-1">
                  {s.value}
                </div>

                <div className="text-sm text-[#64748B]">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process steps */}
      <section id="how" className="py-20 md:py-28 bg-[#F8FAFC]">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <div className="text-center mb-14">
            <h2 className="font-display font-800 text-[#1E293B] text-3xl md:text-4xl mb-4">
              How CivicPulse works
            </h2>

            <p className="text-[#64748B] text-lg max-w-xl mx-auto">
              A structured process that takes a community problem all the way to
              verified resolution.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6">
            {steps.map((step, i) => (
              <div key={step.num} className="relative">
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-1/2 w-full h-px border-t-2 border-dashed border-[#E2E8F0]" />
                )}

                <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 civic-shadow relative">
                  <div className="w-10 h-10 rounded-xl bg-[#0F766E]/10 flex items-center justify-center mb-3">
                    <span className="font-display font-800 text-[#0F766E] text-sm">
                      {step.num}
                    </span>
                  </div>

                  <div className="font-display font-700 text-[#1E293B] text-base mb-1">
                    {step.label}
                  </div>

                  <div className="text-[#64748B] text-[12px] leading-relaxed">
                    {step.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 md:py-28 bg-white">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <div className="text-center mb-14">
            <h2 className="font-display font-800 text-[#1E293B] text-3xl md:text-4xl mb-4">
              Built for real civic participation
            </h2>

            <p className="text-[#64748B] text-lg max-w-xl mx-auto">
              Every feature is designed to drive accountability and community
              ownership of local issues.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div
                key={f.title}
                className="p-6 rounded-2xl border border-[#E2E8F0] hover:border-[#0F766E]/30 hover:bg-[#0F766E]/[0.02] transition-colors group"
              >
                <div className="text-2xl mb-4">{f.icon}</div>

                <h3 className="font-display font-700 text-[#1E293B] text-base mb-2">
                  {f.title}
                </h3>

                <p className="text-[#64748B] text-sm leading-relaxed">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
