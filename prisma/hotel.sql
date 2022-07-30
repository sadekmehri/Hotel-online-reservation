-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 22, 2022 at 09:19 PM
-- Server version: 10.4.22-MariaDB
-- PHP Version: 8.1.1

SET FOREIGN_KEY_CHECKS=0;
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `hotel`
--
CREATE DATABASE IF NOT EXISTS `hotel` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `hotel`;

-- --------------------------------------------------------

--
-- Table structure for table `addresses`
--

DROP TABLE IF EXISTS `addresses`;
CREATE TABLE IF NOT EXISTS `addresses` (
  `addressId` smallint(5) UNSIGNED NOT NULL AUTO_INCREMENT,
  `address` varchar(50) NOT NULL,
  `address2` varchar(50) DEFAULT NULL,
  `cityId` smallint(5) UNSIGNED NOT NULL,
  `postalCode` varchar(10) DEFAULT NULL,
  `phone` varchar(20) NOT NULL,
  `createDate` datetime NOT NULL DEFAULT current_timestamp(),
  `lastUpdate` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`addressId`),
  UNIQUE KEY `uc_address_phone` (`phone`),
  KEY `fk_city_id` (`cityId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `bills`
--

DROP TABLE IF EXISTS `bills`;
CREATE TABLE IF NOT EXISTS `bills` (
  `billId` int(11) NOT NULL AUTO_INCREMENT,
  `reservationId` int(11) NOT NULL,
  `total` int(11) NOT NULL,
  `createDate` datetime NOT NULL DEFAULT current_timestamp(),
  `lastUpdate` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`billId`),
  KEY `fk_bill_reservation` (`reservationId`),
  CONSTRAINT CHK_Bill_total CHECK (total >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `cities`
--

DROP TABLE IF EXISTS `cities`;
CREATE TABLE IF NOT EXISTS `cities` (
  `cityId` smallint(5) UNSIGNED NOT NULL AUTO_INCREMENT,
  `city` varchar(50) NOT NULL,
  `countryId` smallint(5) UNSIGNED NOT NULL,
  PRIMARY KEY (`cityId`),
  KEY `fk_city_country` (`countryId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `countries`
--

DROP TABLE IF EXISTS `countries`;
CREATE TABLE IF NOT EXISTS `countries` (
  `countryId` smallint(5) UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  PRIMARY KEY (`countryId`),
  UNIQUE KEY `uc_country_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

DROP TABLE IF EXISTS `payments`;
CREATE TABLE IF NOT EXISTS `payments` (
  `paymentId` int(11) NOT NULL AUTO_INCREMENT,
  `billId` int(11) NOT NULL,
  `paymentTypeId` int(11) NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT 0,
  `transactionId` varchar(255) DEFAULT NULL,
  `createDate` datetime NOT NULL DEFAULT current_timestamp(),
  `lastUpdate` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`paymentId`),
  KEY `fk_payment_bill` (`billId`),
  KEY `fk_payment_payment_type` (`paymentTypeId`),
  CONSTRAINT CHK_Payment_status CHECK (`status` in (0, 1, 2))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `paymenttypes`
--

DROP TABLE IF EXISTS `paymenttypes`;
CREATE TABLE IF NOT EXISTS `paymenttypes` (
  `paymentTypeId` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  PRIMARY KEY (`paymentTypeId`),
  UNIQUE KEY `uc_payment_type_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `reservations`
--

DROP TABLE IF EXISTS `reservations`;
CREATE TABLE IF NOT EXISTS `reservations` (
  `reservationId` int(11) NOT NULL AUTO_INCREMENT,
  `userId` int(11) NOT NULL,
  `dateIn` date NOT NULL,
  `dateOut` date NOT NULL,
  `createDate` datetime NOT NULL DEFAULT current_timestamp(),
  `lastUpdate` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`reservationId`),
  KEY `fk_reservation_user` (`userId`),
  CONSTRAINT CHK_Reservation_dates CHECK (`dateOut` >=  `dateIn`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `reservedrooms`
--

DROP TABLE IF EXISTS `reservedrooms`;
CREATE TABLE IF NOT EXISTS `reservedrooms` (
  `reservedRoomId` int(11) NOT NULL AUTO_INCREMENT,
  `reservationId` int(11) NOT NULL,
  `roomId` int(11) NOT NULL,
  `price` int(11) NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`reservedRoomId`,`reservationId`,`roomId`),
  KEY `fk_reservedroom_room` (`roomId`),
  KEY `fk_reservedroom_reservation` (`reservationId`),
  CONSTRAINT CHK_ReservedRoom_price CHECK (`price` >=  0),
  CONSTRAINT CHK_ReservedRoom_status CHECK (`status` in (0 ,1 ,2))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `roomratings`
--

DROP TABLE IF EXISTS `roomratings`;
CREATE TABLE IF NOT EXISTS `roomratings` (
  `roomRatingId` int(11) NOT NULL AUTO_INCREMENT,
  `rating` smallint(6) NOT NULL,
  `description` tinytext NOT NULL,
  `roomId` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `createDate` datetime NOT NULL DEFAULT current_timestamp(),
  `lastUpdate` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`roomRatingId`),
  KEY `fk_roomrating_user` (`userId`),
  KEY `fk_roomrating_room` (`roomId`),
  CONSTRAINT CHK_RoomRating_rating CHECK (`rating` >= 0 and `rating` <= 5)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `rooms`
--

DROP TABLE IF EXISTS `rooms`;
CREATE TABLE IF NOT EXISTS `rooms` (
  `roomId` int(11) NOT NULL AUTO_INCREMENT,
  `code` varchar(100) NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT 1,
  `reserved` tinyint(1) NOT NULL DEFAULT 0,
  `price` int(11) NOT NULL,
  `roomTypeId` int(11) NOT NULL,
  `createDate` datetime NOT NULL DEFAULT current_timestamp(),
  `lastUpdate` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`roomId`),
  UNIQUE KEY `uc_room_code` (`code`),
  KEY `fk_room_room_type` (`roomTypeId`),
  CONSTRAINT CHK_Room_status CHECK (`status` in (0,1)),
  CONSTRAINT CHK_Room_reserved CHECK (`reserved` in (0,1)),
  CONSTRAINT CHK_Room_price CHECK (`price` >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `roomtypes`
--

DROP TABLE IF EXISTS `roomtypes`;
CREATE TABLE IF NOT EXISTS `roomtypes` (
  `roomTypeId` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(200) NOT NULL,
  PRIMARY KEY (`roomTypeId`),
  UNIQUE KEY `uc_room_type_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `userId` int(11) NOT NULL AUTO_INCREMENT,
  `firstName` varchar(100) NOT NULL,
  `lastName` varchar(100) NOT NULL,
  `email` varchar(255) NOT NULL,
  `cin` varchar(100) NULL,
  `dob` date NULL,
  `password` varchar(255) NOT NULL,
  `refreshToken` tinytext DEFAULT NULL,
  `isEmailConfirmed` tinyint(1) NOT NULL DEFAULT 0,
  `isActive` tinyint(1) NOT NULL DEFAULT 1,
  `isAdmin` tinyint(1) NOT NULL DEFAULT 0,
  `addressId` smallint(5) UNSIGNED DEFAULT NULL,
  `createDate` datetime NOT NULL DEFAULT current_timestamp(),
  `lastUpdate` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`userId`),
  UNIQUE KEY `uc_user_email` (`email`),
  UNIQUE KEY `uc_user_cin` (`cin`),
  KEY `fk_user_address` (`addressId`),
  CONSTRAINT CHK_User_active CHECK (`isActive` in (0,1)),
  CONSTRAINT CHK_User_admin CHECK (`isAdmin` in (0,1)),
  CONSTRAINT CHK_User_email_confirmed CHECK (`isEmailConfirmed` in (0,1))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `addresses`
--
ALTER TABLE `addresses`
  ADD CONSTRAINT `fk_address_city` FOREIGN KEY (`cityId`) REFERENCES `cities` (`cityId`) ON UPDATE CASCADE;

--
-- Constraints for table `bills`
--
ALTER TABLE `bills`
  ADD CONSTRAINT `fk_bill_reservation` FOREIGN KEY (`reservationId`) REFERENCES `reservations` (`reservationId`) ON UPDATE CASCADE;

--
-- Constraints for table `cities`
--
ALTER TABLE `cities`
  ADD CONSTRAINT `fk_city_country` FOREIGN KEY (`countryId`) REFERENCES `countries` (`countryId`) ON UPDATE CASCADE;

--
-- Constraints for table `payments`
--
ALTER TABLE `payments`
  ADD CONSTRAINT `fk_payment_bill` FOREIGN KEY (`billId`) REFERENCES `bills` (`billId`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_payment_payment_type` FOREIGN KEY (`paymentTypeId`) REFERENCES `paymenttypes` (`paymentTypeId`) ON UPDATE CASCADE;

--
-- Constraints for table `reservations`
--
ALTER TABLE `reservations`
  ADD CONSTRAINT `fk_reservation_user` FOREIGN KEY (`userId`) REFERENCES `users` (`userId`) ON UPDATE CASCADE;

--
-- Constraints for table `reservedrooms`
--
ALTER TABLE `reservedrooms`
  ADD CONSTRAINT `fk_reservedroom_reservation` FOREIGN KEY (`reservationId`) REFERENCES `reservations` (`reservationId`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_reservedroom_room` FOREIGN KEY (`roomId`) REFERENCES `rooms` (`roomId`) ON UPDATE CASCADE;

--
-- Constraints for table `roomratings`
--
ALTER TABLE `roomratings`
  ADD CONSTRAINT `fk_roomrating_room` FOREIGN KEY (`roomId`) REFERENCES `rooms` (`roomId`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_roomrating_user` FOREIGN KEY (`userId`) REFERENCES `users` (`userId`) ON UPDATE CASCADE;

--
-- Constraints for table `rooms`
--
ALTER TABLE `rooms`
  ADD CONSTRAINT `fk_room_room_type` FOREIGN KEY (`roomTypeId`) REFERENCES `roomtypes` (`roomTypeId`) ON UPDATE CASCADE;

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `fk_user_address` FOREIGN KEY (`addressId`) REFERENCES `addresses` (`addressId`) ON UPDATE CASCADE;
SET FOREIGN_KEY_CHECKS=1;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
