document.querySelectorAll('details').forEach((item) => item.addEventListener('toggle', () => {
  if (item.open) document.querySelectorAll('details').forEach((other) => { if (other !== item) other.open = false; });
}));

const postcodeInput = document.querySelector('input[name="q2_q2_textbox0"]');
if (postcodeInput) {
  postcodeInput.addEventListener('input', () => {
    const characters = postcodeInput.value.toUpperCase().replace(/\s/g, '');
    const digits = (characters.match(/\d/g) || []).join('').slice(0, 4);
    const letters = (characters.match(/[A-Z]/g) || []).join('').slice(0, 2);
    postcodeInput.value = digits.length === 4 && letters ? `${digits} ${letters}` : digits;
  });
}

const quickscanForm = document.querySelector('#quickscan');
if (quickscanForm) {
  quickscanForm.addEventListener('submit', () => {
    const successMessage = document.querySelector('#quickscanSuccess');
    const submitButton = quickscanForm.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    submitButton.textContent = 'Wordt verstuurd…';
    window.setTimeout(() => {
      quickscanForm.reset();
      quickscanForm.hidden = true;
      successMessage.hidden = false;
    }, 700);
  });
}

const centerQuickscan = (behavior = 'smooth') => {
  const form = document.querySelector('#quickscan');
  if (!form) return;
  const formCenter = window.scrollY + form.getBoundingClientRect().top + form.offsetHeight / 2;
  const centeredPosition = Math.max(0, formCenter - window.innerHeight / 2);
  window.scrollTo({ top: centeredPosition, behavior });
};

document.querySelectorAll('a[href="#quickscan"]').forEach((link) => {
  link.addEventListener('click', (event) => {
    event.preventDefault();
    history.replaceState(null, '', '#quickscan');
    centerQuickscan();
  });
});

if (window.location.hash === '#quickscan') {
  window.addEventListener('load', () => setTimeout(() => centerQuickscan('auto'), 0));
}

document.querySelectorAll('.package[data-href]').forEach((card) => {
  card.tabIndex = 0;
  card.setAttribute('role', 'link');
  const open = () => { window.location.href = card.dataset.href; };
  card.addEventListener('click', (event) => { if (!event.target.closest('a')) open(); });
  card.addEventListener('keydown', (event) => { if (event.key === 'Enter' || event.key === ' ') open(); });
});

const carousel = document.querySelector('#articleCarousel');
if (carousel) {
  const cards = [...carousel.children];
  let pairIndex = 1;
  const isMobileCarousel = () => window.matchMedia('(max-width: 800px)').matches;
  const centerPair = (index, behavior = 'smooth') => {
    if (isMobileCarousel()) {
      pairIndex = Math.max(0, Math.min(index, cards.length - 1));
      cards.forEach((card, cardIndex) => card.classList.toggle('in-focus', cardIndex === pairIndex));
      const card = cards[pairIndex];
      carousel.scrollTo({ left: card.offsetLeft + card.offsetWidth / 2 - carousel.clientWidth / 2, behavior });
      return;
    }
    pairIndex = Math.max(0, Math.min(index, cards.length - 2));
    const first = cards[pairIndex];
    const second = cards[pairIndex + 1];
    cards.forEach((card, cardIndex) => card.classList.toggle('in-focus', cardIndex === pairIndex || cardIndex === pairIndex + 1));
    const pairCenter = (first.offsetLeft + second.offsetLeft + second.offsetWidth) / 2;
    carousel.scrollTo({ left: pairCenter - carousel.clientWidth / 2, behavior });
  };
  document.querySelector('.carousel-button.prev').addEventListener('click', () => centerPair(pairIndex - 1));
  document.querySelector('.carousel-button.next').addEventListener('click', () => centerPair(pairIndex + 1));
  const updateFocus = () => {
    const middle = carousel.scrollLeft + carousel.clientWidth / 2;
    const focusCount = isMobileCarousel() ? 1 : 2;
    const nearest = cards.map((card, index) => ({ index, distance: Math.abs(middle - (card.offsetLeft + card.offsetWidth / 2)) })).sort((a, b) => a.distance - b.distance).slice(0, focusCount).map(item => item.index);
    pairIndex = Math.min(...nearest);
    cards.forEach((card, index) => card.classList.toggle('in-focus', nearest.includes(index)));
  };
  carousel.addEventListener('scroll', updateFocus, { passive: true });
  window.addEventListener('load', () => {
    centerPair(isMobileCarousel() ? 0 : 1, 'auto');
    updateFocus();
  });
}
