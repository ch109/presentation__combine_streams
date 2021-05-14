import { Component, OnDestroy, OnInit } from '@angular/core';
import { GetStuffService } from '../core/get-stuff.service';
import { map, switchMap, tap } from 'rxjs/operators';
import { combineLatest, forkJoin, Observable, of, Subscription, zip } from 'rxjs';

@Component({
  selector: 'app-p1',
  templateUrl: './p1.component.html',
  styleUrls: ['./p1.component.scss'],
})
export class P1Component implements OnInit, OnDestroy {

  resultCat: string | ArrayBuffer;
  catSub: Subscription;

  tagsCache: string[];
  texts = ['Yolo', 'W11K', 'OMG', 'Lolz'];
  randomTag: string;
  randomText: string;
  randomCat: Blob;

  constructor(private getStuff: GetStuffService) {
  }

  ngOnInit(): void {
    this.catSub = this.getMeSomeCat().subscribe();
  }

  ngOnDestroy(): void {
    if (this.catSub) {
      this.catSub.unsubscribe();
    }
  }

  /**
   * Just a standard request to get you started.
   */
  private getMeSomeCat(): Observable<Blob> {
    return this.getStuff.getCat()
      .pipe(
        tap(cat =>
          this.createImageFromBlob(cat, result => this.resultCat = result)
        ),
      );
  }

  /**
   * Anti pattern 1
   * ==============
   * Probably the most infamous error there is in reactive coding.
   */
  // private getMeSomeCat(): Observable<Blob> {
  //
  //   this.getStuff.getAllTags()
  //     .subscribe((tags: string) => {
  //       const randomTag = tags[this.getRandomInt(tags.length)];
  //
  //       console.log('randomTag =', randomTag); // DEBUG
  //
  //       // OMG!
  //       this.getStuff.getCatByTag(randomTag)
  //         .subscribe(cat =>
  //           this.createImageFromBlob(cat, result => this.resultCat = result)
  //         );
  //     });
  //
  //   return of();
  // }

  /**
   * Antipattern 1,5
   * ===============
   * A version of the above anti pattern you'll most likely get to encounter in your everyday work life.
   */
  // private getMeSomeCat(): Observable<Blob> {
  //
  //   this.getStuff.getAllTags()
  //     .subscribe((tags: string) => {
  //       const randomTag = tags[this.getRandomInt(tags.length)];
  //
  //       this.someUnremarkableFunction(randomTag);
  //     });
  //
  //   return of();
  // }

  /**
   * FIX: Antipattern 1
   * ==================
   * This is how you should avoid inner subscriptions.
   *
   * If you wonder what the `switchMap` is all about, watch this:
   *  https://www.youtube.com/watch?v=rUZ9CjcaCEw&t=4s
   */
  // private getMeSomeCat(): Observable<Blob> {
  //   return this.getStuff.getAllTags()
  //     .pipe(
  //       map((tags: string[]) => tags[this.getRandomInt(tags.length)]),
  //       switchMap(randomTag => this.getStuff.getCatByTag(randomTag)),
  //       tap(cat => this.createImageFromBlob(cat, result => this.resultCat = result)),
  //     );
  // }

  /**
   * Antipattern 2
   * =============
   * Keeping a state outside of your asynchronous code is a bad idea. It might break at any time.
   */
  // private getMeSomeCat(): Observable<Blob> {
  //   return this.getStuff.getAllTags()
  //     .pipe(
  //       tap((tags: string[]) => this.tagsCache = tags),
  //       tap(() => {
  //         this.randomTag = this.tagsCache[this.getRandomInt(this.tagsCache.length)];
  //         this.randomText = this.texts[this.getRandomInt(this.texts.length)];
  //       }),
  //       switchMap(() => this.getStuff.getCatByTagSaysText(this.randomTag, this.randomText)
  //         .pipe(tap(catBlob => this.randomCat = catBlob))),
  //       tap(() =>
  //         this.createImageFromBlob(this.randomCat, result => this.resultCat = result)
  //       ),
  //     );
  // }

  /**
   * (1) FIX: Antipattern 2
   * ======================
   * You can pipe multiple results through your streams simply by putting them in an array.
   */
  // private getMeSomeCat(): Observable<Blob> {
  //   return this.getStuff.getAllTags()
  //     .pipe(
  //       map((tags: string[]) => [
  //         tags[this.getRandomInt(tags.length)],
  //         this.texts[this.getRandomInt(this.texts.length)],
  //       ]),
  //       switchMap(([tag, text]) => this.getStuff.getCatByTagSaysText(tag, text)),
  //       tap(cat => this.createImageFromBlob(cat, result => this.resultCat = result)),
  //     );
  // }

  /**
   * (2) FIX: Antipattern 2
   * ======================
   * If an array isn't sufficient enough, RxJS gives you operators which can combine values for you.
   *
   * Here are the most helpful I encountered so far (IMHO):
   *  `combineLatest`:
   *    When any observable emits a value, emit the last emitted value from each.
   *    Read more: https://www.learnrxjs.io/learn-rxjs/operators/combination/combinelatest
   *  `zip`:
   *    After all observables emit, emit values as an array.
   *    Read more: https://www.learnrxjs.io/learn-rxjs/operators/combination/zip
   *  `forkJoin`:
   *    When all observables complete, emit the last emitted value from each.
   *    Read more: https://www.learnrxjs.io/learn-rxjs/operators/combination/forkjoin
   *
   * This is a very helpful graphic which shows the difference between `zip` and `combineLatest`:
   *  https://reactive.how/combinelatest
   */
  // private getMeSomeCat(): Observable<Blob> {
  //   return this.getStuff.getAllTags()
  //     .pipe(

  //       // switchMap((tags: string[]) =>
  //       //   combineLatest([
  //       //     of(tags[this.getRandomInt(tags.length)]), // Reactive-Store
  //       //     of(this.texts[this.getRandomInt(this.texts.length)]), // Reactive-Store
  //       //   ]
  //       // )),

  //       // switchMap((tags: string[]) =>
  //       //   zip(
  //       //       of(tags[this.getRandomInt(tags.length)]), // HTTP-Call
  //       //       of(this.texts[this.getRandomInt(this.texts.length)]), // Reactive-Store
  //       //   )),

  //       switchMap((tags: string[]) =>
  //         forkJoin([
  //           of(tags[this.getRandomInt(tags.length)]), // HTTP-Call
  //           of(this.texts[this.getRandomInt(this.texts.length)]), // HTTP-Call
  //         ])),

  //       switchMap(([tag, text]) => this.getStuff.getCatByTagSaysText(tag, text)),
  //       tap(cat => this.createImageFromBlob(cat, result => this.resultCat = result)),
  //     );
  // }

  private getRandomInt(max: number): number {
    return Math.floor(Math.random() * max);
  }

  private someUnremarkableFunction(randomTag: string): void {
    // OMG!!!!11
    this.getStuff.getCatByTag(randomTag)
      .subscribe(cat =>
        this.createImageFromBlob(cat, result => this.resultCat = result)
      );
  }

  private createImageFromBlob(image: Blob, assignFn: (r) => void): void {
    const reader = new FileReader();
    reader.addEventListener('load', () => assignFn(reader.result), false);
    if (image) {
      reader.readAsDataURL(image);
    }
  }

}
