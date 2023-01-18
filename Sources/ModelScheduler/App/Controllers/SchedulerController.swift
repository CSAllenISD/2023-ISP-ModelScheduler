import Vapor
import Fluent
import FluentMySQLDriver

/// Provides API Endpoints for accessing ``Employee`` related data
public class SchedulerController {

    /// Retrieves the employee record specified by the ID
    ///
    /// * API Endpoint: /employees/{id}
    /// * Method: GET
    /// * Query parameters: None
    /// * Status codes:
    ///   * 200 Successful
    ///   * 400 Bad request
    ///   * 404 Not found
    ///
    /// Returns: ``Employee``
    /// 
    public func getEmployeeById(_ app: Application) throws {
        app.get("employees", ":id") { req -> Scheduler in

            guard let id = req.parameters.get("id", as: Int.self) else {
                throw Abort(.badRequest)
            }

            guard let employee = try await Scheduler.query(on: req.db)
                    .filter(\.$id == id)
                    .first() else {
                throw Abort(.notFound)
            }
            return employee
        }
    }
}
