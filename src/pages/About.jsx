/* eslint-disable no-unused-vars */
const howItWorks = [
  {
    step: "01",
    title: "Report a Problem",
    desc: "Any citizen can report a local issue — a broken road, failed streetlight, illegal dumping, water outage. Each report includes a title, description, category, location, and optional photo evidence.",
  },
  {
    step: "02",
    title: "Community Discussion",
    desc: "Other community members can comment, share their own experiences, confirm the issue, and show support. Discussion builds a shared understanding of the problem before solutions are proposed.",
  },
  {
    step: "03",
    title: "Propose Solutions",
    desc: "Citizens submit concrete proposals for resolving the issue. Anyone in the community can suggest a solution and explain their reasoning. The best ideas rise through community engagement.",
  },
  {
    step: "04",
    title: "Community Voting",
    desc: "The community votes on the proposals. The most supported proposal gains a democratic mandate, reflecting what the community actually wants — not what officials assume.",
  },
  {
    step: "05",
    title: "Submit to Authority",
    desc: "The winning proposal is submitted formally to the relevant local authority or organization. Representatives are directly engaged and held responsible for responding.",
  },
  {
    step: "06",
    title: "Track & Verify",
    desc: "Progress is updated in real time through a transparent timeline. When an authority marks an issue resolved, citizens verify it themselves — ensuring accountability beyond promises.",
  },
];

const values = [
  {
    icon: "🏛️",
    title: "Transparency",
    desc: "Every issue, discussion, vote, and status update is public and traceable.",
  },
  {
    icon: "🤝",
    title: "Participation",
    desc: "Every citizen has an equal voice regardless of background or political connection.",
  },
  {
    icon: "⚖️",
    title: "Accountability",
    desc: "Authorities are publicly engaged and citizens verify resolutions independently.",
  },
  {
    icon: "🌱",
    title: "Community Ownership",
    desc: "Solutions come from the community first. Top-down decisions are replaced by bottom-up consensus.",
  },
];

