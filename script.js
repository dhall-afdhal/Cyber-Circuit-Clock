// =========================================================
// CLOCK MULTI MODE (Spider / Cyber / Gear) + CYBER ANIMATION
// =========================================================

// 🔹 Pilih elemen (peuget)
const peuget = e => document.querySelector(e);
const peugetBan = e => document.querySelectorAll(e);

// 🔹 Peuneugah nilai SVG (ambil atribut)
const rupa01 = peuget("#face01").getAttribute("d"),
      rupa02 = peuget("#face01").getAttribute("d"),

      tanganDetik01 = peuget("#handSec01").getAttribute("d"),
      tanganDetik02 = peuget("#handSec02").getAttribute("d"),
      detik = peuget("#sec"),

      tanganMenit01 = peuget("#handMin01").getAttribute("d"),
      tanganMenit02 = peuget("#handMin02").getAttribute("d"),
      menit = peuget("#min"),

      tanganJem01 = peuget("#handHr01").getAttribute("d"),
      tanganJem02 = peuget("#handHr02").getAttribute("d"),
      jam = peuget("#hr");

// 🔹 Set awal SVG
gsap.set("#face", { attr: { d: rupa01 } });
gsap.set("#hand-sec", { attr: { d: tanganDetik01 } });
gsap.set("#hand-min", { attr: { d: tanganMenit01 } });
gsap.set("#hand-hr", { attr: { d: tanganJem01 } });

// 🔹 Saat halaman siap
window.onload = () => {
  document.body.classList.add("spider"); // mode default
  initModeSelector();
  muloiAnimasi();
};

// =========================================================
// 1️⃣ MODE SELECTOR (Spider / Cyber / Gear)
// =========================================================
function initModeSelector() {
  const buttons = document.querySelectorAll("#modeSelector button");
  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      buttons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      const mode = btn.dataset.mode;
      setMode(mode);
    });
  });
}

function setMode(mode) {
  document.body.classList.remove("spider", "cyber", "gear");
  document.body.classList.add(mode);

  // ✨ Efek transisi antar mode
  gsap.fromTo(
    "body",
    { opacity: 0.7, filter: "blur(5px)" },
    { opacity: 1, filter: "blur(0px)", duration: 1, ease: "power2.out" }
  );

  // Warna SVG menyesuaikan mode
  const color =
    mode === "cyber" ? "#00f5ff" : mode === "gear" ? "#f0b86c" : "#ff4d4d";

  gsap.to("svg path, svg use", {
    duration: 1.2,
    ease: "sine.inOut",
    stroke: color,
    filter: `drop-shadow(0 0 20px ${color})`
  });
}

