import Vapor



extension Request {
    public var email: Email {
        .init(request: self)
    }
    
    public struct Email: EmailHasher {
        let request: Request
                
        public var async: AsyncEmailHasher {
            self.request.email.sync.async(
              on: self.request.application.threadPool,
              hopTo: self.request.eventLoop
            )
        }
        
        public var sync: EmailHasher {
            self.request.email.sync
        }
        
        public func verify<Email, Digest>(
          _ email: Email,
          created digest: Digest
        ) throws -> Bool
          where Email: DataProtocol, Digest: DataProtocol
        {
            try self.sync.verify(email, created: digest)
        }
        
        public func hash<Email>(_ email: Email) throws -> [UInt8]
          where Email: DataProtocol
        {
            try self.sync.hash(email)
        }
    }
} 
