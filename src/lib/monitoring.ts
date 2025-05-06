import { logger } from './logger';
import { performance } from './performance';

interface MonitoringOptions {
  logPerformance?: boolean;
  logErrors?: boolean;
  logWarnings?: boolean;
}

const defaultOptions: MonitoringOptions = {
  logPerformance: true,
  logErrors: true,
  logWarnings: true
};

export const monitor = <T>(
  operation: () => Promise<T>,
  name: string,
  options: MonitoringOptions = defaultOptions
): Promise<T> => {
  const metricId = performance.startMetric(name);

  return operation()
    .then(result => {
      const duration = performance.endMetric(name, metricId);
      
      if (options.logPerformance) {
        logger.info(`Operation ${name} completed`, { duration });
      }
      
      return result;
    })
    .catch(error => {
      performance.endMetric(name, metricId);
      
      if (options.logErrors) {
        logger.error(`Operation ${name} failed`, { error });
      }
      
      throw error;
    });
};

export const monitorSync = <T>(
  operation: () => T,
  name: string,
  options: MonitoringOptions = defaultOptions
): T => {
  const metricId = performance.startMetric(name);

  try {
    const result = operation();
    const duration = performance.endMetric(name, metricId);
    
    if (options.logPerformance) {
      logger.info(`Operation ${name} completed`, { duration });
    }
    
    return result;
  } catch (error) {
    performance.endMetric(name, metricId);
    
    if (options.logErrors) {
      logger.error(`Operation ${name} failed`, { error });
    }
    
    throw error;
  }
};

// Performance monitoring hooks
export const usePerformanceMonitoring = () => {
  const startOperation = (name: string, data?: any) => {
    return performance.startMetric(name, data);
  };

  const endOperation = (name: string, id: string) => {
    return performance.endMetric(name, id);
  };

  const getMetrics = (name?: string) => {
    return performance.getMetrics(name);
  };

  const getAverageMetric = (name: string) => {
    return performance.getAverageMetric(name);
  };

  return {
    startOperation,
    endOperation,
    getMetrics,
    getAverageMetric
  };
};

// Error monitoring hooks
export const useErrorMonitoring = () => {
  const logError = (error: unknown, context?: string) => {
    logger.error(context || 'Error occurred', error);
  };

  const logWarning = (message: string, data?: any) => {
    logger.warn(message, data);
  };

  const getLogs = (level?: 'error' | 'warn') => {
    return logger.getLogs(level);
  };

  return {
    logError,
    logWarning,
    getLogs
  };
};