import Image from "next/image"
import Link from "next/link"
import { ArrowIcon } from "@/components/footer"
import { buildStandardMetadata } from "app/seo/metadata"

export const metadata = buildStandardMetadata({
  title: "About",
  description:
    "Jesse Wei is a product designer and engineer based in Japan — ten years building design culture, design-driven development workflows, and maintainable design systems.",
  pathname: "/about",
})

export default function Page() {
  return (
    <section className="py-24 w-full px-8 md:px-16 max-w-[1024px] mx-auto">
      <span className="eyebrow">About</span>
      <h1 className="mt-3 mb-10 text-4xl md:text-5xl font-semibold tracking-tight text-[var(--text-strong)]">About me</h1>
      <div className="grid grid-cols-12 gap-8 md:gap-16">
        <div className="text-[var(--text-body)] col-span-12 order-2 md:col-span-8 md:order-1">
          <p className="mb-4">
            I&apos;m Jesse, a{" "}
            <strong className="text-[var(--text-strong)]">
              product designer and engineer
            </strong>{" "}
            based in Japan. Over ten years I&apos;ve helped businesses build
            products people can actually use, but the work that lasted was
            rarely the interface. It was the surrounding things:{" "}
            <strong className="text-[var(--text-strong)]">
              design culture where there was none, design-driven development
              workflows, and design systems that stay maintainable
            </strong>{" "}
            after the people who built them move on.
          </p>
          <p className="mb-4">
            That comes from an unusual mix. My career began in product design;
            curiosity about what happens beneath the interface pulled me into
            engineering, and I formalised the move with a Master&apos;s in IT
            in Australia. Today I design and I write production code, so
            usability, business goals, and engineering constraints stay in{" "}
            <strong className="text-[var(--text-strong)]">
              one decision instead of getting traded across a handoff
            </strong>
            . I&apos;ve spent most of my career inside constrained
            environments — legacy systems, small teams, industries where
            digital transformation is still an unfamiliar idea — where the job
            is making sensible trade-offs rather than ideal ones. I work in{" "}
            <strong className="text-[var(--text-strong)]">
              Chinese (native), English, Japanese, and Korean
            </strong>
            , and bring a global perspective to Japanese business practice,
            which matters more than it sounds: most of what I do is
            translation of one kind or another.
          </p>

          <h2 className="mt-10 mb-4 text-2xl font-semibold tracking-tight text-[var(--text-strong)]">
            What I&apos;ve done
          </h2>
          <p className="mb-4">
            <strong className="text-[var(--text-strong)]">
              DEN Inc. — social welfare, seven years.
            </strong>{" "}
            I helped a 20-person facility running on paper become a
            multi-facility business of nearly 100 employees on AI-assisted
            digital workflows. Employee productivity and profit both moved,
            and several thousand dollars of monthly revenue now runs without
            anyone touching it. Social welfare is among the least digitised
            sectors in Japan — none of this was the default outcome.
          </p>
          <p className="mb-4">
            <strong className="text-[var(--text-strong)]">
              Zerospec Inc. — energy, first designer on the team.
            </strong>{" "}
            The main product, a web app for fuel-delivery efficiency, had
            shipped with no deliberate UI/UX design behind it. Balancing
            usability, business goals, and real resource limits, I introduced
            a progressive, prototype-driven, implementation-aligned process
            that shortened feedback loops and made design-to-development
            handoff close to seamless, then built the design system to hold it
            together. The harder half was cultural: moving a company where no
            one took design seriously into one that plans around it.
          </p>
          <p className="mb-4">
            <strong className="text-[var(--text-strong)]">
              WAmazing Inc. — ski-pass booking, design and delivery.
            </strong>{" "}
            Legacy code, a complex architecture, and a business whose peak
            season leaves no room for downtime. Every proposed change had to
            be priced in engineering risk before it was worth making. As the
            only product designer on the team with real development
            experience, I did that pricing — coordinating design and build so
            that improvements and new features shipped consistently, without
            destabilising the service.
          </p>
          <p className="mb-4">
            <strong className="text-[var(--text-strong)]">
              Money Forward Inc. — HR Cloud, frontend lead.
            </strong>{" "}
            I led frontend development on an enterprise HR SaaS product, and
            held the team to one rule: a change to the code had to be
            justified by a better experience for the user, never the other way
            around. Engineering convenience is a quiet, constant pressure on
            interface quality. Being the person who could argue both sides of
            it — in code and in design — is what made the rule hold.
          </p>

          <h2 className="mt-10 mb-4 text-2xl font-semibold tracking-tight text-[var(--text-strong)]">
            What I&apos;m working toward
          </h2>
          <p className="mb-4">
            I&apos;m most interested in{" "}
            <strong className="text-[var(--text-strong)]">
              AI-native design workflows built responsibly
            </strong>{" "}
            — tooling that changes how designers work rather than removing the
            need for them. In practice that means treating design rationale,
            documentation, and reproducible process as the real deliverable
            rather than the artefact; bringing software engineering concepts
            into design practice so that what gets designed can be built and
            holds up against business objectives; and working directly with
            business owners to rethink how operations run, using design, AI,
            and whatever else proves genuinely useful.
          </p>
          <p>
            I&apos;m open to roles and collaborations at that intersection.
            Find me on
            <Link
              className="inline-flex items-center gap-1.5 transition-colors text-[var(--accent-text)] hover:underline mx-1"
              rel="noopener noreferrer"
              target="_blank"
              href="https://www.linkedin.com/in/jesse-wei-profile/"
            >
              <ArrowIcon />
              <span>LinkedIn</span>
            </Link>
            <span>,&nbsp;</span>
            <Link
              className="inline-flex items-center gap-1.5 transition-colors text-[var(--accent-text)] hover:underline mx-1"
              rel="noopener noreferrer"
              target="_blank"
              href="https://github.com/mrjwei"
            >
              <ArrowIcon />
              <span>GitHub</span>
            </Link>
            <span>,&nbsp;</span>
            <Link
              className="inline-flex items-center gap-1.5 transition-colors text-[var(--accent-text)] hover:underline mx-1"
              rel="noopener noreferrer"
              target="_blank"
              href="https://www.instagram.com/mrjwei/"
            >
              <ArrowIcon />
              <span>Instagram</span>
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
