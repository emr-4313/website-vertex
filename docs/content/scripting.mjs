export const closures = {
  title: "Closures",
  icon: "braces",
  blurb: "Inspect, create, hook and restore Luau and C closures.",
  fns: [
    {
      name: "hookfunction",
      sig: "hookfunction(target: function, hook: function) -> function",
      desc: "Replaces `target` with `hook` everywhere it is referenced and returns a callable copy of the original. Works on Luau and C closures, including `newcclosure` wrappers.",
      aliases: ["hookfunc", "replaceclosure"],
      params: [["target", "function", "The function to replace."], ["hook", "function", "The function that runs instead."]],
      returns: [["function", "The original implementation. Calling it runs on a clean thread, so stack inspection inside it does not see the hook."]],
      example: `local old
old = hookfunction(print, function(...)
    return old("[hooked]", ...)
end)

print("hello") --> [hooked] hello`,
    },
    {
      name: "restorefunction",
      sig: "restorefunction(func: function) -> ()",
      desc: "Undoes `hookfunction` on `func`, putting the original implementation back. Errors if the function is not hooked.",
      aliases: ["restorefunc"],
      params: [["func", "function", "A function previously passed to hookfunction."]],
    },
    {
      name: "isfunctionhooked",
      sig: "isfunctionhooked(func: function) -> boolean",
      desc: "Returns whether `func` is currently hooked with `hookfunction`.",
      params: [["func", "function", "The function to check."]],
      returns: [["boolean", "true while a hook is installed."]],
    },
    {
      name: "hookmetamethod",
      sig: "hookmetamethod(object: any, metamethod: string, hook: function) -> function",
      desc: "Hooks a metamethod on the object's metatable without needing it to be writable, and returns the original metamethod.",
      params: [["object", "any", "Any value with a metatable, usually `game`."], ["metamethod", "string", "For example `__index` or `__namecall`."], ["hook", "function", "The replacement metamethod."]],
      returns: [["function", "The original metamethod."]],
      example: `local old
old = hookmetamethod(game, "__namecall", function(self, ...)
    if getnamecallmethod() == "Kick" then
        return
    end
    return old(self, ...)
end)`,
    },
    {
      name: "newcclosure",
      sig: "newcclosure(func: function, debugname?: string) -> function",
      desc: "Wraps a Luau function in a C closure. The wrapper reports as a C function to `iscclosure` and `debug.info`, and yields through correctly.",
      params: [["func", "function", "The Luau function to wrap."], ["debugname", "string?", "Name reported by debug.info."]],
      returns: [["function", "A C closure that calls `func`."]],
    },
    {
      name: "newlclosure",
      sig: "newlclosure(func: function, debugname?: string) -> function",
      desc: "Wraps any function in a new Luau closure that forwards its arguments and results.",
      params: [["func", "function", "The function to wrap."], ["debugname", "string?", "Name reported by debug.info."]],
      returns: [["function", "A Luau closure that calls `func`."]],
    },
    {
      name: "clonefunction",
      sig: "clonefunction(func: function) -> function",
      desc: "Creates a copy of `func` that shares its prototype and upvalues but is not equal to it. Hooks on the original do not affect the clone.",
      params: [["func", "function", "The function to copy."]],
      returns: [["function", "The copy."]],
    },
    {
      name: "iscclosure",
      sig: "iscclosure(func: function) -> boolean",
      desc: "Returns whether `func` is a C closure.",
      params: [["func", "function", "The function to check."]],
      returns: [["boolean", ""]],
    },
    {
      name: "islclosure",
      sig: "islclosure(func: function) -> boolean",
      desc: "Returns whether `func` is a Luau closure.",
      params: [["func", "function", "The function to check."]],
      returns: [["boolean", ""]],
    },
    {
      name: "isnewcclosure",
      sig: "isnewcclosure(func: function) -> boolean",
      desc: "Returns whether `func` was created by `newcclosure`.",
      aliases: ["iscustomcclosure"],
      params: [["func", "function", "The function to check."]],
      returns: [["boolean", ""]],
    },
    {
      name: "isexecutorclosure",
      sig: "isexecutorclosure(func: function) -> boolean",
      desc: "Returns whether `func` was created by supQ: functions from executed scripts and every function supQ provides.",
      aliases: ["checkclosure", "isourclosure", "isexecutorfunction"],
      params: [["func", "function", "The function to check."]],
      returns: [["boolean", ""]],
    },
    {
      name: "checkcaller",
      sig: "checkcaller() -> boolean",
      desc: "Returns whether the function that called the current one belongs to supQ. Use it inside hooks to let your own calls through.",
      returns: [["boolean", "true when the caller is executor code."]],
    },
    {
      name: "getfunctionhash",
      sig: "getfunctionhash(func: function) -> string",
      desc: "Returns a SHA-384 hex digest of the function's bytecode and constants. Identical functions hash the same across sessions.",
      params: [["func", "function", "A Luau function."]],
      returns: [["string", "96 hex characters."]],
    },
    {
      name: "setstackhidden",
      sig: "setstackhidden(target: function | number, hidden: boolean) -> ()",
      desc: "Hides a function (or the function at a stack level) from stack inspection such as `debug.info` and `debug.traceback`.",
      aliases: ["set_stack_hidden", "sethiddenstack"],
      params: [["target", "function | number", "The function, or a stack level."], ["hidden", "boolean", "Whether to hide it."]],
    },
    {
      name: "isstackhidden",
      sig: "isstackhidden(target: function | number) -> boolean",
      desc: "Returns whether a function, or the function at a stack level, is hidden from stack inspection.",
      aliases: ["ishiddenstack"],
      params: [["target", "function | number", "The function, or a stack level."]],
      returns: [["boolean", ""]],
    },
    {
      name: "comparefunctions",
      sig: "comparefunctions(a: function, b: function) -> boolean",
      desc: "Returns whether both arguments are the same function object. It does not compare bytecode or behaviour.",
      aliases: ["comparefunction"],
      params: [["a", "function", ""], ["b", "function", ""]],
      returns: [["boolean", ""]],
    },
    {
      name: "hookproto",
      sig: "hookproto(proto: ProtoProxy, hook: (...any) -> ...any) -> ()",
      desc: "Redirects every closure created from a nested prototype to `hook`, including closures created later. Get the proxy from `debug.getproto`.",
      params: [["proto", "ProtoProxy", "From debug.getproto or debug.getprotos."], ["hook", "function", "The replacement."]],
    },
    {
      name: "restoreproto",
      sig: "restoreproto(proto: ProtoProxy) -> ()",
      desc: "Removes a hook installed with `hookproto`.",
      params: [["proto", "ProtoProxy", ""]],
    },
    {
      name: "isprotohooked",
      sig: "isprotohooked(proto: ProtoProxy) -> boolean",
      desc: "Returns whether `hookproto` is active on the prototype.",
      params: [["proto", "ProtoProxy", ""]],
      returns: [["boolean", ""]],
    },
    {
      name: "loadstring",
      sig: "loadstring(source: string, chunkname?: string) -> (function?, string?)",
      desc: "Compiles Luau source into a function running at executor identity. On a syntax error it returns nil and the message.",
      params: [["source", "string", "Luau source."], ["chunkname", "string?", "Name used in error messages."]],
      returns: [["function?", "The compiled chunk."], ["string?", "The compile error."]],
    },
    {
      name: "runbytecode",
      sig: "runbytecode(bytecode: string, chunkname?: string) -> function",
      desc: "Loads already-compiled Luau bytecode, for example from `getscriptbytecode`, and returns the chunk.",
      params: [["bytecode", "string", "Luau bytecode."], ["chunkname", "string?", ""]],
      returns: [["function", ""]],
    },
    {
      name: "dumpbytecode",
      sig: "dumpbytecode(source: string) -> string",
      desc: "Compiles Luau source and returns the bytecode without running it.",
      params: [["source", "string", ""]],
      returns: [["string", "Luau bytecode."]],
    },
    {
      name: "gethook",
      sig: "gethook(func: function) -> function?",
      desc: "Returns the hook installed on `func` by `hookfunction`, or nil.",
      params: [["func", "function", ""]],
      returns: [["function?", ""]],
    },
    {
      name: "trampoline_call",
      sig: "trampoline_call(func: function, frames: {TrampolineCallFrame}, options: TrampolineThreadOptions, ...any) -> (boolean, ...any)",
      desc: "Calls `func` on a fresh thread whose call stack is pre-filled with fake frames, and with a chosen script, identity and environment. Code inspecting the stack (`debug.info`, `getcallingscript`) sees the frames you supply.",
      params: [["func", "function", "The function to call."], ["frames", "{TrampolineCallFrame}", "`{ func, currentline }` entries, outermost first."], ["options", "TrampolineThreadOptions", "`{ script?, identity?, env? }`."], ["...", "any", "Arguments."]],
      returns: [["boolean", "Whether the call succeeded."], ["...any", "Results, or the error."]],
    },
  ],
};

