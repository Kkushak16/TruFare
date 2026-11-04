(() => {
  const flights = [
    { id: 'indigo', airline: 'IndiGo', code: '6E 6114', color: '#4055a8', depart: '06:15', arrive: '08:25', fare: 6488, student: 5839, saved: 649, mark: '6E' },
    { id: 'airindia', airline: 'Air India', code: 'AI 2957', color: '#d12f46', depart: '09:30', arrive: '11:40', fare: 7214, student: 6492, saved: 722, mark: 'AI' },
    { id: 'akasa', airline: 'Akasa Air', code: 'QP 1409', color: '#f27835', depart: '14:10', arrive: '16:20', fare: 6891, student: 6202, saved: 689, mark: 'QP' }
  ];
  const rupees = value => `₹${value.toLocaleString('en-IN')}`;
  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
  let student = true, selected = flights[0], liked = new Set(), view = 'search', trip = 'Return', navKey = 'book';

  function prepareTyping(element, interval, startDelay) {
    element.setAttribute('aria-label', element.innerText.trim());
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
    const textNodes = [];
    while (walker.nextNode()) textNodes.push(walker.currentNode);
    let index = 0;
    for (const textNode of textNodes) {
      const fragment = document.createDocumentFragment();
      for (const part of textNode.textContent.split(/(\s+)/)) {
        if (/^\s+$/.test(part)) {
          fragment.append(document.createTextNode(part));
          index += part.length;
          continue;
        }
        const word = document.createElement('span');
        word.className = 'hero-word';
        for (const character of part) {
          const letter = document.createElement('span');
          letter.className = 'hero-letter';
          letter.setAttribute('aria-hidden', 'true');
          letter.style.setProperty('--typing-delay', `${startDelay + index++ * interval}ms`);
          letter.textContent = character;
          word.append(letter);
        }
        fragment.append(word);
      }
      textNode.replaceWith(fragment);
    }
  }

  const plane = '<span aria-hidden="true">✈</span>';
  const introVideo = 'https://cdn.21st.dev/assets/mirror/21/21a77eac28eacbb7e142016eefeaa0b4a766619e51113629a3bc6df6af066c0f.mp4';
  const header = () => `<header class="topbar"><div class="nav-inner"><button class="brand" data-view="search" aria-label="TrueFare home"><span class="brand-wing">${plane}</span><span>TrueFare</span></button><nav><button class="${navKey === 'book' ? 'active' : ''}" data-view="search" data-nav="book">Book</button><button class="${navKey === 'manage' ? 'active' : ''}" data-view="results" data-nav="manage">Manage trip</button><button class="${navKey === 'status' ? 'active' : ''}" data-view="results" data-nav="status">Flight status</button></nav><div class="nav-actions"><span class="support">24/7 trip support</span><button class="account" data-view="review">◯&nbsp; Sign in</button></div></div></header>`;
  const footer = `<footer><div><button class="brand" data-view="search"><span class="brand-wing">${plane}</span><span>TrueFare</span></button><p>Demo experience. Sample fares only.</p></div><span>Delhi → Mumbai · 25 Oct 2026</span></footer>`;
  const field = (label, main, sub, extra = '') => `<button class="field ${extra}"><span>${label}</span><strong>${main}</strong><small>${sub}</small>${label === 'Depart' || label === 'Return' ? '<i>▦</i>' : ''}</button>`;

  function searchView() {
    return `<section class="hero"><div class="hero-orbit orbit-one"></div><div class="hero-orbit orbit-two"></div><div class="hero-copy"><div class="eyebrow">✦ &nbsp;Sample journeys, thoughtfully priced</div><h1>Flight tickets to<br><em>Mumbai airport</em></h1><p>Compare clear fares from Delhi to Mumbai, with student savings shown upfront.</p></div><div class="route-art" aria-hidden="true"><span class="city-label city-del">DEL <small>Delhi</small></span><div class="route-line">${plane}</div><span class="city-label city-bom">BOM <small>Mumbai</small></span></div></section><section class="search-wrap"><div class="search-card"><div class="trip-tabs" role="tablist">${['Return', 'One-way', 'Multi-city'].map(t => `<button class="${trip === t ? 'active' : ''}" data-trip="${t}">${trip === t ? '✓ ' : ''}${t}</button>`).join('')}</div><div class="fields-grid">${field('From', 'Delhi', 'DEL · Indira Gandhi International')}${field('To', 'Mumbai', 'BOM · Chhatrapati Shivaji Maharaj')}<button class="swap" aria-label="Swap airports">⇄</button>${field('Depart', '25 Oct 2026', 'Sunday')}${trip === 'Return' ? field('Return', 'Add return', 'Save on round trips', 'muted') : ''}${field('Travellers & cabin', '1 Traveller', 'Economy')}<button class="search-btn" data-view="results">⌕ &nbsp;Search flights</button></div>${trip === 'Multi-city' ? '<div class="info-strip">Multi-city is represented in this demo; search uses the featured Delhi–Mumbai leg.</div>' : ''}</div></section><section class="trust-row"><span>♢ &nbsp;Sample fares, clearly labelled</span><span>▣ &nbsp;Baggage filters included</span><span>✦ &nbsp;Student savings across airlines</span></section><div class="demo-note">TrueFare is a demonstration experience. All fares shown are illustrative samples, not live airline prices.</div>`;
  }

  function resultsView() {
    return `<div class="results-page"><div class="results-head"><div><button class="back-link" data-view="search">← &nbsp;Edit search</button><h1>Delhi to Mumbai</h1><p>Sunday, 25 October · 1 traveller · Economy</p></div><div class="mini-route"><b>DEL</b><span>${plane}</span><b>BOM</b></div></div><div class="student-banner"><div class="student-icon">✦</div><div><strong>Student fares, across every airline</strong><p>Show sample student savings and extra baggage options.</p></div><label class="switch"><input type="checkbox" ${student ? 'checked' : ''} data-student><span></span><b>${student ? 'On' : 'Off'}</b></label></div><button class="mobile-filter">☷ &nbsp;Filters</button><div class="results-layout"><aside><div class="aside-title"><h2>Filter flights</h2></div><button class="clear">Clear all</button>${filter('Stops', ['Direct only  (3)', '1 stop or fewer  (3)'], true)}${filter('Airlines', ['IndiGo', 'Air India', 'Akasa Air'], true)}${filter('Baggage', ['15 kg checked', 'Student extra baggage'])}${filter('Departure time', ['Morning  06:00–12:00', 'Afternoon  12:00–18:00'])}</aside><section class="flight-list"><div class="list-meta"><span><b>3 direct flights</b> · sorted by recommended</span><button>Recommended⌄</button></div>${flights.map((flight, index) => card(flight, index)).join('')}<p class="fare-disclaimer">All fares are sample estimates for this demo and are not live airline prices. Taxes shown at review.</p></section></div></div>`;
  }
  function filter(title, items, checked = false) { return `<div class="filter-group"><h3>${title}<span>⌄</span></h3>${items.map((item, i) => `<label><input type="checkbox" ${checked && i === 0 ? 'checked' : ''}><span>${item}</span></label>`).join('')}</div>`; }
  function card(flight, index) { const price = student ? flight.student : flight.fare; return `<article class="flight-card" style="animation-delay:${index * 90}ms"><div class="flight-main"><div class="airline"><span style="background:${flight.color}">${flight.mark}</span><div><b>${flight.airline}</b><small>${flight.code} · Airbus A320</small></div></div><button class="heart ${liked.has(flight.id) ? 'liked' : ''}" data-like="${flight.id}" aria-label="Save flight">${liked.has(flight.id) ? '♥' : '♡'}</button><div class="timing"><div><strong>${flight.depart}</strong><span>DEL · Delhi</span></div><div class="duration"><small>2h 10m</small><i></i><em>Direct</em></div><div><strong>${flight.arrive}</strong><span>BOM · Mumbai</span></div></div><div class="perks"><span>▣ 15 kg checked</span><span>♢ Flexible options</span></div></div><div class="fare-panel">${student ? '<span class="student-pill">STUDENT FARE</span>' : ''}<small>${student ? 'Student fare' : 'Standard fare'}</small><strong>${rupees(price)}</strong><span>per traveller</span>${student ? `<del>${rupees(flight.fare)}</del><b class="saving">Save ${rupees(flight.saved)}</b>` : '<span class="standard-copy">Standard sample fare</span>'}<button data-select="${flight.id}">Select →</button></div></article>`; }

  function reviewView() { const price = student ? selected.student : selected.fare, tax = Math.round(price * .05), total = price + 399 + tax; return `<div class="review-page"><button class="back-link" data-view="results">← &nbsp;Back to flights</button><div class="review-title"><div><span>FINAL STEP</span><h1>Review your trip</h1><p>Confirm the details below before continuing.</p></div><div class="stepper"><span class="done">1</span><i></i><span>2</span><i></i><span>3</span><small>Flight</small><small>Details</small><small>Payment</small></div></div><div class="review-grid"><div class="review-content"><section class="review-card ticket"><div class="ticket-top"><div class="airline"><span style="background:${selected.color}">${selected.mark}</span><div><b>${selected.airline}</b><small>${selected.code} · Economy</small></div></div><span class="direct-tag">DIRECT</span></div><div class="ticket-route"><div><strong>${selected.depart}</strong><b>Delhi</b><small>DEL · Terminal 2</small></div><div class="route-mid"><small>2h 10m</small>${plane}<span>25 OCT 2026</span></div><div><strong>${selected.arrive}</strong><b>Mumbai</b><small>BOM · Terminal 1</small></div></div><div class="ticket-foot"><span>▦ Sunday, 25 October</span><span>▣ 15 kg checked baggage</span></div></section><section class="review-card traveller"><div class="section-heading"><span>1</span><div><h2>Traveller details</h2><p>Enter details exactly as shown on your government ID.</p></div></div><form id="traveller-form"><div class="input-grid"><label>First name<input required placeholder="e.g. Aarya"></label><label>Last name<input required placeholder="e.g. Mehta"></label><label>Email address<input required type="email" placeholder="aarya@example.com"></label><label>Mobile number<div class="phone"><span>+91</span><input required inputmode="numeric" pattern="[0-9 ]{10,12}" placeholder="98765 43210"></div></label></div></form><div class="safe-note">♢ <div><b>Your details stay private</b><span>This demo does not process a booking or payment.</span></div></div></section></div><aside class="price-card"><h2>Fare summary</h2><div class="price-route"><span>${selected.airline}</span><b>DEL → BOM</b></div><dl><div><dt>${student ? 'Student' : 'Standard'} fare</dt><dd>${rupees(price)}</dd></div><div><dt>Airline charges</dt><dd>${rupees(399)}</dd></div><div><dt>Taxes (sample)</dt><dd>${rupees(tax)}</dd></div>${student ? `<div class="discount"><dt>Student savings</dt><dd>−${rupees(selected.saved)}</dd></div>` : ''}</dl><div class="total"><span>Total</span><strong>${rupees(total)}</strong><small>for 1 traveller</small></div><button type="submit" form="traveller-form">Continue to payment →</button><p>♢ &nbsp;No actual payment is processed</p></aside></div></div>`; }

  function introMarkup() { return `<div class="intro-hero" aria-label="TrueFare introduction"><video class="intro-video" muted playsinline preload="auto" src="${introVideo}"></video><div class="intro-shade"></div><div class="intro-title"><span>Welcome to TrueFare</span></div><div class="intro-tagline"><span>Every flight to your city.</span></div><div class="intro-hint"><span>SCROLL</span><span class="intro-arrow">↓</span></div><div class="intro-progress"><i></i></div><span class="intro-credit">A clearer way to fly</span></div>`; }

  function startIntro() {
    render();
    const app = document.querySelector('.app-shell');
    if (!app) return;
    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;
    app.classList.add('app-shell--intro');
    app.insertAdjacentHTML('afterbegin', introMarkup());
    const intro = app.querySelector('.intro-hero');
    const video = app.querySelector('.intro-video');
    const title = app.querySelector('.intro-title');
    const tagline = app.querySelector('.intro-tagline');
    const hint = app.querySelector('.intro-hint');
    const progressBar = app.querySelector('.intro-progress i');
    if (!intro || !video || !title || !tagline || !hint || !progressBar) return;

    const scrubDistance = 3200;
    let duration = 0, target = 0, current = 0, raf = 0, touchY = 0, done = false, seeking = false, pending = null, lastFrame = 0, lastSeekAt = 0;
    document.body.classList.add('intro-active');
    const setTime = time => { if (seeking) { pending = time; return; } if (Math.abs(video.currentTime - time) < 0.035) return; seeking = true; video.currentTime = time; };
    const onSeeked = () => { seeking = false; if (pending !== null) { const time = pending; pending = null; setTime(time); } };
    const onLoaded = () => { duration = video.duration || 0; setTime(duration * current); };
    const addDelta = delta => { if (done || !Number.isFinite(delta)) return; target = clamp(target + delta / scrubDistance, 0, 1); };
    const onWheel = event => { event.preventDefault(); addDelta(event.deltaY); };
    const onTouchStart = event => { touchY = event.touches[0]?.clientY || 0; };
    const onTouchMove = event => { if(event.cancelable) event.preventDefault(); const y = event.touches[0]?.clientY || touchY; addDelta(touchY - y); touchY = y; };
    const removeScrollListeners = () => { window.removeEventListener('wheel', onWheel); window.removeEventListener('touchstart', onTouchStart); window.removeEventListener('touchmove', onTouchMove); };
    const revealHomepage = async () => {
      const brand = app.querySelector('.topbar .brand');
      const destination = brand.getBoundingClientRect();
      const start = {
        left: (window.innerWidth - destination.width) / 2,
        top: (window.innerHeight - destination.height) / 2
      };
      brand.style.position = 'fixed';
      brand.style.left = `${start.left}px`;
      brand.style.top = `${start.top}px`;
      brand.style.width = `${destination.width}px`;
      brand.style.height = `${destination.height}px`;
      brand.style.margin = '0';
      brand.style.zIndex = '130';
      brand.style.transformOrigin = 'center';
      brand.style.color = 'var(--navy)';
      brand.classList.add('intro-morphing');
      await new Promise(resolve => requestAnimationFrame(resolve));
      const popIn = brand.animate([
        { opacity: 0, transform: 'scale(.88)' },
        { opacity: 1, transform: 'scale(1.35)' }
      ], { duration: 620, easing: 'cubic-bezier(.22,1,.36,1)', fill: 'forwards' });
      await popIn.finished;
      brand.style.opacity = '1';
      brand.style.transform = 'scale(1.35)';
      popIn.cancel();

      app.classList.add('is-forming');
      intro.classList.add('intro-home-reveal');
      const travelX = destination.left - start.left;
      const travelY = destination.top - start.top;
      const travel = brand.animate([
        { transform: 'scale(1.35)' },
        { transform: `translate3d(${travelX}px,${travelY}px,0) scale(1)` }
      ], { duration: 1250, easing: 'cubic-bezier(.22,1,.36,1)', fill: 'forwards' });
      await travel.finished;
      brand.style.left = `${destination.left}px`;
      brand.style.top = `${destination.top}px`;
      brand.style.transform = 'none';
      travel.cancel();

      await new Promise(resolve => setTimeout(resolve, 1500));
      prepareTyping(app.querySelector('.hero-copy h1'), 28, 500);
      prepareTyping(app.querySelector('.hero-copy p'), 14, 1350);
      brand.style.removeProperty('color');
      app.classList.add('is-revealing');
      await new Promise(resolve => setTimeout(resolve, 950));

      brand.classList.remove('intro-morphing');
      brand.removeAttribute('style');
      intro.remove();
      await new Promise(resolve => setTimeout(resolve, 2800));
      app.classList.remove('app-shell--intro', 'is-forming', 'is-revealing');
      document.body.classList.remove('intro-active');
    };
    const finish = () => {
      if (done) return;
      done = true;
      removeScrollListeners();
      cancelAnimationFrame(raf);
      video.pause();
      progressBar.style.transform = 'scaleX(1)';
      title.style.transition = 'opacity .4s ease';
      tagline.style.transition = 'opacity .4s ease';
      title.style.opacity = '0';
      tagline.style.opacity = '0';
      intro.classList.add('intro-white');
      setTimeout(() => { void revealHomepage(); }, 500);
    };
    const frame = timestamp => {
      const delta = lastFrame ? timestamp - lastFrame : 16.67;
      lastFrame = timestamp;
      current += (target - current) * (1 - Math.exp(-delta / 100));
      if (duration && timestamp - lastSeekAt >= 50) { lastSeekAt = timestamp; setTime(current * duration); }
      const titleT = 1 - clamp(current / .35, 0, 1);
      const taglineT = clamp((current - .78) / .22, 0, 1);
      title.style.opacity = titleT;
      title.style.transform = `translateY(${(1 - titleT) * -24}px) scale(${.96 + titleT * .04})`;
      tagline.style.opacity = taglineT;
      tagline.style.transform = `translateY(${(1 - taglineT) * 20}px) scale(${.97 + taglineT * .03})`;
      hint.style.opacity = current > .002 ? '0' : '1';
      progressBar.style.transform = `scaleX(${current})`;
      if (target >= 1 && current > .995) finish();
      else raf = requestAnimationFrame(frame);
    };
    video.addEventListener('loadedmetadata', onLoaded); video.addEventListener('seeked', onSeeked); video.addEventListener('error', () => { duration = 0; }); window.addEventListener('wheel', onWheel, { passive: false }); window.addEventListener('touchstart', onTouchStart, { passive: true }); window.addEventListener('touchmove', onTouchMove, { passive: false });
    raf = requestAnimationFrame(frame);
  }

  function render() { document.querySelector('.app-shell').innerHTML = header() + (view === 'search' ? searchView() : view === 'results' ? resultsView() : reviewView()) + footer; window.scrollTo({ top: 0, behavior: 'smooth' }); }
  document.addEventListener('click', event => { const filterButton = event.target.closest('.mobile-filter'); if (filterButton) { document.querySelector('.results-layout aside')?.classList.toggle('open'); return; } const target = event.target.closest('[data-view], [data-trip], [data-select], [data-like]'); if (!target) return; if (target.dataset.view) { view = target.dataset.view; if (target.dataset.nav) navKey = target.dataset.nav; else if (view === 'search') navKey = 'book'; render(); } if (target.dataset.trip) { trip = target.dataset.trip; render(); } if (target.dataset.select) { selected = flights.find(f => f.id === target.dataset.select); view = 'review'; render(); } if (target.dataset.like) { liked.has(target.dataset.like) ? liked.delete(target.dataset.like) : liked.add(target.dataset.like); render(); } });
  document.addEventListener('change', event => { if (event.target.matches('[data-student]')) { student = event.target.checked; render(); } });
  document.addEventListener('submit', event => { if (event.target.id !== 'traveller-form') return; event.preventDefault(); const note = document.createElement('div'); note.className = 'confirmation'; note.setAttribute('role', 'status'); note.innerHTML = '<span>✓</span><div><h2>You’re ready for take-off</h2><p>Demo confirmed — no booking was created and no payment was processed.</p></div>'; event.target.closest('.review-page').append(note); note.scrollIntoView({ behavior: 'smooth', block: 'center' }); });
  startIntro();
})();
