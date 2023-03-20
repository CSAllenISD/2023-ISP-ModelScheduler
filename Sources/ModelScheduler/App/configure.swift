import Vapor
import Leaf
import Fluent
import FluentMySQLDriver

func configure(_ app: Application) throws {
    
    app.middleware.use(FileMiddleware(publicDirectory: app.directory.publicDirectory))
    app.middleware.use(app.sessions.middleware)
    app.views.use(.leaf)

    // Configuration
    //app.mailgun.configuration = .init(apiKey: getEnvString("MAILGUN_APIKEY"))
    //app.mailgun.defaultDomain = MailgunDomain(getEnvString("MAILGUN_DOMAIN"), .us)

    //Gatekeeper
    app.caches.use(.memory)
    app.gatekeeper.config = .init(maxRequests: 32, per: .second)
    app.middleware.use(GatekeeperMiddleware())
    app.gatekeeper.keyMakers.use(.userID)
    
    var tls = TLSConfiguration.makeClientConfiguration()
    tls.certificateVerification = .none
    app.databases.use(.mysql(
                        hostname: getEnvString("MYSQL_HOSTNAME", "db"),
                        port: Int(getEnvString("MYSQL_PORT", String(MySQLConfiguration.ianaPortNumber)))!, // messy
                        username: getEnvString("MYSQL_USERNAME"),
                        password: getEnvString("MYSQL_PASSWORD"),
                        database: getEnvString("MYSQL_DATABASE_NAME"),
                        tlsConfiguration: tls
                      ), as: .mysql)

    // Set local port
    guard let portString = Environment.get("VAPOR_LOCAL_PORT"),
          let port = Int(portString) else {
        fatalError("Failed to determine VAPOR LOCAL PORT from environment")
    }
    app.http.server.configuration.port = port

    // Set local host
    guard let hostname = Environment.get("VAPOR_LOCAL_HOST") else {
        fatalError("Failed to determine VAPOR LOCAL HOST from environment")
    }
    app.http.server.configuration.hostname = hostname

    // Reigster Migrations
    app.migrations.add(User.Migration())

    // register routes
    try routes(app)
}
public func getEnvString(_ path: String, _ defaultReturn: String = "") -> String {
    guard let variable = Environment.get(path) else {
        app.logger.warning("Failed to read environment variable: \(path) defaulting to `\(defaultReturn)`")
        
        return defaultReturn
    }
    
    return variable
}

    
