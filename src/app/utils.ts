import { UrlSegment } from '@angular/router';

export const productCategoryMatcher = (url: UrlSegment[]) =>
  [1, 2].includes(url.length) && url[0].path === 'products'
    ? { consumed: url, posParams: url.length > 1 ? { category: url[1] } : undefined }
    : null;
