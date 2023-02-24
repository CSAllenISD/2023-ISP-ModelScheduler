import Fluent
import Vapor

final class UserSchedule: Model, Content {
    static let schema = "userSchedule"

    @ID(custom: "id", generatedBy: .database)
    var id: Int?
    
    @Field(key: "userId")
    var userId: Int?

    @Field(key: "periodZero")
    var periodZero: Int?

    @Field(key: "periodOne")
    var periodOne: Int?

    @Field(key: "periodTwo")
    var periodTwo: Int?

    @Field(key: "periodThree")
    var periodThree: Int?

    @Field(key: "periodFour")
    var periodFour: Int?

    @Field(key: "periodFive")
    var periodFive: Int?

    @Field(key: "periodSix")
    var periodSix: Int?

    @Field(key: "periodSeven")
    var periodSeven: Int?

    @Field(key: "periodEight")
    var periodEight: Int?
    
    init() { }

    init(
      id: Int? = nil,
      userId: Int? = nil, 
      periodZero: Int? = nil,
      periodOne: Int? = nil,
      periodTwo: Int? = nil,
      periodThree: Int? = nil,
      periodFour: Int? = nil,
      periodFive: Int? = nil,
      periodSix: Int? = nil,
      periodSeven: Int? = nil,
      periodEight: Int? = nil
    ) {
        self.id = id
        self.userId = userId
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
