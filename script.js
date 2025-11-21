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
	const PARTICLE_COUNT = 90;
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
	// Instagram-like slideshow (uses external placeholder images)
	const instaFrame = document.querySelector('.insta-slideshow');
	if (!instaFrame) return;

	// placeholder images - replace these URLs with your Instagram image URLs or local assets
	const images = [
		'https://images.unsplash.com/photo-1504198453319-5ce911bafcde?w=1200&q=60&auto=format&fit=crop',
		'https://images.unsplash.com/photo-1528879300202-0d6a3a9ad5e7?w=1200&q=60&auto=format&fit=crop',
		'https://images.unsplash.com/photo-1546443046-ed1ce6ffd1be?w=1200&q=60&auto=format&fit=crop'
	];

	const imageEl = instaFrame.querySelector('.insta-image');
	const prevBtn = instaFrame.querySelector('.insta-prev');
	const nextBtn = instaFrame.querySelector('.insta-next');
	let idx = 0;
	let timer = null;

	function show(i) {
		idx = (i + images.length) % images.length;
		imageEl.style.opacity = 0;
		setTimeout(() => {
			imageEl.style.backgroundImage = `url('${images[idx]}')`;
			imageEl.style.opacity = 1;
		}, 220);
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

	// initialize
	show(0);
	startTimer();

	// Lazy load YouTube & Twitch on visibility to reduce initial requests
	const io = new IntersectionObserver(entries => {
		entries.forEach(entry => {
			if (!entry.isIntersecting) return;
			const ifr = entry.target.querySelector('iframe.embed-iframe');
			if (ifr && ifr.dataset && !ifr.dataset.loaded) {
				// nothing to change as src already set; mark as loaded
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
		// If this is the YouTube option, ensure the YT player is initialized and controls hooked
		if (opt.dataset.type === 'youtube') {
			const ytIframe = opt.querySelector('iframe.youtube-embed');
			if (ytIframe) initYouTubeForIframe(ytIframe, opt);
		}
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
	});

	// Ensure the initially active option has its embeds loaded
	const initial = document.querySelector('.option.active');
	if (initial) loadEmbedsInOption(initial);
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

		// create player (this will replace the iframe with a YT player instance)
		youtubePlayer = new YT.Player(iframe.id, {
			events: {
				onReady: function(event) {
					// autoplay disabled by default; you can call playVideo() if desired
				}
			}
		});
		youtubeCurrentIframe = iframe;

		// wire prev/next buttons once
		const prev = optionEl.querySelector('.yt-prev');
		const next = optionEl.querySelector('.yt-next');
		if (prev && !prev.dataset.bound) {
			prev.addEventListener('click', function(e) { e.stopPropagation(); e.preventDefault(); if (youtubePlayer && youtubePlayer.previousVideo) youtubePlayer.previousVideo(); });
			prev.dataset.bound = '1';
		}
		if (next && !next.dataset.bound) {
			next.addEventListener('click', function(e) { e.stopPropagation(); e.preventDefault(); if (youtubePlayer && youtubePlayer.nextVideo) youtubePlayer.nextVideo(); });
			next.dataset.bound = '1';
		}

		return youtubePlayer;
	}).catch(err => {
		console.warn('YouTube API failed to load', err);
	});
}

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
    
				// Create sparks around the card
				for (let i = 0; i < 50; i++) {
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
