# GitHub Setup Script
# Run this after authenticating with GitHub CLI

echo "Creating GitHub repository and pushing code..."

# Create the repository
gh repo create half-marathon-spectator-app --public --source=. --remote=origin --push

echo "Repository created and code pushed successfully!"
echo "Repository URL: https://github.com/$(gh api user --jq .login)/half-marathon-spectator-app"

