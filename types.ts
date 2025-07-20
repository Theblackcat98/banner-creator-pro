export type HorizontalAlignment = 'left' | 'center' | 'right';
export type VerticalAlignment = 'top' | 'middle' | 'bottom';

export interface ColorStop {
  color: string;
  position: number; // 0 to 100
}

export interface Gradient {
  type: 'linear' | 'radial';
  angle: number; // 0 to 360 degrees
  stops: ColorStop[];
}

export interface BannerSettings {
  width: number;
  height: number;
  backgroundColor: string | Gradient;
  cornerRadius: number;
  outlineColor: string | Gradient;
  outlineThickness: number;
  fontFamily: string;
  fontSize: number;
  fontColor: string | Gradient;
  text: string;
  textAlign: HorizontalAlignment;
  verticalAlign: VerticalAlignment;
  icon: string;
  uploadedIconSvg: string | null;
  theme: 'default' | 'os-window';
  windowTitle: string;
}