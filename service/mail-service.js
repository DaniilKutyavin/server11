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
            },
           
        })

    }
    async sendActivationMail(to, link, promokod) {
        await this.transporter.sendMail({
            from: process.env.SMTP_USER,
            to,
            subject: 'Активация аккаунта на ' + process.env.API_URL,
            text: '',
            html: `
                <div style="font-family: Arial, sans-serif; color: #000; text-align: center;">
                    <h1 style="font-size: 24px;">Для активации перейдите по ссылке</h1>
                    <a href="${link}" style="color: #007bff; text-decoration: none;">${link}</a>
                    <br/><br/>
                    <p style="font-size: 16px;">Ваш промокод: <strong style="font-size: 20px; color: #ff5733;">${promokod}</strong></p>
                    <p>Скопируйте промокод и используйте его при оформлении заказа!</p>
                    <div style="border-top: 1px solid #ccc; margin-top: 30px; padding-top: 20px;">
                        <p style="margin: 0; font-size: 16px;"><strong>ASATAG | Территория счастливого фермера</strong></p>
                        <p style="margin: 5px 0;">+7(990)194-28-29</p>
                        <p style="margin: 5px 0;">
                            <a href="https://t.me/asatag" style="color: #007bff; text-decoration: none;">https://t.me/asatag</a><br/>
                            <a href="https://vk.com/asatag" style="color: #007bff; text-decoration: none;">https://vk.com/asatag</a><br/>
                            <a href="https://asatag.com" style="color: #007bff; text-decoration: none;">https://asatag.com</a>
                        </p>
                        <div style="margin: 20px 0;">
                            <img src="https://asatag.com/api/mail.jpg" alt="ASATAG" style="max-width: 150px;">
                        </div>
                        <p style="font-size: 14px; color: #555;">С уважением, команда<br/><strong>Asatrian Trading Group</strong></p>
                    </div>
                </div>
            `
        });
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