export const debug = {
  title: "Debug",
  icon: "bug",
  blurb: "Read and change constants, upvalues, prototypes and stack frames.",
  intro: "Every function takes a function, a stack level, or a `ProtoProxy` where it says so. Levels count from the caller: 1 is the function calling the debug function. Each entry is also a global without the `debug.` prefix.",
  fns: [
    {
      name: "debug.getconstants",
      sig: "debug.getconstants(func: function | number | ProtoProxy) -> {any}",
      desc: "Returns the constant table of a Luau function. Slots whose constant is not representable (closures, tables) are nil.",
      aliases: ["getconstants"],
      returns: [["{any}", "Index → constant."]],
    },
    {
      name: "debug.getconstant",
      sig: "debug.getconstant(func: function | number | ProtoProxy, index: number) -> any",
      desc: "Returns one constant by index.",
      aliases: ["getconstant"],
    },
    {
      name: "debug.setconstant",
      sig: "debug.setconstant(func: function | number | ProtoProxy, index: number, value: any) -> ()",
      desc: "Replaces a constant. The value must be a number, string, boolean or nil, matching what the slot can hold.",
      aliases: ["setconstant"],
      example: `local function greet() print("hello") end
debug.setconstant(greet, 2, "goodbye")
greet() --> goodbye`,
    },
    {
      name: "debug.getupvalues",
      sig: "debug.getupvalues(func: function | number) -> {any}",
      desc: "Returns the upvalues of a function, indexed from 1.",
      aliases: ["getupvalues"],
    },
    {
      name: "debug.getupvalue",
      sig: "debug.getupvalue(func: function | number, index: number) -> any",
      desc: "Returns one upvalue by index.",
      aliases: ["getupvalue"],
    },
    {
      name: "debug.setupvalue",
      sig: "debug.setupvalue(func: function | number, index: number, value: any) -> ()",
      desc: "Sets an upvalue. Every closure sharing that upvalue sees the change.",
      aliases: ["setupvalue"],
    },
    {
      name: "debug.getprotos",
      sig: "debug.getprotos(func: function | number | ProtoProxy) -> {ProtoProxy}",
      desc: "Returns the nested function prototypes of a Luau function as `ProtoProxy` objects.",
      aliases: ["getprotos"],
    },
    {
      name: "debug.getproto",
      sig: "debug.getproto(func: function | number | ProtoProxy, index: number, activated?: boolean) -> ProtoProxy | {function}",
      desc: "Returns one nested prototype. With `activated` set to true it returns the live closures created from it instead.",
      aliases: ["getproto"],
    },
    {
      name: "debug.getstack",
      sig: "debug.getstack(level: number, index?: number) -> any | {any}",
      desc: "Returns the register values of a stack frame, or one register when `index` is given. A thread can be passed first to read another coroutine.",
      aliases: ["getstack"],
    },
    {
      name: "debug.setstack",
      sig: "debug.setstack(level: number, index: number, value: any) -> ()",
      desc: "Writes a register of a stack frame. A thread can be passed first.",
      aliases: ["setstack"],
    },
    {
      name: "debug.getinfo",
      sig: "debug.getinfo(target: function | number | ProtoProxy) -> table",
      desc: "Returns `source`, `short_src`, `what`, `currentline`, `linedefined`, `name`, `numparams`, `is_vararg`, `nups` and `func` for a function or stack level.",
      aliases: ["getinfo"],
    },
    {
      name: "debug.setinfo",
      sig: "debug.setinfo(target: function | number | ProtoProxy, info: table) -> ()",
      desc: "Overrides what `debug.getinfo` and `debug.info` report for a function (for example `source` or `name`).",
      aliases: ["setinfo"],
    },
    {
      name: "debug.setname",
      sig: "debug.setname(target: function | number, name: string) -> ()",
      desc: "Renames a function as seen by `debug.info(f, \"n\")` and error tracebacks.",
      aliases: ["setname"],
      example: `local function foo() end
debug.setname(foo, "bar")
print(debug.info(foo, "n")) --> bar`,
    },
    {
      name: "debug.getcallstack",
      sig: "debug.getcallstack(thread?: thread) -> {{ func: function, currentline: number? }}",
      desc: "Returns the call stack innermost first. Inside an `oth.hook` callback it continues into the hooked caller's stack.",
    },
    {
      name: "debug.validlevel",
      sig: "debug.validlevel(level: number, thread?: thread) -> boolean",
      desc: "Returns whether a stack level exists.",
      aliases: ["debug.isvalidlevel"],
    },
    {
      name: "debug.getregistry",
      sig: "debug.getregistry() -> table",
      desc: "Returns the Luau registry table.",
      aliases: ["getreg", "getregistry"],
    },
    {
      name: "debug.getsafeenv",
      sig: "debug.getsafeenv(target?: function | table | thread) -> boolean",
      desc: "Returns the safeenv flag of an environment table. With safeenv on, Luau caches builtin lookups; replacing a global through getfenv/setfenv turns it off. Executed scripts run with it off.",
      aliases: ["debug.isuntouched"],
    },
    {
      name: "debug.setsafeenv",
      sig: "debug.setsafeenv(target: function | table | thread | boolean, safe?: boolean) -> ()",
      desc: "Sets the safeenv flag. Passing a boolean alone sets it on the calling script's environment.",
      aliases: ["debug.setuntouched"],
    },
  ],
};

