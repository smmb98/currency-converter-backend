# Currency Converter (Angular 19 + NestJS) — Strict Implementation Blueprint

## 🔒 Non-Negotiable Rules
- ALWAYS generate components, modules, services using CLI (Angular & NestJS)
- ZERO syntax errors
- ZERO warnings
- ZERO unused variables, imports, or code
- NO business logic in Angular templates
- NO API key exposure in frontend
- KEEP everything minimal, explicit, and predictable

---

# 🧱 Architecture

Angular (Frontend)
   ↓ HTTP
NestJS (Backend)
   ↓
FreeCurrencyAPI

---

# ⚙️ BACKEND (NestJS)

## 1. Create Module via CLI

```bash
nest g module currency
nest g service currency
nest g controller currency
```

---

## 2. Install Dependencies

```bash
npm install @nestjs/axios axios
```

---

## 3. currency.service.ts

```ts
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class CurrencyService {
  private readonly API_KEY = 'YOUR_API_KEY';
  private readonly BASE_URL = 'https://api.freecurrencyapi.com/v1';

  constructor(private readonly http: HttpService) {}

  async getLatest(base: string) {
    const url = `${this.BASE_URL}/latest?apikey=${this.API_KEY}&base_currency=${base}`;
    const res = await firstValueFrom(this.http.get(url));
    return res.data;
  }

  async getHistorical(base: string, date: string) {
    const url = `${this.BASE_URL}/historical?apikey=${this.API_KEY}&base_currency=${base}&date=${date}`;
    const res = await firstValueFrom(this.http.get(url));
    return res.data;
  }

  async getCurrencies() {
    const url = `${this.BASE_URL}/currencies?apikey=${this.API_KEY}`;
    const res = await firstValueFrom(this.http.get(url));
    return res.data;
  }
}
```

---

## 4. currency.controller.ts

```ts
import { Controller, Get, Query } from '@nestjs/common';
import { CurrencyService } from './currency.service';

@Controller('currency')
export class CurrencyController {
  constructor(private readonly service: CurrencyService) {}

  @Get('latest')
  getLatest(@Query('base') base: string) {
    return this.service.getLatest(base);
  }

  @Get('historical')
  getHistorical(@Query('base') base: string, @Query('date') date: string) {
    return this.service.getHistorical(base, date);
  }

  @Get('currencies')
  getCurrencies() {
    return this.service.getCurrencies();
  }
}
```

---

## 5. currency.module.ts

```ts
import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { CurrencyController } from './currency.controller';
import { CurrencyService } from './currency.service';

@Module({
  imports: [HttpModule],
  controllers: [CurrencyController],
  providers: [CurrencyService],
})
export class CurrencyModule {}
```

---

# 🎨 FRONTEND (Angular 19)

## 1. Generate via CLI

```bash
ng g service core/currency
ng g component features/converter
```

---

## 2. Install Dependencies

```bash
ng add @angular/material
npm install dayjs
```

---

## 3. Angular Service

```ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CurrencyService {
  private readonly BASE_URL = 'http://localhost:3000/currency';

  constructor(private readonly http: HttpClient) {}

  getCurrencies(): Observable<any> {
    return this.http.get<any>(`${this.BASE_URL}/currencies`);
  }

  getLatest(base: string): Observable<any> {
    return this.http.get<any>(`${this.BASE_URL}/latest?base=${base}`);
  }

  getHistorical(base: string, date: string): Observable<any> {
    return this.http.get<any>(
      `${this.BASE_URL}/historical?base=${base}&date=${date}`
    );
  }
}
```

---

## 4. Converter Component (TS)

```ts
import { Component, OnInit } from '@angular/core';
import { CurrencyService } from '../../core/currency.service';

interface HistoryRecord {
  from: string;
  to: string;
  amount: number;
  result: number;
  rate: number;
  date: string;
  timestamp: string;
}

@Component({
  selector: 'app-converter',
  templateUrl: './converter.component.html',
  styleUrls: ['./converter.component.scss'],
})
export class ConverterComponent implements OnInit {
  currencies: string[] = [];

  from = 'USD';
  to = 'PKR';
  amount = 1;
  result = 0;
  date: string | null = null;

  loading = false;

  history: HistoryRecord[] = [];

  constructor(private readonly currencyService: CurrencyService) {}

  ngOnInit(): void {
    this.loadCurrencies();
    this.loadHistory();
  }

  loadCurrencies(): void {
    this.currencyService.getCurrencies().subscribe((res) => {
      this.currencies = Object.keys(res.data);
    });
  }

  convert(): void {
    this.loading = true;

    const request = this.date
      ? this.currencyService.getHistorical(this.from, this.date)
      : this.currencyService.getLatest(this.from);

    request.subscribe((res) => {
      const rate = res.data[this.to];
      this.result = this.amount * rate;

      this.saveHistory(rate);
      this.loading = false;
    });
  }

  saveHistory(rate: number): void {
    const record: HistoryRecord = {
      from: this.from,
      to: this.to,
      amount: this.amount,
      result: this.result,
      rate,
      date: this.date || 'latest',
      timestamp: new Date().toISOString(),
    };

    this.history.unshift(record);
    localStorage.setItem('conversion_history', JSON.stringify(this.history));
  }

  loadHistory(): void {
    const data = localStorage.getItem('conversion_history');
    if (data) {
      this.history = JSON.parse(data);
    }
  }
}
```

---

## 5. Converter Template (HTML)

```html
<div class="container">
  <mat-form-field appearance="outline">
    <mat-label>Amount</mat-label>
    <input matInput type="number" [(ngModel)]="amount" />
  </mat-form-field>

  <mat-form-field appearance="outline">
    <mat-label>From</mat-label>
    <mat-select [(ngModel)]="from">
      <mat-option *ngFor="let c of currencies" [value]="c">{{ c }}</mat-option>
    </mat-select>
  </mat-form-field>

  <mat-form-field appearance="outline">
    <mat-label>To</mat-label>
    <mat-select [(ngModel)]="to">
      <mat-option *ngFor="let c of currencies" [value]="c">{{ c }}</mat-option>
    </mat-select>
  </mat-form-field>

  <mat-form-field appearance="outline">
    <mat-label>Date</mat-label>
    <input matInput [matDatepicker]="picker" (dateChange)="date = $event.value | date:'yyyy-MM-dd'" />
    <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
    <mat-datepicker #picker></mat-datepicker>
  </mat-form-field>

  <button mat-raised-button color="primary" (click)="convert()" [disabled]="loading">
    Convert
  </button>

  <mat-progress-spinner *ngIf="loading" mode="indeterminate"></mat-progress-spinner>

  <h3>Result: {{ result }}</h3>

  <h3>History</h3>
  <div *ngFor="let item of history">
    {{ item.amount }} {{ item.from }} → {{ item.to }} = {{ item.result }}
    ({{ item.date }})
  </div>
</div>
```

---

## 📱 Mobile-First Styling (SCSS)

```scss
.container {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
}
```

---

# ✅ Final Notes

- No redundant abstractions
- No over-engineering
- Everything deterministic for AI tools
- Backend is a pure proxy
- Frontend owns UI + localStorage only

If something breaks, it will be obvious where—and that’s exactly what you want.

