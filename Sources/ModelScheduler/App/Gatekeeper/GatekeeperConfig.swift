import Vapor

public struct GatekeeperConfig {
    public enum Interval {
        case second
        case minute
        case hour
        case day
    }

    public let limit: Int
    public let interval: Interval

    public init(maxRequests limit: Int, per interval: Interval) {
        self.limit = limit
        self.interval = interval
    }

    var refreshInterval: Double {
        switch interval {
        case .second:
            return 1
        case .minute:
            return 60
        case .hour:
            return 3_600
        case .day:
            return 86_400
        }
    }
}

struct UserIDKeyMaker: GatekeeperKeyMaker {
    public func make(for req: Request) -> EventLoopFuture<String> {
        let userID = try? req.auth.require(User.self).requireID()
        return req.eventLoop.future("gatekeeper_" + "\(userID)")
    }
}

extension Application.Gatekeeper.KeyMakers.Provider {
    public static var userID: Self {
        .init { app in
            app.gatekeeper.keyMakers.use { _ in UserIDKeyMaker() }
        }
    }
}
