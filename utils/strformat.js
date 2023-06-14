/* eslint-disable no-extend-native */
String.prototype.removeWhitespaceAndLowercase = () => this.replace(/\s/g, '').toLowerCase();

// Usage:
// const name = '   John Doe   ';
// const modifiedName = name.removeWhitespaceAndLowercase();
// console.log(modifiedName); // Output: "johndoe"

String.prototype.trimAndLowercase = () => this.trim().toLowerCase();

module.exports = String;
