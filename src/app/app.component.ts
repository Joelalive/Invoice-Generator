import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';

import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

class Product {
  name: string = 'Test Product';
  price: number = 100;
  qty: number = 2;
  tax: number = 5;
}
class Invoice {
  customerName: string = 'Test Customer';
  billTo: string = '123 Address';
  sameAsBilling: boolean = true;
  shipTo: string = '123 Address';
  contactNo: number = 1234567890;
  email: string = 'test@gmail.com';
  gstIn: string = '33AUNPB4250A1ZB';
  place: string = 'Tamil Nadu';
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
    const num = Math.floor(Math.random() * (max - min + 1)) + min;
    return num.toString().padStart(6, "0")
  };

  toggleAddress(value) {
    this.invoice.sameAsBilling = !value;
  }

  generatePDF(action = 'open') {

    let docDefinition = {
      content: [
        {
          columns: [
            [
              {
                text: 'SAAP FOODIEE',
                bold: true,
                style: 'sectionHeader'
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
                style: 'sectionHeader',
                // alignment: 'right'
              },
              {
                text: `Invoice No : ${this.getRandomId()}`,
                // alignment: 'right'
              },
              {
                text: `Invoice Date : ${this.myFormattedDate}`,
                // alignment: 'right'
              },
              {
                text: `Due Date : ${this.pipe.transform(this.invoice.dueDate, 'dd-MM-yyyy')}`,
                // alignment: 'right'

              }
            ]
          ],
          columnGap: 10
        },
        {
          text: '',
          margin: [0, 0, 0, 15]
        },
        {
          layout: 'noBorders', // optional
          table: {
            headerRows: 1,
            widths: ['50%', '50%'],
            body: [
              [{ text: 'Bill To', style: 'tableHeader' }, { text: 'Ship To', style: 'tableHeader' }],
            ]
          }
        },
        {
          text: '',
          margin: [0, 0, 0, 5]
        },
        {
          columns: [
            [
              // {
              //   text: 'Bill To ',
              //   bold: true,
              //   style: 'sectionHeader',
              // },
              { text: this.invoice.customerName, bold: true },
              { text: this.invoice.billTo },
              { text: this.invoice.gstIn ? 'GSTIN : ' + this.invoice.gstIn : 'GSTIN : NA' },
              { text: 'PLACE OF SUPPLY : ' + this.invoice.place },
            ],
            [
              // {
              //   text: 'Ship To',
              //   bold: true,
              //   style: 'sectionHeader',
              //   alignment: 'right'
              // },
              {
                text: this.invoice.customerName,
                bold: true,
                // alignment: 'right'
              },
              {
                text: this.invoice.sameAsBilling ? this.invoice.billTo : this.invoice.shipTo,
                // alignment: 'right'
              }
            ]
          ],
          columnGap: 10
        },
        {
          text: '',
          style: 'sectionHeader'
        },
        {
          layout: 'lightHorizontalLines', // optional
          table: {
            headerRows: 1,
            widths: ['1%', '49%', '10%', '10%', '10%', '20%'],
            body: [
              [{ text: '#', style: 'tableHeader' }, { text: 'ITEMS', style: 'tableHeader' }, { text: 'QTY', style: 'tableHeader' }, { text: 'RATE', style: 'tableHeader' }, { text: 'TAX', style: 'tableHeader' }, { text: 'AMOUNT', style: 'tableHeader' }],
              ...this.invoice.products.map((p, index) => ([++index, p.name, p.qty, p.price, p.tax,(p.price * p.qty).toFixed(2)])),
              [{ text: 'Total Amount', colSpan: 3 }, {}, {}, {}, {}, this.invoice.products.reduce((sum, p) => sum + (p.qty * p.price), 0).toFixed(2)]
            ]
          }
        },
        {
          text: 'NOTES',
          style: 'sectionHeader'
        },
        {
          text: this.invoice.additionalDetails,
        },
        // {
        //   columns: [
        //     [{ qr: `${this.invoice.customerName}`, fit: '50' }],
        //     [{ text: 'Signature', alignment: 'right', italics: true }],
        //   ]
        // },
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
          fontSize: 11,
          margin: [0, 15, 0, 5]
        },
        tableHeader: {
          bold: true,
          fontSize: 10,
          fillOpacity: '0.25',
          fillColor: '#e6e6e6'
        }
      },
      defaultStyle: {
        fontSize: 9,
        lineHeight: 1.2
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
