const express= require("express")
const bodyParser= require("body-parser")
const ejs= require("ejs")
const path= require("path")
const _ = require("lodash")
const mongoose= require("mongoose")
const app= express()

const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

app.set('view engine', 'ejs')

app.use(express.json())
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static("public"))

mongoose.connect("mongodb://127.0.0.1/blogPost")
.then( ()=>{
    console.log("mongodb connected succesfully");
})
.catch( (err)=>{
    console.log("the error in connecting to mongodb is  ",err);
})

const blogSchema = new mongoose.Schema({
    title: String,
    body: String
})

const Blog= new mongoose.model('Blog',blogSchema)

const blog1= new Blog({
    title: "Default blog 1",
    body: "Lacus vel facilisis volutpat est velit egestas dui id ornare.  erat pellentesque adipiscing."
})
const blog2= new Blog({
    title: "Default blog 2",
    body: "Lacus vel facilisis volutpat est velit egestas dui id ornare.  erat pellentesque adipiscing."
})
//blog1.save();


app.get("/", function(req, res){
    Blog.find({})
        .then( (answer)=>{
            console.log("the answer is ", answer)
            if(answer.length === 0)
            {
                const startingBlogs=[blog1,blog2];
                try{
                    console.log("inside then block");
                    Blog.insertMany(startingBlogs)
                }
                catch{ (err)=>{
                console.log("errorrr   ",err);
                }}
    
            }
            res.render("home", {toPrint: "today", newItems: answer})
        })
    .catch( (err)=>{
        console.log("error in finding the default blog is ", err);
    })
})


app.get("/about", function(req,res){
    res.render("about",{aboutContent: aboutContent})
});
app.get("/contact", function(req,res){
    res.render("contact",{contactContent: contactContent})
});

app.get("/compose", function(req, res){
    res.render("compose")
});


// app.post("/home", function(req, res){
//     const blog2= new Blog({
//         title: req.body.postTitle,
//         body: req.body.postBody
//     })
//     blog2.save();
//     res.redirect("/")
// })

app.post("/compose", function(req,res){
    const blog2= new Blog({
        title: req.body.postTitle,
        body: req.body.postBody
    })
    blog2.save();
    res.redirect("/")
    
})

app.get("/posts/:postName", function(req,res){

    //console.log(req.params.postName);
    const requestedTitle= _.lowerCase(req.params.postName);

  //  _.lowerCase([string='']) for array of strings
  //this basically removes any special characters and converts everything to lower case 
  //so when title is Another post and we are searching for localhost:3000/posts/another-post, 
  //it matches (if condition is satisfied) and console logs "match found"

    posts.forEach(function(post){ 

        const storedTitle= _.lowerCase(post.title);
        if(storedTitle === requestedTitle)
        {
            //console.log("match found!");
            res.render("post", 
                {blogTitle: post.title,
                blogStory: post.content}
            );
        }

    })

})


app.listen(3004, function(req,res){
    console.log("server has started on port 3006");
})