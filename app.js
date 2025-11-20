/***********************
 Sidebar responsive + Section navigation
 ***********************/
const sidebar = document.getElementById('sidebar');
const sidebarToggle = document.getElementById('sidebarToggle');
const collapseBtn = document.getElementById('collapseBtn');

// semua link navigasi yang punya data-target
const navLinks = document.querySelectorAll('.nav-scroll');

// helper: pindah ke section target dengan smooth scroll
function goToSection(targetId) {
  const el = document.getElementById(targetId);
  if (!el) return;
  // offset jika kamu punya fixed header (tidak ada di layout ini) -> contoh 12
  const offset = 16;
  const top = el.getBoundingClientRect().top + window.pageYOffset - offset;
  window.scrollTo({ top, behavior: 'smooth' });
}

// klik pada nav item
navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const target = link.getAttribute('data-target');
    goToSection(target);

    // jika mobile, tutup sidebar setelah pilih
    if (window.innerWidth <= 992) {
      sidebar.classList.remove('mobile-open');
      sidebar.classList.add('mobile-hidden');
    }

    // set active (quick)
    navLinks.forEach(l => l.classList.remove('active'));
    link.classList.add('active');
  });
});

// highlight active link sesuai section yang terlihat
// gunakan IntersectionObserver untuk performa lebih baik
const sections = document.querySelectorAll('main section[id]');
const obsOptions = { root: null, rootMargin: '0px', threshold: 0.45 };

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    const id = entry.target.id;
    const matchingLink = document.querySelector(`.nav-scroll[data-target="${id}"]`);
    if (entry.isIntersecting) {
      // hapus active dari semua, lalu beri pada yang cocok
      navLinks.forEach(l => l.classList.remove('active'));
      if (matchingLink) matchingLink.classList.add('active');
    }
  });
}, obsOptions);

sections.forEach(s => observer.observe(s));

// ---------- existing sidebar toggle logic (mobile + collapse) ----------
function applySidebarMode() {
  if (window.innerWidth <= 992) {
    sidebar.classList.remove('collapsed');
    sidebar.classList.add('mobile-hidden');
    sidebar.classList.remove('mobile-open');
  } else {
    sidebar.classList.remove('mobile-hidden', 'mobile-open');
    // default expanded on desktop
    sidebar.classList.remove('collapsed');
  }
}

if (sidebarToggle) {
  sidebarToggle.addEventListener('click', () => {
    const isMobile = window.innerWidth <= 992;
    if (isMobile) {
      sidebar.classList.toggle('mobile-open');
      sidebar.classList.remove('mobile-hidden');
    } else {
      sidebar.classList.toggle('collapsed');
    }
  });
}

if (collapseBtn) {
  collapseBtn.addEventListener('click', () => {
    sidebar.classList.toggle('collapsed');
  });
}

document.addEventListener('click', (e) => {
  const isMobile = window.innerWidth <= 992;
  if (!isMobile) return;
  if (!sidebar.contains(e.target) && !sidebarToggle.contains(e.target)) {
    if (sidebar.classList.contains('mobile-open')) {
      sidebar.classList.remove('mobile-open');
      sidebar.classList.add('mobile-hidden');
    }
  }
});

window.addEventListener('resize', applySidebarMode);
applySidebarMode();

/***********************
 Chart.js code (contoh)
 ***********************/
const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const ihsg = [0.2,0.1,0.1,-0.2,1.6,-4.1,0.4,4.0,0.3,-2.7,4.9,2.7];

// Line chart
const ctxLine = document.getElementById('lineChart');
if (ctxLine) {
  new Chart(ctxLine, {
    type: 'line',
    data: {
      labels: months,
      datasets: [
        { label: 'IHSG', data: ihsg, borderWidth:2, tension:0.4, pointRadius:4, borderColor:'rgba(0,212,255,0.95)', backgroundColor:'rgba(0,212,255,0.06)' },
        { label: 'Portfolio', data: ihsg.map(v=>v*0.08 + 0.2), borderWidth:2, tension:0.4, pointRadius:3, borderColor:'rgba(0,229,181,0.95)', backgroundColor:'rgba(0,229,181,0.04)' }
      ]
    },
    options: { maintainAspectRatio:false, scales:{ x:{grid:{display:false}, ticks:{color:'#9aa4b2'}}, y:{grid:{color:'rgba(255,255,255,0.03)'}, ticks:{color:'#9aa4b2'}}}, plugins:{legend:{labels:{color:'#9aa4b2'}}} }
  });
}

// Bar chart
const ctxBar = document.getElementById('barChart');
if (ctxBar) {
  new Chart(ctxBar, {
    type:'bar',
    data:{ labels: months, datasets:[{ label:'Net P/L (k)', data:[-143,87,131,166,216,131,191,386,77,77,206,216], borderRadius:6 }] },
    options:{ maintainAspectRatio:false, scales:{ x:{grid:{display:false}, ticks:{color:'#9aa4b2'}}, y:{grid:{color:'rgba(255,255,255,0.03)'}, ticks:{color:'#9aa4b2'}}}, plugins:{legend:{display:false}} }
  });
}
