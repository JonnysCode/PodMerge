import { t } from './util';

export const FloatingButton = (id, children, onClick) => {
  return t.button(
    {
      id: id,
      type: 'button',
      class:
        'tw-fixed tw-top-4 tw-right-6 tw-rounded-full tw-bg-emerald-600 tw-p-4 tw-text-white tw-shadow-md hover:tw-bg-emerald-500 focus-visible:tw-outline focus-visible:tw-outline-2 focus-visible:tw-outline-offset-2 focus-visible:tw-outline-emerald-600',
      click: onClick,
    },
    children
  );
};
