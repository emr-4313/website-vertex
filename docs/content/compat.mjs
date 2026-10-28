export const signal = {
  title: "Signal objects",
  icon: "zap",
  origin: ["Volt", "Potassium", "Real"],
  blurb: "Script-side signals: `Signal`, `VoltSignal`, `PsmSignal` and `RealSignal` are the same library.",
  fns: [
    {
      name: "Signal.new",
      sig: "Signal.new() -> Signal",
      desc: "Creates a signal. Callbacks run on their own threads, so they can yield.",
      aliases: ["VoltSignal.new", "PsmSignal.new", "RealSignal.new"],
      example: `local signal = Signal.new()
signal:Connect(function(message)
    print("got", message)
end)
signal:Fire("hello")`,
    },
    { name: "Signal:Connect", sig: "signal:Connect(callback: (...any) -> ()) -> Connection", desc: "Calls `callback` every time the signal fires. The connection has `Connected` and `Disconnect()`." },
    { name: "Signal:Once", sig: "signal:Once(callback: (...any) -> ()) -> Connection", desc: "Like Connect, but disconnects before the first call." },
    { name: "Signal:Wait", sig: "signal:Wait() -> ...any", desc: "Yields until the signal fires and returns its arguments." },
    { name: "Signal:Fire", sig: "signal:Fire(...any) -> ()", desc: "Fires the signal." },
    { name: "Signal:DisconnectAll", sig: "signal:DisconnectAll() -> ()", desc: "Disconnects every connection.", aliases: ["Signal:Destroy"] },
  ],
};

export const luastateproxy = {
  title: "LuaStateProxy",
  icon: "layers",
  origin: ["Volt"],
  blurb: "Handles to Lua VMs (the game's and each Actor's) for running code and passing messages across them.",
  fns: [
    { name: "LuaStateProxy.new", sig: "LuaStateProxy.new() -> LuaStateProxy", desc: "Returns a handle to the current Lua state." },
    { name: "state:Execute", sig: "state:Execute(source: string, ...any) -> ()", desc: "Runs source on that state. Arguments are copied across VMs." },
    { name: "state:GetActors", sig: "state:GetActors() -> {Actor}", desc: "Returns the Actors that run on that state." },
    { name: "state.Id", sig: "state.Id: number", desc: "Read-only id of the state." },
    { name: "state.IsActorState", sig: "state.IsActorState: boolean", desc: "Whether the state belongs to an Actor." },
    { name: "state.Event", sig: "state.Event: Signal", desc: "A signal shared between states: firing it on one state reaches listeners on the others." },
  ],
};

export const oth = {
  title: "oth",
  icon: "git-branch",
  origin: ["Volt"],
  blurb: "Hooks that run on their own thread, so the hooked game code cannot see your stack.",
  fns: [
    {
      name: "oth.hook",
      sig: "oth.hook(target: function, hook: function) -> function",
      desc: "Hooks `target`; `hook` runs on a separate thread. Returns the original.",
      example: `local original
original = oth.hook(someGameFunction, function(...)
    print("called with", ...)
    return original(...)
end)`,
    },
    { name: "oth.unhook", sig: "oth.unhook(target: function) -> boolean", desc: "Removes an oth hook." },
    { name: "oth.get_original_thread", sig: "oth.get_original_thread() -> thread?", desc: "Inside a hook, returns the thread that made the call." },
    { name: "oth.get_root_callback", sig: "oth.get_root_callback() -> function?", desc: "Inside a hook, returns the function the game originally called." },
    { name: "oth.is_hook_thread", sig: "oth.is_hook_thread() -> boolean", desc: "Returns whether the current thread is an oth hook thread." },
  ],
};

