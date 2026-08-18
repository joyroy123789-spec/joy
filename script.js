const menu = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');
if (menu) menu.addEventListener('click', () => nav.classList.toggle('open'));

const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    document.getElementById('formMessage').textContent =
      'Thank you! Your message has been received. Connect this form to your email/API before going live.';
    form.reset();
  });
}
