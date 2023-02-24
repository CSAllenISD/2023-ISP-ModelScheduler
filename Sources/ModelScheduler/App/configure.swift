import Vapor
import Leaf
import Fluent
import FluentMySQLDriver

func configure(_ app: Application) throws {
    
    app.middleware.use(FileMiddleware(publicDirectory: app.directory.publicDirectory))
    app.middleware.use(app.sessions.middleware)
    app.views.use(.leaf)

    
    app.mailgun.configuration = .init(apiKey: secrets.mailgunApiKey)
    app.mailgun.defaultDomain = .myApp1
    
    
    var tls = TLSConfiguration.makeClientConfiguration()
    tls.certificateVerification = .none
    app.databases.use(.mysql(
                        hostname: "db",
                        port: MySQLConfiguration.ianaPortNumber,
                        username: secrets.dbUser,
                        password: secrets.dbPass,
                        database: secrets.dbName,
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