export const reflection = {
  title: "Reflection",
  icon: "scan",
  blurb: "Read and write properties Roblox hides from scripts.",
  fns: [
    {
      name: "gethiddenproperty",
      sig: "gethiddenproperty(object: Instance, property: string) -> (any, boolean)",
      desc: "Reads a property even if it is not scriptable. BinaryString properties come back as raw strings.",
      aliases: ["gethiddenprop", "get_hidden_property", "get_hidden_prop"],
      returns: [["any", "The value."], ["boolean", "Whether the property is normally hidden."]],
      example: `print(gethiddenproperty(workspace.Terrain, "SmoothGrid"))`,
    },
    {
      name: "sethiddenproperty",
      sig: "sethiddenproperty(object: Instance, property: string, value: any) -> boolean",
      desc: "Writes a property even if it is not scriptable. Returns whether the property was hidden.",
      aliases: ["sethiddenprop", "set_hidden_property", "set_hidden_prop"],
    },
    {
      name: "gethiddenproperties",
      sig: "gethiddenproperties(object: Instance) -> { [string]: any }",
      desc: "Returns every non-scriptable property of the instance with its value.",
      aliases: ["get_hidden_properties"],
    },
    {
      name: "getproperties",
      sig: "getproperties(object: Instance) -> { [string]: any }",
      desc: "Returns every readable property of the instance with its value.",
      aliases: ["get_properties"],
    },
    {
      name: "isscriptable",
      sig: "isscriptable(object: Instance, property: string) -> boolean",
      desc: "Returns whether scripts can access the property.",
      aliases: ["is_scriptable"],
    },
    {
      name: "setscriptable",
      sig: "setscriptable(object: Instance, property: string, scriptable: boolean) -> boolean",
      desc: "Makes a property scriptable (or not) for this instance only, and returns the previous state.",
      aliases: ["set_scriptable"],
      example: `setscriptable(player, "SimulationRadius", true)
print(player.SimulationRadius)`,
    },
    {
      name: "getbspval",
      sig: "getbspval(object: Instance, property: string, base64?: boolean) -> string",
      desc: "Reads a BinaryString property such as `Terrain.SmoothGrid` or `PartOperation.PhysicsData`. With `base64` set the bytes come back Base64-encoded.",
    },
    {
      name: "getpcd",
      sig: "getpcd(part: TriangleMeshPart) -> (string, string)",
      desc: "Returns the 16-byte MD5 hash and the raw bytes of a mesh part's `PhysicalConfigData`.",
      aliases: ["getpcdprop"],
    },
    {
      name: "getcallbackvalue",
      sig: "getcallbackvalue(object: Instance, property: string) -> function?",
      desc: "Returns the function assigned to a callback property such as `RemoteFunction.OnClientInvoke`, which Roblox normally makes write-only.",
      aliases: ["getcallbackmember", "get_callback_value", "get_callback_member"],
    },
    {
      name: "setcallbackvalue",
      sig: "setcallbackvalue(object: Instance, property: string, value: function?) -> ()",
      desc: "Assigns a callback property and keeps it readable through `getcallbackvalue`.",
      aliases: ["setcallbackmember", "set_callback_value", "set_callback_member"],
    },
    {
      name: "getthreadidentity",
      sig: "getthreadidentity() -> number",
      desc: "Returns the security identity of the current thread. Executed scripts run at 8.",
      aliases: ["getidentity", "getthreadcontext", "get_thread_identity"],
    },
    {
      name: "setthreadidentity",
      sig: "setthreadidentity(identity: number) -> ()",
      desc: "Changes the current thread's security identity and capabilities.",
      aliases: ["setidentity", "setthreadcontext", "set_thread_identity"],
    },
    {
      name: "isnetworkowner",
      sig: "isnetworkowner(part: BasePart) -> boolean",
      desc: "Returns whether your client simulates the part's physics.",
    },
    {
      name: "getsimulationradius",
      sig: "getsimulationradius() -> number",
      desc: "Returns the local player's simulation radius.",
    },
    {
      name: "setsimulationradius",
      sig: "setsimulationradius(radius: number, maxRadius?: number) -> ()",
      desc: "Sets the local player's simulation radius and, optionally, its maximum.",
    },
  ],
};

