# Palworld DB Index

[Live Site](https://creativetechguy.github.io/PalworldDBIndex/)

**This site is in no way associated with or endorsed by Pocket Pair, Inc.**

The goal of this site is to provide a simple, reference sheet for Pal data. It simply displays the maximum amount of data at a glance so you can sort/filter however you want.

I was also frustrated that other existing sites didn't have formulas and data public. If the site was out of date I couldn't easily update it and I couldn't see the formulas/logic to make my own. So most of this was painstakingly reverse engineered to figure out things like breeding formulas, capture rate formulas, and what various values mean. Since this code is public and easily readable anyone in the future can build their own tools without having to reverse engineer it again.

## Updating Data

A primary goal of this site is that it should be trivial to update the data. To update, follow these steps:

- Install [FModel](https://fmodel.app/) and configure it for Palworld by following [this guide](https://pwmodding.wiki/docs/developers/useful-tools/fmodel).
- Check out the list of raw data files that are needed for this site [here](./scripts/copy-raw-data-files.ts). Using FModel, export these files as JSON and the images. You can select a higher level folder and right click "Save Folder's Package Properties (.json)" to save in bulk and "Save Folder's Packages Textures" for the images.
- Run the copy script: `node ./scripts/copy-raw-data-files.ts "path/to/fModel/output/exports"`
- Be sure to manually review the diff and the dev server of the site to make sure nothing was significantly changed in the format which might break the site.
- Create a PR for the changes and as soon as it is merged it'll be automatically deployed.
