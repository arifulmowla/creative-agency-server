var express = require('express')
var cors = require('cors')
var bodyParser = require('body-parser')
require('dotenv').config()
var admin = require('firebase-admin');

const MongoClient = require('mongodb').MongoClient;

var app = express()
app.use(cors())
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

var serviceAccount = require("./creative-agency-frontend-firebase-adminsdk-wr4ja-f7a85b6f45.json");
const { ObjectId } = require('mongodb');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://creative-agency-frontend.firebaseio.com"
});

// database 

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.l97ey.mongodb.net/doctorsPortal?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    
    const orderCollection = client.db("creativeAgency").collection("orders");
    const reviewCollection = client.db("creativeAgency").collection("reviews");
    const adminCollection = client.db("creativeAgency").collection("admins");
    const serviceCollection = client.db("creativeAgency").collection("services");
    console.log( "working", err)
    app.get('/', function (req, res) {
        res.send('Api is here!')
    })


    // add order by user
    app.post('/add-order', function (req, res) {
       
        let order = req.body.data;
        const token = req.body.token;
        console.log(order, token)

        // check token
        admin.auth().verifyIdToken(token)
        .then(function(decodedToken) {
            let uid = decodedToken.uid;
            order.uid = uid;
            orderCollection.insertOne(order).then((result) => {
            if (result.insertedCount) {
                res.status(200).send(JSON.stringify(result.insertedCount))
            } 
        })
        })
            .catch((error)=> {
            res.status(400).send('Bad Request')
            console.log(error)
        });
        
    })


    // get all orders data
    app.post('/get-orders', (req, res) => { 
        let token = req.body.token;
        // check token
        admin.auth().verifyIdToken(token)
            .then((decodedToken) => {
                let uid = decodedToken.uid;
    
                orderCollection.find({ uid: uid }).toArray((arr, documents) => {
                    console.log(documents)
                    res.status(200).send(documents);
                })
        }).catch((error)=> {
            res.status(400).send('Bad Request')
            console.log(error)
        });
    })


    // user review added
     app.post('/add-review', function (req, res) {
       
        let review = req.body.review;
        const token = req.body.token;
        console.log(review, token)

        // check token
        admin.auth().verifyIdToken(token)
        .then(function(decodedToken) {
            let uid = decodedToken.uid;



            reviewCollection.find({ uid: uid }).toArray((arr, documents) => {
                if (documents.length < 1) {
                         review.uid = uid;
                            reviewCollection.insertOne(review).then((result) => {
                            if (result.insertedCount) {
                                res.status(200).send(JSON.stringify(result.insertedCount))
                            } 
                        })
                } else {
                    const existsID = documents[0]._id;
                    reviewCollection.updateOne({ _id: existsID }, {
                        $set: review
                    })
                    .then(result => console.log(result))


                    }
               
                })

           
        })
            .catch((error)=> {
            res.status(400).send('Bad Request')
            console.log(error)
        });
        
     })
    
        // get all review data
    app.post('/get-review', (req, res) => { 
        let token = req.body.token;
        // check token
        admin.auth().verifyIdToken(token)
            .then((decodedToken) => {
                let uid = decodedToken.uid;
    
                reviewCollection.find({ uid: uid }).toArray((arr, documents) => {
                    console.log(documents)
                    res.status(200).send(documents);
                })
        }).catch((error)=> {
            res.status(400).send('Bad Request')
            console.log(error)
        });
    })


    /// ======> admin 
    // get all orders data
    app.post('/get-all-orders', (req, res) => { 
        console.log("chek")
        let token = req.body.token;
        // check token
        admin.auth().verifyIdToken(token)
            .then((decodedToken) => {
                let uid = decodedToken.uid;
                let mail = decodedToken.email;
                console.log("mail", mail);
    
                adminCollection.find({ email: mail }).toArray((arr, document) => {
                    console.log("length", document.length);
                    if (document.length > 0) {
                         orderCollection.find({}).toArray((arr, documents) => {
                    console.log('test',documents)
                    res.status(200).send(documents);
                })
                    } else {
                        res.status(400).send('Bad Request')
                    }
                })
               
        }).catch((error)=> {
            res.status(400).send('Bad Request')
            console.log(error)
        });
    })


    // add service
    app.post('/add-service', function (req, res) {
       
        let service = req.body.service;
        const token = req.body.token;
        console.log(service, token)

        // check token
        admin.auth().verifyIdToken(token)
        .then(function(decodedToken) {
            let uid = decodedToken.uid;

            let mail = decodedToken.email;
            console.log(mail)

            adminCollection.find({ email: mail }).toArray((arr, document) => {
                    console.log(document.length);
                    if (document.length) {
                         serviceCollection.insertOne(service).then((result) => {
                            if (result.insertedCount) {
                                res.status(200).send(JSON.stringify(result.insertedCount))
                            } 
                        })
                    } else {
                        res.status(400).send('Bad Request')
                    }
                })        
        })
            .catch((error)=> {
            res.status(400).send('Bad Request')
            console.log(error)
        });
        
    })



    // add admin
    app.post('/add-admin', function (req, res) {
       
        let adminData = req.body.admin;
        const token = req.body.token;
        console.log(adminData, token)

        // check token
        admin.auth().verifyIdToken(token)
        .then(function(decodedToken) {
            let uid = decodedToken.uid;

            let mail = decodedToken.email;
            console.log(mail)

            adminCollection.find({ email: mail }).toArray((arr, document) => {
                    console.log(document.length);
                    if (document.length) {
                         adminCollection.insertOne(adminData).then((result) => {
                            if (result.insertedCount) {
                                res.status(200).send(JSON.stringify(result.insertedCount))
                            } 
                        })
                    } else {
                        res.status(400).send('Bad Request')
                    }
                })        
        })
            .catch((error)=> {
            res.status(400).send('Bad Request')
            console.log(error)
        });    
    })


    /// ========> HOme page open api
    // home page services
    app.get('/get-services', function (req, res) {
        serviceCollection.find({}).toArray((arr, document) => {
            res.status(200).send(document);
            
        })
    })
    
    // homepage feedback
    app.get('/get-feedback', function (req, res) {
        reviewCollection.find({}).toArray((arr, document) => {
            res.status(200).send(document);
            
        })
    })

    // admin login checking
    app.post('/admin', function (req, res) {

        console.log(req.body)
        const email = req.body.email;
        console.log('check mail', email)
        adminCollection.find({ email: email }).toArray((arr, document) => {

            res.status(200).send(JSON.stringify(document.length));
            
        })
    })


    // change status
    app.post('/change-status', function (req, res) {
       
        let data = req.body.data;
        const token = req.body.token;
        console.log(data._id, token)

        // check token
        admin.auth().verifyIdToken(token)
        .then(function(decodedToken) {
            let uid = decodedToken.uid;

            let mail = decodedToken.email;
            console.log(mail)

            adminCollection.find({ email: mail }).toArray((arr, document) => {
                    console.log(document.length);
                    if (document.length) {
                         orderCollection.updateOne({_id: ObjectId(data._id)}, {$set: {status: data.status}}).then((result) => {
                            console.log(result)
                        })
                    } else {
                        res.status(400).send('Bad Request')
                    }
                })        
        })
            .catch((error)=> {
            res.status(400).send('Bad Request')
            console.log(error)
        });    
    })


    

});




app.listen(5000 || process.env.PORT)