# pma-sirensync

###### *Please download the release for this resource unless you intend on building it yourself, if you do intend on building it yourself, there's a step-by-step tutorial on how to do that below.*

Controls your sirens with the best syncing possible!

pma-sirensync controls the siren states (light and sound) via statebags onto the entity that is controlled, which ensures for the best syncing possible with OneSync Infinity (it's the default option for FXServer).

You can toggle the emergency lights by pressing `Q` on your keyboard.

You have a few ways of controlling the siren, the first way is to hold `R` on your keyboard, that doesn't require the emergency lights to be on, the second way is to press `,` on your keyboard to toggle the sound and press it again to untoggle, this one requires the emergency lights to be on. The third way is to press the `UP ARROW` key on your keyboard, this will toggle the second sound on your vehicle, if it doesn't have a second sound, this will do the same as pressing `,` but without the emergency lights requirement.

The horn for emergency vehicles is also replaced by this resource, the key has not been changed from the default `E` keybind.

To change any of these keybinds, you'll have to edit them in the main.ts and build the resource, go to the next section. Any changes done to keymapping will only affect newly joined players, anyone that has already entered your server with this resource on will have the default keybinds set that were there and cannot be overwritten by this or any other resource, the user will have to change it themselves in the GTA settings -> Keybindings -> FiveM.

# Building this resource

Building this resource is pretty simple, here are the steps.

1. Install [pnpm](https://pnpm.io/installation)
2. Download the source code using the green `Code` button.
3. Unpack the folder.
4. Open a terminal in the location of the folder, this can easily be done by pressing the right mouse button on the folder and pressing `Open with Visual Studio Code` if you have Visual Studio Code.
5. In the terminal, type `pnpm i` and run it
6. After that's done, you can run `pnpm build` and then the resource is built.
7. Enjoy the resource!

# Credits

* [AvarianKnight](https://github.com/AvarianKnight) made this resource, he didn't want to maintain it but wanted publicly available, so here it is.