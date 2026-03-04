<?php
// Include database configuration
require_once 'db_config.php';

// Get solution ID from URL parameter
$solution_id = isset($_GET['id']) ? $_GET['id'] : 'solution-a';

// Fetch solution data from database
$sql = "SELECT * FROM solutions WHERE solution_id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $solution_id);
$stmt->execute();
$result = $stmt->get_result();

// Check if solution exists
if ($result->num_rows === 0) {
    // Solution not found, redirect to 404 or home page
    header("Location: index.php");
    exit();
}

// Get solution data
$solution = $result->fetch_assoc();
$stmt->close();

// Parse feature lists (stored as JSON in the database)
$feature2_features = json_decode($solution['feature2_features'], true) ?: [];
$feature3_features = json_decode($solution['feature3_features'], true) ?: [];
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo htmlspecialchars($solution['hero_title']); ?> – Backsure Global Support</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/js/all.min.js"></script>
    <style>
        :root {
            --primary-color: #002868; /* deep navy */
            --accent-color: #9d174d;  /* deep pink/maroon */
            --button-gold: #b89c63; /* gold color for talk to us */
            --button-navy: #042b6b; /* navy for talk to an expert */
            --text-dark: #000000;
            --text-light: #333333;
            --white: #FFFFFF;
            --blue: #0088cc; /* blue color from attachment */
            --shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
            --max-width: 1200px;
            --section-spacing: 80px;
            --border-radius: 12px;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Poppins', sans-serif;
            color: var(--text-dark);
            line-height: 1.6;
            background-color: var(--white);
        }

        img {
            max-width: 100%;
            height: auto;
        }

        .container {
            width: 100%;
            max-width: var(--max-width);
            margin: 0 auto;
            padding: 0 40px;
        }

        section {
            margin-bottom: var(--section-spacing);
        }

        h1, h2, h3 {
            color: var(--primary-color);
            line-height: 1.2;
        }

        h1 {
            font-size: 42px;
            font-weight: 700;
            margin-bottom: 20px;
        }

        h2 {
            font-size: 36px;
            font-weight: 600;
            margin-bottom: 30px;
        }

        h3 {
            font-size: 26px;
            font-weight: 600;
            margin-bottom: 15px;
        }

        p {
            font-size: 18px;
            margin-bottom: 20px;
            color: var(--text-dark);
        }

        .btn {
            display: inline-block;
            padding: 14px 30px;
            border-radius: 8px;
            font-size: 18px;
            font-weight: 500;
            text-decoration: none;
            text-align: center;
            cursor: pointer;
            transition: all 0.3s ease;
            min-height: 48px;
        }

        .btn-gold {
            background-color: var(--button-gold);
            color: var(--white);
            border: 2px solid var(--button-gold);
        }

        .btn-gold:hover {
            background-color: #a08952;
            border-color: #a08952;
        }

        .btn-navy {
            background-color: var(--button-navy);
            color: var(--white);
            border: 2px solid var(--button-navy);
        }

        .btn-navy:hover {
            background-color: #031f4d;
            border-color: #031f4d;
        }

        /* HERO SECTION - Diagonal Cut */
        .hero {
            width: 100%;
            overflow: hidden;
        }

        .hero-container {
            display: grid;
            grid-template-columns: 45% 55%;
            height: 400px;
        }

        .hero-image {
            position: relative;
            height: 100%;
            /* This extends the image area beyond its grid column */
            width: calc(100% + 80px);
            /* Clip the image with diagonal cut on right side */
            clip-path: polygon(0 0, calc(100% - 80px) 0, 100% 100%, 0 100%);
            z-index: 1;
        }

        .hero-image img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            object-position: center;
        }

        .hero-content {
            position: relative;
            display: flex;
            flex-direction: column;
            justify-content: center;
            padding: 40px 60px;
            background-color: var(--blue);
            /* Add dot pattern to background */
            background-image: radial-gradient(circle, rgba(255, 255, 255, 0.1) 2px, transparent 2px);
            background-size: 20px 20px;
            color: white;
            /* This pulls the content area to overlap with the image */
            margin-left: -80px;
            z-index: 2;
        }

        .hero-content h1 {
            color: white;
            font-size: 36px;
            font-weight: 700;
            margin-bottom: 20px;
            line-height: 1.2;
        }

        .hero-content p {
            color: white;
            font-size: 16px;
            line-height: 1.6;
        }

        /* INTRO SECTION */
        .intro {
            padding: 80px 0;
        }

        .intro-content {
            max-width: 800px;
            margin: 0 auto;
            text-align: left;
        }

        /* FEATURE BLOCKS */
        .feature-block {
            display: flex;
            align-items: center;
            margin-bottom: 80px;
        }

        .feature-reverse {
            flex-direction: row-reverse;
        }

        .feature-content {
            flex: 1;
            padding: 0 40px;
        }

        .feature-image {
            flex: 1;
            display: flex;
            justify-content: center;
        }

        .diamond-image {
            width: 350px;
            height: 350px;
            clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
            object-fit: cover;
            background-color: #f0f4f8;
        }

        .service-list {
            margin-top: 30px;
        }

        .service-item {
            margin-bottom: 20px;
        }

        .service-item h4 {
            font-size: 20px;
            font-weight: 600;
            color: var(--primary-color);
            margin-bottom: 5px;
        }

        .service-item p {
            margin-bottom: 0;
        }

        /* SUMMARY SECTION */
        .summary {
            padding: 60px 0;
            background-color: #f8fafc;
            border-radius: var(--border-radius);
        }

        .summary-content {
            max-width: 800px;
            margin: 0 auto;
            text-align: left;
        }

        /* CTA SECTION */
        .cta {
            text-align: center;
            padding: 80px 0;
        }

        .cta-content {
            max-width: 800px;
            margin: 0 auto;
        }

        .cta-buttons {
            display: flex;
            justify-content: center;
            gap: 20px;
            margin-top: 30px;
        }

        /* RESPONSIVE STYLES */
        @media (max-width: 1200px) {
            .hero-content h1 {
                font-size: 32px;
            }
            
            .diamond-image {
                width: 300px;
                height: 300px;
            }
        }

        @media (max-width: 992px) {
            .hero-content {
                padding: 30px 40px;
            }
            
            .hero-content h1 {
                font-size: 28px;
            }
            
            h2 {
                font-size: 32px;
            }
        }

        @media (max-width: 768px) {
            .container {
                padding: 0 20px;
            }

            .hero-container {
                grid-template-columns: 1fr;
                grid-template-rows: 280px 1fr;
                height: auto;
            }
            
            .hero-image {
                width: 100%;
                clip-path: polygon(0 0, 100% 0, 100% calc(100% - 50px), 0 100%);
            }
            
            .hero-content {
                margin-left: 0;
                margin-top: -50px;
                padding: 30px 20px;
            }
            
            .hero-content h1 {
                font-size: 24px;
            }

            h2 {
                font-size: 26px;
                margin-bottom: 20px;
            }

            .feature-block,
            .feature-reverse {
                flex-direction: column;
            }

            .feature-image {
                margin-bottom: 30px;
            }

            .feature-content {
                padding: 0;
            }
            
            .diamond-image {
                width: 250px;
                height: 250px;
            }

            .cta-buttons {
                flex-direction: column;
            }

            .btn {
                width: 100%;
                margin-bottom: 10px;
            }
        }
    </style>
