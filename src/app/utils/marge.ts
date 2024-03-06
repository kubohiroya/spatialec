type JsonValue =
  | string
  | number
  | boolean
  | { [key: string]: JsonValue }
  | JsonValue[];

export function mergeDeep(
  target: Record<string, any>,
  source: Record<string, any>
) {
  const output = Object.assign({}, target);
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach((key) => {
      if (isObject(source[key])) {
        if (!(key in target)) {
          Object.assign(output, { [key]: source[key] });
        } else {
          output[key] = mergeDeep(target[key], source[key]);
        }
      } else {
        Object.assign(output, { [key]: source[key] });
      }
    });
  }
  return output;
}

function isObject(item: JsonValue): boolean {
  return !!item && typeof item === 'object' && !Array.isArray(item);
}

// 元の階層的なJSONオブジェクト
const originalJson = {
  user: {
    name: 'John Doe',
    age: 30,
    address: {
      city: 'New York',
      country: 'USA',
    },
  },
  settings: {
    theme: 'dark',
    notifications: true,
  },
};
