import { closures, debug, reflection, metatable, environment, scripts, bit } from "./scripting.mjs";
import { instances, cache, signals, actors } from "./instances.mjs";
import { filesystem, input, console, crypt, encoding, network, miscellaneous } from "./system.mjs";
import { drawing, raknet, decompiler, saveinstance } from "./graphics.mjs";
import {
  signal, luastateproxy, oth, drawingimmediate, drawingextras, json, imgui, regex, disassembler,
} from "./compat.mjs";

export const groups = [
  {
    title: "Scripting",
    libs: [
      ["closures", closures], ["debug", debug], ["reflection", reflection], ["metatable", metatable],
      ["environment", environment], ["scripts", scripts], ["bit", bit],
    ],
  },
  {
    title: "Instances & Events",
    libs: [["instances", instances], ["cache", cache], ["signals", signals], ["actors", actors]],
  },
  {
    title: "System",
    libs: [
      ["filesystem", filesystem], ["input", input], ["console", console], ["crypt", crypt],
      ["encoding", encoding], ["network", network], ["miscellaneous", miscellaneous],
    ],
  },
  {
    title: "Graphics & Tools",
    libs: [["drawing", drawing], ["raknet", raknet], ["decompiler", decompiler], ["saveinstance", saveinstance]],
  },
  {
    title: "Compatibility",
    compat: true,
    note: "APIs from other executors, so their scripts run on supQ unchanged.",
    libs: [
      ["signal", signal], ["luastateproxy", luastateproxy], ["oth", oth],
      ["drawingimmediate", drawingimmediate], ["fonts-shaders", drawingextras],
      ["json", json], ["imgui", imgui], ["regex", regex], ["disassembler", disassembler],
    ],
  },
];