export const metatable = {
  title: "Metatable",
  icon: "table",
  blurb: "Raw metatable access and read-only tables.",
  fns: [
    {
      name: "getrawmetatable",
      sig: "getrawmetatable(object: any) -> table?",
      desc: "Returns an object's metatable, ignoring any `__metatable` lock.",
      example: `local mt = getrawmetatable(game)
print(mt.__index)`,
    },
    {
      name: "setrawmetatable",
      sig: "setrawmetatable<T>(object: T, metatable: table?) -> T",
      desc: "Sets an object's metatable, ignoring any `__metatable` lock.",
    },
    {
      name: "getmetafield",
      sig: "getmetafield(object: any, field: string) -> any",
      desc: "Reads one field of the object's raw metatable without invoking it. Returns nil if there is no metatable or field.",
    },
    {
      name: "hasmetafield",
      sig: "hasmetafield(object: any, field: string) -> boolean",
      desc: "Returns whether the object's raw metatable has a non-nil `field`.",
    },
    {
      name: "hasmetatable",
      sig: "hasmetatable(object: any) -> boolean",
      desc: "Returns whether the object has a metatable.",
    },
    {
      name: "setreadonly",
      sig: "setreadonly(t: table, readonly: boolean) -> ()",
      desc: "Freezes or unfreezes a table, including tables frozen by Roblox such as metatables.",
    },
    {
      name: "isreadonly",
      sig: "isreadonly(t: table) -> boolean",
      desc: "Returns whether a table is read-only.",
    },
    {
      name: "makereadonly",
      sig: "makereadonly(t: table) -> ()",
      desc: "Same as `setreadonly(t, true)`.",
    },
    {
      name: "makewritable",
      sig: "makewritable(t: table) -> ()",
      desc: "Same as `setreadonly(t, false)`.",
      aliases: ["makewriteable"],
    },
    {
      name: "iswritable",
      sig: "iswritable(t: table) -> boolean",
      desc: "Returns whether a table can be written.",
      aliases: ["iswriteable"],
    },
    {
      name: "getnamecallmethod",
      sig: "getnamecallmethod() -> string?",
      desc: "Inside a `__namecall` hook, returns the name of the method being called.",
    },
    {
      name: "setnamecallmethod",
      sig: "setnamecallmethod(method: string) -> ()",
      desc: "Changes the method name the next `__namecall` original will see.",
    },
  ],
};

