# Developer Documentation: Product Model
## Table of Contents
1. [Introduction](#introduction)
1. [Prerequisites](#prerequisites)
1. [Installation](#installation)
1. [Model Overview](#model-overview)
1. [Usage](#usage)
    - [Creating a New Product](#creating-a-new-product)
1. [Schema Details](#schema-details)
    - [Fields](#fields)
    - [Text Indexing](#text-indexing)
1. [Contributing](#contributing)
1. [License](#license)
## Introduction
This document provides developer documentation for the Product model, a MongoDB schema created with Mongoose. The model represents products and includes fields such as name, detail, colour, and variant. Additionally, it utilizes text indexing for efficient text-based searches.

## Prerequisites
- Node.js and npm installed
- MongoDB installed and running
- Understanding of TypeScript and Mongoose
## Installation
1. Install the required dependencies:

```bash
npm install mongoose
```
2. Import the necessary modules in your code:

```typescript
import mongoose from 'mongoose';
import Product, { IProductModel } from './path-to-product-model';
```
3. Connect to your MongoDB database:

```typescript
mongoose.connect('mongodb://localhost:27017/your-database', { useNewUrlParser: true, useUnifiedTopology: true });
```
## Model Overview
The Product model represents products and includes fields such as name, detail, colour, and variant. It also utilizes text indexing for efficient searches on multiple fields.

## Usage
### Creating a New Product
```typescript
const sampleProduct: IProductModel = {
  name: 'Sample Product',
  detail: 'Product details...',
  colour: 'Red',
  variant: 'Standard',
};

const newProduct = new Product(sampleProduct);

newProduct.save()
  .then((savedProduct) => {
    console.log('Product saved:', savedProduct);
  })
  .catch((error) => {
    console.error('Error saving product:', error);
  });
```
## Schema Details
### Fields
- **`name`**: Name of the product (required).
- **`detail`**: Details about the product.
- **`colour`**: Colour of the product.
- **`variant`**: Variant of the product.
### Text Indexing
Text indexing is applied to the following fields for efficient text-based searches:

- **`name`**
- **`detail`**
- **`colour`**
- **`variant`**
## Contributing
Contributions are welcome! Feel free to open issues, submit pull requests, or provide feedback.

## License
This project is licensed under the MIT License.

