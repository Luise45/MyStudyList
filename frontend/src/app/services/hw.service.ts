import {Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Hw } from '../models/hw.model'; //import of da model


@Injectable({


    providedIn:'root' //available for all

})

export class HwService{
    private apiUrl = 'http://localhost:5000/api/'; 
    constructor(private http: HttpClient){}


    //alle Eintraege 

    getHws(): Observable<Hw[]>{
        return this.http.get<Hw[]>(this.apiUrl+'hws');
    }

    // Eintrag erstellen

    createHw(hw: FormData): Observable<any> {
        return this.http.post(this.apiUrl + 'hws', hw);
      }
      
   // Eintrag mit Id erhalten

    getHwById(id: string): Observable<Hw>{

        return this.http.get<Hw>(`${this.apiUrl}hws/${id}`);
    }


    //Eintrag loeschen

    deleteHw(id: string):Observable<any>{

        return this.http.delete(`${this.apiUrl}hws/${id}`);
    }

}