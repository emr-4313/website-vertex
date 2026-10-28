export const filesystem = {
  title: "Filesystem",
  icon: "folder",
  blurb: "Read and write files inside supQ's workspace folder.",
  intro: "Paths are relative to the workspace folder (`%APPDATA%\\supQ\\workspace`). Paths that try to leave it are rejected.",
  fns: [
    { name: "readfile", sig: "readfile(path: string) -> string", desc: "Returns a file's contents. Errors if it does not exist." },
    { name: "writefile", sig: "writefile(path: string, data: string) -> ()", desc: "Creates or overwrites a file." },
    { name: "appendfile", sig: "appendfile(path: string, data: string) -> ()", desc: "Adds data to the end of a file, creating it if needed." },
    { name: "delfile", sig: "delfile(path: string) -> ()", desc: "Deletes a file." },
    { name: "isfile", sig: "isfile(path: string) -> boolean", desc: "Returns whether a file exists at the path." },
    { name: "listfiles", sig: "listfiles(path: string) -> {string}", desc: "Returns the paths of the files and folders inside a folder." },
    { name: "makefolder", sig: "makefolder(path: string) -> ()", desc: "Creates a folder, including missing parents." },
    { name: "delfolder", sig: "delfolder(path: string) -> ()", desc: "Deletes a folder and everything in it." },
    { name: "isfolder", sig: "isfolder(path: string) -> boolean", desc: "Returns whether a folder exists at the path." },
    {
      name: "loadfile",
      sig: "loadfile(path: string, chunkname?: string) -> (function?, string?)",
      desc: "Compiles a file into a function without running it. Returns nil and the error on failure.",
      aliases: ["load_file", "loadfromfile", "load_from_file"],
    },
    { name: "dofile", sig: "dofile(path: string) -> ...any", desc: "Compiles and runs a file, returning its results.", aliases: ["do_file", "runfile"] },
    { name: "getcustomasset", sig: "getcustomasset(path: string) -> string", desc: "Turns a workspace file into an `rbxasset://` id usable as an image, sound or mesh." },
    {
      name: "openfiledialog",
      sig: "openfiledialog(filter?: string, title?: string) -> string?",
      desc: "Shows the Windows open dialog and returns the chosen path, or nil if cancelled. `filter` uses the Windows `Name\\0*.ext\\0` format.",
    },
    { name: "openfilesdialog", sig: "openfilesdialog(filter?: string, title?: string) -> {string}?", desc: "Like `openfiledialog` but allows picking several files." },
    { name: "openfolderdialog", sig: "openfolderdialog(title?: string) -> string?", desc: "Shows the folder picker and returns the chosen folder." },
    { name: "savefiledialog", sig: "savefiledialog(filter?: string, title?: string) -> string?", desc: "Shows the Windows save dialog and returns the chosen path." },
  ],
};

export const input = {
  title: "Input",
  icon: "mouse",
  blurb: "Simulate mouse and keyboard input.",
  intro: "Input only reaches Roblox while its window is focused. Keys are Windows virtual-key codes (for example `0x41` for A).",
  fns: [
    { name: "keypress", sig: "keypress(keycode: number) -> ()", desc: "Holds a key down." },
    { name: "keyrelease", sig: "keyrelease(keycode: number) -> ()", desc: "Releases a key." },
    { name: "keyclick", sig: "keyclick(keycode: number) -> ()", desc: "Presses and releases a key.", aliases: ["keytap"] },
    { name: "mouse1click", sig: "mouse1click() -> ()", desc: "Clicks the left mouse button." },
    { name: "mouse1press", sig: "mouse1press() -> ()", desc: "Holds the left mouse button." },
    { name: "mouse1release", sig: "mouse1release() -> ()", desc: "Releases the left mouse button." },
    { name: "mouse2click", sig: "mouse2click() -> ()", desc: "Clicks the right mouse button." },
    { name: "mouse2press", sig: "mouse2press() -> ()", desc: "Holds the right mouse button." },
    { name: "mouse2release", sig: "mouse2release() -> ()", desc: "Releases the right mouse button." },
    { name: "mousemoveabs", sig: "mousemoveabs(x: number, y: number) -> ()", desc: "Moves the cursor to a position in the game window." },
    { name: "mousemoverel", sig: "mousemoverel(dx: number, dy: number) -> ()", desc: "Moves the cursor relative to where it is." },
    { name: "mousescroll", sig: "mousescroll(delta: number) -> ()", desc: "Scrolls the wheel; positive scrolls up." },
    { name: "isrbxactive", sig: "isrbxactive() -> boolean", desc: "Returns whether the Roblox window is in the foreground.", aliases: ["isgameactive", "iswindowactive"] },
    { name: "setclipboard", sig: "setclipboard(value: any) -> ()", desc: "Copies a value (converted to text) to the clipboard.", aliases: ["setrbxclipboard", "toclipboard"] },
    { name: "getclipboard", sig: "getclipboard() -> string", desc: "Returns the clipboard text." },
  ],
};

