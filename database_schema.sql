CREATE DATABASE  IF NOT EXISTS `to-do-list` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `to-do-list`;
-- MySQL dump 10.13  Distrib 8.0.30, for Win64 (x86_64)
--
-- Host: localhost    Database: to-do-list
-- ------------------------------------------------------
-- Server version	8.0.30

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `personal_lists`
--

DROP TABLE IF EXISTS `personal_lists`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `personal_lists` (
  `id` char(36) NOT NULL,
  `name` varchar(100) NOT NULL,
  `color` varchar(7) DEFAULT '#E3E3E3',
  `position` int NOT NULL DEFAULT '0',
  `created_by` char(36) NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `created_by` (`created_by`),
  CONSTRAINT `personal_lists_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `personal_lists`
--

LOCK TABLES `personal_lists` WRITE;
/*!40000 ALTER TABLE `personal_lists` DISABLE KEYS */;
INSERT INTO `personal_lists` VALUES ('4a4b5ffd-3871-4e47-8416-eb73a091b720','third list','#51CF66',2,'d1d45d17-8f78-415c-af7d-dc760d309de4','2025-06-20 16:02:56',NULL,'2025-06-24 18:08:15'),('deefa728-72d8-43b1-8753-2725076547a0','groceries','#63E6E2',1,'d1d45d17-8f78-415c-af7d-dc760d309de4','2025-05-16 05:42:57',NULL,'2025-05-31 20:59:23');
/*!40000 ALTER TABLE `personal_lists` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `personal_tasks`
--

DROP TABLE IF EXISTS `personal_tasks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `personal_tasks` (
  `id` char(36) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text,
  `due_date` datetime DEFAULT NULL,
  `reminder_at` datetime DEFAULT NULL,
  `is_completed` tinyint(1) DEFAULT '0',
  `completed_at` datetime DEFAULT NULL,
  `position` int NOT NULL DEFAULT '0',
  `list_id` char(36) DEFAULT NULL,
  `created_by` char(36) NOT NULL,
  `assigned_to` char(36) DEFAULT NULL,
  `recurrence_rule` varchar(100) DEFAULT NULL,
  `next_recurrence` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `list_id` (`list_id`),
  KEY `created_by` (`created_by`),
  KEY `assigned_to` (`assigned_to`),
  CONSTRAINT `personal_tasks_ibfk_1` FOREIGN KEY (`list_id`) REFERENCES `personal_lists` (`id`) ON DELETE CASCADE,
  CONSTRAINT `personal_tasks_ibfk_2` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  CONSTRAINT `personal_tasks_ibfk_3` FOREIGN KEY (`assigned_to`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `personal_tasks`
--

LOCK TABLES `personal_tasks` WRITE;
/*!40000 ALTER TABLE `personal_tasks` DISABLE KEYS */;
INSERT INTO `personal_tasks` VALUES ('06f12327-2faf-4730-a0dd-e96c5378507c','daily task ',NULL,'2025-06-26 23:00:00',NULL,0,NULL,2,'4a4b5ffd-3871-4e47-8416-eb73a091b720','d1d45d17-8f78-415c-af7d-dc760d309de4',NULL,'DAILY',NULL,'2025-06-25 19:52:20','2025-06-25 23:00:04',NULL),('9827f7fc-9402-4345-ac1f-923cd09b8c68','testing 7:','wwdwdwd','2025-06-26 19:26:00',NULL,1,NULL,1,'deefa728-72d8-43b1-8753-2725076547a0','d1d45d17-8f78-415c-af7d-dc760d309de4',NULL,'DAILY',NULL,'2025-06-25 18:08:31','2025-06-25 22:26:50',NULL),('e7dfba4c-196c-4339-946c-37ac85f270d6','raghad playing games',NULL,NULL,NULL,0,NULL,3,'deefa728-72d8-43b1-8753-2725076547a0','d1d45d17-8f78-415c-af7d-dc760d309de4',NULL,NULL,NULL,'2025-06-25 22:26:04','2025-06-26 07:51:40',NULL),('e99ed43d-f5a4-40a2-956a-01201bdb9c2f','i hate everything',NULL,'2025-06-26 15:00:00',NULL,0,NULL,4,'deefa728-72d8-43b1-8753-2725076547a0','d1d45d17-8f78-415c-af7d-dc760d309de4',NULL,'DAILY',NULL,'2025-06-25 22:27:21','2025-06-26 07:51:34',NULL);
/*!40000 ALTER TABLE `personal_tasks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `team_lists`
--

DROP TABLE IF EXISTS `team_lists`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `team_lists` (
  `id` char(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `color` varchar(7) DEFAULT NULL,
  `team_id` char(36) NOT NULL,
  `position` int NOT NULL DEFAULT '0',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `team_id` (`team_id`),
  CONSTRAINT `team_lists_ibfk_1` FOREIGN KEY (`team_id`) REFERENCES `teams` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `team_lists`
--

LOCK TABLES `team_lists` WRITE;
/*!40000 ALTER TABLE `team_lists` DISABLE KEYS */;
/*!40000 ALTER TABLE `team_lists` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `team_members`
--

DROP TABLE IF EXISTS `team_members`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `team_members` (
  `team_id` char(36) NOT NULL,
  `user_id` char(36) NOT NULL,
  `role` enum('owner','admin','member') DEFAULT 'member',
  `joined_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`team_id`,`user_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `team_members_ibfk_1` FOREIGN KEY (`team_id`) REFERENCES `teams` (`id`) ON DELETE CASCADE,
  CONSTRAINT `team_members_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `team_members`
--

LOCK TABLES `team_members` WRITE;
/*!40000 ALTER TABLE `team_members` DISABLE KEYS */;
/*!40000 ALTER TABLE `team_members` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `team_tasks`
--

DROP TABLE IF EXISTS `team_tasks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `team_tasks` (
  `id` char(36) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text,
  `due_date` datetime DEFAULT NULL,
  `reminder_at` datetime DEFAULT NULL,
  `is_completed` tinyint(1) DEFAULT '0',
  `completed_at` datetime DEFAULT NULL,
  `position` int NOT NULL DEFAULT '0',
  `list_id` char(36) NOT NULL,
  `created_by` char(36) NOT NULL,
  `assigned_to` char(36) DEFAULT NULL,
  `recurrence_rule` varchar(100) DEFAULT NULL,
  `next_recurrence` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `list_id` (`list_id`),
  KEY `created_by` (`created_by`),
  KEY `assigned_to` (`assigned_to`),
  CONSTRAINT `team_tasks_ibfk_1` FOREIGN KEY (`list_id`) REFERENCES `team_lists` (`id`) ON DELETE CASCADE,
  CONSTRAINT `team_tasks_ibfk_2` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  CONSTRAINT `team_tasks_ibfk_3` FOREIGN KEY (`assigned_to`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `team_tasks`
--

LOCK TABLES `team_tasks` WRITE;
/*!40000 ALTER TABLE `team_tasks` DISABLE KEYS */;
/*!40000 ALTER TABLE `team_tasks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `teams`
--

DROP TABLE IF EXISTS `teams`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `teams` (
  `id` char(36) NOT NULL,
  `name` varchar(100) NOT NULL,
  `created_by` char(36) NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `created_by` (`created_by`),
  CONSTRAINT `teams_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `teams`
--

LOCK TABLES `teams` WRITE;
/*!40000 ALTER TABLE `teams` DISABLE KEYS */;
/*!40000 ALTER TABLE `teams` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` char(36) NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `name` varchar(50) DEFAULT NULL,
  `verification_token` varchar(100) DEFAULT NULL,
  `is_verified` tinyint(1) DEFAULT '0',
  `verification_token_expiry` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `last_login` datetime DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL,
  `profile_image_url` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `account_locked` tinyint(1) DEFAULT '0',
  `failed_login_attempts` int DEFAULT '0',
  `role` varchar(20) DEFAULT 'USER',
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES ('0194aa1c-84b9-4480-b855-8618299ceaff','Ahmad1231a','Ahmad123@nonce.com','$2a$12$OJB4bSkJanw.FS5kl9Llhu0Z0EKVIqVD4ej2byQmD2hcnud8eizQW',NULL,NULL,0,NULL,'2025-06-26 14:55:56','2025-06-26 14:55:56',NULL,NULL,NULL,1,0,0,'USER'),('981a7037-a7ad-43a3-9120-a809d9421166','Ahmad1234','Ahmad1234@example.com','$2a$12$K6r7FwCQoYCdUrqoe5q.j.pOKJXoS2dqas7gg05nmIXJQrturQEWm',NULL,NULL,0,NULL,'2025-06-26 14:28:52','2025-06-26 14:28:52',NULL,NULL,NULL,1,0,0,'USER'),('d1d45d17-8f78-415c-af7d-dc760d309de4','Ahmad123','Ahmad123@example.com','$2a$12$UjQfhCsNnvr0zGR3RTJ9ROeMatNA6iD7VPegxNm3u0WvYqDuSrsuO',NULL,NULL,0,NULL,'2025-05-06 18:21:59','2025-05-06 18:21:59',NULL,NULL,NULL,1,0,0,'USER');
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

-- Dump completed on 2025-06-26 21:20:22
