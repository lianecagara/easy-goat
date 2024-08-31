function isString(value) {
  return typeof value === 'string';
}

function isFunction(value) {
  return typeof value === 'function';
}

function isObject(value) {
  return value && typeof value === 'object' && !Array.isArray(value);
}

function EasyGoat(ctx = {}) {
  if (isString(ctx)) {
    ctx = { text: ctx };
  } else if (isFunction(ctx)) {
    ctx = { command: ctx };
  } else if (!isObject(ctx)) {
    throw new TypeError('Invalid context type');
  }

  let {
    name = "noname",
    category = "Uncategorized",
    cooldown = 5,
    author = "Not Specified",
    description = "No description provided",
    args: argRep = {},
    config = {},
    text = "Please configure the .text property in EasyGoat as String.",
    command = null,
  } = ctx;

  config = {
    name: Array.isArray(name) ? name[0] : name,
    role: 0,
    category,
    shortDescription: { en: description },
    longDescription: { en: description },
    author,
    aliases: Array.isArray(name) ? name.slice(1) : [],
    countDown: cooldown,
    ...config,
  };

  async function EasyGoatResult(context) {
    let mentions = [];
    const { message, event, api, args, usersData } = context;

    const print = async (...texts) => {
      texts = texts.flat();
      texts = texts.map(i => {
        if (isObject(i)) {
          return i.toString() !== ({}).toString() ? i.toString() : JSON.stringify(i, null, 2);
        }
        return String(i);
      });
      let str = texts.join(" ");

      if (str.includes("{name}")) {
        const userData = await usersData.get(event.senderID);
        str = str.replaceAll("{name}", userData.name);
      }
      str = str.replaceAll("{uid}", event.senderID);
      if (str.includes("{mention}")) {
        const { name } = await usersData.get(event.senderID);
        str = str.replaceAll("{mention}", `@${name}`);
        mentions.push({ tag: `@${name}`, id: event.senderID });
      }

      return api.sendMessage({
        body: str,
        mentions,
      }, event.threadID, event.messageID);
    };

    const newCtx = { ...ctx, print };

    async function getPrint(func) {
      if (isString(func)) {
        func = () => String(func);
      } else if (!isFunction(func)) {
        throw new TypeError('Argument must be a function or string');
      }
      return await func(newCtx);
    }

    let hasArgUsed = false;

    async function handleArgs(rep, deg = 0) {
      if (isObject(rep) && args[deg] in rep) {
        const handler = rep[args[deg]];
        if (isObject(handler)) {
          return handleArgs(handler, deg + 1);
        }
        const r = await getPrint(handler);
        await print(r);
        hasArgUsed = true;
      }
    }

    await handleArgs(argRep, 0);

    if (Object.keys(argRep).length > 0 && hasArgUsed) {
      return;
    }

    if (command) {
      const txtRes = await command(newCtx);
      if (txtRes) {
        return print(txtRes);
      }
    }

    if (text) {
      return print(text);
    }
  }

  return {
    config,
    onStart: (...args) => EasyGoatResult(...args),
  };
}

module.exports = {
  EasyGoat,
};
