// Fire effect for skull eyes and nose
const fireCanvas = document.getElementById('fireCanvas');
if (fireCanvas) {
	const ctx = fireCanvas.getContext('2d');
	const container = fireCanvas.parentElement;

	function resizeCanvas() {
		fireCanvas.width = container.offsetWidth;
		fireCanvas.height = container.offsetHeight;
	}
	resizeCanvas();
	window.addEventListener('resize', resizeCanvas);

	const particles = [];
	const particleCount = 150;

	class FireParticle {
		constructor() { this.reset(); }
		reset() {
			const area = Math.random();
			if (area < 0.4) {
				this.x = fireCanvas.width * (0.30 + Math.random() * 0.12);
				this.y = fireCanvas.height * (0.55 + Math.random() * 0.15);
			} else if (area < 0.8) {
				this.x = fireCanvas.width * (0.55 + Math.random() * 0.12);
				this.y = fireCanvas.height * (0.55 + Math.random() * 0.15);
			} else {
				this.x = fireCanvas.width * (0.42 + Math.random() * 0.13);
				this.y = fireCanvas.height * (0.75 + Math.random() * 0.1);
			}
			this.baseY = this.y;
			this.vy = -0.3 - Math.random() * 0.8;
			this.vx = (Math.random() - 0.5) * 0.3;
			this.life = 1;
			this.decay = 0.004 + Math.random() * 0.008;
			this.size = 5 + Math.random() * 6;
		}
		update() {
			this.y += this.vy;
			this.x += this.vx;
			this.life -= this.decay;
			if (this.life <= 0 || this.y < this.baseY - 60) this.reset();
		}
		draw() {
			const alpha = this.life;
			const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
			if (this.life > 0.6) {
				gradient.addColorStop(0, `rgba(255, 255, 100, ${alpha})`);
				gradient.addColorStop(0.5, `rgba(255, 150, 0, ${alpha * 0.8})`);
				gradient.addColorStop(1, `rgba(255, 100, 0, ${alpha * 0.3})`);
			} else {
				gradient.addColorStop(0, `rgba(255, 150, 0, ${alpha})`);
				gradient.addColorStop(0.5, `rgba(255, 80, 0, ${alpha * 0.8})`);
				gradient.addColorStop(1, `rgba(200, 0, 0, ${alpha * 0.3})`);
			}
			ctx.fillStyle = gradient;
			ctx.beginPath();
			ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
			ctx.fill();
		}
	}
	for (let i = 0; i < particleCount; i++) particles.push(new FireParticle());
	function animate() {
		ctx.clearRect(0, 0, fireCanvas.width, fireCanvas.height);
		particles.forEach(p => { p.update(); p.draw(); });
		requestAnimationFrame(animate);
	}
	animate();
}

// Detect legacy iOS (e.g. iPhone7 on iOS 15.8.5) or data-saver to reduce heavy effects
function __cook14u_isLegacyIOS() {
	try {
		const ua = navigator.userAgent || '';
		// match iPhone/iPad/iPod OS like: OS 15_8_5
		const m = ua.match(/OS (\d+)_?(\d+)?_?(\d+)?/);
		const isiOS = /iP(hone|od|ad)/.test(ua);
		if (!isiOS || !m) return false;
		const major = parseInt(m[1] || '0', 10);
		const minor = parseInt(m[2] || '0', 10);
		const patch = parseInt(m[3] || '0', 10);
		// If major < 15 treat as legacy; if exactly 15, consider 15.8.5 and below legacy
		if (major < 15) return true;
		if (major > 15) return false;
		// major === 15
		if (minor < 8) return true;
		if (minor === 8 && patch <= 5) return true;
		return false;
	} catch (e) { return false; }
}

/* ------------------ Internationalization (i18n) ------------------ */
// Simple runtime that reads `window.__cook14u_translations` from lang.js
function __cook14u_getCurrentLang() {
	return window.__cook14u_lang || localStorage.getItem('cook14u_lang') || 'en';
}
function __cook14u_setLang(lang) {
	window.__cook14u_lang = lang;
	localStorage.setItem('cook14u_lang', lang);
	applyTranslations(lang);
}
function t(key, fallback) {
	const lang = __cook14u_getCurrentLang();
	const dict = window.__cook14u_translations && window.__cook14u_translations[lang];
	return (dict && dict[key]) || fallback || '';
}

function applyTranslations(lang) {
	try {
		// nav links
		const navHome = document.querySelector('.navbar-links a[href="#home"]');
		const navContent = document.querySelector('.navbar-links a[href="#content"]');
		const navAbout = document.querySelector('.navbar-links a[href="#about"]');
		const navCommunity = document.querySelector('.navbar-links a[href="#community"]');
		const navMerch = document.querySelector('.navbar-links a[href="#merch"]');
		if (navHome) navHome.textContent = t('nav_home', navHome.textContent);
		if (navContent) navContent.textContent = t('nav_content', navContent.textContent);
		if (navAbout) navAbout.textContent = t('nav_about', navAbout.textContent);
		if (navCommunity) navCommunity.textContent = t('nav_community', navCommunity.textContent);
		if (navMerch) navMerch.textContent = t('nav_merch', navMerch.textContent);

		// language toggle button
		const langBtn = document.getElementById('lang-toggle');
		if (langBtn) { langBtn.textContent = t('lang_label', langBtn.textContent); langBtn.title = t('lang_title', langBtn.title); }

		// demo button (hidden/removed in HTML) — no-op (kept for backward compatibility)

		// live indicator titles will be set dynamically via setLive (function uses t())

		// setup button
		const setupBtn = document.getElementById('open-setup');
		if (setupBtn) setupBtn.textContent = t('open_setup', setupBtn.textContent);

		// home subtext — prefer HTML variant (allows <br>) if available
		const homeSub = document.querySelector('.home-subtext');
		if (homeSub) {
			const html = t('home_subtext_html');
			if (html && html.length) homeSub.innerHTML = html; else homeSub.textContent = t('home_subtext', homeSub.textContent);
		}

		// content option labels and subtexts
		const twitchMain = document.querySelector('.option[data-type="twitch"] .label .main');
		const twitchSub = document.querySelector('.option[data-type="twitch"] .label .sub');
		if (twitchMain) twitchMain.textContent = t('option_twitch_main', twitchMain.textContent);
		if (twitchSub) twitchSub.textContent = t('option_twitch_sub', twitchSub.textContent);
		const ytMain = document.querySelector('.option[data-type="youtube"] .label .main');
		const ytSub = document.querySelector('.option[data-type="youtube"] .label .sub');
		if (ytMain) ytMain.textContent = t('option_youtube_main', ytMain.textContent);
		if (ytSub) ytSub.textContent = t('option_youtube_sub', ytSub.textContent);
		const igMain = document.querySelector('.option[data-type="instagram"] .label .main');
		const igSub = document.querySelector('.option[data-type="instagram"] .label .sub');
		if (igMain) igMain.textContent = t('option_instagram_main', igMain.textContent);
		if (igSub) igSub.textContent = t('option_instagram_sub', igSub.textContent);
		const ttMain = document.querySelector('.option[data-type="rumble"] .label .main');
		const ttSub = document.querySelector('.option[data-type="rumble"] .label .sub');
		if (ttMain) ttMain.textContent = t('option_rumble_main', ttMain.textContent);
		if (ttSub) ttSub.textContent = t('option_rumble_sub', ttSub.textContent);

		// content-links button
		const linkBtn = document.getElementById('content-link-btn');
		if (linkBtn) { linkBtn.textContent = t('content_link_open', linkBtn.textContent); }

		// modal/setup title
		const wzTitle = document.getElementById('wz-modal-title');
		if (wzTitle) wzTitle.textContent = t('modal_setup_title', wzTitle.textContent);

		// About paragraph (HTML) - preserve links by using innerHTML from translations
		const aboutPara = document.querySelector('#about .about-card p');
		if (aboutPara) {
			const html = t('about_paragraph_html');
			if (html && html.length) aboutPara.innerHTML = html;
		}

		// Setup modal labels (strong elements inside the specs lists)
		try {
			const setupStrongs = document.querySelectorAll('#wz-modal .specs strong');
			if (setupStrongs && setupStrongs.length >= 6) {
				setupStrongs[0].textContent = t('setup_gaming', setupStrongs[0].textContent);
				setupStrongs[1].textContent = t('setup_monitor', setupStrongs[1].textContent);
				setupStrongs[2].textContent = t('setup_audio', setupStrongs[2].textContent);
				setupStrongs[3].textContent = t('setup_streaming', setupStrongs[3].textContent);
				setupStrongs[4].textContent = t('setup_mic', setupStrongs[4].textContent);
				setupStrongs[5].textContent = t('setup_camera', setupStrongs[5].textContent);
			}
		} catch (e) { /* non-fatal */ }

		// translate modal close button aria-label
		const closeWz = document.getElementById('close-wz-modal');
		if (closeWz) closeWz.setAttribute('aria-label', t('close_label', closeWz.getAttribute('aria-label') || 'Close'));

		// footer
		// Keep footer HTML intact (contains the author link). Do not overwrite it via translations
		// const footer = document.querySelector('.site-footer .footer-inner');
		// if (footer) footer.textContent = t('footer_credit', footer.textContent);

		// section titles (map to nav labels where appropriate)
		const secContent = document.querySelector('#content .section-title'); if (secContent) secContent.textContent = t('section_content', secContent.textContent);
		const secAbout = document.querySelector('#about .section-title'); if (secAbout) secAbout.textContent = t('section_about', secAbout.textContent);
		const secCommunity = document.querySelector('#community .section-title'); if (secCommunity) secCommunity.textContent = t('section_community', secCommunity.textContent);
		const secMerch = document.querySelector('#merch .section-title'); if (secMerch) secMerch.textContent = t('section_merch', secMerch.textContent);

		// community panel heading
		const communityJoin = document.querySelector('.community-frame .frame-header h3'); if (communityJoin) communityJoin.textContent = t('join_cook14u', communityJoin.textContent);

		// side-tab button titles (desktop)
		const codBtn = document.getElementById('codmunity-button'); if (codBtn) codBtn.title = t('codmunity_btn', codBtn.title);
		const wzBtn = document.getElementById('wzmeta-button'); if (wzBtn) wzBtn.title = t('wzmeta_btn', wzBtn.title);
		const toolsBtn = document.getElementById('tools-button'); if (toolsBtn) toolsBtn.title = t('tools_btn', toolsBtn.title);

		// mobile-side-tabs titles
		document.querySelectorAll('.mobile-side-tabs .mobile-tab').forEach(btn => {
			const target = btn.dataset.target;
			if (!target) return;
			if (target === 'codmunity-button') btn.title = t('codmunity_btn', btn.title);
			if (target === 'wzmeta-button') btn.title = t('wzmeta_btn', btn.title);
			if (target === 'tools-button') btn.title = t('tools_btn', btn.title);
		});

		// modal/app titles
		const wzMeta = document.querySelector('#wzmeta-modal h2'); if (wzMeta) wzMeta.textContent = t('wzmeta_title', wzMeta.textContent);
		const codTracker = document.querySelector('#codtracker-modal h2'); if (codTracker) codTracker.textContent = t('codtracker_title', codTracker.textContent);
		const codmunity = document.querySelector('#codmunity-modal h2'); if (codmunity) codmunity.textContent = t('codmunity_title', codmunity.textContent);

		// translate some title/tooltips
		const liveBtn = document.getElementById('live-indicator');
		if (liveBtn) liveBtn.title = (liveBtn.classList.contains('is-live') ? t('live_online_title') : t('live_offline_title')) || liveBtn.title;

	} catch (err) { console.warn('applyTranslations error', err); }
}

