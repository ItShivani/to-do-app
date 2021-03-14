const MongoClient  = require('mongodb');
const bodyParser = require('body-parser')

var mongoClient = require('mongodb').MongoClient;
module.exports = function(app){

    app.use(
        bodyParser.urlencoded({
            extended:true
        })
    )
    app.use(bodyParser.json())
    var todoData = [{item: "Book Movie Ticket"}, {item:"Eat a Pizza"} ,{item:"Take pepper for a walk"}]

    // var url = "mongodb://localhost:27017";
    var url = "mongodb+srv://shivani:root123@cluster0.1iwdr.mongodb.net/itemdb?retryWrites=true&w=majority"
    var db;

    MongoClient.connect(url,(err,client) => { //client means success
        db = client.db('itemdb');
        db.collection('todo').find({}).toArray(function(err,docs) {//if collection is not there ok(theyll create when I post content) if there then it refers to todo collection and converts to array 
        docs.forEach(function(doc){
            d = doc.item
            console.log("Data :"+d)
        })
        console.log("Connected Successfully!!")
    })
})

    app.get("/",function(req,res){
        res.send("Welcome to my TodoApp..<br/> <a href='todo'> View Todo </a>")
    })

    //Get all the todos
    app.get("/todo",function(req,res){
        db.collection('todo').find({}).toArray(function(err,docs){
            /* docs.forEach(function (doc){               
            }) */
            todoData = docs
            res.render("todo", {todos:todoData})
           //res.send({todoData:todoData})
           res.end();
        })
        
    })

    //Insert a todo
    app.post("/todo",function(req,res){
        var itemName = req.body.itemName
        console.log("Posting data " + itemName) //after submit it will come here
        var myobj = {item : itemName}
        db.collection('todo').insertOne(myobj,function(err){
            if(err)
                console.log("Some error occurred "+err)

            console.log("Item saved : " +itemName)
        })
        res.redirect("todo")
        /* db.collection('todo').find({}).toArray(function (err,docs){
            docs.forEach(function(doc){
            })
            todoData = docs
            res.render("todo",{todos:todoData})
        }) */
    })

    //Delete a todo
    app.route("/remove/:id").get((req,res)=>{
        let id = req.params.id
        console.log("Deleting data "+ id)
     //  var myobj = {item : item}
        db.collection('todo').deleteOne({"_id": new MongoClient.ObjectId(id)},function(err){
            if(err)
                console.log("Error occurred in deleting "+err)
            console.log("Item deleted: "+id)
            res.redirect("/todo") 
        })     
        
    })

    //Update a todo
    app.route("/update/:id").get((req,res)=>{
        let id = req.params.id
        console.log("Updating data "+ id)
        db.collection('todo').updateOne({"_id": new MongoClient.ObjectID(id)},{$set:{item:item}},function(err){
            if(err)
                console.log("Error occurred in updating "+err)
            console.log("Item updated: "+id)
            res.redirect("/todo")
        })
        
    })
}