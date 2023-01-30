import Vapor
import Fluent
import FluentMySQLDriver

extension Validator where T == String {
    /// Validates whether a `String` is a valid student email address.
    public static var studentEmail: Validator<T> {
        .init {
            guard
              let range = $0.range(of: regex, options: [.regularExpression]),
              range.lowerBound == $0.startIndex && range.upperBound == $0.endIndex,
              // The numbers beneath here are as defined by https://emailregex.com/email-validation-summary/
              $0.count <= 320, // total length
              $0.split(separator: "@")[0].count <= 64 // length before `@`
            else {
                return ValidatorResults.studentEmail(isValidEmail: false)
            }
            return ValidatorResults.studentEmail(isValidEmail: true)
        }
    }
    
}

extension ValidatorResults {
    /// `ValidatorResult` of a validator that validates whether a `String` is a valid email address.
    public struct studentEmail {
        /// The input is a valid email address
        public let isValidEmail: Bool
    }
}

extension ValidatorResults.studentEmail: ValidatorResult {
    public var isFailure: Bool {
        !self.isValidEmail
    }
    
    public var successDescription: String? {
        "is a valid student email address"
    }
    
    public var failureDescription: String? {
        "is not a valid student email address"
    }
}

// FIXME: this regex is too strict with capitalization of the domain part
private let regex: String = """
  ^[A-Za-z0-9._%+-]+@student.allenisd.org$
  """
