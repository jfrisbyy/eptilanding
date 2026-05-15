const { useEffect } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "#15c896",
  "headlineStyle": "mixed",
  "phoneRotation": -3,
  "density": "spacious",
  "showMarquee": true,
  "heroVariant": "original",
  "scenariosLayout": "carousel"
}/*EDITMODE-END*/;

const HERO_VARIANTS = {
  original: {
    kicker: 'The only fitness app <span class="italic">built</span> for the <span class="italic">peptide community.</span>',
    lines: [
      'Train smarter.',
      'Cycle <span class="italic">cleaner.</span>',
      'Progress faster.'
    ],
    lede: 'Adaptive workouts, peptide protocol tracking, dose calculations, bloodwork insights, and a private community \u2014 all in one app.'
  },
  connections: {
    kicker: 'Every signal informs <span class="italic">every recommendation.</span>',
    lines: [
      'Other apps log.',
      'Epti <span class="italic">connects.</span>'
    ],
    lede: 'Your sleep talks to your training. Your labs talk to your plate. Your protocol talks to your recovery. One missed dose, one rough night, one new lab \u2014 and every recommendation updates.'
  },
  signals: {
    kicker: 'One rough night. One missed dose. <span class="italic">Every plan updates.</span>',
    lines: [
      'Every signal.',
      'Every <span class="italic">system.</span>',
      'One coach.'
    ],
    lede: 'Adaptive workouts that respond to your sleep, doses, side effects, and bloodwork. Nutrition that pivots when your CRP creeps up. A coach that already knows what you ran last cycle.'
  }
};

const ACCENT_PRESETS = [
  "#15c896", // brand mint (default — matches in-app)
  "#c8ff3a", // electric lime
  "#5eead4", // teal
  "#a78bfa", // violet
  "#fb923c"  // sunset
];

function applyTweaks(t) {
  const root = document.documentElement;

  // Accent color — convert hex into oklch-ish derived values
  const hex = t.accent || "#15c896";
  root.style.setProperty("--accent", hex);

  // Make a dim and line variant from the hex with alpha
  const dim = hex + "29"; // ~16% alpha
  const line = hex + "57"; // ~34% alpha
  root.style.setProperty("--accent-dim", dim);
  root.style.setProperty("--accent-line", line);

  // Headline style: 'mixed' (default — serif italics inline),
  // 'sans' (no italic serif), 'serif' (mostly serif)
  document.querySelectorAll(".h-display .italic, .h-section .italic, .serif-italic").forEach((el) => {
    if (t.headlineStyle === "sans") {
      el.style.fontFamily = "var(--sans)";
      el.style.fontStyle = "normal";
      el.style.fontWeight = "500";
    } else if (t.headlineStyle === "serif") {
      el.style.fontFamily = "var(--serif)";
      el.style.fontStyle = "italic";
      el.style.fontWeight = "400";
    } else {
      el.style.fontFamily = "";
      el.style.fontStyle = "";
      el.style.fontWeight = "";
    }
  });

  // Apply 'serif' to entire display headlines if selected
  document.querySelectorAll(".h-display, .h-section").forEach((el) => {
    if (t.headlineStyle === "serif") {
      el.style.fontFamily = "var(--serif)";
      el.style.fontWeight = "400";
      el.style.letterSpacing = "-0.025em";
    } else {
      el.style.fontFamily = "";
      el.style.fontWeight = "";
      el.style.letterSpacing = "";
    }
  });

  // Phone rotation
  document.querySelectorAll(".hero-phone-wrap .phone").forEach((el) => {
    el.style.transform = `rotate(${t.phoneRotation}deg)`;
  });

  // Density
  document.querySelectorAll(".section").forEach((el) => {
    if (t.density === "compact") el.style.padding = "72px 0";
    else if (t.density === "airy") el.style.padding = "160px 0";
    else el.style.padding = "";
  });

  // Marquee
  const marquee = document.querySelector(".marquee");
  if (marquee) marquee.style.display = t.showMarquee ? "" : "none";

  // Scenarios layout (carousel vs grid)
  const scenarios = document.querySelector(".scenarios");
  const scnNav = document.querySelector(".scenarios-nav");
  if (scenarios) {
    scenarios.classList.toggle("is-carousel", t.scenariosLayout === "carousel");
    scenarios.classList.toggle("is-grid", t.scenariosLayout === "grid");
  }
  if (scnNav) scnNav.style.display = t.scenariosLayout === "carousel" ? "" : "none";

  // Hero variant
  const variant = HERO_VARIANTS[t.heroVariant] || HERO_VARIANTS.original;
  const kickerEl = document.querySelector(".hero-kicker > span:last-child");
  const ledeEl = document.querySelector(".hero-copy .lede");
  const displayEl = document.querySelector(".h-display");
  if (kickerEl) kickerEl.innerHTML = variant.kicker;
  if (ledeEl) ledeEl.textContent = variant.lede;
  if (displayEl) {
    displayEl.innerHTML = variant.lines
      .map((l) => `<span class="line">${l}</span>`)
      .join("");
    // Re-apply current headline style to the freshly-rendered italics
    if (t.headlineStyle === "sans") {
      displayEl.querySelectorAll(".italic").forEach((el) => {
        el.style.fontFamily = "var(--sans)";
        el.style.fontStyle = "normal";
        el.style.fontWeight = "500";
      });
    } else if (t.headlineStyle === "serif") {
      displayEl.style.fontFamily = "var(--serif)";
      displayEl.style.fontWeight = "400";
      displayEl.style.letterSpacing = "-0.025em";
      displayEl.querySelectorAll(".italic").forEach((el) => {
        el.style.fontFamily = "var(--serif)";
        el.style.fontStyle = "italic";
        el.style.fontWeight = "400";
      });
    }
  }
}

