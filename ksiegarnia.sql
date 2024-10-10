-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Paź 10, 2024 at 09:22 PM
-- Wersja serwera: 10.4.32-MariaDB
-- Wersja PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `ksiegarnia`
--
CREAETE DATABASE IF NOT EXISTS `ksiegarnia` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `book`
--

CREATE TABLE `book` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `author` varchar(255) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `language` enum('polish','english') NOT NULL,
  `book_condition` enum('new','used') NOT NULL,
  `used_condition` enum('very good','good','damaged') DEFAULT NULL,
  `quantity` int(11) NOT NULL,
  `category` int(11) NOT NULL,
  `subcategory` int(11) NOT NULL,
  `pages` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `book`
--

INSERT INTO `book` (`id`, `title`, `author`, `price`, `language`, `book_condition`, `used_condition`, `quantity`, `category`, `subcategory`, `pages`) VALUES
(1, 'The Girl with the Dragon Tattoo', 'Stieg Larsson', 19.99, 'english', 'new', 'very good', 5, 1, 1, 672),
(2, 'Sapiens: A Brief History of Humankind', 'Yuval Noah Harari', 25.99, 'english', 'new', 'very good', 10, 2, 5, 498),
(3, 'Alice\'s Adventures in Wonderland', 'Lewis Carroll', 10.50, 'english', 'new', 'very good', 8, 3, 8, 176),
(4, 'Clean Code', 'Robert C. Martin', 29.99, 'english', 'new', 'very good', 12, 4, 10, 464),
(5, 'The Fellowship of the Ring', 'J.R.R. Tolkien', 25.00, 'english', 'new', 'very good', 5, 1, 3, 432),
(6, 'The Two Towers', 'J.R.R. Tolkien', 25.00, 'english', 'new', 'very good', 5, 1, 3, 352),
(7, 'The Return of the King', 'J.R.R. Tolkien', 25.00, 'english', 'new', 'very good', 5, 1, 3, 432),
(8, 'Foundation', 'Isaac Asimov', 20.00, 'english', 'new', 'very good', 6, 1, 2, 296),
(9, 'Foundation and Empire', 'Isaac Asimov', 20.00, 'english', 'new', 'very good', 6, 1, 2, 352),
(10, 'Second Foundation', 'Isaac Asimov', 20.00, 'english', 'new', 'very good', 6, 1, 2, 312),
(11, 'A Game of Thrones', 'George R.R. Martin', 30.00, 'english', 'new', 'very good', 4, 1, 3, 835),
(12, 'A Clash of Kings', 'George R.R. Martin', 30.00, 'english', 'new', 'very good', 4, 1, 3, 761),
(13, 'A Storm of Swords', 'George R.R. Martin', 30.00, 'english', 'new', 'very good', 4, 1, 3, 973),
(14, 'A Feast for Crows', 'George R.R. Martin', 30.00, 'english', 'new', 'very good', 4, 1, 3, 753),
(15, 'A Dance with Dragons', 'George R.R. Martin', 30.00, 'english', 'new', 'very good', 4, 1, 3, 1056);

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `category`
--

