// ---- Scroll reveal ----
const revealEls = document.querySelectorAll('.section-reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

revealEls.forEach((el) => revealObserver.observe(el));

// ---- Project detail view ----
const projects = {
  triceratops: {
    tag: 'Client Work',
    title: 'Triceratops Website Design',
    image: 'uploads/triceratops.png',
    desc: 'Coming Soon...'
  },
  harmonize: {
    tag: 'UX Research',
    title: 'Harmonize App: Design Interactive',
    image: null,
    desc: 'Coming Soon...'
  },
  cyclefind: {
    tag: 'Design System',
    title: 'CycleFind App Design',
    image: 'uploads/cyclefind.png',
    desc: 'Coming Soon...'
  }
};

const homeView = document.getElementById('home-view');
const projectView = document.getElementById('project-view');
const pvTag = document.getElementById('pv-tag');
const pvTitle = document.getElementById('pv-title');
const pvImage = document.getElementById('pv-image');
const pvPlaceholder = document.getElementById('pv-placeholder');
const pvDesc = document.getElementById('pv-desc');
const backBtn = document.getElementById('back-btn');
const footer = document.querySelector('.footer');

let lastScrollY = 0;

function openProject(key) {
  const project = projects[key];
  if (!project) return;

  lastScrollY = window.scrollY;

  pvTag.textContent = project.tag;
  pvTitle.textContent = project.title;
  pvDesc.textContent = project.desc;

  if (project.image) {
    pvImage.src = project.image;
    pvImage.alt = project.title;
    pvImage.hidden = false;
    pvPlaceholder.hidden = true;
  } else {
    pvImage.hidden = true;
    pvPlaceholder.hidden = false;
  }

  homeView.hidden = true;
  footer.hidden = true;
  projectView.hidden = false;
  window.scrollTo(0, 0);
  backBtn.focus();
}

function closeProject() {
  projectView.hidden = true;
  homeView.hidden = false;
  footer.hidden = false;
  window.scrollTo(0, lastScrollY);
}

document.querySelectorAll('.project-card').forEach((card) => {
  card.addEventListener('click', () => openProject(card.dataset.project));
  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openProject(card.dataset.project);
    }
  });
});

backBtn.addEventListener('click', closeProject);
