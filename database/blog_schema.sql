-- Blog Database Schema
-- This file contains the database schema for the blog system

-- Create blog categories table
CREATE TABLE IF NOT EXISTS `blog_categories` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `slug` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `parent_id` int(11) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`),
  KEY `parent_id` (`parent_id`),
  CONSTRAINT `blog_categories_parent_fk` FOREIGN KEY (`parent_id`) REFERENCES `blog_categories` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create blog posts table
CREATE TABLE IF NOT EXISTS `blog_posts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `excerpt` text DEFAULT NULL,
  `content` longtext NOT NULL,
  `image_path` varchar(255) DEFAULT NULL,
  `featured` tinyint(1) NOT NULL DEFAULT 0,
  `status` enum('draft','pending','published','archived') NOT NULL DEFAULT 'draft',
  `published_at` datetime DEFAULT NULL,
  `category_id` int(11) NOT NULL,
  `author_id` int(11) NOT NULL,
  `views` int(11) NOT NULL DEFAULT 0,
  `meta_title` varchar(255) DEFAULT NULL,
  `meta_description` text DEFAULT NULL,
  `meta_keywords` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`),
  KEY `category_id` (`category_id`),
  KEY `author_id` (`author_id`),
  KEY `status_published_at` (`status`, `published_at`),
  KEY `featured` (`featured`),
  CONSTRAINT `blog_posts_category_fk` FOREIGN KEY (`category_id`) REFERENCES `blog_categories` (`id`) ON DELETE RESTRICT,
  CONSTRAINT `blog_posts_author_fk` FOREIGN KEY (`author_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create blog tags table
