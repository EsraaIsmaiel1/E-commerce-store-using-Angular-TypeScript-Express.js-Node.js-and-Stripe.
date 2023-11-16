import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { loadStripe } from '@stripe/stripe-js';
import { Cart, CartItem } from 'src/app/models/cart.model';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
})
export class CartComponent implements OnInit {
  cart:Cart = { items: [
    
    {
    product:'http://via.placeholder.com/150',
    name:'snicers',
    price:150,
    quantity:1,
    id:1
  },
    {
    product:'http://via.placeholder.com/150',
    name:'snicers',
    price:150,
    quantity:1,
    id:2
  },
]}

constructor(private cartService: CartService , private http : HttpClient){}

  dataSource: Array<CartItem> = [];
  displayedColumns: Array<string> = [
    'product'
    , 'name', 'price', 'quantity','total', 'action'
  ]


ngOnInit(): void {
  this.cartService.cart.subscribe((_cart:Cart)=>{
    this.cart = _cart;
    this.dataSource = this.cart.items;
  })
}

getTotal(items:Array<CartItem>):number {
  return this.cartService.getTotal(items);
  }

  onClearCart(): void {
    this.cartService.clearCart();
  }

  onRemoveItem(item:CartItem): void {
    this.cartService.removeItem(item);

  }

  onAddQuantity(item:CartItem): void {
    this.cartService.addToCart(item)
  }

  onRemoveQuantity(item:CartItem): void{
    this.cartService.removeQuantity(item)
  }

  onCheckOut(): void {
    this.http
      .post('http://localhost:4242/checkout', {
        items: this.cart.items,
      })
    .subscribe(async (res:any) => {
      let stripe = await loadStripe('pk_test_51OBl9KLy7NzevCqjyBYOyP9kztIG7eSxlV9mBMhKaxqjhZqDxPEbCVLZRe9DKTVWLkgH25Wnkbetsqcb5yAzg13m000mEoHRr7');
      stripe?.redirectToCheckout({
        sessionId: res.id
      });
    });
    
  }
}
