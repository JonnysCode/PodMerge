/*
console.log(isIRI("http://example.com")); // Output: true
console.log(isIRI("https://example.com/resource")); // Output: true
console.log(isIRI("ftp://example.com")); // Output: true
console.log(isIRI("example.com")); // Output: false
console.log(isIRI("123")); // Output: false
*/
function isIRI(str) {
  const iriRegex =
    /^(?:[a-z][a-z\d+-.]*:|\/\/)(?:[^//?#]*(?:\/|$)|[^/?#]*[?#])(?:[^?#]*[?][^#]*)?(?:#[^]*)?$/i;
  return iriRegex.test(str);
}