CREATE TABLE IF NOT EXISTS `blog_tags` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `slug` varchar(50) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create post_tag relation table (many-to-many)
CREATE TABLE IF NOT EXISTS `blog_post_tags` (
  `post_id` int(11) NOT NULL,
  `tag_id` int(11) NOT NULL,
  PRIMARY KEY (`post_id`,`tag_id`),
  KEY `tag_id` (`tag_id`),
  CONSTRAINT `post_tags_post_fk` FOREIGN KEY (`post_id`) REFERENCES `blog_posts` (`id`) ON DELETE CASCADE,
  CONSTRAINT `post_tags_tag_fk` FOREIGN KEY (`tag_id`) REFERENCES `blog_tags` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create blog comments table
CREATE TABLE IF NOT EXISTS `blog_comments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `post_id` int(11) NOT NULL,
  `parent_id` int(11) DEFAULT NULL,
  `author_name` varchar(100) NOT NULL,
  `author_email` varchar(100) NOT NULL,
  `author_website` varchar(255) DEFAULT NULL,
  `content` text NOT NULL,
  `status` enum('pending','approved','spam','trash') NOT NULL DEFAULT 'pending',
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `post_id` (`post_id`),
  KEY `parent_id` (`parent_id`),
  KEY `status` (`status`),
  CONSTRAINT `blog_comments_post_fk` FOREIGN KEY (`post_id`) REFERENCES `blog_posts` (`id`) ON DELETE CASCADE,
  CONSTRAINT `blog_comments_parent_fk` FOREIGN KEY (`parent_id`) REFERENCES `blog_comments` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default categories
INSERT INTO `blog_categories` (`name`, `slug`, `description`) VALUES
('Business Growth', 'business-growth', 'Articles about business growth strategies and opportunities'),
('Outsourcing Tips', 'outsourcing', 'Best practices and tips for successful outsourcing'),
('HR Management', 'hr-management', 'Human resources management strategies and advice'),
('Finance & Accounting', 'finance', 'Financial management and accounting practices'),
('Compliance & Admin', 'compliance', 'Administrative and compliance requirements for businesses');

-- Create users table if not exists (simplified version - you likely already have a users table)
CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','editor','author') NOT NULL DEFAULT 'author',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert a default admin user (password is 'admin123' - change this in production!)
INSERT INTO `users` (`name`, `email`, `password`, `role`) VALUES
('Admin User', 'admin@backsureglobalsupport.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin');

-- Insert sample blog posts
INSERT INTO `blog_posts` (`title`, `slug`, `excerpt`, `content`, `image_path`, `featured`, `status`, `published_at`, `category_id`, `author_id`, `meta_title`, `meta_description`) VALUES
('5 Ways Outsourcing Can Accelerate Your Business Growth', '5-ways-outsourcing-can-accelerate-business-growth', 'Learn how strategic outsourcing can help you scale faster, reduce costs, and focus on your core business strengths in today\'s competitive landscape.', '<h2>Introduction</h2><p>In today\'s fast-paced business environment, companies are constantly seeking ways to gain a competitive edge while optimizing their resources. Outsourcing has emerged as a powerful strategy that can significantly accelerate business growth when implemented strategically.</p><h2>1. Focus on Core Competencies</h2><p>By outsourcing non-core functions, your team can concentrate on what truly matters - your unique value proposition and revenue-generating activities. This laser focus on core competencies can drive innovation and growth.</p><h2>2. Access to Specialized Expertise</h2><p>Outsourcing partners bring specialized knowledge and skills that might be expensive or difficult to develop in-house. This expertise can elevate the quality of your operations and services.</p><h2>3. Cost Efficiency and Scalability</h2><p>Strategic outsourcing converts fixed costs to variable costs, providing flexibility to scale operations up or down based on business needs without the overhead of hiring or training.</p><h2>4. Accelerated Time-to-Market</h2><p>With the right outsourcing partner, you can expedite product development and service delivery, helping you capture market opportunities faster than competitors.</p><h2>5. Global Market Expansion</h2><p>Leveraging outsourcing partners with local market knowledge can facilitate smoother entry into new geographical markets, reducing risk and accelerating international growth.</p><h2>Conclusion</h2><p>When implemented thoughtfully, outsourcing is not just a cost-cutting measure but a strategic tool that can drive substantial business growth and competitive advantage.</p>', 'images/blog/blog-featured.jpg', 1, 'published', '2025-04-15 12:00:00', 2, 1, 'Strategic Outsourcing for Business Growth | Backsure Global Support', 'Discover 5 proven ways outsourcing can accelerate your business growth, reduce costs, and help you focus on core competencies.'),

('Building Effective Remote Teams: Best Practices', 'building-effective-remote-teams', 'Discover proven strategies for managing remote teams effectively and maintaining strong team culture across borders.', '<h2>The Rise of Remote Work</h2><p>Remote work has transformed from a temporary solution to a permanent fixture in the global business landscape. Building and managing effective remote teams requires intentional strategies that differ from traditional office environments.</p><h2>Clear Communication Protocols</h2><p>Establish structured communication guidelines including regular check-ins, response time expectations, and the right balance of synchronous and asynchronous communication tools.</p><h2>Cultivating Team Culture Remotely</h2><p>Virtual team-building activities, recognition programs, and creating space for casual interaction can help maintain strong team bonds despite physical distance.</p><h2>Performance Management in Remote Settings</h2><p>Focus on outcomes rather than activity, set clear expectations, and implement regular feedback mechanisms to ensure productivity and engagement remain high.</p><h2>Technology and Security Considerations</h2><p>Invest in appropriate collaboration tools and establish robust security protocols to protect sensitive information across distributed work environments.</p>', 'images/blog/blog-1.jpg', 0, 'published', '2025-04-12 10:30:00', 3, 1, 'Remote Team Management Best Practices | Backsure Global Support', 'Learn effective strategies for building and managing high-performing remote teams while maintaining strong company culture.'),

('Streamlining Financial Operations: Key Strategies for SMEs', 'streamlining-financial-operations', 'Learn practical approaches to optimize your financial processes, reduce costs, and improve financial visibility for better decision-making.', '<h2>Introduction</h2><p>For small and medium enterprises, efficient financial operations are critical to sustainability and growth. This article explores practical strategies to streamline financial processes and enhance decision-making capabilities.</p><h2>Automation of Routine Financial Tasks</h2><p>Implementing automation for accounts payable, accounts receivable, and payroll processing can significantly reduce manual errors and free up valuable time for strategic financial analysis.</p><h2>Cloud-Based Financial Management</h2><p>Cloud solutions offer SMEs affordable access to enterprise-level financial tools, real-time reporting, and improved collaboration between team members regardless of location.</p><h2>Strategic Outsourcing of Financial Functions</h2><p>Selective outsourcing of specialized financial activities can provide access to expertise without the cost of full-time specialists, particularly for functions like tax planning and compliance.</p><h2>Data-Driven Financial Decision Making</h2><p>Implementing robust financial analytics capabilities enables more informed decision-making and helps identify growth opportunities, cost-saving potential, and emerging risks.</p>', 'images/blog/blog-2.jpg', 0, 'published', '2025-04-08 09:15:00', 4, 1, 'Financial Operations Optimization for SMEs | Backsure Global Support', 'Discover practical strategies to streamline your financial operations, reduce costs, and improve financial visibility for your small or medium enterprise.'),

('Understanding UAE Corporate Tax: A Guide for Businesses', 'understanding-uae-corporate-tax', 'Navigate the complexities of UAE\'s corporate tax system with this comprehensive guide for business owners and finance teams.', '<h2>Introduction to UAE Corporate Tax</h2><p>The introduction of corporate tax in the UAE represents a significant shift in the country\'s fiscal policy. Understanding the nuances of this new tax framework is essential for businesses operating in or expanding to the UAE.</p><h2>Key Elements of the UAE Corporate Tax Framework</h2><p>This section covers tax rates, exemptions, allowable deductions, and special provisions that businesses need to be aware of to ensure compliance and optimize their tax position.</p><h2>Implementation Timeline and Preparation Strategies</h2><p>Learn about the phased implementation approach and practical steps businesses should take to prepare their systems, processes, and teams for the new tax requirements.</p><h2>Impact on Free Zones and Special Economic Zones</h2><p>Understand how the corporate tax regime affects businesses operating in the UAE\'s various free zones and the potential implications for existing tax incentives.</p><h2>Compliance Requirements and Best Practices</h2><p>Detailed guidance on documentation, filing procedures, and best practices for maintaining robust tax compliance while minimizing administrative burden.</p>', 'images/blog/blog-3.jpg', 0, 'published', '2025-04-05 14:45:00', 5, 1, 'UAE Corporate Tax Guide | Backsure Global Support', 'A comprehensive guide to understanding and navigating the UAE corporate tax system for business owners and finance professionals.'),

('Digital Transformation: Adapting Your Business for Future Success', 'digital-transformation-business-success', 'Explore the essential steps to successfully implement digital transformation in your business and stay ahead of the competition.', '<h2>The Imperative for Digital Transformation</h2><p>In today\'s rapidly evolving business landscape, digital transformation is no longer optional but essential for companies seeking long-term viability and competitive advantage.</p><h2>Assessing Your Digital Readiness</h2><p>Before embarking on transformation initiatives, businesses must evaluate their current digital capabilities, identify gaps, and prioritize areas for investment based on strategic objectives.</p><h2>Building a Customer-Centric Digital Strategy</h2><p>Successful digital transformation puts customer experience at the center, leveraging data and technology to create seamless, personalized interactions across all touchpoints.</p><h2>Technology Infrastructure and Integration</h2><p>Implementing the right technological foundation—including cloud services, data management systems, and integration platforms—is critical for supporting agile, scalable digital operations.</p><h2>Cultivating a Digital-First Culture</h2><p>Beyond technology, digital transformation requires organizational change management that fosters innovation, continuous learning, and adaptability throughout the company.</p>', 'images/blog/blog-4.jpg', 0, 'published', '2025-03-30 11:20:00', 1, 1, 'Digital Transformation Strategy Guide | Backsure Global Support', 'Learn the essential steps to successfully implement digital transformation in your business to improve efficiency and maintain competitive advantage.'),

('How to Choose the Right Outsourcing Partner for Your Business', 'choose-right-outsourcing-partner', 'Understand the key factors to consider when selecting an outsourcing partner that aligns with your business goals and values.', '<h2>Introduction</h2><p>Selecting the right outsourcing partner is a critical decision that can significantly impact your operational efficiency, service quality, and ultimately, business success. This guide outlines the essential considerations to help you make an informed choice.</p><h2>Defining Your Outsourcing Objectives</h2><p>Before evaluating potential partners, clearly articulate what you aim to achieve through outsourcing—whether cost reduction, access to specialized skills, scaling capacity, or entering new markets.</p><h2>Assessing Technical Expertise and Industry Experience</h2><p>Evaluate potential partners\' specific domain knowledge, technical capabilities, and track record of success in projects similar to yours within your industry.</p><h2>Evaluating Cultural Alignment and Communication</h2><p>Beyond technical competence, cultural compatibility and effective communication processes are crucial for successful collaboration, particularly in cross-border outsourcing relationships.</p><h2>Reviewing Security and Compliance Standards</h2><p>Thoroughly examine potential partners\' data security measures, privacy practices, and compliance with relevant industry regulations and standards.</p><h2>Conducting Due Diligence on Financial Stability</h2><p>Investigate the financial health and business continuity measures of prospective partners to ensure they can sustain service delivery throughout your engagement.</p>', 'images/blog/blog-5.jpg', 0, 'published', '2025-03-25 13:10:00', 2, 1, 'Selecting the Right Outsourcing Partner | Backsure Global Support', 'Learn how to evaluate and choose the perfect outsourcing partner that aligns with your business objectives, culture, and quality standards.');
