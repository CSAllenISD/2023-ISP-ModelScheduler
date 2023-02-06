import Vapor
import Fluent
import FluentMySQLDriver
import Crypto


func routes(_ app: Application) throws {

    app.get { req in
        req.redirect(to: "./login")
    }
    
    app.get("") {req in
        req.redirect(to: "./login")
    }

           
    app.get("index.html") {req in
        req.redirect(to: "./index")
    }

    app.get("classes.html") {req in
        req.redirect(to: "./classes")
    }
    
    app.get("scheduler.html") {req in
        req.redirect(to: "./scheduler")
    }

    app.get("FAQ.html") {req in
        req.redirect(to: "./FAQ")
    }
     
    app.get("final.html") {req in
        req.redirect(to: "./final")
    }
    
    app.get("login") {req in
        req.view.render("login.html")
    }

    app.get("createuser.html") {req in
        req.redirect(to: "./createuser")
    }
    
    app.get("createuser") {req in
        req.view.render("createuser.html")
    }


    /// START LOGIN AND ACCOUNT CREATION ENDPOINTS
    
    // Create the user, save to database, and redirect to login page
    app.post("createuser") {req -> EventLoopFuture<Response> in
        try User.Create.validate(content: req)
        let create = try req.content.decode(User.Create.self)
        guard create.password == create.confirmPassword else {
            throw Abort(.badRequest, reason: "Passwords did not match")
        }
        let emailData = Data(create.email.utf8)
        let hashedEmail = SHA256.hash(data: emailData)
        let user = try User(
          email: hashedEmail.hex,
          passwordHash: Bcrypt.hash(create.password)
        )
        return user.save(on: req.db).map {
            return req.redirect(to: "./login")
        }
    }
    
    // Authenticate the user and redirect to class selection page
    let sessions = app.grouped([User.sessionAuthenticator(), User.customAuthenticator()])
    sessions.post("login") { req -> Response in
        let user = try req.auth.require(User.self)
        req.auth.login(user)      
        return req.redirect(to: "./classes")
        
    }

    /// END LOGIN AND ACCOUNT CREATION ENDPOINTS


    /// START CORE SITE ENDPOINTS

    // Create protected route group which requires user auth. 
    let protected = sessions.grouped(User.redirectMiddleware(path: "./login"))

    
    protected.get("scheduler") {req -> View in
        let user = try req.auth.require(User.self)
        let context: ModelScheduler.SchedulerContext
        if let schedule = try await UserSchedule.query(on: req.db).filter(\.$id == user.id!).first() {
            context = ModelScheduler.SchedulerContext(schedule: schedule)
            return try await req.view.render("scheduler.html", context)
        }
        return try await req.view.render("scheduler.html")
    }

    
    // Check if the user already has a saved schedule. If true, continue to scheduler page. If False, render class selection page
    protected.get("classes") { req -> View in
        let user = try req.auth.require(User.self)
        let courses = try await Courses.query(on: req.db).paginate(for: req)
        
        if let schedule = try await UserSchedule.query(on: req.db).filter(\.$id == user.id!).first() {
            req.redirect(to: "./index")
        }
        
        return try await req.view.render("classes.html")
    }

    // Endpoint for sending all classes
    protected.get("classes", "data") {req -> Page<Courses> in
        let courses = try await Courses.query(on: req.db).paginate(for: req)

        return courses;
    }
    
    // Load the saved schedule if it exists. If not, continue normally.
    protected.get("index") {req -> View in
        let user = try req.auth.require(User.self)
        let context: ModelScheduler.SchedulerContext
        if let schedule = try await UserSchedule.query(on: req.db).filter(\.$id == user.id!).first() {
            context = ModelScheduler.SchedulerContext(schedule: schedule)
            return try await req.view.render("index.html", context)
        }
        return try await req.view.render("index.html")
    }

    // After recieving user schedule from front end store it in db and redirect to the final/print page
    protected.post("index") {req in
        req.redirect(to: "./final")
    } 

    
    protected.get("FAQ") {req in
         req.view.render("FAQ.html")
    }

    protected.get("final") {req in
        req.view.render("final.html")
    }

    protected.get("logout") { req -> Response in
        req.auth.logout(User.self)
        return req.redirect(to: "./login")
    }

    /// END CORE SITE ENDPOINTS
    
}

struct SchedulerContext: Encodable {
    
    let schedule: UserSchedule
    
}
