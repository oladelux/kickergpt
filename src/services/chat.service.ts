import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

class ChatService {
  private mockResponses = [
    'Based on recent matches, I recommend focusing on midfielder performance metrics.',
    'The team formation analysis shows a 4-3-3 would be optimal for the upcoming match.',
    'Player fatigue levels indicate rotation is needed in the next 2 games.',
    'Statistical analysis suggests improving defensive transitions.',
  ];

  sendMessage(message: string): Observable<ChatMessage> {
    const randomResponse =
      this.mockResponses[Math.floor(Math.random() * this.mockResponses.length)];

    return of({
      id: Math.random().toString(),
      role: 'assistant' as const,
      content: randomResponse,
      timestamp: new Date(),
    }).pipe(delay(1500));
  }

  getChatHistory(): Observable<ChatMessage[]> {
    const mockHistory: ChatMessage[] = [
      {
        id: '1',
        role: 'user',
        content: 'What are the key stats from our last match?',
        timestamp: new Date(Date.now() - 3600000),
      },
      {
        id: '2',
        role: 'assistant',
        content:
          'In your last match, possession was 58%, shots on target 7, and pass accuracy 84%.',
        timestamp: new Date(Date.now() - 3500000),
      },
    ];

    return of(mockHistory).pipe(delay(500));
  }
}

export const chatService = new ChatService();
