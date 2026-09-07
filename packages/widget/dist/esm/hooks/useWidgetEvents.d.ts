import _mitt from 'mitt';
import type { WidgetEvents } from '../types/events.js';
export declare const widgetEvents: _mitt.Emitter<WidgetEvents>;
export declare const useWidgetEvents: () => _mitt.Emitter<WidgetEvents>;
