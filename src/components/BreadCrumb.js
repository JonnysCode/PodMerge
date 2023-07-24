import { ChevronRight } from './icons/ChevronRight';
import { File } from './icons/File';
import { t } from './util';

export const BreadCrumb = (id, path) => {
  return t.nav(
    {
      id: id,
      class: 'tw-flex tw-pb-3 tw-border-b tw-border-gray-300',
      'aria-label': 'Breadcrumb',
    },
    [
      t.ol(
        {
          role: 'list',
          class: 'tw-flex tw-flex-wrap tw-items-center tw-space-x-3',
        },
        [
          t.li({}, [
            t.div({}, [
              t.a(
                {
                  href: '#',
                  class:
                    'tw-flex tw-flex-row tw-text-gray-600 hover:tw-text-gray-800',
                },
                [
                  t.span({ class: 'tw-text-sm tw-font-bold tw-mr-1' }, [
                    'JSON-LD',
                  ]),
                  File(),
                ]
              ),
            ]),
          ]),
          ...path.map((item, index) => {
            const formattedItem = typeof item === 'number' ? `[${item}]` : item;
            return t.li({ key: index }, [
              t.div({ class: 'tw-flex tw-items-center tw-text-gray-400' }, [
                ChevronRight(),
                t.a(
                  {
                    href: '#',
                    class:
                      'tw-ml-3 tw-text-lg tw-font-medium tw-text-gray-600 hover:tw-text-gray-800',
                  },
                  [formattedItem]
                ),
              ]),
            ]);
          }),
        ]
      ),
    ]
  );
};
