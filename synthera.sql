-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 16, 2025 at 05:57 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `synthera`
--

-- --------------------------------------------------------

--
-- Table structure for table `experiment_logs`
--

CREATE TABLE `experiment_logs` (
  `log_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `action` varchar(255) DEFAULT NULL,
  `timestamp` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `inventory`
--

CREATE TABLE `inventory` (
  `item_id` int(11) NOT NULL,
  `item_name` varchar(50) DEFAULT NULL,
  `item_type` enum('glassware','hardware','chemical','solid') DEFAULT NULL,
  `icon_class` varchar(50) DEFAULT NULL,
  `properties` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`properties`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `protocols`
--

CREATE TABLE `protocols` (
  `protocol_id` int(11) NOT NULL,
  `title` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `difficulty` enum('Easy','Medium','Hard') DEFAULT 'Easy'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `protocols`
--

INSERT INTO `protocols` (`protocol_id`, `title`, `description`, `difficulty`) VALUES
(1, 'Neutralization', 'Synthesize NaCl (Salt Water) using Acid and Base.', 'Easy'),
(2, 'Phase Change', 'Boil Water to 100°C to observe state change.', 'Easy'),
(3, 'Combustion', 'Burn Magnesium Ribbon using Tongs and Bunsen Burner.', 'Medium'),
(4, 'Precipitation', 'Create Silver Chloride by mixing AgNO3 and NaCl.', 'Hard'),
(5, 'Neutralization', 'Synthesize NaCl (Salt Water) using Acid and Base.', 'Easy'),
(6, 'Phase Change', 'Boil Water to 100°C to observe state change.', 'Easy'),
(7, 'Combustion', 'Burn Magnesium Ribbon using Tongs and Bunsen Burner.', 'Medium'),
(8, 'Precipitation', 'Create Silver Chloride by mixing AgNO3 and NaCl.', 'Hard'),
(9, 'Neutralization', 'Synthesize NaCl (Salt Water) using Acid and Base.', 'Easy'),
(10, 'Phase Change', 'Boil Water to 100°C to observe state change.', 'Easy'),
(11, 'Combustion', 'Burn Magnesium Ribbon using Tongs and Bunsen Burner.', 'Medium'),
(12, 'Precipitation', 'Create Silver Chloride by mixing AgNO3 and NaCl.', 'Hard'),
(13, 'Neutralization', 'Synthesize NaCl (Salt Water) using Acid and Base.', 'Easy'),
(14, 'Phase Change', 'Boil Water to 100°C to observe state change.', 'Easy'),
(15, 'Combustion', 'Burn Magnesium Ribbon using Tongs and Bunsen Burner.', 'Medium'),
(16, 'Precipitation', 'Create Silver Chloride by mixing AgNO3 and NaCl.', 'Hard');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `full_name` varchar(100) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `theme_pref` varchar(20) DEFAULT 'dark',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `full_name`, `username`, `password_hash`, `theme_pref`, `created_at`) VALUES
(1, 'Nico Campania', 'kyou', '$2y$10$atp5TNLUTm2LXlyxTAzm3..ASszdkgrkiAmlyNjLwkKZzENQBtBAq', 'dark', '2025-12-10 00:48:05'),
(2, 'Carlos John Aristoki', 'mist', '$2y$10$yGb.vZB3qEwyDbBys8LvuemkYVjAyMzE7DdMeFrkQ9GH08RmHgo3u', 'dark', '2025-12-12 13:23:42');

-- --------------------------------------------------------

--
-- Table structure for table `user_progress`
--

CREATE TABLE `user_progress` (
  `progress_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `protocol_id` int(11) NOT NULL,
  `best_rank` char(2) DEFAULT NULL,
  `completion_time` float DEFAULT NULL,
  `date_completed` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `experiment_logs`
--
ALTER TABLE `experiment_logs`
  ADD PRIMARY KEY (`log_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `inventory`
--
ALTER TABLE `inventory`
  ADD PRIMARY KEY (`item_id`);

--
-- Indexes for table `protocols`
--
ALTER TABLE `protocols`
  ADD PRIMARY KEY (`protocol_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Indexes for table `user_progress`
--
ALTER TABLE `user_progress`
  ADD PRIMARY KEY (`progress_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `protocol_id` (`protocol_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `experiment_logs`
--
ALTER TABLE `experiment_logs`
  MODIFY `log_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `inventory`
--
ALTER TABLE `inventory`
  MODIFY `item_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `protocols`
--
ALTER TABLE `protocols`
  MODIFY `protocol_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `user_progress`
--
ALTER TABLE `user_progress`
  MODIFY `progress_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `experiment_logs`
--
ALTER TABLE `experiment_logs`
  ADD CONSTRAINT `experiment_logs_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Constraints for table `user_progress`
--
ALTER TABLE `user_progress`
  ADD CONSTRAINT `user_progress_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `user_progress_ibfk_2` FOREIGN KEY (`protocol_id`) REFERENCES `protocols` (`protocol_id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
