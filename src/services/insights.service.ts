import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

export interface Insight {
  id: string;
  title: string;
  content: string;
  tags: string[];
  date: Date;
}

class InsightsService {
  private mockInsights: Insight[] = [
    {
      id: '1',
      title: 'Midfield Performance Analysis',
      content: 'Detailed analysis of midfield passing patterns and defensive contributions.',
      tags: ['tactics', 'midfield', 'analysis'],
      date: new Date(Date.now() - 86400000),
    },
    {
      id: '2',
      title: 'Formation Optimization Report',
      content: 'Statistical breakdown of 4-3-3 vs 4-4-2 formation effectiveness.',
      tags: ['formation', 'tactics', 'stats'],
      date: new Date(Date.now() - 172800000),
    },
    {
      id: '3',
      title: 'Player Fatigue Metrics',
      content: 'Weekly fatigue tracking and rotation recommendations.',
      tags: ['fitness', 'rotation', 'health'],
      date: new Date(Date.now() - 259200000),
    },
  ];

  getInsights(): Observable<Insight[]> {
    return of(this.mockInsights).pipe(delay(500));
  }

  saveInsight(data: {
    title: string;
    content: string;
    tags: string[];
  }): Observable<Insight> {
    const newInsight: Insight = {
      id: Math.random().toString(),
      title: data.title,
      content: data.content,
      tags: data.tags,
      date: new Date(),
    };

    this.mockInsights.unshift(newInsight);
    return of(newInsight).pipe(delay(800));
  }

  deleteInsight(id: string): Observable<void> {
    this.mockInsights = this.mockInsights.filter((i) => i.id !== id);
    return of(void 0).pipe(delay(500));
  }
}

export const insightsService = new InsightsService();
