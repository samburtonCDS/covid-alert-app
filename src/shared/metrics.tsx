import {log} from 'shared/logging/config';
import {
  useExposureStatus,
  ExposureStatusType,
  ExposureStatus,
  SystemStatus,
  useSystemStatus,
} from 'services/ExposureNotificationService';
import {useStorage} from 'services/StorageService';
import {useNotificationPermissionStatus} from 'screens/home/components/NotificationPermissionStatus';
import {LOGGLY_URL} from 'env';

const checkStatus = (exposureStatus: ExposureStatus): {exposed: boolean} => {
  if (exposureStatus.type === ExposureStatusType.Exposed) {
    return {exposed: true};
  }

  return {exposed: false};
};

export type EventType = 'installed' | 'onboarded' | 'exposed' | 'otk-no-date' | 'otk-with-date' | 'en-toggle';

interface Metric {
  identifier: string;
  timestamp: number;
  region: string | undefined;
}

interface OnboardedMetric extends Metric {
  pushnotification: string;
  frameworkenabled: boolean;
}

interface OTKMetric extends Metric {
  exposed: boolean;
}

interface EnToggleMetric extends Metric {
  state: boolean;
}

export const sendMetricEvent = (payload: any) => {
  if (LOGGLY_URL) {
    log.debug({category: 'metrics', message: payload.identifier, payload});
  }
};

export const useMetrics = () => {
  const exposureStatus = useExposureStatus();
  const {region, userStopped} = useStorage();
  const [systemStatus] = useSystemStatus();
  const [notificationStatus] = useNotificationPermissionStatus();

  const addEvent = (eventType: EventType) => {
    const initialPayload: Metric = {identifier: eventType, timestamp: new Date().getTime(), region};
    let payload: Metric | OnboardedMetric | OTKMetric | EnToggleMetric = {...initialPayload};

    switch (eventType) {
      case 'installed':
        break;
      case 'onboarded':
        payload = {
          ...initialPayload,
          pushnotification: notificationStatus,
          frameworkenabled: systemStatus === SystemStatus.Active,
        };
        break;
      case 'exposed':
        break;
      case 'otk-no-date':
        payload = {...checkStatus(exposureStatus), ...initialPayload};
        break;
      case 'otk-with-date':
        payload = {...checkStatus(exposureStatus), ...initialPayload};
        break;
      case 'en-toggle':
        payload = userStopped ? {...initialPayload, state: false} : {...initialPayload, state: true};
        break;
    }

    sendMetricEvent(payload);
  };

  return addEvent;
};
