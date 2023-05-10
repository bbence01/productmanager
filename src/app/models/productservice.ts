import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, combineLatest, forkJoin } from 'rxjs';
import { Product } from './product';
import { map, mergeMap, switchMap, tap } from 'rxjs/operators';
import { CommentP } from './comment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private productsUrl = 'https://dummyjson.com/products?limit=0';
  private commentsUrl = 'https://dummyjson.com/comments/';

  constructor(private http: HttpClient) { }
/*
  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.productsUrl).pipe(
      switchMap(products =>
        forkJoin(
          products.map(product =>
            this.http.get<Comment[]>(`${this.commentsUrl}?postId=${product.id}`).pipe(
              map(comments => {
                product.commentsprod = comments;
                return product;
              })
            )
          )
        ).pipe(map(products => products))

      )

    );

  }


*/




  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.productsUrl);
  }

  getComments(): Observable<CommentP[]> {
    return this.http.get<CommentP[]>(this.commentsUrl);
  }







  deleteProduct(id: number): Observable<any> {
    const url = `${this.productsUrl}/${id}`;
    return this.http.delete(url);
  }
}