export const environment = {
  title: "Environment",
  icon: "globe",
  blurb: "Global environments, the garbage collector and threads.",
  fns: [
    {
      name: "getgenv",
      sig: "getgenv() -> table",
      desc: "Returns supQ's global environment, shared by every script you execute. Values set here are visible to later executions.",
    },
    {
      name: "getrenv",
      sig: "getrenv() -> table",
      desc: "Returns a copy of the game's global environment, the one LocalScripts see.",
    },
    {
      name: "gettenv",
      sig: "gettenv(thread: thread) -> table?",
      desc: "Returns the global table of a thread.",
    },
    {
      name: "getscriptglobals",
      sig: "getscriptglobals() -> { _G: table, shared: table }",
      desc: "Returns the game scripts' `_G` and `shared` tables.",
    },
    {
      name: "getgc",
      sig: "getgc(includeTables?: boolean) -> {any}",
      desc: "Returns every function, userdata and (optionally) table the garbage collector tracks.",
    },
    {
      name: "filtergc",
      sig: "filtergc(type: \"function\" | \"table\", options: table, returnOne?: boolean) -> any | {any}",
      desc: "Searches the garbage collector with filters instead of walking `getgc` yourself. Function filters: `Name`, `IgnoreExecutor`, `Hash`, `Constants`, `Upvalues`. Table filters: `Keys`, `Values`, `KeyValuePairs`, `Metatable`.",
      example: `local onDamage = filtergc("function", {
    Name = "onDamage",
    IgnoreExecutor = true,
}, true)`,
    },
    {
      name: "getreg",
      sig: "getreg() -> table",
      desc: "Returns the Luau registry.",
      aliases: ["getregistry", "debug.getregistry"],
    },
    {
      name: "getallthreads",
      sig: "getallthreads() -> {thread}",
      desc: "Returns every live thread, including coroutines. Other supQ threads are left out; your own is included.",
    },
    {
      name: "getthreads",
      sig: "getthreads() -> {thread}",
      desc: "Returns the threads referenced from the registry, which are the game's script threads.",
    },
    {
      name: "isexecutorthread",
      sig: "isexecutorthread(thread?: thread) -> boolean",
      desc: "Returns whether a thread (default: the current one) belongs to supQ.",
      aliases: ["isourthread", "is_our_thread"],
    },
  ],
};

