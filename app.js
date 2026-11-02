/**
 * Hotel Capricornio - Interactive Script
 * Tela, Atlántida, Honduras
 * WhatsApp: +504 9633-6474
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initBookingCalculator();
  initRoomBookingButtons();
  initLightbox();
  initFaqAccordion();
});

/* ===================================================================
   1. NAVBAR & MOBILE DRAWER
   =================================================================== */
function initNavbar() {
  const header = document.querySelector('.site-header');
  const mobileBtn = document.getElementById('mobileMenuBtn');
  const navLinks = document.getElementById('navLinks');

  // Header shadow on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Mobile menu toggle
  if (mobileBtn && navLinks) {
    mobileBtn.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      const isOpen = navLinks.classList.contains('active');
      mobileBtn.innerHTML = isOpen 
        ? `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`
        : `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>`;
    });

    // Close mobile menu on clicking any link
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        mobileBtn.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>`;
      });
    });
  }
}

/* ===================================================================
   2. INTERACTIVE BOOKING CALCULATOR
   =================================================================== */
function initBookingCalculator() {
  const checkinInput = document.getElementById('calcCheckin');
  const checkoutInput = document.getElementById('calcCheckout');
  const roomSelect = document.getElementById('calcRoomType');
  const guestsSelect = document.getElementById('calcGuests');
  const totalDisplay = document.getElementById('calcTotalDisplay');
  const bookBtn = document.getElementById('btnSubmitBooking');

  if (!checkinInput || !checkoutInput || !roomSelect || !totalDisplay) return;

  // Set default dates (Today and Tomorrow)
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  const formatDate = (d) => d.toISOString().split('T')[0];
  checkinInput.min = formatDate(today);
  checkinInput.value = formatDate(today);

  checkoutInput.min = formatDate(tomorrow);
  checkoutInput.value = formatDate(tomorrow);

  function calculateEstimate() {
    const checkin = new Date(checkinInput.value);
    const checkout = new Date(checkoutInput.value);

    // Calculate nights
    let diffTime = checkout - checkin;
    let nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (isNaN(nights) || nights < 1) {
      nights = 1;
    }

    const pricePerNight = parseInt(roomSelect.value, 10) || 700;
    const total = nights * pricePerNight;
    const totalUSD = (total / 25).toFixed(0);

    totalDisplay.textContent = `L ${total.toLocaleString()} (~$${totalUSD} USD) · ${nights} ${nights === 1 ? 'noche' : 'noches'}`;
    return { nights, total, pricePerNight };
  }

  checkinInput.addEventListener('change', () => {
    // Ensure checkout is after checkin
    const cin = new Date(checkinInput.value);
    const cout = new Date(checkoutInput.value);
    if (cout <= cin) {
      const nextDay = new Date(cin);
      nextDay.setDate(cin.getDate() + 1);
      checkoutInput.value = formatDate(nextDay);
    }
    checkoutInput.min = checkinInput.value;
    calculateEstimate();
  });

  checkoutInput.addEventListener('change', calculateEstimate);
  roomSelect.addEventListener('change', calculateEstimate);
  if (guestsSelect) guestsSelect.addEventListener('change', calculateEstimate);

  // Initial calculation
  calculateEstimate();

  // WhatsApp Submission
  if (bookBtn) {
    bookBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const { nights, total } = calculateEstimate();
      const roomText = roomSelect.options[roomSelect.selectedIndex].text;
      const guests = guestsSelect ? guestsSelect.value : '1-2';
      const checkin = checkinInput.value;
      const checkout = checkoutInput.value;

      const message = `¡Hola Hotel Capricornio! 👋\n` +
        `Quisiera cotizar y reservar una estadía:\n\n` +
        `🏨 Habitación: ${roomText}\n` +
        `👥 Huéspedes: ${guests}\n` +
        `📅 Entrada: ${checkin}\n` +
        `📅 Salida: ${checkout}\n` +
        `🌙 Duración: ${nights} ${nights === 1 ? 'noche' : 'noches'}\n` +
        `💰 Total estimado: L ${total.toLocaleString()} HNL\n\n` +
        `¿Tienen disponibilidad para estas fechas? Quedo atento a su respuesta. ¡Muchas gracias!`;

      const waUrl = `https://wa.me/50496336474?text=${encodeURIComponent(message)}`;
      window.open(waUrl, '_blank');
    });
  }
}

/* ===================================================================
   3. DIRECT ROOM BOOKING BUTTONS
   =================================================================== */
function initRoomBookingButtons() {
  const roomBtns = document.querySelectorAll('.btn-room-book');
  roomBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const roomName = btn.getAttribute('data-room-name') || 'Habitación';
      const roomPrice = btn.getAttribute('data-room-price') || '700';

      const message = `¡Hola Hotel Capricornio! 👋\n` +
        `Me interesa reservar la:\n` +
        `✨ ${roomName} (Tarifa ref: ${roomPrice})\n\n` +
        `¿Podrían confirmarme disponibilidad y cómo realizar la reserva? ¡Gracias!`;

      const waUrl = `https://wa.me/50496336474?text=${encodeURIComponent(message)}`;
      window.open(waUrl, '_blank');
    });
  });
}

/* ===================================================================
   4. LIGHTBOX MODAL FOR IMAGES
   =================================================================== */
function initLightbox() {
  const modal = document.getElementById('imageModal');
  const modalImg = document.getElementById('modalImage');
  const modalCaption = document.getElementById('modalCaption');
  const closeBtn = document.getElementById('modalCloseBtn');

  if (!modal || !modalImg) return;

  const triggerElements = document.querySelectorAll('[data-lightbox]');
  triggerElements.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const imgSrc = item.getAttribute('data-lightbox-src') || item.getAttribute('src');
      const caption = item.getAttribute('data-lightbox-title') || item.getAttribute('alt') || 'Hotel Capricornio - Tela';

      modalImg.src = imgSrc;
      if (modalCaption) modalCaption.textContent = caption;
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

/* ===================================================================
   5. FAQ ACCORDION
   =================================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    if (questionBtn && answer) {
      questionBtn.addEventListener('click', () => {
        const isActive = item.classList.contains('active');

        // Close other items
        faqItems.forEach(other => {
          if (other !== item) {
            other.classList.remove('active');
            const otherAns = other.querySelector('.faq-answer');
            if (otherAns) otherAns.style.maxHeight = null;
          }
        });

        if (isActive) {
          item.classList.remove('active');
          answer.style.maxHeight = null;
        } else {
          item.classList.add('active');
          answer.style.maxHeight = answer.scrollHeight + 'px';
        }
      });
    }
  });
}
