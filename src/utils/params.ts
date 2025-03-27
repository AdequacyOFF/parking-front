export const removeParam = (params: any, removeParam: string[]) => {
  return Object.keys(params).reduce((prev, curr) => {
    if (!removeParam.includes(curr)) {
      return {...prev, [curr]: params[curr]};
    } else {
      return {...prev};
    }
  }, {});
};

export const fromFormFieldsArrayToObject = (formFields: {name: string; value: string}[]) => {
  return formFields.reduce((prev, curr) => ({...prev, [curr.name]: curr.value}), {});
};

export const objectToParamString = (obj: any) => {
  let paramsStr = '';
  let paramsStrArr: string[] = [];

  Object.keys(obj).forEach((key) => {
    if (Array.isArray(obj[key])) {
      if (obj[key].length !== 0) {
        // result += obj[key].map((arrItem: any) => `${key}=${arrItem}`).join('&');
        paramsStrArr = paramsStrArr.concat(
          obj[key].map((arrItem: any) => `${key}=${encodeURIComponent(arrItem)}`),
        );
      }
    } else {
      if (obj[key] || obj[key] === true || obj[key] === false) {
        paramsStrArr.push(`${key}=${encodeURIComponent(obj[key])}`);
      }
    }
  });

  if (paramsStrArr.length !== 0) {
    paramsStr = '?' + paramsStrArr.join('&');
  }

  return paramsStr;
};

export const searchParamsToObject = (searchParams: string) => {
  if (!searchParams) return {};
  return JSON.parse(
    '{"' +
      decodeURIComponent(searchParams.startsWith('?') ? searchParams.slice(1) : searchParams)
        .replace(/"/g, '\\"')
        .replace(/&/g, '","')
        .replace(/=/g, '":"') +
      '"}',
  );
};

export const searchParamsToObjectWithRepeated = (searchParams: string) => {
  if (!searchParams) return {};

  const result = {};
  let newSearchParams = decodeURIComponent(
    searchParams.startsWith('?') ? searchParams.slice(1) : searchParams,
  );
  newSearchParams.split('&').forEach((param) => {
    const [key, value] = param.split('=');

    if (Object.keys(result).includes(key)) {
      // @ts-ignore
      result[key] = [...(Array.isArray(result[key]) ? result[key] : [result[key]]), value];
    } else {
      if (value === "true" || value === "false") {
        // @ts-ignore
        result[key] = value === "true" ? true : false;
      } else {
        // @ts-ignore
        result[key] = value;
      }
    }
  });

  return result;
};
