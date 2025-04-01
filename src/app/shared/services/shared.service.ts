import { HttpClient } from "@angular/common/http";
import { Injectable, OnInit } from "@angular/core";
import { from, map, Observable, of, switchMap, tap } from 'rxjs';
import { environments } from '../../../environments/environments';
import { IUbication } from "../../common/interfaces";
import stringSimilarity from "string-similarity";

export interface Region {
  id: number,
  name: string
}

@Injectable({
  providedIn: 'root'
})
export class SharedService{

  regions: Region[] = []
  currentRegion!: string;
  currentRegionSession!: string;
  userCurrentRegion!: string;

  private baseUrl: string = environments.baseUrl;

  constructor(private http: HttpClient) {}

  public getAllRegions(): Observable<Region[]>{
    return this.http.get<Region[]>(`${this.baseUrl}/region`)
  }

  public get currentUserRegion(){
    return this.userCurrentRegion;
  }

  public get allRegions(): Region[]{
    return localStorage.getItem("regions") ? JSON.parse(localStorage.getItem("regions")!) : []
  }

  public getUbicationByGeoCode(lat: number, lng: number): Observable<IUbication>{
    return this.http.get<IUbication>(`${environments.urlGeoCode}reverse?lat=${lat}&lon=${lng}&api_key=${environments.apiKeyGeoCode}`)
  }

  getUserLocation(): Observable<string> {

    return new Observable<GeolocationPosition>(observer => {

      navigator.geolocation.getCurrentPosition(position =>
        observer.next(position),
        error => observer.error(error));
    }).pipe(
      switchMap( position => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        console.log('Obteniendo latitud y longitud: ', lat, lng);

        return this.getUbicationByGeoCode(lat, lng);
      }),
      tap(response => console.log(response)),
      map(response => {
        const allRegionsName = this.allRegions.map(region => region.name);
        const similarRegion = this.findSimilarityRegion(allRegionsName, response.address.state);

        this.userCurrentRegion = similarRegion;
        return this.userCurrentRegion;
      })

    )

  }

  findSimilarityRegion(array: string[], value: string): string {

    const result = stringSimilarity.findBestMatch(value!, array);

    const bestMatch = result.bestMatch;
    return bestMatch.target;

  }

}