// Ensure translations applied on load
document.addEventListener('DOMContentLoaded', function(){
	// set the initial language (reads localStorage)
	const lang = __cook14u_getCurrentLang();
	applyTranslations(lang);
		// wire up the language toggle
	const langToggle = document.getElementById('lang-toggle');
	if (langToggle) {
		langToggle.addEventListener('click', function(){
			const cur = __cook14u_getCurrentLang();
			const next = cur === 'en' ? 'es' : 'en';
			__cook14u_setLang(next);
				// demo button removed — no UI to update
		});
	}
});


// global low-power mode flag used across scripts
window.__cook14u_lowPowerMode = (__cook14u_isLegacyIOS() || (navigator.connection && navigator.connection.saveData));
if (window.__cook14u_lowPowerMode) console.info('Cook14U: lowPowerMode enabled — reducing effects for older iOS / data-saver');

// Hamburger menu toggle
const hamburger = document.getElementById('hamburger-menu');
const navLinks = document.querySelector('.navbar-links');
if (hamburger) {
	hamburger.addEventListener('click', function() { this.classList.toggle('is-active'); navLinks.classList.toggle('active'); });
	document.querySelectorAll('.navbar-links a').forEach(link => {
		link.addEventListener('click', function() { hamburger.classList.remove('is-active'); navLinks.classList.remove('active'); });
	});
}

// Warzone-style setup modal open/close
const openSetupBtn = document.getElementById('open-setup');
const wzModal = document.getElementById('wz-modal');
const closeWzBtn = document.getElementById('close-wz-modal');
function openWzModal() {
	if (!wzModal) return; wzModal.classList.add('open'); wzModal.setAttribute('aria-hidden', 'false'); if (closeWzBtn) closeWzBtn.focus();
	try {
		const media = wzModal.querySelector('.media');
		if (media) {
			const img = media.querySelector('img');
			if (img && img.src) media.style.backgroundImage = `url('${img.src}')`;
			media.classList.add('glitch');
		}
	} catch (err) { console.warn('Could not enable glitch effect', err); }
}
function closeWzModal() {
	if (!wzModal) return; wzModal.classList.remove('open'); wzModal.setAttribute('aria-hidden', 'true'); if (openSetupBtn) openSetupBtn.focus();
	try { const media = wzModal.querySelector('.media'); if (media) { media.classList.remove('glitch'); media.style.backgroundImage = ''; } } catch (err) { }
}
if (openSetupBtn) openSetupBtn.addEventListener('click', openWzModal);
if (closeWzBtn) closeWzBtn.addEventListener('click', closeWzModal);
if (wzModal) wzModal.addEventListener('click', (e) => { if (e.target === wzModal) closeWzModal(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && wzModal && wzModal.classList.contains('open')) closeWzModal(); });

// Apply VFX effect to the modal setup image only
(function applyModalVFX() {
	const selector = '#wz-modal .media img';
	function tryInit() {
		const img = document.querySelector(selector); if (!img) return;
		import('https://esm.sh/@vfx-js/core@0.8.0').then(mod => {
			const VFX = mod.VFX || mod.default && mod.default.VFX || mod.default;
			const shader2 = `precision highp float;
uniform sampler2D src;
uniform vec2 offset;
uniform vec2 resolution;
uniform float time;
uniform float id;
out vec4 outColor;

vec4 readTex(vec2 uv) {
  vec4 c = texture(src, uv);
  c.a *= smoothstep(.5, .499, abs(uv.x - .5)) * smoothstep(.5, .499, abs(uv.y - .5));
  return c;
}

float rand(vec2 p) { return fract(sin(dot(p, vec2(829., 483.))) * 394.); }
float rand(vec3 p) { return fract(sin(dot(p, vec3(829., 4839., 432.))) * 39428.); }

vec2 dist(vec2 uv, float f) {
  float t = time + id;
  uv += sin(uv.y * 12. + t * 1.7) * sin(uv.y * 17. + t * 2.3) * f;
  return uv;
}

void main() {
  vec2 uv = (gl_FragCoord.xy - offset) / resolution;
  vec2 uvr = uv, uvg = uv, uvb = uv;

  float r = rand(vec2(floor(time * 43.), id));
  if (r > 0.8) {
	float y = sin(floor(uv.y / 0.07)) + sin(floor(uv.y / 0.003 + time));
	float f = rand(vec2(y, floor(time * 5.0) + id)) * 2. - 1.;
	uvr.x += f * 0.006;
	uvg.x += f * 0.012;
	uvb.x += f * 0.018;
  }

  vec4 cr = readTex(uvr);
  vec4 cg = readTex(uvg);
  vec4 cb = readTex(uvb);
  vec4 original = readTex(uv);
  vec4 effectColor = vec4(cr.r, cg.g, cb.b, (cr.a + cg.a + cb.a) / 1.);
  outColor = mix(original, effectColor, 0.32);
}
`;
			try { const vfx = new VFX({ postEffect: { shader: shader2 } }); vfx.add(img, { shader: shader2, uniforms: { id: 1 } }); }
			catch (err) { console.warn('VFX init failed', err); }
		}).catch(err => { console.warn('Failed to load VFX module', err); });
	}
	const observer = new MutationObserver(() => { if (document.querySelector(selector)) { tryInit(); observer.disconnect(); } });
	observer.observe(document.body, { childList: true, subtree: true });
	tryInit();
})();

