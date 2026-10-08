document.addEventListener('DOMContentLoaded', () => {
    // -------------------------------------------------------------
    // 1. FAQ Accordion Interativo
    // -------------------------------------------------------------
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const questionBtn = item.querySelector('.faq-question');
        questionBtn.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Fecha todos os outros itens para manter o accordion limpo
            faqItems.forEach(otherItem => {
                otherItem.classList.remove('active');
            });

            // Alterna o estado do item clicado
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });

    // -------------------------------------------------------------
    // 2. Manipulação e Feedback do Formulário
    // -------------------------------------------------------------
    const contactForm = document.getElementById('contact-form');
    const formMessage = document.getElementById('form-message');

    if (contactForm) {
        contactForm.addEventListener('submit', (event) => {
            event.preventDefault();

            const formData = new FormData(contactForm);
            const name = formData.get('name');
            const contact = formData.get('contact');

            if (name && contact && formMessage) {
                formMessage.textContent = '🎉 Diagnóstico solicitado com sucesso! Nossa equipe entrará em contato em breve.';
                formMessage.className = 'form-message success';
                formMessage.style.display = 'block';

                const btn = contactForm.querySelector('.submit-button');
                const originalContent = btn.innerHTML;
                btn.innerHTML = '<span>Solicitação Enviada! ✓</span>';
                btn.style.filter = 'brightness(1.2)';

                setTimeout(() => {
                    contactForm.reset();
                    formMessage.style.display = 'none';
                    btn.innerHTML = originalContent;
                    btn.style.filter = 'none';
                }, 4500);
            } else if (formMessage) {
                formMessage.textContent = 'Por favor, preencha seu nome e contato.';
                formMessage.className = 'form-message error';
                formMessage.style.display = 'block';
            }
        });
    }

    // -------------------------------------------------------------
    // 3. Efeito de Scroll Suave para Links Internos
    // -------------------------------------------------------------
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId && targetId !== '#') {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    e.preventDefault();
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
});