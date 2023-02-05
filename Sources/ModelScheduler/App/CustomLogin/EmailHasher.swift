import Vapor

public protocol EmailHasher {
    func hash<Email>(_ email: Email) throws -> [UInt8]
      where Email: DataProtocol

    func verify<Email, Digest>(
      _ email: Email,
      created digest: Digest
    ) throws -> Bool
      where Email: DataProtocol, Digest: DataProtocol
}

extension EmailHasher {
    public func hash(_ email: String) throws -> String {
        try String(decoding: self.hash([UInt8](email.utf8)), as: UTF8.self)
    }

    public func verify(_ email: String, created digest: String) throws -> Bool {
        try self.verify(
          [UInt8](email.utf8),
          created: [UInt8](digest.utf8)
        )
    }
}
