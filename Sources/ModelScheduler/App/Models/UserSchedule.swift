import Fluent
import Vapor

final class UserSchedule: Model, Content {
    static let schema = "userSchedule"

    @ID(custom: "id", generatedBy: .database)
    var id: Int?
    
    @Field(key: "userId")
    var userId: Int

    @Enum(key: "semester")
    var semester: Semester

    @Field(key: "periodZero")
    var periodZero: String?

    @Field(key: "periodOne")
    var periodOne: String?

    @Field(key: "periodTwo")
    var periodTwo: String?

    @Field(key: "periodThree")
    var periodThree: String?

    @Field(key: "periodFour")
    var periodFour: String?

    @Field(key: "periodFive")
    var periodFive: String?

    @Field(key: "periodSix")
    var periodSix: String?

    @Field(key: "periodSeven")
    var periodSeven: String?

    @Field(key: "periodEight")
    var periodEight: String?
    
    init() { }

    init(
      id: Int? = nil,
      userId: Int,
      semester: Semester,
      periodZero: String? = nil,
      periodOne: String? = nil,
      periodTwo: String? = nil,
      periodThree: String? = nil,
      periodFour: String? = nil,
      periodFive: String? = nil,
      periodSix: String? = nil,
      periodSeven: String? = nil,
      periodEight: String? = nil
    ) {
        self.id = id
        self.userId = userId
        self.semester = semester
        self.periodZero = periodZero
        self.periodOne = periodOne
        self.periodTwo = periodTwo
        self.periodThree = periodThree
        self.periodFour = periodFour
        self.periodFive = periodFive
        self.periodSix = periodSix
        self.periodSeven = periodSeven
        self.periodEight = periodEight
    }
}
