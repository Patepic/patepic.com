import { Link } from "react-router-dom";
import { BookOpen, Mail } from "lucide-react";
import { CapsuleButton } from "../ui/decor";

export function ClosingCard({ year }) {
  return (
    <section className="relative">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 text-center">
        <h2 className="wordmark text-4xl sm:text-5xl text-void">That was {year}</h2>
        <p className="mt-5 text-void/75 leading-relaxed max-w-lg mx-auto">
          Every game on this page was played to the end this year. Thanks for
          reading.
        </p>
        <div className="mt-9 flex gap-4 flex-wrap justify-center">
          <CapsuleButton as={Link} to="/guidelines" icon={BookOpen} className="!bg-transparent !border-void/25">Read the guidelines</CapsuleButton>
          <CapsuleButton as={Link} to="/contact" icon={Mail} className="!bg-mint !border-mint">Get in touch</CapsuleButton>
        </div>
      </div>
    </section>
  );
}