export const console = {
  title: "Console",
  icon: "terminal",
  blurb: "A separate Windows console window for logging.",
  intro: "Every function is also available without the leading `r` (for example `consoleprint`).",
  fns: [
    { name: "rconsolecreate", sig: "rconsolecreate() -> ()", desc: "Opens the console window." },
    { name: "rconsoledestroy", sig: "rconsoledestroy() -> ()", desc: "Closes the console window." },
    { name: "rconsoleprint", sig: "rconsoleprint(...any) -> ()", desc: "Writes text to the console without a trailing newline." },
    { name: "rconsoleinfo", sig: "rconsoleinfo(...any) -> ()", desc: "Writes an informational line." },
    { name: "rconsolewarn", sig: "rconsolewarn(...any) -> ()", desc: "Writes a warning line." },
    { name: "rconsoleerr", sig: "rconsoleerr(...any) -> ()", desc: "Writes an error line.", aliases: ["rconsoleerror"] },
    { name: "rconsoleinput", sig: "rconsoleinput() -> string", desc: "Waits for a line of input from the console. Yields." },
    { name: "rconsoleclear", sig: "rconsoleclear() -> ()", desc: "Clears the console." },
    { name: "rconsolename", sig: "rconsolename(title: string) -> ()", desc: "Sets the console window's title.", aliases: ["rconsolesettitle"] },
    { name: "rconsoletop", sig: "rconsoletop(topmost: boolean) -> ()", desc: "Keeps the console above other windows.", aliases: ["rconsoletopmost"] },
    { name: "rconsolehide", sig: "rconsolehide() -> ()", desc: "Hides the console without closing it." },
    { name: "rconsoleshow", sig: "rconsoleshow() -> ()", desc: "Shows a hidden console." },
    { name: "rconsoletoggle", sig: "rconsoletoggle() -> ()", desc: "Shows the console if hidden, hides it otherwise." },
    { name: "rconsolehidden", sig: "rconsolehidden() -> boolean", desc: "Returns whether the console is hidden." },
  ],
};

export const crypt = {
  title: "Crypt",
  icon: "lock",
  blurb: "Hashing, HMAC, AES and random bytes.",
  fns: [
    {
      name: "crypt.hash",
      sig: "crypt.hash(data: string, algorithm: string) -> string",
      desc: "Hashes data and returns lowercase hex. Algorithms: `md5`, `sha1`, `sha224`, `sha256`, `sha384`, `sha512`, `sha3-224`, `sha3-256`, `sha3-384`, `sha3-512`.",
      example: `print(crypt.hash("hello", "sha256"))`,
    },
    { name: "crypt.hmac", sig: "crypt.hmac(key: string, data: string, algorithm: string) -> string", desc: "Computes an HMAC with any of the hash algorithms and returns hex." },
    {
      name: "crypt.encrypt",
      sig: "crypt.encrypt(data: string, key: string, iv?: string, mode?: \"CBC\") -> (string, string)",
      desc: "AES-CBC encrypts data. `key` is a Base64-encoded 256-bit key (see `crypt.generatekey`); a random IV is generated when omitted. Returns the Base64 ciphertext and the Base64 IV.",
    },
    { name: "crypt.decrypt", sig: "crypt.decrypt(data: string, key: string, iv: string, mode?: \"CBC\") -> string", desc: "Reverses `crypt.encrypt`. All inputs are Base64." },
    { name: "crypt.generatekey", sig: "crypt.generatekey() -> string", desc: "Returns a random 256-bit key, Base64-encoded." },
    { name: "crypt.generatebytes", sig: "crypt.generatebytes(length: number) -> string", desc: "Returns `length` cryptographically random bytes, Base64-encoded." },
    { name: "crypt.random", sig: "crypt.random(length: number) -> string", desc: "Returns `length` cryptographically random raw bytes (not encoded)." },
  ],
};

export const encoding = {
  title: "Encoding",
  icon: "file-binary",
  blurb: "Base64 and LZ4.",
  intro: "The same functions are also on the `crypt` table, and `base64.encode` / `base64.decode` exist as a table form.",
  fns: [
    { name: "base64encode", sig: "base64encode(data: string) -> string", desc: "Encodes bytes as Base64.", aliases: ["base64_encode", "crypt.base64encode", "base64.encode"] },
    { name: "base64decode", sig: "base64decode(data: string) -> string", desc: "Decodes Base64 into bytes.", aliases: ["base64_decode", "crypt.base64decode", "base64.decode"] },
    { name: "lz4compress", sig: "lz4compress(data: string) -> string", desc: "Compresses data with LZ4 (raw block format).", aliases: ["crypt.lz4compress"] },
    { name: "lz4decompress", sig: "lz4decompress(data: string, size: number) -> string", desc: "Decompresses an LZ4 block. `size` is the original length.", aliases: ["crypt.lz4decompress"] },
  ],
};

