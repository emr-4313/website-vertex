export const drawing = {
  title: "Drawing",
  icon: "pen",
  blurb: "Draw shapes, text and images on top of the game.",
  intro: "Drawings render in supQ's own overlay on top of the game window. Every object has `Visible` (default false), `ZIndex`, `Transparency` (1 = opaque), `Color` and the methods `Remove()` / `Destroy()`.",
  fns: [
    {
      name: "Drawing.new",
      sig: "Drawing.new(type: string) -> Drawing",
      desc: "Creates a drawing object. Types and their own properties:",
      table: [
        ["Line", "From, To, Thickness"],
        ["Text", "Text, Position, Size, Center, Outline, OutlineColor, Font, TextBounds (read-only)"],
        ["Circle", "Position, Radius, NumSides, Thickness, Filled"],
        ["Square", "Position, Size, Thickness, Filled, Rounding (also as \"Rectangle\")"],
        ["Triangle", "PointA, PointB, PointC, Thickness, Filled"],
        ["Quad", "PointA, PointB, PointC, PointD, Thickness, Filled"],
        ["Image", "Data (PNG/JPG bytes), Position, Size, Rounding"],
      ],
      example: `local circle = Drawing.new("Circle")
circle.Position = workspace.CurrentCamera.ViewportSize / 2
circle.Radius = 120
circle.Color = Color3.fromRGB(168, 85, 247)
circle.Thickness = 2
circle.Visible = true`,
    },
    { name: "Drawing.Fonts", sig: "Drawing.Fonts: { UI: 0, System: 1, Plex: 2, Monospace: 3 }", desc: "Font ids for `Text.Font`. Custom fonts come from `DrawFont.Register` or `Drawing.new(\"Font\")`." },
    { name: "isrenderobj", sig: "isrenderobj(value: any) -> boolean", desc: "Returns whether a value is a Drawing object (destroyed ones included).", aliases: ["isrenderobject", "is_render_obj"] },
    { name: "getrenderproperty", sig: "getrenderproperty(drawing: Drawing, property: string) -> any", desc: "Reads a drawing property.", aliases: ["get_render_property"] },
    { name: "setrenderproperty", sig: "setrenderproperty(drawing: Drawing, property: string, value: any) -> ()", desc: "Writes a drawing property.", aliases: ["set_render_property"] },
    { name: "cleardrawcache", sig: "cleardrawcache() -> ()", desc: "Destroys every drawing object.", aliases: ["clear_draw_cache"] },
  ],
};

