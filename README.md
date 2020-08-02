Light of the Locked World - Translation Kit
===========================================
> LOTLW Version: 0.4.5<br />
> German Translation Version: 0.4.5<br />

A small node.js-written translation kit for Zuurix' new indie game **Light of the locked World**. 
This repository also contains a work-in-progress german translation for the demo version 0.4.5.

This tool is still Work in Progress!

- **[Visit Light of the Locked World on zuurix.com](https://zuurix.com/light-of-the-locked-world/)**
- **[Get the Light of the Locked World Demo on Steam](https://store.steampowered.com/app/1097560/Light_of_the_Locked_World/)**

Requirements
------------
- node.js v12.x.x


How to translate
----------------
The script doesn't depend on any external dependencies, except node.js itself. You can download and 
install node.js on the [official website](https://nodejs.org/en/). Keep sure, that the installation 
path is also available within the PATH [environment variable](https://stackoverflow.com/a/27864253),
which should be done by the installer automatically.

Start your Windows Terminal (CMD.exe), visit this downloaded git package and run the following 
command, which starts a local web server (you may need to additionally accept this on Windows).

```
node index.js
```

Now open your web browser and visit `localhost:8080`, which shows the translation kit. Create a new 
translation by enter the translation code (for example `de` for german or `fr` for french). You can 
also optionally enter your username or email address, but both values want to be shown within the 
game and are just stored in the generated JSON file (within the `data` directory).

Click now "Create Translation". You will be redirected to the translation page with all currently 
available translation strings. You can start translating now, each change will be stored 
automatically, so you don't need to search after a "Submit" button ;)

How to use
----------
**Light of the locked World** doesn't support different languages at the moment, so you need to 
do the following workaround:

1. Visit the `Language` directory within the installation path
    - Default: `C:\Program Files\Steam\steamapps\common\Light of the Locked World Demo`
2. Create a Copy of `en.json` (the original source file)
3. Copy and Paste your translated JSON file from this package
    - For Example: `data/de.json`
4. Rename your translation file into `en.json`
5. Start the Game and have fun!


Tips and Solutions
------------------

### Move between the Strings
You may already know this "trick", but ... However... You can easily jump from string to string 
using the &lt;Tab&gt; key on your keyboard, jumping to the opposite direction can be achieved by 
pressing and holding &lt;Shift&gt; while pressing &lt;Tab&gt;. That should be a bit faster then 
using the mouse pointer / button.

### How to update the english source file
The included translation file may isn't up-to-date anymore, when you download this kit. To update
the translation, simple copy and paste the source file (See the path under `How to use`) into the 
root `data` directory.

Now you need to close the current workspace using the red button below (if not already done). 
Re-Open your workspace using the language code before. Tip: You don't need to fill out the author 
username or E-Mail address again since they will be taken over from the generated translation file
before, unless you want to change this information.

### Port is already in use
> Error: listen EADDRINUSE: address already in use :::8080

This means, that some application on your computer already uses the 8080 port. You can either close 
Slack, Skype, Microsoft Teams and may all Chat and Interaction platforms, which are currently open, 
or you change the listener Port on the node script itself.

To do this, just open the `index.js` file and go to the last line, where you'll find the main call
`instance.listen(8080);`. Just change the port within this function, for example into `8081`.
