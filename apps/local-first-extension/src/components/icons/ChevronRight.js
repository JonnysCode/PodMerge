export const ChevronRight = (color = '#9ca3af') => {
  const svgString = `<svg xmlns="http://www.w3.org/2000/svg" height="0.8em" viewBox="0 0 320 512"><!--! Font Awesome Free 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><style>svg{fill:${color}}</style><path d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z"/></svg>`;

  return new DOMParser()
    .parseFromString(svgString, 'image/svg+xml')
    .querySelector('svg');
};
