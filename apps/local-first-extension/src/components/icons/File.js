export const File = (color = '#4b5563') => {
  const svgString = `<svg xmlns="http://www.w3.org/2000/svg" height="1.2em" viewBox="0 0 384 512"><!--! Font Awesome Free 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><style>svg{fill:${color}}</style><path d="M0 64C0 28.7 28.7 0 64 0H224V128c0 17.7 14.3 32 32 32H384V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V64zm384 64H256V0L384 128z"/></svg>`;

  return new DOMParser()
    .parseFromString(svgString, 'image/svg+xml')
    .querySelector('svg');
};
