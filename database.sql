-- MySQL dump 10.13  Distrib 8.0.31, for Linux (x86_64)
--
-- Host: db    Database: AHSSchedule2024
-- ------------------------------------------------------
-- Server version	8.0.28

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `courses`
--

DROP TABLE IF EXISTS `courses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `courses` (
  `id` int NOT NULL AUTO_INCREMENT,
  `code` varchar(255) NOT NULL,
  `semester` int DEFAULT NULL,
  `section` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `dcDays` varchar(6) DEFAULT NULL,
  `period` int NOT NULL,
  `location` varchar(255) NOT NULL,
  `credits` float NOT NULL,
  `size` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `courses`
--

LOCK TABLES `courses` WRITE;
/*!40000 ALTER TABLE `courses` DISABLE KEYS */;
INSERT INTO `courses` VALUES (0,'EMPTY',1,'EMPTY','EMPTY',NULL,255,'MARS',255,0);
/*!40000 ALTER TABLE `courses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `userSchedule`
--

DROP TABLE IF EXISTS `userSchedule`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `userSchedule` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `periodZero` int NOT NULL,
  `periodOne` int NOT NULL,
  `periodTwo` int NOT NULL,
  `periodThree` int NOT NULL,
  `periodFour` int NOT NULL,
  `periodFive` int NOT NULL,
  `periodSix` int NOT NULL,
  `periodSeven` int NOT NULL,
  `periodEight` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `userSchedule`
--

LOCK TABLES `userSchedule` WRITE;
/*!40000 ALTER TABLE `userSchedule` DISABLE KEYS */;
INSERT INTO `userSchedule` VALUES (3,1,0,0,0,0,0,0,0,0,0),(4,1,0,0,0,0,0,0,0,0,0),(5,1,0,0,0,0,0,0,0,0,0),(6,1,0,0,0,0,0,0,0,0,0),(7,1,0,0,0,0,0,0,0,0,0),(8,1,0,0,0,0,0,0,0,0,0),(9,1,0,0,0,0,0,0,0,0,0),(10,1,0,0,0,0,0,0,0,0,0),(11,1,0,0,0,0,0,0,0,0,0),(12,1,0,0,0,0,0,0,0,0,0),(13,1,0,0,0,0,0,0,0,0,0),(14,1,0,0,0,0,0,0,0,0,0),(15,1,0,0,0,0,0,0,0,0,0),(16,1,0,0,0,0,0,0,0,0,0),(17,1,0,0,0,0,0,0,0,0,0),(18,1,0,0,0,0,0,0,0,0,0),(19,1,0,0,0,0,0,0,0,0,0);
/*!40000 ALTER TABLE `userSchedule` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `userTokens`
--

DROP TABLE IF EXISTS `userTokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `userTokens` (
  `id` int NOT NULL AUTO_INCREMENT,
  `value` varchar(255) NOT NULL,
  `userId` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `userTokens`
--

LOCK TABLES `userTokens` WRITE;
/*!40000 ALTER TABLE `userTokens` DISABLE KEYS */;
/*!40000 ALTER TABLE `userTokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) DEFAULT NULL,
  `password_hash` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'test@test.com','$2b$12$.jZpHgH.8EqGdz5u7UThbuokr4xxCBcwkrlpYEEY8Ec4oztLfJ66y'),(8,'$2b$12$K8qenVekYOuM5MzMaJhE8eb/htXYiaTIWKVQ0qXBBHHhIz8y9Cvbu','$2b$12$mzlgeKDEfK3mddJzeVf58ecu7GbbEIOPbqiF81CFq7XDvcDkMD9lS'),(9,'$2b$12$31pMf6hwkau1Nw8jK0kQzOIR36xMZoagcN4qObdeHgOASKndmkmcq','$2b$12$iFxbWpIMGvNtE82GoRu2NeMc/GW91Si478TeedYNgn/ZqIaFvcIP2'),(10,'$2b$12$EC6iWRd9.PM4ThzRYFv5gOqeCpsXYDz0LedOOn6lDxpQangSqVOsa','$2b$12$5NOJQ91oUAu99Pw8j/7bp.ts1AnlbnvQRFmJQLyMU.p2jg.Mf8F..'),(11,'muqadam.sabir@student.allenisd.org','$2b$12$toyD9PR5LgYr9ukAF3wgaOmN9KfArMOQ3ZSc2TcEFOU9zvVZQ3LQ2');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-02-04 19:01:05
