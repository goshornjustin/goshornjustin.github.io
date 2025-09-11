// Mobile Navigation Toggle
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    const icon = navToggle.querySelector('i');
    if (navLinks.classList.contains('active')) {
      icon.classList.remove('fa-bars');
      icon.classList.add('fa-times');
    } else {
      icon.classList.remove('fa-times');
      icon.classList.add('fa-bars');
    }
  });

  // Close mobile menu when clicking on a link
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
      const icon = navToggle.querySelector('i');
      icon.classList.remove('fa-times');
      icon.classList.add('fa-bars');
    });
  });
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      const navHeight = document.querySelector('nav').offsetHeight;
      const targetPosition = target.offsetTop - navHeight - 20;
      
      window.scrollTo({
        top: targetPosition,
        behavior: "smooth"
      });
    }
  });
});

// Navigation scroll effect and active link highlighting
window.addEventListener("scroll", () => {
  const nav = document.querySelector("nav");
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');
  
  // Change nav background on scroll
  if (window.scrollY > 50) {
    nav.style.background = "rgba(255, 255, 255, 0.98)";
    nav.style.borderBottom = "1px solid var(--neutral-300)";
  } else {
    nav.style.background = "rgba(255, 255, 255, 0.95)";
    nav.style.borderBottom = "1px solid var(--neutral-200)";
  }
  
  // Highlight active navigation link
  let current = '';
  const scrollPosition = window.scrollY + nav.offsetHeight + 50;
  
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    
    if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
      current = section.getAttribute('id');
    }
  });
  
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
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
      entry.target.classList.add('visible');
    }
  });
}, observerOptions);

// Initialize fade-in animations
document.addEventListener('DOMContentLoaded', () => {
  // Observe all fade-in elements
  document.querySelectorAll(".fade-in").forEach((element) => {
    observer.observe(element);
  });
  
  // Add staggered animation delay for grid items
  document.querySelectorAll(".skills-grid .skill-card").forEach((card, index) => {
    card.style.transitionDelay = `${index * 0.1}s`;
  });
  
  document.querySelectorAll(".projects-grid .project-card").forEach((card, index) => {
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

window.addEventListener('scroll', () => {
  if (!ticking) {
    requestAnimationFrame(updateOnScroll);
    ticking = true;
  }
});

// Add loading animation
window.addEventListener('load', () => {
  document.body.classList.add('loaded');
});

// Preload critical images
const preloadImages = [
  './assets/images/preston.jpg'
];

preloadImages.forEach(src => {
  const img = new Image();
  img.src = src;
});
