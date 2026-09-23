import Image from "next/image"
import Link from "next/link"
import { ArrowIcon } from "@/components/footer"
import { buildStandardMetadata } from "app/seo/metadata"

export const metadata = buildStandardMetadata({
  title: "About",
  description:
    "Jesse Wei is an applied AI engineer based in Japan who ships LLM systems into real business workflows — document pipelines, evaluation and delivery — backed by ten years of product design and engineering.",
  pathname: "/about",
  alternatePathname: "/ja/about",
  alternateLang: "ja",
})

const strong = "text-[var(--text-strong)]"
const h2 =
  "mt-10 mb-4 text-2xl font-semibold tracking-tight text-[var(--text-strong)]"
const extLink =
  "inline-flex items-center gap-1.5 transition-colors text-[var(--accent-text)] hover:underline mx-1"

export default function Page() {
  return (
    <section className="py-24 w-full px-8 md:px-16 max-w-[1024px] mx-auto">
      <span className="eyebrow">About</span>
      <h1 className="mt-3 mb-10 text-4xl md:text-5xl font-semibold tracking-tight text-[var(--text-strong)]">About me</h1>
      <div className="grid grid-cols-12 gap-8 md:gap-16">
        <div className="text-[var(--text-body)] col-span-12 order-2 md:col-span-8 md:order-1">
          <p className="mb-4">
            I&apos;m Jesse, an{" "}
            <strong className={strong}>applied AI engineer</strong> based in
            Japan, currently finishing a Master of IT in Brisbane. I build LLM
            systems that go into real business workflows — checking
            400-page technical manuals, drafting regulated records, triaging
            security alerts — and I spend as much time on{" "}
            <strong className={strong}>
              evaluation, guardrails, and the people who will use the system
            </strong>{" "}
            as on the model calls.
          </p>
          <p className="mb-4">
            I came to this from the other side of the product. Ten years of
            B2B product design, then more than three years leading frontend
            engineering, taught me that most software fails at adoption, not
            at the demo. That is the half of AI engineering I&apos;m best at:
            turning an ambiguous request into requirements, deciding{" "}
            <strong className={strong}>
              where the model is and isn&apos;t allowed to decide
            </strong>
            , and shipping something a team trusts enough to use every day. I
            work in{" "}
            <strong className={strong}>
              Chinese (native), English, Japanese, and Korean
            </strong>
            , which matters more than it sounds: most deployment work is
            translation of one kind or another.
          </p>

          <h2 className={h2}>What I&apos;m building now</h2>
          <p className="mb-4">
            <strong className={strong}>
              LLM document checking for a Japanese manufacturer — client work.
            </strong>{" "}
            A pipeline that reviews long industrial manuals: text and
            vector-drawn warning-symbol extraction from PDF, a rule engine the
            client can maintain themselves, and agent orchestration with
            LangGraph. Requirements were scoped and negotiated in Japanese,
            directly with the client.
          </p>
          <p className="mb-4">
            <strong className={strong}>
              AI-drafted compliance records for a multi-site welfare operator.
            </strong>{" "}
            A production system that replaces spreadsheet workflows across
            multiple sites. An LLM drafts regulatory activity records under a
            three-tier model — deterministic checks in code, LLM
            self-assessment, and mandatory human sign-off — so nothing is
            issued that a person hasn&apos;t confirmed.
          </p>
          <p className="mb-4">
            <strong className={strong}>
              Evaluating LLM security triage — QUT capstone.
            </strong>{" "}
            An evaluation harness over 146 labelled attacks across 14
            techniques on a Wazuh SIEM. The most useful findings weren&apos;t
            about the model: logging design explained most detection gaps,
            and a lenient scoring rule had been inflating accuracy by more
            than 20 points.
          </p>
          <p className="mb-4">
            <strong className={strong}>LingoBun — my own AI product.</strong>{" "}
            A vocabulary app built and hardened like production software:
            rate limits and cost caps on AI and text-to-speech calls,
            validated configuration, and 180 automated tests, shaped by
            rounds of user testing.
          </p>

          <h2 className={h2}>Where I come from</h2>
          <p className="mb-4">
            <strong className={strong}>
              DEN Inc. — social welfare, eight years.
            </strong>{" "}
            I helped a 20-person facility running on paper become a
            multi-facility business of nearly 100 employees on AI-assisted
            digital workflows. Employee productivity and profit both moved,
            and several thousand dollars of monthly revenue now runs without
            anyone touching it. Social welfare is among the least digitised
            sectors in Japan — none of this was the default outcome.
          </p>
          <p className="mb-4">
            <strong className={strong}>
              Money Forward Inc. — HR Cloud, frontend lead.
            </strong>{" "}
            I led frontend development on an enterprise HR SaaS product and
            held the team to one rule: a change to the code had to be
            justified by a better experience for the user, never the other way
            around.
          </p>
          <p className="mb-4">
            <strong className={strong}>
              WAmazing Inc. — ski-pass booking, design and delivery.
            </strong>{" "}
            Legacy code and a peak season with no room for downtime meant
            every change had to be priced in engineering risk first. I did
            that pricing, and a redesigned booking flow cut peak-season
            customer inquiries from over 200 a week to around four.
          </p>
          <p className="mb-4">
            <strong className={strong}>
              Zerospec Inc. — energy, first designer on the team.
            </strong>{" "}
            I introduced a prototype-driven, implementation-aligned process
            and the design system to hold it together, and moved a company
            where no one took design seriously into one that plans around it.
          </p>

          <h2 className={h2}>What I&apos;m looking for</h2>
          <p className="mb-4">
            Applied AI, forward-deployed and AI product engineering roles —
            work where the job is getting AI to hold up inside a real
            business — in Tokyo or Australia, from early 2027. I&apos;m also
            always glad to talk with teams bringing AI into Japanese
            businesses.
          </p>
          <p>
            Find me on
            <Link
              className={extLink}
              rel="noopener noreferrer"
              target="_blank"
              href="https://www.linkedin.com/in/jesse-wei-profile/"
            >
              <ArrowIcon />
              <span>LinkedIn</span>
            </Link>
            <span>or</span>
            <Link
              className={extLink}
              rel="noopener noreferrer"
              target="_blank"
              href="https://github.com/mrjwei"
            >
              <ArrowIcon />
              <span>GitHub</span>
            </Link>
            <span>.</span>
          </p>
        </div>
        <div className="col-12 order-1 md:col-span-4 md:order-2">
          <Image
            src="/avatar.png"
            alt="Jesse Wei's avatar"
            width={563}
            height={517}
            className="max-w-[160px] h-auto rounded-lg"
            sizes="160px"
            priority
          />
        </div>
      </div>
    </section>
  )
}