export const drawingimmediate = {
  title: "DrawingImmediate",
  icon: "brush",
  origin: ["Potassium"],
  blurb: "Draw primitives every frame from a paint callback, with no objects to manage.",
  fns: [
    {
      name: "DrawingImmediate.GetPaint",
      sig: "DrawingImmediate.GetPaint(zIndex: number) -> Signal",
      desc: "Returns a signal that fires every frame; lower z-indexes fire first. The draw functions below only work inside its callbacks.",
      example: `local uis = game:GetService("UserInputService")
DrawingImmediate.GetPaint(1):Connect(function()
    DrawingImmediate.Circle(uis:GetMouseLocation(), 100, Color3.new(1, 1, 1), 1, 64, 1)
end)`,
    },
    { name: "DrawingImmediate.Line", sig: "DrawingImmediate.Line(from: Vector2, to: Vector2, color: Color3, opacity: number, thickness: number) -> ()", desc: "Draws a line." },
    { name: "DrawingImmediate.Circle", sig: "DrawingImmediate.Circle(center: Vector2, radius: number, color: Color3, opacity: number, sides: number, thickness: number) -> ()", desc: "Draws a circle outline." },
    { name: "DrawingImmediate.FilledCircle", sig: "DrawingImmediate.FilledCircle(center: Vector2, radius: number, color: Color3, sides: number, opacity: number) -> ()", desc: "Draws a filled circle." },
    { name: "DrawingImmediate.Triangle", sig: "DrawingImmediate.Triangle(a: Vector2, b: Vector2, c: Vector2, color: Color3, opacity: number, thickness: number) -> ()", desc: "Draws a triangle outline." },
    { name: "DrawingImmediate.FilledTriangle", sig: "DrawingImmediate.FilledTriangle(a: Vector2, b: Vector2, c: Vector2, color: Color3, opacity: number) -> ()", desc: "Draws a filled triangle." },
    { name: "DrawingImmediate.Rectangle", sig: "DrawingImmediate.Rectangle(topLeft: Vector2, size: Vector2, color: Color3, opacity: number, rounding: number, thickness: number) -> ()", desc: "Draws a rectangle outline." },
    { name: "DrawingImmediate.FilledRectangle", sig: "DrawingImmediate.FilledRectangle(topLeft: Vector2, size: Vector2, color: Color3, opacity: number, rounding: number) -> ()", desc: "Draws a filled rectangle." },
    { name: "DrawingImmediate.Quad", sig: "DrawingImmediate.Quad(a: Vector2, b: Vector2, c: Vector2, d: Vector2, color: Color3, opacity: number, thickness: number) -> ()", desc: "Draws a quad outline." },
    { name: "DrawingImmediate.FilledQuad", sig: "DrawingImmediate.FilledQuad(a: Vector2, b: Vector2, c: Vector2, d: Vector2, color: Color3, opacity: number) -> ()", desc: "Draws a filled quad." },
    { name: "DrawingImmediate.Text", sig: "DrawingImmediate.Text(position: Vector2, font: number, size: number, color: Color3, opacity: number, text: string, center: boolean) -> ()", desc: "Draws text." },
    { name: "DrawingImmediate.OutlinedText", sig: "DrawingImmediate.OutlinedText(position: Vector2, font: number, size: number, color: Color3, opacity: number, outlineColor: Color3, outlineOpacity: number, text: string, center: boolean) -> ()", desc: "Draws text with an outline." },
  ],
};

export const drawingextras = {
  title: "Fonts & Shaders",
  icon: "type",
  origin: ["Volt", "Potassium"],
  blurb: "Custom fonts and HLSL shaders for the Drawing library.",
  fns: [
    {
      name: "DrawFont.Register",
      sig: "DrawFont.Register(data: string, options: { PixelSize: number, Glyphs: {{number}}? }) -> DrawFont?",
      desc: "Loads a TTF/OTF font for Text drawings. `Glyphs` lists extra codepoint groups to include. Returns nil if the data is not a font. The font has `GetTextBounds(size, text) -> Vector2`.",
      origin: "Volt",
      example: `local font = DrawFont.Register(readfile("Inter.ttf"), { PixelSize = 24 })
local text = Drawing.new("Text")
text.Font = font`,
    },
    {
      name: "Drawing.new(\"Font\")",
      sig: "Drawing.new(\"Font\") -> Drawing",
      desc: "A font object: set `Data` to TTF/OTF bytes, then assign the object to a Text drawing's `Font`.",
      origin: "Potassium",
    },
    {
      name: "Drawing.new(\"Shader\")",
      sig: "Drawing.new(\"Shader\") -> Drawing",
      desc: "Renders an HLSL shader. Set `Vertex` and `Pixel` (both entry points are `main`), optionally `Position` and `Size` (default: the whole window), then call `:Create()`; it errors with the compiler output on failure. The pixel shader can read `cbuffer Params : register(b0) { float time; float2 resolution; float2 mouse; }`. Shaders are visible as soon as they compile.",
      origin: "Potassium",
      example: `local shader = Drawing.new("Shader")
shader.Vertex = [[
struct VSOut { float4 pos : SV_POSITION; float2 uv : TEXCOORD0; };
VSOut main(uint id : SV_VertexID) {
    VSOut o;
    float2 p[3] = { float2(-1, -1), float2(-1, 3), float2(3, -1) };
    o.pos = float4(p[id], 0, 1);
    o.uv = p[id] * 0.5 + 0.5;
    return o;
}]]
shader.Pixel = [[
cbuffer Params : register(b0) { float time; float2 resolution; float2 mouse; };
float4 main(float4 pos : SV_Position, float2 uv : TEXCOORD0) : SV_Target {
    return float4(uv, 0.5 + 0.5 * sin(time), 1);
}]]
shader:Create()`,
    },
  ],
};

