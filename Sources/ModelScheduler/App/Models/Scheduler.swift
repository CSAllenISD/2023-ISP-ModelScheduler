/*
VaporShell provides a minimal framework for starting Vapor projects.
Copyright (C) 2021, 2022 CoderMerlin.com
This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.
This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.
You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import Vapor
import Fluent
import FluentMySQLDriver

/// This class provides the model for an Employee
final public class Scheduler: Model, Content {
    // Name of the table or collection.
    public static let schema = "employees"

    /// Unique identifier for this Employee.
    @ID(custom: "emp_no", generatedBy: .database)
    public var id: Int?

    /// First name of employee
    @Field(key: "first_name")
    public var firstName: String

    /// Last name of employee
    @Field(key: "last_name")
    public var lastName: String

    @Field(key: "gender")
    public var gender: String

    @Field(key: "birth_date")
    public var birthDate: Date

    @Field(key: "hire_date")
    public var hireDate: Date

    // Creates a new, empty Employee.
    public init() { }
}

