# Clippy! 🚀

[![Commitizen
friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
![GitHub Workflow
Status](https://img.shields.io/github/workflow/status/kl13nt/clippy/release)
![GitHub issues](https://img.shields.io/github/issues-raw/kl13nt/clippy)
![License](https://img.shields.io/github/license/kl13nt/clippy)
![GitHub package.json
version](https://img.shields.io/github/package-json/v/kl13nt/clippy)
![Github All
Contributors](https://img.shields.io/github/all-contributors/kl13nt/clippy)


Clippy is a minimal clipboard history log made with
[Electron](https://electronjs.org), [Preact](https://preactjs.com), and
[htm](https://github.com/developit/htm). It doesn't store nor sync your
clipboard. I can't showcase how badly I needed a clipboard log. I
needed one to the point of building one.

> Some of my projects are available on my [projects page](https://iamnabil.netlify.app/projects).

## Features
This project is *minimal*. Features include:

- Keeps trach of copied text and images!
- Copy any entry back
- Delete entries from the log
- Pin/Bookmark entries to the top of the list
- Clear log (can clear system's clipboard as well)
- Clear system's clipboard only (history untouched)
- Open links embedded in copied text in your system's default browser
- Copy links embedded in copied text
- Select and delete multiple entries
- Select and copy multiple text entries
- Complete keyboard navigation
- Seamlessly download updates in the background and apply then when wanted

## Building From Source

If you'd like to use a custom build from a specific commit do the following:
1. `git clone https://github.com/KL13NT/clippy.git`
2. `cd clippy`
3. `git checkout <commit hash>` without the `<>`
4. `npm install`
5. `npm run make`

Make sure to have git, nodejs, and npm installed locally. Note that all commits on master build successfully, so you won't need to change
anything.

## Getting Started

This project uses `electron-forge` under the hood, allowing us to develop,
build, and publish our Electron app with simple commands.

We use [Commitizen](https://github.com/commitizen) to manage the contribution flow.

When committing we use `npm run commit` instead of `git commit`. This initiates
commitizen and starts its interactive cli to create commit messages that follow
the guidelines. The commit is then linted by
[commitlint](https://github.com/conventional-changelog/commitlint) to make sure
it follows the [Angular Commit Message
Format](https://github.com/angular/angular/blob/master/CONTRIBUTING.md#-commit-message-format).
For the reasoning behind this see issue [#39](https://github.com/KL13NT/clippy/issues/39).

> If you're an advanced user you may use `git commit` directly as long as your
> commits follow the guidelines.

> Make sure to [sign](https://docs.github.com/en/github/authenticating-to-github/managing-commit-signature-verification) your commits. This guarantees ownership of your contributions.

To developer or build locally you first need to install the dependencies. We use
*npm* for this.

```
npm install
```

### Developing

In development, the electron-forge dev command is used to start the application
in development mode.

```
npm run dev
```

### Building
You can build from source using the `make` command. Building for a target OS requires
that respective OS. You probably won't need to run this unless you're on the
core team.

```
npm run make
```

## ✋ Wish to Contribute?

I'm open to all kinds of contributions. If you want to:

```
🤔 Suggest a feature
🐛 Report an issue
📖 Improve documentation
👩‍💻 Contribute to the code
```

You are more than welcome. Before contributing, kindly check the [guidelines](./CONTRIBUTING.md).

## License
This projects is licensed under the GNU GPLv3 License.

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://github.com/iamkacperwasik"><img src="https://avatars.githubusercontent.com/u/57839948?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Kacper Wąsik</b></sub></a><br /><a href="https://github.com/KL13NT/clippy/commits?author=iamkacperwasik" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/MahmoudHendi1"><img src="https://avatars.githubusercontent.com/u/51229687?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Mahmoud Salah</b></sub></a><br /><a href="https://github.com/KL13NT/clippy/commits?author=MahmoudHendi1" title="Code">💻</a></td>
  </tr>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
