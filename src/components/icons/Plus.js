import { s } from '../util';

export const Plus = (className) => {
  return s.svg(
    {
      xmlns: 'http://www.w3.org/2000/svg',
      class: className || 'tw-h-5 tw-w-5',
      viewBox: '0 0 512 512',
      fill: 'currentColor',
      'aria-hidden': 'true',
    },
    [
      s.path({
        d: 'M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM232 344V280H168c-13.3 0-24-10.7-24-24s10.7-24 24-24h64V168c0-13.3 10.7-24 24-24s24 10.7 24 24v64h64c13.3 0 24 10.7 24 24s-10.7 24-24 24H280v64c0 13.3-10.7 24-24 24s-24-10.7-24-24z',
      }),
    ]
  );
};
