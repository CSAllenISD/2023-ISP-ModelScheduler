import Vapor
import Fluent
import FluentMySQLDriver

final class Courses: Model, Content {
    public static let schema = "Courses2024_MD"

    @ID(custom: "sectionID", generatedBy: .database)
    var id: String?

    @Field(key: "courseCode")
    var code: String

    @Field(key: "courseName")
    var name: String

    @Enum(key: "term")
    var term: Semester

    @Field(key: "department")
    var department: String

    @Field(key: "period")
    //var period: CoursePeriod
    var period: Int

    @Field(key: "doubleBlockPeriod")
    var doubleBlockPeriod: Int?

    @Field(key: "location")
    var location: String

    @Field(key: "studentMax")
    var studentMax: Int

    @Field(key: "duplicateSectionCount")
    var duplicateSectionCount: Int

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

    init(id: String? = nil, code: String, name: String, term: Semester, department: String, period: Int, doubleBlockPeriod: Int?, location: String, studentMax: Int, duplicateSectionCount: Int) {
        self.id = id
        self.code = code
        self.name = name
        self.term = term
        self.department = department
        self.period = period
        self.doubleBlockPeriod = doubleBlockPeriod
        self.location = location
        self.studentMax = studentMax
        self.duplicateSectionCount = duplicateSectionCount
    }   
}

