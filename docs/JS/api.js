const API_BASE = (() => {
  if (typeof window === 'undefined') {
    return 'http://localhost:5000/api';
  }

  if (window.location.protocol === 'file:') {
    return 'http://localhost:5000/api';
  }

  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return `${window.location.protocol}//${window.location.hostname}:5000/api`;
  }

  return '/api';
})();

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const FALLBACK_PROJECTS = [
  {
    id: 'project-1',
    title: 'Portfolio Website',
    description: 'A polished portfolio experience built for personal branding, service promotion, and client inquiries.',
    category: 'Web',
    tags: ['HTML', 'CSS', 'JavaScript'],
    liveUrl: '#',
    repoUrl: '#'
  },
  {
    id: 'project-2',
    title: 'Brand Identity Kit',
    description: 'A visual identity study with logo explorations, mockups, and presentation-ready marketing assets.',
    category: 'Design',
    tags: ['Figma', 'Branding', 'UI/UX'],
    liveUrl: '#',
    repoUrl: '#'
  },
  {
    id: 'project-3',
    title: 'Business Dashboard',
    description: 'A reporting dashboard concept demonstrating clean KPI layouts and decision-focused analytics.',
    category: 'Analytics',
    tags: ['Power BI', 'Data', 'Strategy'],
    liveUrl: '#',
    repoUrl: '#'
  }
];

async function apiGet(path) {
  const response = await fetch(`${API_BASE}${path}`, { cache: 'no-store' });
  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }
  return response.json();
}

async function apiPost(path, data) {
  const response = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data),
    cache: 'no-store'
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.error || `Request failed: ${response.status}`);
  }
  return response.json();
}

function formatProjectCard(project) {
  const tags = (project.tags || []).map((tag) => `<span class="project-tag">${tag}</span>`).join('');
  return `
    <article class="project-card">
      <div class="project-card__image">
        <img src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80" alt="${project.title} preview" />
      </div>
      <div class="project-card__content">
        <span class="project-card__category">${project.category || 'Project'}</span>
        <h2>${project.title}</h2>
        <p>${project.description}</p>
        <div class="project-card__tags">${tags}</div>
        <div class="project-card__links">
          ${project.liveUrl ? `<a href="${project.liveUrl}" target="_blank" rel="noopener noreferrer">Live</a>` : ''}
          ${project.repoUrl ? `<a href="${project.repoUrl}" target="_blank" rel="noopener noreferrer">Repo</a>` : ''}
        </div>
      </div>
    </article>
  `;
}

async function populateProjects() {
  const list = document.getElementById('project-list');
  if (!list) return;

  list.innerHTML = '<p class="loading">Loading projects...</p>';

  try {
    const projects = await apiGet('/projects');
    const finalProjects = Array.isArray(projects) && projects.length > 0 ? projects : FALLBACK_PROJECTS;
    list.innerHTML = finalProjects.map(formatProjectCard).join('');
  } catch (error) {
    console.warn('Using fallback project data because the API is unavailable:', error);
    list.innerHTML = FALLBACK_PROJECTS.map(formatProjectCard).join('');
  }
}

async function submitContactForm(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const status = document.getElementById('form-status');

  if (!form || !status) return;

  const formData = new FormData(form);
  const payload = {
    name: formData.get('name')?.toString().trim(),
    email: formData.get('email')?.toString().trim(),
    message: formData.get('message')?.toString().trim()
  };

  if (!payload.name || !payload.email || !payload.message) {
    status.textContent = 'Please complete all fields before submitting.';
    status.className = 'form-status form-status--error';
    return;
  }

  if (!EMAIL_REGEX.test(payload.email)) {
    status.textContent = 'Please enter a valid email address.';
    status.className = 'form-status form-status--error';
    return;
  }

  status.textContent = 'Sending your message...';
  status.className = 'form-status form-status--pending';

  try {
    await apiPost('/contact', payload);
    form.reset();
    status.textContent = 'Message sent successfully! I will reply soon.';
    status.className = 'form-status form-status--success';
  } catch (error) {
    const errorMessage = error instanceof TypeError && error.message === 'Failed to fetch'
      ? 'The contact service is unavailable. Please try again later.'
      : `Failed to send message. ${error.message}`;
    status.textContent = errorMessage;
    status.className = 'form-status form-status--error';
    console.error(error);
  }
}

function initLogoGalleryModal() {
  const modal = document.getElementById('logo-modal');
  if (!modal) return;

  const modalImage = modal.querySelector('.logo-modal__image');
  const modalTitle = modal.querySelector('#logo-modal-title');
  const modalCaption = modal.querySelector('.logo-modal__caption');
  const closeButton = modal.querySelector('.logo-modal__close');
  const cards = document.querySelectorAll('[data-logo-src]');

  if (!modalImage || !modalTitle || !modalCaption || !closeButton || cards.length === 0) return;

  const openModal = (src, title, caption) => {
    modalImage.src = src;
    modalImage.alt = title;
    modalTitle.textContent = title;
    modalCaption.textContent = caption;
    modal.classList.add('logo-modal--open');
    modal.setAttribute('aria-hidden', 'false');
  };

  const closeModal = () => {
    modal.classList.remove('logo-modal--open');
    modal.setAttribute('aria-hidden', 'true');
    modalImage.src = '';
    modalTitle.textContent = '';
    modalCaption.textContent = '';
  };

  cards.forEach((card) => {
    const src = card.dataset.logoSrc;
    const title = card.dataset.logoTitle;
    const caption = card.dataset.logoCaption;

    const activate = () => openModal(src, title, caption);
    card.addEventListener('click', activate);
    card.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        activate();
      }
    });
  });

  closeButton.addEventListener('click', closeModal);
  modal.addEventListener('click', (event) => {
    if (event.target === modal || event.target.matches('[data-modal-close]')) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modal.classList.contains('logo-modal--open')) {
      closeModal();
    }
  });
}

function initPortfolioApi() {
  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', submitContactForm);
  }

  if (document.getElementById('project-list')) {
    populateProjects();
  }

  initLogoGalleryModal();
}

document.addEventListener('DOMContentLoaded', initPortfolioApi);
