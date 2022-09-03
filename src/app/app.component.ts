import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';

import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

class Product {
  name: string = 'Test Product';
  price: number = 100;
  qty: number = 2;
}
class Invoice {
  customerName: string = 'Test Customer';
  address: string = '123 Address';
  contactNo: number = 1234567890;
  email: string = 'test@gmail.com';
  dueDate: Date;

  products: Product[] = [];
  additionalDetails: string;

  constructor() {
    // Initially one empty product row we will show 
    this.products.push(new Product());
  }
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  invoice = new Invoice();
  pipe = new DatePipe('en-US');
  now = Date.now();
  myFormattedDate = this.pipe.transform(this.now, 'dd-MM-yyyy');

  getRandomId = (min = 0, max = 500000) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    const num =  Math.floor(Math.random() * (max - min + 1)) + min;
    return num.toString().padStart(6, "0")
  };

  generatePDF(action = 'open') {
    let docDefinition = {
      content: [
        {
          columns: [
            [
              {
                text: 'SAAP FOODIEE',
                bold: true
              },
              { text: '7904484642' },
              { text: '2/260-10, Therkur, Chinnakollapatti, Near Sadayampatti' },
              { text: 'Police Station, Sattur- 626203, Tamil Nadu' },
              { text: 'GSTIN : 33DEPPP8452D1Z7' },
            ],
            [
              {
                text: 'TAX INVOICE',
                bold: true,
                alignment: 'right'
              },
              {
                text: `Invoice No : ${this.getRandomId()}`,
                alignment: 'right'
              },
              {
                text: `Invoice Date: ${this.myFormattedDate}`,
                alignment: 'right'
              },
              {
                text: `Due Date : ${this.pipe.transform(this.invoice.dueDate, 'dd-MM-yyyy')}`,
                alignment: 'right'

              }
            ]
          ],
          columnGap: 10
        },
        {
          text: 'Customer Details',
          style: 'sectionHeader'
        },
        {
          columns: [
            [
              {
                text: this.invoice.customerName,
                bold: true
              },
              { text: this.invoice.address },
              { text: this.invoice.email },
              { text: this.invoice.contactNo }
            ],
            [
              {
                text: `Date: ${new Date().toLocaleString()}`,
                alignment: 'right'
              },
              {
                text: `Bill No : ${((Math.random() * 1000).toFixed(0))}`,
                alignment: 'right'
              }
            ]
          ]
        },
        {
          text: 'Order Details',
          style: 'sectionHeader'
        },
        {
          table: {
            headerRows: 1,
            widths: ['*', 'auto', 'auto', 'auto'],
            body: [
              ['Product', 'Price', 'Quantity', 'Amount'],
              ...this.invoice.products.map(p => ([p.name, p.price, p.qty, (p.price * p.qty).toFixed(2)])),
              [{ text: 'Total Amount', colSpan: 3 }, {}, {}, this.invoice.products.reduce((sum, p) => sum + (p.qty * p.price), 0).toFixed(2)]
            ]
          }
        },
        {
          text: 'Additional Details',
          style: 'sectionHeader'
        },
        {
          text: this.invoice.additionalDetails,
          margin: [0, 0, 0, 15]
        },
        {
          columns: [
            [{ qr: `${this.invoice.customerName}`, fit: '50' }],
            [{ text: 'Signature', alignment: 'right', italics: true }],
          ]
        },
        {
          text: 'Terms and Conditions',
          style: 'sectionHeader'
        },
        {
          ol: [
            'Goods once sold will not be taken back or exchanged',
            'All disputes are subject to Sattur jurisdiction only'
          ],
        }
      ],
      styles: {
        sectionHeader: {
          bold: true,
          fontSize: 12,
          margin: [0, 15, 0, 15]
        }
      }
    };

    if (action === 'download') {
      pdfMake.createPdf(docDefinition).download();
    } else if (action === 'print') {
      pdfMake.createPdf(docDefinition).print();
    } else {
      pdfMake.createPdf(docDefinition).open();
    }

  }

  addProduct() {
    this.invoice.products.push(new Product());
  }

}
