-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server Version:               10.4.6-MariaDB - mariadb.org binary distribution
-- Server Betriebssystem:        Win64
-- HeidiSQL Version:             10.2.0.5599
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;


-- Exportiere Datenbank Struktur für csr_db
CREATE DATABASE IF NOT EXISTS `csr_db` /*!40100 DEFAULT CHARACTER SET latin1 */;
USE `csr_db`;

-- Exportiere Struktur von Tabelle csr_db.auth_level
CREATE TABLE IF NOT EXISTS `auth_level` (
  `Auth_Level_ID` int(11) NOT NULL,
  `Definition` text NOT NULL,
  PRIMARY KEY (`Auth_Level_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Exportiere Daten aus Tabelle csr_db.auth_level: ~3 rows (ungefähr)
DELETE FROM `auth_level`;
/*!40000 ALTER TABLE `auth_level` DISABLE KEYS */;
INSERT INTO `auth_level` (`Auth_Level_ID`, `Definition`) VALUES
	(1, 'Guest'),
	(5, 'Standard\r\n'),
	(7, 'Business Expert'),
	(10, 'Super Admin');
/*!40000 ALTER TABLE `auth_level` ENABLE KEYS */;

-- Exportiere Struktur von Tabelle csr_db.outofoffice
CREATE TABLE IF NOT EXISTS `outofoffice` (
  `Missing_ID` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `User` int(11) unsigned DEFAULT NULL,
  `start` text DEFAULT NULL,
  `end` text DEFAULT NULL,
  PRIMARY KEY (`Missing_ID`),
  KEY `User_ID` (`User`),
  CONSTRAINT `FK_outofoffice_users` FOREIGN KEY (`User`) REFERENCES `users` (`User_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=71 DEFAULT CHARSET=latin1;

-- Exportiere Daten aus Tabelle csr_db.outofoffice: ~0 rows (ungefähr)
DELETE FROM `outofoffice`;
/*!40000 ALTER TABLE `outofoffice` DISABLE KEYS */;
/*!40000 ALTER TABLE `outofoffice` ENABLE KEYS */;

-- Exportiere Struktur von Tabelle csr_db.pending_definition
CREATE TABLE IF NOT EXISTS `pending_definition` (
  `Pending_ID` tinyint(4) NOT NULL AUTO_INCREMENT,
  `Definition` text NOT NULL,
  PRIMARY KEY (`Pending_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=latin1;

-- Exportiere Daten aus Tabelle csr_db.pending_definition: ~5 rows (ungefähr)
DELETE FROM `pending_definition`;
/*!40000 ALTER TABLE `pending_definition` DISABLE KEYS */;
INSERT INTO `pending_definition` (`Pending_ID`, `Definition`) VALUES
	(0, 'Not Presenting'),
	(1, 'Presentation not filled in'),
	(2, 'Moderator'),
	(10, 'Presentation filled in');
/*!40000 ALTER TABLE `pending_definition` ENABLE KEYS */;

-- Exportiere Struktur von Tabelle csr_db.presentations
CREATE TABLE IF NOT EXISTS `presentations` (
  `Presentation_ID` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `Topic` text DEFAULT NULL,
  `Presenter` int(11) unsigned DEFAULT NULL,
  `Presentation_Category` char(50) DEFAULT NULL,
  `Date` text DEFAULT NULL,
  `Last_Changed` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `Presentation_Held` tinyint(3) unsigned DEFAULT 0,
  PRIMARY KEY (`Presentation_ID`),
  KEY `FK_presentations_users` (`Presenter`),
  CONSTRAINT `FK_presentations_users` FOREIGN KEY (`Presenter`) REFERENCES `users` (`User_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=220 DEFAULT CHARSET=latin1;

-- Exportiere Daten aus Tabelle csr_db.presentations: ~1 rows (ungefähr)
DELETE FROM `presentations`;
/*!40000 ALTER TABLE `presentations` DISABLE KEYS */;
/*!40000 ALTER TABLE `presentations` ENABLE KEYS */;

-- Exportiere Struktur von Tabelle csr_db.users
CREATE TABLE IF NOT EXISTS `users` (
  `User_ID` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `Username` text DEFAULT NULL,
  `E_Mail` text DEFAULT NULL,
  `FirstName` text DEFAULT NULL,
  `LastName` text DEFAULT NULL,
  `CancelTokens` int(11) NOT NULL DEFAULT 2,
  `Pending_Presentation` tinyint(4) NOT NULL DEFAULT 0,
  `Last_Probability` float DEFAULT 0,
  `Amount_A` int(11) unsigned NOT NULL DEFAULT 0,
  `Amount_B` int(11) unsigned NOT NULL DEFAULT 0,
  `Amount_C` int(11) unsigned NOT NULL DEFAULT 0,
  `Authentication_Level` int(11) NOT NULL DEFAULT 5,
  `Password` text DEFAULT NULL,
  `token` tinytext DEFAULT NULL,
  `ResetToken` text DEFAULT NULL,
  PRIMARY KEY (`User_ID`),
  KEY `Username` (`Username`(3072)),
  KEY `FK_users_pending_definition` (`Pending_Presentation`),
  KEY `FK_users_auth_level` (`Authentication_Level`),
  CONSTRAINT `FK_users_auth_level` FOREIGN KEY (`Authentication_Level`) REFERENCES `auth_level` (`Auth_Level_ID`),
  CONSTRAINT `FK_users_pending_definition` FOREIGN KEY (`Pending_Presentation`) REFERENCES `pending_definition` (`Pending_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=latin1;

-- Exportiere Daten aus Tabelle csr_db.users: ~1 rows (ungefähr)
DELETE FROM `users`;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` (`User_ID`, `Username`, `E_Mail`, `FirstName`, `LastName`, `CancelTokens`, `Pending_Presentation`, `Last_Probability`, `Amount_A`, `Amount_B`, `Amount_C`, `Authentication_Level`, `Password`, `token`, `ResetToken`) VALUES
	(0, 'SuperAdmin', 'postmaster@mail.3dstudis.net\r\n', 'Admin', 'Admin', 2, 0, 0, 0, 0, 0, 10, '$2a$10$N84RHqbQZR8tlR8UCpvH8emde6PoWyClUWvv1HiPkW6hWVQtci.9a', NULL, NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
