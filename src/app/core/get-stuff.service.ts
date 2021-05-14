import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

/**
 * GetStuffService
 * ===============
 * A simple, straight forward service to give you cat related content.
 * Makes use of CATAAS. Check it out at: https://cataas.com/
 */

enum CatApi {
  BaseURL = 'https://cataas.com',
  Tags = '/api/tags',
  Cat = '/cat',
  Gif = '/gif',
  Says = '/says'
}

@Injectable({
  providedIn: 'root',
})
export class GetStuffService {

  constructor(private http: HttpClient) {
  }

  /* IMG or GIF */

  getCat(): Observable<Blob> {
    return this.http.get(`${CatApi.BaseURL}${CatApi.Cat}`, { responseType: 'blob' });
  }

  getCatGif(): Observable<Blob> {
    return this.http.get(`${CatApi.BaseURL}${CatApi.Cat}${CatApi.Gif}`, { responseType: 'blob' });
  }

  getCatByTag(tag: string): Observable<Blob> {
    return this.http.get(`${CatApi.BaseURL}${CatApi.Cat}/${tag}`, { responseType: 'blob' });
  }

  getCatSaysText(text: string): Observable<Blob> {
    return this.http.get(`${CatApi.BaseURL}${CatApi.Cat}${CatApi.Says}/${text}`, { responseType: 'blob' });
  }

  getCatByTagSaysText(tag: string, text: string): Observable<Blob> {
    return this.http.get(`${CatApi.BaseURL}${CatApi.Cat}/${tag}${CatApi.Says}/${text}`, { responseType: 'blob' });
  }

  getCatSaysTextWithSizeAndColor(text: string, size: number, color: string): Observable<Blob> {
    return this.http.get(`${CatApi.BaseURL}${CatApi.Cat}${CatApi.Says}/${text}?size=${size}&color=${color}`, { responseType: 'blob' });
  }

  /* JSON */

  getCatAsJSON(): Observable<unknown> {
    return this.http.get(`${CatApi.BaseURL}${CatApi.Cat}?json=true`);
  }

  getAllTags(): Observable<unknown> {
    return this.http.get(`${CatApi.BaseURL}${CatApi.Tags}`);
  }

  getCatsByTagWithPagination(tags: string[], pagination?: [number, number]): Observable<unknown> {
    const onlyTags = `${CatApi.BaseURL}${CatApi.Tags}?tags=${tags.join(',')}`;
    const url = pagination?.length ? onlyTags.concat(`&skip=${pagination[0]}&limit=${pagination[1]}`) : onlyTags;
    return this.http.get(url);
  }

}
