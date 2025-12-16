// Shared mobile menu behavior: toggles `menuBtn` / `navLinks` if present
(function(){
  const menuBtn = document.getElementById('menuBtn');
  // prefer explicit nav id, fallback to first <nav>
  let navLinks = document.getElementById('navLinks');
  if (!navLinks) navLinks = document.querySelector('nav');
  if (!menuBtn || !navLinks) return;

  function openMenu(){
    menuBtn.classList.add('open');
    navLinks.classList.add('active');
    document.body.classList.add('menu-open');
    menuBtn.setAttribute('aria-expanded','true');
  }
  function closeMenu(){
    menuBtn.classList.remove('open');
    navLinks.classList.remove('active');
    document.body.classList.remove('menu-open');
    menuBtn.setAttribute('aria-expanded','false');
  }
  function toggleMenu(){ if (navLinks.classList.contains('active')) closeMenu(); else openMenu(); }

  menuBtn.addEventListener('click', toggleMenu);
  menuBtn.addEventListener('keydown', (e)=>{ if (e.key==='Enter' || e.key===' ') { e.preventDefault(); toggleMenu(); } });

  document.addEventListener('click', (e)=>{
    if (!navLinks.classList.contains('active')) return;
    if (!navLinks.contains(e.target) && !menuBtn.contains(e.target)) closeMenu();
  });

  document.addEventListener('keydown', (e)=>{ if (e.key==='Escape' && navLinks.classList.contains('active')) closeMenu(); });
  window.addEventListener('resize', ()=>{ if (window.innerWidth>768 && navLinks.classList.contains('active')) closeMenu(); });
})();
