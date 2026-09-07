import type { EVMChain, De1Step, Process } from '@de1/widget-sdk';
import type { TFunction } from 'i18next';
import type { SubvariantOptions, WidgetSubvariant } from '../types/widget.js';
export declare const useProcessMessage: (step?: De1Step, process?: Process) => {
    title?: string;
    message?: string;
};
export declare function getProcessMessage(t: TFunction, getChainById: (chainId: number) => EVMChain | undefined, step: De1Step, process: Process, subvariant?: WidgetSubvariant, subvariantOptions?: SubvariantOptions): {
    title?: string;
    message?: string;
};
