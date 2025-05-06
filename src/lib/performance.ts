interface PerformanceMetric {
  name: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  data?: any;
}

class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, PerformanceMetric[]> = new Map();
  private readonly maxMetrics = 100;

  private constructor() {}

  public static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  private getNow(): number {
    // Use Date.now() as a fallback if performance.now() is not available
    if (typeof performance !== 'undefined' && performance.now) {
      return performance.now();
    }
    return Date.now();
  }

  public startMetric(name: string, data?: any): string {
    const id = `${name}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const metric: PerformanceMetric = {
      name,
      startTime: this.getNow(),
      data
    };

    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }

    const metrics = this.metrics.get(name)!;
    metrics.push(metric);

    // Keep metrics under limit
    if (metrics.length > this.maxMetrics) {
      metrics.shift();
    }

    return id;
  }

  public endMetric(name: string, id: string): number {
    const metrics = this.metrics.get(name);
    if (!metrics) return 0;

    const metric = metrics.find(m => m.startTime.toString() === id.split('-')[1]);
    if (!metric) return 0;

    metric.endTime = this.getNow();
    metric.duration = metric.endTime - metric.startTime;

    return metric.duration;
  }

  public getMetrics(name?: string): PerformanceMetric[] {
    if (name) {
      return this.metrics.get(name) || [];
    }

    return Array.from(this.metrics.values()).flat();
  }

  public getAverageMetric(name: string): number {
    const metrics = this.metrics.get(name);
    if (!metrics || metrics.length === 0) return 0;

    const completedMetrics = metrics.filter(m => m.duration !== undefined);
    if (completedMetrics.length === 0) return 0;

    const total = completedMetrics.reduce((sum, m) => sum + (m.duration || 0), 0);
    return total / completedMetrics.length;
  }

  public clearMetrics(): void {
    this.metrics.clear();
  }
}

export const performance = PerformanceMonitor.getInstance();