// Additional side-tab modal handlers (CODmunity, WZ Meta, COD Tracker)
document.addEventListener('DOMContentLoaded', function() {
	const codmunityBtn = document.getElementById('codmunity-button');
	const codmunityModal = document.getElementById('codmunity-modal');
	const closeCodmunity = document.getElementById('close-codmunity');
	if (codmunityBtn && codmunityModal && closeCodmunity) {
		codmunityBtn.addEventListener('click', function(e) { e.stopPropagation(); codmunityModal.classList.add('active'); codmunityModal.setAttribute('aria-hidden','false'); });
		closeCodmunity.addEventListener('click', function() { codmunityModal.classList.remove('active'); codmunityModal.setAttribute('aria-hidden','true'); });
		codmunityModal.addEventListener('click', function(e) { if (e.target === codmunityModal) codmunityModal.classList.remove('active'); });
	}
	const wzmetaBtn = document.getElementById('wzmeta-button');
	const wzmetaModal = document.getElementById('wzmeta-modal');
	const closeWzmeta = document.getElementById('close-wzmeta');
	if (wzmetaBtn && wzmetaModal && closeWzmeta) {
		wzmetaBtn.addEventListener('click', function(e) { e.stopPropagation(); wzmetaModal.classList.add('active'); wzmetaModal.setAttribute('aria-hidden','false'); });
		closeWzmeta.addEventListener('click', function() { wzmetaModal.classList.remove('active'); wzmetaModal.setAttribute('aria-hidden','true'); });
		wzmetaModal.addEventListener('click', function(e) { if (e.target === wzmetaModal) wzmetaModal.classList.remove('active'); });
	}
	const toolsBtn = document.getElementById('tools-button');
	const codModal = document.getElementById('codtracker-modal');
	const closeCodModal = document.getElementById('close-codtracker');
	if (toolsBtn && codModal && closeCodModal) {
		toolsBtn.addEventListener('click', function(e) { e.stopPropagation(); codModal.classList.add('active'); codModal.setAttribute('aria-hidden','false'); });
		closeCodModal.addEventListener('click', function() { codModal.classList.remove('active'); codModal.setAttribute('aria-hidden','true'); });
		codModal.addEventListener('click', function(e) { if (e.target === codModal) codModal.classList.remove('active'); });
	}
});

// Mobile-side-tabs: forward clicks to the corresponding desktop side-tab buttons
document.addEventListener('DOMContentLoaded', function() {
	const mobileTabs = document.querySelectorAll('.mobile-side-tabs .mobile-tab');
	mobileTabs.forEach(btn => { btn.addEventListener('click', function(e) { const targetId = this.dataset.target; if (!targetId) return; const desktopBtn = document.getElementById(targetId); if (desktopBtn) desktopBtn.click(); }); });
});

// FAB toggles mobile-side-tabs with sequential animation
(function mobileWzFab() {
	const fab = document.getElementById('wz-fab');
	const tabs = document.querySelector('.mobile-side-tabs');
	if (!fab || !tabs) return;
	function open() { tabs.classList.add('open'); fab.classList.add('open'); fab.setAttribute('aria-expanded','true'); document.body.classList.add('wz-fab-open'); }
	function close() { tabs.classList.remove('open'); fab.classList.remove('open'); fab.setAttribute('aria-expanded','false'); document.body.classList.remove('wz-fab-open'); }
	fab.addEventListener('click', function(e) { e.stopPropagation(); const isOpen = tabs.classList.contains('open'); if (isOpen) close(); else open(); });
	document.addEventListener('click', function(e) { if (!tabs.classList.contains('open')) return; const insideFab = e.target.closest('#wz-fab'); const insideTabs = e.target.closest('.mobile-side-tabs'); if (!insideFab && !insideTabs) close(); });
	tabs.addEventListener('click', function(e) { const tabBtn = e.target.closest('.mobile-tab'); if (!tabBtn) return; setTimeout(close, 220); });
	const mq = window.matchMedia('(min-width: 901px)');
	function handleDesktop(e) { if (e.matches) { tabs.classList.remove('open'); fab.classList.remove('open'); document.body.classList.remove('wz-fab-open'); } }
	if (mq.addEventListener) mq.addEventListener('change', handleDesktop); else if (mq.addListener) mq.addListener(handleDesktop);
})();

// Close any app modal on Escape (modal uses `.active`)
document.addEventListener('keydown', function(e) { if (e.key !== 'Escape') return; document.querySelectorAll('.modal.active').forEach(m => { m.classList.remove('active'); m.setAttribute('aria-hidden','true'); }); });

function ensureThree(callback) { if (typeof THREE !== 'undefined') return callback(); const s = document.createElement('script'); s.src = 'https://cdn.jsdelivr.net/npm/three@0.152.0/build/three.min.js'; s.onload = callback; s.onerror = function() { console.warn('Failed to load Three.js for smoke effect'); }; document.head.appendChild(s); }

