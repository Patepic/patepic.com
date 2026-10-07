import { Gamepad2 } from "lucide-react";

const keyFor = (platform) => String(platform || "").toLowerCase().replace(/[^a-z0-9]+/g, "");

const IMAGES = Object.fromEntries(
  Object.entries(import.meta.glob("../assets/platforms/*.{png,webp,svg}", { eager: true, import: "default" }))
    .map(([path, url]) => [keyFor(path.split("/").pop().replace(/.[^.]+$/, "")), url]),
);

const ALIASES = {
  gameboyadvance: ["gba"],
  wiiu: ["wiiu1", "wiiu2"],
};

export function PlatformIcon({ platform }) {
  const key = keyFor(platform);
  const images = (ALIASES[key] || [key]).map((name) => IMAGES[name]).filter(Boolean);
  if (images.length) {
    return (
      <span className="pc-platform-img" aria-hidden="true">
        {images.map((src) => <img key={src} src={src} alt="" />)}
      </span>
    );
  }
  return <Gamepad2 className="pc-platform" aria-hidden="true" />;
}
