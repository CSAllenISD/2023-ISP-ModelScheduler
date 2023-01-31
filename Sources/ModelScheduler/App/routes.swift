import Vapor
import Fluent
import FluentMySQLDriver

func routes(_ app: Application) throws {

    app.get { req in
        req.redirect(to: "./login")
    }
    
    app.get("") {req in
        req.redirect(to: "./login")
    }

           
    app.get("index.html") {req in
        req.view.render("index.html")
    }

    app.get("classes.html") {req in
        req.view.render("classes.html")
    }
    
    app.get("scheduler.html") {req in
        req.redirect(to: "./scheduler")
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
    
    // Endpoint for account creation
    app.post("createuser") {req -> EventLoopFuture<Response> in
        try User.Create.validate(content: req)
        let create = try req.content.decode(User.Create.self)
        guard create.password == create.confirmPassword else {
            throw Abort(.badRequest, reason: "Passwords did not match")
        }
        let user = try User(
          email: Bcrypt.hash(create.email),
          passwordHash: Bcrypt.hash(create.password)
        )
        return user.save(on: req.db).map {
            req.auth.login(user)
            return req.redirect(to: "./classes")
        }
    }
    
    // Endpoint for account login authentication
    let sessions = app.grouped([User.sessionAuthenticator(), User.credentialsAuthenticator()])
    sessions.post("login") { req -> Response in
        let user = try req.auth.require(User.self)
        req.auth.login(user)
        
        return req.redirect(to: "./classes")
        
    }

    // Create protected route group which requires user auth.
    let protected = sessions.grouped(User.redirectMiddleware(path: "./login"))
    
    protected.get("me") { req -> String in
        try req.auth.require(User.self).email
    }
    
    protected.get("scheduler") {req -> View in
        let user = try req.auth.require(User.self)
        let context: ModelScheduler.SchedulerContext
        if let schedule = try await UserSchedule.query(on: req.db).filter(\.$id == user.id!).first() {
            context = ModelScheduler.SchedulerContext(schedule: schedule)
            //print("UserID: \(user.id!)")
            return try await req.view.render("scheduler.html", context)
        }
        return try await req.view.render("scheduler.html")
    }

    protected.get("classes") { req in
        req.view.render("classes.html")
    }

    protected.get("FAQ.html") {req in
         req.view.render("FAQ.html")
    }

    
}

struct SchedulerContext: Encodable {
    
    let schedule: UserSchedule
    
}
