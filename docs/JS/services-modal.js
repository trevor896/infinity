document.addEventListener('DOMContentLoaded', () => {
  const modal = document.querySelector('.service-modal');
  const modalTitle = document.getElementById('serviceModalTitle');
  const modalContent = document.getElementById('serviceModalContent');
  const closeEls = document.querySelectorAll('[data-close="true"], [data-close-btn="true"]');

  if (!modal || !modalTitle || !modalContent) {
    return;
  }

  const templates = {
    logo: {
      title: 'Logo & Poster Design',
      html: `
        <div class="svc-section">
          <h3>Process breakdown</h3>
          <ol>
            <li>Discovery: goals, brand references, and audience.</li>
            <li>Concepts: 2–3 design directions with visual rationale.</li>
            <li>Refinement: typography, composition, and color alignment.</li>
            <li>Final delivery: production-ready assets and export sets.</li>
          </ol>
        </div>
        <div class="svc-section">
          <h3>Thought process</h3>
          <p>We focus on legibility, hierarchy, and brand consistency. Every choice (spacing, contrast, and typography) supports recognition at a glance.</p>
        </div>
        <div class="svc-section">
          <h3>Delivery details</h3>
          <ul>
            <li>Formats: SVG/PNG/JPG/PDF (finals), editable source if applicable.</li>
            <li>Exports: web + print sizes (placeholder sizes).</li>
            <li>Deployment: sent via download link / email attachment (placeholder).</li>
          </ul>
        </div>
        <div class="svc-section">
          <h3>Typical focus</h3>
          <ul>
            <li>Logo and poster composition</li>
            <li>Typography, colour, and visual hierarchy</li>
            <li>Digital and print-ready exports</li>
          </ul>
        </div>
      `
    },
    social: {
      title: 'Social Media Posts',
      html: `
        <div class="svc-section">
          <h3>Process breakdown</h3>
          <ol>
            <li>Content intake: topics, offers, platform formats.</li>
            <li>Layout planning: grid, hierarchy, and brand tone.</li>
            <li>Design production: draft → feedback → final.</li>
            <li>Export kit: ready-to-post images + reusable templates.</li>
          </ol>
        </div>
        <div class="svc-section">
          <h3>Thought process</h3>
          <p>We design for stopping power and clarity on mobile. Headlines are prioritized, and visual rhythm keeps the feed consistent.</p>
        </div>
        <div class="svc-section">
          <h3>Delivery details</h3>
          <ul>
            <li>Formats: PNG/JPG, optional template variants.</li>
            <li>Deployment: shareable link or direct download.</li>
            <li>File naming: campaign-based (placeholder).</li>
          </ul>
        </div>
        <div class="svc-section">
          <h3>Typical focus</h3>
          <ul>
            <li>Social media post layouts</li>
            <li>Consistent colour and typography</li>
            <li>Clear, mobile-friendly visual communication</li>
          </ul>
        </div>
      `
    },
    uiux: {
      title: 'UI/UX Design',
      html: `
        <div class="svc-section">
          <h3>Process breakdown</h3>
          <ol>
            <li>Audit: current UX, goals, constraints, user needs.</li>
            <li>Wireframes: structure, flow, and information hierarchy.</li>
            <li>High-fidelity UI: components, spacing, typography.</li>
            <li>Handoff: specs, states, and design tokens (placeholder).</li>
          </ol>
        </div>
        <div class="svc-section">
          <h3>Thought process</h3>
          <p>We map user intentions to UI decisions. The design supports speed, accessibility, and predictable navigation—so users feel in control.</p>
        </div>
        <div class="svc-section">
          <h3>Delivery details</h3>
          <ul>
            <li>Figma files + export images/PDF.</li>
            <li>Optional: clickable prototype (placeholder).</li>
            <li>Deployment: shared through Figma or email link.</li>
          </ul>
        </div>
        <div class="svc-section">
          <h3>Typical focus</h3>
          <ul>
            <li>Wireframes and user flows</li>
            <li>Layout, spacing, and visual hierarchy</li>
            <li>Figma interface concepts</li>
          </ul>
        </div>
      `
    },
    web: {
      title: 'Front-end Development',
      html: `
        <div class="svc-section">
          <h3>Process breakdown</h3>
          <ol>
            <li>Planning: pages, content structure, and SEO basics.</li>
            <li>UI build: responsive layout using modern components.</li>
            <li>Implementation: interactions, accessibility, performance.</li>
            <li>Deployment: final build + hosting steps.</li>
          </ol>
        </div>
        <div class="svc-section">
          <h3>Thought process</h3>
          <p>We optimize for maintainability and speed. The page is designed to render cleanly across devices, with consistent spacing and accessible typography.</p>
        </div>
        <div class="svc-section">
          <h3>Delivery details</h3>
          <ul>
            <li>Formats: source code + optimized assets.</li>
            <li>Deployment: Netlify/Vercel/hosting placeholder.</li>
            <li>Access: repo link + brief handover.</li>
          </ul>
        </div>
        <div class="svc-section">
          <h3>Typical focus</h3>
          <ul>
            <li>Semantic HTML and responsive CSS</li>
            <li>Basic JavaScript interactions</li>
            <li>Accessible, mobile-friendly page layouts</li>
          </ul>
        </div>
      `
    },
    analytics: {
      title: 'Analytics Dashboards',
      html: `
        <div class="svc-section">
          <h3>Process breakdown</h3>
          <ol>
            <li>Requirements: KPIs, audience, reporting frequency.</li>
            <li>Data mapping: sources, transformations, definitions.</li>
            <li>Dashboard build: charts, filters, and layout refinement.</li>
            <li>Validation: ensure numbers match and visuals are clear.</li>
          </ol>
        </div>
        <div class="svc-section">
          <h3>Thought process</h3>
          <p>We prioritize decision flow: what users need to see first. Dashboards are built to prevent confusion and surface meaningful trends.</p>
        </div>
        <div class="svc-section">
          <h3>Delivery details</h3>
          <ul>
            <li>Formats: PowerBI/exports placeholder.</li>
            <li>Deployment: publish to workspace or share link (placeholder).</li>
            <li>Documentation: KPI definitions & filters guidance.</li>
          </ul>
        </div>
        <div class="svc-section">
          <h3>Typical focus</h3>
          <ul>
            <li>Clear dashboard and report layouts</li>
            <li>Basic data presentation and KPI organisation</li>
            <li>Readable charts and visual summaries</li>
          </ul>
        </div>
      `
    },
  };

  function openByKey(key) {
    const tpl = templates[key];

    if (!tpl) {
      modalTitle.textContent = 'Service unavailable';
      modalContent.innerHTML = '<p>Please choose another service card.</p>';
      modal.hidden = false;
      modal.classList.add('is-open');
      modal.setAttribute('aria-hidden', 'false');
      return;
    }

    modalTitle.textContent = tpl.title;
    modalContent.innerHTML = tpl.html;
    modal.hidden = false;
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
  }

  function closeModal() {
    modal.hidden = true;
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
  }


  // open buttons
  document.querySelectorAll('.flashcard-btn[data-open]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const key = btn.getAttribute('data-open');
      openByKey(key);
    });
  });

  // close buttons/backdrop
  closeEls.forEach((el) => el.addEventListener('click', closeModal));

  // Escape close
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.hidden) {
      closeModal();
    }
  });
});

