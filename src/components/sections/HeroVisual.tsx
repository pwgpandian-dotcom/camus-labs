import { Bot, Globe, Landmark, Smartphone, ShoppingCart, Sparkles } from "lucide-react";

const nodes = [
  { icon: Sparkles, x: 210, y: 60, label: "AI Applications" },
  { icon: Bot, x: 340, y: 135, label: "AI Agents" },
  { icon: Landmark, x: 340, y: 285, label: "FinTech" },
  { icon: ShoppingCart, x: 210, y: 360, label: "E-commerce" },
  { icon: Smartphone, x: 80, y: 285, label: "Mobile Apps" },
  { icon: Globe, x: 80, y: 135, label: "Web Apps" },
];

const CENTER = { x: 210, y: 210 };
const NODE_SIZE = 56;
const CENTER_SIZE = 76;

/**
 * A static, on-brand illustration: one central "idea" node connected to the
 * product categories CAMUS Labs builds. Pure SVG + positioned icon badges —
 * no raster images, no gradients, renders crisp at any size.
 */
export function HeroVisual() {
  return (
    <div
      aria-hidden
      className="relative hidden h-[420px] w-[420px] shrink-0 xl:block"
    >
      <svg viewBox="0 0 420 420" className="absolute inset-0 h-full w-full">
        {nodes.map((node) => (
          <line
            key={node.label}
            x1={CENTER.x}
            y1={CENTER.y}
            x2={node.x}
            y2={node.y}
            stroke="var(--color-slate-200)"
            strokeWidth={1.5}
          />
        ))}
      </svg>

      {/* Center node */}
      <div
        className="absolute flex items-center justify-center rounded-2xl bg-ink text-paper shadow-[0_8px_24px_-8px_rgba(10,10,11,0.35)]"
        style={{
          width: CENTER_SIZE,
          height: CENTER_SIZE,
          left: CENTER.x - CENTER_SIZE / 2,
          top: CENTER.y - CENTER_SIZE / 2,
        }}
      >
        <span className="text-2xl font-semibold">C</span>
      </div>

      {/* Product-category nodes */}
      {nodes.map(({ icon: Icon, x, y, label }) => (
        <div
          key={label}
          className="absolute flex items-center justify-center rounded-full border border-slate-200 bg-paper shadow-[0_4px_14px_-6px_rgba(10,10,11,0.15)]"
          style={{
            width: NODE_SIZE,
            height: NODE_SIZE,
            left: x - NODE_SIZE / 2,
            top: y - NODE_SIZE / 2,
          }}
        >
          <Icon size={22} strokeWidth={1.75} className="text-ink" />
        </div>
      ))}
    </div>
  );
}