export default function About({ onNavigate }) {
  return (
    <div className="min-h-full bg-white">
      {/* Hero */}
      <section className="bg-[#F8FAFC] border-b border-[#E2E8F0] py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 md:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-[#0F766E]/10 text-[#0F766E] text-[12px] font-600 uppercase tracking-wider px-3 py-1 rounded-full mb-6">
            About CivicPulse
          </div>
          <h1 className="font-display font-800 text-[#1E293B] text-4xl md:text-5xl leading-tight tracking-tight mb-6">
            Communities solving their own problems — with full transparency
          </h1>
          <p className="text-[#64748B] text-lg md:text-xl leading-relaxed max-w-3xl mx-auto">
            CivicPulse is a civic technology platform that gives ordinary
            citizens the tools to report local problems, propose solutions, vote
            on priorities, and hold local authorities accountable — all in one
            transparent system.
          </p>
        </div>
      </section>

      {/* The problem we solve */}
      <section className="py-16 md:py-24">
        <div className="max-w-5xl mx-auto px-4 md:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-display font-800 text-[#1E293B] text-3xl md:text-4xl mb-6">
                The problem we solve
              </h2>
              <div className="space-y-4 text-[#64748B] text-[15px] leading-relaxed">
                <p>
                  Across communities in Nigeria and beyond, citizens face a
                  frustrating reality: local problems go unaddressed for months
                  or years. Roads deteriorate, streetlights fail, drainage
                  collapses, water disappears — and no one seems accountable.
                </p>
                <p>
                  Reporting mechanisms exist in theory, but in practice they are
                  opaque, slow, and unaccountable. Citizens have no way to know
                  whether their report was even received, let alone acted upon.
                </p>
                <p>
                  CivicPulse changes that. We create a transparent, structured
                  layer between citizens and local authorities — one that is
                  driven by the community, documented in public, and impossible
                  to quietly ignore.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: "❌", before: "Reports disappear into bureaucracy" },
                { icon: "❌", before: "No accountability for inaction" },
                { icon: "❌", before: "Citizens excluded from decisions" },
                { icon: "❌", before: 'No way to verify "resolved" claims' },
              ].map((item, i) => (
                <div
                  key={i}
                  className="bg-red-50 border border-red-100 rounded-xl p-4"
                >
                  <div className="text-xl mb-2">{item.icon}</div>
                  <p className="text-[12px] text-red-700 leading-relaxed">
                    {item.before}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-[#F8FAFC] py-16 md:py-24">
        <div className="max-w-5xl mx-auto px-4 md:px-8">
          <div className="text-center mb-14">
            <h2 className="font-display font-800 text-[#1E293B] text-3xl md:text-4xl mb-4">
              How CivicPulse works
            </h2>
            <p className="text-[#64748B] text-lg max-w-2xl mx-auto">
              A structured process that takes a community problem all the way to
              verified resolution.
            </p>
          </div>
          <div className="space-y-4">
            {howItWorks.map((item, i) => (
              <div
                key={item.step}
                className="bg-white rounded-2xl border border-[#E2E8F0] p-6 flex gap-5 civic-shadow"
              >
                <div className="w-10 h-10 rounded-xl bg-[#0F766E]/10 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="font-display font-800 text-[#0F766E] text-sm">
                    {item.step}
                  </span>
                </div>
                <div>
                  <h3 className="font-display font-700 text-[#1E293B] text-base mb-1">
                    {item.title}
                  </h3>
                  <p className="text-[#64748B] text-[14px] leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Communities */}
      <section className="py-16 md:py-24">
        <div className="max-w-5xl mx-auto px-4 md:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="font-display font-800 text-[#1E293B] text-3xl md:text-4xl mb-6">
                How communities work
              </h2>
              <div className="space-y-4 text-[#64748B] text-[15px] leading-relaxed">
                <p>
                  CivicPulse is organized around communities — geographic areas
                  like districts, neighbourhoods, or settlements where residents
                  share the same local challenges.
                </p>
                <p>
                  Communities are created by verified residents and approved by
                  CivicPulse administrators to ensure integrity. Once a
                  community exists, any resident can join and start
                  participating.
                </p>
                <p>
                  Issues are scoped to communities by default. You see what is
                  happening where you live — not a generic national feed with no
                  relevance to your daily life.
                </p>
              </div>
            </div>
            <div className="bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0] p-6">
              <h3 className="font-display font-700 text-[#1E293B] text-base mb-4">
                Community lifecycle
              </h3>
              <div className="space-y-3">
                {[
                  {
                    label: "Resident submits creation request",
                    icon: "📝",
                    color: "bg-blue-50 text-blue-600",
                  },
                  {
                    label: "Admin reviews and verifies",
                    icon: "🔍",
                    color: "bg-amber-50 text-amber-600",
                  },
                  {
                    label: "Community is approved and goes live",
                    icon: "✅",
                    color: "bg-green-50 text-green-600",
                  },
                  {
                    label: "Residents join and start reporting",
                    icon: "🏘️",
                    color: "bg-[#0F766E]/10 text-[#0F766E]",
                  },
                ].map((step, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center text-base shrink-0 ${step.color}`}
                    >
                      {step.icon}
                    </div>
                    <span className="text-[13px] text-[#1E293B]">
                      {step.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Representatives */}
      <section className="bg-[#F8FAFC] py-16 md:py-24">
        <div className="max-w-5xl mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <h2 className="font-display font-800 text-[#1E293B] text-3xl md:text-4xl mb-4">
              Community Representatives
            </h2>
            <p className="text-[#64748B] text-lg max-w-2xl mx-auto">
              Trusted community members who help manage issue flow and maintain
              community standards.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: "📋",
                title: "Issue Management",
                desc: "Representatives can view all reported issues in their community and update their status as progress is made.",
              },
              {
                icon: "🔄",
                title: "Status Updates",
                desc: "From Reported through Under Review, In Progress, and Resolved — representatives keep the community informed at each stage.",
              },
              {
                icon: "💬",
                title: "Official Responses",
                desc: "Representatives can post official community responses and progress updates, visible to all members on the issue timeline.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-white rounded-2xl border border-[#E2E8F0] p-6 civic-shadow"
              >
                <div className="text-2xl mb-3">{item.icon}</div>
                <h3 className="font-display font-700 text-[#1E293B] text-base mb-2">
                  {item.title}
                </h3>
                <p className="text-[#64748B] text-[13px] leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 md:py-24">
        <div className="max-w-5xl mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <h2 className="font-display font-800 text-[#1E293B] text-3xl md:text-4xl mb-4">
              Our principles
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v) => (
              <div
                key={v.title}
                className="text-center p-6 rounded-2xl border border-[#E2E8F0] hover:border-[#0F766E]/30 transition-colors"
              >
                <div className="text-3xl mb-3">{v.icon}</div>
                <h3 className="font-display font-700 text-[#1E293B] text-base mb-2">
                  {v.title}
                </h3>
                <p className="text-[#64748B] text-[13px] leading-relaxed">
                  {v.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
