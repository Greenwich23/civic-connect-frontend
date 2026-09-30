import { useNavigate } from "react-router-dom";

const CAN_DO = [
  {
    icon: "📌",
    title: "Post announcements",
    desc: "Pin a comment on any issue in their community to share updates or plans directly.",
  },
  {
    icon: "🔄",
    title: "Update issue status",
    desc: "Move a reported issue through Under Review, Action Planned, In Progress, and Resolved, with a note explaining each step.",
  },
  {
    icon: "✉️",
    title: "Message citizens privately",
    desc: "Citizens in their community can reach them directly, outside the public discussion, for anything that needs a private conversation.",
  },
  {
    icon: "🛡️",
    title: "Moderate community discussion",
    desc: "Help keep the conversation on issues in their community civil and on-topic.",
  },
];

const CANT_DO = [
  "Personally dispatch a repair crew, allocate a government budget, or force any physical fix to happen",
  "Guarantee a timeline for when something gets resolved off-platform",
  "Act on behalf of the local government unless they've been verified as an actual official (see below)",
];

const STEPS = [
  {
    step: "01",
    title: "Apply",
    desc: "Any resident of a community can apply — either to found a new one, or to represent an existing one that currently has no representative. You'll need your NIN, proof of residence, and a short statement.",
  },
  {
    step: "02",
    title: "Admin review",
    desc: "An admin verifies your identity documents. This typically takes 2–5 business days. You'll get a notification either way.",
  },
  {
    step: "03",
    title: "Approved",
    desc: "You become the representative for your community immediately — you can now update issue statuses, post announcements, and message citizens.",
  },
];

export default function AboutRepresentatives() {
  const navigate = useNavigate();

  return (
    <div className="min-h-full bg-white">
      {/* Hero */}
      <section className="bg-[#F8FAFC] border-b border-[#E2E8F0] py-16 md:py-20">
        <div className="max-w-3xl mx-auto px-4 md:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-[#0F766E]/10 text-[#0F766E] text-[12px] font-600 uppercase tracking-wider px-3 py-1 rounded-full mb-6">
            For Citizens & Aspiring Representatives
          </div>
          <h1 className="font-display font-800 text-[#1E293B] text-2xl sm:text-3xl md:text-4xl leading-tight tracking-tight mb-5">
            What a CivicPulse representative actually is
          </h1>
          <p className="text-[#64748B] text-[16px] leading-relaxed max-w-2xl mx-auto">
            A representative is your community's point person on CivicPulse —
            someone who keeps issue statuses updated, communicates with
            residents, and helps organize the community's voice. It's an
            important role, but it's worth being clear about what it is and
            isn't.
          </p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 md:px-8 py-14 space-y-12">
        {/* Honest framing */}
        <section>
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
            <h2 className="font-700 text-amber-900 text-[15px] mb-2 flex items-center gap-2">
              ℹ️ The honest version
            </h2>
            <p className="text-[13px] text-amber-800 leading-relaxed">
              CivicPulse doesn't have a direct line into any government
              works department — no representative, verified or not, can
              make a road crew show up through this app. What the platform
              actually does is turn scattered complaints into something with
              a paper trail: a support count, a discussion thread, and a
              visible status history. That record is what gives a
              representative — or any citizen — real leverage when they take
              it to an actual authority.
            </p>
          </div>
        </section>

        {/* What a rep can do */}
        <section>
          <h2 className="font-display font-800 text-[#1E293B] text-2xl mb-6">
            What a representative can do here
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {CAN_DO.map((item) => (
              <div
                key={item.title}
                className="bg-white border border-[#E2E8F0] rounded-2xl p-5"
              >
                <div className="text-2xl mb-2">{item.icon}</div>
                <h3 className="font-600 text-[#1E293B] text-[14px] mb-1">
                  {item.title}
                </h3>
                <p className="text-[13px] text-[#64748B] leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* What a rep can't do */}
        <section>
          <h2 className="font-display font-800 text-[#1E293B] text-2xl mb-6">
            What a representative can't do
          </h2>
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5">
            <ul className="space-y-3">
              {CANT_DO.map((item, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span className="text-[#DC2626] shrink-0 mt-0.5">✕</span>
                  <span className="text-[13px] text-[#1E293B] leading-relaxed">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Two tiers */}
        <section>
          <h2 className="font-display font-800 text-[#1E293B] text-2xl mb-2">
            Two kinds of representative
          </h2>
          <p className="text-[#64748B] text-[14px] leading-relaxed mb-6">
            CivicPulse deliberately keeps the bar low to apply, so every
            community can get a representative quickly — but it also gives
            you a way to show when someone has real institutional backing.
          </p>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-600 px-2.5 py-1 rounded-full bg-[#0F766E]/10 text-[#0F766E] mb-3">
                Representative
              </span>
              <p className="text-[13px] text-[#1E293B] leading-relaxed">
                Any resident who applies and is approved. This is the default
                — a dedicated community member coordinating on residents'
                behalf, not necessarily anyone with government authority.
              </p>
            </div>

            <div className="bg-white border border-amber-200 rounded-2xl p-5">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-600 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 mb-3">
                ✓ Verified Official
              </span>
              <p className="text-[13px] text-[#1E293B] leading-relaxed">
                An additional badge for representatives who submit proof of
                an actual local government or council position, which an
                admin reviews and confirms. It's optional when applying, and
                shown next to their name wherever they post — so residents
                can tell the difference at a glance.
              </p>
            </div>
          </div>
        </section>

        {/* Process */}
        <section>
          <h2 className="font-display font-800 text-[#1E293B] text-2xl mb-6">
            How to become one
          </h2>
          <div className="space-y-4">
            {STEPS.map((item) => (
              <div key={item.step} className="flex gap-4">
                <div className="w-9 h-9 rounded-full bg-[#0F766E]/10 text-[#0F766E] font-700 text-[13px] flex items-center justify-center shrink-0">
                  {item.step}
                </div>
                <div>
                  <h3 className="font-600 text-[#1E293B] text-[14px] mb-1">
                    {item.title}
                  </h3>
                  <p className="text-[13px] text-[#64748B] leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="text-center pt-4">
          <button
            onClick={() => navigate("/signup/community-request")}
            className="bg-[#0F766E] hover:bg-[#115E59] text-white font-600 text-sm px-6 py-2.5 rounded-xl transition-colors"
          >
            Apply to Become a Representative
          </button>
        </section>
      </div>
    </div>
  );
}
