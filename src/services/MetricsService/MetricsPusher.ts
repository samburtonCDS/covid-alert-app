import {log} from 'shared/logging/config';
import {METRICS_URL} from 'env';

export enum MetricsPusherResult {
  Success,
  Error,
}

export interface MetricsPusher {
  push(): Promise<MetricsPusherResult>;
}

export class DefaultMetricsPusher implements MetricsPusher {
  private jsonAsString: string;

  constructor(jsonAsString: string) {
    this.jsonAsString = jsonAsString;
  }

  push(): Promise<MetricsPusherResult> {
    log.debug({
      category: 'debug',
      message: 'pushing metrics',
      payload: this.jsonAsString,
    });
    return fetch(METRICS_URL, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: this.jsonAsString,
    })
      .then(response => response.json())
      .then(json => {
        log.debug({
          category: 'debug',
          message: 'metrics endpoint response',
          payload: json,
        });
        return MetricsPusherResult.Success;
      })
      .catch(() => {
        return MetricsPusherResult.Error;
      });
  }
}
