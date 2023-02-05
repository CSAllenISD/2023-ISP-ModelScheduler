import Vapor 

extension Application {
    public var emails: Emails {
        .init(application: self)
    }

    public struct Emails {
        public struct Provider {
            let run: (Application) -> ()

            public init(_ run: @escaping (Application) -> ()) {
                self.run = run
            }
        }

        struct Key: StorageKey {
            typealias Value = Storage
        }

        let application: Application

        public func use(_ provider: Provider) {
            provider.run(self.application)
        }

        public func use(
          _ makeVerifier: @escaping (Application) -> (EmailHasher)
        ) {
            self.storage.makeVerifier = makeVerifier
        }

        final class Storage {
            var makeVerifier: ((Application) -> EmailHasher)?
            init() { }
        }

        var storage: Storage {
            if let existing = self.application.storage[Key.self] {
                return existing
            } else {
                let new = Storage()
                self.application.storage[Key.self] = new
                return new
            }
        }
    }
}
