/**
 * Marketing Alternativo - Core Script
 * Módulo de Validação, Modal de Diagnóstico, Máscara de Telefone, Integração WhatsApp & LocalStorage
 */

document.addEventListener('DOMContentLoaded', () => {
    // -------------------------------------------------------------
    // 0. CONTROLE DO MODAL DE DIAGNÓSTICO GRATUITO
    // -------------------------------------------------------------
    const diagnosticModal = document.getElementById('diagnostic-modal');
    const modalCloseBtn = document.getElementById('modal-close-btn');
    const modalBackdrop = diagnosticModal ? diagnosticModal.querySelector('.modal-backdrop') : null;
    const openModalButtons = document.querySelectorAll('.open-modal-btn');
    const nameInput = document.getElementById('lead-name');
    const phoneInput = document.getElementById('lead-phone');
    const nameError = document.getElementById('name-error');
    const phoneError = document.getElementById('phone-error');
    const contactForm = document.getElementById('contact-form');
    const formMessage = document.getElementById('form-message');
    const submitBtn = document.getElementById('submit-btn');

    function openModal() {
        if (!diagnosticModal) return;
        diagnosticModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';

        // Foca automaticamente no campo de nome
        setTimeout(() => {
            if (nameInput) nameInput.focus();
        }, 120);
    }

    function closeModal() {
        if (!diagnosticModal) return;
        diagnosticModal.style.display = 'none';
        document.body.style.overflow = '';
        if (formMessage) {
            formMessage.style.display = 'none';
        }
    }

    // Ativa todos os botões com a classe .open-modal-btn
    openModalButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            openModal();
        });
    });

    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', closeModal);
    }

    if (modalBackdrop) {
        modalBackdrop.addEventListener('click', closeModal);
    }

    // Fecha ao pressionar ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && diagnosticModal && diagnosticModal.style.display === 'flex') {
            closeModal();
        }
    });

    // -------------------------------------------------------------
    // 1. MÁSCARA INTELIGENTE DE TELEFONE (PADRÃO BRASILEIRO)
    // -------------------------------------------------------------
    function applyPhoneMask(value) {
        if (!value) return '';
        let clean = value.replace(/\D/g, '');

        if (clean.length > 11) {
            clean = clean.slice(0, 11);
        }

        if (clean.length > 10) {
            return clean.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
        } else if (clean.length > 6) {
            return clean.replace(/^(\d{2})(\d{4})(\d{0,4})$/, '($1) $2-$3');
        } else if (clean.length > 2) {
            return clean.replace(/^(\d{2})(\d{0,5})$/, '($1) $2');
        } else {
            return clean.replace(/^(\d*)$/, '$1');
        }
    }

    if (phoneInput) {
        phoneInput.addEventListener('input', (e) => {
            e.target.value = applyPhoneMask(e.target.value);
            if (phoneInput.dataset.touched === 'true') {
                validatePhoneField();
            }
        });

        phoneInput.addEventListener('blur', () => {
            phoneInput.dataset.touched = 'true';
            validatePhoneField();
        });
    }

    if (nameInput) {
        nameInput.addEventListener('input', () => {
            if (nameInput.dataset.touched === 'true') {
                validateNameField();
            }
        });

        nameInput.addEventListener('blur', () => {
            nameInput.dataset.touched = 'true';
            validateNameField();
        });
    }

    // -------------------------------------------------------------
    // 2. FUNÇÕES DE VALIDAÇÃO DE CAMPOS
    // -------------------------------------------------------------
    function validateNameField() {
        if (!nameInput) return false;
        const name = nameInput.value.trim();
        if (!name) {
            showFieldError(nameInput, nameError, 'Por favor, informe seu nome.');
            return false;
        }
        if (name.length < 3) {
            showFieldError(nameInput, nameError, 'O nome deve ter no mínimo 3 caracteres.');
            return false;
        }
        clearFieldError(nameInput, nameError);
        return true;
    }

    function validatePhoneField() {
        if (!phoneInput) return false;
        const phone = phoneInput.value.trim();
        const clean = phone.replace(/\D/g, '');

        if (!clean) {
            showFieldError(phoneInput, phoneError, 'Por favor, informe seu WhatsApp ou telefone.');
            return false;
        }

        const ddd = parseInt(clean.substring(0, 2), 10);
        if (isNaN(ddd) || ddd < 11 || ddd > 99) {
            showFieldError(phoneInput, phoneError, 'Informe um DDD válido (ex: 85, 11, 21).');
            return false;
        }

        if (clean.length < 10) {
            showFieldError(phoneInput, phoneError, 'Número incompleto. Digite com DDD.');
            return false;
        }

        clearFieldError(phoneInput, phoneError);
        return true;
    }

    function showFieldError(inputEl, errorEl, message) {
        inputEl.classList.add('input-error');
        inputEl.classList.remove('input-valid');
        if (errorEl) {
            errorEl.textContent = message;
            errorEl.classList.add('visible');
        }
    }

    function clearFieldError(inputEl, errorEl) {
        inputEl.classList.remove('input-error');
        inputEl.classList.add('input-valid');
        if (errorEl) {
            errorEl.textContent = '';
            errorEl.classList.remove('visible');
        }
    }

    // -------------------------------------------------------------
    // 3. PERSISTÊNCIA LOCAL (LOCALSTORAGE)
    // -------------------------------------------------------------
    const LEADS_STORAGE_KEY = 'mkt_alternativo_leads';

    function saveLeadToLocalStorage(lead) {
        try {
            const stored = localStorage.getItem(LEADS_STORAGE_KEY);
            const leadsList = stored ? JSON.parse(stored) : [];
            leadsList.push(lead);
            localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(leadsList));
            console.log('✅ Lead salvo localmente:', lead);
        } catch (err) {
            console.warn('Não foi possível salvar no localStorage:', err);
        }
    }

    window.getStoredLeads = () => {
        const stored = localStorage.getItem(LEADS_STORAGE_KEY);
        const data = stored ? JSON.parse(stored) : [];
        console.table(data);
        return data;
    };

    window.clearStoredLeads = () => {
        localStorage.removeItem(LEADS_STORAGE_KEY);
        console.log('🗑️ Histórico de leads limpo com sucesso.');
    };

    // -------------------------------------------------------------
    // 4. SUBMISSÃO INTELIGENTE & ENVIO PARA WHATSAPP
    // -------------------------------------------------------------
    if (contactForm) {
        contactForm.addEventListener('submit', (event) => {
            event.preventDefault();

            if (nameInput) nameInput.dataset.touched = 'true';
            if (phoneInput) phoneInput.dataset.touched = 'true';

            const isNameValid = validateNameField();
            const isPhoneValid = validatePhoneField();

            if (!isNameValid || !isPhoneValid) {
                if (formMessage) {
                    formMessage.textContent = 'Revise os dados preenchidos nos campos acima.';
                    formMessage.className = 'form-message error';
                    formMessage.style.display = 'flex';
                }
                return;
            }

            const name = nameInput.value.trim();
            const phone = phoneInput.value.trim();

            setButtonLoading(true);

            // 1. Cria e salva lead
            const newLead = {
                id: 'lead_' + Date.now(),
                name: name,
                phone: phone,
                timestamp: new Date().toISOString(),
                dateFormatted: new Date().toLocaleString('pt-BR'),
                source: 'Modal Diagnóstico Gratuito'
            };
            saveLeadToLocalStorage(newLead);

            // 2. Prepara link do WhatsApp
            const agencyWhatsApp = '5585996485562';
            const messageBody = `Olá! Meu nome é *${name}* (${phone}).\n\nAcabei de solicitar meu *Diagnóstico Gratuito* pelo site da Marketing Alternativo e gostaria de conversar com um especialista!`;
            const waUrl = `https://wa.me/${agencyWhatsApp}?text=${encodeURIComponent(messageBody)}`;

            setTimeout(() => {
                setButtonLoading(false);

                const waWindow = window.open(waUrl, '_blank');

                if (formMessage) {
                    formMessage.className = 'form-message success';
                    formMessage.style.display = 'flex';

                    if (!waWindow || waWindow.closed || typeof waWindow.closed === 'undefined') {
                        formMessage.innerHTML = `
                            <span><strong>Diagnóstico Registrado!</strong> Não conseguimos abrir o WhatsApp automaticamente.</span>
                            <a href="${waUrl}" target="_blank" class="whatsapp-redirect-btn">
                                <i class="fa-brands fa-whatsapp"></i> Continuar no WhatsApp
                            </a>
                        `;
                    } else {
                        formMessage.innerHTML = `
                            <span><strong>🎉 Solicitação enviada com sucesso!</strong></span>
                            <span style="font-size: 13px; color: #cbd5e1;">Abrimos o WhatsApp para seu atendimento. Se não abriu:</span>
                            <a href="${waUrl}" target="_blank" class="whatsapp-redirect-btn">
                                <i class="fa-brands fa-whatsapp"></i> Abrir WhatsApp Manualmente
                            </a>
                        `;
                    }
                }

                contactForm.reset();
                if (nameInput) {
                    nameInput.classList.remove('input-valid', 'input-error');
                    nameInput.dataset.touched = 'false';
                }
                if (phoneInput) {
                    phoneInput.classList.remove('input-valid', 'input-error');
                    phoneInput.dataset.touched = 'false';
                }

            }, 800);
        });
    }

    function setButtonLoading(isLoading) {
        if (!submitBtn) return;
        const btnText = submitBtn.querySelector('.btn-text');
        const btnIcon = submitBtn.querySelector('.btn-icon');
        const btnSpinner = submitBtn.querySelector('.btn-spinner');

        if (isLoading) {
            submitBtn.disabled = true;
            if (btnText) btnText.textContent = 'Enviando solicitação...';
            if (btnIcon) btnIcon.style.display = 'none';
            if (btnSpinner) btnSpinner.style.display = 'inline-block';
        } else {
            submitBtn.disabled = false;
            if (btnText) btnText.textContent = 'Quero Meu Diagnóstico Gratuito';
            if (btnIcon) btnIcon.style.display = 'inline-block';
            if (btnSpinner) btnSpinner.style.display = 'none';
        }
    }

    // -------------------------------------------------------------
    // 5. FAQ ACCORDION INTERATIVO
    // -------------------------------------------------------------
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const questionBtn = item.querySelector('.faq-question');
        if (questionBtn) {
            questionBtn.addEventListener('click', () => {
                const isActive = item.classList.contains('active');

                faqItems.forEach(otherItem => {
                    otherItem.classList.remove('active');
                });

                if (!isActive) {
                    item.classList.add('active');
                }
            });
        }
    });

    // -------------------------------------------------------------
    // 6. SCROLL SUAVE PARA LINKS INTERNOS
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