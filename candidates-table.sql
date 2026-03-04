-- Create the candidates table for storing job applications

CREATE TABLE IF NOT EXISTS `candidates` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `position` varchar(100) NOT NULL,
  `resume_path` varchar(255) NOT NULL,
  `status` enum('New', 'Under Review', 'Shortlisted', 'Interviewed', 'Offered', 'Hired', 'Rejected') NOT NULL DEFAULT 'New',
  `submitted_at` datetime NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `notes` text,
  PRIMARY KEY (`id`),
  KEY `idx_email` (`email`),
  KEY `idx_status` (`status`),
  KEY `idx_submitted_at` (`submitted_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create the inquiries table for contact form submissions

CREATE TABLE IF NOT EXISTS `inquiries` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `company` varchar(100) DEFAULT NULL,
  `form_type` enum('general_inquiry', 'meeting_request', 'service_intake') NOT NULL,
  `message` text NOT NULL,
  `status` enum('New', 'In Progress', 'Replied', 'Closed') NOT NULL DEFAULT 'New',
  `submitted_at` datetime NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `services` varchar(255) DEFAULT NULL,
  `meeting_date` date DEFAULT NULL,
  `meeting_time` varchar(20) DEFAULT NULL, 
  `timezone` varchar(20) DEFAULT NULL,
  `service_type` varchar(100) DEFAULT NULL,
  `business_industry` varchar(100) DEFAULT NULL,
  `implementation_timeline` varchar(50) DEFAULT NULL,
  `requirements` text DEFAULT NULL,
  `additional_comments` text DEFAULT NULL,
  `admin_notes` text DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_email` (`email`),
  KEY `idx_form_type` (`form_type`),
  KEY `idx_status` (`status`),
  KEY `idx_submitted_at` (`submitted_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;