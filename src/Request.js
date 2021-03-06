export default class Request {
  constructor(msg, listener) {
    const message = {
      type: msg.type,
      subtype: msg.subtype,
      value: msg.value,
      timestamp: msg.timestamp,
      attachments: msg.attachments,
      file: msg.file
    };
    const from = msg.from;
    const to = msg.to;
    let params = {};
    let matches = [];

    if (msg.to) {
      switch (to.id.charAt(0).toLowerCase()) {
        case 'c':
          to.type = 'channel';
          break;
        case 'g':
          to.type = 'group';
          break;
        case 'd':
          to.type = 'dm';
          break;
        /* istanbul ignore next: */
        default:
          to.type = 'channel';
      }
    }

    if (message.type === 'message') {
      var text = message.subtype === 'file_share' ? message.file.title : message.value.text;
      params = getParams(text, listener.value, listener.matcher);

      // do not fill matches when params exist
      if (Object.keys(params).length === 0) {
        matches = getMatches(text, listener.matcher);
      }
    }

    this.message = message;
    this.from = from;
    this.to = to;
    this.params = params;
    this.matches = matches;
    this.listener = listener;
    this.attachments = message.attachments;
    this.file = message.file;
    this.subtype = message.subtype;

    Object.defineProperty(this, 'user', {
      enumerable: false,
      writable: false,
      value: this.from
    });

    Object.defineProperty(this, 'channel', {
      enumerable: false,
      writable: false,
      value: this.to
    });
  }
}

/**
 * @private
 * @param {string} text
 * @param {string|RegExp} value
 * @param {RegExp} matcher
 * @return {Object}
 */
function getParams(text, value, matcher) {
  const payload = {};

  if (value instanceof RegExp) {
    return payload;
  }

  let payloadList = value.match(/:[a-zA-Z]+/g);

  if (!payloadList) {
    return payload;
  }

  // remove leading ":" in named regex
  payloadList = payloadList.map(v => {
    return v.replace(/^:/, '');
  });

  for (let i = 0; i < payloadList.length; i++) {
    const regexIndex = `$${(i + 1)}`;
    const payloadName = payloadList[i];
    payload[payloadName] = text.replace(matcher, regexIndex);
  }

  return payload;
}

/**
 * @private
 * @param {string} text
 * @param {RegExp} matcher
 */
function getMatches(text, matcher) {
  const matches = text.match(matcher);

  // first regex match always return the message and we don't need it
  // we only care about other matches so we remove it from result
  matches.shift();

  return Array.prototype.slice.call(matches);
}
