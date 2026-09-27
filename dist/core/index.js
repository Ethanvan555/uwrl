"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiagnosticsManager = exports.Diagnostics = exports.EventManager = exports.Events = exports.StateManager = exports.State = exports.ConfigManager = exports.Config = void 0;
// Barrel exports for core modules
var Config_1 = require("./Config");
Object.defineProperty(exports, "Config", { enumerable: true, get: function () { return Config_1.ConfigManager; } });
Object.defineProperty(exports, "ConfigManager", { enumerable: true, get: function () { return Config_1.ConfigManager; } });
var State_1 = require("./State");
Object.defineProperty(exports, "State", { enumerable: true, get: function () { return State_1.StateManager; } });
Object.defineProperty(exports, "StateManager", { enumerable: true, get: function () { return State_1.StateManager; } });
var Events_1 = require("./Events");
Object.defineProperty(exports, "Events", { enumerable: true, get: function () { return Events_1.EventManager; } });
Object.defineProperty(exports, "EventManager", { enumerable: true, get: function () { return Events_1.EventManager; } });
var Diagnostics_1 = require("./Diagnostics");
Object.defineProperty(exports, "Diagnostics", { enumerable: true, get: function () { return Diagnostics_1.DiagnosticsManager; } });
Object.defineProperty(exports, "DiagnosticsManager", { enumerable: true, get: function () { return Diagnostics_1.DiagnosticsManager; } });
//# sourceMappingURL=index.js.map