import Vapor
import Fluent
import FluentMySQLDriver

final class Courses: Model, Content {
    public static let schema = "courses"

    @ID(custom: "id", generatedBy: .database)
    var id: Int?

    @Field(key: "code")
    var code: String

    @Field(key: "semester")
    var semester: Int

    @Field(key: "section")
    var section: String

    @Field(key: "name")
    var name: String

    @Field(key: "dcDays")
    var dcDays: String?
    
    @Field(key: "period")
    var period: CoursePeriod

    @Field(key: "location")
    var location: String

    @Field(key: "credits")
    var credits: Float

    @Field(key: "size")
    var size: Int
    
    @Field(key: "seatsTaken")
    var seatsTaken: Int
    
    init() { }

    init(id: Int? = nil, code: String, semester: Int, section: String, name: String, dcDays: String? = nil, period: CoursePeriod, loaction: String, credits: Float, size: Int, seatsTaken: Int){
        self.id = id
        self.code = code
        self.semester = semester
        self.section = section
        self.name = name
        self.dcDays = dcDays
        self.period = period
        self.location = location
        self.credits = credits
        self.size = size
        self.seatsTaken = seatsTaken 
    }   
}

