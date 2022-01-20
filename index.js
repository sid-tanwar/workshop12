const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const User = require("./models/User");

dotenv.config();

mongoose.connect(process.env.MONGO_URI, () => console.log("DB IS CONNECTED!"));



app.set("view engine", "ejs");
app.use(bodyParser.json());

app.get("/", (req, res) => {

    res.render("index");
})

app.post("/post", (req, res) => {

    const user = new User({

        name: req.body.name,
        email: req.body.email
    })

    const createdUser = user.save().
        then(result => {

            res.status(200).json({

                createdUser: result
            });


        });
});

app.get("/get", async (req, res) => {

    let { page, size } = req.query;

    if (!page) {

        page = 1;

    }
    if (!size) {

        size = 4;
    }

    const limit = parseInt(size);
    const skip = (page - 1) * size;
    var mySort = { name: 1 };

    await User.find().limit(limit).skip(skip).sort(mySort).then(posts => {
        res.status(200).json({ page, size, posts })
    });


});



app.get("/search", async (req, res) => {

    const searchName = req.query.name;
    const searchEmail = req.query.email;
    var regex1 = new RegExp(searchEmail, 'i');
    var regex2 = new RegExp(searchName, 'i');

    await User.find({ email: regex1, name: regex2 }).then(posts => {

        res.status(200).json({ posts });
    });
})

const port = process.env.PORT;
app.listen(port, () => console.log(`THE SERVER IS UP AND RUNNING AT PORT ${port}`));