export const network = {
  title: "Network",
  icon: "network",
  blurb: "HTTP requests and WebSockets.",
  fns: [
    {
      name: "request",
      sig: "request(options: { Url: string, Method: string?, Headers: table?, Cookies: table?, Body: string? }) -> Response",
      desc: "Sends an HTTP request and yields until it completes. The response has `Success`, `StatusCode`, `StatusMessage`, `Headers`, `Cookies` and `Body`. supQ adds its own identifying headers.",
      aliases: ["http_request", "http.request", "syn.request"],
      example: `local response = request({
    Url = "https://httpbin.org/post",
    Method = "POST",
    Headers = { ["Content-Type"] = "application/json" },
    Body = '{"hello":"world"}',
})
print(response.StatusCode, response.Body)`,
    },
    { name: "game:HttpGet", sig: "game:HttpGet(url: string) -> string", desc: "Fetches a URL and returns the body. Also callable as the global `httpget(url)`.", aliases: ["HttpGetAsync", "httpget"] },
    { name: "game:HttpPost", sig: "game:HttpPost(url: string, body: string, contentType?: string) -> string", desc: "Posts to a URL and returns the response body.", aliases: ["HttpPostAsync"] },
    {
      name: "WebSocket.connect",
      sig: "WebSocket.connect(url: string) -> WebSocket",
      desc: "Opens a `ws://` or `wss://` connection. The object has `Send(message, isBinary?)`, `Close()`, and the signals `OnMessage(message, isBinary)` and `OnClose()`.",
      example: `local socket = WebSocket.connect("wss://echo.websocket.org")
socket.OnMessage:Connect(function(message)
    print("received", message)
end)
socket:Send("hello")`,
    },
  ],
};

export const miscellaneous = {
  title: "Miscellaneous",
  icon: "sparkles",
  blurb: "Executor info, teleport queues, fast flags and more.",
  fns: [
    { name: "identifyexecutor", sig: "identifyexecutor() -> (string, string)", desc: "Returns the executor name and version.", aliases: ["getexecutorname"] },
    { name: "getexecutorversion", sig: "getexecutorversion() -> string", desc: "Returns the executor version." },
    {
      name: "queue_on_teleport",
      sig: "queue_on_teleport(source: string) -> ()",
      desc: "Queues code to run after the next teleport, once the new place has loaded.",
      aliases: ["queueonteleport", "queueteleport"],
    },
    { name: "clearteleportqueue", sig: "clearteleportqueue() -> ()", desc: "Empties the teleport queue.", aliases: ["clear_teleport_queue", "clearqueueonteleport"] },
    { name: "setfpscap", sig: "setfpscap(fps: number) -> ()", desc: "Sets the frame rate cap. 0 or anything invalid means uncapped (250)." },
    { name: "getfpscap", sig: "getfpscap() -> number", desc: "Returns the current frame rate cap." },
    { name: "getfflag", sig: "getfflag(name: string) -> string?", desc: "Returns a fast flag's value as a string. The FFlag/DFInt/… prefix is optional." },
    { name: "setfflag", sig: "setfflag(name: string, value: string | boolean) -> boolean", desc: "Sets an integer or boolean fast flag. Returns whether it worked." },
    { name: "getfflagtype", sig: "getfflagtype(name: string) -> \"int\" | \"bool\" | \"string\" | \"unknown\"", desc: "Returns what kind of value a fast flag holds.", aliases: ["getfastflagtype"] },
    { name: "gethwid", sig: "gethwid() -> string", desc: "Returns an identifier for this machine." },
    { name: "messagebox", sig: "messagebox(text: string, caption: string, flags?: number) -> number", desc: "Shows a Windows message box (yields) and returns the button pressed. `flags` are `MB_*` values." },
    { name: "toast_notification", sig: "toast_notification(options: { Title: string?, Content: string, Type: string?, Duration: number? }) -> ()", desc: "Shows a supQ toast in the corner of the game. `Type` is `info`, `success`, `warning` or `error`.", aliases: ["create_toast"] },
    { name: "GetObjects", sig: "game:GetObjects(asset: string) -> {Instance}", desc: "Loads a model asset (`rbxassetid://…`) and returns its contents. Also a global, `getobjects(asset)`, which accepts a numeric id.", aliases: ["getobjects"] },
    { name: "info", sig: "info(...any) -> ()", desc: "Prints to the developer console as an info (blue) message." },
    { name: "get_process_identifier", sig: "get_process_identifier() -> number", desc: "Returns the Roblox process id." },
  ],
};