ensureThree(function initGreenSmoke() {
	// If low-power mode (older iOS or save-data), skip heavy smoke effect
	if (window.__cook14u_lowPowerMode) { console.info('Skipping green smoke for low-power device'); return; }
	let camera, scene, renderer, clock, smokeParticles = [], smokeMaterial;
	const overlay = document.querySelector('.home-overlay');
	const photoBg = overlay ? overlay.querySelector('.home-photo-bg') : null;
	if (!overlay || !photoBg) { console.warn('home-overlay or home-photo-bg not found for smoke placement'); return; }
	let stats = null;
	if (typeof Stats !== 'undefined') {
		try { stats = new Stats(); stats.showPanel && stats.showPanel(0); stats.domElement.style.position = 'absolute'; stats.domElement.style.left = '0px'; stats.domElement.style.top = '0px'; document.body.appendChild(stats.domElement); } catch (e) { stats = null; }
	} else { stats = { begin: function() {}, end: function() {} }; }
	clock = new THREE.Clock();
	renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.domElement.className = 'home-smoke-canvas';
	renderer.domElement.style.position = 'absolute'; renderer.domElement.style.left = '0'; renderer.domElement.style.top = '0'; renderer.domElement.style.width = '100%'; renderer.domElement.style.height = '100%'; renderer.domElement.style.pointerEvents = 'none';
	overlay.insertBefore(renderer.domElement, overlay.querySelector('.logo-fire-container'));
	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000); camera.position.z = 1000; scene.add(camera);
	const light = new THREE.DirectionalLight(0xffffff, 0.5); light.position.set(-1, 0, 1); scene.add(light);
	const SMOKE_IMG_URL = 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/95637/Smoke-Element.png';
	const smokeCanvasLocal = document.createElement('canvas'); smokeCanvasLocal.width = 512; smokeCanvasLocal.height = 512; const sctx = smokeCanvasLocal.getContext('2d'); const cx = 256, cy = 256, r = 220; const g = sctx.createRadialGradient(cx, cy, 10, cx, cy, r); g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(0.25, 'rgba(200,255,200,0.9)'); g.addColorStop(0.5, 'rgba(120,220,150,0.6)'); g.addColorStop(1, 'rgba(0,0,0,0)'); sctx.fillStyle = g; sctx.fillRect(0, 0, 512, 512);
	const smokeTextureLocal = new THREE.CanvasTexture(smokeCanvasLocal); smokeTextureLocal.needsUpdate = true;
	smokeMaterial = new THREE.MeshLambertMaterial({ map: smokeTextureLocal, transparent: true, opacity: 0.22, depthWrite: false, blending: THREE.NormalBlending, color: new THREE.Color(0x009b27) });
	try { const loader = new THREE.TextureLoader(); loader.setCrossOrigin('anonymous'); loader.load(SMOKE_IMG_URL, function(tex) { tex.needsUpdate = true; smokeMaterial.map = tex; smokeMaterial.needsUpdate = true; console.log('Smoke texture loaded from CodePen URL'); }, undefined, function(err) { console.warn('Failed to load external smoke image, using fallback texture', err); }); } catch (err) { console.warn('TextureLoader not available or failed, using local smoke texture', err); }
	const smokeGeo = new THREE.PlaneGeometry(300, 300);
	const PARTICLE_COUNT = window.__cook14u_lowPowerMode ? 18 : 90;
	const w = overlay.clientWidth || window.innerWidth;
	const h = overlay.clientHeight || window.innerHeight;
	// tighten radii and margins so smoke stays well within the visible area
	const maxRadius = Math.max(w, h) * 0.55;
	const minRadius = Math.min(w, h) * 0.35;
	const EDGE_MARGIN = Math.max(48, Math.min(w, h) * 0.10);
	const maxAllowedY = Math.max(0, (h / 2) - EDGE_MARGIN);
	const maxAllowedX = Math.max(0, (w / 2) - EDGE_MARGIN);
	// reduce vertical offset so particles are less likely to spawn below the viewport
	const verticalOffset = Math.max(0, h * 0.14);
	function clamp(val, a, b) { return Math.max(a, Math.min(b, val)); }
	for (let p = 0; p < PARTICLE_COUNT; p++) {
		const particle = new THREE.Mesh(smokeGeo, smokeMaterial);
		const angle = Math.random() * Math.PI * 2;
		const radius = minRadius + Math.random() * (maxRadius - minRadius);
		const rx = radius * (w / Math.max(w, h));
		const ry = radius * (h / Math.max(w, h));
		const rawX = Math.cos(angle) * rx;
		const rawY = Math.sin(angle) * ry;
		let posX = clamp(rawX, -maxAllowedX, maxAllowedX);
		let posY = clamp(rawY + verticalOffset, -maxAllowedY, maxAllowedY);
		// extra safety: nudge any particle that ended up exactly on the bottom clamp slightly up
		if (posY >= maxAllowedY - 0.5) posY = maxAllowedY - Math.max(8, EDGE_MARGIN * 0.2);
		particle.position.set(posX, posY, Math.random() * 800 - 400);
		particle.rotation.z = Math.random() * Math.PI * 2;
		let radialFactor = (radius - minRadius) / (maxRadius - minRadius);
		radialFactor = Math.max(0, Math.min(1, radialFactor));
		const shaped = Math.pow(radialFactor, 1.8);
		particle.material.opacity = 0.02 + shaped * 0.38;
		particle.scale.setScalar(0.6 + shaped * (1.6 + Math.random() * 0.8));
		scene.add(particle);
		smokeParticles.push(particle);
	}
	function onWindowResize() { const w = overlay.clientWidth || window.innerWidth; const h = overlay.clientHeight || window.innerHeight; camera.aspect = w / h; camera.updateProjectionMatrix(); renderer.setSize(w, h); }
	window.addEventListener('resize', onWindowResize); onWindowResize();
	let delta = 0;
	function evolveSmoke() { const sp = smokeParticles.length; for (let i = 0; i < sp; i++) { smokeParticles[i].rotation.z += delta * 0.18; const driftX = Math.sin((i + performance.now() * 0.00014)) * 0.045; const driftY = Math.cos((i + performance.now() * 0.00016)) * 0.03; let nx = smokeParticles[i].position.x + driftX; let ny = smokeParticles[i].position.y + driftY; nx = clamp(nx, -maxAllowedX, maxAllowedX); ny = clamp(ny, -maxAllowedY, maxAllowedY); smokeParticles[i].position.x = nx; smokeParticles[i].position.y = ny; smokeParticles[i].position.z += Math.sin((i + (performance.now() * 0.00028))) * 0.16; } }
	function render() { renderer.render(scene, camera); }
	function animate() { stats && stats.begin && stats.begin(); delta = clock.getDelta(); requestAnimationFrame(animate); evolveSmoke(); render(); stats && stats.end && stats.end(); }
	animate();
});
(function contentEmbeds() {
	// Instagram-like slideshow (loads local images from `assets/insta` via manifest.json)
	const instaFrame = document.querySelector('.insta-slideshow');
	if (!instaFrame) return;

	let images = [];
	const imageEl = instaFrame.querySelector('.insta-image');
	const prevBtn = instaFrame.querySelector('.insta-prev');
	const nextBtn = instaFrame.querySelector('.insta-next');
	let idx = 0;
	let timer = null;

	function show(i) {
		if (!images || images.length === 0) return;
		idx = (i + images.length) % images.length;
		const url = images[idx];

		// create a new image element for smooth crossfade
		const newImg = document.createElement('img');
		newImg.className = 'insta-img';
		newImg.src = url;
		newImg.alt = 'Instagram image';
		newImg.decoding = 'async';
		newImg.style.opacity = '0';

		// Ensure overlay (non-navigating) exists and is above images.
		// Use a div with role=button so clicks advance the slideshow instead of opening the image.
		let overlay = imageEl.querySelector('.insta-post-link.full-link');
		if (!overlay) {
			overlay = document.createElement('div');
			overlay.className = 'insta-post-link full-link';
			overlay.setAttribute('role', 'button');
			overlay.tabIndex = 0;
			// on click advance to next image (do not open the image in a new tab)
			overlay.addEventListener('click', function(e) { e.stopPropagation(); e.preventDefault(); try { next(); } catch(err) {} resetTimer(); });
			// keyboard accessibility: Enter / Space to trigger next
			overlay.addEventListener('keydown', function(e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.stopPropagation(); try { next(); } catch(err) {} resetTimer(); } });
			imageEl.appendChild(overlay);
		}

		// Append the new image below the overlay (images have z-index:1, overlay z-index:2)
		imageEl.appendChild(newImg);

		// Once image loads, fade it in and remove the previous image after transition
		const safeFadeIn = () => {
			// force reflow
			void newImg.offsetWidth;
			newImg.style.opacity = '1';

			// find previous images (exclude the new one) and fade them out then remove
			const oldImages = Array.from(imageEl.querySelectorAll('img.insta-img')).filter(img => img !== newImg);
			oldImages.forEach(oldImg => {
				oldImg.style.opacity = '0';
				// remove after transition ends
				const onEnd = (e) => { if (e.propertyName === 'opacity') { oldImg.removeEventListener('transitionend', onEnd); try{ oldImg.remove(); } catch(e){} } };
				oldImg.addEventListener('transitionend', onEnd);
				// fallback: remove after 600ms if transitionend doesn't fire
				setTimeout(() => { if (oldImg.parentNode) oldImg.remove(); }, 700);
			});
		};

		if (newImg.complete) {
			safeFadeIn();
		} else {
			newImg.addEventListener('load', safeFadeIn);
			newImg.addEventListener('error', () => { /* on error, still try to remove old images */ safeFadeIn(); });
		}
	}

	function next() { show(idx + 1); }
	function prev() { show(idx - 1); }

	nextBtn.addEventListener('click', (e) => { e.preventDefault(); next(); resetTimer(); });
	prevBtn.addEventListener('click', (e) => { e.preventDefault(); prev(); resetTimer(); });

	function startTimer() {
		timer = setInterval(next, 4500);
	}
	function resetTimer() {
		if (timer) clearInterval(timer);
		startTimer();
	}

	function initInsta(arr) {
		images = arr || [];
		if (!images || images.length === 0) {
			// Fallback to a single placeholder if manifest missing
			images = ['assets/insta/IMG_0438.jpg'];
		}
		show(0);
		startTimer();
	}

	// Try to load a manifest that lists image filenames inside `assets/insta`
	fetch('assets/insta/manifest.json')
		.then(r => r.ok ? r.json() : Promise.reject('manifest not found'))
		.then(j => {
			if (j && Array.isArray(j.files)) {
				const arr = j.files.map(f => `assets/insta/${f}`);
				initInsta(arr);
			} else {
				initInsta();
			}
		})
		.catch(err => {
			console.warn('Could not load insta manifest, falling back to default images', err);
			// fallback: try to load a small set of embedded images if available
			initInsta([ 'assets/insta/IMG_0438.jpg' ]);
		});

	// Mobile: enable swipe gestures on the image element to navigate slideshow
	(function enableInstaSwipe(){
		let touchStartX = 0;
		let touchStartY = 0;
		let touchDeltaX = 0;
		const minSwipe = 40; // minimum px to consider a swipe
		if (!imageEl) return;
		imageEl.addEventListener('touchstart', function(e){
			if (!e.touches || e.touches.length !== 1) return;
			touchStartX = e.touches[0].clientX;
			touchStartY = e.touches[0].clientY;
			touchDeltaX = 0;
		}, { passive: true });

		imageEl.addEventListener('touchmove', function(e){
			if (!e.touches || e.touches.length !== 1) return;
			touchDeltaX = e.touches[0].clientX - touchStartX;
		}, { passive: true });

		imageEl.addEventListener('touchend', function(e){
			// Use changedTouches as final reference
			const endY = (e.changedTouches && e.changedTouches[0]) ? e.changedTouches[0].clientY : touchStartY;
			const deltaY = Math.abs(endY - touchStartY);
			// horizontal swipe must dominate vertical movement
			if (Math.abs(touchDeltaX) > minSwipe && Math.abs(touchDeltaX) > deltaY) {
				if (touchDeltaX < 0) {
					// swipe left => next
					try { next(); } catch(err) {}
				} else {
					// swipe right => prev
					try { prev(); } catch(err) {}
				}
				resetTimer();
			}
			touchDeltaX = 0;
		}, { passive: true });
	})();

	// Lazy load YouTube & Twitch on visibility to reduce initial requests
	const io = new IntersectionObserver(entries => {
		entries.forEach(entry => {
			if (!entry.isIntersecting) return;
			const ifr = entry.target.querySelector('iframe.embed-iframe');
			if (ifr && ifr.dataset && !ifr.dataset.loaded) {
				// If iframe uses a lazy `data-src`, assign it to `src` when the option becomes visible.
				// Some code paths previously only set `data-loaded` which prevented later code from
				// actually assigning `src` (causing embedded players to stay blank).
				if (ifr.dataset.src && !ifr.src) {
					try { ifr.src = ifr.dataset.src; } catch (e) { /* ignore */ }
				}
				ifr.dataset.loaded = '1';
			}
		});
	}, { root: null, threshold: 0.05 });

	document.querySelectorAll('.option').forEach(f => io.observe(f));

	// Observe community discord embed and lazy-load when visible
	const communityWrap = document.querySelector('.community-frame');
	if (communityWrap) {
		const discordIf = communityWrap.querySelector('iframe.discord-embed');
		if (discordIf) {
			const discordObserver = new IntersectionObserver(entries => {
				entries.forEach(entry => {
					if (!entry.isIntersecting) return;
					if (discordIf.dataset && discordIf.dataset.src && !discordIf.dataset.loaded) {
						discordIf.src = discordIf.dataset.src;
						discordIf.dataset.loaded = '1';
					}
					discordObserver.disconnect();
				});
			}, { root: null, threshold: 0.05 });

			discordObserver.observe(discordIf);
		}
	}

	// Lazy-load the hero/background YouTube iframe when it enters the viewport
	(function lazyLoadHeroIframe(){
		const hero = document.getElementById('youtube-video');
		if (!hero || !hero.dataset || !hero.dataset.src) return;
		// If low-power mode, do not auto-load background video (saves CPU/battery on iPhone7)
		if (window.__cook14u_lowPowerMode) { console.info('Low-power: not auto-loading hero background video'); return; }
		const obs = new IntersectionObserver(entries => {
			entries.forEach(entry => {
				if (!entry.isIntersecting) return;
				if (!hero.dataset.loaded) {
					hero.src = hero.dataset.src;
					hero.dataset.loaded = '1';
				}
				obs.disconnect();
			});
		}, { root: null, threshold: 0.01 });
		obs.observe(hero);
	})();

	// Small note: Twitch embeds often require a `parent` param matching the host; if the player doesn't load change the src or use Twitch widget per docs.
})();

