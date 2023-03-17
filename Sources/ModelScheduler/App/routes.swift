import Vapor
import Fluent
import FluentMySQLDriver
import Crypto


func routes(_ app: Application) throws {

    app.get("") {req in
        req.redirect(to: "./login")
    }

    app.get("scheduler.html") {req in
        req.redirect(to: "./scheduler")
    }

    app.get("classes.html") {req in
        req.redirect(to: "./classes")
    }
    
    app.get("FAQ.html") {req in
        req.redirect(to: "./FAQ")
    }
     
    app.get("final.html") {req in
        req.redirect(to: "./final")
    }
    
    app.get("login") {req -> View in
        req.auth.logout(User.self)
        return try await req.view.render("login.html")
    }

    app.get("createuser.html") {req in
        req.redirect(to: "./createuser")
    }
    
    app.get("createuser") {req in
        req.view.render("createuser.html")
    }


    /// START LOGIN AND ACCOUNT CREATION ENDPOINTS

    //todo: return an error string
    app.post("createuser") {req -> CustomError in
        try User.Email.validate(content: req)
        let create = try req.content.decode(User.Email.self)
        
        let emailData = Data(create.email.utf8)
        let hashedEmail = SHA256.hash(data: emailData)
        //print("SAVING: \(hashedEmail.hex)")
        let verifyToken = randomString(length: 6)
        let user = User(
          email: hashedEmail.hex,
          passwordHash: "NULL",
          token: verifyToken
        )

        let userExist = try await User.query(on: req.db).filter(\.$email == user.email).first()

        if userExist?.isActive == 1 {
            let error = CustomError(error: "Account already created and verified.")
            return error
        }
        
               
        if userExist != nil{
            if userExist?.isActive == 0 {
                let curTime = Date()
                let updatedAtTime = userExist?.updatedAt
                if updatedAtTime!.distance(to: curTime) > Double(180) {

                    let emailApi = ModelScheduler.getEnvString("EMAIL_API")
                    let response = try await req.client.post("\(emailApi)") { req in
                        let contact = Contact(firstName: "", lastName: "", emailAddress: create.email)
                        let emailData = EmailData(contact: contact,
                                                  templateName: "cmwModelSchedulerVerification",
                                                  templateParameters:
                                                    "{\"firstName\": \"\(create.firstName)\", \"lastName\": \"\(create.lastName)\", \"token\": \"\(verifyToken)\"}")
                        
                        try req.content.encode(emailData)
                        
                        req.headers.add(name: "apiKey", value: ModelScheduler.getEnvString("EMAIL_APIKEY"))
                    }

                    try await User.query(on: req.db)
                      .set(\.$token, to: verifyToken)
                      .filter(\.$email == hashedEmail.hex)
                      .update()
                    
                    let error = CustomError(error: "Another email has been sent, click the link in your email to proceed.")
                    return error
                }
                else {
                    let error = CustomError(error: "Please wait 3 minutes before trying again.")
                    return error
                }
            }
        }
        else {
            let emailApi = ModelScheduler.getEnvString("EMAIL_API")
            let response = try await req.client.post("\(emailApi)") { req in
                let contact = Contact(firstName: "", lastName: "", emailAddress: create.email)
                let emailData = EmailData(contact: contact,
                                          templateName: "cmwModelSchedulerVerification",
                                          templateParameters:
                                            "{\"firstName\": \"\(create.firstName)\", \"lastName\": \"\(create.lastName)\", \"token\": \"\(verifyToken)\"}")
                
                try req.content.encode(emailData)

                req.headers.add(name: "apiKey", value: ModelScheduler.getEnvString("EMAIL_APIKEY"))
            //    print("REQUEST: \n \(req)")
            }
            // print("RESPONSE: \n \(response)")
            
            try await user.save(on: req.db)
            let error = CustomError(error: "Click the link in your email to complete account creation. If you did not recieve an email please wait 3 minutes and then try again.")
            return error
            
        }
    
    
        let error = CustomError(error: "Fatal Error, please try again later.")
        return error
    }

    app.get("verify", ":token") {req in
        //let token = req.parameters.get("token")!
        //let user = try await User.query(on: req.db).filter(\.$token == token).first()
        
        //TODO: if the user is already verified, redirect to login
        return try await req.view.render("verify.html")
    }

    app.post("verify") { req -> CustomError in
        try User.Verify.validate(content: req)
        let create = try req.content.decode(User.Verify.self)
        let token = create.token
        guard create.password == create.confirmPassword else {
            throw Abort(.badRequest, reason: "Passwords did not match")
        }
        let passwordHash = try Bcrypt.hash(create.password)
        let user = try await User.query(on: req.db).filter(\.$token == token).first()
        if user?.isActive == 0 {
            try await User.query(on: req.db)
              .set(\.$passwordHash, to: passwordHash)
              .set(\.$isActive, to: 1)
              .filter(\.$token == token)
              .update()
                        
            let error = CustomError(error: "Account successfully created.")
            return error
        }
        else if user?.isActive == 1 {
            let error = CustomError(error: "Account already verified.")
            return error
        }

        let error = CustomError(error: "Fatal Error, please try again later.")
        return error
    }

    app.get("forgot") {req in
        return try await req.view.render("forgot.html")
    }
    

   app.get("forgotpassword", ":token") {req in
        //let token = req.parameters.get("token")!
        //let user = try await User.query(on: req.db).filter(\.$token == token).first()
        
        //TODO: if the user is already verified, redirect to login
        return try await req.view.render("forgotpassword.html")
    }

   app.post("forgot") {req -> CustomError in
       try User.Email.validate(content: req)
       let create = try req.content.decode(User.Email.self)
       
       let emailData = Data(create.email.utf8)
       let hashedEmail = SHA256.hash(data: emailData)
       //print("SAVING: \(hashedEmail.hex)")
       let verifyToken = randomString(length: 6)
       let user = User(
         email: hashedEmail.hex,
         passwordHash: "NULL",
         token: verifyToken
       )
       
       let userExist = try await User.query(on: req.db).filter(\.$email == user.email).first()
             
       if userExist != nil{
           if userExist?.isActive == 1 {
               let curTime = Date()
               let updatedAtTime = userExist?.updatedAt
               if updatedAtTime!.distance(to: curTime) > Double(180) {
                   
                   let emailApi = ModelScheduler.getEnvString("EMAIL_API")
                   let response = try await req.client.post("\(emailApi)") { req in
                       let contact = Contact(firstName: "", lastName: "", emailAddress: create.email)
                       let emailData = EmailData(contact: contact,
                                                 templateName: "cmwModelSchedulerForgotPassword",
                                                 templateParameters:
                                                   "{\"firstName\": \"\(create.firstName)\", \"lastName\": \"\(create.lastName)\", \"token\": \"\(verifyToken)\"}")
                       
                       try req.content.encode(emailData)
                       
                       req.headers.add(name: "apiKey", value: ModelScheduler.getEnvString("EMAIL_APIKEY"))
                   }
                   
                   try await User.query(on: req.db)
                     .set(\.$token, to: verifyToken)
                     .filter(\.$email == hashedEmail.hex)
                     .update()
                   
                   let error = CustomError(error: "Email has been sent, click the link in your email to proceed.")
                   return error
               }
               else {
                   let error = CustomError(error: "Please wait 3 minutes before trying again.")
                   return error
               }
           }
       }
       else {
           
           let error = CustomError(error: "User does not exist. Check the email and try again.")
           return error
           
       }
       
       
       let error = CustomError(error: "Fatal Error, please try again later.")
       return error
       
   }
   
   app.post("forgotpassword") { req -> CustomError in
       try User.Verify.validate(content: req)
       let create = try req.content.decode(User.Verify.self)
       let token = create.token
       guard create.password == create.confirmPassword else {
           throw Abort(.badRequest, reason: "Passwords did not match")
       }
       let passwordHash = try Bcrypt.hash(create.password)
       let user = try await User.query(on: req.db).filter(\.$token == token).first()
       if user?.isActive == 1 {
           try await User.query(on: req.db)
             .set(\.$passwordHash, to: passwordHash)
             .filter(\.$token == token)
             .update()
           
            let error = CustomError(error: "Password successfully updated.")
            return error
       }
       else if user?.isActive == 0 {
           let error = CustomError(error: "Account is not active.")
           return error
        }
       
       let error = CustomError(error: "Fatal Error, please try again later.")
       return error
   }
   
   
   // Authenticate the user and redirect to class selection page
   let sessions = app.grouped([User.sessionAuthenticator(), User.customAuthenticator()])
    sessions.post("login") { req -> Response in
        //let user = try req.content.decode(User.self)
        let user = try req.auth.require(User.self)
        req.auth.login(user)      
        return req.redirect(to: "./classes")
    }

    /// END LOGIN AND ACCOUNT CREATION ENDPOINTS


    /// START CORE SITE ENDPOINTS

    // Create protected route group which requires user auth. 
    let protected = sessions.grouped(User.redirectMiddleware(path: "./login"))

    
    // Check if the user already has a saved schedule. If true, continue to scheduler page. If False, render class selection page
    protected.get("classes") { req -> View in
        let user = try req.auth.require(User.self)
        let courses = try await Courses.query(on: req.db).paginate(for: req)
        
        if try await UserSchedule.query(on: req.db).filter(\.$userId == user.id!).first() != nil {
            req.redirect(to: "./index")
        }
        
        return try await req.view.render("classes.html")
    }

        
    // Endpoint for sending all classes
    protected.get("classes", "data") {req -> CoursesContent in
        let courses = Courses.query(on: req.db).sort(\.$name)
        let coursesContent = try await CoursesContent(items: courses.all())
        return coursesContent;
    }
    
    // Load the saved schedule if it exists. If not, continue normally.
    protected.get("scheduler") {req -> View in
        try req.auth.require(User.self)
        return try await req.view.render("scheduler.html")
    }

    protected.get("scheduler", "check") {req -> Courses in
        let user = try req.auth.require(User.self)
        if let schedule = try await UserSchedule.query(on: req.db).filter(\.$userId == user.id!).first() {
            let courses = try await Courses.query(on: req.db).group(.and) { group in
                group.filter(\.$id == schedule.periodZero!)
                  .filter(\.$id == schedule.periodOne!)
                  .filter(\.$id == schedule.periodTwo!)
                  .filter(\.$id == schedule.periodThree!)
                  .filter(\.$id == schedule.periodFour!)
                  .filter(\.$id == schedule.periodFive!)
                  .filter(\.$id == schedule.periodSix!)
                  .filter(\.$id == schedule.periodSeven!)
                  .filter(\.$id == schedule.periodEight!)
            }.first()
            
            return courses!
        }

        return Courses()
    }

    protected.post("scheduler", "demand") { req -> SchedulerDemandRes in
        let course = try req.content.decode(SchedulerDemand.self)
        let courseCode = course.code
        let period = course.period
        let searchedTerm = course.term ?? .both
        
        guard let matchCourse: Courses = try await Courses.query(on: req.db).filter(\.$code == courseCode).filter(\.$period == period).first() else {
            print("Course not found: CourseCode: \(courseCode), Period: \(period)")
            return SchedulerDemandRes(demand: 0, studentMax: 0, studentCur: 0)
        }

        let studentMax = matchCourse.studentMax
        let filterCollection: [Semester] = searchedTerm == .both ? [.fall, .spring] : [searchedTerm]

        let possibleSchedules = try await UserSchedule.query(on: req.db)
          .filter(\.$semester ~~ filterCollection)
          .group(.or) { group in
            group.filter(\.$periodZero == matchCourse.id)
              .filter(\.$periodOne == matchCourse.id)
              .filter(\.$periodTwo == matchCourse.id)
              .filter(\.$periodThree == matchCourse.id)
              .filter(\.$periodFour == matchCourse.id)
              .filter(\.$periodFive == matchCourse.id)
              .filter(\.$periodSix == matchCourse.id)
              .filter(\.$periodSeven == matchCourse.id)
              .filter(\.$periodEight == matchCourse.id)
        }.all()

        // group schedules by userId
        let studentSchedules = Dictionary(grouping: possibleSchedules) { $0.userId }
        let seatsPerTerm: Decimal = matchCourse.term == .both && searchedTerm == .both
          ? 1 / 2 // divide seats in half if its a dual semester class with both lookup
          : 1

        // see if a student has more than >1 occourance meaning they took both semesters
        //TODO: fix impossible configuration with a student taking the same half block class twice (needs to be fixed in input)
        let seatsTaken = studentSchedules.compactMap { $1.count > 1 ? seatsPerTerm * 2 : seatsPerTerm }.reduce(0, +)

        let demand = (seatsTaken / Decimal(studentMax)) * 100
        
        return SchedulerDemandRes(demand: demand, studentMax: studentMax, studentCur: seatsTaken)
    }
    
    
    // After recieving user schedule from front end store it in db and redirect to the final/print page
    protected.post("scheduler") {req -> String in
        let user = try req.auth.require(User.self)
        let schedules = try req.content.decode(SharableSchedules.self).items

        precondition(schedules.allSatisfy{$0.term != .both}, "\(user.id!) is not allowed to use term both.") // TODO make this a validator

        // Not a good example of authorative code.
        let userSchedules = try await UserSchedule.query(on: req.db).filter(\.$userId == user.id!).all()

        for schedule in schedules {
            let userSchedule = userSchedules.filter{ $0.semester == schedule.term }.first
            let exists = userSchedule != nil
            var newSchedule = userSchedule ?? UserSchedule(userId: user.id!, semester: schedule.term)

            newSchedule.periodZero = schedule.periodZero
            newSchedule.periodOne = schedule.periodOne
            newSchedule.periodTwo = schedule.periodTwo
            newSchedule.periodThree = schedule.periodThree
            newSchedule.periodFour = schedule.periodFour
            newSchedule.periodFive = schedule.periodFive
            newSchedule.periodSix = schedule.periodSix
            newSchedule.periodSeven = schedule.periodSeven
            newSchedule.periodEight = schedule.periodEight

            if exists {
                try await newSchedule.update(on: req.db)
            } else {
                try await newSchedule.create(on: req.db)
            }
        }

        // intresting...
        return "{ \"msg\": \"Update Successful\" }"
        //This might change depending on the request recieved
        //return req.redirect(to: "./final")
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

struct CoursesContent: Content {
    let items: [Courses]
}

struct SharableSchedule: Content {
    let term: Semester
    let periodZero: String?
    let periodOne: String?
    let periodTwo: String?
    let periodThree: String?
    let periodFour: String?
    let periodFive: String?
    let periodSix: String?
    let periodSeven: String?
    let periodEight: String?
}

struct SharableSchedules: Content {
    let items: [SharableSchedule]
}

struct Contact: Content {
    let firstName: String
    let lastName: String
    let emailAddress: String
}

struct EmailData: Content {
    let contact: Contact
    let templateName: String
    let templateParameters: String
}

struct CustomError: Content {
    let error: String
}

struct SchedulerDemand: Content {
    let code: String
    let period: Int
    let term: Semester?
}

struct SchedulerDemandRes: Content {
    let demand: Decimal
    let studentMax: Int
    let studentCur: Decimal
}