export const scripts = {
  title: "Scripts",
  icon: "file-code",
  blurb: "Find game scripts and read their environments, closures and bytecode.",
  fns: [
    { name: "getscripts", sig: "getscripts() -> {BaseScript | ModuleScript}", desc: "Returns every script and module the client knows about." },
    { name: "getrunningscripts", sig: "getrunningscripts() -> {LuaSourceContainer}", desc: "Returns scripts that currently have a running thread." },
    { name: "getloadedmodules", sig: "getloadedmodules() -> {ModuleScript}", desc: "Returns ModuleScripts that have been required." },
    { name: "getmodules", sig: "getmodules() -> {ModuleScript}", desc: "Returns every ModuleScript, required or not." },
    { name: "getcallingscript", sig: "getcallingscript() -> LuaSourceContainer?", desc: "Returns the script that called the current function. Useful inside hooks." },
    { name: "getscriptfromthread", sig: "getscriptfromthread(thread: thread) -> LuaSourceContainer?", desc: "Returns the script a thread belongs to." },
    { name: "getscriptthread", sig: "getscriptthread(script: LuaSourceContainer) -> thread?", desc: "Returns the main thread of a running script." },
    {
      name: "getsenv",
      sig: "getsenv(script: LocalScript | ModuleScript) -> table?",
      desc: "Returns a running script's global environment.",
      example: `local env = getsenv(game.Players.LocalPlayer.PlayerScripts.Main)
print(env.someFunction)`,
    },
    { name: "getmenv", sig: "getmenv(module: ModuleScript) -> table?", desc: "Returns a required module's environment." },
    {
      name: "getscriptclosure",
      sig: "getscriptclosure(script: LuaSourceContainer) -> function",
      desc: "Returns a new closure built from the script's bytecode, with its environment. Calling it runs the script again.",
      aliases: ["getscriptfunction"],
    },
    { name: "getscriptbytecode", sig: "getscriptbytecode(script: LuaSourceContainer) -> string", desc: "Returns the script's Luau bytecode.", aliases: ["dumpstring"] },
    { name: "getscripthash", sig: "getscripthash(script: LuaSourceContainer) -> string?", desc: "Returns a hash of the script's bytecode. It changes whenever the script's source changes, so it is useful for detecting updates." },
    { name: "getfunctionbytecode", sig: "getfunctionbytecode(func: function) -> string", desc: "Serialises a single Luau function (and its nested functions) into standard Luau bytecode." },
    { name: "getinstancesbyclass", sig: "getinstancesbyclass(className: string) -> {Instance}", desc: "Returns cached instances whose ClassName matches." },
  ],
};

