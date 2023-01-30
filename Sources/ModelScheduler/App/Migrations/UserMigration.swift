import Fluent
import Vapor

extension User {
    struct Migration: AsyncMigration{
        func prepare (on database: Database) async throws{
            try await database.schema("users")
              .id()
              .field("email", .string, .required)
              .field("passwordHash", .string, .required)
              .unique(on: "email")
              .create()
        }

        func revert(on database: Database) async throws{
            try await database.schema("users").delete()
        }
    }
}
