<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Verification | Backsure Global Support</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;600;700&display=swap" rel="stylesheet">
    <link rel="icon" href="favicon.ico" type="image/x-icon">
    <style>
        :root {
            --primary-color: #062767;
            --primary-dark: #041a43;
            --primary-light: #083695;
            --accent-color: #ff9800;
            --success-color: #28a745;
            --danger-color: #dc3545;
            --warning-color: #ffc107;
            --info-color: #17a2b8;
            --gray-100: #f8f9fa;
            --gray-200: #e9ecef;
            --gray-300: #dee2e6;
            --gray-400: #ced4da;
            --gray-500: #adb5bd;
            --gray-600: #6c757d;
            --gray-700: #495057;
            --gray-800: #343a40;
            --gray-900: #212529;
        }
        
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }
        
        body {
            font-family: 'Open Sans', sans-serif;
            background-color: #f5f5f5;
            color: var(--gray-800);
            line-height: 1.6;
        }
        
        .container {
            max-width: 600px;
            margin: 50px auto;
            padding: 30px;
            background-color: white;
            border-radius: 8px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
            text-align: center;
        }
        
        .logo-container {
            margin-bottom: 30px;
        }
        
        .logo {
            max-width: 200px;
        }
        
        .icon-container {
            margin: 30px 0;
            font-size: 5rem;
        }
        
        .success-icon {
            color: var(--success-color);
        }
        
        .error-icon {
            color: var(--danger-color);
        }
        
        h1 {
            font-size: 2rem;
            font-weight: 600;
            margin-bottom: 20px;
            color: var(--primary-color);
        }
        
        p {
            font-size: 1.1rem;
            margin-bottom: 25px;
            color: var(--gray-700);
        }
        
        .button {
            display: inline-block;
            padding: 12px 30px;
            background-color: var(--primary-color);
            color: white;
            border-radius: 4px;
            text-decoration: none;
            font-weight: 600;
            transition: background-color 0.3s;
        }
        
        .button:hover {
            background-color: var(--primary-dark);
        }
        
        .support-text {
            margin-top: 30px;
            font-size: 0.9rem;
            color: var(--gray-600);
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo-container">
            <img src="logo.png" alt="Backsure Global Support" class="logo">
        </div>
        
        <?php if (isset($success)): ?>
            <div class="icon-container">
                <i class="fas fa-check-circle success-icon"></i>
            </div>
            <h1>Email Verified Successfully!</h1>
            <p><?php echo htmlspecialchars($success); ?></p>
            <a href="client-login.html" class="button">Login to Your Account</a>
        <?php else: ?>
            <div class="icon-container">
                <i class="fas fa-exclamation-circle error-icon"></i>
            </div>
            <h1>Verification Failed</h1>
            <p><?php echo htmlspecialchars($error); ?></p>
            <a href="client-login.html" class="button">Back to Login</a>
            <p class="support-text">
                If you continue to experience issues, please contact our support team at:<br>
                <a href="mailto:support@backsureglobalsupport.com">support@backsureglobalsupport.com</a>
            </p>
        <?php endif; ?>
    </div>
</body>
</html>