const mysql = require('mysql');
const express = require('express');
const bodyParser = require('body-parser');
const encoder = bodyParser.urlencoded({ extended: true });
const app = express();
const ejs = require('ejs');
const nodemailer = require('nodemailer');
const randomNumber = require('random-number');
const { dirs } = require('nodemon/lib/config');

app.use("/assets", express.static("assets"));
connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "jerome",
    database: "dbs_sbos_proj"
});
connection.connect(function (error) {
    if (error)
        throw error;
    else {
        console.log("listening to port 2000");
        console.log("DB sbos connected successfully");
    }
});
function generateOTP() {
    const options = {
        min: 1000,
        max: 9999,
        integer: true
    };

    return randomNumber(options);
}

// Function to send OTP via email
async function sendOTPByEmail(email, otp) {
    // Configure Nodemailer
    const transporter = nodemailer.createTransport({
        service: 'gmail', // e.g., 'gmail'
        auth: {
            user: 'sbosdbs@gmail.com',
            pass: 'urvd xjum gqgc xnzr'
        }
    });

    // Define email content
    const mailOptions = {
        from: 'sbosdbs@gmail.com',
        to: email,
        subject: 'Your OTP Code',
        text: `Your OTP code is: ${otp}`
    };

    // Send email
    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);
    } catch (error) {
        console.error('Error sending email: ', error);
    }
}


var mail;
app.post('/signup', encoder, (req, res) => {
    var otp = generateOTP();
    var a = "arthamvasu2002@gmail.com";
    sendOTPByEmail(a, otp);
    var a, b, c, d, e;
    a = req.body.input_field1;
    b = req.body.input_field2;
    c = req.body.input_field3;
    d = req.body.input_field4;
    e = req.body.input_field5;
    console.log(a);
    if (a == "") {
        res.render(__dirname + '/views/signup.ejs', { msg1: 'fields are empty' });
    }
    else if (d.length < 8 || d != e) {
        if (d.length < 8) {
            res.render(__dirname + '/views/signup.ejs', { msg1: 'password invalid' });
        } else {
            res.render(__dirname + '/views/signup.ejs', { msg1: 'passwords dont match' });
        }
    } else {
        connection.query("insert into user values (?,?,?,0,0," + b + ")", [a, c, d], (error, results) => {
            if (error) {
                console.error('error', error);
            }
            else {
                res.render(__dirname + '/views/home2.ejs', { msg1: '' });
            }
        })

    }

});
var mv;

app.post('/mov', encoder, (req, res) => {

    mv = req.body.show;
    console.log(mv);
    res.render(__dirname + '/views/mov_time.ejs', { msg1: mv });
});

var sh;
app.post('/dshow', encoder, (req, res) => {
    sh = req.body.show;
    console.log(sh);
    res.render(__dirname + '/views/show_n.ejs', { msg1: sh });
});

app.post('/login', encoder, (req, res) => {
    var type, pass, x;
    type = req.body.type;
    pass = req.body.pass;
    mail = req.body.mail;
    console.log(type, mail);
    if (!type) {
        res.render(__dirname + '/views/login.ejs', { msg1: 'select all attributes' });

    } else {
        if (type == "ven") {
            x = "vp";
        } else if (type == "User") {
            x = "user";
        } else if (type == "admin") {
            x = "org";
        } else {
            x = "th_org";
        }
        console.log("here" + x);
        connection.query("select * from " + x + " where mail = ? and passwd = ?", [mail, pass], function (error, results, fields) {
            console.log(results);
            console.log("here2");
            if (results) {
                if (results.length > 0 && x == "user") {
                    res.render(__dirname + '/views/home2.ejs', { msg1: '' });
                } else if (results.length > 0 && x == "vp") {
                    res.render(__dirname + '/views/venuep.ejs', { msg1: '' });
                } else if (results.length > 0 && x == "org") {
                    res.render(__dirname + '/views/org.ejs', { msg1: '' });
                } else if (results.length > 0 && x == "th_org") {
                    res.render(__dirname + '/views/th_home.ejs', { msg1: '' });
                } else {
                    res.render(__dirname + '/views/login.ejs', { msg1: 'INCORRECT PASSWORD OR USERNAME' });
                }
            }
            res.end();
        });
    }

});
app.get('/getshowinfo1', (req, res) => {
    connection.query('SELECT DISTINCT show_name, mimg FROM _show', (error, results) => {
        if (error) {
            console.error('Error: ', error);
            res.status(500).json({ error: 'An error occurred' });
        }
        else {
            console.log(results);
            res.json(results);
        }
    })
});
app.get('/getshowinfospecific', (req, res) => {
    var sn;
    sn = req.query.shown;
    sn = sn.trim();
    console.log(sn);
    connection.query('SELECT * FROM _show,venueue where _show.v_id = venueue.ven_id and show_name = ?', [sn], (error, results) => {
        if (error) {
            console.error('Error: ', error);
            res.status(500).json({ error: 'An error occurred' });
        }
        else {
            console.log(results);
            res.json(results);
        }
    })
});
app.get('/book', (req, res) => {
    var sn, seatno;
    sn = req.query.sn;
    seatno = req.query.sv1;
    console.log(sn + seatno + mail);
    sn = sn.trim();
    seatno = seatno.trim();
    mail = mail.trim();


    connection.query('insert into show_seats values(?,' + seatno + ',?,1000)', [sn, mail], (error, results) => {
        if (error) {
            console.error('Error: ', error);
            res.status(500).json({ error: 'An error occurred' });
        }
        else {
            console.log(results);
            res.json(results);
        }
    })
});
// Define the route to handle POST requests to /addshow
app.post('/addshow', encoder, (req, res) => {
    const { show_id, show_name, v_id, performer_name, event_date, org_name } = req.body;

    // Perform validation if necessary

    connection.query(
        'UPDATE _show SET show_name = ?, v_id = ?, performer_name = ?, event_date = ?, org_name = ? WHERE show_id = ?',
        [show_name, v_id, performer_name, event_date, org_name, show_id],
        (error, results) => {
            if (error) {
                console.error('Error updating show:', error);
                res.status(500).json({ error: 'An error occurred while updating the show' });
            } else {
                if (results.affectedRows > 0) {
                    console.log('Show updated successfully');
                    res.status(200).json({ message: 'Show updated successfully' });
                } else {
                    console.log('Show with the provided ID does not exist');
                    res.status(404).json({ error: 'Show with the provided ID does not exist' });
                }
            }
        }
    );
});



