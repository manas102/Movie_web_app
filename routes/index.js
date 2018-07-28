const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

var Schema = mongoose.Schema;
mongoose.connect('mongodb://localhost/Movie', function(err) {
    if (!err) {
        console.log("no error!")
    }
});
var doc = mongoose.model('movies', new Schema({ name: String }));



router.get('/', ensureAuthenticated, (req, res, next) => {
    let name = req.query.search;
    var lname = "";
    if (name) {
        lname = name.toLowerCase();
        console.log("-------------------------" + lname);
    }
    var re = new RegExp(lname);
    doc.find({}, function(err, collection) {
        //console.log(collection)
        const s_res = JSON.stringify(collection);
        const j_res = JSON.parse(s_res);
        var arr = [];
        j_res.forEach(element => {
            if (element.Name.toLowerCase().includes(lname))
                arr.push(element);
        });

        //console.log(j_res[0].Name);
        res.render('index.ejs', { data: arr, layout: false });
    })
});

router.get('/genere/:gnr', ensureAuthenticated, (req, res) => {
    let name = req.query.search;
    var lname = "";
    if (name) {
        lname = name.toLowerCase();
        console.log("-------------------------" + lname);
    }

    let genere = req.params.gnr;
    doc.find({ Genere: genere }, function(err, collection) {
        const s_res = JSON.stringify(collection);
        const j_res = JSON.parse(s_res);

        var arr = [];
        j_res.forEach(element => {
            if (element.Name.toLowerCase().includes(lname))
                arr.push(element);
        });

        res.render('genere.ejs', { data: arr, layout: false, gnr: genere });

    })
});
router.get('/country/:ctr', ensureAuthenticated, (req, res) => {
    let name = req.query.search;
    var lname = "";
    if (name) {
        lname = name.toLowerCase();
        console.log("-------------------------" + lname);
    }
    let country = req.params.ctr;
    doc.find({ Country: country }, function(err, collection) {
        const s_res = JSON.stringify(collection);
        const j_res = JSON.parse(s_res);
        var arr = [];
        j_res.forEach(element => {
            if (element.Name.toLowerCase().includes(lname))
                arr.push(element);
        });
        res.render('country.ejs', { data: arr, layout: false, ctr: country });
    })
});

router.get('/watch_movie/:path', ensureAuthenticated, (req, res) => {
    console.log(req.user);
    let m_path = req.params.path;
    console.log(m_path);
    doc.find({ Name: m_path }, function(err, collection) {
        const s_res = JSON.stringify(collection);
        const j_res = JSON.parse(s_res);
        console.log(j_res[0].Comment);
        var arr = [];
        arr = j_res[0].Comment;
        res.render('watch_movie.ejs', { stuff: j_res[0], comments: arr, layout: false, name: m_path });
    });
});
router.post('/watch_movie/:path', ensureAuthenticated, (req, res) => {
    let m_path = req.params.path;
    var now = new Date().toString().substr(0, 15);
    var query = { Name: m_path };
    console.log(req.body.comment);
    var update = {
        username: req.user.username,
        userID: req.user._id,
        body: req.body.comment,
        createdAt: now
    };
    mongoose.connection.db.collection('movies').update({ Name: m_path }, { $set: { Comment: update } },
        function(error) {
            if (error) {
                console.log(error);
            } else {
                console.log('updated');
                res.redirect('/watch_movie/' + m_path);
            }
        });

});

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        //req.flash('error_msg','You are not logged in');
        res.redirect('/users/login');
    }
}

module.exports = router;