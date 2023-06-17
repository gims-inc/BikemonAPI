export default function transformInput(input) {
  // Remove any non-alphanumeric characters from the input
  const alphanumericInput = input.replace(/[^a-zA-Z0-9]/g, '');

  // Extract the first four letters (e.g., KTWC) from the alphanumeric input
  const prefix = alphanumericInput.substring(0, 4);

  // Extract the numeric part (e.g., 200) from the alphanumeric input
  const numericPart = alphanumericInput.substring(4, 7);

  // Extract the capital letter (e.g., U) from the alphanumeric input
  const capitalLetter = alphanumericInput.substring(7, 8).toUpperCase();

  // Combine the prefix, numeric part, and the capital letter to form the final string
  const transformedString = `${prefix} ${numericPart}${capitalLetter}`;

  return transformedString;
}

// usage

// const transformedString = transformInput(userInput);
// console.log(transformedString); // Output: KTWC 200U