app.get('/getshowinfo', (req, res) => {
    connection.query('SELECT DISTINCT show_, rating, mvimg FROM room', (error, results) => {
        if (error) {
            console.error('Error: ', error);
            res.status(500).json({ error: 'An error occurred' });
        }
        else {
            console.log(results);
            res.json(results);
        }
    })
});
app.get('/getuserinfo', (req, res) => {
    mail = mail.trim();
    connection.query('SELECT * FROM user where mail = ?', [mail], (error, results) => {
        if (error) {
            console.error('Error: ', error);
            res.status(500).json({ error: 'An error occurred' });
        }
        else {
            console.log(results);
            res.json(results);
        }
    })
});
app.get('/addcreds', (req, res) => {
    mail = mail.trim();
    var credits = req.query.credits;
    credits = credits.trim();
    connection.query('update user set credits = ? where mail = ?', [parseInt(credits), mail], (error, results) => {
        if (error) {
            console.error('Error: ', error);
            res.status(500).json({ error: 'An error occurred' });
        }
        else {
            console.log(results);
            res.json(results);
        }
    })
});
app.get('/venues', (req, res) => {
    connection.query('select * from venueue', (error, results) => {
        if (error) {
            console.error('Error: ', error);
            res.status(500).json({ error: 'An error occurred' });
        }
        else {
            console.log(results);
            res.json(results);
        }
    })
});
app.get('/insven', (req, res) => {
    mail = mail.trim();
    var vid = req.query.vid;
    console.log(vid);
    vid = parseInt(vid);
    var vn = req.query.vn.trim();
    var cost = req.query.cost.trim();
    cost = parseInt(cost);
    var cap = req.query.cap.trim();
    cap = parseInt(cap);
    var loc = req.query.loc.trim();
    var des = req.query.des.trim();
    var fp = req.query.fp.trim();
    connection.query('insert into venueue values(' + vid + ',?,?,?,NULL,' + cap + ',?,' + cost + ',?)', [vn, mail, fp, des, loc], (error, results) => {
        if (error) {
            console.error('Error: ', error);
            res.status(500).json({ error: 'An error occurred' });
        }
        else {
            console.log(results);
            res.json(results);
        }
    })
});
app.get('/insmov', (req, res) => {
    mail = mail.trim();
    var thid = req.query.thid.trim();
    console.log(thid);
    thid = parseInt(thid);
    var mvid = req.query.mvid.trim();
    mvid = parseInt(mvid);
    var rmid = req.query.rmid.trim();
    rmid = parseInt(rmid);

    var mname = req.query.mname.trim();

    var datet = req.query.datet.trim();
    var imdb = req.query.imdb.trim();
    var rating = 'imdb - ' + imdb;
    imdb = parseInt(imdb);
    var fp = req.query.fp.trim();
    connection.query('insert into room values(' + thid + ',' + mvid + ',?,?,' + rmid + ',?,?,' + imdb + ')', [mname, datet, rating, fp], (error, results) => {
        if (error) {
            console.error('Error: ', error);
            res.status(500).json({ error: 'An error occurred' });
        }
        else {
            console.log(results);
            res.json(results);
        }
    })
});
app.get('/', (req, res) => {
    res.render(__dirname + '/views/login.ejs', { msg1: '' });
});
app.get('/signup', (req, res) => {
    res.render(__dirname + '/views/signup.ejs', { msg1: '' });
});

app.get('/home2', (req, res) => {
    res.render(__dirname + '/views/home2.ejs', { msg1: '' });
});
app.get('/venuep', (req, res) => {
    res.render(__dirname + '/views/venuep.ejs', { msg1: '' });
});
app.get('/log', (req, res) => {
    res.render(__dirname + '/views/log.ejs', { msg1: '' });
});
app.get('/forgotpassword', (req, res) => {
    res.render(__dirname + '/views/forgotpassword.ejs', { msg1: '' });
});
app.get('/seates', (req, res) => {
    res.render(__dirname + '/views/seates.ejs', { msg1: '' });
});
app.get('/mov_time', (req, res) => {
    res.render(__dirname + '/views/mov_time.ejs', { msg1: '' });
});
app.get('/th_home', (req, res) => {
    res.render(__dirname + '/views/th_home.ejs', { msg1: '' });
});
app.get('/org', (req, res) => {
    res.render(__dirname + '/views/org.ejs', { msg1: '' });
});

app.get('/view_movies', (req, res) => {
    res.render(__dirname + '/views/view_movies.ejs', { msg1: '' });
});
app.get('/show', (req, res) => {
    res.render(__dirname + '/views/show.ejs', { msg1: '' });
});
app.get('/movies', (req, res) => {
    res.render(__dirname + '/views/movies.ejs', { msg1: '' });
});
app.get('/show_n', (req, res) => {
    res.render(__dirname + '/views/show_n.ejs', { msg1: '' });
});
app.get('/userprofile', (req, res) => {
    res.render(__dirname + '/views/userprofile.ejs', { msg1: mail });
});
app.listen(2000);