export const bit = {
  title: "Bit",
  icon: "binary",
  blurb: "Bitwise operations on 32-bit integers (`bit`, also aliased to `bit32`).",
  fns: [
    { name: "bit.band", sig: "bit.band(...number) -> number", desc: "Bitwise AND." },
    { name: "bit.bor", sig: "bit.bor(...number) -> number", desc: "Bitwise OR." },
    { name: "bit.bxor", sig: "bit.bxor(...number) -> number", desc: "Bitwise XOR." },
    { name: "bit.bnot", sig: "bit.bnot(x: number) -> number", desc: "Bitwise NOT." },
    { name: "bit.lshift", sig: "bit.lshift(x: number, n: number) -> number", desc: "Logical left shift." },
    { name: "bit.rshift", sig: "bit.rshift(x: number, n: number) -> number", desc: "Logical right shift." },
    { name: "bit.arshift", sig: "bit.arshift(x: number, n: number) -> number", desc: "Arithmetic right shift (keeps the sign)." },
    { name: "bit.rol", sig: "bit.rol(x: number, n: number) -> number", desc: "Rotate left." },
    { name: "bit.ror", sig: "bit.ror(x: number, n: number) -> number", desc: "Rotate right." },
    { name: "bit.bswap", sig: "bit.bswap(x: number) -> number", desc: "Reverses the byte order." },
    { name: "bit.tobit", sig: "bit.tobit(x: number) -> number", desc: "Normalises a number to a signed 32-bit integer." },
    { name: "bit.tohex", sig: "bit.tohex(x: number, digits?: number) -> string", desc: "Formats as hexadecimal; negative `digits` gives upper case." },
    { name: "bit.badd", sig: "bit.badd(...number) -> number", desc: "32-bit wrapping addition." },
    { name: "bit.bsub", sig: "bit.bsub(...number) -> number", desc: "32-bit wrapping subtraction." },
    { name: "bit.bmul", sig: "bit.bmul(...number) -> number", desc: "32-bit wrapping multiplication." },
    { name: "bit.bdiv", sig: "bit.bdiv(...number) -> number", desc: "Integer division." },
  ],
};
