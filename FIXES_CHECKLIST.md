# Currency Converter — Fixes Checklist

## BACKEND (currency-converter-backend)

### Cleanup
- [ ] B1: Remove unused `@nestjs/axios` and `axios` from dependencies
- [ ] B2: Remove `AppController` and `AppService` (boilerplate, unused)
- [ ] B3: Remove dead `dto` parameter from `getCurrencies()` controller method
- [ ] B4: Move API key to `.env` file, read via `process.env`
- [ ] B5: Add `.env` to `.gitignore`, add `.env.example`

### Error Handling
- [ ] B6: Wrap all service methods in try/catch, throw `HttpException` on failure
- [ ] B7: Add global exception filter via CLI: `nest g filter common/http-exception`

### Config
- [ ] B8: Install and wire `@nestjs/config` for env management

---

## FRONTEND (currency-converter)

### Angular v19 Upgrade (Standalone)
- [ ] F1: Upgrade all `@angular/*` packages to v19 in `package.json`
- [ ] F2: Remove `AppModule` — switch to standalone bootstrap via `bootstrapApplication`
- [ ] F3: Update `main.ts` to use `bootstrapApplication` with `AppComponent`
- [ ] F4: Convert `AppComponent` to standalone
- [ ] F5: Convert `ConverterComponent` to standalone
- [ ] F6: Convert `CurrencyService` — already `providedIn: 'root'`, no change needed
- [ ] F7: Update `tsconfig.json` target to `ES2022`, add `useDefineForClassFields`
- [ ] F8: Update `angular.json` builder to `@angular-devkit/build-angular:application`
- [ ] F9: Remove `polyfills.ts` file reference (Angular 19 handles this internally)

### Directives (Missing Requirement)
- [ ] F10: Generate loading directive via CLI: `ng g directive shared/directives/loading-spinner`
- [ ] F11: Implement `LoadingSpinnerDirective` — structural directive that shows a spinner overlay when `[appLoadingSpinner]="true"`
- [ ] F12: Apply `[appLoadingSpinner]` directive in converter template

### Dead Code Removal
- [ ] F13: Remove `currenciesLoaded` property (declared, never used in template)
- [ ] F14: Delete empty `converter.component.css` file
- [ ] F15: Delete empty `app.component.css` file

### History — Show Time (Missing Requirement)
- [ ] F16: Update history list in template to display `item.timestamp` formatted as date + time (not just `item.date`)

### Environment / Deployment Config
- [ ] F17: Add `apiUrl` to `environment.ts` pointing to `http://localhost:3000/currency`
- [ ] F18: Add `apiUrl` to `environment.prod.ts` pointing to deployed backend URL
- [ ] F19: Update `CurrencyService` to use `environment.apiUrl` instead of hardcoded URL

### Error Handling
- [ ] F20: Add error state property to `ConverterComponent`, display user-facing error message in template
- [ ] F21: Handle `loadCurrencies` error — show error message in UI, not just `console.error`

### Cleanup
- [ ] F22: Remove `dayjs` from blueprint notes — it was never installed or needed

---

## DONE
*(Items move here as they are completed)*
