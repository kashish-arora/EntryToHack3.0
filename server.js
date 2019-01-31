require("dotenv").load();

var express     = require("express"),
    ejs = require("ejs"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    flash       = require("connect-flash"),
    passport    = require("passport"),
    LocalStrategy = require("passport-local"),
    methodOverride = require("method-override"),
    Mentor   = require("./models/mentor"),
    Admin   = require("./models/admin"),
    Team         = require("./models/team");

//requiring routes
var indexRoutes      = require("./routes/index");
var mentorRoutes      = require("./routes/mentor");
var teamRoutes      = require("./routes/team");
var adminRoutes      = require("./routes/admin");
var url = process.env.DATABASEURL || "mongodb://localhost/entry_to_hack3";
mongoose.connect(url);
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

// PASSPORT CONFIGURATION
app.use(require("express-session")({
   secret: "Hack hai ye hack",
   resave: false,
   saveUninitialized: false
}));
app.use(passport.initialize());

app.use(passport.session());

passport.use('mentor', new LocalStrategy(usedStrategy = 'mentor', Mentor.authenticate()));
// passport.serializeUser(Mentor.serializeUser());
// passport.deserializeUser(Mentor.deserializeUser());
passport.use('team', new LocalStrategy(usedStrategy = 'team', Team.authenticate()));
// passport.serializeUser(Team.serializeUser());
// passport.deserializeUser(Team.deserializeUser());
passport.use('admin', new LocalStrategy(usedStrategy = 'admin', Admin.authenticate()));

passport.serializeUser(
 function(user, done){
  if(isMentor(user)){
    console.log(user);
    Mentor.serializeUser();
  done(null, user);
  } else if (isTeam(user)){
        console.log("Team");
    Team.serializeUser();
  done(null, user);
  } else if(isAdmin(user)){
    console.log(user);
   Admin.serializeUser();
  done(null, user);
  }
 }); 
passport.deserializeUser(
 function(user, done){
  if(isMentor(user)){
    Mentor.deserializeUser();
  done(null, user);
  } else if (isTeam(user)){
    Team.deserializeUser();
  done(null, user);
  } else if(isAdmin(user)){
   Admin.deserializeUser();
  done(null, user);
  }
 }); 
// // passport.deserializeUser(Admin.deserializeUser());

function isMentor(user){
  if (user instanceof Mentor)
        console.log("Mentor");
    return true;
}
function isTeam(user){
  if (user instanceof Team)
        console.log("Team");
    return true;
}
function isAdmin(user){
  if (user instanceof Admin)
        console.log("Admin");
    return true;
}

app.use(function (req, res, next) {
  // res.locals.currentTeam = req.username;
  res.locals.mentor = req.user;
  res.locals.team = req.user;
  res.locals.admin = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

app.use("/", indexRoutes);
app.use("/mentor", mentorRoutes);
app.use("/team", teamRoutes);
app.use("/admin", adminRoutes);


console.log(process.env.PORT);

app.listen(process.env.PORT || 3000, process.env.IP, () => {
    console.log("Port up and running");
});
