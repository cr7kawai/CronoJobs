import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BreadcrumbService {
  breadcrumbs: { label: string, url: string }[] = [];

  constructor() { }

  setBreadcrumbs(breadcrumbs: { label: string, url: string }[]) {
    this.breadcrumbs = breadcrumbs;
  }

  getBreadcrumbs() {
    return this.breadcrumbs;
  }
}