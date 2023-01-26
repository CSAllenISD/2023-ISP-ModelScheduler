import Vapor
import Fluent
import FluentMySQLDriver

final class Courses: Model, Content {
    public static let schema = "courses"

    @ID(custom: "id", generatedBy: .database)
    var id: Int?

    @Field(key: "code")
    var code: String

    @Field(key: "section")
    var section: String

    @Field(key: "name")
    var name: String

    @Field(key: "period")
    var period: Int

    @Field(key: "location")
    var location: String

    @Field(key: "credits")
    var credits: Float

    @Field(key: "size")
    var size: Int
    
    init() { }

    init(id: Int? = nil, code: String, section: String, name: String, period: Int, loaction: String, credits: Float, size: Int){
        self.id = id
        self.code = code
        self.section = section
        self.name = name
        self.period = period
        self.location = location
        self.credits = credits
        self.size = size
    }   
}

