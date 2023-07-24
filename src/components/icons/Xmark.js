import { s } from '../util';

export const Xmark = (className) => {
  return s.svg(
    {
      xmlns: 'http://www.w3.org/2000/svg',
      class: className || 'tw-h-5 tw-w-5',
      viewBox: '0 0 384 512',
      fill: 'currentColor',
      'aria-hidden': 'true',
    },
    [
      s.path({
        d: 'M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z',
      }),
    ]
  );
};
