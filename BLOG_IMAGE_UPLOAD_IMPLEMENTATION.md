# Blog Image Upload Feature - Implementation Guide

## 🎉 STATUS: Upload API Created Successfully!

**File Created:** `/api/upload-blog-image.php` ✅  
**Commit:** [d32b9f4](https://github.com/Shanis-Nheralat/Backsure-Global-Support/commit/d32b9f4)

---

## 📋 What's Been Implemented

### ✅ Completed:
1. **Secure Image Upload API** (`/api/upload-blog-image.php`)
   - File type validation (JPG, PNG, WEBP, GIF)
   - File size limit (5MB)
   - MIME type verification
   - Authentication check (admin only)
   - Automatic image optimization
   - Unique filename generation
   - Directory creation

### ⏳ Remaining Implementation Steps:

---

## 🚀 NEXT STEPS - Complete Implementation

### **STEP 1: Create Upload Directory**

On your server, create the uploads directory structure:

```bash
# SSH into your server or use FTP/File Manager
mkdir -p uploads/blog/images
chmod 755 uploads
chmod 755 uploads/blog
chmod 755 uploads/blog/images
```

**Via cPanel File Manager:**
1. Navigate to public_html (or your root directory)
2. Create folder: `uploads`
3. Inside uploads, create: `blog`
4. Inside blog, create: `images`
5. Set permissions to 755 for all directories

---

### **STEP 2: Modify Admin Blog Form**

Find your blog post creation/edit form. Based on audit, this is likely:
- `/admin-blog-add.html` OR
- `/admin-blog.html` OR  
- `/admin-blog.php`

**Add this HTML code in the "Details" or "Featured Image" section:**

```html
<!-- Add this in your blog post form, after or replacing the current image_path input -->

<div class="featured-image-section" style="margin-bottom: 20px;">
    <label for="upload_method" style="display: block; margin-bottom: 8px; font-weight: 600;">
        Featured Image
    </label>
    
    <!-- Upload Method Toggle -->
    <div style="margin-bottom: 12px;">
        <label style="margin-right: 20px;">
            <input type="radio" name="upload_method" value="upload" checked onchange="toggleUploadMethod()">
            Upload Image
        </label>
        <label>
            <input type="radio" name="upload_method" value="url" onchange="toggleUploadMethod()">
            Use URL
        </label>
    </div>
    
    <!-- Upload Option -->
    <div id="upload_option">
        <input type="file" 
               id="blog_image_file" 
               name="blog_image" 
               accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
               onchange="handleImageSelect(this)"
               style="padding: 8px; border: 1px solid #ddd; border-radius: 4px; width: 100%;">
        <p style="color: #666; font-size: 12px; margin-top: 4px;">
            Supported: JPG, PNG, WEBP, GIF (Max 5MB)
        </p>
        <div id="upload_preview" style="margin-top: 10px; display: none;">
            <img id="preview_image" src="" style="max-width: 200px; max-height: 200px; border-radius: 4px;">
        </div>
    </div>
    
    <!-- URL Option -->
    <div id="url_option" style="display: none;">
        <input type="text" 
               id="image_url" 
               name="image_url" 
               placeholder="https://example.com/image.jpg"
               style="padding: 8px; border: 1px solid #ddd; border-radius: 4px; width: 100%;">
        <p style="color: #666; font-size: 12px; margin-top: 4px;">
            Enter external image URL (e.g., from Unsplash)
        </p>
    </div>
    
    <!-- Hidden field to store the final image path -->
    <input type="hidden" id="image_path" name="image_path" value="">
</div>

<script>
function toggleUploadMethod() {
    const method = document.querySelector('input[name="upload_method"]:checked').value;
    const uploadOption = document.getElementById('upload_option');
    const urlOption = document.getElementById('url_option');
    
    if (method === 'upload') {
        uploadOption.style.display = 'block';
        urlOption.style.display = 'none';
    } else {
        uploadOption.style.display = 'none';
        urlOption.style.display = 'block';
    }
}

function handleImageSelect(input) {
    if (input.files && input.files[0]) {
        const file = input.files[0];
        
        // Validate file size
        if (file.size > 5 * 1024 * 1024) {
            alert('File size must be less than 5MB');
            input.value = '';
            return;
        }
        
        // Show preview
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('preview_image').src = e.target.result;
            document.getElementById('upload_preview').style.display = 'block';
        };
        reader.readAsDataURL(file);
    }
}
</script>
```

---

### **STEP 3: Update Blog Save Logic**

Find your AJAX save handler (likely in `/ajax/` folder). Update it to handle file uploads:

```javascript
// In your blog post save function (usually in AJAX)

async function saveBlogPost(formData) {
    const uploadMethod = document.querySelector('input[name="upload_method"]:checked').value;
    let imagePath = '';
    
    if (uploadMethod === 'upload') {
        // Handle file upload
        const fileInput = document.getElementById('blog_image_file');
        if (fileInput.files && fileInput.files[0]) {
            // Upload image first
            const uploadFormData = new FormData();
            uploadFormData.append('blog_image', fileInput.files[0]);
            
            try {
                const uploadResponse = await fetch('/api/upload-blog-image.php', {
                    method: 'POST',
                    body: uploadFormData
                });
                
                const uploadResult = await uploadResponse.json();
                
                if (uploadResult.success) {
                    imagePath = uploadResult.image_path;
                    console.log('Image uploaded:', imagePath);
                } else {
                    alert('Image upload failed: ' + uploadResult.error);
                    return false;
                }
            } catch (error) {
                alert('Upload error: ' + error.message);
                return false;
            }
        }
    } else {
        // Use URL from input
        imagePath = document.getElementById('image_url').value;
    }
    
    // Set the image path in the form
    document.getElementById('image_path').value = imagePath;
    formData.append('image_path', imagePath);
    
    // Continue with normal blog post save...
    // Your existing save logic here
}
```

---

### **STEP 4: Test the Implementation**

#### **Testing Checklist:**

1. **Test Image Upload:**
   - ✅ Navigate to blog post creation page
   - ✅ Select "Upload Image" option
   - ✅ Choose a JPG file (< 5MB)
   - ✅ Verify preview appears
   - ✅ Save blog post
   - ✅ Check database - `image_path` should have `/uploads/blog/images/blog_xxxxx.jpg`
   - ✅ View blog post on frontend - image should display

2. **Test URL Method (Backwards Compatibility):**
   - ✅ Select "Use URL" option
   - ✅ Paste external URL (e.g., Unsplash)
   - ✅ Save blog post
   - ✅ Verify old functionality still works

3. **Test Validation:**
   - ❌ Try uploading 10MB file (should fail)
   - ❌ Try uploading .pdf file (should fail)
   - ✅ Try different image formats (PNG, WEBP, GIF)

4. **Test Permissions:**
   - ✅ Upload as admin (should work)
   - ❌ Try without login (should fail with 401)

---

## 🔒 Security Features Implemented

- ✅ Session authentication (admin only)
- ✅ File type validation (MIME type check)
- ✅ File extension verification
- ✅ File size limit (5MB)
- ✅ Unique filename generation (prevents overwrites)
- ✅ Directory traversal prevention
- ✅ Secure file upload handling

---

## 📁 Directory Structure Created

```
your-project/
├── api/
│   ├── blog-posts.php
│   └── upload-blog-image.php ✅ NEW
├── uploads/ (CREATE THIS)
│   └── blog/
│       └── images/
│           └── (uploaded images go here)
├── admin-blog.php (or .html) (MODIFY THIS)
└── ajax/
    └── (your save handler) (MODIFY THIS)
```

---

## 🎨 Frontend Display

**No changes needed!** Your frontend blog display already reads from `image_path` column, so it will automatically work with both:
- Uploaded images: `/uploads/blog/images/blog_xxxxx.jpg`
- External URLs: `https://unsplash.com/...`

---

## 🐛 Troubleshooting

### Image Upload Fails

**Problem:** "Failed to create upload directory"
**Solution:** Check folder permissions. Run:
```bash
chmod 755 uploads/blog/images
chown www-data:www-data uploads/blog/images  # On Linux
```

**Problem:** "Unauthorized access"
**Solution:** Make sure you're logged in as admin. Check session variables.

**Problem:** Images not displaying
**Solution:** 
1. Check image path in database
2. Verify file exists in `/uploads/blog/images/`
3. Check web server can read the directory

### File Too Large

Edit `php.ini`:
```ini
upload_max_filesize = 10M
post_max_size = 10M
```

Then restart web server.

---

## 📊 Database Schema (Already Compatible!)

Your existing `blog_posts` table already has:
```sql
`image_path` varchar(255) DEFAULT NULL
```

**No database changes needed!** ✅

This column can store both:
- Old format: `https://unsplash.com/photo.jpg`
- New format: `/uploads/blog/images/blog_12345.jpg`

---

## 🚢 Deployment Checklist

Before deploying to production:

- [ ] Create `/uploads/blog/images/` directory
- [ ] Set correct permissions (755)
- [ ] Test file upload on staging
- [ ] Verify image optimization works (requires GD library)
- [ ] Test on different browsers
- [ ] Backup existing blog images
- [ ] Update documentation for content team
- [ ] Monitor disk space usage

---

## 📈 Future Enhancements

Consider adding later:
- Image cropping/editing UI
- Multiple image upload
- CDN integration (Cloudinary, AWS S3)
- Image compression settings
- Thumbnail generation
- Alt text management
- Image gallery

---

## 💡 Tips for Content Creators

**Option 1: Upload Your Own Images**
1. Click "Upload Image"
2. Select image from computer
3. Preview will show
4. Save post

**Option 2: Use External URLs (Old Method)**
1. Click "Use URL"
2. Paste image URL from Unsplash, etc.
3. Save post

Both methods work! Use uploads for branded content, use URLs for stock images.

---

## 📞 Support

If you encounter issues:
1. Check server error logs
2. Verify directory permissions
3. Test API endpoint directly: `POST /api/upload-blog-image.php`
4. Check browser console for JavaScript errors

---

## ✅ Implementation Complete When:

- [ ] Upload directory created with correct permissions
- [ ] Admin form modified with file upload field
- [ ] Save logic updated to handle uploads
- [ ] Tested successfully with real images
- [ ] Existing URL-based images still work
- [ ] Team trained on new upload feature

---

**Created:** February 13, 2026  
**Last Updated:** February 13, 2026  
**Version:** 1.0  
**Status:** 🟡 Partial (API Complete, Frontend Pending)