CREATE TABLE `category` (
  `id` int(11) NOT NULL,
  `name` varchar(150) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `category`
--

INSERT INTO `category` (`id`, `name`) VALUES
(1, 'Fiction'),
(2, 'Non-Fiction'),
(3, 'Children\'s Books'),
(4, 'Educational');

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `multivolumebook`
--

CREATE TABLE `multivolumebook` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `author` varchar(255) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `language` enum('polish','english') NOT NULL,
  `book_condition` enum('new','used') NOT NULL,
  `used_condition` enum('very good','good','damaged') DEFAULT NULL,
  `quantity` int(11) NOT NULL,
  `category` int(11) NOT NULL,
  `subcategory` int(11) NOT NULL,
  `pages` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `multivolumebook`
--

INSERT INTO `multivolumebook` (`id`, `title`, `author`, `price`, `language`, `book_condition`, `used_condition`, `quantity`, `category`, `subcategory`, `pages`) VALUES
(1, 'The Lord of the Rings', 'J.R.R. Tolkien', 75.00, 'english', 'new', 'very good', 5, 1, 3, 1216),
(2, 'Foundation', 'Isaac Asimov', 50.00, 'english', 'new', 'very good', 6, 1, 2, 700),
(3, 'A Song of Ice and Fire', 'George R.R. Martin', 90.00, 'english', 'new', 'very good', 4, 1, 3, 2000);

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `multivolumebookvolumes`
--

CREATE TABLE `multivolumebookvolumes` (
  `multi_volume_book_id` int(11) NOT NULL,
  `book_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `multivolumebookvolumes`
--

INSERT INTO `multivolumebookvolumes` (`multi_volume_book_id`, `book_id`) VALUES
(1, 5),
(1, 6),
(1, 7),
(2, 8),
(2, 9),
(2, 10),
(3, 11),
(3, 12),
(3, 13),
(3, 14),
(3, 15);

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `orderitem`
--

CREATE TABLE `orderitem` (
  `orderItemId` int(11) NOT NULL,
  `orderId` int(11) NOT NULL,
  `bookId` int(11) DEFAULT NULL,
  `multiVolumeBookId` int(11) DEFAULT NULL,
  `quantity` int(11) NOT NULL,
  `price` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `orders`
--

CREATE TABLE `orders` (
  `orderId` int(11) NOT NULL,
  `customerId` int(11) NOT NULL,
  `shippingDetailsId` int(11) NOT NULL,
  `paymentDetailsId` int(11) NOT NULL,
  `orderDate` datetime NOT NULL,
  `totalAmount` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `paymentdetails`
--

CREATE TABLE `paymentdetails` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `card_number` varchar(20) NOT NULL,
  `expiration_date` varchar(5) NOT NULL,
  `cvv` varchar(4) NOT NULL,
  `cardholder_name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `shippingdetails`
--

CREATE TABLE `shippingdetails` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `surname` varchar(255) NOT NULL,
  `street` varchar(255) NOT NULL,
  `city` varchar(255) NOT NULL,
  `postal_code` varchar(20) NOT NULL,
  `country` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `subcategory`
--

CREATE TABLE `subcategory` (
  `id` int(11) NOT NULL,
  `name` varchar(150) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `subcategory`
--

INSERT INTO `subcategory` (`id`, `name`) VALUES
(1, 'Mystery/Thriller'),
(2, 'Science Fiction'),
(3, 'Fantasy'),
(4, 'Biographies'),
(5, 'History'),
(6, 'Science'),
(7, 'Fantasy (Children)'),
(8, 'Classics (Children)'),
(9, 'Mathematics'),
(10, 'Programming');

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indeksy dla zrzutów tabel
--

--
-- Indeksy dla tabeli `book`
--
ALTER TABLE `book`
  ADD PRIMARY KEY (`id`),
  ADD KEY `category` (`category`),
  ADD KEY `subcategory` (`subcategory`);

--
-- Indeksy dla tabeli `category`
--
ALTER TABLE `category`
  ADD PRIMARY KEY (`id`);

--
-- Indeksy dla tabeli `multivolumebook`
--
ALTER TABLE `multivolumebook`
  ADD PRIMARY KEY (`id`),
  ADD KEY `category` (`category`),
  ADD KEY `subcategory` (`subcategory`);

--
-- Indeksy dla tabeli `multivolumebookvolumes`
--
ALTER TABLE `multivolumebookvolumes`
  ADD PRIMARY KEY (`multi_volume_book_id`,`book_id`),
  ADD KEY `book_id` (`book_id`);

--
-- Indeksy dla tabeli `orderitem`
--
ALTER TABLE `orderitem`
  ADD PRIMARY KEY (`orderItemId`),
  ADD KEY `orderId` (`orderId`),
  ADD KEY `bookId` (`bookId`),
  ADD KEY `multiVolumeBookId` (`multiVolumeBookId`);

--
-- Indeksy dla tabeli `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`orderId`),
  ADD KEY `customerId` (`customerId`) USING BTREE,
  ADD KEY `paymentId` (`paymentDetailsId`) USING BTREE,
  ADD KEY `shippingId` (`shippingDetailsId`) USING BTREE;

--
-- Indeksy dla tabeli `paymentdetails`
--
ALTER TABLE `paymentdetails`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indeksy dla tabeli `shippingdetails`
--
ALTER TABLE `shippingdetails`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indeksy dla tabeli `subcategory`
--
ALTER TABLE `subcategory`
  ADD PRIMARY KEY (`id`);

--
-- Indeksy dla tabeli `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `book`
--
ALTER TABLE `book`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `category`
--
ALTER TABLE `category`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `multivolumebook`
--
ALTER TABLE `multivolumebook`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `orderitem`
--
ALTER TABLE `orderitem`
  MODIFY `orderItemId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `orderId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT for table `paymentdetails`
--
ALTER TABLE `paymentdetails`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- AUTO_INCREMENT for table `shippingdetails`
--
ALTER TABLE `shippingdetails`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- AUTO_INCREMENT for table `subcategory`
--
ALTER TABLE `subcategory`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `book`
--
ALTER TABLE `book`
  ADD CONSTRAINT `book_ibfk_1` FOREIGN KEY (`category`) REFERENCES `category` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `book_ibfk_2` FOREIGN KEY (`subcategory`) REFERENCES `subcategory` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `multivolumebook`
--
ALTER TABLE `multivolumebook`
  ADD CONSTRAINT `multivolumebook_ibfk_1` FOREIGN KEY (`subcategory`) REFERENCES `subcategory` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `multivolumebook_ibfk_2` FOREIGN KEY (`category`) REFERENCES `category` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `multivolumebookvolumes`
--
ALTER TABLE `multivolumebookvolumes`
  ADD CONSTRAINT `multivolumebookvolumes_ibfk_1` FOREIGN KEY (`multi_volume_book_id`) REFERENCES `multivolumebook` (`id`),
  ADD CONSTRAINT `multivolumebookvolumes_ibfk_2` FOREIGN KEY (`book_id`) REFERENCES `book` (`id`);

--
-- Constraints for table `orderitem`
--
ALTER TABLE `orderitem`
  ADD CONSTRAINT `orderitem_ibfk_1` FOREIGN KEY (`orderId`) REFERENCES `orders` (`orderId`),
  ADD CONSTRAINT `orderitem_ibfk_2` FOREIGN KEY (`bookId`) REFERENCES `book` (`id`),
  ADD CONSTRAINT `orderitem_ibfk_3` FOREIGN KEY (`multiVolumeBookId`) REFERENCES `multivolumebook` (`id`);

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`customerId`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`paymentDetailsId`) REFERENCES `paymentdetails` (`id`),
  ADD CONSTRAINT `orders_ibfk_3` FOREIGN KEY (`shippingDetailsId`) REFERENCES `shippingdetails` (`id`);

--
-- Constraints for table `paymentdetails`
--
ALTER TABLE `paymentdetails`
  ADD CONSTRAINT `paymentdetails_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `shippingdetails`
--
ALTER TABLE `shippingdetails`
  ADD CONSTRAINT `shippingdetails_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
