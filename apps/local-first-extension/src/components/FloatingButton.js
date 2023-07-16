import { t } from './util';

export const FloatingButton = (id, children, onClick) => {
  return t.button(
    {
      id: id,
      type: 'button',
      class:
        'tw-fixed tw-top-4 tw-right-4 tw-rounded-full tw-bg-indigo-600 tw-p-4 tw-text-white tw-shadow-sm hover:tw-bg-indigo-500 focus-visible:tw-outline focus-visible:tw-outline-2 focus-visible:tw-outline-offset-2 focus-visible:tw-outline-indigo-600',
      click: onClick,
    },
    children
  );
};
