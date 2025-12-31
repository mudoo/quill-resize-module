import Quill from 'quill';

export type ModuleName = 'DisplaySize' | 'Toolbar' | 'Resize' | 'Keyboard';

export interface SizeLimit {
  minWidth?: number;
  maxWidth?: number;
  minHeight?: number;
  maxHeight?: number;
  ratio?: number;
}

export interface ParchmentConfig {
  attribute?: string[];
  limit?: SizeLimit;
}

export interface CustomToolConfig {
  toolClass?: string;
  icon?: string;
  text?: string;
  attrs?: Record<string, string>;
  verify?: (activeEle: HTMLElement, blot?: any) => boolean;
  handler?: (evt: Event, button: HTMLElement, activeEle: HTMLElement) => void;
}

export interface QuillResizeOptions {
  modules?: (ModuleName | any)[];
  keyboardSelect?: boolean;
  selectedClass?: string;
  activeClass?: string;
  embedTags?: string[];
  tools?: (string | CustomToolConfig)[];
  parchment?: {
    [key: string]: ParchmentConfig;
  };
  onActive?: (blot: any, activeEle: HTMLElement) => void;
  onInactive?: (blot: any, activeEle: HTMLElement) => void;
  onChangeSize?: (blot: any, activeEle: HTMLElement, size: { width?: number; height?: number }) => void;
}

const defaultOptions: QuillResizeOptions = {
  modules: ['DisplaySize', 'Toolbar', 'Resize', 'Keyboard'],
  keyboardSelect: true,
  selectedClass: 'selected',
  activeClass: 'active',
  embedTags: ['VIDEO', 'IFRAME'],
  tools: ['left', 'center', 'right', 'full', 'edit'],

  parchment: {
    image: {
      attribute: ['width'],
      limit: {
        minWidth: 100
      }
    },
    video: {
      attribute: ['width', 'height'],
      limit: {
        minWidth: 200,
        ratio: 0.5625
      }
    }
  }
};

export default defaultOptions;
