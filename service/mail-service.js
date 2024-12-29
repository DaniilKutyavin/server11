const nodemailer = require('nodemailer');

class MailService {

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port:process.env.SMTP_PORT,
            secure:true, 
            auth:{
                user: process.env.SMTP_USER,
                pass:process.env.SMTP_PASSWORD
            }
        })

    }
    async sendActivationMail(to, link) {
        await this.transporter.sendMail({
            from:process.env.SMTP_USER,
            to,
            subject:'Активация аккаунта на'+ process.env.API_URL,
            text:'',
            html:
            `
                <div>
                    <h1>Для активации перейдите по ссылке</h1>
                    <a href="${link}">${link}</a>
                </div>
                `
        })
    }
    async sendOrderNotification(to, order) {
        const { phone, fio, city, email, comment, giftId, paymentMethod } = order;

        await this.transporter.sendMail({
            from: process.env.SMTP_USER,
            to,
            subject: 'Новый заказ поступил',
            text: '',
            html: `
                <div>
                    <h1>Новый заказ</h1>
                    <p><strong>ФИО:</strong> ${fio}</p>
                    <p><strong>Телефон:</strong> ${phone}</p>
                    <p><strong>Город:</strong> ${city}</p>
                    <p><strong>Комментарий:</strong> ${comment}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Метод оплаты:</strong> ${paymentMethod}</p>
                    <p><strong>ID подарка:</strong> ${giftId || 'Не выбран'}</p>
                </div>
            `
        });
    }
}
module.exports = new MailService()