export const raknet = {
  title: "RakNet",
  icon: "network",
  blurb: "Watch, change, block and send the client's network packets.",
  intro: "Available as `raknet` and `RakNet`. A packet passed to a hook has `ID` (also `Id`, `PacketId`), `Size`, `Priority`, `Reliability`, `OrderingChannel`, `AsString`, `AsArray`, `AsBuffer`/`Data`, and, in send hooks, `SetData(data)` and `Block()` (alias `Ignore`).",
  fns: [
    {
      name: "raknet.add_send_hook",
      sig: "raknet.add_send_hook(hook: (packet: RakNetPacket) -> ()) -> function",
      desc: "Calls `hook` for every outgoing packet before it is sent. Call `packet:Block()` to drop it or `packet:SetData(bytes)` to replace it.",
      aliases: ["add_send_hook"],
      example: `raknet.add_send_hook(function(packet)
    if packet.ID == 0x83 then
        packet:Block()
    end
end)`,
    },
    { name: "raknet.remove_send_hook", sig: "raknet.remove_send_hook(hook: function) -> boolean", desc: "Removes a send hook.", aliases: ["remove_send_hook"] },
    { name: "raknet.add_receive_hook", sig: "raknet.add_receive_hook(hook: (packet: RakNetPacket) -> (), packetId?: number) -> function", desc: "Calls `hook` for incoming packets, optionally only those with one id.", aliases: ["add_receive_hook"] },
    { name: "raknet.remove_receive_hook", sig: "raknet.remove_receive_hook(hook: function) -> boolean", desc: "Removes a receive hook.", aliases: ["remove_receive_hook"] },
    { name: "raknet.OnPacketSend", sig: "raknet.OnPacketSend:Connect(callback: (packet: RakNetPacket) -> ()) -> { Connected: boolean, Disconnect: () -> () }", desc: "Signal-style form of `add_send_hook`." },
    { name: "raknet.OnPacketReceive", sig: "raknet.OnPacketReceive:Connect(callback: (packet: RakNetPacket) -> ()) -> { Connected: boolean, Disconnect: () -> () }", desc: "Signal-style form of `add_receive_hook`." },
    { name: "raknet.send", sig: "raknet.send(data: string, priority?: number, reliability?: number, channel?: number) -> ()", desc: "Sends raw bytes to the server. Defaults: high priority, reliable ordered, channel 0." },
    { name: "raknet.BitStream.new", sig: "raknet.BitStream.new() -> BitStream", desc: "Creates a buffer with `Write`, `WriteU8`, `WriteU16`, `WriteU32`, `WriteFloat`, `WriteDouble`, `WriteString`, `GetLength`, `Clear`, `ToString` and `Send`." },
    { name: "raknet.desync", sig: "raknet.desync(enabled: boolean, packetId?: number) -> ()", desc: "While enabled, drops every outgoing packet with the given id (the last id used, by default). Pass false to stop." },
    { name: "raknet.is_enabled", sig: "raknet.is_enabled() -> boolean", desc: "Returns whether supQ is attached to the game's network layer." },
    { name: "raknet.status", sig: "raknet.status() -> table", desc: "Returns diagnostic information about the network hooks." },
    { name: "raknet.getpacketlog", sig: "raknet.getpacketlog() -> {table}", desc: "Returns recently seen packets with `Seq`, `Id`, `ItemId`, `ItemName`, `Priority` and `Reliability`." },
    { name: "raknet.clearpacketlog", sig: "raknet.clearpacketlog() -> ()", desc: "Clears the packet log." },
  ],
};

export const decompiler = {
  title: "Decompiler",
  icon: "code",
  blurb: "Turn scripts back into readable Luau.",
  fns: [
    {
      name: "decompile",
      sig: "decompile(target: LuaSourceContainer | string, options?: DecompilerOptions) -> string",
      desc: "Decompiles a client script, or a bytecode string (for example from `getfunctionbytecode`), into Luau source. The decompiler runs locally alongside supQ.",
      example: `local source = decompile(game.Players.LocalPlayer.PlayerScripts.Main)
writefile("Main.lua", source)`,
    },
    {
      name: "DecompilerOptions.new",
      sig: "DecompilerOptions.new() -> DecompilerOptions",
      desc: "Options: `SmartVariableRenamer`, `FunctionDeclarations`, `GuardClauses`, `ConstantFolding`, `ConditionalStructurer` (all booleans, default true), `DoBlockInsertionThreshold` (number) and `Formatter`.",
    },
    {
      name: "DecompilerFormatter.new",
      sig: "DecompilerFormatter.new() -> DecompilerFormatter",
      desc: "Output style: `IndentWidth` (0 = tabs), `ColumnLimit`, `ParenthesizeConditions`, `AppendSemicolons` and the `FunctionMetadata*` settings that control the comment above each function.",
    },
  ],
};

export const saveinstance = {
  title: "Save Instance",
  icon: "save",
  blurb: "Save the game, or parts of it, to a place or model file.",
  fns: [
    {
      name: "saveinstance",
      sig: "saveinstance(root?: Instance | {Instance}, options?: SaveInstanceOptions | table) -> ()",
      desc: "Saves instances to an `.rbxl`/`.rbxm` in the workspace folder. With no root it saves the whole place. Options: `FilePath`, `DecompileScripts`, `SavePlayers`, `SavePlayerCharacters`, `SaveNilInstances`, `SaveNonCreatable`, `IgnoreArchivable`, `DisableCompression`, `CopyToClipboard`, `IgnoreList`, `DecompilerOptions`.",
      example: `saveinstance(game, { DecompileScripts = true })`,
    },
    { name: "saveplace", sig: "saveplace(options?: SaveInstanceOptions | table) -> ()", desc: "Saves the whole place. Same as `saveinstance(game, options)`." },
    { name: "SaveInstanceOptions.new", sig: "SaveInstanceOptions.new() -> SaveInstanceOptions", desc: "Creates a typed options object; plain tables work too." },
  ],
};
