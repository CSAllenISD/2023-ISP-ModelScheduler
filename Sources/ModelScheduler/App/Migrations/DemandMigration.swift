import Fluent
import Foundation

struct DemandMigration: AsyncMigration {
    func prepare(on database: Database) async throws {
        let oldCourseData = try await database.query(Courses.self).all()

        // group all by code
        let courseDictionary = Dictionary(grouping: oldCourseData, by: \.code)

        // code -> course
        var masterCourses: [LookupData: Courses] = [:]
        // old -> new
        var migratingCourses: [MigrationData] = []

        for (code, courses) in courseDictionary {
            for course in courses {
                let lookupData = LookupData(period: course.period, classCode: code)

                if masterCourses[lookupData] == nil {
                    masterCourses[lookupData] = course
                    continue
                }

                let masterCourse = masterCourses[lookupData]! // force unwrap
                let migrationData = MigrationData(oldCourse: course, newCourse: masterCourse)

                migratingCourses.append(migrationData)
            }
        }

        for migratingCourse in migratingCourses {
            migratingCourse.migrate()

            // dango rus
            try await migratingCourse.newCourse.update(on: database)
            try await migratingCourse.oldCourse.delete(on: database)
        }

        // sectionId -> lookupdata
        let oldSectionIdToCourse = Dictionary(uniqueKeysWithValues: oldCourseData.map {
                                                  ($0.id!, LookupData(period: $0.period, classCode: $0.code))
                                              })

        let userSchedules = try await database.query(UserSchedule.self).all()

        for schedule in userSchedules {
            func migrate(_ code: inout String?, _ period: Int) {
                guard code != nil else {
                    return
                }
                let possibleLookupData = oldSectionIdToCourse[code!]

                guard possibleLookupData != nil else {
                    print("Could not find course \(code!)")
                    return
                }
                let finalLookupData = possibleLookupData!.period == period
                  ? possibleLookupData!
                  : LookupData(period: period, classCode: possibleLookupData!.classCode)

                let masterCourseCode = masterCourses[finalLookupData]?.code // migrate to courseCode instead of sectionId

                //overwrite
                code = masterCourseCode
            }
            migrate(&schedule.periodZero, 0)
            migrate(&schedule.periodOne, 1)
            migrate(&schedule.periodTwo, 2)
            migrate(&schedule.periodThree, 3)
            migrate(&schedule.periodFour, 4)
            migrate(&schedule.periodFive, 5)
            migrate(&schedule.periodSix, 6)
            migrate(&schedule.periodSeven, 7)
            migrate(&schedule.periodEight, 8)

            try await schedule.update(on: database)
        }

        //TODO USER SCHEDULES
    }
    func revert(on database: Database) async throws {
        // Undo the change made in `prepare`, if possible.
    }

    struct LookupData: Hashable {
        let period: Int
        let classCode: String
    }

    struct MigrationData {
        let oldCourse: Courses
        let newCourse: Courses

        func migrate() {
            newCourse.studentMax += oldCourse.studentMax // add seats
            // not using +1 to section count as they can fold together.
            newCourse.duplicateSectionCount += oldCourse.duplicateSectionCount
        }
    }
 }
