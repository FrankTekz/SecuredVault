# Using Your GitHub Personal Access Token

To use your GitHub token with this Replit environment, follow these steps:

## Step 1: Update the Remote URL with Your Token

Run this command in the Shell tab, replacing the placeholders with your actual information:

```bash
git remote set-url origin https://YOUR_GITHUB_USERNAME:YOUR_PERSONAL_ACCESS_TOKEN@github.com/FrankTekz/SecuredVault.git
```

For example, if your GitHub username is "FrankTekz" and your token is "ghp_abc123xyz", you would run:

```bash
git remote set-url origin https://FrankTekz:ghp_abc123xyz@github.com/FrankTekz/SecuredVault.git
```

## Step 2: Push Your Code

After updating the remote URL, run:

```bash
git push -u origin main
```

## Important Security Note

- This method is for demonstration purposes and should be used carefully
- The token will be visible in your command history
- Never share your token with others
- Delete the token from GitHub after you're done if you no longer need it

## Alternative: Use Replit's GitHub Integration UI

A more secure alternative is to use Replit's built-in GitHub integration:

1. Click the Version Control icon in the left sidebar
2. You should see a UI that helps you commit and push changes
3. This method handles authentication more securely