const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000

const stripe = require('stripe')('sk_test_HuUf0P92AbtUOXRdMaAOvqI8');
stripe.applePayDomains.create({
  domain_name: 'apple-pay-sandbox.herokuapp.com'
});


express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .post('/charges', async (req, res) => {
  const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'T-shirt',
            },
            unit_amount: 1000,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: 'https://apple-pay-sandbox.herokuapp.com/success',
      cancel_url: 'https://apple-pay-sandbox.herokuapp.com/cancel',
    });

    res.redirect(303, session.url);
  })
  .get('/', (req, res) => res.render('pages/index'))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))
