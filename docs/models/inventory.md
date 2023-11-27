# Developer Documentation: Inventory Model
## Table of Contents
1. [Introduction](#introduction)
1. [Prerequisites](#prerequisites)
1. [Installation](#installation)
1. [Model Overview](#model-overview)
1. [Usage](#usage)
    - [Creating a New Inventory](#creating-a-new-inventory)
1. [Schema Details](#schema-details)
    - [Fields](#fields)
    - [References](#references)
    - [Validation](#validation)
    - [Text Indexing](#text-indexing)
1. [Contributing](#contributing)
1. [License](#license)
## Introduction
This document provides developer documentation for the Inventory model, a MongoDB schema created with Mongoose. The model represents inventory items and includes details such as the associated product, branch, serial number, unit prices, and quantity.

## Prerequisites
- Node.js and npm installed
- MongoDB installed and running
- Understanding of TypeScript and Mongoose
- Dependencies: [IBranch](./branch.md) and [IProduct](./product.md) models
## Installation
1. Install the required dependencies:

```bash
npm install mongoose
```
2. Import the necessary modules in your code:

```typescript
import mongoose from 'mongoose';
import Inventory, { IInventoryModel } from './path-to-inventory-model';
```
3. Connect to your MongoDB database:

```typescript
mongoose.connect('mongodb://localhost:27017/your-database', { useNewUrlParser: true, useUnifiedTopology: true });
```
## Model Overview
The Inventory model represents inventory items and includes details such as the associated product, branch, serial number, unit prices, and quantity.

## Usage
### Creating a New Inventory
```typescript
const sampleInventory: IInventoryModel = {
  product: '...productId', // Replace with the actual product ID
  branch: '...branchId', // Replace with the actual branch ID
  serialNumber: 'ABC123',
  unitBuyPrice: 50,
  unitSellPrice: 100,
  unitDescountPrice: 80,
  quantity: 20,
};

const newInventory = new Inventory(sampleInventory);

newInventory.save()
  .then((savedInventory) => {
    console.log('Inventory saved:', savedInventory);
  })
  .catch((error) => {
    console.error('Error saving inventory:', error);
  });
```
## Schema Details
### Fields
- **`product`**: Reference to a product (required).
- **`branch`**: Reference to a branch (required).
- **`serialNumber`**: Serial number associated with the inventory item (required).
- **`unitBuyPrice`**: Unit buy price for the inventory item (required).
- **`unitSellPrice`**: Unit sell price for the inventory item (required).
- **`unitDescountPrice`**: Optional unit discount price for the inventory item.
- **`quantity`**: Quantity of items in the inventory (required).
### References
- **`product`**: References the Product model.
- **`branch`**: References the Branch model.
### Validation
- **`serialNumber`**: Required and should be a string.
- **`unitBuyPrice`**: Required and should be a number.
- **`unitSellPrice`**: Required and should be a number.
- **`unitDescountPrice`**: Optional and should be a number.
- **`quantity`**: Required and should be a number.
### Text Indexing
Text indexing is applied to the `product` and `branch` fields for efficient text-based searches.

## Contributing
Contributions are welcome! Feel free to open issues, submit pull requests, or provide feedback.

## License
This project is licensed under the MIT License.