var express = require('express');
var path = require('path');
var app = express();
var paypal = require('paypal-rest-sdk');

paypal.configure({
    'mode': 'sandbox',
    'client_id': 'Aem8OAY9UG86r7Y1yCZNFzYFbOOgHElAsAhnI5an80frKCuN77NCsW78Vrhj2hJ_PphdbBQ-4V3tdvqE',
    'client_secret': 'EIWRahUF-qgOHCx-BBp7DyevUhviJ9kXuzNCW75W-VCvN1vxRI2nyb7a7mPAnsTCzOAN4UDc2TU2d-Gg'
});

app.use('/', express.static(path.join(__dirname, 'src')));

app.get('/', (req, res) => {
    res.redirect('/paypal.html');
});

app.get('/buy', (req, res) => {
    var amount = req.query.amount || '20'; // Default to $20 if no amount is specified
    var payment = {
        "intent": "authorize",
        "payer": {
            "payment_method": "paypal"
        },
        "redirect_urls": {
            "return_url": "http://127.0.0.1:3000/success",
            "cancel_url": "http://127.0.0.1:3000/err"
        },
        "transactions": [{
            "amount": {
                "total": parseFloat(amount).toFixed(2),
                "currency": "USD"
            },
            "description": "A book on mean stack"
        }]
    };

    createPay(payment)
        .then((transaction) => {
            var id = transaction.id;
            var links = transaction.links;
            var counter = links.length;
            while (counter--) {
                if (links[counter].method == 'REDIRECT') {
                    return res.redirect(links[counter].href);
                }
            }
        })
        .catch((err) => {
            console.log(err);
            res.redirect('/err');
        });
});

app.get('/success', (req, res) => {
    console.log(req.query);
    res.redirect('/success.html');
});

app.get('/err', (req, res) => {
    console.log(req.query);
    res.redirect('/err.html');
});

app.listen(3000, () => {
    console.log(' app listening on 3000 ');
});

var createPay = (payment) => {
    return new Promise((resolve, reject) => {
        paypal.payment.create(payment, function (err, payment) {
            if (err) {
                reject(err);
            } else {
                resolve(payment);
            }
        });
    });
};
