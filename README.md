
# Getting Started
#### Update Node version >=16

Check if you already have nvm installed on your system:  
```
nvm --version
```

If it's not installed, install nvm using this command:    
```
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.3/install.sh | bash

```
#### Open a new terminal

Once nvm is installed, check your current version of Node by running the following command:
```
node -v
```
Then update your version of Node using the following command:  
```
nvm install node --reinstall-packages-from=node

```
And finally, verify that your update is complete by rechecking your Node version:  
```
node -v

```

#### After Installing Latest Node JS version

```
npm install
npm run dev
```