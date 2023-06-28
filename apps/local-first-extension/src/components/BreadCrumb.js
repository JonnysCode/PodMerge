import { ChevronRight } from './icons/ChevronRight';
import { File } from './icons/File';
import { t } from './util';

export const BreadCrumb = (id, path) => {
  return t.nav({ id: id, class: 'flex', 'aria-label': 'Breadcrumb' }, [
    t.ol({ role: 'list', class: 'flex flex-wrap items-center space-x-4' }, [
      t.li({}, [
        t.div({}, [
          t.a(
            {
              href: '#',
              class: 'text-gray-400 hover:text-gray-600',
            },
            [File()]
          ),
        ]),
      ]),
      ...path.map((item, index) => {
        const formattedItem = typeof item === 'number' ? `[${item}]` : item;
        return t.li({ key: index }, [
          t.div({ class: 'flex items-center' }, [
            ChevronRight(),
            t.a(
              {
                href: '#',
                class:
                  'ml-4 text-lg font-medium text-gray-600 hover:text-gray-800',
              },
              [formattedItem]
            ),
          ]),
        ]);
      }),
    ]),
  ]);
};
