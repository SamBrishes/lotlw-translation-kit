const fs = require("fs");
const http = require("http");
const query = require("querystring");

let server = { path: null, method: null, request: null, response: null, routes: { } };
let workspace = { };
let strings = { };
let laststatus = { status: null, message: null }

/*
 |  PREPARE ENVIRONMENT
 |  @since  1.0.0
 */
function prepare() {
    let error = [];

    if(!fs.existsSync("html/index.html")) {
        error.push("html/index.html");
    }
    if(!fs.existsSync("html/create.html")) {
        error.push("html/create.html");
    }

    if(!fs.existsSync("data/en.json")) {
        error.push("data/en.json");
    } else {
        strings.source = JSON.parse(fs.readFileSync("data/en.json", "utf-8"));
    }
    if(fs.existsSync("data/workspace.json")) {
        workspace = JSON.parse(fs.readFileSync("data/workspace.json", "utf-8"));

        if(!fs.existsSync(`data/${workspace.language}.json`)) {
            error.push(`data/${workspace.language}.json`);
        } else {
            strings.target = JSON.parse(fs.readFileSync(`data/${workspace.language}.json`, "utf-8"));
        }
    }

    if(error.length > 0) {
        response(404, "\n- " + error.join("\n- "));
        return false;
    }
    return true;
};

/*
 |  HANDLE REDIRECT
 |  @since  1.0.0
 */
function redirect(path, status, message) {
    laststatus.status = !!status;
    laststatus.message = message;

    server.response.writeHead(302, {
        "Location": path,
        "Cache-Control": "private, no-cache, no-store, must-revalidate",
        "Expires": "-1",
        "Pragma": "no-cache",
    });
    server.response.end();
    return true;
}


/*
 |  HANDLE RESPONSE
 |  @since  1.0.0
 */
function response(status, message, type = "text/plain") {
    server.response.writeHead(status, {
        "Content-Type": type,
        "Content-Length": (message || "").length,
        "Cache-Control": "private, no-cache, no-store, must-revalidate",
        "Expires": "-1",
        "Pragma": "no-cache",
    });

    if(typeof message === "string" && message.length > 0) {
        server.response.write(message);
    }
    server.response.end();
    return true;
}

/*
 |  RENDER TEMPLATE
 |  @since  1.0.0
 */
function render(file) {
    if(file.indexOf(".html") < 0) {
        file += ".html";
    }

    let content = fs.readFileSync(`html/${file}`, "utf-8");

    if(laststatus.status === true && !!laststatus.message) {
        content = content.replace("{{lasterror}}", `<div class="alert alert-success mb-3">${laststatus.message}</div>`);
    } else if(laststatus.status === false && !!laststatus.message) {
        content = content.replace("{{lasterror}}", `<div class="alert alert-danger mb-3">${laststatus.message}</div>`);
    } else {
        content = content.replace("{{lasterror}}", "");
    }

    // Clear & Return
    laststatus.status = null;
    laststatus.message = null;
    return content;
}

/*
 |  REGISTER ROUTE
 |  @since  1.0.0
 */
function register(method, route, callback) {
    method = method.toUpperCase();
    if(!(method in server.routes)) {
        server.routes[method] = [ ];
    }
    if(!(route in server.routes[method])) {
        server.routes[method][route] = callback;
        return true;
    }
    return false;
}

/*
 |  CREATE SERVER
 |  @since  1.0.0
 */
const instance = http.createServer((req, res) => {
    server.path = req.url;
    server.method = req.method.toUpperCase();
    server.request = req;
    server.response = res;

    // Prepare Environment
    if(prepare() === false) {
        return false;
    }

    // Default files
    if(server.path === "favicon.ico") {
        return response(404, null, "text/plain");
    }
    if(server.path.lastIndexOf(".css") === server.path.length - 4) {
        if(fs.existsSync(server.path.substr(1))) {
            return response(200, fs.readFileSync(server.path.substr(1), "utf-8"), "text/css");
        }
        return response(404, null, "text/plain");
    }
    if(server.path.lastIndexOf(".js") === server.path.length - 3) {
        if(fs.existsSync(server.path.substr(1))) {
            return response(200, fs.readFileSync(server.path.substr(1), "utf-8"), "text/javascript");
        }
        return response(404, null, "text/plain");
    }

    // Check Method
    if(!(server.method in server.routes)) {
        return response(405, null, "text/plain");
    }

    // Check Route
    if(!(server.path in server.routes[server.method])) {
        return response(405, null, "text/plain");
    }
    
    // Handle Route
    if(server.method === "GET") {
        return server.routes[server.method][server.path]();
    }
    
    let content = "";
    return req.on("data", function(data) {
        content += data;
        if(content.length > 2e6) {
            req.connection.destroy();
        }
    }).on("end", function() {
        let data = query.parse(content);
        server.routes[server.method][server.path](data);
    });
});

/*
 |  ROUTE :: GET @ HOME
 |  @since  1.0.0
 */
