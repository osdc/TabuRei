
# Contributing to the project 🔥✨

Contributions are always welcome, no matter how large or small!🙂

### Install Git

* In order to contribute, you need to have Git (a version control software) installed in your machine.
* Refer this 👉 https://docs.github.com/en/github/getting-started-with-github/set-up-git#setting-up-git to install and setup Git 🚀.

### Fork and clone this repository

* Fork this repository using the button in the top-right corner of the page. Refer https://docs.github.com/en/github/getting-started-with-github/fork-a-repo for more details.

* Having forked the repository, clone the repository to your local machine using the below command in the terminal :
```
git clone https://github.com/YOUR-GITHUB-USERNAME/TabuRei
```

## Setting up

* Having [cloned](#fork-and-clone-this-repository) the copy to your local machine, enter into the `TabuRei` directory using the `cd` command.
```
cd TabuRei
```

* Great, you are now present in the source code of the project. You can take a look at the contents of the project using the `ls` command.
```
ls
```

You can choose to execute things in 2 ways:
- [Manual Setup](#manual-setup)
- [`web-ext` tool](#web-ext)

### Manual Setup

#### Firefox

- Head to `about:debugging`.
- Click on `This Firefox` on top left.
- Click on **`Load Temporary Add-on`**
- Select `manifest.json` file in the extension's directory.

#### Chrome

- Head to `chrome://extensions`.
- Enable `Developer Mode` on the top-right.
- Click on **`Load Unpacked`**.
- Select the extension's directory or any file inside it.

### `web-ext`

web-ext is a command line tool designed to speed up various parts of the extension development process, making development faster and easier. 
**Installation**
```
npm install --global web-ext
```
Requires [`node.js`](https://nodejs.org/) install

Simply execute 
```
web-ext run
```
This will load your extension into a test web browser and then you can experiment with your changes.

To know more about `web-ext`, Checkout:
- [Getting started with web-ext](https://extensionworkshop.com/documentation/develop/getting-started-with-web-ext/)
- [`web-ext` command reference](https://extensionworkshop.com/documentation/develop/web-ext-command-reference/)

## Making Pull-Requests (Contributions)

Having setup the project and tested its working, if you want to contribute to it, follow the steps below :

* Make a new branch of the project using the `git checkout` command :
```
git checkout -b "Name-of-the-branch"
```
* Make changes according to the issues. Test the working of the changes.

* Add the changes to staging area using the `git add` command :
```
git add .
```
* Commit the changes made using the `git commit` commad :
```
git commit -m "Commit-message"
```
* Push the changes to your branch on Github using the `git push` command :
```
git push -u origin "Name-of-the-branch-from-step-1"
```
* Then, go to your forked repository and make a Pull Request 🎉. Refer [this](https://docs.github.com/en/github/collaborating-with-issues-and-pull-requests/creating-a-pull-request) for more details.

## Resources 📚

### Git and Github

* Egghead Course on [How to Contribute to an Open Source Project on GitHub](https://egghead.io/courses/how-to-contribute-to-an-open-source-project-on-github) by Kent C. Dodds.
* [Learn Git](https://www.codecademy.com/learn/learn-git) by Codecademy
* [Github Learning Lab](https://lab.github.com/)

### Javascript

* [Eloquent Javascript](https://eloquentjavascript.net/)
* [MDN Docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

### Extension Development
* [What are extensions?](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/What_are_WebExtensions)
* [MDN WebExtensions](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions)
* [JavaScript API Reference](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API)

