# Clippy! 🚀

[![Commitizen
friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
![GitHub Workflow
Status](https://img.shields.io/github/workflow/status/kl13nt/clippy/electron-builder-action)
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

> I wrote this code in a couple hours and this was my first time using Electron, don't @ me 😂

> Some of my projects are available on my [projects page](https://iamnabil.netlify.app/projects).

## Features
This project is *minimal*. Features include:

- Click to copy back
- Right Click to delete from log
- Clear log (can clear system's clipboard as well)
- Clear system's clipboard only (history untouched)
- Copy images
- Open links embedded in copied text
- Copy links embedded in copied text

Yeah.. just those lol 😂 ~~I may add export and link rendering later on, the
groundwork is almost done so... _maybe_. 🤷~~ Added link rendering!

## Getting Started

### Developing
Just start the development server using the `dev` command. Voila!

### Building
You can build from source using the `make` command. Requires NodeJS and NPM,
just in case.

## Why Electron?
Why not? I'm a frontend developer and work with JavaScript all the time, so this
was the easiest option available to me!

## Why Preact?
I was lazy and made this in a couple iterations over a few hours, so I didn't
want to build the DOM logic all over again.

## Why not React?
I may port the code to some other
project and don't wish to take the large size with me. Was a nice experiment as well.

## What the hell is `htm`?
`htm` is a JSX alternative using standard tagged templates. It basically allows
you to write JSX-like code without babel!

## Feature Requests & Bug Reports
Feel free to do either or both! Everyone's welcome!

## License
This projects is licensed under the GNU GPLv3 License.
## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://github.com/KL13NT"><img src="https://avatars.githubusercontent.com/u/20807178?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Nabil Tharwat</b></sub></a><br /><a href="https://github.com/KL13NT/clippy/commits?author=KL13NT" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/iamkacperwasik"><img src="https://avatars.githubusercontent.com/u/57839948?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Kacper Wąsik</b></sub></a><br /><a href="https://github.com/KL13NT/clippy/commits?author=iamkacperwasik" title="Code">💻</a></td>
  </tr>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!