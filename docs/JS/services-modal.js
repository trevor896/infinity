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
        <div class="svc-pricing">
          <h3>Pricing tiers</h3>
          <div class="pricing-grid">
            <div class="pricing-tier">
              <h4>Basic</h4>
              <p class="price">$99</p>
              <p>One concept direction, quick polish, single poster set.</p>
              <p class="note">Personalization: limited revisions.</p>
            </div>
            <div class="pricing-tier">
              <h4>Standard</h4>
              <p class="price">$199</p>
              <p>Two concepts, logo + poster set, typography refinement.</p>
              <p class="note">Personalization: moderate revisions + variants.</p>
            </div>
            <div class="pricing-tier premium">
              <h4>Premium</h4>
              <p class="price">$349</p>
              <p>Three concepts, full brand consistency pass, extra formats.</p>
              <p class="note">Best for complex themes & higher complexity.</p>
            </div>
          </div>
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
        <div class="svc-pricing">
          <h3>Pricing tiers</h3>
          <div class="pricing-grid">
            <div class="pricing-tier">
              <h4>Basic</h4>
              <p class="price">$79</p>
              <p>3 posts, single style direction.</p>
              <p class="note">Personalization: light adjustments.</p>
            </div>
            <div class="pricing-tier">
              <h4>Standard</h4>
              <p class="price">$149</p>
              <p>6 posts + 1 variant style, optimized spacing.</p>
              <p class="note">Personalization: moderate revisions.</p>
            </div>
            <div class="pricing-tier premium">
              <h4>Premium</h4>
              <p class="price">$269</p>
              <p>10–14 posts, campaign kit + reusable templates.</p>
              <p class="note">Best for multi-theme or ongoing content.</p>
            </div>
          </div>
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
        <div class="svc-pricing">
          <h3>Pricing tiers</h3>
          <div class="pricing-grid">
            <div class="pricing-tier">
              <h4>Basic</h4>
              <p class="price">$129</p>
              <p>1–2 core screens + basic flow outline.</p>
              <p class="note">Personalization: limited scope.</p>
            </div>
            <div class="pricing-tier">
              <h4>Standard</h4>
              <p class="price">$249</p>
              <p>5–7 screens + component set + styling pass.</p>
              <p class="note">Personalization: moderate revisions.</p>
            </div>
            <div class="pricing-tier premium">
              <h4>Premium</h4>
              <p class="price">$499</p>
              <p>Full design system support + extended states & handoff.</p>
              <p class="note">Best for complex product flows.</p>
            </div>
          </div>
        </div>
      `
    },
    web: {
      title: 'Website Development',
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
        <div class="svc-pricing">
          <h3>Pricing tiers</h3>
          <div class="pricing-grid">
            <div class="pricing-tier">
              <h4>Basic</h4>
              <p class="price">$199</p>
              <p>1 landing page + responsive styling.</p>
              <p class="note">Personalization: limited sections.</p>
            </div>
            <div class="pricing-tier">
              <h4>Standard</h4>
              <p class="price">$399</p>
              <p>Up to 3–4 pages + forms + animations (light).</p>
              <p class="note">Personalization: moderate revisions.</p>
            </div>
            <div class="pricing-tier premium">
              <h4>Premium</h4>
              <p class="price">$749</p>
              <p>5+ pages + advanced interactions + full polish.</p>
              <p class="note">Best for higher complexity & custom components.</p>
            </div>
          </div>
        </div>
      `
    },
    automation: {
      title: 'AI & Automation Integrations',
      html: `
        <div class="svc-section">
          <h3>Process breakdown</h3>
          <ol>
            <li>Use-case discovery: where time is wasted.</li>
            <li>Workflow mapping: inputs, outputs, triggers.</li>
            <li>Implementation: integrate models/services safely.</li>
            <li>Testing + iteration: verify accuracy and reliability.</li>
          </ol>
        </div>
        <div class="svc-section">
          <h3>Thought process</h3>
          <p>We design automation around real constraints: latency, privacy, and error handling. The system should be predictable and easy to maintain.</p>
        </div>
        <div class="svc-section">
          <h3>Delivery details</h3>
          <ul>
            <li>Code + documentation (placeholder).</li>
            <li>Deployment method: serverless/hosted integration (placeholder).</li>
            <li>Access: environment setup notes for handover.</li>
          </ul>
        </div>
        <div class="svc-pricing">
          <h3>Pricing tiers</h3>
          <div class="pricing-grid">
            <div class="pricing-tier">
              <h4>Basic</h4>
              <p class="price">$249</p>
              <p>Single workflow automation with limited scope.</p>
              <p class="note">Personalization: small adjustments.</p>
            </div>
            <div class="pricing-tier">
              <h4>Standard</h4>
              <p class="price">$499</p>
              <p>Multi-step automation with improved reliability.</p>
              <p class="note">Personalization: moderate complexity.</p>
            </div>
            <div class="pricing-tier premium">
              <h4>Premium</h4>
              <p class="price">$999</p>
              <p>AI-assisted system with monitoring and extended flows.</p>
              <p class="note">Best for higher complexity use-cases.</p>
            </div>
          </div>
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
        <div class="svc-pricing">
          <h3>Pricing tiers</h3>
          <div class="pricing-grid">
            <div class="pricing-tier">
              <h4>Basic</h4>
              <p class="price">$149</p>
              <p>1–2 dashboards with limited filters.</p>
              <p class="note">Personalization: light.</p>
            </div>
            <div class="pricing-tier">
              <h4>Standard</h4>
              <p class="price">$299</p>
              <p>3–4 dashboards + KPI consistency pass.</p>
              <p class="note">Personalization: moderate revisions.</p>
            </div>
            <div class="pricing-tier premium">
              <h4>Premium</h4>
              <p class="price">$599</p>
              <p>Advanced modeling, drill-downs, and refined UX.</p>
              <p class="note">Best for complex reporting needs.</p>
            </div>
          </div>
        </div>
      `
    },
    consult: {
      title: 'Product Design Consultation',
      html: `
        <div class="svc-section">
          <h3>Process breakdown</h3>
          <ol>
            <li>Review: UX audit and quick heuristics checklist.</li>
            <li>Flow mapping: identify bottlenecks and drop-offs.</li>
            <li>Recommendations: prioritized changes with rationale.</li>
            <li>Next steps: plan and suggested iteration cadence.</li>
          </ol>
        </div>
        <div class="svc-section">
          <h3>Thought process</h3>
          <p>We focus on what changes outcomes. Recommendations are grounded in usability principles, clarity, and reducing cognitive load.</p>
        </div>
        <div class="svc-section">
          <h3>Delivery details</h3>
          <ul>
            <li>Deliverables: audit notes + roadmap document (placeholder).</li>
            <li>Optional: Figma annotations or example screens.</li>
            <li>Deployment: shared PDF/Docs link.</li>
          </ul>
        </div>
        <div class="svc-pricing">
          <h3>Pricing tiers</h3>
          <div class="pricing-grid">
            <div class="pricing-tier">
              <h4>Basic</h4>
              <p class="price">$99</p>
              <p>Quick audit + top 5 recommendations.</p>
              <p class="note">Personalization: light.</p>
            </div>
            <div class="pricing-tier">
              <h4>Standard</h4>
              <p class="price">$199</p>
              <p>Deep audit + prioritized roadmap.</p>
              <p class="note">Personalization: moderate.</p>
            </div>
            <div class="pricing-tier premium">
              <h4>Premium</h4>
              <p class="price">$349</p>
              <p>Roadmap + example wireframes and iterations planning.</p>
              <p class="note">Best for multi-flow products.</p>
            </div>
          </div>
        </div>
      `
    }
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

