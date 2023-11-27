# Mongoose Person Model Documentation
## Overview

The provided code defines a Mongoose model for a person, using the MongoDB database. It uses the Mongoose library along with the mongoose-unique-validator plugin for handling unique constraints.
Installation

Before using the code, ensure that you have Node.js and npm installed. Additionally, install the required npm packages by running:

```bash
npm install mongoose mongoose-unique-validator
```
### Code Explanation

### Importing Dependencies:
  mongoose: The MongoDB object modeling tool for Node.js.
  Document and Schema from mongoose.
  mongooseUniqueValidator: A plugin for Mongoose that adds pre-save validation for unique fields.

```javascript
import mongoose, { Document, Schema } from "mongoose";
import mongooseUniqueValidator from "mongoose-unique-validator";
```
### Defining IPerson Interface:
  IPerson: An interface defining the structure of a person, including name, username, contact, national ID, and email.

```javascript
export interface IPerson {
  name: string;
  username?: string;
  contact: string;
  nationalId?: string;
  email?: string;
}
```

### Defining IPersonModel Interface:
  IPersonModel: An interface extending IPerson and Document, representing a Mongoose document.

```javascript
interface IPersonModel extends IPerson, Document {}
```
### Creating Person Schema:
  - **PersonSchema:** A Mongoose schema defining the structure of the person document.
    - **Fields:** `name`, `username`, `contact`, `nationalId`, and `email`.
    - **Additional options:** `versionKey: false` (disabling the version key) and `timestamps: true` (adding createdAt and updatedAt fields).

```javascript
const PersonSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    username: { type: String, trim: true, unique: true },
    contact: { type: String, required: true, trim: true, unique: true },
    nationalId: { type: String, trim: true, unique: true },
    email: { type: String, unique: true, trim: true, index: true },
  },
  { versionKey: false, timestamps: true }
);
```
### Adding Unique Validation Plugin:
  - **PersonSchema.plugin(mongooseUniqueValidator):** Adding the mongoose-unique-validator plugin to the schema to enforce unique constraints.

```javascript
PersonSchema.plugin(mongooseUniqueValidator);
```
### Exporting Mongoose Model:
  - **export default mongoose.model<IPersonModel>("Person", PersonSchema):** Exporting the Mongoose model for the person, specifying the model name as "**Person**" and using the defined schema.

## Usage Example

```javascript
// Import the Person model
import PersonModel, { IPerson } from "./path/to/person.model";

// Create a new person document
const newPerson: IPerson = {
  name: "John Doe",
  username: "john_doe",
  contact: "+123456789",
  nationalId: "123456789",
  email: "john.doe@example.com",
};

// Save the new person document to the database
PersonModel.create(newPerson)
  .then((createdPerson) => {
    console.log("Person created:", createdPerson);
  })
  .catch((error) => {
    console.error("Error creating person:", error.message);
  });
```
This example demonstrates creating a new person document and saving it to the MongoDB database using the Mongoose model. Note that error handling is included for potential validation errors, such as `duplicate unique fields`.