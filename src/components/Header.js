import { Xmark } from './icons/Xmark';
import { t } from './util';
import { sidePanel } from '../editor/SidePanel';

export const Header = (id) => {
  return t.header(
    {
      id: id,
      class:
        'tw-flex tw-flex-row tw-justify-between tw-items-start tw-pb-6 tw-pt-2 tw-mb-3 tw-border-b tw-border-gray-300',
    },
    [
      t.h1(
        {
          class:
            'tw-pt-8 tw-text-2xl tw-font-semibold tw-leading-4 tw-text-emerald-600',
        },
        'Context Editor'
      ),
      t.button(
        {
          class: 'tw-text-gray-300 hover:tw-text-gray-500',
          click: () => {
            sidePanel.toggle();
          },
        },
        Xmark('tw-h-7 tw-w-7')
      ),
    ]
  );
};
