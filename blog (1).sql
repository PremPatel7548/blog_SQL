-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 11, 2023 at 07:08 AM
-- Server version: 10.4.27-MariaDB
-- PHP Version: 8.2.0

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `blog`
--

-- --------------------------------------------------------

--
-- Table structure for table `articleimagetb`
--

CREATE TABLE `articleimagetb` (
  `imageID` int(11) NOT NULL,
  `articleID` int(11) NOT NULL,
  `image` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `articleimagetb`
--

INSERT INTO `articleimagetb` (`imageID`, `articleID`, `image`) VALUES
(13, 14, '1696998553261.jpg'),
(14, 14, '1696998553261.avif'),
(15, 15, '1696998730088.jpg'),
(16, 15, '1696998846084.jpg'),
(18, 16, '1696999727781.avif'),
(19, 16, '1696999811832.jpg'),
(20, 16, '1696999811833.avif'),
(21, 17, '1696999943464.webp'),
(22, 17, '1696999960411.jpg'),
(23, 18, '1697000144843.avif');

-- --------------------------------------------------------

--
-- Table structure for table `articles`
--

CREATE TABLE `articles` (
  `articleID` int(11) NOT NULL,
  `title` mediumtext NOT NULL,
  `description` longtext NOT NULL,
  `monthAndYear` varchar(255) NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `categoryID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `articles`
--

INSERT INTO `articles` (`articleID`, `title`, `description`, `monthAndYear`, `timestamp`, `categoryID`) VALUES
(14, 'COVID-19: A Global Health Crisis Unveils Resilience and Innovation', 'In the wake of the unprecedented COVID-19 pandemic, humanity faced an extraordinary challenge that tested our resilience and adaptability on a global scale. This article delves into the remarkable stories of courage, determination, and innovation that emerged in response to the crisis. From healthcare workers on the front lines to scientists racing to develop vaccines, and communities finding creative ways to support one another, it explores how the world came together to confront the global health crisis. Discover the inspiring narratives of resilience, heroism, and inventive solutions that have shone through the darkest days of the pandemic, showing that even in the face of adversity, the human spirit can triumph through innovation and solidarity.', 'October 2023', '2023-10-11 04:24:54', 11),
(15, 'India is a global bright spot, a powerhouse of growth and innovation: Prime Minister', 'Commenting on the growth forecast of IMF, the Prime Minister, Shri Narendra Modi said that India is a global bright spot, a powerhouse of growth and innovation. It is because of strength and skills of our people, Shri Modi said.  He has also reiterated commitment that we will continue to strengthen our journey towards a prosperous India, further boosting our reforms trajectory.  Responding to the X threads of IMF, the Prime Minister said;  “Powered by the strength and skills of our people, India is a global bright spot, a powerhouse of growth and innovation. We will continue to strengthen our journey towards a prosperous India, further boosting our reforms trajectory.”', 'October 2023', '2023-10-11 04:32:10', 10),
(16, 'Pak vs Sl', 'Pakistan vs Sri Lanka World Cup 2023 Highlights: Opener Abdullah Shafique and wicketkeeper-batter Mohammad Rizwan smashed fine centuries as Pakistan defeated Sri Lanka by six wickets in a high-scoring World Cup match on Tuesday.  Shafique, playing only his fifth ODI, slammed a 103-ball 113, while Rizwan battled cramps to hit an unbeaten 131 and shared a 95-run partnership with Saud Shakeel (31) to help Pakistan overhaul Sri Lanka’s total of 344/9 in 48.2 overs. Following their second win in the tournament, Pakistan climbed one spot to second on the points table behind leaders New Zealand.  Earlier, Kusal Mendis (122) and Sadeera Samarawickrama (108) struck terrific centuries as Sri Lanka posted a huge 344/9. Mendis clobbered 14 fours and six sixes to make 122 off 77 balls and was involved in two century partnerships. He added 102 runs with Pathum Nissanka (51) for the second wicket and 111 with Samarawickrama for the third.', 'October 2023', '2023-10-11 04:46:53', 9),
(17, 'Ind VS Pak', 'The last time these teams met in the 50-over World Cup was in 2019 at Old Trafford with India posting a massive 336/5 on the back of a fantastic 113-ball 140 by Rohit Sharma.   A smart bowling performance then helped restrict Pakistan to just 212/6 in a rain-marred match that India won by 89 runs (DLS method).  Even more memorable is perhaps the game in 2011, another India home World Cup, which resulted in a thrilling semi-final clash in Mohali. Sachin Tendulkar starred for the hosts with 85 and their bowlers put up a united front to bowl out Pakistan and gain a 29-run victory.', 'October 2023', '2023-10-11 04:52:23', 9),
(18, 'Sunny Deol as Hanuman: Gadar 2 actor reportedly in talks with Nitesh Tiwari to join Ranbir Kapoor and Yash in Ramayana', 'The report states a source close to the development as saying, “Hanuman stands for strength and there’s no one better than Sunny Deol in the Indian film industry to justify what Bajrangbali stands for. The actor has shown interest in being a part of Nitesh Tiwari’s rendition of Ramayana and is also excited to play the part of Lord Hanuman. However, it’s still early stages of discussion.\"', 'October 2023', '2023-10-11 04:55:44', 12);

--
-- Triggers `articles`
--
DELIMITER $$
CREATE TRIGGER `Delete_images` BEFORE DELETE ON `articles` FOR EACH ROW DELETE from articleimagetb WHERE articleID = OLD.articleID
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `categorys`
--

CREATE TABLE `categorys` (
  `categoryID` int(11) NOT NULL,
  `categoryName` varchar(255) NOT NULL,
  `createdOn` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `categorys`
--

INSERT INTO `categorys` (`categoryID`, `categoryName`, `createdOn`) VALUES
(9, 'Sports', '2023-10-11'),
(10, 'Politics', '2023-10-11'),
(11, 'Corona', '2023-10-11'),
(12, 'Bollywood', '2023-10-11');

--
-- Triggers `categorys`
--
DELIMITER $$
CREATE TRIGGER `Delete_category` BEFORE DELETE ON `categorys` FOR EACH ROW DELETE from articles where categoryID = OLD.categoryID
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `userID` int(11) NOT NULL,
  `userName` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`userID`, `userName`, `email`, `password`) VALUES
(1, 'Admin', 'admin@gmail.com', 'admin@123');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `articleimagetb`
--
ALTER TABLE `articleimagetb`
  ADD PRIMARY KEY (`imageID`),
  ADD KEY `fk-articleID` (`articleID`);

--
-- Indexes for table `articles`
--
ALTER TABLE `articles`
  ADD PRIMARY KEY (`articleID`),
  ADD KEY `fk-catid` (`categoryID`);

--
-- Indexes for table `categorys`
--
ALTER TABLE `categorys`
  ADD PRIMARY KEY (`categoryID`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`userID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `articleimagetb`
--
ALTER TABLE `articleimagetb`
  MODIFY `imageID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT for table `articles`
--
ALTER TABLE `articles`
  MODIFY `articleID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `categorys`
--
ALTER TABLE `categorys`
  MODIFY `categoryID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `userID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `articleimagetb`
--
ALTER TABLE `articleimagetb`
  ADD CONSTRAINT `fk-articleID` FOREIGN KEY (`articleID`) REFERENCES `articles` (`articleID`);

--
-- Constraints for table `articles`
--
ALTER TABLE `articles`
  ADD CONSTRAINT `fk-catid` FOREIGN KEY (`categoryID`) REFERENCES `categorys` (`categoryID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
