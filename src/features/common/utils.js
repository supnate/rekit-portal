import { browserHistory } from 'react-router';

export function gotoPage(urlPath) {
  browserHistory.push(urlPath);
}

export const history = {
  push: browserHistory.push,
};