/* Options click handling: expand card and lazy-load iframe embeds */
(function optionBehavior() {
	const options = Array.from(document.querySelectorAll('.option'));
	if (!options.length) return;

	function loadEmbedsInOption(opt) {
		opt.querySelectorAll('iframe[data-src]').forEach(ifr => {
			if (!ifr.dataset.loaded) {
				ifr.src = ifr.dataset.src;
				ifr.dataset.loaded = '1';
			}
		});
		// Initialize YouTube IFrame API for playlist controls
		if (opt.dataset.type === 'youtube') {
			const iframe = opt.querySelector('iframe.youtube-embed');
			if (iframe) {
				initYouTubeForIframe(iframe, opt);
			}
		}
	}

	function derivePlatformLink(opt) {
		if (!opt) return null;
		// 1) prefer explicit data-type mapping (most reliable)
		const typ = (opt.dataset.type || '').toLowerCase();
		if (typ) {
			switch(typ) {
				case 'twitch': return { href: 'https://twitch.tv/cook14u', platform: 'twitch' };
				case 'youtube': return { href: 'https://www.youtube.com/@Cook14u', platform: 'youtube' };
				case 'instagram': return { href: 'https://www.instagram.com/cook14u2/', platform: 'instagram' };
				case 'rumble': return { href: 'https://rumble.com/user/Cook14u', platform: 'rumble' };
				case 'tiktok': return { href: 'https://www.tiktok.com/@Cook14U', platform: 'tiktok' };
				default: break;
			}
		}

		// 2) try to inspect any iframe present for data-src or src
		const iframe = opt.querySelector('iframe');
		if (iframe) {
			const src = (iframe.dataset && iframe.dataset.src) || iframe.src || '';
			try {
				if (src.includes('player.twitch.tv') || src.includes('twitch.tv')) {
					const m = src.match(/[?&]channel=([^&]+)/);
					const channel = m ? decodeURIComponent(m[1]) : 'cook14u';
					return { href: `https://twitch.tv/${channel}`, platform: 'twitch' };
				}
				if (src.includes('youtube.com') || src.includes('youtube-nocookie.com')) {
					return { href: 'https://www.youtube.com/@Cook14u', platform: 'youtube' };
				}
				if (src.includes('rumble.com')) {
					return { href: 'https://rumble.com/user/Cook14u', platform: 'rumble' };
				}
				if (src.includes('tiktok.com')) {
					return { href: 'https://www.tiktok.com/@Cook14U', platform: 'tiktok' };
				}
			} catch (e) { /* fall through */ }
		}

		// 3) heuristics based on embed class names or inner labels
		if (opt.querySelector('.youtube-embed') || opt.classList.contains('youtube')) return { href: 'https://www.youtube.com/@Cook14u', platform: 'youtube' };
		if (opt.querySelector('.twitch-embed') || opt.classList.contains('twitch')) return { href: 'https://twitch.tv/cook14u', platform: 'twitch' };
		if (opt.querySelector('.rumble-embed') || opt.classList.contains('rumble')) return { href: 'https://rumble.com/user/Cook14u', platform: 'rumble' };
		if (opt.querySelector('.insta-slideshow') || opt.dataset.type === 'instagram') return { href: 'https://www.instagram.com/cook14u2/', platform: 'instagram' };

		// 4) give up
		return null;
	}

	function updateContentLinkForOption(opt) {
		const linkWrap = document.getElementById('content-links');
		const linkBtn = document.getElementById('content-link-btn');
		if (!linkWrap || !linkBtn) return;
		if (!opt || !opt.classList.contains('active')) {
			linkWrap.classList.remove('visible');
			linkWrap.setAttribute('aria-hidden', 'true');
			return;
		}
		const info = derivePlatformLink(opt);
		if (!info) { linkWrap.style.display = 'none'; linkWrap.setAttribute('aria-hidden','true'); return; }
		linkBtn.href = info.href;
		// show only the platform name (e.g. "Twitch", "YouTube")
		const platformLabel = info.platform.charAt(0).toUpperCase() + info.platform.slice(1);
		linkBtn.textContent = platformLabel;
		linkBtn.setAttribute('aria-label', `Open ${platformLabel}`);
		linkBtn.title = `Open ${platformLabel}`;
		linkBtn.setAttribute('data-platform', info.platform);
		linkWrap.classList.add('visible');
		linkWrap.setAttribute('aria-hidden', 'false');
	}

	const optionsContainer = document.querySelector('.options');

	// Keep reference to the default active option (as provided in HTML)
	const defaultActive = document.querySelector('.option.active');

	// media query to decide mobile vs desktop behavior (match CSS breakpoint)
	const mq = window.matchMedia('(max-width: 900px)');
	let mobileMode = mq.matches || window.innerWidth <= 900;

	function setMobileDefaults() {
		// Small screen: ensure all options start closed and container is not in single-open mode
		options.forEach(o => o.classList.remove('active'));
		if (optionsContainer) optionsContainer.classList.remove('single-open');
	}

	function restoreDesktopDefaults() {
		// Large screen: restore default active option if none is active
		const anyActive = document.querySelector('.option.active');
		if (!anyActive && defaultActive) {
			defaultActive.classList.add('active');
			// load embeds for the restored active card
			loadEmbedsInOption(defaultActive);
		}
	}

	function handleBreakpoint(e) {
		mobileMode = e.matches;
		if (mobileMode) setMobileDefaults();
		else restoreDesktopDefaults();
	}

	// initial run and change listener
	if (mobileMode) setMobileDefaults(); else restoreDesktopDefaults();
	if (mq.addEventListener) mq.addEventListener('change', handleBreakpoint);
	else if (mq.addListener) mq.addListener(handleBreakpoint);

	options.forEach(opt => {
		opt.addEventListener('click', function (e) {
			// prevent clicks on controls from toggling
			if (e.target.closest('.insta-controls') || e.target.tagName === 'BUTTON') return;

			// if already active, do nothing (stay open)
			if (this.classList.contains('active')) return;

			// open this option and hide the others by marking container
			options.forEach(o => o.classList.remove('active'));
			this.classList.add('active');
			if (mobileMode && optionsContainer) optionsContainer.classList.add('single-open');

			// load any embeds in the newly active option
			loadEmbedsInOption(this);
			// update the dynamic content link area to reflect the opened card
			updateContentLinkForOption(this);
		});
	});

	// close button handler (delegated) - closes active option and restores all cards
	document.addEventListener('click', function(e) {
		const closeBtn = e.target.closest('.option-close');
		if (!closeBtn) return;
		e.stopPropagation();
		const opt = closeBtn.closest('.option');
		if (!opt) return;
		opt.classList.remove('active');
		if (optionsContainer) optionsContainer.classList.remove('single-open');
		// hide content link when card closed
		updateContentLinkForOption(null);
	});

	// Ensure the initially active option has its embeds loaded (skip auto-load on low-power to save bandwidth)
	const initial = document.querySelector('.option.active');
	if (initial && !window.__cook14u_lowPowerMode) loadEmbedsInOption(initial);
	if (initial) updateContentLinkForOption(initial);
})();

