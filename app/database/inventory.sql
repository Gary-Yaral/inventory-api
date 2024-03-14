/*
SQLyog Ultimate v11.11 (64 bit)
MySQL - 5.5.5-10.4.32-MariaDB : Database - inventory
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`inventory` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */;

USE `inventory`;

/*Table structure for table `category` */

DROP TABLE IF EXISTS `category`;

CREATE TABLE `category` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  UNIQUE KEY `name_2` (`name`),
  UNIQUE KEY `name_3` (`name`),
  UNIQUE KEY `name_4` (`name`),
  UNIQUE KEY `name_5` (`name`),
  UNIQUE KEY `name_6` (`name`),
  UNIQUE KEY `name_7` (`name`),
  UNIQUE KEY `name_8` (`name`),
  UNIQUE KEY `name_9` (`name`),
  UNIQUE KEY `name_10` (`name`),
  UNIQUE KEY `name_11` (`name`),
  UNIQUE KEY `name_12` (`name`),
  UNIQUE KEY `name_13` (`name`),
  UNIQUE KEY `name_14` (`name`),
  UNIQUE KEY `name_15` (`name`),
  UNIQUE KEY `name_16` (`name`),
  UNIQUE KEY `name_17` (`name`),
  UNIQUE KEY `name_18` (`name`),
  UNIQUE KEY `name_19` (`name`),
  UNIQUE KEY `name_20` (`name`),
  UNIQUE KEY `name_21` (`name`),
  UNIQUE KEY `name_22` (`name`),
  UNIQUE KEY `name_23` (`name`),
  UNIQUE KEY `name_24` (`name`),
  UNIQUE KEY `name_25` (`name`),
  UNIQUE KEY `name_26` (`name`),
  UNIQUE KEY `name_27` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `category` */

insert  into `category`(`id`,`name`) values (4,'LAMPARAS'),(1,'MARTILLOS');

/*Table structure for table `damaged_images` */

DROP TABLE IF EXISTS `damaged_images`;

CREATE TABLE `damaged_images` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `inventoryId` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `inventoryId` (`inventoryId`),
  CONSTRAINT `damaged_images_ibfk_1` FOREIGN KEY (`inventoryId`) REFERENCES `inventory` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `damaged_images` */

/*Table structure for table `images` */

DROP TABLE IF EXISTS `images`;

