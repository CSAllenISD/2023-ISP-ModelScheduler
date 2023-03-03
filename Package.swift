// swift-tools-version:5.7
// The swift-tools-version declares the minimum version of Swift required to build this package.

import PackageDescription

let package = Package(
  name: "ModelScheduler",
  dependencies: [
    .package(url: "https://github.com/apple/swift-atomics.git", from: "1.0.2"),
  
  ],
  targets: [
    // Targets are the basic building blocks of a package. A target can define a module or a test suite.
    // Targets can depend on other targets in this package, and on products in packages which this package depends on.
    .target(name: "CBase32"),
    .target(name: "CVaporBcrypt"),
    .executableTarget(name: "ModelScheduler", dependencies: [
                                            .product(name: "Atomics", package: "swift-atomics"),
                                            .target(name: "CBase32"),
                                            .target(name: "CVaporBcrypt")
                                            
                                              ])
  ]
)
