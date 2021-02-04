const path = require("path");

module.exports = {
  packagerConfig: {},
  publishers: [
    {
      name: "@electron-forge/publisher-github",
      config: {
        // authToken: GITHUB_ACTIONS env var
        draft: true,
        prerelease: false,
        repository: {
          name: "clippy",
          owner: "kl13nt",
        },
      },
    },
  ],
  makers: [
    // windows
    {
      name: "@electron-forge/maker-squirrel",
      config: {
        authors: "Nabil Tharwat @kl13nt",
        description: "Clippy is a minimal clipboard manager",
        loadingGif: path.resolve(__dirname, "./src/9190_rainbow_hype.gif"),
        noMsi: false,
      },
    },
    {
      name: "@electron-forge/maker-zip",
    },
    // debian-based only with the fakeroot and dpkg packages
    // GH actions doesn't support deb
    {
      name: "@electron-forge/maker-deb",
      config: {
        options: {
          maintainer: "Nabil Tharwat",
          homepage: "https://github.com/KL13NT/clippy/",
        },
      },
    },
    // red-hat, can only build the RPM target on Linux machines with the rpm or rpm-build
    {
      name: "@electron-forge/maker-rpm",
      config: {
        options: {
          maintainer: "Nabil Tharwat",
          homepage: "https://github.com/KL13NT/clippy/",
        },
      },
    },
  ],
};
