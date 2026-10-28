export const instances = {
  title: "Instances",
  icon: "boxes",
  blurb: "Reach instances the game hides and trigger interactions directly.",
  fns: [
    {
      name: "gethui",
      sig: "gethui() -> Instance",
      desc: "Returns a hidden container for your GUIs. Game scripts cannot find what you parent here.",
      aliases: ["get_hidden_gui", "get_hidden_ui"],
      example: `local gui = Instance.new("ScreenGui")
gui.Parent = gethui()`,
    },
    { name: "getinstances", sig: "getinstances() -> {Instance}", desc: "Returns every instance the client has created a Lua reference for, including ones parented to nil." },
    { name: "getnilinstances", sig: "getnilinstances() -> {Instance}", desc: "Returns cached instances whose Parent is nil." },
    { name: "getinstancecache", sig: "getinstancecache() -> table", desc: "Returns the table Roblox uses to map instances to their Lua userdata." },
    {
      name: "getreferencedby",
      sig: "getreferencedby(instance: Instance) -> {Instance}",
      desc: "Returns every cached instance that points at `instance` through an Instance-typed property (ObjectValue.Value, Weld.Part0, Camera.CameraSubject, …). Parent is not counted.",
      aliases: ["getreferences"],
    },
    {
      name: "fireclickdetector",
      sig: "fireclickdetector(detector: ClickDetector, distance?: number, event?: string) -> ()",
      desc: "Fires a ClickDetector as if the local player clicked it. `event` picks `MouseClick` (default), `RightMouseClick`, `MouseHoverEnter` or `MouseHoverLeave`.",
    },
    {
      name: "fireproximityprompt",
      sig: "fireproximityprompt(prompt: ProximityPrompt) -> ()",
      desc: "Triggers a ProximityPrompt instantly, regardless of distance or hold duration.",
    },
    {
      name: "firetouchinterest",
      sig: "firetouchinterest(part: BasePart, other: BasePart, toggle: boolean | number) -> ()",
      desc: "Starts (`true`/0) or ends (`false`/1) a touch between two parts, firing Touched and TouchEnded.",
      example: `local root = game.Players.LocalPlayer.Character.HumanoidRootPart
firetouchinterest(root, workspace.Coin, true)
firetouchinterest(root, workspace.Coin, false)`,
    },
    { name: "getproximitypromptduration", sig: "getproximitypromptduration(prompt: ProximityPrompt) -> number", desc: "Returns the prompt's HoldDuration." },
    { name: "setproximitypromptduration", sig: "setproximitypromptduration(prompt: ProximityPrompt, duration: number) -> ()", desc: "Sets the prompt's HoldDuration." },
    { name: "getrendersteppedlist", sig: "getrendersteppedlist() -> table", desc: "Returns the functions bound with `RunService:BindToRenderStep`, with their names and priorities." },
    {
      name: "getcustomasset",
      sig: "getcustomasset(path: string) -> string",
      desc: "Copies a file from the workspace folder into Roblox's content folder and returns an `rbxasset://` id usable in images, sounds and meshes.",
    },
  ],
};

export const cache = {
  title: "Cache",
  icon: "database",
  blurb: "Control the instance → userdata cache.",
  fns: [
    { name: "cache.invalidate", sig: "cache.invalidate(instance: Instance) -> ()", desc: "Removes the instance from the cache. The next time Lua sees it, it gets a new userdata, so `==` against older references is false." },
    { name: "cache.iscached", sig: "cache.iscached(instance: Instance) -> boolean", desc: "Returns whether the instance has a cached userdata." },
    { name: "cache.replace", sig: "cache.replace(instance: Instance, replacement: Instance) -> ()", desc: "Makes future lookups of `instance` return `replacement`'s userdata." },
    {
      name: "cloneref",
      sig: "cloneref(instance: Instance) -> Instance",
      desc: "Returns a new reference to the same instance that is not `==` to the original. Detection that compares references will not match it.",
      aliases: ["clonereference"],
      example: `local players = cloneref(game:GetService("Players"))`,
    },
    { name: "compareinstances", sig: "compareinstances(a: Instance, b: Instance) -> boolean", desc: "Returns whether two references (for example a `cloneref`) point at the same instance." },
  ],
};

