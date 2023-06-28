import { ChevronRight } from './icons/ChevronRight';
import { File } from './icons/File';
import { t } from './util';

export const BreadCrumb = (id, path) => {
  return t.nav({ id: id, class: 'tw-flex', 'aria-label': 'tw-Breadcrumb' }, [
    t.ol(
      {
        role: 'list',
        class: 'tw-flex tw-flex-wrap tw-items-center tw-space-x-4',
      },
      [
        t.li({}, [
          t.div({}, [
            t.a(
              {
                href: '#',
                class: 'tw-text-gray-400 tw-hover:text-gray-600',
              },
              [File()]
            ),
          ]),
        ]),
        ...path.map((item, index) => {
          const formattedItem = typeof item === 'number' ? `[${item}]` : item;
          return t.li({ key: index }, [
            t.div({ class: 'tw-flex tw-items-center' }, [
              ChevronRight(),
              t.a(
                {
                  href: '#',
                  class:
                    'tw-ml-4 tw-text-lg tw-font-medium tw-text-gray-600 tw-hover:text-gray-800',
                },
                [formattedItem]
              ),
            ]),
          ]);
        }),
      ]
    ),
  ]);
};
