/**
 * Marketing Alternativo - Microserviço Opcional de Envio de E-mails
 * Execute com: node server-email.js (requer npm install express nodemailer cors)
 */

const express = require('express');
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Configuração do Provedor de E-mail (Ex: Gmail, Hostgator, Resend, Sendgrid)
const transporter = nodemailer.createTransport({
    service: 'gmail', // ou host: 'smtp.seuprovedor.com', port: 465
    auth: {
        user: process.env.EMAIL_USER || 'seuemail@gmail.com',
        pass: process.env.EMAIL_PASS || 'suasenha-de-app'
    }
});

// Endpoint de Inscrição e Disparo Automático
app.post('/api/subscribe', async (req, res) => {
    const { email } = req.body;

    if (!email || !email.includes('@')) {
        return res.status(400).json({ error: 'E-mail inválido.' });
    }

    try {
        // Carrega o template HTML criado para a campanha
        const templatePath = path.join(__dirname, 'email-template.html');
        let htmlContent = fs.readFileSync(templatePath, 'utf8');

        const mailOptions = {
            from: '"Marketing Alternativo" <contato@marketingalternativo.com>',
            to: email,
            subject: '🚀 As Grandes Oportunidades do Marketing Digital | Bem-vindo!',
            html: htmlContent
        };

        await transporter.sendMail(mailOptions);
        console.log(`✅ E-mail VIP de oportunidades enviado com sucesso para ${email}`);

        return res.status(200).json({ 
            success: true, 
            message: 'E-mail de boas-vindas enviado com sucesso!' 
        });
    } catch (error) {
        console.error('❌ Erro ao enviar e-mail:', error);
        return res.status(500).json({ 
            error: 'Falha ao processar o disparo do e-mail.',
            details: error.message 
        });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor de e-mails rodando em http://localhost:${PORT}`);
});
