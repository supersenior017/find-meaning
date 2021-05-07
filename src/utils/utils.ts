/* eslint-disable prefer-const */
import throttle from 'lodash/throttle';
import store from 'store2';
import Axios, { AxiosResponse } from 'axios';
export type keyQueryT = 'urban' | 'lingua' | 'giphy';
//--------------------------------------1
export const fetcher_post = async (
  query: string,
  keyQuery: keyQueryT,
): Promise<any> => {
  let promise;
  try {
    promise = await Axios({
      url: '/api/handlers',
      method: 'POST',
      data: {
        query,
        keyQuery,
      },
    });
    return promise;
  } catch (error) {
    console.error(error);
  }
};
//--------------------------------------2
interface HeaderParamsT {
  [key: string]: string;
}
interface FetcherGetParams {
  url: string;
  headers?: HeaderParamsT;
  params?: HeaderParamsT;
}
export const fetcher_get = async (config: FetcherGetParams): Promise<any> => {
  const { url, headers, params } = config;
  return await Axios({
    url: url,
    method: 'GET',
    headers: headers || {},
    params,
  })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error(error);
    });
};
//--------------------------------------3-compare
const compare = (a, b) => {
  a = a.w;
  b = b.w;
  return a < b ? -1 : a > b ? 1 : 0;
};
//--------------------------------------4-getSuggestion
export const getSuggestions = (
  key: string,
  inputValue: string,
): Suggestion[] => {
  let list = store.get(key) || [];
  inputValue = inputValue.trim().toLowerCase();
  if (inputValue === '' && list.length > 7) {
    list = list.slice(Math.max(list.length - 7, 1)).reverse();
    return list;
  }
  list = list.filter((o) => o?.w.startsWith(inputValue)).sort(compare);
  if (list.length > 7) {
    list = list.slice(Math.max(list.length - 7, 1)).reverse();
  }
  return list.reverse();
};
//--------------------------------------4-1-throttledGetSuggestion
export const throttledGetSuggestions = throttle(getSuggestions, 5);
//--------------------------------------5-storeSuggestion
interface Suggestion {
  w: string;
}
export const storeSuggestion = (
  key: string,
  inputValue: string,
): never | Suggestion[] => {
  inputValue = inputValue.trim().toLowerCase();
  // conditions to store query
  // it doesn't return error or empty response -urban or wiktionary

  // check if existed
  let list = getSuggestions(key, inputValue).filter((o) => o?.w === inputValue);
  if (list.length === 0) {
    store.add(key, [{ w: inputValue }]);
  }
  // update list value
  list = getSuggestions(key, inputValue).filter((o) => o?.w === inputValue);
  // make sure the query is stored
  if (list.length === 1) {
    return list;
    // throw error when query isn't stored
  } else if (list.length === 0) {
    throw Error(
      `>> storeSuggestions: ${inputValue} could not been stored in localStorage`,
    );
  } else {
    throw Error(
      '>> storeSuggestions: the returned list length has neiter 0 nor 1 value',
    );
  }
};
//--------------------------------------types
type partOfSpeechT = 'verb' | 'noun' | 'adjective' | 'adverb' | 'preposition';
// interface WFormT {
//   form: partOfSpeechT; // "noun" OR "adjective"
//   list: string[]; // e.x ["car","cars"] OR ["",""]
// }

export interface Upcomming {
  w: string;
  partOfSpeechList: partOfSpeechT[];
  // wForms: WFormT[];
}

export const initialSuggestions = [
  { w: 'apple' },
  { w: 'auto' },
  { w: 'answer' },

  { w: 'bubble' },
  { w: 'boom' },
  { w: 'basic' },

  { w: 'caramel' },
  { w: 'clean' },
  { w: 'course' },

  { w: 'dice' },
  { w: 'dream' },
  { w: 'drama' },

  { w: 'eat' },
  { w: 'euro' },
  { w: 'example' },

  { w: 'fire' },
  { w: 'form' },
  { w: 'father' },

  { w: 'game' },
  { w: 'gas' },
  { w: 'goal' },

  { w: 'hammer' },
  { w: 'hire' },
  { w: 'hover' },

  { w: 'ice' },
  { w: 'iron' },
  { w: 'icon' },

  { w: 'java' },
  { w: 'jam' },
  { w: 'judgment' },

  { w: 'kiwi' },
  { w: 'keen' },
  { w: 'knife' },

  { w: 'loop' },
  { w: 'lose' },
  { w: 'lamp' },

  { w: 'mean' },
  { w: 'moon' },
  { w: 'mouth' },

  { w: 'network' },
  { w: 'notion' },
  { w: 'nation' },

  { w: 'opera' },
  { w: 'on' },
  { w: 'open' },

  { w: 'peans' },
  { w: 'possible' },
  { w: 'public' },

  { w: 'quote' },
  { w: 'quite' },
  { w: 'quit' },

  { w: 'run' },
  { w: 'room' },
  { w: 'rain' },

  { w: 'summer' },
  { w: 'sun' },
  { w: 'sunny' },

  { w: 'tired' },
  { w: 'tire' },
  { w: 'tour' },

  { w: 'user' },
  { w: 'under' },
  { w: 'use' },

  { w: 'very' },
  { w: 'volleyball' },
  { w: 'vice' },

  { w: 'wire' },
  { w: 'worn' },
  { w: 'warm' },

  { w: 'xenon' },
  { w: 'xerox' },
  { w: 'xanthine' },

  { w: 'year' },
  { w: 'yield' },
  { w: 'you' },

  { w: 'zoo' },
  { w: 'zombie' },
  { w: 'zebra' },
];
//--------------------------------------fetcher_post
interface DataPost {
  [key: string]: any;
}
export const fetcherPost = async (
  url: string,
  data: DataPost,
): Promise<AxiosResponse> => {
  let promise;
  try {
    promise = await Axios({
      url: url,
      method: 'POST',
      data,
    });
    return promise;
  } catch (error) {
    console.error(error);
  }
};

/**
 * HOW TO GET CONJUGATED FORMS
 * first check IF query is a verb,
 *    WHEN true => call the API ELSE do not call
 * second check IF there are conjugated forms to the query,
 *    WHEN true => assign the results to the response obj ELSE: do not
 */
//--------------------------------------conjugated-forms-API -> isVerb
export const isVerb = (lingua: any = {}): boolean => {
  let isVerb = false;
  lingua.entries[0].lexemes.map((o) => {
    if (o.partOfSpeech === 'verb') {
      isVerb = true;
      return isVerb;
    }
  });
  return isVerb;
};
//--------------------------------------conjugated-forms-API -> getContinousForm
export const getContinousForm = async (
  conjugatedForms: any = {},
): Promise<string> => {
  const continousForm = conjugatedForms.conjugation_tables.indicative.filter(
    (o) => o.heading === 'present progressive',
  );
  const formStr = continousForm[0].forms[0][1]
    .split(' ')
    .slice(continousForm.length)[0];
  return formStr;
};
