# Namecheap cPanel Deployment Guide for BackSure Global Support

## Current Status

✅ **FIXED**: HTTP 500 Error - Removed faulty Laravel `index.php` file
✅ **CREATED**: `index.html` file in `/public_html/`
⚠️ **INCOMPLETE**: Missing JavaScript bundles from `/static/` directory

## Issue Summary

The website backsureglobalsupport.com was experiencing HTTP 500 errors because:
1. A Laravel `index.php` file was trying to load missing Composer dependencies
2. The React application build files were incomplete on the Namecheap server
3. The `build` folder structure doesn't match GitHub repository structure

## Solution: Complete Namecheap Deployment

### Prerequisites
- FTP/SSH access to Namecheap server
- Local copy of the complete `build` folder from this repository

### Deployment Steps

#### Step 1: Download Complete Build Folder
1. Clone this repository or download as ZIP
2. Locate the `/build/` directory
3. The build folder should contain:
   - `index.html`
   - `/static/js/` folder with JavaScript bundles
   - `/static/css/` folder with stylesheets  
   - `manifest.json`
   - `asset-manifest.json`

#### Step 2: Upload to Namecheap cPanel
1. Log into cPanel File Manager
2. Navigate to `/public_html/`
3. **Option A: Replace Everything (Recommended)**
   - Delete all files in `/public_html/` EXCEPT:
     - `/api/` directory (contains blog upload PHP)
     - `/database/` directory
     - `/.htaccess` file
   - Upload entire `/build/` folder contents to `/public_html/`
   - Ensure `/static/` folder is at `/public_html/static/`

#### Step 3: Verify .htaccess Configuration
Ensure `/public_html/.htaccess` contains:
```apache
RewriteEngine On
RewriteBase /

# Serve existing files/directories
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d

# Route all other requests to index.html for React Router
RewriteRule . /index.html [L]
```

#### Step 4: Test Deployment
1. Visit https://backsureglobalsupport.com
2. Check browser console for any 404 errors on JavaScript files
3. Test navigation between pages
4. Test blog upload functionality at admin panel

### Current File Structure on cPanel
```
/public_html/
├── build/              # Current incomplete structure
│   ├── assets/
│   └── manifest.json
├── css/
├── images/
├── js/
├── api/                # Blog image upload PHP (KEEP THIS)
├── .htaccess           # KEEP THIS
├── error_log
├── favicon.ico
├── favicon.svg
├── robots.txt
└── index.html          # ✅ Created (needs supporting files)
```

### Required File Structure (After Full Deployment)
```
/public_html/
├── static/             # MISSING - needs to be uploaded
│   ├── js/
│   │   └── main.4d22a54d.js
│   └── css/
│       └── main.b6999a20.css
├── api/                # Blog upload endpoint
├── .htaccess
├── index.html          # ✅ Already created
├── manifest.json
├── asset-manifest.json
├── favicon.ico
├── favicon.svg
└── robots.txt
```

## Alternative: Use Vercel (Current Production Setup)

**RECOMMENDED**: This site is already deployed on Vercel at `backsure-global-support.vercel.app`

To use Vercel instead of Namecheap:
1. Ensure DNS A/CNAME records point to Vercel servers
2. Configure custom domain in Vercel dashboard
3. All features including blog image upload will work automatically

## Blog Image Upload Feature

The blog image upload API (`/api/upload-blog-image.php`) has been created and committed to this repository. It will work once the full site is deployed.

### API Endpoint
- **URL**: `https://backsureglobalsupport.com/api/upload-blog-image.php`
- **Method**: POST
- **Content-Type**: multipart/form-data
- **Field Name**: `image`
- **Response**: JSON with image URL

## Troubleshooting

### Site shows blank page
- Check browser console for JavaScript 404 errors
- Verify `/static/js/main.*.js` file exists
- Ensure index.html paths match actual file structure

### Blog upload not working  
- Verify `/api/upload-blog-image.php` exists
- Check file permissions (755 for directories, 644 for files)
- Review `/public_html/error_log` for PHP errors

### Admin panel HTTP 500
- Issue was fixed by removing Laravel index.php
- Verify no conflicting PHP files in root directory

## Quick Fix Commands (SSH Access)

```bash
# Navigate to public_html
cd /home/backzvsg/public_html/

# Create static directory structure
mkdir -p static/js static/css

# Set proper permissions
chmod 755 static static/js static/css
chmod 644 index.html

# Upload build files via SCP
scp -r /local/path/to/build/static/* username@server:/home/backzvsg/public_html/static/
```

## Contact & Support

For deployment assistance:
- Repository: https://github.com/Shanis-Nheralat/Backsure-Global-Support  
- Live Site: https://backsureglobalsupport.com
- Vercel: https://backsure-global-support.vercel.app

---

**Last Updated**: February 13, 2026  
**Status**: Partial deployment complete, full static assets upload required
