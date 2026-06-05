import {Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Hw } from '../models/hw.model'; //import of da model


import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HwService {
  private apiUrl = `${environment.apiUrl}/api`;

  constructor(private http: HttpClient) {}

  getHws(): Observable<Hw[]> {
    return this.http.get<Hw[]>(`${this.apiUrl}/hws`);
  }

  createHw(hw: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/hws`, hw);
  }

  getHwById(id: string): Observable<Hw> {
    return this.http.get<Hw>(`${this.apiUrl}/hws/${id}`);
  }

  deleteHw(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/hws/${id}`);
  }
}
