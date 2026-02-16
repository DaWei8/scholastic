import Link from "next/link";
import {
  ArrowRight,
  FileText,
  Search,
  Mail,
  Users,
  ArrowUpRight,
  Clock,
  Target,
  Inbox,
  Globe,
} from "lucide-react";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import {
  Badge,
  Button,
  SectionHeader,
  FeatureCard,
  StepItem,
  StatBlock,
  FAQItem,
} from "@/components/ui/DesignSystem";
import ScholarshipCard from "@/components/scholarships/ScholarshipCard";
import { scholarships } from "@/data/scholarships";

export default function Home() {
  const featuredScholarships = scholarships.slice(0, 4);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />

      <main className="flex-1 pt-16">
        {/* ─── Hero ─── */}
        <section className="relative overflow-hidden bg-[var(--color-primary-light)]">
          {/* Decorative shapes */}
          <div className="absolute top-20 left-8 w-20 h-20 bg-[var(--color-primary-muted)] rounded-3xl rotate-12 opacity-60" />
          <div className="absolute top-40 right-16 w-14 h-14 bg-[var(--color-primary-muted)] rounded-2xl -rotate-6 opacity-40" />
          <div className="absolute bottom-16 left-1/3 w-10 h-10 bg-[var(--color-primary-muted)] rounded-xl rotate-45 opacity-50" />

          <div className="section-container pt-24 pb-32 md:pt-36 md:pb-44 relative z-10">
            <div className="flex flex-col items-center text-center space-y-8 max-w-4xl mx-auto">
              <div className="animate-fade-up">
                <Badge variant="outline" dot>
                  Smart Scholarship & Supervisor Matching
                </Badge>
              </div>

              <h1 className="animate-fade-up delay-100 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-[var(--color-text)] tracking-tight leading-[1.05] text-balance">
                Find the right{" "}
                <span className="text-[var(--color-primary)]">
                  scholarships & supervisors
                </span>{" "}
                for your research
              </h1>

              <p className="animate-fade-up delay-200 text-base md:text-xl text-[var(--color-text-secondary)] max-w-2xl leading-relaxed">
                Build your academic profile, browse fully-funded scholarships
                across the US, UK, China, and Europe, and get matched with
                supervisors whose research fits yours.
              </p>

              <div className="animate-fade-up delay-300 flex flex-col sm:flex-row gap-4 pt-2">
                <Button variant="primary" size="lg" href="/scholarships">
                  Browse Scholarships
                </Button>
                <Button variant="outline" size="lg" href="/auth" icon={null}>
                  Find Supervisors
                </Button>
              </div>

              <p className="animate-fade-up delay-400 text-sm text-[var(--color-text-tertiary)]">
                Free to use · No sign-up required · Updated weekly
              </p>
            </div>
          </div>
        </section>

        {/* ─── Featured Scholarships ─── */}
        <section className="py-24 md:py-32">
          <div className="section-container">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
              <SectionHeader
                badge="Scholarships"
                title="Latest funded opportunities"
                description="Fully-funded scholarships updated weekly for students targeting top institutions worldwide."
              />
              <Button variant="ghost" href="/scholarships" icon={<ArrowRight className="w-4 h-4" />}>
                View all scholarships
              </Button>
            </div>

            {/* Region filter pills */}
            <div className="flex gap-2 mb-8 flex-wrap">
              {[
                { label: "🇺🇸 United States", region: "US" },
                { label: "🇬🇧 United Kingdom", region: "UK" },
                { label: "🇨🇳 China", region: "China" },
                { label: "🇪🇺 Europe", region: "EU" },
              ].map((item) => (
                <Link
                  key={item.region}
                  href={`/scholarships?region=${item.region}`}
                  className="px-4 py-2 rounded-full border border-[var(--color-border)] text-sm font-semibold text-[var(--color-text-secondary)] hover:bg-[var(--color-primary-light)] hover:text-[var(--color-primary)] hover:border-[var(--color-primary)] transition-all duration-200"
                >
                  {item.label}
                </Link>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {featuredScholarships.map((s) => (
                <ScholarshipCard key={s.id} scholarship={s} />
              ))}
            </div>
          </div>
        </section>

        {/* ─── The Problem ─── */}
        <section
          id="problem"
          className="py-24 md:py-32 bg-[var(--color-bg-subtle)] border-y border-[var(--color-border-light)]"
        >
          <div className="section-container">
            <SectionHeader
              badge="The Problem"
              title="Finding the right supervisor shouldn't be this hard"
              description="Every year, talented students miss out on opportunities — not because they're unqualified, but because they don't know where to look or who to contact."
              align="center"
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FeatureCard
                icon={<Clock className="w-5 h-5" />}
                title="Too many hours, too few leads"
                description="You spend nights scrolling university websites and reading lab pages — just to build a shortlist of professors who might be a good fit."
              />
              <FeatureCard
                icon={<Inbox className="w-5 h-5" />}
                title="Cold emails that go nowhere"
                description="Most outreach emails are too generic. Without showing a clear connection to a professor's work, your message gets lost in their inbox."
              />
              <FeatureCard
                icon={<Target className="w-5 h-5" />}
                title="Hard to tell who's the right fit"
                description="Two professors may list the same keywords — but their actual research can be very different. You need more than a department webpage to decide."
              />
            </div>
          </div>
        </section>

        {/* ─── Features ─── */}
        <section id="features" className="py-24 md:py-32">
          <div className="section-container">
            <SectionHeader
              badge="The Solution"
              title="One profile. Every opportunity."
              description="Build your academic profile once — then use it to discover scholarships, find supervisors who match your research, and reach out with confidence."
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FeatureCard
                icon={<FileText className="w-5 h-5" />}
                title="Build your academic profile"
                description="Add your CV, research interests, preferred countries, and degree level. Your profile is the foundation for every match and recommendation."
              />
              <FeatureCard
                icon={<Search className="w-5 h-5" />}
                title="Get matched with the right people"
                description="We compare your profile with hundreds of supervisors and surface the ones whose work genuinely aligns with yours — ranked by fit, not keywords."
              />
              <FeatureCard
                icon={<Mail className="w-5 h-5" />}
                title="Reach out with the right words"
                description="Generate personalized outreach emails that reference specific research overlap. No more copy-paste templates — every message is tailored."
              />
            </div>
          </div>
        </section>

        {/* ─── How it Works ─── */}
        <section
          id="how-it-works"
          className="py-24 md:py-32 bg-[var(--color-bg-subtle)] border-y border-[var(--color-border-light)]"
        >
          <div className="section-container">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
              <div>
                <SectionHeader
                  badge="How it Works"
                  title="Three simple steps to your next opportunity"
                />

                <div className="space-y-10">
                  <StepItem
                    number="01"
                    title="Create your profile"
                    description="Add your academic CV, research interests, target countries, and degree level. This helps us understand what you're looking for."
                  />
                  <StepItem
                    number="02"
                    title="Browse matches"
                    description="See supervisors ranked by how well their research fits yours. Each card shows their focus areas, institution, and a match score."
                  />
                  <StepItem
                    number="03"
                    title="Apply with confidence"
                    description="Save your top picks, generate tailored outreach emails, and keep track of scholarships and deadlines — all from one place."
                  />
                </div>
              </div>

              {/* Card mockup */}
              <div className="flex justify-center">
                <div className="relative w-full max-w-[340px]">
                  <div className="absolute top-4 left-4 right-4 bottom-0 bg-[var(--color-primary-muted)] rounded-3xl" />
                  <div className="relative card-static p-6 space-y-5 animate-float rounded-3xl">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-[var(--color-primary-light)] rounded-2xl flex items-center justify-center">
                        <Users className="w-6 h-6 text-[var(--color-primary)]" />
                      </div>
                      <div>
                        <div className="h-4 w-32 bg-[var(--color-text)] rounded-md" />
                        <div className="h-3 w-24 bg-[var(--color-border)] rounded-md mt-2" />
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {["NLP", "Transformers", "Low-Resource"].map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 bg-[var(--color-primary-light)] text-[var(--color-primary)] text-xs font-semibold rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="space-y-2.5">
                      <div className="h-3 w-full bg-[var(--color-bg-muted)] rounded-full" />
                      <div className="h-3 w-5/6 bg-[var(--color-bg-muted)] rounded-full" />
                      <div className="h-3 w-3/4 bg-[var(--color-bg-muted)] rounded-full" />
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-[var(--color-border-light)]">
                      <span className="text-xs font-semibold text-[var(--color-text-tertiary)] uppercase tracking-wider">
                        Match Score
                      </span>
                      <span className="text-2xl font-black text-[var(--color-primary)]">
                        94%
                      </span>
                    </div>

                    <div className="flex justify-center gap-6 pt-2">
                      <div className="w-14 h-14 rounded-full border-2 border-[var(--color-border)] flex items-center justify-center text-[var(--color-text-tertiary)]">
                        <span className="text-xl font-black">✕</span>
                      </div>
                      <div className="w-14 h-14 rounded-full border-2 border-[var(--color-primary)] bg-[var(--color-primary-light)] flex items-center justify-center text-[var(--color-primary)]">
                        <span className="text-xl font-black">♥</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Audience ─── */}
        <section className="py-20">
          <div className="section-container">
            <p className="text-center text-xs font-semibold text-[var(--color-text-tertiary)] uppercase tracking-widest mb-10">
              Built for researchers at every stage
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {[
                { emoji: "🎓", label: "PhD Applicants" },
                { emoji: "📚", label: "Master's Students" },
                { emoji: "🔬", label: "Postdocs" },
                { emoji: "🧪", label: "Lab Switchers" },
                { emoji: "🌍", label: "International Students" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="card flex flex-col items-center gap-2.5 p-5"
                >
                  <span className="text-2xl">{item.emoji}</span>
                  <span className="text-sm font-semibold text-[var(--color-text-secondary)] text-center">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Stats ─── */}
        <section
          id="stats"
          className="py-24 md:py-32 bg-[var(--color-bg-subtle)] border-y border-[var(--color-border-light)]"
        >
          <div className="section-container">
            <SectionHeader
              badge="By the Numbers"
              title="Built to save you time"
              align="center"
            />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
              <StatBlock value="500+" label="Supervisors listed" />
              <StatBlock value="16+" label="Scholarships curated" />
              <StatBlock value="<30s" label="Profile to matches" />
              <StatBlock value="4" label="Regions covered" />
            </div>
          </div>
        </section>

        {/* ─── FAQ ─── */}
        <section id="faq" className="py-24 md:py-32">
          <div className="max-w-3xl mx-auto px-6">
            <SectionHeader
              badge="FAQ"
              title="Common questions"
              align="center"
            />

            <div className="card-static px-8">
              <FAQItem
                question="Is ScholarConnect free to use?"
                answer="Yes. You can browse scholarships, get supervisor matches, and generate outreach emails — all for free, with no account required."
              />
              <FAQItem
                question="What do I need to get started?"
                answer="Just your academic background. You can add your CV, list your research interests, choose your target countries and degree level, and you're ready to go."
              />
              <FAQItem
                question="How does the matching work?"
                answer="We analyze your profile and compare it against our database of supervisors to find the ones whose research is most relevant to yours. It's designed to go beyond simple keyword matching."
              />
              <FAQItem
                question="Which universities and countries are covered?"
                answer="We currently cover supervisors and scholarships across the US, UK, China, and the EU. Our database is growing every week — if your target university isn't listed yet, let us know."
              />
              <FAQItem
                question="Can I trust the outreach emails it generates?"
                answer="They're designed as a strong starting point. Each email is tailored to the specific supervisor you're reaching out to. We always recommend adding a personal touch before sending."
              />
              <FAQItem
                question="Are the scholarships real and up to date?"
                answer="Yes. Every scholarship is sourced from official government, university, or foundation programs. We verify deadlines and links regularly to keep things current."
              />
            </div>
          </div>
        </section>

        {/* ─── CTA ─── */}
        <section className="py-20 px-6">
          <div className="section-container max-w-4xl bg-[var(--color-primary)] rounded-3xl px-8 py-20 md:px-16 text-center">
            <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-[1.1] mb-4">
              Ready to take the next step?
            </h2>
            <p className="text-blue-100 text-base md:text-lg max-w-lg mx-auto mb-10">
              Build your profile, explore scholarships, and connect with
              supervisors — all in one place.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/scholarships"
                className="inline-flex h-14 px-10 bg-white text-[var(--color-primary)] text-base font-bold rounded-full items-center justify-center gap-2.5 hover:bg-blue-50 active:scale-[0.98] transition-all duration-200"
              >
                Browse Scholarships
                <Globe className="w-4 h-4" />
              </Link>
              <Link
                href="/auth"
                className="inline-flex h-14 px-10 bg-white/20 text-white text-base font-bold rounded-full items-center justify-center gap-2.5 hover:bg-white/30 active:scale-[0.98] transition-all duration-200 border border-white/30"
              >
                Find Supervisors
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
