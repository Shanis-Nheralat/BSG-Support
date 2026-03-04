<?php
/**
 * Blog Posts API
 * 
 * This endpoint handles fetching blog posts with filtering, search, and pagination
 * 
 * Required URL parameters:
 * - page: Page number (default: 1)
 * 
 * Optional URL parameters:
 * - category: Filter by category slug
 * - search: Search term
 * - limit: Number of posts per page (default: 6)
 * 
 * Response format:
 * {
 *   "posts": [
 *     {
 *       "id": 1,
 *       "title": "Post Title",
 *       "slug": "post-slug",
 *       "excerpt": "Post excerpt...",
 *       "image": "/images/blog/post-image.jpg",
 *       "featured": true|false,
 *       "publishedAt": "2025-04-15T12:00:00Z",
 *       "category": {
 *         "id": 1,
 *         "name": "Category Name",
 *         "slug": "category-slug"
 *       },
 *       "author": {
 *         "id": 1,
 *         "name": "Author Name"
 *       }
 *     },
 *     ...
 *   ],
 *   "meta": {
 *     "currentPage": 1,
 *     "totalPages": 10,
 *     "totalPosts": 60
 *   }
 * }
 */

// Set headers to allow cross-origin requests and define response as JSON
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Only allow GET requests
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405); // Method Not Allowed
    echo json_encode(['error' => 'Only GET method is allowed']);
    exit;
}

// Database configuration
$db_config = [
    'host' => 'localhost',
    'dbname' => 'backsure_db',
    'username' => 'root',
    'password' => '',
    'charset' => 'utf8mb4'
];

// Get query parameters with defaults
$page = isset($_GET['page']) ? (int) $_GET['page'] : 1;
$limit = isset($_GET['limit']) ? (int) $_GET['limit'] : 6;
$category = isset($_GET['category']) ? $_GET['category'] : null;
$search = isset($_GET['search']) ? $_GET['search'] : null;

// Validate parameters
if ($page < 1) $page = 1;
if ($limit < 1 || $limit > 20) $limit = 6; // Prevent excessive requests

// Calculate offset for pagination
$offset = ($page - 1) * $limit;

try {
    // Connect to database
    $dsn = "mysql:host={$db_config['host']};dbname={$db_config['dbname']};charset={$db_config['charset']}";
    $options = [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false
    ];
    
    $pdo = new PDO($dsn, $db_config['username'], $db_config['password'], $options);
    
    // Build base query for posts
    $postsQuery = "
        SELECT 
            p.id, p.title, p.slug, p.excerpt, p.content, p.image_path AS image, 
            p.featured, p.published_at AS publishedAt, 
            c.id AS category_id, c.name AS category_name, c.slug AS category_slug,
            u.id AS author_id, u.name AS author_name
        FROM 
            blog_posts p
        JOIN 
            blog_categories c ON p.category_id = c.id
        JOIN 
            users u ON p.author_id = u.id
        WHERE 
            p.status = 'published'
            AND p.published_at <= NOW()
    ";
    
    // Add category filter if provided
    $params = [];
    if ($category && $category !== 'all') {
        $postsQuery .= " AND c.slug = :category";
        $params[':category'] = $category;
    }
    
    // Add search filter if provided
    if ($search) {
        $searchTerm = "%{$search}%";
        $postsQuery .= " AND (
            p.title LIKE :search OR 
            p.excerpt LIKE :search OR 
            p.content LIKE :search OR
            c.name LIKE :search
        )";
        $params[':search'] = $searchTerm;
    }
    
    // Order by featured posts first, then publication date
    $postsQuery .= " ORDER BY p.featured DESC, p.published_at DESC";
    
    // Count total matching posts for pagination
    $countQuery = str_replace(
        "SELECT 
            p.id, p.title, p.slug, p.excerpt, p.content, p.image_path AS image, 
            p.featured, p.published_at AS publishedAt, 
            c.id AS category_id, c.name AS category_name, c.slug AS category_slug,
            u.id AS author_id, u.name AS author_name",
        "SELECT COUNT(*) as total",
        $postsQuery
    );
    
    // Remove the ORDER BY clause from count query for better performance
    $countQuery = preg_replace('/ORDER BY.*$/i', '', $countQuery);
    
    // Prepare and execute count query
    $countStmt = $pdo->prepare($countQuery);
    foreach ($params as $key => $value) {
        $countStmt->bindValue($key, $value);
    }
    $countStmt->execute();
    $totalPosts = $countStmt->fetch()['total'];
    
    // Calculate total pages
    $totalPages = ceil($totalPosts / $limit);
    
    // Add pagination to posts query
    $postsQuery .= " LIMIT :limit OFFSET :offset";
    $params[':limit'] = $limit;
    $params[':offset'] = $offset;
    
    // Prepare and execute posts query
    $postsStmt = $pdo->prepare($postsQuery);
    foreach ($params as $key => $value) {
        $postsStmt->bindValue($key, $value, is_int($value) ? PDO::PARAM_INT : PDO::PARAM_STR);
    }
    $postsStmt->execute();
    
    // Fetch all matching posts
    $postRows = $postsStmt->fetchAll();
    
    // Format posts for response
    $posts = [];
    foreach ($postRows as $row) {
        $posts[] = [
            'id' => $row['id'],
            'title' => $row['title'],
            'slug' => $row['slug'],
            'excerpt' => $row['excerpt'],
            'image' => $row['image'],
            'featured' => (bool) $row['featured'],
            'publishedAt' => $row['publishedAt'],
            'category' => [
                'id' => $row['category_id'],
                'name' => $row['category_name'],
                'slug' => $row['category_slug']
            ],
            'author' => [
                'id' => $row['author_id'],
                'name' => $row['author_name']
            ]
        ];
    }
    
    // Prepare response
    $response = [
        'posts' => $posts,
        'meta' => [
            'currentPage' => $page,
            'totalPages' => $totalPages,
            'totalPosts' => $totalPosts
        ]
    ];
    
    // Send successful response
    http_response_code(200);
    echo json_encode($response);
    
} catch (PDOException $e) {
    // Log error (in production, you would use a proper logging system)
    error_log("Database error: " . $e->getMessage());
    
    // Return error response
    http_response_code(500);
    echo json_encode([
        'error' => 'An error occurred while fetching blog posts.',
        'debug' => DEBUG_MODE ? $e->getMessage() : null
    ]);
} catch (Exception $e) {
    // Log error
    error_log("General error: " . $e->getMessage());
    
    // Return error response
    http_response_code(500);
    echo json_encode([
        'error' => 'An unexpected error occurred.',
        'debug' => DEBUG_MODE ? $e->getMessage() : null
    ]);
}