register("GET", "/", function() {
    if(!("language" in workspace)) {
        return response(200, render("create.html"), "text/html");
    }

    // Prepare Strings
    let forms = [];
    let count = 1;
    let length = 0;
    for(let key in strings.target.strings) {
        let button = null;
        let parentClass = "mb-3 row";
        let textareaClass = "form-control";

        if(strings.target.strings[key] !== strings.source.strings[key]) {
            length++;
            parentClass += " translated";
            textareaClass += " is-valid";
        } else if("marked" in workspace && workspace.marked.indexOf(key) >= 0) {
            length++;
            parentClass += " translated";
            textareaClass += " is-valid";
        } else {
            button = `<button type="button" class="btn btn-outline-success" data-type="mark" data-toggle="tooltip" title="Mark as Translated" tabindex="-1"></button>`;
        }

        forms.push(`
            <div class="${parentClass}">
                <label for="${key}" class="col-sm-2 col-form-label">${key}</label>
                <div class="col-sm-9">
                    ${button === null? '': '<div class="input-group">'}
                        <textarea id="${key}" name="string[${key}]" placeholder="${strings.source.strings[key]}" class="${textareaClass}" rows="1" 
                            style="height:38px;resize:none;">${strings.target.strings[key]}</textarea>
                        ${button === null? '': button}
                    ${button === null? '': '</div>'}
                </div>
                <div class="col-sm-1 text-center text-muted" style="line-height:38px;">
                    ${count++}
                </div>
            </div>
        `);
    }

    // Render Translations
    let content = render("index.html");
    content = content.replace("{{strings}}", forms.join("\n"));
    content = content.replace("{{count}}", count.toString());
    content = content.replace("{{length}}", length.toString());
    return response(200, content, "text/html");    
});

/*
 |  ROUTE :: GET @ CLOSE
 |  @since  1.0.0
 */
register("GET", "/close", function() {
    if(fs.existsSync("data/workspace.json")) {
        fs.unlinkSync("data/workspace.json");
    }
    workspace = { };
    return redirect("/", true, "The Workspace has been closed.");
});

/*
 |  ROUTE :: POST @ CREATE
 |  @since  1.0.0
 */
register("POST", "/create", function(data) {
    if((data["translation[code]"] || "").length <= 0) {
        return redirect("/", false, "The translation code is missing.");
    }
    if(!/[a-z]{2}(\_[a-z{2}])?/i.test(data["translation[code]"])) {
        return redirect("/", false, "The translation code is invalid.");
    }

    // Create Workspace Data
    workspace.language = data["translation[code]"];
    workspace.author = data["translation[author]"] || ""; 
    workspace.email = data["translation[email]"] || ""; 

    // Create Language Data
    let language = Object.assign({ }, workspace);
    language.strings = Object.assign({ }, strings.source.strings);

    if(fs.existsSync(`data/${workspace.language}.json`)) {
        let translation = JSON.parse(fs.readFileSync(`data/${workspace.language}.json`, "utf-8"));

        // Get already translated strings
        for(let key in translation.strings) {
            if(key in language.strings && translation.strings[key].length > 0) {
                language.strings[key] = translation.strings[key];
            }
        }
        
        // Get Author and eMail
        if(workspace.author.length === 0) {
            workspace.author = translation.author || "";
            language.author = translation.author || "";
        }
        if(workspace.email.length === 0) {
            workspace.email = translation.email || "";
            language.email = translation.email || "";
        }
    }

    // Write Files
    fs.writeFileSync(`data/workspace.json`, JSON.stringify(workspace, null, 4), "utf-8");
    fs.writeFileSync(`data/${workspace.language}.json`, JSON.stringify(language, null, 4), "utf-8");

    // Redirect
    return redirect("/", true, "The Workspace has been created.");
});

/*
 |  ROUTE :: TRANSLATE
 |  @since  1.0.0
 */
register("POST", "/translate", function(data) {
    let result = [ ];
    let single = null;
    for(let key in data) {
        if(key.indexOf("string") !== 0) {
            continue;
        }
        let real = key.substring(7, key.length-1);
        let value = data[key];
        if(!(real in strings.target.strings)) {
            continue;
        }

        // Check Value
        if(value.length === 0) {
            value = strings.source.strings[real];
        }

        // Fix: The current system doesn't support non ASCII characters
        value = value.replace(/ä/g, "a").replace(/ö/g, "o").replace(/ü/g, "u").replace(/ß/g, "ss")
                     .replace(/Ä/g, "A").replace(/Ö/g, "O").replace(/Ü/g, "U").replace(/ẞ/g, "SS");
        value = value.replace(/[^\x00-\x7F]/g,"");
        strings.target.strings[real] = value;

        // Push to Results
        let object = new Object();
        object[real] = value;
        result.push(object);

        // Single Key
        single = real;
    }

    // Store
    fs.writeFileSync(`data/${workspace.language}.json`, JSON.stringify(strings.target, null, 4), "utf-8");

    // Return
    if(result.length === 1) {
        return response(200, result[0][single], "text/plain");
    }
    return response(200, JSON.stringify(result), "application/json");
});

/*
 |  ROUTE :: POST @ MARK
 |  @since  1.0.0
 */
register("POST", "/mark", function(data) {
    if(!("field" in data)) {
        return response(404, "String not found", "text/plain");
    }
    
    let real = data["field"].substring(7, data["field"].length-1);
    if(!(real in strings.source.strings)) {
        return response(404, "String not found", "text/plain");
    }

    if(!("marked" in workspace)) {
        workspace.marked = [];
    }
    workspace.marked.push(real);
    
    // Write & Return
    fs.writeFileSync(`data/workspace.json`, JSON.stringify(workspace, null, 4), "utf-8");
    return response(200, "String has been marked", "text/plain");
});

// Ready
instance.listen(8080);
