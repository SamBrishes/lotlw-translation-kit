Light of the Locked World - Translation Kit
===========================================
A small node.js-written translation kit for Zuurix' new indie game **Light of the locked World**. 
This repository also contains a work-in-progress german translation for the current demo version.

This tool is still Work in Progress!


Requirements
------------
- node.js v12.x.x


How to Translate
----------------
The script doesn't depent on any external dependencies, except node.js itself. You can download and 
install node.js on the [official website](https://nodejs.org/en/). Keep sure, that the installation 
path is also available within the PATH [environment variable](https://stackoverflow.com/a/27864253),
which should be done by the installer automatically.

Start your Windows Terminal (CMD.exe), visit this downloaded git package and run the following 
command, which starts a local web server (you may need to additionally accept this on Windows).

```
node index.js
```

Now open your web browser and visit `localhost:8080`, which shows the translation kit. Create a new 
translation by enter the translation code (for exmaple `de` for german or `fr` for french). You can 
also optionally enter your username or email address, but both values want to be shown within the 
game and are just stored in the generated JSON file (within the `data` directory).

Click now "Create Translation". You will be redirected to the translation page with all currently 
available translation strings. You can start translating now, each change will be stored 
automatically, so you don't need to search after a "Submit" button ;)

How to use the Translation
--------------------------
**Light of the locked World** doesn't support different languages at the moment, so you need to 
do the following workaround:

1. Visit the `Language` directory within the installation path
    - Default: `C:\Program Files\Steam\steamapps\common\Light of the Locked World Demo`
2. Create a Copy of `en.json` (the original source file)
3. Copy and Paste your translated JSON file from this package
    - For Example: `data/de.json`
4. Rename your translation file into `en.json`
5. Start the Game and have fun!


Errors and Solutions
--------------------
> Error: listen EADDRINUSE: address already in use :::8080

This means, that some application on your computer already uses the 8080 port. You can either close 
Slack, Skype, Microsoft Teams and may all Chat and Interaction platforms, which are currently open, 
or you change the listener Port on the node script itself.

To do this, just open the `index.js` file and go to the last line, where you'll find the main call
`instance.listen(8080);`. Just change the port within this function, for example into `8081`.
