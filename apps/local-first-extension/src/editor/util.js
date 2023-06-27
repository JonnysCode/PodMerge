/**
 * Gets an attribute value from an element and converts it to an array.
 * Example: "about-p-0" => ['about', 'p', 0]
 * @param {string} str
 * @param {string} delimiter - defaults to '-'
 * @returns {Array<string|number>}
 */
export function dataPathToArray(str, delimiter = '-') {
  const arr = str.split(delimiter);
  return arr.map((element) => {
    if (!isNaN(element)) {
      return parseInt(element);
    } else {
      return element;
    }
  });
}

export function dataPathToStringArray(str, delimiter = '-') {
  return str.split(delimiter);
}

export function constructUpdate(dataPath, updatedValue) {
  return { path: dataPathToArray(dataPath), value: updatedValue };
}
