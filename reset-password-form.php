<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Password | Backsure Global Support</title>
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
            max-width: 500px;
            margin: 50px auto;
            padding: 30px;
            background-color: white;
            border-radius: 8px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        }
        
        .logo-container {
            text-align: center;
            margin-bottom: 30px;
        }
        
        .logo {
            max-width: 200px;
        }
        
        h1 {
            font-size: 1.5rem;
            font-weight: 600;
            text-align: center;
            margin-bottom: 20px;
            color: var(--primary-color);
        }
        
        .message {
            padding: 10px 15px;
            border-radius: 4px;
            margin-bottom: 20px;
            font-size: 0.9rem;
        }
        
        .error {
            background-color: rgba(220, 53, 69, 0.1);
            color: var(--danger-color);
        }
        
        .success {
            background-color: rgba(40, 167, 69, 0.1);
            color: var(--success-color);
        }
        
        form {
            margin-top: 20px;
        }
        
        .form-group {
            margin-bottom: 20px;
        }
        
        label {
            display: block;
            font-weight: 600;
            margin-bottom: 6px;
            font-size: 0.9rem;
            color: var(--gray-700);
        }
        
        .input-group {
            position: relative;
        }
        
        .input-icon {
            position: absolute;
            left: 10px;
            top: 50%;
            transform: translateY(-50%);
            color: var(--gray-600);
        }
        
        .password-toggle {
            position: absolute;
            right: 10px;
            top: 50%;
            transform: translateY(-50%);
            background: none;
            border: none;
            color: var(--gray-600);
            cursor: pointer;
        }
        
        input {
            width: 100%;
            padding: 10px 40px 10px 35px;
            border: 1px solid var(--gray-300);
            border-radius: 4px;
            font-size: 0.9rem;
            transition: border-color 0.3s;
        }
        
        input:focus {
            outline: none;
            border-color: var(--primary-color);
            box-shadow: 0 0 0 3px rgba(6, 39, 103, 0.1);
        }
        
        .password-strength {
            margin-top: 5px;
            height: 5px;
            border-radius: 3px;
            background-color: var(--gray-300);
            overflow: hidden;
        }
        
        .password-strength-bar {
            height: 100%;
            width: 0;
            transition: width 0.3s, background-color 0.3s;
        }
        
        .password-requirements {
            margin-top: 8px;
            font-size: 0.8rem;
            color: var(--gray-600);
        }
        
        .requirement {
            display: flex;
            align-items: center;
            margin-bottom: 3px;
        }
        
        .requirement i {
            margin-right: 5px;
            width: 16px;
            text-align: center;
        }
        
        .password-match {
            font-size: 0.8rem;
            margin-top: 5px;
            color: var(--gray-600);
            display: none;
        }
        
        .password-match.mismatch {
            color: var(--danger-color);
        }
        
        .password-match.match {
            color: var(--success-color);
        }
        
        button[type="submit"] {
            width: 100%;
            padding: 12px;
            background-color: var(--primary-color);
            color: white;
            border: none;
            border-radius: 4px;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            transition: background-color 0.3s;
        }
        
        button[type="submit"]:hover {
            background-color: var(--primary-dark);
        }
        
        .footer-links {
            text-align: center;
            margin-top: 20px;
            font-size: 0.85rem;
        }
        
        .footer-links a {
            color: var(--primary-color);
            text-decoration: none;
            transition: color 0.3s;
        }
        
        .footer-links a:hover {
            color: var(--primary-dark);
            text-decoration: underline;
        }
        
        /* Strength colors */
        .strength-weak { background-color: var(--danger-color); }
        .strength-medium { background-color: var(--warning-color); }
        .strength-strong { background-color: var(--success-color); }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo-container">
            <img src="logo.png" alt="Backsure Global Support" class="logo">
        </div>
        
        <h1>Reset Your Password</h1>
        
        <?php if (isset($error)): ?>
            <div class="message error">
                <i class="fas fa-exclamation-circle"></i> <?php echo htmlspecialchars($error); ?>
            </div>
        <?php endif; ?>
        
        <?php if (isset($success)): ?>
            <div class="message success">
                <i class="fas fa-check-circle"></i> <?php echo htmlspecialchars($success); ?>
            </div>
        <?php endif; ?>
        
        <?php if (!isset($success)): ?>
            <form id="resetPasswordForm" action="update-password.php" method="post">
                <input type="hidden" name="email" value="<?php echo htmlspecialchars($email); ?>">
                <input type="hidden" name="token" value="<?php echo htmlspecialchars($token); ?>">
                
                <div class="form-group">
                    <label for="password">New Password</label>
                    <div class="input-group">
                        <i class="fas fa-lock input-icon"></i>
                        <input type="password" id="password" name="password" required>
                        <button type="button" class="password-toggle" data-target="password">
                            <i class="fas fa-eye"></i>
                        </button>
                    </div>
                    <div class="password-strength">
                        <div class="password-strength-bar"></div>
                    </div>
                    <div class="password-requirements">
                        <div class="requirement" id="req-length">
                            <i class="fas fa-times-circle"></i> At least 8 characters
                        </div>
                        <div class="requirement" id="req-lowercase">
                            <i class="fas fa-times-circle"></i> At least 1 lowercase letter
                        </div>
                        <div class="requirement" id="req-uppercase">
                            <i class="fas fa-times-circle"></i> At least 1 uppercase letter
                        </div>
                        <div class="requirement" id="req-number">
                            <i class="fas fa-times-circle"></i> At least 1 number
                        </div>
                        <div class="requirement" id="req-special">
                            <i class="fas fa-times-circle"></i> At least 1 special character
                        </div>
                    </div>
                </div>
                
                <div class="form-group">
                    <label for="confirm-password">Confirm Password</label>
                    <div class="input-group">
                        <i class="fas fa-lock input-icon"></i>
                        <input type="password" id="confirm-password" name="confirm-password" required>
                        <button type="button" class="password-toggle" data-target="confirm-password">
                            <i class="fas fa-eye"></i>
                        </button>
                    </div>
                    <div class="password-match">Passwords do not match</div>
                </div>
                
                <button type="submit" id="reset-btn">Reset Password</button>
            </form>
        <?php else: ?>
            <div class="footer-links">
                <a href="client-login.html">Back to Login</a>
            </div>
        <?php endif; ?>
    </div>
    
    <script>
        // Toggle password visibility
        document.querySelectorAll('.password-toggle').forEach(button => {
            button.addEventListener('click', function() {
                const targetId = this.getAttribute('data-target');
                const passwordField = document.getElementById(targetId);
                
                if (passwordField.type === 'password') {
                    passwordField.type = 'text';
                    this.innerHTML = '<i class="fas fa-eye-slash"></i>';
                } else {
                    passwordField.type = 'password';
                    this.innerHTML = '<i class="fas fa-eye"></i>';
                }
            });
        });
        
        // Password strength checker
        const passwordField = document.getElementById('password');
        const confirmField = document.getElementById('confirm-password');
        const strengthBar = document.querySelector('.password-strength-bar');
        const matchMessage = document.querySelector('.password-match');
        const resetBtn = document.getElementById('reset-btn');
        
        // Requirements
        const reqLength = document.getElementById('req-length');
        const reqLowercase = document.getElementById('req-lowercase');
        const reqUppercase = document.getElementById('req-uppercase');
        const reqNumber = document.getElementById('req-number');
        const reqSpecial = document.getElementById('req-special');
        
        passwordField.addEventListener('input', function() {
            const value = this.value;
            
            // Check requirements
            const hasLength = value.length >= 8;
            const hasLowercase = /[a-z]/.test(value);
            const hasUppercase = /[A-Z]/.test(value);
            const hasNumber = /[0-9]/.test(value);
            const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(value);
            
            // Update requirement icons
            updateRequirement(reqLength, hasLength);
            updateRequirement(reqLowercase, hasLowercase);
            updateRequirement(reqUppercase, hasUppercase);
            updateRequirement(reqNumber, hasNumber);
            updateRequirement(reqSpecial, hasSpecial);
            
            // Calculate strength
            let strength = 0;
            if (hasLength) strength += 1;
            if (hasLowercase && hasUppercase) strength += 1;
            if (hasNumber) strength += 1;
            if (hasSpecial) strength += 1;
            
            // Update strength bar
            strengthBar.style.width = (strength * 25) + '%';
            strengthBar.className = 'password-strength-bar';
            
            if (strength < 2) {
                strengthBar.classList.add('strength-weak');
            } else if (strength < 4) {
                strengthBar.classList.add('strength-medium');
            } else {
                strengthBar.classList.add('strength-strong');
            }
            
            // Check if passwords match
            if (confirmField.value) {
                checkPasswordMatch();
            }
        });
        
        confirmField.addEventListener('input', checkPasswordMatch);
        
        function checkPasswordMatch() {
            if (confirmField.value) {
                matchMessage.style.display = 'block';
                
                if (passwordField.value === confirmField.value) {
                    matchMessage.textContent = 'Passwords match';
                    matchMessage.className = 'password-match match';
                } else {
                    matchMessage.textContent = 'Passwords do not match';
                    matchMessage.className = 'password-match mismatch';
                }
            } else {
                matchMessage.style.display = 'none';
            }
        }
        
        function updateRequirement(element, isMet) {
            if (isMet) {
                element.innerHTML = element.innerHTML.replace('fa-times-circle', 'fa-check-circle');
                element.querySelector('i').style.color = 'var(--success-color)';
            } else {
                element.innerHTML = element.innerHTML.replace('fa-check-circle', 'fa-times-circle');
                element.querySelector('i').style.color = 'var(--danger-color)';
            }
        }
        
        // Form submission
        document.getElementById('resetPasswordForm').addEventListener('submit', function(e) {
            // Prevent submission if passwords don't match
            if (passwordField.value !== confirmField.value) {
                e.preventDefault();
                alert('Passwords do not match. Please try again.');
                return false;
            }
            
            // Check password strength
            const value = passwordField.value;
            const hasLength = value.length >= 8;
            const hasLowercase = /[a-z]/.test(value);
            const hasUppercase = /[A-Z]/.test(value);
            const hasNumber = /[0-9]/.test(value);
            const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(value);
            
            // Calculate strength
            let strength = 0;
            if (hasLength) strength += 1;
            if (hasLowercase && hasUppercase) strength += 1;
            if (hasNumber) strength += 1;
            if (hasSpecial) strength += 1;
            
            if (strength < 3) {
                e.preventDefault();
                alert('Please choose a stronger password.');
                return false;
            }
        });
    </script>
</body>
</html>