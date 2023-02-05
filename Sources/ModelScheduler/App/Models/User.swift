import Vapor
import Fluent
import FluentMySQLDriver
import Crypto

final class User: Model, Content {
    static let schema = "users"

    @ID(custom: "id", generatedBy: .database)
    var id: Int?
    
    @Field(key: "email")
    var email: String

    @Field(key: "password_hash")
    var passwordHash: String

        
    init() { }

    init(id: Int? = nil, email: String, passwordHash: String) {
        self.id = id
        self.email = email
        self.passwordHash = passwordHash
    }
    
    init(id: Int? = nil, email: String) {
        self.id = id
        self.email = email
        self.passwordHash = "null"
    } 
    
}

extension User {
    struct Create: Content {
        var email: String
        var password: String
        var confirmPassword: String
    }
}

extension User.Create: Validatable {
    static func validations(_  validations: inout Validations){
        validations.add("email", as: String.self, is: .studentEmail)
        validations.add("password", as: String.self, is: .count(8...))
    }
}

extension User: ModelAuthenticatable {
    static let usernameKey = \User.$email 
    static let passwordHashKey = \User.$passwordHash 
    
    func verify(email: String) throws -> Bool {
        let emailData = Data(email.utf8)
        let hashedEmail = SHA256.hash(data: emailData)
        if (hashedEmail.hex == self.email){
            print("HASHES MATCH! \n HASH: \(hashedEmail.hex) \n EXPECTED HASH: \(self.email)")
            return true
        }
        else {
            print("HASHES DO NOT MATCH! \n HASH: \(hashedEmail.hex) \n EXPECTED HASH: \(self.email)")
            return false
        }
    }
     
    func verify(password: String) throws -> Bool {
        try Bcrypt.verify(password, created: self.passwordHash)
        
    }
}

extension User: SessionAuthenticatable {
    var sessionID: Int?
    {
        self.id!
    }
}

// Make login sessionable
extension User: ModelSessionAuthenticatable { }
extension User: ModelCustomAuthenticatable {}


