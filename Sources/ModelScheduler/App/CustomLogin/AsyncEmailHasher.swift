import Vapor

extension EmailHasher {
    public func async(
      on threadPool: NIOThreadPool,
      hopTo eventLoop: EventLoop
    ) -> AsyncEmailHasher {
        .init(
          hasher: self,
          threadPool: threadPool,
          eventLoop: eventLoop
        )
    }
}

public struct AsyncEmailHasher {
    private let hasher: EmailHasher
    private let threadPool: NIOThreadPool
    private let eventLoop: EventLoop
    
    public init(hasher: EmailHasher, threadPool: NIOThreadPool, eventLoop: EventLoop) {
        self.hasher = hasher
        self.threadPool = threadPool
        self.eventLoop = eventLoop
    }
    
    public func hash<Email>(_ email: Email) -> EventLoopFuture<[UInt8]>
      where Email: DataProtocol
    {
        return self.threadPool.runIfActive(eventLoop: self.eventLoop) {
            try self.hasher.hash(email)
        }
    }
    
    public func verify<Email, Digest>(
      _ email: Email,
      created digest: Digest
    ) -> EventLoopFuture<Bool>
      where Email: DataProtocol, Digest: DataProtocol
    {
        return self.threadPool.runIfActive(eventLoop: self.eventLoop) {
            try self.hasher.verify(email, created: digest)
        }
    }
    
    public func hash(_ email: String) -> EventLoopFuture<String> {
        self.hash([UInt8](email.utf8)).map {
            String(decoding: $0, as: UTF8.self)
        }
    }

    public func verify(_ email: String, created digest: String) -> EventLoopFuture<Bool> {
        self.verify(
          [UInt8](email.utf8),
          created: [UInt8](digest.utf8)
        )
    }
}
