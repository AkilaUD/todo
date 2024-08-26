import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HttpClientModule, FormsModule, ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title = 'Stock Management';

  items: any[] = []; // Array to store items fetched from the server
  APIURL = "http://localhost:8000/";  // Adjust the port to match your API server

  // Variables for the form fields
  itemCode: string = '';
  itemName: string = '';
  description: string = '';
  category: string = '';
  unitPrice: number = 0;
  quantity: number = 0;
  reorderLevel: number = 0;
  supplier: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.getItems();  // Fetch items when the component initializes
  }

  // Method to fetch items from the server
  getItems() {
    this.http.get<any[]>(this.APIURL + "get_ProductDetails").pipe(
      catchError(error => {
        console.error('Error fetching items:', error);
        alert('An error occurred while fetching items.');
        return of([]);  // Return an empty array in case of error
      })
    ).subscribe((res) => {
      this.items = res;
    });
  }

  // Method to add a new item
  addItem() {
    let body = new FormData();
    body.append('itemCode', this.itemCode);
    body.append('itemName', this.itemName);
    body.append('description', this.description);
    body.append('category', this.category);
    body.append('unitPrice', this.unitPrice.toString());
    body.append('quantity', this.quantity.toString());
    body.append('reorderLevel', this.reorderLevel.toString());
    body.append('supplier', this.supplier);

    this.http.post(this.APIURL + "add_ProductDetails", body).pipe(
      catchError(error => {
        console.error('Error adding item:', error);
        alert('An error occurred while adding the item.');
        return of(null);  // Return null in case of error
      })
    ).subscribe((res) => {
      if (res) {
        alert('Item added successfully');
        this.getItems();  // Refresh the list of items after adding a new one
      }
    });
  }

  // Method to delete an item
  deleteItem(itemID: any) {
    let body = new FormData();
    body.append('ID', itemID);  // Ensure 'ID' matches the parameter in your API

    this.http.post(this.APIURL + "delete_ProductDetails", body).pipe(
      catchError(error => {
        console.error('Error deleting item:', error);
        alert('An error occurred while deleting the item.');
        return of(null);  // Return null in case of error
      })
    ).subscribe((res) => {
      if (res) {
        alert('Item deleted successfully');
        this.getItems();  // Refresh the list of items after deletion
      }
    });
  }
}
