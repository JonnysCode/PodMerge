import { t } from './util';

export const Modal = (title, message, onClose) => {
  return t.div(
    {
      class: 'fixed inset-0 z-10',
      'aria-labelledby': 'modal-title',
      role: 'dialog',
      'aria-modal': 'true',
    },
    [
      t.div({
        class: 'fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity',
      }),
      t.div({ class: 'fixed inset-0 z-10 overflow-y-auto' }, [
        t.div(
          {
            class: 'flex min-h-full items-end justify-center p-4 text-center',
          },
          [
            t.div(
              {
                class:
                  'relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all',
              },
              [
                t.div({}, [
                  t.div(
                    {
                      class:
                        'mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100',
                    },
                    [
                      t.svg(
                        {
                          class: 'h-6 w-6 text-green-600',
                          fill: 'none',
                          viewBox: '0 0 24 24',
                          'stroke-width': '1.5',
                          stroke: 'currentColor',
                          'aria-hidden': 'true',
                        },
                        [
                          t.path({
                            'stroke-linecap': 'round',
                            'stroke-linejoin': 'round',
                            d: 'M4.5 12.75l6 6 9-13.5',
                          }),
                        ]
                      ),
                    ]
                  ),
                  t.div({ class: 'mt-3 text-center sm:mt-5' }, [
                    t.h3(
                      {
                        class:
                          'text-base font-semibold leading-6 text-gray-900',
                        id: 'modal-title',
                      },
                      title
                    ),
                    t.div({ class: 'mt-2' }, [
                      t.p({ class: 'text-sm text-gray-500' }, message),
                    ]),
                  ]),
                ]),
                t.div({ class: 'mt-5 sm:mt-6' }, [
                  t.button(
                    {
                      type: 'button',
                      class:
                        'inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600',
                      onClick: onClose,
                    },
                    'Go back to dashboard'
                  ),
                ]),
              ]
            ),
          ]
        ),
      ]),
    ]
  );
};
