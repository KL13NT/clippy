# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## 2.0.0 (2021-02-14)


### ⚠ BREAKING CHANGES

* Keyboard navigation & accessible UI

### Features

* **#13:** added context menu for tray icon to exit ([aa87fa8](https://github.com/KL13NT/clippy/commit/aa87fa80e25e66106d5895bef0b1b384fd9a17c9)), closes [#13](https://github.com/KL13NT/clippy/issues/13)
* **#14:** bulk delete and refactoring ([2e87fdd](https://github.com/KL13NT/clippy/commit/2e87fddc5a0cc843b02e8d484f4ccdf41f77e7d8)), closes [#14](https://github.com/KL13NT/clippy/issues/14)
* **#17:** add keyboard shortcuts ([#37](https://github.com/KL13NT/clippy/issues/37)) ([00566ed](https://github.com/KL13NT/clippy/commit/00566ed9c93d55835374a0e2f997bf9b294877fc)), closes [#17](https://github.com/KL13NT/clippy/issues/17) [#17](https://github.com/KL13NT/clippy/issues/17)
* **#17:** implemented basic keyboard shortcuts ([2922745](https://github.com/KL13NT/clippy/commit/292274551dec0f79bd95ac265f057c0b5fa7112f)), closes [#17](https://github.com/KL13NT/clippy/issues/17)
* **#2:** select multiple entries ([2e2e5da](https://github.com/KL13NT/clippy/commit/2e2e5dad7fc5758e6fe4206f1b3b608b2bfa809b)), closes [#2](https://github.com/KL13NT/clippy/issues/2)
* **#3:** pin entries to list ([5d89c88](https://github.com/KL13NT/clippy/commit/5d89c8856cb2a7ebc9257cd9031b7ec3ab58690d)), closes [#3](https://github.com/KL13NT/clippy/issues/3)
* **#40:** auto update ([604a8c3](https://github.com/KL13NT/clippy/commit/604a8c3470e7e4e48dd67715b2db5da16dfb5ceb)), closes [#40](https://github.com/KL13NT/clippy/issues/40)
* **#6:** keyboard navigation & a11y ([9142b51](https://github.com/KL13NT/clippy/commit/9142b511ecb7dfe459ca21643983584efad9ec8e)), closes [#6](https://github.com/KL13NT/clippy/issues/6)
* **#8:** about page and tutorial ([7b1c59e](https://github.com/KL13NT/clippy/commit/7b1c59e559703ff244acfa97c7252f193339a2bb)), closes [#8](https://github.com/KL13NT/clippy/issues/8)
* **progress:** groundwork for pinning ([22ee821](https://github.com/KL13NT/clippy/commit/22ee8213f74294ae06124bf463dc4fa01729bc12))
* added `clear clipboard only` button ([d260397](https://github.com/KL13NT/clippy/commit/d260397b398c0b0e756122e503597da7ec2bf1e8))
* embedded links rendering and opening ([a5ff00b](https://github.com/KL13NT/clippy/commit/a5ff00b2120c6a6efa30514bb21b5701dbb088f3))


### Bug Fixes

* copy selection reference bug ([437c0bc](https://github.com/KL13NT/clippy/commit/437c0bcf19201f51cec0cdbc59df5952a5a2c381))
* slow entry options animation: ([f2b3bfb](https://github.com/KL13NT/clippy/commit/f2b3bfbfb9ad607b2442e3bc75c1baca15c13e74))
* **#10:** added cancelId to dialog options ([1a9bc02](https://github.com/KL13NT/clippy/commit/1a9bc0213bbaeb2707abd150e3be104a0effc890)), closes [#10](https://github.com/KL13NT/clippy/issues/10)
* **render.js:** fix the multi-select error ([0b0cfaf](https://github.com/KL13NT/clippy/commit/0b0cfaffe297a4b0405cbcd560400f84a1dd7e65)), closes [#29](https://github.com/KL13NT/clippy/issues/29)
* clearing condition ([510981f](https://github.com/KL13NT/clippy/commit/510981fbc3afd77e5011f5976d9d7c235009e827))
* make produces executable without deps, allowed devtools in out ([932ac82](https://github.com/KL13NT/clippy/commit/932ac823abea4f9e85d3b6987db7c6ed4b572bf1))
* naming issues because of Windows ([85d676b](https://github.com/KL13NT/clippy/commit/85d676bc49ff2d2ed967a6842dedce92c39a305d))
* npm script precommit wrong name ([4e1701d](https://github.com/KL13NT/clippy/commit/4e1701dd0105785b893f8546e33799f4e0911689))
* **#23:** change path.join to pathToFileURL(path.resolve) ([838a25a](https://github.com/KL13NT/clippy/commit/838a25ae43544600f783fb2f7dab51b12d6be6e8)), closes [#23](https://github.com/KL13NT/clippy/issues/23) [#23](https://github.com/KL13NT/clippy/issues/23)
* npm script precommit wrong name ([6df9a04](https://github.com/KL13NT/clippy/commit/6df9a04fde2222908403d72c1c8e23902bdf9385))
* **#23:** change path.join to pathToFileURL(path.resolve) ([28e92ab](https://github.com/KL13NT/clippy/commit/28e92ab2c9f1f45169da1fd0b5fec7812ba02a6e)), closes [#23](https://github.com/KL13NT/clippy/issues/23) [#23](https://github.com/KL13NT/clippy/issues/23)
* **render.js:** fix the multi-select error ([89ed803](https://github.com/KL13NT/clippy/commit/89ed803d12c8e3420987e71750712b9690469d47)), closes [#29](https://github.com/KL13NT/clippy/issues/29)
* object destroyed bug with pinging after exiting ([bac67b5](https://github.com/KL13NT/clippy/commit/bac67b55d840a0a5c90b87437f8fe91248104409))


### refactor

* event handling captures ([0196b15](https://github.com/KL13NT/clippy/commit/0196b1523ffaf4ce3d9e99a03707777523b2438a)), closes [#6](https://github.com/KL13NT/clippy/issues/6)

## 1.2.0 (2021-02-03)


### Features

* **#13:** added context menu for tray icon to exit ([aa87fa8](https://github.com/KL13NT/clippy/commit/aa87fa80e25e66106d5895bef0b1b384fd9a17c9)), closes [#13](https://github.com/KL13NT/clippy/issues/13)
* **#14:** bulk delete and refactoring ([2e87fdd](https://github.com/KL13NT/clippy/commit/2e87fddc5a0cc843b02e8d484f4ccdf41f77e7d8)), closes [#14](https://github.com/KL13NT/clippy/issues/14)
* **#2:** select multiple entries ([2e2e5da](https://github.com/KL13NT/clippy/commit/2e2e5dad7fc5758e6fe4206f1b3b608b2bfa809b)), closes [#2](https://github.com/KL13NT/clippy/issues/2)
* **#3:** pin entries to list ([5d89c88](https://github.com/KL13NT/clippy/commit/5d89c8856cb2a7ebc9257cd9031b7ec3ab58690d)), closes [#3](https://github.com/KL13NT/clippy/issues/3)
* **#8:** about page and tutorial ([7b1c59e](https://github.com/KL13NT/clippy/commit/7b1c59e559703ff244acfa97c7252f193339a2bb)), closes [#8](https://github.com/KL13NT/clippy/issues/8)
* **progress:** groundwork for pinning ([22ee821](https://github.com/KL13NT/clippy/commit/22ee8213f74294ae06124bf463dc4fa01729bc12))
* added `clear clipboard only` button ([d260397](https://github.com/KL13NT/clippy/commit/d260397b398c0b0e756122e503597da7ec2bf1e8))
* embedded links rendering and opening ([a5ff00b](https://github.com/KL13NT/clippy/commit/a5ff00b2120c6a6efa30514bb21b5701dbb088f3))


### Bug Fixes

* **#10:** added cancelId to dialog options ([1a9bc02](https://github.com/KL13NT/clippy/commit/1a9bc0213bbaeb2707abd150e3be104a0effc890)), closes [#10](https://github.com/KL13NT/clippy/issues/10)
* clearing condition ([510981f](https://github.com/KL13NT/clippy/commit/510981fbc3afd77e5011f5976d9d7c235009e827))
* make produces executable without deps, allowed devtools in out ([932ac82](https://github.com/KL13NT/clippy/commit/932ac823abea4f9e85d3b6987db7c6ed4b572bf1))
* naming issues because of Windows ([85d676b](https://github.com/KL13NT/clippy/commit/85d676bc49ff2d2ed967a6842dedce92c39a305d))
* object destroyed bug with pinging after exiting ([bac67b5](https://github.com/KL13NT/clippy/commit/bac67b55d840a0a5c90b87437f8fe91248104409))

## 1.1.0 (2021-02-03)


### Features

* **#13:** added context menu for tray icon to exit ([aa87fa8](https://github.com/KL13NT/clippy/commit/aa87fa80e25e66106d5895bef0b1b384fd9a17c9)), closes [#13](https://github.com/KL13NT/clippy/issues/13)
* **#14:** bulk delete and refactoring ([2e87fdd](https://github.com/KL13NT/clippy/commit/2e87fddc5a0cc843b02e8d484f4ccdf41f77e7d8)), closes [#14](https://github.com/KL13NT/clippy/issues/14)
* **#2:** select multiple entries ([2e2e5da](https://github.com/KL13NT/clippy/commit/2e2e5dad7fc5758e6fe4206f1b3b608b2bfa809b)), closes [#2](https://github.com/KL13NT/clippy/issues/2)
* **#3:** pin entries to list ([5d89c88](https://github.com/KL13NT/clippy/commit/5d89c8856cb2a7ebc9257cd9031b7ec3ab58690d)), closes [#3](https://github.com/KL13NT/clippy/issues/3)
* **#8:** about page and tutorial ([7b1c59e](https://github.com/KL13NT/clippy/commit/7b1c59e559703ff244acfa97c7252f193339a2bb)), closes [#8](https://github.com/KL13NT/clippy/issues/8)
* **progress:** groundwork for pinning ([22ee821](https://github.com/KL13NT/clippy/commit/22ee8213f74294ae06124bf463dc4fa01729bc12))
* added `clear clipboard only` button ([d260397](https://github.com/KL13NT/clippy/commit/d260397b398c0b0e756122e503597da7ec2bf1e8))
* embedded links rendering and opening ([a5ff00b](https://github.com/KL13NT/clippy/commit/a5ff00b2120c6a6efa30514bb21b5701dbb088f3))


### Bug Fixes

* **#10:** added cancelId to dialog options ([1a9bc02](https://github.com/KL13NT/clippy/commit/1a9bc0213bbaeb2707abd150e3be104a0effc890)), closes [#10](https://github.com/KL13NT/clippy/issues/10)
* clearing condition ([510981f](https://github.com/KL13NT/clippy/commit/510981fbc3afd77e5011f5976d9d7c235009e827))
* make produces executable without deps, allowed devtools in out ([932ac82](https://github.com/KL13NT/clippy/commit/932ac823abea4f9e85d3b6987db7c6ed4b572bf1))
* naming issues because of Windows ([85d676b](https://github.com/KL13NT/clippy/commit/85d676bc49ff2d2ed967a6842dedce92c39a305d))
* object destroyed bug with pinging after exiting ([bac67b5](https://github.com/KL13NT/clippy/commit/bac67b55d840a0a5c90b87437f8fe91248104409))
