import { useEffect, useState } from "react";
import { Twitch, Youtube, Mail, ArrowUp } from "lucide-react";
import { creator } from "../../data/creator";

/** Row of square icon-badge social buttons. */
export const SocialRow = ({ className = "", size = "w-10 h-10" }) => {
  const items = [
    { href: creator.twitch.url, label: "Twitch", Icon: Twitch },
    { href: creator.youtube.url, label: "YouTube", Icon: Youtube },
    { href: "mailto:contact@patepic.com", label: "Email", Icon: Mail },
  ];
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {items.map(({ href, label, Icon }) => (
        <a
          key={label}
          href={href}
          target={href.startsWith("mailto:") ? undefined : "_blank"}
          rel="noopener noreferrer"
          aria-label={label}
          data-testid={`social-${label.toLowerCase()}`}
          className={`${size} rounded-lg bg-pixel-forest text-pixel-blush hover:bg-pixel-teal grid place-items-center transition-colors`}
        >
          <Icon className="w-4 h-4" />
        </a>
      ))}
    </div>
  );
};

/** Large bold section title, centred like the reference sections. */
export const SectionTitle = ({ children, className = "", as: Tag = "h2" }) => (
  <Tag className={`display-heading text-3xl sm:text-4xl lg:text-5xl text-pixel-black ${className}`}>
    {children}
  </Tag>
);

/** Forest pill used as a sub-heading. */
export const PillHeading = ({ children, className = "" }) => (
  <div
    className={`pill pill-ember display-heading text-base sm:text-lg px-6 py-2 rounded-lg ${className}`}
  >
    {children}
  </div>
);

/**
 * Small eyebrow line above a big headline, e.g.
 * <Kicker>Hello, I'm</Kicker><h1 className="display-hero">Patepic.</h1>
 */
export const Kicker = ({ children, className = "", tone = "text-pixel-forest" }) => (
  <p className={`accent-serif text-sm sm:text-base ${tone} ${className}`}>{children}</p>
);

/** Square icon badge — small decorative touch, no image assets, no rotation. */
export const StickerBadge = ({ icon: Icon, className = "" }) => (
  <div
    aria-hidden="true"
    className={`sticker-frame w-14 h-14 rounded-full bg-pixel-forest text-pixel-pink grid place-items-center ${className}`}
  >
    <Icon className="w-6 h-6" />
  </div>
);

/** Floating back-to-top button, shown once the page has scrolled a bit. */
export const BackToTop = () => {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Back to top"
      className={`back-to-top ${visible ? "is-visible" : ""}`}
    >
      <ArrowUp className="w-4 h-4" />
    </button>
  );
};
