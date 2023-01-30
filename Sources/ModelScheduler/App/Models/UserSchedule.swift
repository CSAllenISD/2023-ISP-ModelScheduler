import Fluent
import Vapor

final class UserSchedule: Model, Content {
    static let schema = "userSchedule"

    @ID(custom: "id", generatedBy: .database)
    var id: Int?
    
    @Parent(key: "userId")
    var user: User

    @Parent(key: "periodZero")
    var periodZero: Courses

    @Parent(key: "periodOne")
    var periodOne: Courses

    @Parent(key: "periodTwo")
    var periodTwo: Courses

    @Parent(key: "periodThree")
    var periodThree: Courses

    @Parent(key: "periodFour")
    var periodFour: Courses

    @Parent(key: "periodFive")
    var periodFive: Courses

    @Parent(key: "periodSix")
    var periodSix: Courses

    @Parent(key: "periodSeven")
    var periodSeven: Courses

    @Parent(key: "periodEight")
    var periodEight: Courses
    
    init() { }

    init(
      id: Int? = nil,
      userId: User.IDValue, 
      periodZero: Courses.IDValue,
      periodOne: Courses.IDValue,
      periodTwo: Courses.IDValue,
      periodThree: Courses.IDValue,
      periodFour: Courses.IDValue,
      periodFive: Courses.IDValue,
      periodSix: Courses.IDValue,
      periodSeven: Courses.IDValue,
      periodEight: Courses.IDValue
    ) {
        self.id = id
        self.$user.id = userId
        self.$periodZero.id = periodZero
        self.$periodOne.id = periodOne
        self.$periodTwo.id = periodTwo
        self.$periodThree.id = periodThree
        self.$periodFour.id = periodFour
        self.$periodFive.id = periodFive
        self.$periodSix.id = periodSix
        self.$periodSeven.id = periodSeven
        self.$periodEight.id = periodEight
    }
}
