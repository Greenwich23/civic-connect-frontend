import { useNavigate } from "react-router-dom";

export default function Footer() {
  const navigate = useNavigate();

  return (
    <div>
      <section className="py-20 md:py-15 bg-[#0F766E]">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="font-display font-800 text-white text-3xl md:text-4xl mb-5">
            Your community needs your voice
          </h2>

          <p className="text-[#99f6e4] text-lg mb-10">
            Join thousands of citizens already making a difference. Start by
            reporting one issue in your community.
          </p>

          <button
            onClick={() => navigate("signup")}
            className="bg-white text-[#0F766E] font-700 text-base px-8 py-4 rounded-xl hover:bg-[#F0FDF4] transition-colors civic-shadow-md"
          >
            Start Contributing Today
          </button>
        </div>
      </section>
      <footer className="bg-[#1E293B] text-[#94A3B8] py-12">
        <div className="w-[80%] mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#0F766E] flex items-center justify-center">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="w-4 h-4 text-white"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </div>

            <span className="font-display font-700 text-white text-sm">
              CivicPulse
            </span>
          </div>

          <p className="text-sm">
            © 2026 CivicPulse. Empowering communities through transparent civic
            action.
          </p>
        </div>
      </footer>
      ;
    </div>
  );
}
