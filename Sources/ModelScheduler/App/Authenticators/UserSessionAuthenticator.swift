import Vapor

/*
struct UserSessionAuthenticator: SessionAuthenticator {
    typealias User = ModelScheduler.User
    func authenticate(sessionID: Int?, for request: Request) -> EventLoopFuture<Void> {
        let user = User(id: sessionI)
        request.auth.login(user)
        return request.eventLoop.makeSucceededFuture(())
    }
}

struct UserBearerAuthenticator: AsyncBearerAuthenticator {
    func authenticate(bearer: BearerAuthorization, for request: Request) async throws {
        if bearer.token == "test" {
            let user = User(email: "test@test.com")
            request.auth.login(user)
        }
    }
}

*/