export const json = {
  title: "json",
  icon: "braces",
  origin: ["Real"],
  blurb: "JSON with a null sentinel, key order preservation, pretty printing and safe parsing.",
  intro: "`json.null` represents JSON null. Objects decoded by supQ remember their key order, so decode → encode round-trips keep it.",
  fns: [
    {
      name: "json.encode",
      sig: "json.encode(value: any, options?: boolean | number | string | EncodeOptions) -> string",
      desc: "Serialises a value. Options: `pretty`, `indent`, `sortKeys`, `emptyTableAsArray`, `errorOnUnsupported`, `encodeInvalidNumbersAsNull`, `maxDepth`. A boolean/number/string option turns on pretty printing (with that indent).",
      aliases: ["json.stringify"],
      example: `print(json.encode({ name = "supQ", tags = { "fast" } }, { sortKeys = true }))
--> {"name":"supQ","tags":["fast"]}`,
    },
    { name: "json.encodePretty", sig: "json.encodePretty(value: any, options?) -> string", desc: "Like encode, always pretty-printed (two-space indent by default).", aliases: ["json.pretty"] },
    { name: "json.decode", sig: "json.decode(text: string, options?: boolean | { useNull: boolean?, maxDepth: number? }) -> any", desc: "Parses JSON and errors on invalid input. JSON null becomes `json.null` unless `useNull` is false.", aliases: ["json.parse"] },
    { name: "json.decodeSafe", sig: "json.decodeSafe(text: string, options?) -> (boolean, any, string?, number?)", desc: "Parses without throwing: returns success, the value, and on failure the message and byte position.", aliases: ["json.tryDecode"] },
    { name: "json.validate", sig: "json.validate(text: string, options?) -> (boolean, string?, number?)", desc: "Returns true for valid JSON, or false with the error and position." },
    { name: "json.format", sig: "json.format(text: string, options?) -> string", desc: "Re-formats JSON text with indentation." },
    { name: "json.minify", sig: "json.minify(text: string) -> string", desc: "Strips all whitespace from JSON text." },
    { name: "json.escape", sig: "json.escape(text: string) -> string", desc: "Escapes a string for use inside JSON quotes." },
    { name: "json.quote", sig: "json.quote(text: string) -> string", desc: "Escapes a string and wraps it in quotes." },
    { name: "json.unescape", sig: "json.unescape(text: string) -> string", desc: "Decodes JSON escape sequences, from string content or a full quoted literal." },
    { name: "json.array", sig: "json.array(source?: table) -> table", desc: "Returns a table that always encodes as an array, optionally copying `source[1..#source]`." },
    { name: "json.object", sig: "json.object(source?: table) -> table", desc: "Returns a table that always encodes as an object." },
    { name: "json.isArray", sig: "json.isArray(value: any) -> boolean", desc: "Returns whether a table encodes as an array." },
    { name: "json.isObject", sig: "json.isObject(value: any) -> boolean", desc: "Returns whether a table encodes as an object." },
    { name: "json.isNull", sig: "json.isNull(value: any) -> boolean", desc: "Returns whether a value is `json.null`." },
    { name: "json.type", sig: "json.type(value: any) -> string", desc: "Returns `null`, `array`, `object`, or the Luau type." },
    { name: "json.keys", sig: "json.keys(object: table) -> table", desc: "Returns the keys as an array (in decode order for decoded objects)." },
    { name: "json.values", sig: "json.values(object: table) -> table", desc: "Returns the values as an array." },
    { name: "json.getPath", sig: "json.getPath(object: table, path: string | {any}, default?: any) -> any", desc: "Reads a nested value by a dotted path (`\"a.b.2\"`) or a key list, returning `default` if it is missing.", aliases: ["json.getpath"] },
    { name: "json.clone", sig: "json.clone(value: any) -> any", desc: "Deep-copies a value through encode and decode." },
  ],
};