// YouTube IFrame API helper + control hookup
let youtubeAPIReady = null;
let youtubePlayer = null;
let youtubeCurrentIframe = null;

function loadYouTubeAPI() {
	if (youtubeAPIReady) return youtubeAPIReady;
	youtubeAPIReady = new Promise((resolve) => {
		if (window.YT && window.YT.Player) return resolve(window.YT);
		// called by the API when ready
		window.onYouTubeIframeAPIReady = function() {
			resolve(window.YT);
		};
		const tag = document.createElement('script');
		tag.src = 'https://www.youtube.com/iframe_api';
		document.head.appendChild(tag);
	});
	return youtubeAPIReady;
}

function initYouTubeForIframe(iframe, optionEl) {
	// ensure iframe src is present
	if (!iframe.dataset.loaded) {
		iframe.src = iframe.dataset.src;
		iframe.dataset.loaded = '1';
	}

	// Avoid re-initializing if already created for same iframe
	if (youtubeCurrentIframe === iframe && youtubePlayer) return Promise.resolve(youtubePlayer);

	return loadYouTubeAPI().then((YT) => {
		// ensure iframe has an id
		if (!iframe.id) iframe.id = 'yt-' + Math.random().toString(36).slice(2);

		// Extract playlist config from data-src to ensure API picks it up correctly
		const src = iframe.dataset.src || "";
		const listMatch = src.match(/[?&]list=([^&]+)/);
		
		const playerConfig = {
			events: {
				onReady: function(event) {
					// Restore classes if lost during replacement
					const playerIf = event.target.getIframe();
					if (playerIf) {
						playerIf.classList.add('embed-iframe', 'youtube-embed');
					}
				}
			}
		};

		// If we found a list ID, explicitly configure the player for it
		// This fixes issues where the API doesn't pick up the playlist from the iframe src
		if (listMatch) {
			playerConfig.playerVars = {
				listType: 'playlist',
				list: listMatch[1],
				autoplay: 0,
				rel: 0,
				modestbranding: 1,
				playsinline: 1
			};
		}

		// create player (this will replace the iframe with a YT player instance)
		youtubePlayer = new YT.Player(iframe.id, playerConfig);
		youtubeCurrentIframe = iframe;

		// wire prev/next buttons once
		const prev = optionEl.querySelector('.yt-prev');
		const next = optionEl.querySelector('.yt-next');
		if (prev && !prev.dataset.bound) {
			prev.addEventListener('click', function(e) { 
				e.stopPropagation(); 
				e.preventDefault(); 
				if (youtubePlayer && typeof youtubePlayer.previousVideo === 'function') {
					youtubePlayer.previousVideo(); 
				}
			});
			prev.dataset.bound = '1';
		}
		if (next && !next.dataset.bound) {
			next.addEventListener('click', function(e) { 
				e.stopPropagation(); 
				e.preventDefault(); 
				if (youtubePlayer && typeof youtubePlayer.nextVideo === 'function') {
					youtubePlayer.nextVideo(); 
				}
			});
			next.dataset.bound = '1';
		}

		return youtubePlayer;
	}).catch(err => {
		console.warn('YouTube API failed to load', err);
	});
}

