@echo off
REM Quick Git Setup Script for Windows

echo Initializing Git Repository...
git init
git config user.name "Your Name"
git config user.email "your.email@gmail.com"

echo.
echo Adding all files to git...
git add .

echo.
echo Creating initial commit...
git commit -m "Initial commit: Full-stack e-commerce application"

echo.
echo ===================================
echo Git initialization complete!
echo ===================================
echo.
echo Next steps:
echo 1. Create a new repository on GitHub at https://github.com/new
echo 2. Copy your repository HTTPS URL
echo 3. Run the following command (replace with your URL):
echo    git remote add origin https://github.com/YOUR_USERNAME/ecommerce-app.git
echo 4. Push to GitHub:
echo    git branch -M main
echo    git push -u origin main
echo.
pause