// =========================================================
// 2️⃣ ANIMASI UTAMA (CYBER CLOCK)
// =========================================================
function muloiAnimasi() {

  // ✨ Efek denyut energi di tubuh jam
  gsap.to("#body", {
    scale: 1.05,
    repeat: -1,
    yoyo: true,
    duration: 2,
    ease: "sine.inOut"
  });

  // 🔷 Efek cahaya pulse global di SVG
  gsap.to("svg path, svg use", {
    filter: "drop-shadow(0 0 20px #00f5ff)",
    repeat: -1,
    yoyo: true,
    duration: 3,
    ease: "sine.inOut"
  });

  // 🔶 Efek scan (glitch cyber)
  gsap.to("#watch", {
    "--scan": 0,
    repeat: -1,
    duration: 6,
    ease: "none",
    onUpdate: () => {
      const val = Math.sin(gsap.getProperty("#watch", "--scan")) * 0.2 + 0.8;
      gsap.set("#watch", { opacity: val });
    }
  });

  peuAturDetik();
  peuAturMenitJam();
  gsap.set([".gsapWrapper", ".vline"], { autoAlpha: 1 });

  // ⚙️ Rotasi gear
  gsap.to(".cw.t24", {
    duration: 12,
    rotation: "+=360",
    repeat: -1,
    ease: "power2.inOut",
    transformOrigin: "50% 50%"
  });
  gsap.to(".cw.t20", {
    duration: 10,
    rotation: "+=360",
    repeat: -1,
    ease: "power2.inOut",
    transformOrigin: "50% 50%"
  });
  gsap.to(".ccw.t12", {
    duration: 14,
    rotation: "-=360",
    repeat: -1,
    ease: "power2.inOut",
    transformOrigin: "50% 50%"
  });

  // 🕓 Animasi jarum waktu
  gsap.to(menit, {
    rotation: peugotPutaranMenit,
    transformOrigin: "50% 50%",
    ease: "sine.inOut",
    duration: 60,
    repeat: -1
  });

  gsap.to(jam, {
    rotation: peugotPutaranJam,
    transformOrigin: "50% 50%",
    ease: "sine.inOut",
    duration: 3600,
    repeat: -1
  });

  gsap.to(detik, {
    rotation: peugotPutaranDetik,
    transformOrigin: "50% 50%",
    ease: "power2.inOut",
    duration: 1,
    repeat: -1
  });

  // 💫 Morph halus antara bentuk face01 dan face02
  const putaranRupa = gsap.timeline({
    repeat: -1,
    repeatDelay: 5,
    defaults: { duration: 1.2, ease: "power2.inOut" }
  }).to("#face", {
    morphSVG: "#face02",
    repeat: 2,
    yoyo: true,
    onComplete() {
      putaranRupa.repeatDelay(gsap.utils.random(4, 8, 0.25));
    }
  });

  // ✨ Morph jarum detik dengan efek sirkuit
  const putaranDetik = gsap.timeline({
    repeat: -1,
    repeatDelay: 4,
    defaults: { duration: 1.2, ease: "power2.inOut" }
  }).call(() => {
    gsap.timeline({ defaults: { duration: 0.3, ease: "sine.inOut" } })
      .to("#hand-sec", { morphSVG: "#handSec02" })
      .to("#hand-sec", { morphSVG: "#handSec01" });
  });

  // Morph jarum menit
  const putaranMenit = gsap.timeline({
    repeat: -1,
    repeatDelay: 6,
    defaults: { duration: 1.5, ease: "power2.inOut" }
  }).call(() => {
    gsap.timeline({ defaults: { duration: 0.4, ease: "sine.inOut" } })
      .to("#hand-min", { morphSVG: "#handMin02" })
      .to("#hand-min", { morphSVG: "#handMin01" });
  });

  // Morph jarum jam
  const putaranJam = gsap.timeline({
    repeat: -1,
    repeatDelay: 8,
    defaults: { duration: 1.8, ease: "power2.inOut" }
  }).call(() => {
    gsap.timeline({ defaults: { duration: 0.4, ease: "sine.inOut" } })
      .to("#hand-hr", { morphSVG: "#handHr02" })
      .to("#hand-hr", { morphSVG: "#handHr01" });
  });

  // ⚡ Partikel listrik acak (spark)
  for (let i = 0; i < 10; i++) {
    const spark = document.createElement("div");
    spark.className = "spark";
    document.body.appendChild(spark);
    gsap.set(spark, {
      position: "absolute",
      width: 2,
      height: 2,
      background: "#00f5ff",
      borderRadius: "50%",
      top: Math.random() * window.innerHeight,
      left: Math.random() * window.innerWidth,
      opacity: 0
    });
    gsap.to(spark, {
      opacity: 1,
      x: "+=" + gsap.utils.random(-50, 50),
      y: "+=" + gsap.utils.random(-50, 50),
      repeat: -1,
      yoyo: true,
      duration: gsap.utils.random(1, 3),
      ease: "sine.inOut",
      delay: Math.random() * 2
    });
  }

  // ===============================
  // ⏱️ FUNGSI PUTARAN WAKTU
  // ===============================
  function peuAturDetik() {
    gsap.set(detik, { rotation: peugotPutaranDetik, transformOrigin: "50% 50%" });
  }
  function peuAturMenitJam() {
    gsap.set(menit, { rotation: peugotPutaranMenit, transformOrigin: "50% 50%" });
    gsap.set(jam, { rotation: peugotPutaranJam, transformOrigin: "50% 50%" });
  }

  function peugotPutaranDetik() {
    const detikBaru = new Date().getSeconds();
    const rotasi = detikBaru * 6;
    const skalaDetik = gsap.getProperty(detik, "scaleX");
    const beda = Math.abs(gsap.getProperty(detik, "rotation") - rotasi);
    if (beda >= 12)
      gsap.set(detik, { rotation: rotasi, transformOrigin: "50% 50%" });
    if ((rotasi >= 180 && rotasi < 360) && (skalaDetik === 1))
      gsap.to(detik, { scaleX: -1, duration: 0.25 });
    else if ((rotasi < 180 || rotasi >= 360) && (skalaDetik === -1))
      gsap.to(detik, { scaleX: 1, duration: 0.25 });
    return rotasi;
  }

  function peugotPutaranMenit() {
    const wateeBaru = new Date();
    const rotasi = wateeBaru.getMinutes() * 6 + wateeBaru.getSeconds() * 6 / 59;
    const skalaMenit = gsap.getProperty(menit, "scaleX");
    const beda = Math.abs(gsap.getProperty(menit, "rotation") - rotasi);
    if (beda >= 5)
      gsap.set(menit, { rotation: rotasi, transformOrigin: "50% 50%" });
    if ((rotasi >= 180 && rotasi < 360) && (skalaMenit === 1))
      gsap.to(menit, { scaleX: -1, duration: 0.25 });
    else if ((rotasi < 180 || rotasi >= 360) && (skalaMenit === -1))
      gsap.to(menit, { scaleX: 1, duration: 0.25 });
    return rotasi;
  }

  function peugotPutaranJam() {
    const wateeBaru = new Date();
    const rotasi = (wateeBaru.getHours() % 12) * 30 + wateeBaru.getMinutes() * 0.5;
    const skalaJam = gsap.getProperty(jam, "scaleX");
    const beda = Math.abs(gsap.getProperty(jam, "rotation") - rotasi);
    if (beda >= 5)
      gsap.set(jam, { rotation: rotasi, transformOrigin: "50% 50%" });
    if ((rotasi >= 180 && rotasi < 360) && (skalaJam === 1))
      gsap.to(jam, { scaleX: -1, duration: 0.25 });
    else if ((rotasi < 180 || rotasi >= 360) && (skalaJam === -1))
      gsap.to(jam, { scaleX: 1, duration: 0.25 });
    return rotasi;
  }
}
