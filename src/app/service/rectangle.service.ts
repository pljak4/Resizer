import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { RectangleDimensions } from '../utility/utils';

@Injectable({
  providedIn: 'root',
})
export class RectangleService {
  // I could import this from utils if I had base url api key, but there is no need for it for this task ...
  private apiUrl = 'https://localhost:5001/rectangle';

  constructor(private http: HttpClient) {}

  getRectangleDimensions(): Observable<RectangleDimensions> {
    return this.http.get<RectangleDimensions>(this.apiUrl).pipe(
      catchError((error) => {
        console.error('Error fetching rectangle dimensions:', error);
        return of({
          x: 50,
          y: 50,
          width: 50,
          height: 100,
        });
      })
    );
  }

  updateRectangleDimensions(dimensions: RectangleDimensions): Observable<any> {
    return this.http.put(this.apiUrl, dimensions);
  }
}