export const signals = {
  title: "Signals",
  icon: "radio",
  blurb: "Inspect, fire and replicate RBXScriptSignals.",
  fns: [
    {
      name: "getconnections",
      sig: "getconnections(signal: RBXScriptSignal) -> {Connection}",
      desc: "Returns the connections of a signal. Each has `Function`, `Thread`, `Enabled`, `ForeignState`, `LuaConnection` and the methods `Fire`, `Defer`, `Disable`, `Enable` and `Disconnect`.",
      aliases: ["get_signal_cons"],
      example: `for _, connection in getconnections(game.Players.LocalPlayer.Idled) do
    connection:Disable()
end`,
    },
    { name: "getconnection", sig: "getconnection(signal: RBXScriptSignal, index: number) -> Connection?", desc: "Returns one connection by position." },
    { name: "firesignal", sig: "firesignal(signal: RBXScriptSignal, ...any) -> ()", desc: "Calls every connection of the signal with the given arguments, as if the signal fired locally." },
    {
      name: "replicatesignal",
      sig: "replicatesignal(signal: RBXScriptSignal, ...any) -> ()",
      desc: "Fires a replicable signal to the server with the given arguments. Check it with `cansignalreplicate` first; arguments must match `getsignalargumentsinfo`.",
    },
    { name: "cansignalreplicate", sig: "cansignalreplicate(signal: RBXScriptSignal) -> boolean", desc: "Returns whether `replicatesignal` can send the signal to the server." },
    { name: "getsignalarguments", sig: "getsignalarguments(signal: RBXScriptSignal) -> {string}", desc: "Returns the parameter types of a signal." },
    { name: "getsignalargumentsinfo", sig: "getsignalargumentsinfo(signal: RBXScriptSignal) -> {table}", desc: "Returns each parameter's name and type." },
    { name: "getsignalwhitelist", sig: "getsignalwhitelist() -> {string}", desc: "Returns the names of signals that can replicate." },
    {
      name: "hooksignal",
      sig: "hooksignal(signal: RBXScriptSignal, hook: (info: HookInfo, ...any) -> (boolean, ...any)) -> ()",
      desc: "Wraps every current connection of the signal. When it fires, `hook` runs first: return `true` to let the connection run, `true` plus values to run it with those arguments instead, or anything else to block it. If `hook` declares parameters, the first is `{ Connection, Function, Index }` for the connection being run.",
      example: `hooksignal(humanoid.HealthChanged, function(info, health)
    return health > 0 -- block the connection when health hits 0
end)`,
    },
  ],
};

export const actors = {
  title: "Actors",
  icon: "cpu",
  blurb: "Run code inside Actors (parallel Luau) and talk between Lua states.",
  intro: "Each Actor runs in its own Lua VM. supQ represents those VMs as `LuaStateProxy` handles (see Compatibility → LuaStateProxy).",
  fns: [
    { name: "getactors", sig: "getactors() -> {Actor}", desc: "Returns every Actor instance." },
    {
      name: "run_on_actor",
      sig: "run_on_actor(actor: Actor, source: string, ...any) -> ()",
      desc: "Runs source inside the Actor's VM with executor permissions. Extra arguments are deep-copied across.",
      aliases: ["runonactor"],
      example: `for _, actor in getactors() do
    run_on_actor(actor, [[ print("hi from", ...) ]], actor.Name)
end`,
    },
    {
      name: "run_on_thread",
      sig: "run_on_thread(target: thread | LuaStateProxy, source: string, ...any) -> ()",
      desc: "Runs source in a thread's global environment, or on the Lua state a `LuaStateProxy` points to.",
      aliases: ["runonthread"],
    },
    { name: "getactorthreads", sig: "getactorthreads() -> {LuaStateProxy}", desc: "Returns a handle for every Actor's Lua state. These are state handles, not raw threads, because a thread from another VM cannot safely live in yours.", aliases: ["getactorstates", "get_actor_threads"] },
    { name: "getactorfromthread", sig: "getactorfromthread(target: thread | LuaStateProxy) -> Actor?", desc: "Returns the Actor a thread or state belongs to.", aliases: ["getactorfromstate"] },
    { name: "getdeletedactors", sig: "getdeletedactors() -> {LuaStateProxy}", desc: "Returns Lua states whose Actors have been destroyed." },
    { name: "get_current_actor", sig: "get_current_actor() -> Actor?", desc: "Returns the Actor the current code runs in, or nil on the main VM.", aliases: ["getcurrentactor"] },
    { name: "isparallel", sig: "isparallel(thread?: thread) -> boolean", desc: "Returns whether the code runs inside an Actor.", aliases: ["is_parallel", "checkparallel"] },
    { name: "getluastate", sig: "getluastate(target?: Actor | LuaSourceContainer) -> LuaStateProxy?", desc: "Returns the Lua state of an Actor or script, or the current state." },
    { name: "getgamestate", sig: "getgamestate() -> LuaStateProxy?", desc: "Returns the main (non-Actor) Lua state." },
    {
      name: "create_comm_channel",
      sig: "create_comm_channel() -> (number, BindableEvent)",
      desc: "Creates a channel you can fire across VMs. Share the id and call `get_comm_channel(id)` on the other side.",
    },
    { name: "get_comm_channel", sig: "get_comm_channel(id: number) -> BindableEvent", desc: "Returns the channel with the given id." },
    { name: "on_actor_state_created", sig: "on_actor_state_created: Signal", desc: "A signal that fires with the Actor whenever a new Actor Lua state appears." },
  ],
};
