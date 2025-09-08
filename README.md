# Banking_App_Capstone

### Full-Stack MERN Scaffold
    -TechStack
       MongoDB, Express, React, Node 
### 

### Project Structure
/App - root-level scripts and configs  
    --package.json & package-lock.json ---> stores the script and config information 
/client - React frontend  
    --/public
        --index.hmtl ---> static file served to browser , dont touch (react is a SPA and our project is injected into the div) 
    --/src
        --App.js ---> this is the main page essentially of the website, defines your main app UI (components, routes, logic).
        --index.js ---> index.js imports App.js, and renders it into the DOM — specifically into the <div id="root"> in public/index.html.
        --/components ---> all front end components will be created here and routed to the App.js file stored in src
        --/css ---> all front end components style sheets will be stored here
/server - Node/Express backend
    --index.js ---> main entry point/ our actual server code will go here
    --/routes ---> will contain API REST routes for better organization 
    --/db ---> will contain database information(could be unnecessary)


Github branches will be main (this is "prod") --> Dev(we will branch off of here to create features) ---> feat/Im_New_feature (this would be your branch off of Dev that you would work in )
    we can make our changes in our feat/new_feature branch and then do a PR(pull request) to the dev branch and lastly we can merge it all into main("prod")
### End Project Structure

### Extensions
Please use the Prettier code formatter extension to ensure cohesive formatting across developement
I recommend you use git lens to be able to easily see what changes have been made and other commits
Additionally You may find it useful to use Github Desktop to handle your changes and commits
### End Extensions

### Root Level Stuff
```bash
npm install #get all dependencies
npm start # this command when ran from root directory (after dependencies have been installed) will allow simultaneous starting of backend+frontend
```

### Frontend
```bash
cd client
npm install #get all dependencies
npm start # Start react server
npm build #build a prod build *likely not needed*
```
### Backend
```bash
cd server
npm install
npm run dev #runs the nodemon server (auto refresh package)
npm start # runs the server normally
```

### GIT & GitHub
----I respect your decision to use either Git CMD or Github desktop but either way we will be using git for version control, for the teams convenience here are some basic commands and their usecases
git clone <repo-url>
Clone the remote repository to your local machine. Use this once when starting a new project.

git pull
Pull the latest changes from the remote repository (usually from main). Do this before starting new work.

git checkout -b <branch-name>
Create and switch to a new branch. Use this to start new features or fixes.

git add .
Stage all changes (new and modified files) for the next commit.

git commit -m "your message"
Save your staged changes with a message describing what you changed.

git push origin <branch-name>
Push your branch to GitHub so others can see it or you can make a pull request.

git fetch
Fetch updates from the remote repo without merging them into your branch (used to check for updates).

git merge <branch-name>
Merge the specified branch into your current branch (e.g., merge main into your feature branch).

git pull origin <branch-name>
Fetch and merge changes from a remote branch in one command.

git stash
Temporarily save changes without committing, useful if you need to switch branches.

git stash pop
Reapply the changes you stashed earlier.

git branch -d <branch-name>
Delete a local branch after it has been merged (to clean up).

git status
Show the current status of your working directory — what’s changed, staged, or untracked.

### Typical Workflow (In Order)

    Pull the latest code: git pull origin main

    Create a new branch: git checkout -b feature/my-feature

    Make your changes

    Stage the changes: git add .

    Commit the changes: git commit -m "Describe what you did"

    Push the branch: git push origin feature/my-feature

    Open a pull request on GitHub to merge your changes into main
### End GIT & GitHub
