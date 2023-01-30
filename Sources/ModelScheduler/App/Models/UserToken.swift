import Fluent
import Vapor

final class UserToken: Model, Content {
    static let schema = "userTokens"

    @ID(custom: "id", generatedBy: .database)
    var id: Int?

    @Field(key: "value")
    var value: String

    @Parent(key: "userId")
    var user: User

    init() { }

    init(id: Int? = nil, value: String, userID: User.IDValue) {
        self.id = id
        self.value = value
        self.$user.id = userID
    }
}

extension UserToken: ModelTokenAuthenticatable {
    static let valueKey = \UserToken.$value
    static let userKey = \UserToken.$user

    var isValid: Bool {
        true
    }
}
