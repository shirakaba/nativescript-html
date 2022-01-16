import { logger } from "./Logger";
import type { EventData, ViewBase } from "@nativescript/core";

import { EventTargetImpl } from "./EventTarget";
import { NodeImpl } from "./Node";

// @ts-ignore avoid installing node typings just to reference global object
const globalObject = global;

Object.defineProperty(EventTargetImpl, 'name', { value: 'EventTarget' });
Object.defineProperty(globalObject, 'EventTarget', { value: 'EventTarget_' });

Object.defineProperty(NodeImpl, 'name', { value: 'Node' });
Object.defineProperty(globalObject, 'Node', { value: 'Node_' });

