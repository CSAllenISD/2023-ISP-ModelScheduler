import Vapor
import Fluent
import FluentMySQLDriver

final class Courses: Model, Content {
    public static let schema = "courses2024"

    @ID(custom: "sectionID", generatedBy: .database)
    var id: String?

    @Field(key: "courseCode")
    var code: String

    @Field(key: "courseName")
    var name: String

    @Field(key: "term")
    var term: String

    @Field(key: "department")
    var department: String

    @Field(key: "period")
    //var period: CoursePeriod
    var period: String

    @Field(key: "doubleBlockPeriod")
    var doubleBlockPeriod: String?

    @Field(key: "studentMax")
    var studentMax: Double
    /*
    @Field(key: "section")
    var section: String

    
    @Field(key: "dcDays")
    var dcDays: String?
    
    
    @Field(key: "location")
    var location: String

    @Field(key: "credits")
    var credits: Float

    @Field(key: "size")
    var size: Int
    
    @Field(key: "seatsTaken")
    var seatsTaken: Int
    */
    init() { }

    init(id: String? = nil, code: String, name: String, term: String, department: String, period: String, doubleBlockPeriod: String?, studentMax: Double) {
        self.id = id
        self.code = code
        self.name = name
        self.term = term
        self.department = department
        self.period = period
        self.doubleBlockPeriod = doubleBlockPeriod
        self.studentMax = studentMax
    }   
}