</head>
<body>
    <!-- HERO SECTION with Diagonal Cut -->
    <section class="hero">
        <div class="hero-container">
            <div class="hero-image">
                <img src="<?php echo htmlspecialchars($solution['hero_image_url']); ?>" alt="<?php echo htmlspecialchars($solution['hero_title']); ?>">
            </div>
            <div class="hero-content">
                <h1><?php echo htmlspecialchars($solution['hero_title']); ?></h1>
                <p><?php echo htmlspecialchars($solution['hero_description']); ?></p>
            </div>
        </div>
    </section>

    <!-- INTRO SECTION -->
    <section class="intro">
        <div class="container">
            <div class="intro-content">
                <p><?php echo htmlspecialchars($solution['intro_text']); ?></p>
            </div>
        </div>
    </section>

    <!-- FEATURE SECTION -->
    <section class="features">
        <div class="container">
            <!-- Feature Block 1 -->
            <div class="feature-block">
                <div class="feature-image">
                    <img src="<?php echo htmlspecialchars($solution['feature1_image_url']); ?>" alt="<?php echo htmlspecialchars($solution['feature1_title']); ?>" class="diamond-image">
                </div>
                <div class="feature-content">
                    <h2><?php echo htmlspecialchars($solution['feature1_title']); ?></h2>
                    <p><?php echo htmlspecialchars($solution['feature1_description']); ?></p>
                </div>
            </div>

            <!-- Feature Block 2 -->
            <div class="feature-block feature-reverse">
                <div class="feature-image">
                    <img src="<?php echo htmlspecialchars($solution['feature2_image_url']); ?>" alt="<?php echo htmlspecialchars($solution['feature2_title']); ?>" class="diamond-image">
                </div>
                <div class="feature-content">
                    <h2><?php echo htmlspecialchars($solution['feature2_title']); ?></h2>
                    <div class="service-list">
                        <?php foreach ($feature2_features as $feature): ?>
                        <div class="service-item">
                            <h4><?php echo htmlspecialchars($feature['title']); ?></h4>
                            <p><?php echo htmlspecialchars($feature['description']); ?></p>
                        </div>
                        <?php endforeach; ?>
                    </div>
                </div>
            </div>

            <!-- Feature Block 3 -->
            <div class="feature-block">
                <div class="feature-image">
                    <img src="<?php echo htmlspecialchars($solution['feature3_image_url']); ?>" alt="<?php echo htmlspecialchars($solution['feature3_title']); ?>" class="diamond-image">
                </div>
                <div class="feature-content">
                    <h2><?php echo htmlspecialchars($solution['feature3_title']); ?></h2>
                    <div class="service-list">
                        <?php foreach ($feature3_features as $feature): ?>
                        <div class="service-item">
                            <h4><?php echo htmlspecialchars($feature['title']); ?></h4>
                            <p><?php echo htmlspecialchars($feature['description']); ?></p>
                        </div>
                        <?php endforeach; ?>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- SUMMARY SECTION -->
    <section class="summary">
        <div class="container">
            <div class="summary-content">
                <h2><?php echo htmlspecialchars($solution['summary_title']); ?></h2>
                <p><?php echo htmlspecialchars($solution['summary_text']); ?></p>
            </div>
        </div>
    </section>

    <!-- CTA SECTION -->
    <section class="cta">
        <div class="container">
            <div class="cta-content">
                <h2><?php echo htmlspecialchars($solution['cta_title']); ?></h2>
                <p><?php echo htmlspecialchars($solution['cta_text']); ?></p>
                <div class="cta-buttons">
                    <a href="<?php echo htmlspecialchars($solution['cta_button1_link']); ?>" class="btn btn-navy"><?php echo htmlspecialchars($solution['cta_button1_text']); ?></a>
                    <a href="<?php echo htmlspecialchars($solution['cta_button2_link']); ?>" class="btn btn-gold"><?php echo htmlspecialchars($solution['cta_button2_text']); ?></a>
                </div>
            </div>
        </div>
    </section>

</body>
</html>