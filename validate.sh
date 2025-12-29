#!/bin/bash

echo "🔍 Validating Flashcard Admin Project Structure..."
echo ""

# Check if required files exist
files_to_check=(
    "package.json"
    ".env.example"
    ".gitignore"
    "src/app.js"
    "src/config/config.js"
    "src/config/database.js"
    "public/admin/login.html"
    "public/admin/dashboard.html"
    "README.md"
)

missing_files=0
for file in "${files_to_check[@]}"; do
    if [ -f "$file" ]; then
        echo "✓ $file"
    else
        echo "✗ $file (MISSING)"
        ((missing_files++))
    fi
done

echo ""
echo "Models check:"
models=(
    "src/models/AdminUser.js"
    "src/models/User.js"
    "src/models/Flashcard.js"
    "src/models/Topic.js"
    "src/models/Level.js"
    "src/models/Badge.js"
    "src/models/Bookmark.js"
    "src/models/Streak.js"
)

for model in "${models[@]}"; do
    if [ -f "$model" ]; then
        echo "✓ $model"
    else
        echo "✗ $model (MISSING)"
        ((missing_files++))
    fi
done

echo ""
echo "Controllers check:"
controllers=(
    "src/controllers/PublicController.js"
    "src/controllers/FlashcardController.js"
    "src/controllers/AdminAuthController.js"
    "src/controllers/AdminUserController.js"
    "src/controllers/UserAdminController.js"
    "src/controllers/FlashcardAdminController.js"
    "src/controllers/TopicAdminController.js"
    "src/controllers/LevelAdminController.js"
    "src/controllers/BadgeAdminController.js"
)

for controller in "${controllers[@]}"; do
    if [ -f "$controller" ]; then
        echo "✓ $controller"
    else
        echo "✗ $controller (MISSING)"
        ((missing_files++))
    fi
done

echo ""
echo "Routes check:"
routes=(
    "src/routes/publicRoutes.js"
    "src/routes/adminRoutes.js"
)

for route in "${routes[@]}"; do
    if [ -f "$route" ]; then
        echo "✓ $route"
    else
        echo "✗ $route (MISSING)"
        ((missing_files++))
    fi
done

echo ""
echo "Middleware check:"
middlewares=(
    "src/middlewares/authenticate.js"
    "src/middlewares/authorize.js"
    "src/middlewares/security.js"
)

for middleware in "${middlewares[@]}"; do
    if [ -f "$middleware" ]; then
        echo "✓ $middleware"
    else
        echo "✗ $middleware (MISSING)"
        ((missing_files++))
    fi
done

echo ""
echo "Utils check:"
utils=(
    "src/utils/AuthService.js"
    "src/utils/CloudinaryService.js"
)

for util in "${utils[@]}"; do
    if [ -f "$util" ]; then
        echo "✓ $util"
    else
        echo "✗ $util (MISSING)"
        ((missing_files++))
    fi
done

echo ""
echo "================================================"
if [ $missing_files -eq 0 ]; then
    echo "✅ All files present! Project structure is complete."
    echo ""
    echo "Next steps:"
    echo "1. npm install"
    echo "2. cp .env.example .env"
    echo "3. Edit .env with your Cloudinary credentials"
    echo "4. npm run seed (optional)"
    echo "5. npm start"
else
    echo "❌ Found $missing_files missing files. Please create them."
fi
