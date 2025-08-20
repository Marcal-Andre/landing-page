document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contact-form');
    const formMessage = document.getElementById('form-message');

    contactForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Impede o envio padrão do formulário

        const formData = new FormData(contactForm);
        const name = formData.get('name');
        const email = formData.get('email');
        const phone = formData.get('phone');
        const segment = formData.get('segment');
        const location = formData.get('location');
        const message = formData.get('message');

        // Validação básica para garantir que todos os campos obrigatórios foram preenchidos
        if (name && email && phone && segment && location) {
            // Aqui você poderia enviar os dados para um backend usando fetch()
            // Exemplo:
            // fetch('/api/contact', {
            //     method: 'POST',
            //     body: JSON.stringify({ name, email, phone, segment, location, message }),
            //     headers: { 'Content-Type': 'application/json' }
            // }).then(response => { ... });

            // Simula uma resposta de sucesso
            formMessage.textContent = 'Mensagem enviada! Aguarde nosso contato. Estamos ansiosos para conversar com você!';
            formMessage.className = 'form-message success';
            formMessage.style.display = 'block';

            // Limpa o formulário após 5 segundos
            setTimeout(() => {
                contactForm.reset();
                formMessage.style.display = 'none';
            }, 5000);

        } else {
            // Exibe mensagem de erro
            formMessage.textContent = 'Por favor, preencha todos os campos obrigatórios.';
            formMessage.className = 'form-message error';
            formMessage.style.display = 'block';
        }
    });
});