export const imgui = {
  title: "imgui",
  icon: "app-window",
  origin: ["Real"],
  blurb: "Small native windows with buttons, sliders and inputs, drawn by supQ's overlay.",
  intro: "Callbacks run on their own threads. While the cursor is over a window the game does not receive clicks; while a text box is focused it receives keyboard input. Every builder method returns the window so calls can be chained.",
  fns: [
    {
      name: "imgui.create",
      sig: "imgui.create(title?: string) -> ImGuiWindow",
      desc: "Creates a window. Titles must be unique among open windows.",
      example: `local window = imgui.create("Settings")
window:Text("Aimbot")
    :Checkbox("Enabled", false, function(on) print("enabled", on) end)
    :SliderFloat("FOV", 90, 10, 180, function(v) print("fov", v) end)
    :Separator()
    :Button("Close", function() window:destroy() end)`,
    },
    { name: "imgui.setvsync", sig: "imgui.setvsync(enabled: boolean) -> ()", desc: "Turns vertical sync on or off for the overlay." },
    { name: "window:Text", sig: "window:Text(text: string) -> ImGuiWindow", desc: "Adds wrapped text." },
    { name: "window:Button", sig: "window:Button(label: string, onClick: () -> ()) -> ImGuiWindow", desc: "Adds a button." },
    { name: "window:Checkbox", sig: "window:Checkbox(label: string, checked: boolean, onChange: (boolean) -> ()) -> ImGuiWindow", desc: "Adds a checkbox." },
    { name: "window:SliderFloat", sig: "window:SliderFloat(label: string, value: number, min: number, max: number, onChange: (number) -> ()) -> ImGuiWindow", desc: "Adds a decimal slider." },
    { name: "window:SliderInt", sig: "window:SliderInt(label: string, value: number, min: number, max: number, onChange: (number) -> ()) -> ImGuiWindow", desc: "Adds an integer slider." },
    { name: "window:InputText", sig: "window:InputText(label: string, text: string?, onChange: (string) -> ()) -> ImGuiWindow", desc: "Adds a single-line text box (up to 255 bytes)." },
    { name: "window:ColorPicker", sig: "window:ColorPicker(label: string, r: number?, g: number?, b: number?, a: number?, onChange: (r, g, b, a) -> ()) -> ImGuiWindow", desc: "Adds an RGBA colour editor; components are 0-1." },
    { name: "window:CollapsingHeader", sig: "window:CollapsingHeader(label: string, content: (ImGuiWindow) -> ()) -> ImGuiWindow", desc: "Adds a collapsible section; `content` adds the elements inside it." },
    { name: "window:SameLine", sig: "window:SameLine() -> ImGuiWindow", desc: "Puts the next element on the same row." },
    { name: "window:Separator", sig: "window:Separator() -> ImGuiWindow", desc: "Adds a horizontal line." },
    { name: "window:destroy", sig: "window:destroy() -> ()", desc: "Closes the window. Calling it again does nothing.", aliases: ["window:Destroy"] },
  ],
};

export const regex = {
  title: "Regex",
  icon: "regex",
  origin: ["Potassium"],
  blurb: "ECMAScript-style regular expressions.",
  fns: [
    {
      name: "Regex.new",
      sig: "Regex.new(pattern: string) -> Regex",
      desc: "Compiles a pattern. The object has `Match(text) -> string?`, `MatchMany(text) -> {string}` and `Replace(text, replacement) -> string` (`$1` refers to groups).",
      example: `local id = Regex.new("Id:\\\\s*(\\\\w+)")
print(id:Replace("Id: 1234", "$1")) --> 1234`,
    },
    { name: "Regex.Escape", sig: "Regex.Escape(text: string) -> string", desc: "Escapes every regex metacharacter in `text`." },
  ],
};

export const disassembler = {
  title: "Disassembler",
  icon: "list-tree",
  origin: ["Real"],
  blurb: "Readable listings of Luau bytecode.",
  fns: [
    {
      name: "disassemble",
      sig: "disassemble(func: function, options?: { Recursive: boolean?, ShowLines: boolean?, ShowConstants: boolean?, StringPreviewMax: number? }) -> string",
      desc: "Returns an instruction listing of a Luau function, with constants, line numbers and nested functions (all on by default). C functions are rejected.",
      example: `print(disassemble(function(x) return x * 2 end, { ShowLines = false }))`,
    },
  ],
};
