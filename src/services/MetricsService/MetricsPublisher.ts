import {log} from 'shared/logging/config';

import {Metric} from './Metric';
import {MetricsStorageWriter} from './MetricsStorage';

export interface MetricsPublisher {
  publish(metrics: Metric[]): Promise<void>;
}

export class DefaultMetricsPublisher implements MetricsPublisher {
  private metricsStorage: MetricsStorageWriter;

  constructor(metricsStorage: MetricsStorageWriter) {
    this.metricsStorage = metricsStorage;
  }

  publish(metrics: Metric[]): Promise<void> {
    log.debug({
      category: 'debug',
      message: 'publishing new metric',
      payload: metrics,
    });
    return this.metricsStorage.save(metrics);
  }
}