// DEPRECATED: No longer needed - YouTube card now uses native playlist embed
// The playlist ID is set directly in the iframe data-src in index.html
// function setupTestYouTubePlaylist(optionEl) {
// 	const vids = ['_s7S_WybcRM','rc40cT5XKuI'];
// 	const iframe = optionEl.querySelector('iframe.youtube-embed');
// 	if (!iframe) return;
// 	// ... (commented out for reference)
// }

	// Modal click inspector (optional) - enable by adding ?debug_modals=1 to the URL
	(function modalClickInspector() {
		try {
			const params = new URLSearchParams(window.location.search);
			if (params.get('debug_modals') !== '1') return; // do nothing unless explicitly enabled

			console.warn('Modal Click Inspector: ENABLED');

			let outlineEl = null;
			let labelEl = null;

			function createOutline() {
				outlineEl = document.createElement('div');
				outlineEl.className = 'debug-click-outline';
				document.body.appendChild(outlineEl);
				labelEl = document.createElement('div');
				labelEl.className = 'debug-click-label';
				document.body.appendChild(labelEl);
			}

			function removeOutline() {
				if (outlineEl) { outlineEl.remove(); outlineEl = null; }
				if (labelEl) { labelEl.remove(); labelEl = null; }
			}

			function showDebugForElement(el, x, y) {
				if (!el) return;
				const r = el.getBoundingClientRect();
				if (!outlineEl) createOutline();
				outlineEl.style.left = (window.scrollX + r.left) + 'px';
				outlineEl.style.top = (window.scrollY + r.top) + 'px';
				outlineEl.style.width = r.width + 'px';
				outlineEl.style.height = r.height + 'px';
				labelEl.textContent = `Top element: ${el.tagName.toLowerCase()}${el.id ? '#' + el.id : ''}${el.className ? ' .' + el.className.split(' ').join('.') : ''}`;
				// position label near click but inside viewport
				const left = Math.min(window.scrollX + x + 12, window.scrollX + window.innerWidth - 160);
				const top = Math.min(window.scrollY + y - 28, window.scrollY + window.innerHeight - 28);
				labelEl.style.left = left + 'px';
				labelEl.style.top = top + 'px';
			}

			// On any click while a modal is active, log the top element and highlight it briefly
			document.addEventListener('click', function (ev) {
				// only inspect when a modal is open
				const anyModal = document.querySelector('.modal.active, .wz-modal.open');
				if (!anyModal) return;

				const x = ev.clientX;
				const y = ev.clientY;
				// elementFromPoint uses viewport coords
				const topEl = document.elementFromPoint(x, y);
				console.group('Modal Click Inspector');
				console.log('Click coords (viewport):', { x, y });
				console.log('Modal present:', anyModal);
				console.log('Topmost element at point:', topEl);
				// if the top element is an iframe's internal content cannot be inspected, but iframe element will be returned
				if (topEl && topEl.tagName === 'IFRAME') {
					console.warn('Top element is an iframe element. It may be cross-origin; iframe itself will receive the click if not covered.');
				}
				console.groupEnd();

				showDebugForElement(topEl, x, y);
				// remove after a short delay
				setTimeout(removeOutline, 1500);
			}, true); // capture phase to see the event before handlers

			// helper button to toggle the debug via console
			window.__toggleModalInspector = function (on) {
				if (!on) { removeOutline(); console.warn('Modal Click Inspector: DISABLED'); return; }
				console.warn('Modal Click Inspector remains ENABLED');
			};
		} catch (err) {
			console.error('Modal Click Inspector failed to initialize', err);
		}
	})();

		/* Content card spark effect ------------------------------------------------- */
		// Content card spark effect
		const sparkCanvas = document.getElementById('contentSparkCanvas');
		let sparkCtx, sparkParticles = [];
		let createSparkBurst;

		if (sparkCanvas) {
			sparkCtx = sparkCanvas.getContext('2d');
  
			function resizeSparkCanvas() {
				const contentSection = document.getElementById('content');
				if (contentSection) {
					// set canvas to cover the section element
					sparkCanvas.width = contentSection.offsetWidth;
					sparkCanvas.height = contentSection.offsetHeight;
					// ensure canvas is positioned top-left relative to section
					const rect = contentSection.getBoundingClientRect();
					sparkCanvas.style.left = '0px';
					sparkCanvas.style.top = '0px';
				}
			}
			resizeSparkCanvas();
			window.addEventListener('resize', resizeSparkCanvas);

			class SparkParticle {
				constructor(x, y) {
					this.x = x;
					this.y = y;
					this.vx = (Math.random() - 0.5) * 6;
					this.vy = (Math.random() - 0.5) * 6;
					this.life = 1;
					this.decay = 0.015 + Math.random() * 0.015;
					this.size = 2 + Math.random() * 3;
					this.gravity = 0.15;
					const colors = [
						{r: 255, g: 150, b: 0},
						{r: 255, g: 200, b: 50},
						{r: 255, g: 100, b: 0},
					];
					this.color = colors[Math.floor(Math.random() * colors.length)];
				}

				update() {
					this.x += this.vx;
					this.y += this.vy;
					this.vy += this.gravity;
					this.vx *= 0.98;
					this.life -= this.decay;
				}

				draw() {
					const alpha = Math.max(0, this.life);
					sparkCtx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${alpha})`;
					sparkCtx.beginPath();
					sparkCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
					sparkCtx.fill();
				}
			}

			createSparkBurst = function(element) {
				const rect = element.getBoundingClientRect();
				const contentSection = document.getElementById('content');
				if (!contentSection) return;
				const sectionRect = contentSection.getBoundingClientRect();
    
				// Calculate position relative to content section
				const centerX = rect.left + rect.width / 2 - sectionRect.left;
				const centerY = rect.top + rect.height / 2 - sectionRect.top;
    
				// Create sparks around the card; reduce count on low-power devices
				const sparks = window.__cook14u_lowPowerMode ? 16 : 50;
				for (let i = 0; i < sparks; i++) {
					const angle = (Math.random() * Math.PI * 2);
					const distance = Math.random() * 40 + rect.width / 3;
					const x = centerX + Math.cos(angle) * distance;
					const y = centerY + Math.sin(angle) * distance;
					sparkParticles.push(new SparkParticle(x, y));
				}
			};

			function animateSparks() {
				if (!sparkCtx) return;
				sparkCtx.clearRect(0, 0, sparkCanvas.width, sparkCanvas.height);
    
				for (let i = sparkParticles.length - 1; i >= 0; i--) {
					const particle = sparkParticles[i];
					particle.update();
					particle.draw();
      
					if (particle.life <= 0) {
						sparkParticles.splice(i, 1);
					}
				}
    
				requestAnimationFrame(animateSparks);
			}
  
			animateSparks();
		}

		// Content options interaction hook: trigger spark burst when option is clicked
		document.addEventListener('DOMContentLoaded', function() {
			const options = document.querySelectorAll('.option');
			options.forEach((option) => {
				option.addEventListener('click', function(e) {
					// ignore clicks on control buttons inside the option
					if (e.target.closest('.option-close') || e.target.closest('button')) return;
					if (typeof createSparkBurst === 'function') createSparkBurst(this);
				});
			});
		});

	// Left-side lines shader initializer (moved from inline script in index.html)
	function initLeftLines() {
		try {
			if (window.__cook14u_lowPowerMode) { console.info('Skipping left-side lines shader for low-power device'); return; }
			if (typeof THREE === 'undefined') return; // require global THREE
			const overlay = document.querySelector('.home-overlay');
			if (!overlay) return;

			const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
			renderer.domElement.className = 'home-lines-canvas';
			renderer.domElement.style.position = 'fixed';
			renderer.domElement.style.left = '0';
			renderer.domElement.style.top = '0';
			renderer.domElement.style.width = '100%';
			renderer.domElement.style.height = '100%';
			renderer.domElement.style.pointerEvents = 'none';
			const ref = overlay.querySelector('.logo-fire-container');
			overlay.insertBefore(renderer.domElement, ref);

			const scene = new THREE.Scene();
			const camera = new THREE.OrthographicCamera(-1,1,1,-1,0.1,10);
			camera.position.z = 1;

			const uniforms = {
				uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
				uTime: { value: 0 },
				uScroll: { value: 0.0 },
				uColor: { value: new THREE.Color(0.05, 0.55, 1.0) },
				uGlow: { value: 2.2 },
				uThickness: { value: 0.058 },
				uLines: { value: 3.0 },
				uLeftOffset: { value: 1.95 },
				uSpeed: { value: 1.06 }
			};

			const geometry = new THREE.PlaneGeometry(2,2);
			const material = new THREE.ShaderMaterial({
				uniforms: uniforms,
				transparent: true,
				depthWrite: false,
				vertexShader: 'varying vec2 vUv; void main(){ vUv=uv; gl_Position=vec4(position,1.0); }',
				fragmentShader: `precision highp float;
				varying vec2 vUv;
				uniform vec2 uResolution;
				uniform float uTime;
				uniform float uScroll;
				uniform vec3 uColor;
				uniform float uGlow;
				uniform float uThickness;
				uniform float uLines;
				uniform float uLeftOffset;
				uniform float uSpeed;

				float lineProfile(float x, float thickness) {
					float d = abs(x);
					return smoothstep(thickness, 0.0, d);
				}

				float hash(vec2 p) {
					p = fract(p * vec2(123.34, 456.21));
					p += dot(p, p + 45.32);
					return fract(p.x * p.y);
				}

				void main(){
					vec2 uv = (vUv - 0.5) * 2.0;
					uv.x *= uResolution.x / uResolution.y;
					uv.y += (uScroll * 1.6);
					vec3 col = vec3(0.0);
					float t = uTime * uSpeed;

					// render lines mirrored on both left and right sides
					for (float i=0.0;i<12.0;i+=1.0) {
						if (i >= uLines) break;
						float fi = i;
						float phase = t * (0.6 + 0.25 * fi);
						float wave = sin(uv.y * (2.0 + fi*0.5) + phase) * 0.28 * (0.85 + 0.25*sin(fi*12.0));
						// left baseline (negative X)
						float baseX = -uLeftOffset + (fi * 0.08) + sin(fi*3.2 + phase*0.7)*0.04;
						float thickness = uThickness * (0.8 + 0.6 * fract(hash(vec2(fi, floor(t)))));

						// left contribution
						float distL = uv.x - (baseX + wave);
						float profileL = lineProfile(distL, thickness);
						float glowL = profileL * (0.8 + 0.6 * smoothstep(0.0, 1.0, 1.0 - abs(distL)*8.0));
						col += uColor * glowL * (0.25 + 0.75*(1.0 - fi/max(1.0, uLines)));

						// compute right contribution by sampling the same line function at the mirrored X
						float mirroredX = -uv.x;
						float distR_mirror = mirroredX - (baseX + wave);
						float profileR = lineProfile(distR_mirror, thickness);
						float glowR = profileR * (0.8 + 0.6 * smoothstep(0.0, 1.0, 1.0 - abs(distR_mirror)*8.0));
						col += uColor * glowR * (0.25 + 0.75*(1.0 - fi/max(1.0, uLines)));
					}

					// amplify final color by glow; increased multiplier for stronger, "feller" lines
					col *= uGlow * 1.0;
					// symmetric fade from center to sides so left and right brightness match
					float fadeSym = 1.0 - smoothstep(0.4, 1.5, abs(uv.x));
					col *= (1.0 - (1.0 - fadeSym)*0.85);
					col = pow(col, vec3(0.9));
					gl_FragColor = vec4(col, clamp(length(col), 0.0, 1.0));
				}
				`
			});

			const mesh = new THREE.Mesh(geometry, material);
			scene.add(mesh);

			function onResize(){
				const w = overlay.clientWidth || window.innerWidth;
				const h = overlay.clientHeight || window.innerHeight;
				renderer.setSize(w, h);
				renderer.setPixelRatio(Math.max(1, window.devicePixelRatio || 1));
				uniforms.uResolution.value.set(w, h);
			}
			window.addEventListener('resize', onResize);
			onResize();

			const clock = new THREE.Clock();
			let scrollTarget = 0;
			let scrollCurrent = 0;
			function onScroll(){ scrollTarget = window.scrollY / Math.max(1, window.innerHeight); }
			window.addEventListener('scroll', onScroll, { passive: true });

			(function loop(){
				uniforms.uTime.value = clock.getElapsedTime();
				scrollCurrent += (scrollTarget - scrollCurrent) * 0.14;
				uniforms.uScroll.value = scrollCurrent;
				renderer.render(scene, camera);
				requestAnimationFrame(loop);
			})();
		} catch (err) {
			console.warn('Left lines init failed', err);
		}
	}

	// Initialize when DOM is ready (ensures .home-overlay exists)
	if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initLeftLines); else initLeftLines();

	/* Live indicator behaviour: check Twitch live status using official API
	   - left-click: when live -> open twitch content panel; when offline -> scroll to Discord/community
	   - context menu (right-click) toggles a manual force-live override for testing (stored in localStorage)
	*/
	(function liveIndicatorController(){
		const btn = document.getElementById('live-indicator');
		if (!btn) return;

		// Twitch API Credentials
		// WARNING: Storing Client Secret in client-side code is insecure as it is visible to anyone inspecting the source.
		// Ideally, this should be handled by a backend proxy. Proceeding as requested for static site.
		const CLIENT_ID = '7a57wo4g9h61fnxr8td9dmnibkjr2b';
		const CLIENT_SECRET = 'lhdr67w4klu9jvnjb64m6p0d65xf6x';
		const CHANNEL_NAME = 'cook14u';

		let forced = sessionStorage.getItem('cook14u_force_live') === '1';
		let isLive = false;
		let cachedUserId = localStorage.getItem('cook14u_twitch_userid');

		// Demo toggle button (temporary): wire a small visible toggle to force live state for testing
		// demo button removed from DOM; use sessionStorage for non-persistent force override

		function setLive(v){
			isLive = !!v;
			if (isLive) btn.classList.add('is-live'); else btn.classList.remove('is-live');
			btn.setAttribute('aria-pressed', String(isLive));
			// Use translation helper if available
			btn.title = isLive ? t('live_online_title', 'Cook14U is LIVE — click to open Twitch') : t('live_offline_title', 'Offline — click to open Discord (or open community)');
		}

		// Initialize UI to a deterministic state: respect manual forced override if present (session only),
		// otherwise show offline until the live check runs.
		if (forced) setLive(true); else setLive(false);

		function openTwitchOption(){
			const twitchOpt = document.querySelector('.option[data-type="twitch"]');
			if (twitchOpt) {
				// ensure options container visible on mobile by simulating click
				twitchOpt.click();
				// scroll content into view
				const content = document.getElementById('content');
				if (content) content.scrollIntoView({ behavior: 'smooth', block: 'start' });
			}
		}

		function openDiscordSection(){
			const community = document.getElementById('community');
			if (community) {
				community.scrollIntoView({ behavior: 'smooth', block: 'start' });
				const discordIframe = community.querySelector('iframe.discord-embed');
				if (discordIframe && discordIframe.dataset && discordIframe.dataset.src && !discordIframe.dataset.loaded) {
					discordIframe.src = discordIframe.dataset.src;
					discordIframe.dataset.loaded = '1';
				}
			}
		}

		btn.addEventListener('click', function(e){
			// normal click: open target depending on live state
			if (forced) { setLive(true); }
			if (isLive) openTwitchOption(); else openDiscordSection();
		});

		// right-click toggles manual override (for testing) — stored in sessionStorage so it's not persistent across browser sessions
		btn.addEventListener('contextmenu', function(e){
			e.preventDefault();
			forced = !forced;
			if (forced) sessionStorage.setItem('cook14u_force_live','1'); else sessionStorage.removeItem('cook14u_force_live');
			checkNow();
		});

		async function getAccessToken() {
			let token = localStorage.getItem('cook14u_twitch_token');
			let expiry = localStorage.getItem('cook14u_twitch_expiry');
			
			if (token && expiry && Date.now() < parseInt(expiry)) {
				return token;
			}

			try {
				const response = await fetch('https://id.twitch.tv/oauth2/token', {
					method: 'POST',
					headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
					body: `client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&grant_type=client_credentials`
				});
				const data = await response.json();
				if (data.access_token) {
					localStorage.setItem('cook14u_twitch_token', data.access_token);
					localStorage.setItem('cook14u_twitch_expiry', Date.now() + (data.expires_in * 1000));
					return data.access_token;
				}
			} catch (e) {
				console.error('Failed to get Twitch token', e);
			}
			return null;
		}

		async function getUserId(token) {
			if (cachedUserId) return cachedUserId;
			try {
				const response = await fetch(`https://api.twitch.tv/helix/users?login=${CHANNEL_NAME}`, {
					headers: { 'Client-Id': CLIENT_ID, 'Authorization': `Bearer ${token}` }
				});
				const data = await response.json();
				if (data.data && data.data.length > 0) {
					cachedUserId = data.data[0].id;
					localStorage.setItem('cook14u_twitch_userid', cachedUserId);
					return cachedUserId;
				}
			} catch (e) {
				console.error('Failed to get User ID', e);
			}
			return null;
		}

		function updateTwitchEmbed(type, id) {
			const twitchOpt = document.querySelector('.option[data-type="twitch"]');
			if (!twitchOpt) return;
			const iframe = twitchOpt.querySelector('iframe');
			if (!iframe) return;

			const hostname = window.location.hostname || 'localhost';
			// Add common parents to support local dev and github pages
			const parents = `parent=${hostname}&parent=cook14u.github.io&parent=127.0.0.1`;
			
			let newSrc = '';
			if (type === 'live') {
				newSrc = `https://player.twitch.tv/?channel=${CHANNEL_NAME}&${parents}&muted=false`;
			} else if (type === 'video') {
				newSrc = `https://player.twitch.tv/?video=${id}&${parents}&muted=false`;
			}

			// Update data-src so lazy loader picks it up
			iframe.dataset.src = newSrc;
			
			// If already loaded or active, update immediately
			if (iframe.dataset.loaded === '1' || twitchOpt.classList.contains('active')) {
				// Only update src if it's different to avoid reload
				if (iframe.src !== newSrc) {
					iframe.src = newSrc;
					iframe.dataset.loaded = '1';
				}
			}
		}

		async function checkNow(){
			// forced override always shows live
			if (forced) { 
				setLive(true); 
				updateTwitchEmbed('live');
				return; 
			}

			const token = await getAccessToken();
			if (!token) {
				console.warn('Could not obtain Twitch token');
				// ensure UI reflects offline when token can't be fetched
				setLive(false);
				return;
			}

			const userId = await getUserId(token);
			if (!userId) {
				setLive(false);
				return;
			}

			try {
				// Check Stream
				const streamResp = await fetch(`https://api.twitch.tv/helix/streams?user_id=${userId}`, {
					headers: { 'Client-Id': CLIENT_ID, 'Authorization': `Bearer ${token}` }
				});
				const streamData = await streamResp.json();
				
				const live = streamData.data && streamData.data.length > 0;
				setLive(live);

				if (live) {
					updateTwitchEmbed('live');
				} else {
					// Fetch latest video (VOD)
					const videoResp = await fetch(`https://api.twitch.tv/helix/videos?user_id=${userId}&first=1&sort=time`, {
						headers: { 'Client-Id': CLIENT_ID, 'Authorization': `Bearer ${token}` }
					});
					const videoData = await videoResp.json();
					if (videoData.data && videoData.data.length > 0) {
						updateTwitchEmbed('video', videoData.data[0].id);
					}
				}
			} catch (err) {
				// network or endpoint failed — assume offline but keep manual override available
				console.warn('Live check failed', err);
				setLive(false);
			}
		}

		// initial state and interval poll (every 60s)
		checkNow();
		setInterval(checkNow, 60000);
	})();

	// Ensure merch buy-station doesn't keep focus/hover glow after click
	document.addEventListener('DOMContentLoaded', function(){
		const merch = document.querySelector('.merch-buystation');
		if (!merch) return;
		// On click (mouse) blur the element shortly after so focus styles/hover don't persist
		merch.addEventListener('click', function(e){
			// if the anchor opens a new tab the browser may keep focus; remove it to clear visual state
			const el = e.currentTarget || this;
			setTimeout(() => { try { el.blur(); } catch(err) {} }, 60);
		});
		// For keyboard activation, also blur after keypress to remove focus glow
		merch.addEventListener('keydown', function(e){
			if (e.key === 'Enter' || e.key === ' ') {
				const el = e.currentTarget || this;
				setTimeout(() => { try { el.blur(); } catch(err) {} }, 60);
			}
		});
	});
