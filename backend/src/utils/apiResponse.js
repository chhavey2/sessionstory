export default class ApiResponse {
  constructor(statusCode, data, message = "Success", randomFields = {}) {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = true;
    
    // Add any random/custom fields to the response
    if (randomFields && typeof randomFields === 'object') {
      Object.keys(randomFields).forEach(key => {
        // Avoid overwriting existing properties
        if (!this.hasOwnProperty(key)) {
          this[key] = randomFields[key];
        }
      });
    }
  }
}
