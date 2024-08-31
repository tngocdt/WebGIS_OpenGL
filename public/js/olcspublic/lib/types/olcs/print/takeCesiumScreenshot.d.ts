/// <reference path="../FeatureConverter.d.ts" />
import type { Scene } from 'cesium';
interface ScreenshotOptions {
    offsetX: number;
    offsetY: number;
    width: number;
    height: number;
}
/**
 */
export declare function takeScreenshot(scene: Scene, options: ScreenshotOptions): Promise<string>;
export {};
//# sourceMappingURL=takeCesiumScreenshot.d.ts.map