// Decide intro vs not synchronously (runs in <head> before <body> parses)
// so CSS can hide animated bits without flashing full content.
(function () {
  var playIntro = false;
  try {
    playIntro =
      !sessionStorage.getItem("introPlayed") &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch (e) {
    playIntro = false;
  }
  document.documentElement.classList.add(playIntro ? "intro" : "no-intro");
})();

// Mobile Navigation Toggle
const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");

if (navToggle && navLinks) {
  navToggle.addEventListener("click", () => {
    navLinks.classList.toggle("active");
    const icon = navToggle.querySelector("i");
    if (navLinks.classList.contains("active")) {
      icon.classList.remove("fa-bars");
      icon.classList.add("fa-times");
    } else {
      icon.classList.remove("fa-times");
      icon.classList.add("fa-bars");
    }
  });

  // Close mobile menu when clicking on a link
  document.querySelectorAll(".nav-links a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("active");
      const icon = navToggle.querySelector("i");
      icon.classList.remove("fa-times");
      icon.classList.add("fa-bars");
    });
  });
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      const navHeight = document.querySelector("nav").offsetHeight;
      const targetPosition = target.offsetTop - navHeight - 20;

      window.scrollTo({
        top: targetPosition,
        behavior: "smooth",
      });
    }
  });
});

// Navigation scroll effect and active link highlighting
window.addEventListener("scroll", () => {
  const nav = document.querySelector("nav");
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-links a");

  // Change nav background on scroll
  if (window.scrollY > 50) {
    nav.style.background = "rgba(255, 255, 255, 0.98)";
    nav.style.borderBottom = "1px solid var(--neutral-300)";
  } else {
    nav.style.background = "rgba(255, 255, 255, 0.95)";
    nav.style.borderBottom = "1px solid var(--neutral-200)";
  }

  // Highlight active navigation link
  let current = "";
  const scrollPosition = window.scrollY + nav.offsetHeight + 50;

  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;

    if (
      scrollPosition >= sectionTop &&
      scrollPosition < sectionTop + sectionHeight
    ) {
      current = section.getAttribute("id");
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href") === `#${current}`) {
      link.classList.add("active");
    }
  });
});

// Intersection Observer for fade-in animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -100px 0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
    }
  });
}, observerOptions);

// Initialize fade-in animations
document.addEventListener("DOMContentLoaded", () => {
  // Observe all fade-in elements
  document.querySelectorAll(".fade-in").forEach((element) => {
    observer.observe(element);
  });

  // Add staggered animation delay for grid items
  document
    .querySelectorAll(".skills-grid .skill-card")
    .forEach((card, index) => {
      card.style.transitionDelay = `${index * 0.1}s`;
    });

  document
    .querySelectorAll(".projects-grid .project-card")
    .forEach((card, index) => {
      card.style.transitionDelay = `${index * 0.15}s`;
    });
});

// Smooth hover effects for buttons
//TODO: fix the hover animation. Currently it enlarges the buttons to multiple different sizes on a single hover.
// document.querySelectorAll('.btn').forEach(btn => {
//   btn.addEventListener('mouseenter', function(e) {
//     const ripple = document.createElement('span');
//     const rect = this.getBoundingClientRect();
//     const size = Math.max(rect.width, rect.height);
//     const x = e.clientX - rect.left - size / 2;
//     const y = e.clientY - rect.top - size / 2;

//     ripple.style.width = ripple.style.height = size + 'px';
//     ripple.style.left = x + 'px';
//     ripple.style.top = y + 'px';
//     ripple.classList.add('ripple');

//     this.appendChild(ripple);

//     setTimeout(() => {
//       ripple.remove();
//     }, 600);
//   });
// });

// Performance optimization: Throttle scroll events
let ticking = false;

function updateOnScroll() {
  // Scroll-based updates here
  ticking = false;
}

window.addEventListener("scroll", () => {
  if (!ticking) {
    requestAnimationFrame(updateOnScroll);
    ticking = true;
  }
});

// Add loading animation
window.addEventListener("load", () => {
  document.body.classList.add("loaded");
});

// Preload critical images
const preloadImages = ["./assets/images/preston.jpg"];

preloadImages.forEach((src) => {
  const img = new Image();
  img.src = src;
});

// Image Carousel Functionality
class Carousel {
  constructor(carouselId) {
    this.carouselId = carouselId;
    this.track = document.querySelector(`[data-carousel="${carouselId}"]`);
    this.slides = Array.from(this.track.children);
    this.indicatorsContainer = document.querySelector(
      `[data-carousel-indicators="${carouselId}"]`,
    );
    this.prevButton = document.querySelector(
      `[data-carousel-control="${carouselId}"].prev`,
    );
    this.nextButton = document.querySelector(
      `[data-carousel-control="${carouselId}"].next`,
    );
    this.currentIndex = 0;

    this.init();
  }

