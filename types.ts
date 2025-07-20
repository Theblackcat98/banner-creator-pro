export type HorizontalAlignment = 'left' | 'center' | 'right';
export type VerticalAlignment = 'top' | 'middle' | 'bottom';

export interface BannerSettings {
  width: number;
  height: number;
  backgroundColor: string;
  cornerRadius: number;
  outlineColor: string;
  outlineThickness: number;
  fontFamily: string;
  fontSize: number;
  fontColor: string;
  text: string;
  textAlign: HorizontalAlignment;
  verticalAlign: VerticalAlignment;
  icon: string;
  uploadedIconSvg: string | null;
  theme: 'default' | 'os-window';
  windowTitle: string;
}