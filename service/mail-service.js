const nodemailer = require('nodemailer');

class MailService {

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port:process.env.SMTP_PORT,
            secure:false, 
            auth:{
                user: process.env.SMTP_USER,
                pass:process.env.SMTP_PASSWORD
            },
            tls: {
                rejectUnauthorized: false // Для тестов, если есть проблемы с сертификатом
            }
        })

    }
    async sendActivationMail(to, link) {
        await this.transporter.sendMail({
            from:process.env.SMTP_USER,
            to,
            subject:'Активация аккаунта на '+ process.env.API_URL,
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
    async sendPromoCode(to, promoCode) {
        await this.transporter.sendMail({
          from: process.env.SMTP_USER,
          to,
          subject: 'Ваш промокод',
          text: '',
          html: `
            <div>
              <h1>Поздравляем с успешной регистрацией!</h1>
              <p>Ваш персональный промокод: <strong>${promoCode}</strong></p>
              <p>Используйте его для получения скидки или бонусов.</p>
            </div>
          `
        });
      }
}
module.exports = new MailService()