import Vapor
import Fluent
import FluentMySQLDriver

public protocol ModelCustomAuthenticatable: Model, Authenticatable {
    static var usernameKey: KeyPath<Self, Field<String>> { get }
    static var passwordHashKey: KeyPath<Self, Field<String>> { get }
    func verify(email: String) throws -> Bool
    func verify(password: String) throws -> Bool
}

extension ModelCustomAuthenticatable {
    public static func customAuthenticator(
      database: DatabaseID? = nil
    ) -> Authenticator {
        ModelCustomAuthenticator<Self>(database: database)
    }

    var _$emailHash: Field<String> {
        self[keyPath: Self.usernameKey]
    }

    var _$passwordHash: Field<String> {
        self[keyPath: Self.passwordHashKey]
    }
}

private struct ModelCustomAuthenticator<User>: CredentialsAuthenticator
  where User: ModelCustomAuthenticatable
{
    typealias Credentials = ModelCredentials

    public let database: DatabaseID?

    func authenticate(credentials: ModelCredentials, for request: Request) -> EventLoopFuture<Void> {
        let emailData = Data(credentials.username.utf8)
        let hashedEmail = SHA256.hash(data: emailData)
        //print("TRYING TO AUTH: \n LOOKING FOR: \(hashedEmail.hex)")
         return User.query(on: request.db(self.database))
          .filter(\._$emailHash == hashedEmail.hex)
          .first()
          .flatMapThrowing{ foundUser in   
              guard let user = foundUser else {
                return
              }
              guard try user.verify(email: credentials.username) else {
                  return
              }
              guard try user.verify(password: credentials.password) else {
                  return
              }
              request.auth.login(user)
          }
    }
    
}