CREATE TABLE `images` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `inventoryId` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `inventoryId` (`inventoryId`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `images` */

/*Table structure for table `inventory` */

DROP TABLE IF EXISTS `inventory`;

CREATE TABLE `inventory` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `price` double NOT NULL,
  `quantity` double NOT NULL,
  `damaged` double NOT NULL,
  `description` varchar(500) DEFAULT NULL,
  `invoiceId` int(11) NOT NULL,
  `categoryId` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `invoiceId` (`invoiceId`),
  KEY `categoryId` (`categoryId`),
  CONSTRAINT `inventory_ibfk_1` FOREIGN KEY (`invoiceId`) REFERENCES `invoice` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `inventory_ibfk_2` FOREIGN KEY (`categoryId`) REFERENCES `category` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `inventory` */

insert  into `inventory`(`id`,`name`,`price`,`quantity`,`damaged`,`description`,`invoiceId`,`categoryId`) values (8,'Martillo decker',0,15,15,'NaN',11,1);

/*Table structure for table `invoice` */

DROP TABLE IF EXISTS `invoice`;

CREATE TABLE `invoice` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `code` varchar(255) NOT NULL,
  `date` datetime NOT NULL,
  `observation` varchar(255) NOT NULL,
  `providerId` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `invoice_ibfk_1` (`providerId`),
  CONSTRAINT `invoice_ibfk_1` FOREIGN KEY (`providerId`) REFERENCES `provider` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `invoice` */

insert  into `invoice`(`id`,`code`,`date`,`observation`,`providerId`) values (11,'FACT-001','2024-03-13 00:00:00','No',5);

/*Table structure for table `provider` */

DROP TABLE IF EXISTS `provider`;

CREATE TABLE `provider` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `ruc` varchar(255) NOT NULL,
  `address` varchar(255) NOT NULL,
  `telephone` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `provider` */

insert  into `provider`(`id`,`name`,`ruc`,`address`,`telephone`,`email`) values (5,'COMPUTRON','1790085783001','MEJIA Y ROLDOS AGUILERA','0935523522','miguelangel@gmail.com');

/*Table structure for table `role` */

DROP TABLE IF EXISTS `role`;

CREATE TABLE `role` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  UNIQUE KEY `name_2` (`name`),
  UNIQUE KEY `name_3` (`name`),
  UNIQUE KEY `name_4` (`name`),
  UNIQUE KEY `name_5` (`name`),
  UNIQUE KEY `name_6` (`name`),
  UNIQUE KEY `name_7` (`name`),
  UNIQUE KEY `name_8` (`name`),
  UNIQUE KEY `name_9` (`name`),
  UNIQUE KEY `name_10` (`name`),
  UNIQUE KEY `name_11` (`name`),
  UNIQUE KEY `name_12` (`name`),
  UNIQUE KEY `name_13` (`name`),
  UNIQUE KEY `name_14` (`name`),
  UNIQUE KEY `name_15` (`name`),
  UNIQUE KEY `name_16` (`name`),
  UNIQUE KEY `name_17` (`name`),
  UNIQUE KEY `name_18` (`name`),
  UNIQUE KEY `name_19` (`name`),
  UNIQUE KEY `name_20` (`name`),
  UNIQUE KEY `name_21` (`name`),
  UNIQUE KEY `name_22` (`name`),
  UNIQUE KEY `name_23` (`name`),
  UNIQUE KEY `name_24` (`name`),
  UNIQUE KEY `name_25` (`name`),
  UNIQUE KEY `name_26` (`name`),
  UNIQUE KEY `name_27` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `role` */

insert  into `role`(`id`,`name`) values (1,'ADMINISTRADOR'),(2,'USUARIO');

/*Table structure for table `user` */

DROP TABLE IF EXISTS `user`;

CREATE TABLE `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `lastname` varchar(255) NOT NULL,
  `username` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `roleId` int(11) NOT NULL,
  `statusId` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `username_2` (`username`),
  UNIQUE KEY `username_3` (`username`),
  UNIQUE KEY `username_4` (`username`),
  UNIQUE KEY `username_5` (`username`),
  UNIQUE KEY `username_6` (`username`),
  UNIQUE KEY `username_7` (`username`),
  UNIQUE KEY `username_8` (`username`),
  UNIQUE KEY `username_9` (`username`),
  UNIQUE KEY `username_10` (`username`),
  UNIQUE KEY `username_11` (`username`),
  UNIQUE KEY `username_12` (`username`),
  UNIQUE KEY `username_13` (`username`),
  UNIQUE KEY `username_14` (`username`),
  UNIQUE KEY `username_15` (`username`),
  UNIQUE KEY `username_16` (`username`),
  UNIQUE KEY `username_17` (`username`),
  UNIQUE KEY `username_18` (`username`),
  UNIQUE KEY `username_19` (`username`),
  UNIQUE KEY `username_20` (`username`),
  UNIQUE KEY `username_21` (`username`),
  UNIQUE KEY `username_22` (`username`),
  UNIQUE KEY `username_23` (`username`),
  UNIQUE KEY `username_24` (`username`),
  UNIQUE KEY `username_25` (`username`),
  UNIQUE KEY `username_26` (`username`),
  UNIQUE KEY `username_27` (`username`),
  KEY `roleId` (`roleId`),
  KEY `statusId` (`statusId`),
  CONSTRAINT `user_ibfk_55` FOREIGN KEY (`roleId`) REFERENCES `role` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `user_ibfk_56` FOREIGN KEY (`statusId`) REFERENCES `user_status` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `user` */

insert  into `user`(`id`,`name`,`lastname`,`username`,`password`,`roleId`,`statusId`) values (1,'GUSTAVO ARMANDO','LOPEZ MOREIRA','Miusuario_2024','$2b$10$QJz3kiGbrEeO5LRViqmjlerXSOk/cp283E5iwLK4yiJ4dGpZ9IWEe',1,1),(2,'PEDRO ANDRES','MURILLO GONZALES','Pedro_2025','$2b$10$MEsLipFCd3Dk38oOEtL1jO3hFvtBTp70IKskzJg1aMt1fEJda1ZiC',2,1),(4,'SDSDG','DGDSG','Julio_2024','$2b$10$6MXA.w/AONet9jDiolg2bOsuUTPkq7q8UQZB1Y/79LcFFzOn/Chie',2,2),(5,'DSDSG','DSG','Miusuario_2026','$2b$10$1Zcpb5vKbQmEVFZS8c11huIBtUfZPRASSbgu2lxPYmTValTgCF30O',2,1);

/*Table structure for table `user_status` */

DROP TABLE IF EXISTS `user_status`;

CREATE TABLE `user_status` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  UNIQUE KEY `name_2` (`name`),
  UNIQUE KEY `name_3` (`name`),
  UNIQUE KEY `name_4` (`name`),
  UNIQUE KEY `name_5` (`name`),
  UNIQUE KEY `name_6` (`name`),
  UNIQUE KEY `name_7` (`name`),
  UNIQUE KEY `name_8` (`name`),
  UNIQUE KEY `name_9` (`name`),
  UNIQUE KEY `name_10` (`name`),
  UNIQUE KEY `name_11` (`name`),
  UNIQUE KEY `name_12` (`name`),
  UNIQUE KEY `name_13` (`name`),
  UNIQUE KEY `name_14` (`name`),
  UNIQUE KEY `name_15` (`name`),
  UNIQUE KEY `name_16` (`name`),
  UNIQUE KEY `name_17` (`name`),
  UNIQUE KEY `name_18` (`name`),
  UNIQUE KEY `name_19` (`name`),
  UNIQUE KEY `name_20` (`name`),
  UNIQUE KEY `name_21` (`name`),
  UNIQUE KEY `name_22` (`name`),
  UNIQUE KEY `name_23` (`name`),
  UNIQUE KEY `name_24` (`name`),
  UNIQUE KEY `name_25` (`name`),
  UNIQUE KEY `name_26` (`name`),
  UNIQUE KEY `name_27` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `user_status` */

insert  into `user_status`(`id`,`name`) values (1,'ACTIVO'),(2,'BLOQUEADO');

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
