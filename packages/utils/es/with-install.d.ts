import { Plugin } from 'vue';
export type SFCWithInstall<T> = T & Plugin;
export declare function withInstall<T>(comp: T): SFCWithInstall<T>;
