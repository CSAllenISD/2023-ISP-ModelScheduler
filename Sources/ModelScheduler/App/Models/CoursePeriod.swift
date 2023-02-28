struct CoursePeriod: OptionSet, Codable {
    let rawValue: Int

    static let zero_period =    CoursePeriod(rawValue: 1 << 0) // 1
    static let first_period =   CoursePeriod(rawValue: 1 << 1) // 2
    static let second_period =  CoursePeriod(rawValue: 1 << 2) // 4
    static let third_period =   CoursePeriod(rawValue: 1 << 3) // 8
    static let fourth_period =  CoursePeriod(rawValue: 1 << 4) // 16
    static let fifth_period =   CoursePeriod(rawValue: 1 << 5) // 32
    static let sixth_period =   CoursePeriod(rawValue: 1 << 6) // 64
    static let seventh_period = CoursePeriod(rawValue: 1 << 7) // 128
    static let eight_period =   CoursePeriod(rawValue: 1 << 8) // 256

    static let double_blocked_horizontally_modifer = CoursePeriod(rawValue: 1 << 9) // 512
    static let double_blocked_vertically_modifer = CoursePeriod(rawValue: 1 << 10) // 1024
}
