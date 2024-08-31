# EasyGoat Documentation

## Overview

**EasyGoat** is a utility designed to simplify the development of the GoatbotV2 messenger chatbot. It facilitates message handling, command execution, and dynamic content management, allowing for easy integration into your chatbot environment.

## Author

- **Liane Cagara**

## Function: `EasyGoat`

### Description

The `EasyGoat` function simplifies the creation of a message handler for the GoatbotV2 chatbot. It allows you to configure message templates with dynamic placeholders, handle command execution based on context, and manage command arguments effortlessly.

### Syntax

```javascript
async function EasyGoat(ctx = {});
```

### Parameters

**`ctx`** *(Object | String | Function)*: Configuration for the message handler. The type of `ctx` determines how it is processed.

- **`String`**: If `ctx` is a string, it is used as the default message text.

- **`Function`**: If `ctx` is a function, it is used as the command to execute.

- **`Object`**: If `ctx` is an object, it can include the following properties:

  - **`name`** *(String | Array<String>)*:
    - **Type**: `String` or `Array<String>`
    - **Default**: `"noname"`
    - **Description**: The name of the command or handler. An array uses the first element as the name and the remaining elements as aliases.

  - **`category`** *(String)*:
    - **Type**: `String`
    - **Default**: `"Uncategorized"`
    - **Description**: The category of the command.

  - **`cooldown`** *(Number)*:
    - **Type**: `Number`
    - **Default**: `5`
    - **Description**: Cooldown period in seconds to limit how often the command can be executed.

  - **`author`** *(String)*:
    - **Type**: `String`
    - **Default**: `"Not Specified"`
    - **Description**: The author of the command.

  - **`description`** *(String)*:
    - **Type**: `String`
    - **Default**: `"No description provided"`
    - **Description**: A brief description of the command's purpose.

  - **`args`** *(Object)*:
    - **Type**: `Object`
    - **Default**: `{}`
    - **Description**: Defines how command arguments are handled. It maps argument names to their corresponding handlers. Handlers can be:
      - **`String`**: A static message or template with placeholders.
      - **`Function`**: A function that takes the context and returns a string or a promise that resolves to a string.

  - **`config`** *(Object)*:
    - **Type**: `Object`
    - **Default**: `{}`
    - **Description**: Additional configuration options that override default settings.

  - **`text`** *(String)*:
    - **Type**: `String`
    - **Default**: `"Please configure the .text property in EasyGoat as String."`
    - **Description**: Default message to send if no arguments are used.

  - **`command`** *(Function | null)*:
    - **Type**: `Function` or `null`
    - **Default**: `null`
    - **Description**: A function to execute if no arguments match and no other handler is present. Should return a string or a promise resolving to a string.

### Returns

An object with the following properties:

- **`config`** *(Object)*: The finalized configuration including `name`, `role`, `category`, `shortDescription`, `longDescription`, `author`, `aliases`, and `countDown`.
- **`onStart`** *(Function)*: A function that handles the message logic based on the context.

### Example

```javascript
const { EasyGoat } = require("easy-goat");

module.exports = EasyGoat({
  name: 'greet',
  category: 'Fun',
  cooldown: 10,
  author: 'Liane Cagara',
  description: 'Sends a greeting message.',
  args: {
    name: 'Hello, {name}!',
    uid({ print, event }) {
      print('Your ID is {uid}.');
    }
  },
  //text: 'Default greeting message.',
  async command({ print }) {
    print('Custom command result.');
  }
});
```

```javascript
const { EasyGoat } = require("easy-goat");

module.exports = EasyGoat({
  name: "greet",
  author: "Liane",
  description: "Greet kita uwu",
  text: "Hello {mention}, kamusta kana? Have a good day."
});
```

## `args` Property

The `args` property allows for dynamic handling of command arguments. It is an object where:

- **Keys** represent argument names.
- **Values** define how the argument is processed.

Each value in `args` can be:

- **`String`**: A static message template that may contain placeholders like `{name}` or `{uid}`. These placeholders are replaced with actual values when generating the message.

- **`Function`**: A function that receives the context object and returns a string or a promise that resolves to a string. This function can be used for more complex argument processing.

### Example

```javascript
args: {
  'user': 'Hello, {name}!',
  'id': async (ctx) => `Your ID is ${ctx.event.senderID}.`
}
```

In this example:
- If the argument `user` is used, the handler replaces `{name}` with the user's name.
- If the argument `id` is used, the handler dynamically returns the user's ID.

## Error Handling

- Throws a `TypeError` if `ctx` is not a valid type (i.e., neither an object, string, nor function).

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
