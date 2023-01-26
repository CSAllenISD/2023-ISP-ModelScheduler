import Vapor
import Fluent
import FluentMySQLDriver

func routes(_ app: Application) throws {

    app.get("") {req in
        req.view.render("index.html")
    }

    app.get("FAQ.html") {req in
        req.view.render("FAQ.html")
    }
    
    app.get("Views/FAQ.html"){ req in
        req.view.render("FAQ.html")
    }
    
    app.get("index.html") {req in
        req.view.render("index.html")
    }
    
    app.get("Views/index.html"){ req in
        req.view.render("index.html")
    }
    
    app.get("scheduler.html") {req in
        req.view.render("scheduler.html")
    }
    
    app.get("Views/scheduler.html"){ req in
        req.view.render("scheduler.html")
    }
    
    app.get("final.html") {req in
        req.view.render("final.html")
    }
    
    app.get("Views/final.html"){ req in
        req.view.render("inal.html")
    }
    
    app.get("login.html") {req in
        req.view.render("login.html")
    }
    
    app.get("Views/login.html"){ req in
        req.view.render("login.html")
    }

    app.get("createuser.html") {req in
        req.view.render("createuser.html")
    }
    
    app.get("Views/createuser.html"){ req in
        req.view.render("createuser.html")
    }

    let redirectMiddleware = User.redirectMiddleware { req -> String in
        return "/login?authRequired=true&next=\(req.url.path)"
    }

    // Endpoint for account creation
    app.post("createuser") {req async throws -> User in
        try User.Create.validate(content: req)
        let create = try req.content.decode(User.Create.self)
        guard create.password == create.confirmPassword else {
            throw Abort(.badRequest, reason: "Passwords did not match")
        }
        let user = try User(
          email: create.email,
          passwordHash: Bcrypt.hash(create.password)
        )
        try await user.save(on: req.db)
        return user
    }
    
    // Endpoint for account login authentication
    let passwordProtected = app.grouped(User.credentialsAuthenticator())
    passwordProtected.post("login") { req -> User in
        let user = try req.auth.require(User.self)
        return user
    }

    // Endpoint for token authenticated users
    //let protected = app.routes.grouped([app.sessions.middleware, UserSessionAuthenticator(), UserBearerAuthenticator(), User.guardMiddleware(),])
    
    passwordProtected.get("me") { req -> String in
        try req.auth.require(User.self).email
    }

    passwordProtected.get("scheduler") {req -> UserSchedule in
        let user = try req.auth.require(User.self)
        if let schedule = try await UserSchedule.query(on: req.db).filter(\.$id == user.id!).first() {
            return schedule
        }
        else {
            let schedule = UserSchedule(
              userId: user.id!,
              periodZero: 0,
              periodOne: 0,
              periodTwo: 0,
              periodThree: 0,
              periodFour: 0,
              periodFive: 0,
              periodSix: 0,
              periodSeven: 0,
              periodEight: 0
            )
           
            try await schedule.save(on: req.db)

            return schedule
        }
       
    }
    
}
