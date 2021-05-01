-- phpMyAdmin SQL Dump
-- version 4.9.5deb2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: May 01, 2021 at 06:11 AM
-- Server version: 10.3.25-MariaDB-0ubuntu0.20.04.1
-- PHP Version: 7.4.3

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `iui`
--

-- --------------------------------------------------------

--
-- Table structure for table `category`
--

CREATE TABLE `category` (
  `categoryID` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `description` text DEFAULT NULL,
  `parentID` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `category`
--

INSERT INTO `category` (`categoryID`, `name`, `description`, `parentID`) VALUES
(1, 'food', 'Food', NULL),
(2, 'drink', 'Drink', NULL),
(5, 'chocolate', 'Food or drinks with chocolate', NULL),
(6, 'salty', 'Salty food', 1),
(7, 'soft', 'Soft drinks', 2),
(8, 'water', 'Water drinks', 2),
(9, 'beer', 'Beer drinks', 2),
(10, 'liquor', NULL, 2);

-- --------------------------------------------------------

--
-- Table structure for table `order`
--

CREATE TABLE `order` (
  `orderID` int(11) NOT NULL,
  `productID` int(11) NOT NULL,
  `userID` int(11) DEFAULT NULL,
  `dateTime` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `product`
--

CREATE TABLE `product` (
  `productID` int(11) NOT NULL,
  `name` varchar(30) NOT NULL,
  `brand` varchar(30) DEFAULT NULL,
  `price` decimal(4,2) DEFAULT NULL,
  `quantity` int(11) NOT NULL DEFAULT 0,
  `weight` float DEFAULT NULL,
  `energy` float DEFAULT NULL,
  `emotion` varchar(50) NOT NULL,
  `smallImageUrl` varchar(255) DEFAULT NULL,
  `largeImageUrl` varchar(255) DEFAULT NULL,
  `state` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `product`
--

INSERT INTO `product` (`productID`, `name`, `brand`, `price`, `quantity`, `weight`, `energy`, `emotion`, `smallImageUrl`, `largeImageUrl`, `state`) VALUES
(1, 'Snickers', 'Mars Inc.', '1.50', 11, 57, NULL, 'surprised', NULL, 'https://images-na.ssl-images-amazon.com/images/I/51wC43V7M-L._SX522_.jpg', 1),
(2, 'Mars', 'Mars Inc.', '1.50', 11, 51, NULL, 'sad', NULL, 'https://images-na.ssl-images-amazon.com/images/I/81GgOH3XY6L._SL1500_.jpg', 1),
(3, 'Twix', 'Mars Inc.', '1.50', 11, NULL, NULL, 'sad', NULL, 'https://images-na.ssl-images-amazon.com/images/I/71IBchCAjdL._SL1500_.jpg', 1),
(4, 'm&m', 'Mars Inc.', '1.50', 11, NULL, NULL, 'angry', NULL, NULL, 1),
(5, 'KitKat', 'Nestle', '1.50', 11, NULL, NULL, 'fearful', NULL, 'https://images-na.ssl-images-amazon.com/images/I/8156xntB-pL._SX425_.jpg', 1),
(6, 'Rittersport', 'Alfred Ritter GmbH & Co. KG', '1.50', 11, NULL, NULL, 'disgusted', NULL, NULL, 1),
(7, 'Bifi', 'Jack Link', '1.45', 11, NULL, NULL, 'happy', NULL, NULL, 1),
(8, 'still Water', 'Fountain', '0.70', 20, 500, NULL, 'surprised', NULL, NULL, 1),
(9, 'sparkling Water', 'Fountain', '0.70', 7, 500, NULL, 'neutral', NULL, NULL, 1),
(10, 'Apple spritzer', 'Fountain', '1.00', 0, 500, NULL, 'happy', NULL, NULL, 1),
(11, 'Fanta', 'Coca-Cola Company', '1.20', 5, 500, NULL, 'happy', NULL, NULL, 1),
(12, 'Cola', 'Coca-Cola Company', '1.30', 10, 330, NULL, 'neutral', NULL, NULL, 1),
(13, 'Spezi', 'Brauhaus Riegele', '1.20', 10, 500, NULL, 'angry', NULL, NULL, 1),
(14, 'Augustiner', 'Augustiner-Bräu Wagner KG', '1.60', 11, 500, NULL, 'happy', NULL, NULL, 1),
(15, 'Berliner Kindl', 'Oetker', '1.80', 5, 500, NULL, 'disgusted', NULL, NULL, 1),
(16, 'Coffee', 'Tchibo', '1.55', 10, 150, NULL, 'sad', NULL, NULL, 1);

-- --------------------------------------------------------

--
-- Table structure for table `product_category`
--

CREATE TABLE `product_category` (
  `productID` int(11) NOT NULL,
  `categoryID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `product_category`
--

INSERT INTO `product_category` (`productID`, `categoryID`) VALUES
(1, 1),
(1, 5),
(2, 1),
(2, 5),
(3, 1),
(3, 5),
(4, 1),
(4, 5),
(5, 1),
(5, 5),
(6, 1),
(6, 5),
(7, 1),
(7, 6),
(8, 2),
(8, 8),
(9, 2),
(9, 8),
(10, 2),
(10, 7),
(11, 2),
(11, 7),
(12, 2),
(12, 7),
(13, 2),
(13, 7),
(14, 2),
(14, 9),
(15, 2),
(15, 9),
(16, 2);

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `userID` int(11) NOT NULL,
  `name` varchar(24) DEFAULT NULL,
  `surname` varchar(24) DEFAULT NULL,
  `age` int(11) DEFAULT NULL,
  `faceData` longtext DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `category`
--
ALTER TABLE `category`
  ADD PRIMARY KEY (`categoryID`);

--
-- Indexes for table `order`
--
ALTER TABLE `order`
  ADD PRIMARY KEY (`orderID`),
  ADD KEY `order_user_user_ID_fk` (`userID`),
  ADD KEY `order_product_product_ID_fk` (`productID`);

--
-- Indexes for table `product`
--
ALTER TABLE `product`
  ADD PRIMARY KEY (`productID`);

--
-- Indexes for table `product_category`
--
ALTER TABLE `product_category`
  ADD PRIMARY KEY (`productID`,`categoryID`),
  ADD KEY `categoryID` (`categoryID`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`userID`),
  ADD UNIQUE KEY `name` (`name`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `category`
--
ALTER TABLE `category`
  MODIFY `categoryID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `order`
--
ALTER TABLE `order`
  MODIFY `orderID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `product`
--
ALTER TABLE `product`
  MODIFY `productID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `userID` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `order`
--
ALTER TABLE `order`
  ADD CONSTRAINT `order_product_product_ID_fk` FOREIGN KEY (`productID`) REFERENCES `product` (`productID`),
  ADD CONSTRAINT `order_user_user_ID_fk` FOREIGN KEY (`userID`) REFERENCES `user` (`userID`);

--
-- Constraints for table `product_category`
--
ALTER TABLE `product_category`
  ADD CONSTRAINT `pc_product` FOREIGN KEY (`productID`) REFERENCES `product` (`productID`),
  ADD CONSTRAINT `product_category_ibfk_1` FOREIGN KEY (`categoryID`) REFERENCES `category` (`categoryID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
