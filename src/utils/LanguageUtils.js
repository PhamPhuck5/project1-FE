import messages_vi from "../translations/vi.json";
import messages_en from "../translations/en.json";

const flattenMessages = (nestedMessages = {}, prefix = "") =>
  Object.entries(nestedMessages).reduce((acc, [key, value]) => {
    const prefixedKey = prefix ? `${prefix}.${key}` : key;

    if (typeof value === "string") {
      acc[prefixedKey] = value;
    } else {
      Object.assign(acc, flattenMessages(value, prefixedKey));
    }

    return acc;
  }, {});

const messages = {
  vi: flattenMessages(messages_vi),
  en: flattenMessages(messages_en),
};

export default class LanguageUtils {
  static getMessageByKey(key, lang) {
    return messages[lang][key];
  }

  static getFlattenedMessages() {
    return messages;
  }
}