  init() {
    // Create indicators
    this.createIndicators();

    // Set up event listeners
    this.prevButton.addEventListener("click", () => this.prevSlide());
    this.nextButton.addEventListener("click", () => this.nextSlide());

    // Update initial state
    this.updateCarousel();

    // Handle window resize
    window.addEventListener("resize", () => this.updateCarousel());
  }

  createIndicators() {
    this.slides.forEach((_, index) => {
      const indicator = document.createElement("button");
      indicator.classList.add("carousel-indicator");
      indicator.setAttribute("aria-label", `Go to slide ${index + 1}`);
      indicator.addEventListener("click", () => this.goToSlide(index));
      this.indicatorsContainer.appendChild(indicator);
    });
  }

  updateCarousel() {
    // Move track
    const slideWidth = this.slides[0].getBoundingClientRect().width;
    this.track.style.transform = `translateX(-${this.currentIndex * slideWidth}px)`;

    // Update indicators
    const indicators = Array.from(this.indicatorsContainer.children);
    indicators.forEach((indicator, index) => {
      indicator.classList.toggle("active", index === this.currentIndex);
    });

    // Update button states
    this.prevButton.disabled = this.currentIndex === 0;
    this.nextButton.disabled = this.currentIndex === this.slides.length - 1;
  }

  nextSlide() {
    if (this.currentIndex < this.slides.length - 1) {
      this.currentIndex++;
      this.updateCarousel();
    }
  }

  prevSlide() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.updateCarousel();
    }
  }

  goToSlide(index) {
    this.currentIndex = index;
    this.updateCarousel();
  }
}

// Initialize all carousels on page load
document.addEventListener("DOMContentLoaded", () => {
  // Find all unique carousel IDs
  const carouselTracks = document.querySelectorAll("[data-carousel]");
  carouselTracks.forEach((track) => {
    const carouselId = track.getAttribute("data-carousel");
    new Carousel(carouselId);
  });
});

// ===== Hero intro animation (index page only) =====
document.addEventListener("DOMContentLoaded", () => {
  if (!document.documentElement.classList.contains("intro")) return;

  const description = document.querySelector(
    ".hero .description[data-typewriter]",
  );
  const profile = document.querySelector(".hero .profile-image");
  const canvas = document.querySelector(".hero .matrix-canvas");
  const heading = document.querySelector(".hero h1");
  const subtitle = document.querySelector(".hero .subtitle");
  const cta = document.querySelector(".hero .cta-buttons");

  // If hero markup is missing (shared script on a sub-page), bail safely.
  if (!description) return;

  const fullText = description.textContent.trim();

  function typeWriter(el, text, speed) {
    return new Promise((resolve) => {
      el.textContent = "";
      el.classList.add("typing");

      const prompt = document.createElement("span");
      prompt.className = "tw-prompt";
      prompt.textContent = "~/justin $";

      const out = document.createElement("span");

      const cursor = document.createElement("span");
      cursor.className = "tw-cursor";
      cursor.textContent = "█";

      el.append(prompt, out, cursor);

      let i = 0;
      (function tick() {
        if (i < text.length) {
          out.textContent += text.charAt(i);
          i++;
          setTimeout(tick, speed);
        } else {
          cursor.remove();
          el.classList.add("typed");
          el.classList.remove("typing");
          resolve();
        }
      })();
    });
  }

  function matrixReveal(cv, img, durationMs) {
    return new Promise((resolve) => {
      if (!cv || !cv.getContext) {
        resolve();
        return;
      }
      const ctx = cv.getContext("2d");
      const rect = img.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      const w = rect.width || 200;
      const h = rect.height || 200;
      cv.width = w * dpr;
      cv.height = h * dpr;
      ctx.scale(dpr, dpr);

      // Clip drawing to a circle matching the profile image.
      ctx.beginPath();
      ctx.arc(w / 2, h / 2, Math.min(w, h) / 2, 0, Math.PI * 2);
      ctx.clip();

      const glyphs = "アカサタナハマヤラワ0123456789<>/{}[]$#*";
      const fontSize = 14;
      const columns = Math.ceil(w / fontSize);
      const drops = new Array(columns).fill(0).map(() => Math.random() * -20);

      const start = performance.now();
      // Crossfade: start revealing the photo + fading the canvas while the
      // rain keeps animating, so it never freezes on a static frame.
      const crossfadeMs = 900;
      const revealAt = durationMs - crossfadeMs;
      let raf;
      let revealed = false;

      function frame(now) {
        const elapsed = now - start;

        // Trail fade
        ctx.fillStyle = "rgba(15, 23, 42, 0.25)";
        ctx.fillRect(0, 0, w, h);
        ctx.font = fontSize + "px monospace";

        for (let c = 0; c < columns; c++) {
          const ch = glyphs.charAt((Math.random() * glyphs.length) | 0);
          const x = c * fontSize;
          const y = drops[c] * fontSize;
          // Lead char brighter, trail in steel-blue.
          ctx.fillStyle = "#93c5fd";
          ctx.fillText(ch, x, y);
          ctx.fillStyle = "#2563eb";
          ctx.fillText(
            glyphs.charAt((Math.random() * glyphs.length) | 0),
            x,
            y - fontSize,
          );

          if (y > h && Math.random() > 0.95) drops[c] = 0;
          drops[c]++;
        }

        // Trigger the crossfade once, then let rain keep running underneath.
        if (!revealed && elapsed >= revealAt) {
          revealed = true;
          img.classList.add("intro-show");
          cv.classList.add("fade-out");
        }

        if (elapsed < durationMs) {
          raf = requestAnimationFrame(frame);
        } else {
          cancelAnimationFrame(raf);
          cv.remove();
          resolve();
        }
      }
      raf = requestAnimationFrame(frame);
    });
  }

  // Orchestrate
  if (profile && canvas) matrixReveal(canvas, profile, 2000);

  if (heading) setTimeout(() => heading.classList.add("intro-show"), 200);
  if (subtitle) setTimeout(() => subtitle.classList.add("intro-show"), 400);

  setTimeout(() => {
    typeWriter(description, fullText, 22).then(() => {
      if (cta) cta.classList.add("intro-show");
      try {
        sessionStorage.setItem("introPlayed", "1");
      } catch (e) {}
    });
  }, 600);
});

