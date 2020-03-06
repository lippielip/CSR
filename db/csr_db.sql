-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               10.5.1-MariaDB - mariadb.org binary distribution
-- Server OS:                    Win64
-- HeidiSQL Version:             10.3.0.5771
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;


-- Dumping database structure for csr_db
CREATE DATABASE IF NOT EXISTS `csr_db` /*!40100 DEFAULT CHARACTER SET latin1 */;
USE `csr_db`;

-- Dumping structure for table csr_db.auth_level
CREATE TABLE IF NOT EXISTS `auth_level` (
  `Auth_Level_ID` int(11) NOT NULL,
  `Definition` text NOT NULL,
  PRIMARY KEY (`Auth_Level_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Dumping data for table csr_db.auth_level: ~4 rows (approximately)
/*!40000 ALTER TABLE `auth_level` DISABLE KEYS */;
REPLACE INTO `auth_level` (`Auth_Level_ID`, `Definition`) VALUES
	(1, 'Guest'),
	(5, 'Standard\r\n'),
	(7, 'Business Expert'),
	(10, 'Super Admin');
/*!40000 ALTER TABLE `auth_level` ENABLE KEYS */;

-- Dumping structure for table csr_db.options
CREATE TABLE IF NOT EXISTS `options` (
  `Option_ID` int(11) NOT NULL AUTO_INCREMENT,
  `Name` text DEFAULT NULL,
  `Selected` bit(1) NOT NULL DEFAULT b'0' COMMENT 'Determine which option is selected',
  `Choose_Random` int(11) DEFAULT NULL COMMENT 'Enable or disable choose random cors job (changes chooseRandom function)',
  `Email_Frequency` int(11) DEFAULT NULL COMMENT 'Email frequency in days (changes dailyCheck function)',
  `Colloquium_Frequency` int(11) DEFAULT NULL COMMENT 'Min time between last and next Colloquium (changes dailyCheck date lookahead/ compare)',
  `Comment` text DEFAULT NULL,
  `Next_Colloquium` date DEFAULT NULL,
  `Last_Email` date DEFAULT NULL,
  PRIMARY KEY (`Option_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=latin1;

-- Dumping data for table csr_db.options: ~3 rows (approximately)
/*!40000 ALTER TABLE `options` DISABLE KEYS */;
REPLACE INTO `options` (`Option_ID`, `Name`, `Selected`, `Choose_Random`, `Email_Frequency`, `Colloquium_Frequency`, `Comment`, `Next_Colloquium`, `Last_Email`) VALUES
	(1, 'weekly random', b'0', 1, 1, 7, 'default option (One colloquium every week with a daily check)', NULL, NULL),
	(2, 'weekly not random', b'0', 0, 1, 7, 'no random choosing but still every week with daily mail (voluntary colloquium)', NULL, NULL),
	(3, 'monthly', b'1', 0, 7, 30, 'no random choosing and only monthly', NULL, NULL);
/*!40000 ALTER TABLE `options` ENABLE KEYS */;

-- Dumping structure for table csr_db.outofoffice
CREATE TABLE IF NOT EXISTS `outofoffice` (
  `Missing_ID` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `User` int(11) unsigned DEFAULT NULL,
  `start` text DEFAULT NULL,
  `end` text DEFAULT NULL,
  PRIMARY KEY (`Missing_ID`),
  KEY `User_ID` (`User`),
  CONSTRAINT `FK_outofoffice_users` FOREIGN KEY (`User`) REFERENCES `users` (`User_ID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=84 DEFAULT CHARSET=latin1;

-- Dumping data for table csr_db.outofoffice: ~0 rows (approximately)
/*!40000 ALTER TABLE `outofoffice` DISABLE KEYS */;
/*!40000 ALTER TABLE `outofoffice` ENABLE KEYS */;

-- Dumping structure for table csr_db.pending_definition
CREATE TABLE IF NOT EXISTS `pending_definition` (
  `Pending_ID` tinyint(4) NOT NULL AUTO_INCREMENT,
  `Definition` text NOT NULL,
  PRIMARY KEY (`Pending_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=latin1;

-- Dumping data for table csr_db.pending_definition: ~4 rows (approximately)
/*!40000 ALTER TABLE `pending_definition` DISABLE KEYS */;
REPLACE INTO `pending_definition` (`Pending_ID`, `Definition`) VALUES
	(0, 'Not Presenting'),
	(1, 'Presentation not filled in'),
	(2, 'Moderator'),
	(10, 'Presentation filled in');
/*!40000 ALTER TABLE `pending_definition` ENABLE KEYS */;

-- Dumping structure for table csr_db.presentations
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
  CONSTRAINT `FK_presentations_users` FOREIGN KEY (`Presenter`) REFERENCES `users` (`User_ID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=288 DEFAULT CHARSET=latin1;

-- Dumping data for table csr_db.presentations: ~0 rows (approximately)
/*!40000 ALTER TABLE `presentations` DISABLE KEYS */;
/*!40000 ALTER TABLE `presentations` ENABLE KEYS */;

-- Dumping structure for table csr_db.users
CREATE TABLE IF NOT EXISTS `users` (
  `User_ID` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `Username` text DEFAULT NULL,
  `E_Mail` text DEFAULT '',
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
  `ConfirmToken` text DEFAULT NULL,
  PRIMARY KEY (`User_ID`),
  KEY `Username` (`Username`(3072)),
  KEY `FK_users_pending_definition` (`Pending_Presentation`),
  KEY `FK_users_auth_level` (`Authentication_Level`),
  CONSTRAINT `FK_users_auth_level` FOREIGN KEY (`Authentication_Level`) REFERENCES `auth_level` (`Auth_Level_ID`),
  CONSTRAINT `FK_users_pending_definition` FOREIGN KEY (`Pending_Presentation`) REFERENCES `pending_definition` (`Pending_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=75 DEFAULT CHARSET=latin1;

-- Dumping data for table csr_db.users: ~1 rows (approximately)
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
REPLACE INTO `users` (`User_ID`, `Username`, `E_Mail`, `FirstName`, `LastName`, `CancelTokens`, `Pending_Presentation`, `Last_Probability`, `Amount_A`, `Amount_B`, `Amount_C`, `Authentication_Level`, `Password`, `token`, `ResetToken`, `ConfirmToken`) VALUES
	(0, 'SuperAdmin', '', 'Admin', 'Admin', 2, 0, 0, 0, 0, 0, 10, '$2a$10$svDNxUxvcSr6pTa7uAjGa.HQpw5TfFJvUfxS7HzqyEn94y5E33Jx2', NULL, NULL, NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
