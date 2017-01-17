import { browserHistory } from 'react-router';

export function gotoPage(urlPath) {
  browserHistory.push(urlPath);
}
