import { profanity } from "@2toad/profanity";

export function lowercaseFirstLetter(email: string): string {
  if (!email || typeof email !== "string") {
    throw new Error("Invalid email address");
  }

  const [username, domain] = email.split("@");

  if (!username || !domain) {
    throw new Error("Invalid email address format");
  }

  const modifiedUsername = username
    .split(".")
    .map((part, index) =>
      index === 0
        ? part.toLowerCase()
        : part.charAt(0).toLowerCase() + part.slice(1)
    )
    .join(".");

  return modifiedUsername + "@" + domain;
}

export const toCamel = (o: any): any => {
  var newO: any, origKey: string, newKey: string, value: any;
  if (o instanceof Array) {
    return o.map(function (value) {
      if (typeof value === "object") {
        value = toCamel(value);
      }
      return value;
    });
  } else {
    newO = {};
    for (origKey in o) {
      if (o.hasOwnProperty(origKey)) {
        newKey = (
          origKey.charAt(0).toLowerCase() + origKey.slice(1) || origKey
        ).toString();
        value = o[origKey];
        if (
          value instanceof Array ||
          (value !== null && value.constructor === Object)
        ) {
          value = toCamel(value);
        }
        newO[newKey] = value;
      }
    }
  }
  return newO;
};

export const getAllBadWords = (sentence: string) => {
  const splitter = sentence.split(" ");
  const badWordsList = [];

  for (let i = 0; i < splitter.length; i++) {
    const word = splitter[i];
    if (profanity.exists(word)) {
      badWordsList.push(word);
    }
  }

  console.log(badWordsList);
  return badWordsList;
};

export const getRandomPhotoUrl = (randomId: number) => {
  return `https://api.slingacademy.com/public/sample-photos/${randomId}.jpeg`;
};