// // Mobile Navigation Toggle
// const navToggle = document.querySelector(".nav-toggle");
// const navLinks = document.querySelector(".nav-links");

// if (navToggle && navLinks) {
//   navToggle.addEventListener("click", () => {
//     navLinks.classList.toggle("active");
//     const icon = navToggle.querySelector("i");
//     if (navLinks.classList.contains("active")) {
//       icon.classList.remove("fa-bars");
//       icon.classList.add("fa-times");
//     } else {
//       icon.classList.remove("fa-times");
//       icon.classList.add("fa-bars");
//     }
//   });

//   // Close mobile menu when clicking on a link
//   document.querySelectorAll(".nav-links a").forEach((link) => {
//     link.addEventListener("click", () => {
//       navLinks.classList.remove("active");
//       const icon = navToggle.querySelector("i");
//       icon.classList.remove("fa-times");
//       icon.classList.add("fa-bars");
//     });
//   });
// }

// // Navigation scroll effect
// window.addEventListener("scroll", () => {
//   const nav = document.querySelector("nav");
//   if (window.scrollY > 50) {
//     nav.style.background = "rgba(255, 255, 255, 0.98)";
//     nav.style.borderBottom = "1px solid var(--neutral-300)";
//   } else {
//     nav.style.background = "rgba(255, 255, 255, 0.95)";
//     nav.style.borderBottom = "1px solid var(--neutral-200)";
//   }
// });

// // Fade-in animations
// const observerOptions = {
//   threshold: 0.1,
//   rootMargin: "0px 0px -100px 0px",
// };

// const observer = new IntersectionObserver((entries) => {
//   entries.forEach((entry) => {
//     if (entry.isIntersecting) {
//       entry.target.classList.add("visible");
//     }
//   });
// }, observerOptions);

// // Initialize fade-in animations
// document.addEventListener("DOMContentLoaded", () => {
//   // Observe all fade-in elements
//   document.querySelectorAll(".fade-in").forEach((element) => {
//     observer.observe(element);
//   });

//   // Add staggered animation delay for project cards
//   document
//     .querySelectorAll(".projects-grid .project-card")
//     .forEach((card, index) => {
//       card.style.transitionDelay = `${index * 0.15}s`;
//     });
// });

// // Smooth scrolling for internal links
// document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
//   anchor.addEventListener("click", function (e) {
//     e.preventDefault();
//     const target = document.querySelector(this.getAttribute("href"));
//     if (target) {
//       const navHeight = document.querySelector("nav").offsetHeight;
//       const targetPosition = target.offsetTop - navHeight - 20;

//       window.scrollTo({
//         top: targetPosition,
//         behavior: "smooth",
//       });
//     }
//   });
// });
