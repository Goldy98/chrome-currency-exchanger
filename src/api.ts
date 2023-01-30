import { CurrencyKey } from "./constants/supported-currency";

const API_BASE_URL = "https://api.exchangerate.host";

const MAX_DECIMAL_COUNT = 2;

export type ConversionRequestPayload = {
  from: CurrencyKey;
  to: CurrencyKey;
  amount: number;
};

export interface SuccessApiCallResult<T> {
  success: true;
  data: T;
}

export interface ErrorApiCallResult {
  success: false;
  error?: any;
}

export type ApiCallResult<T> = SuccessApiCallResult<T> | ErrorApiCallResult;

export type ConversionResult = {
  usedRate: number;
  result: number;
};

type ApiRawConvertResult = {
  success: boolean;
  query: {
    from: CurrencyKey;
    to: CurrencyKey;
    amount: number;
  };
  info: {
    rate: number;
  };
  historical: boolean;
  date: string;
  result: number;
};

// API Response Sample
/**
 * {
 *   "motd": {
 *       "msg": "If you or your company use this project or like what we doing, please consider backing us so we can continue maintaining and evolving this project.",
 *       "url": "https://exchangerate.host/#/donate"
 *   },
 *   "success": true,
 *   "query": {
 *       "from": "USD",
 *       "to": "EUR",
 *       "amount": 5000
 *   },
 *   "info": {
 *       "rate": 0.943997
 *   },
 *   "historical": false,
 *   "date": "2022-12-18",
 *   "result": 4719.984408
 * }
 */

export class ApiClient {
  static async convert(
    payload: ConversionRequestPayload
  ): Promise<ApiCallResult<ConversionResult>> {
    try {
      const result = await fetch(this.#buildUrl(payload));

      const rawData: ApiRawConvertResult = await result.json();

      return {
        success: true,
        data: {
          result: +rawData.result.toFixed(MAX_DECIMAL_COUNT),
          usedRate: +rawData.info.rate.toFixed(MAX_DECIMAL_COUNT),
        },
      };
    } catch (error) {
      return {
        success: false,
        error,
      };
    }
  }

  static #buildUrl(payload: ConversionRequestPayload) {
    const { from, to, amount } = payload;
    return `${API_BASE_URL}/convert?from=${from}&to=${to}&amount=${amount}`;
  }
}
