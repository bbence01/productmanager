// app.component.ts
import { Component } from '@angular/core';
import { Product } from './models/product';
import { ProductService } from './models/productservice';
import { combineLatest, map, of } from 'rxjs';
import { CommentP } from './models/comment';
import { User } from './models/user';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  products: Array<Product> ;
  selectedProduct: Product | null = null;
  showAlert = false;
  title: any;

  editingComment: { [key: number]: boolean } = {}; // Add this line
  orderByDescending: boolean
  http: HttpClient
  comments: Array<CommentP>



  constructor(http: HttpClient, private productService: ProductService) {
    this.http = http
    this.comments = []
    this.orderByDescending = false
    this.getAllComments()
    this.products = []
    this.getAllProduct()
    this.pairCommentsAndProducts()
  }


  public getAllComments() {
    this.http.get<any>('https://dummyjson.com/comments')
    .subscribe(resp => {
      resp.comments.map((x:any) => {

        let c = new CommentP()

        c.id = x.id
        c.body = x.body
        c.postId = x.postId
        c.user = new User()
        c.user.id = x.user.id
        c.user.username = x.user.username

        this.comments.push(c)
      })
    })
  }

  public getAllProduct() {
    this.http.get<any>('https://dummyjson.com/products?limit=0')
    .subscribe(resp => {
      resp.products.map((x:any) => {

        let u = new Product()

        u.id = x.id
        u.title = x.title
        u.description = x.description
        u.discountPercentage = x.discountPercentage
        u.price = x.price
        u.rating = x.rating
        u.stock = x.stock
        u.brand = x.brand
        u.category = x.category
        u.thumbnail = x.thumbnail
        u.images = x.images

        const coment = this.comments.find(c => c.postId === u.id)
        if(coment != undefined)
        {
        u.commentsprods.push(coment)
        }


        this.products.push(u)
      })
    })
  }

  private pairCommentsAndProducts() {
    if (this.products.length > 0 && this.comments.length > 0) {
      this.comments.forEach(comment => {
        console.log('Ingredient:', comment);
        const product = this.products.find(product => product.id === comment.postId );
        console.log( product);
        if (product) {
          console.log('Updated request:', product);
          product.commentsprods.push(comment);
          console.log(product);
        }
      });
    }
    console.log(this.comments);
    console.log(this.products);
  }



  getRowClass(product: Product): string {
    if (product.stock <= 50) {
      return 'table-danger';
    } else if (product.stock > 50 && product.stock <= 100) {
      return 'table-warning';
    } else {
      return 'table-success';
    }
  }
/*
  getProducts(): void {
    this.productService.getProducts().subscribe((response: any) => {
            this.products = response.products;

    });

  }*/
/*

  async getProductsAndComments(): Promise<void> {
    const products = await this.productService.getProducts().toPromise();
    const comments: CommentP[]  = await this.productService.getComments().toPromise();

    console.log(products); // Make sure that products is not null or undefined

    if (Array.isArray(products)) { // Check that products is an array
      for (const product of products) {
        // Filter the comments that belong to the current product
        let commenttemp: CommentP[] ;
        If( comments.filter(comment => comment.postId === product.id) != undefined  )
        {
        commenttemp = comments.filter(comment => comment.postId === product.id);
        }
        product.commentsprods = commenttemp;
      }

      // Store the products in the component property
      this.products = products;
    } else {
      console.error('Error: products is not an array');
    }
  }

*/



toggleEditComment(commentId: number): void {
  this.editingComment[commentId] = !this.editingComment[commentId];
  if (!this.editingComment[commentId]) {
    // Save the edited comment
    const commentToSave = this.selectedProduct!.commentsprods.find(comment => comment.id === commentId);
    if (commentToSave) {
      // Call the service to save the comment
      // Example: this.commentService.saveComment(commentToSave).subscribe();
    }
  }
}



  deleteProduct(id: number): void {
    this.productService.deleteProduct(id).subscribe(() => {
      this.products = this.products.filter((product) => product.id !== id);
    });
  }

  selectProduct(product: Product): void {
    this.selectedProduct = product;
    this.showAlert = true;
  }

  closeAlert(): void {
    this.showAlert = false;
    this.selectedProduct = null;
  }





  closeProductDetails(): void {
    this.selectedProduct = null;
  }

  saveComment(index: number, comment: CommentP, editedContent: string): void {
    //console.log(editedContent);
    this.editingComment[index] = false;
    comment.body = editedContent; // Update the comment body with the edited content
    // Update the comment in the local array
    let i ;

    const product = this.products.find(p => p.id === comment.postId);
    if (product) {
      const commentIndex = product.commentsprods.findIndex(c => c.id === comment.id);
      i
      if (commentIndex > -1) {
        product.commentsprods[commentIndex] = comment;

      }
     // console.log(product);
    }
    // TODO: Add API call to update the comment in your back-end system
    /* updating body of comment with id 1 */

i = comment.id;

fetch('https://dummyjson.com/comments/' + i, {
  method: 'PUT', /* or PATCH */
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    body: editedContent,
  })
})
.then(res => res.json())
.then(console.log);
  }


  countCategory(): void {
    of(this.products)
      .pipe(
        map((products) => {
          const categoryCount: { [key: string]: number } = {};
          products.forEach((product) => {
            categoryCount[product.category] = (categoryCount[product.category] || 0) + 1;
          });
          return categoryCount;
        })
      )
      .subscribe((categoryCount) => {
        alert(JSON.stringify(categoryCount));
      });
  }

  maxDiscount(): void {
    of(this.products)
      .pipe(
        map((products) => {
          let maxDiscount = 0;
          products.forEach((product) => {
            maxDiscount = Math.max(maxDiscount, product.discountPercentage);
          });
          return maxDiscount;
        })
      )
      .subscribe((maxDiscount) => {
        alert(`Max discount: ${maxDiscount}%`);
      });
  }

  priceLevel(): void {
    of(this.products)
      .pipe(
        map((products) => {
          const averagePrice = products.reduce((sum, product) => sum + product.price, 0) / products.length;
          const aboveAverage = products.filter((product) => product.price > averagePrice);
          return aboveAverage.map((product) => ({ id: product.id, name: product.title }));
        })
      )
      .subscribe((aboveAverage) => {
        alert(`Products above average price: ${JSON.stringify(aboveAverage)}`);
      });
  }


}
