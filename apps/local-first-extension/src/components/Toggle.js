import { t } from './util';

const enabledBg = 'tw-bg-indigo-600';
const disabledBg = 'tw-bg-gray-200';
const enabledTranslate = 'tw-translate-x-5';
const disabledTranslate = 'tw-translate-x-0';

const buttonClass = (enabled) =>
  `${
    enabled ? enabledBg : disabledBg
  } tw-relative tw-inline-flex tw-h-6 tw-w-11 tw-flex-shrink-0 tw-cursor-pointer tw-rounded-full tw-border-2 tw-border-transparent tw-transition-colors tw-duration-200 tw-ease-in-out focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-indigo-600 focus:tw-ring-offset-2`;

const toggleClass = (enabled) =>
  `${
    enabled ? enabledTranslate : disabledTranslate
  } tw-inline-block tw-h-5 tw-w-5 tw-rounded-full tw-bg-white tw-shadow tw-transform tw-ring-0 tw-transition tw-ease-in-out tw-duration-200`;

export const Toggle = (id, enabled, handleClick) => {
  return t.button(
    {
      id: id,
      type: 'button',
      class:
        'tw-bg-gray-200 tw-relative tw-inline-flex tw-h-6 tw-w-11 tw-flex-shrink-0 tw-cursor-pointer tw-rounded-full tw-border-2 tw-border-transparent tw-transition-colors tw-duration-200 tw-ease-in-out focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-indigo-600 focus:tw-ring-offset-2',
      role: 'switch',
      'aria-checked': 'false',
      click: handleClick,
    }[
      (t.span(
        {
          class: 'sr-only',
        },
        'Use setting'
      ),
      t.span(
        {
          'aria-hidden': 'true',
          class:
            'tw-translate-x-0 tw-inline-block tw-h-5 tw-w-5 tw-rounded-full tw-bg-white tw-shadow tw-transform tw-ring-0 tw-transition tw-ease-in-out tw-duration-200',
        },
        []
      ))
    ]
  );
};
