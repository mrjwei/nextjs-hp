module.exports = {
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "www.jessewei.net",
          },
        ],
        destination: "https://jessewei.net/:path*",
        permanent: true,
      },
      {
        source: "/app",
        destination: "/",
        permanent: true,
      },
      // /writings became /posts and /work became /projects (2026-09). Project
      // detail pages live under /posts; /posts/<slug> redirects to
      // /posts/<collection>/<slug> for posts inside a collection.
      {
        source: "/writings/:path*",
        destination: "/posts/:path*",
        permanent: true,
      },
      {
        source: "/work",
        destination: "/projects",
        permanent: true,
      },
      {
        source: "/work/:slug",
        destination: "/posts/:slug",
        permanent: true,
      },
      {
        source: "/ja/writings/:path*",
        destination: "/ja/posts/:path*",
        permanent: true,
      },
      {
        source: "/ja/work",
        destination: "/ja/projects",
        permanent: true,
      },
      {
        source: "/ja/work/:slug",
        destination: "/ja/posts/:slug",
        permanent: true,
      },
      // The generic AI/design/security/devops collection folders were split
      // into topic series (2026-09). /posts/<slug> redirects a post to its
      // current collection (or serves it, if it's now standalone), so old
      // post URLs go there; old collection index pages go to the series list.
      {
        source: "/posts/:collection(AI|design|security|devops)/:slug",
        destination: "/posts/:slug",
        permanent: true,
      },
      {
        source: "/posts/:collection(AI|design|security|devops|ml-techniques)",
        destination: "/posts/series",
        permanent: true,
      },
      {
        source: "/posts/ux-case-studies",
        destination: "/posts",
        permanent: true,
      },
      {
        source: "/ja/posts/:collection(AI|design|security|devops)/:slug",
        destination: "/ja/posts/:slug",
        permanent: true,
      },
      {
        source: "/ja/posts/:collection(AI|design|security|devops|ml-techniques)",
        destination: "/ja/posts/series",
        permanent: true,
      },
      {
        source: "/ja/posts/ux-case-studies",
        destination: "/ja/posts",
        permanent: true,
      },
      // Project posts left their folders (2026-10): a project is not a series,
      // so its posts now live at /posts/<slug>. Old folder URLs redirect there,
      // and the old folder index pages go to the project page. (/posts/strobe-assistant
      // and /posts/ai-assisted-siem-workflow stay: they are the "Part N of M" pages.)
      {
        source: "/posts/:folder(strobe-assistant|LingoBun|AuStride|ai-assisted-siem-workflow)/:slug",
        destination: "/posts/:slug",
        permanent: true,
      },
      {
        source: "/posts/LingoBun",
        destination: "/projects/lingobun",
        permanent: true,
      },
      {
        source: "/posts/AuStride",
        destination: "/projects",
        permanent: true,
      },
      {
        source: "/ja/posts/:folder(strobe-assistant|LingoBun|AuStride|ai-assisted-siem-workflow)/:slug",
        destination: "/ja/posts/:slug",
        permanent: true,
      },
      {
        source: "/ja/posts/LingoBun",
        destination: "/ja/projects/lingobun",
        permanent: true,
      },
      {
        source: "/ja/posts/AuStride",
        destination: "/ja/projects",
        permanent: true,
      },
      // The design-ops case study left the one-post design-case-studies
      // folder for the FuelDelivery project (2026-11-15). Its old folder URL
      // goes to its project URL, and the emptied folder page to the project.
      {
        source: "/posts/design-case-studies/:slug",
        destination: "/projects/fueldelivery/:slug",
        permanent: true,
      },
      {
        source: "/posts/design-case-studies",
        destination: "/projects/fueldelivery",
        permanent: true,
      },
      {
        source: "/ja/posts/design-case-studies/:slug",
        destination: "/ja/projects/fueldelivery/:slug",
        permanent: true,
      },
      {
        source: "/ja/posts/design-case-studies",
        destination: "/ja/projects/fueldelivery",
        permanent: true,
      },
      // Retired posts (2026-10-15): beginner-level, assignment-specific or
      // off-positioning posts, deleted from the repo (git history and the
      // vault keep a copy). Their URLs, with or without the old collection
      // folder, the retired collection pages and the emptied /posts/git tag
      // page go to the Posts index.
      {
        source: "/posts/:folder(number-systems|multifunctional-ai-assistant|cryptography)/:slug",
        destination: "/posts",
        permanent: true,
      },
      {
        source:
          "/posts/:slug(git|number-systems|number-systems-1|number-systems-2|representing-negative-binary-numbers|multifunctional-ai-assistant|multifunctional-ai-assistant-1|multifunctional-ai-assistant-2|multifunctional-ai-assistant-3|ai-powered-app-for-speaking-test-prep|ai-powered-speaking-tutor|how-to-reorder-and-squash-with-git|github-actions-ec2-deployment-troubleshooting-guide|how-i-made-my-program-140-times-faster|vibe-coding-as-learning-experience|cryptography|symmetric-asymmetric-cryptography|common-asymmetric-algorithms|common-asymmetric-algorithms-rsa|common-asymmetric-algorithms-ecc)",
        destination: "/posts",
        permanent: true,
      },
      {
        source: "/ja/posts/:folder(number-systems|multifunctional-ai-assistant|cryptography)/:slug",
        destination: "/ja/posts",
        permanent: true,
      },
      {
        source:
          "/ja/posts/:slug(number-systems|number-systems-1|number-systems-2|representing-negative-binary-numbers|multifunctional-ai-assistant|multifunctional-ai-assistant-1|multifunctional-ai-assistant-2|multifunctional-ai-assistant-3|ai-powered-app-for-speaking-test-prep|ai-powered-speaking-tutor|how-to-reorder-and-squash-with-git|github-actions-ec2-deployment-troubleshooting-guide|how-i-made-my-program-140-times-faster|vibe-coding-as-learning-experience|cryptography|symmetric-asymmetric-cryptography|common-asymmetric-algorithms|common-asymmetric-algorithms-rsa|common-asymmetric-algorithms-ecc)",
        destination: "/ja/posts",
        permanent: true,
      },
      // Retired posts (2026-11-18 audit): beginner-level explainers, thin
      // case studies and posts that no longer fit the positioning. URLs with
      // or without their old folder go to the Posts index; the retired
      // LingoBun posts go to the LingoBun project; the emptied AuStride
      // project goes to Projects.
      {
        source: "/posts/:folder(radio-buttons|authentication|ml-metrics|ai-and-design)?/:slug(radio-buttons|ux-insight-on-radio-buttons-1|ux-insight-on-radio-buttons-2|authentication|understanding-jwts|understanding-jwts-part-1|understanding-jwts-part-2|passkeys-demystified|designing-password-uis-that-enhance-security-and-usability|understanding-r-squared|austride-overview|revamping-my-personal-website-with-claude-design-claude-code|prototyping-made-easy-how-emerging-tooling-has-transformed-the-ui-design-workflow)",
        destination: "/posts",
        permanent: true,
      },
      {
        source: "/ja/posts/:folder(radio-buttons|authentication|ml-metrics|ai-and-design)?/:slug(radio-buttons|ux-insight-on-radio-buttons-1|ux-insight-on-radio-buttons-2|authentication|understanding-jwts|understanding-jwts-part-1|understanding-jwts-part-2|passkeys-demystified|designing-password-uis-that-enhance-security-and-usability|understanding-r-squared|austride-overview|revamping-my-personal-website-with-claude-design-claude-code|prototyping-made-easy-how-emerging-tooling-has-transformed-the-ui-design-workflow)",
        destination: "/ja/posts",
        permanent: true,
      },
      {
        source: "/posts/:slug(lingobun-learning-language-seriously|lingobun-logo-a-case-study-on-logo-design-in-the-era-of-ai|designing-for-visibility-adaptive-input-fields-in-lingobun)",
        destination: "/projects/lingobun",
        permanent: true,
      },
      {
        source: "/projects/lingobun/:slug(lingobun-learning-language-seriously|lingobun-logo-a-case-study-on-logo-design-in-the-era-of-ai|designing-for-visibility-adaptive-input-fields-in-lingobun)",
        destination: "/projects/lingobun",
        permanent: true,
      },
      {
        source: "/ja/posts/:slug(lingobun-learning-language-seriously|lingobun-logo-a-case-study-on-logo-design-in-the-era-of-ai|designing-for-visibility-adaptive-input-fields-in-lingobun)",
        destination: "/ja/projects/lingobun",
        permanent: true,
      },
      {
        source: "/ja/projects/lingobun/:slug(lingobun-learning-language-seriously|lingobun-logo-a-case-study-on-logo-design-in-the-era-of-ai|designing-for-visibility-adaptive-input-fields-in-lingobun)",
        destination: "/ja/projects/lingobun",
        permanent: true,
      },
      {
        source: "/projects/austride/:slug*",
        destination: "/projects",
        permanent: true,
      },
      {
        source: "/ja/projects/austride/:slug*",
        destination: "/ja/projects",
        permanent: true,
      },
      // Series consolidated (2026-11-18 audit): the one- and two-post ML
      // folders became ML Lab (/posts/cnn and /posts/autoencoders stay, as
      // their "Part N of M" pages), workflows joined ai-agent, and the AWS
      // folder's posts joined the Strobe project (/posts/<slug> redirects a
      // project post to its project URL).
      {
        source: "/posts/:folder(cnn|autoencoders|transformers|ml-metrics|reflection)/:slug",
        destination: "/posts/ml-lab/:slug",
        permanent: true,
      },
      {
        source: "/posts/:folder(transformers|ml-metrics|reflection)",
        destination: "/posts/ml-lab",
        permanent: true,
      },
      {
        source: "/posts/workflows/:slug",
        destination: "/posts/ai-agent/:slug",
        permanent: true,
      },
      {
        source: "/posts/workflows",
        destination: "/posts/ai-agent",
        permanent: true,
      },
      {
        source: "/posts/AWS/:slug",
        destination: "/posts/:slug",
        permanent: true,
      },
      {
        source: "/posts/AWS",
        destination: "/projects/strobe",
        permanent: true,
      },
      {
        source: "/ja/posts/:folder(cnn|autoencoders|transformers|ml-metrics|reflection)/:slug",
        destination: "/ja/posts/ml-lab/:slug",
        permanent: true,
      },
      {
        source: "/ja/posts/:folder(transformers|ml-metrics|reflection)",
        destination: "/ja/posts/ml-lab",
        permanent: true,
      },
      {
        source: "/ja/posts/workflows/:slug",
        destination: "/ja/posts/ai-agent/:slug",
        permanent: true,
      },
      {
        source: "/ja/posts/workflows",
        destination: "/ja/posts/ai-agent",
        permanent: true,
      },
      {
        source: "/ja/posts/AWS/:slug",
        destination: "/ja/posts/:slug",
        permanent: true,
      },
      {
        source: "/ja/posts/AWS",
        destination: "/ja/projects/strobe",
        permanent: true,
      },
      // Misspelt slugs fixed (2026-10-15): understaning-jwts-* became
      // understanding-jwts-*. The JA routes only ever showed the
      // "not translated yet" page for them.
      {
        source: "/posts/:folder(authentication)?/understaning-jwts-:part(part-1|part-2)",
        destination: "/posts",
        permanent: true,
      },
      {
        source: "/ja/posts/:folder(authentication)?/understaning-jwts-:part(part-1|part-2)",
        destination: "/ja/posts",
        permanent: true,
      },
      // Old /portfolio section (retired 2026-09; case studies folded into
      // /posts). Specific slugs first, then a catch-all.
      {
        source: "/portfolio/projects",
        destination: "/projects",
        permanent: true,
      },
      {
        source: "/portfolio/austride",
        destination: "/projects",
        permanent: true,
      },
      {
        source: "/portfolio/lingobun",
        destination: "/posts/lingobun-overview",
        permanent: true,
      },
      // These three were "coming soon" placeholders, unpublished until written
      // up — their specific slugs no longer resolve, so send visitors to the
      // Projects index instead.
      {
        source: "/portfolio/case-study-3",
        destination: "/projects",
        permanent: true,
      },
      {
        source: "/portfolio/gonow-design-ops",
        destination: "/projects",
        permanent: true,
      },
      {
        source: "/portfolio/wamazing",
        destination: "/projects",
        permanent: true,
      },
      {
        source: "/portfolio/:slug",
        destination: "/projects",
        permanent: true,
      },
      {
        source: "/portfolio",
        destination: "/projects",
        permanent: true,
      },
      // JA mirror has no translated portfolio content, so send everything
      // to the JA Projects index.
      {
        source: "/ja/portfolio/:path*",
        destination: "/ja/projects",
        permanent: true,
      },
      {
        source: "/ja/portfolio",
        destination: "/ja/projects",
        permanent: true,
      },
    ]
  },
  webpack(config) {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
    }

    return config
  },
}