function TweaksApp() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  useEffect(() => { applyTweaks(t); }, [t]);

  return (
    <TweaksPanel title="Tweaks">
      <TweakSection label="Brand">
        <TweakColor
          label="Accent color"
          value={t.accent}
          options={ACCENT_PRESETS}
          onChange={(v) => setTweak("accent", v)}
        />
      </TweakSection>

      <TweakSection label="Hero copy">
        <TweakSelect
          label="Variant"
          value={t.heroVariant}
          options={[
            { label: "Original \u2014 Train smarter / Cycle cleaner", value: "original" },
            { label: "Connections \u2014 Other apps log. Epti connects.", value: "connections" },
            { label: "Signals \u2014 Every signal. Every system. One coach.", value: "signals" },
          ]}
          onChange={(v) => setTweak("heroVariant", v)}
        />
      </TweakSection>

      <TweakSection label="Connected section">
        <TweakRadio
          label="Scenarios layout"
          value={t.scenariosLayout}
          options={[
            { label: "Carousel", value: "carousel" },
            { label: "Grid", value: "grid" },
          ]}
          onChange={(v) => setTweak("scenariosLayout", v)}
        />
      </TweakSection>

      <TweakSection label="Typography">
        <TweakRadio
          label="Headline style"
          value={t.headlineStyle}
          options={[
            { label: "Mixed", value: "mixed" },
            { label: "Sans", value: "sans" },
            { label: "Serif", value: "serif" },
          ]}
          onChange={(v) => setTweak("headlineStyle", v)}
        />
      </TweakSection>

      <TweakSection label="Layout">
        <TweakRadio
          label="Density"
          value={t.density}
          options={[
            { label: "Compact", value: "compact" },
            { label: "Spacious", value: "spacious" },
            { label: "Airy", value: "airy" },
          ]}
          onChange={(v) => setTweak("density", v)}
        />
        <TweakSlider
          label="Hero phone tilt"
          value={t.phoneRotation}
          min={-12}
          max={12}
          step={1}
          unit="°"
          onChange={(v) => setTweak("phoneRotation", v)}
        />
        <TweakToggle
          label="Show marquee strip"
          value={t.showMarquee}
          onChange={(v) => setTweak("showMarquee", v)}
        />
      </TweakSection>
    </TweaksPanel>
  );
}

ReactDOM.createRoot(document.getElementById("tweaks-root")).render(<TweaksApp />);
