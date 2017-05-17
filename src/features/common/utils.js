import { browserHistory } from 'react-router-dom';

export function gotoPage(urlPath) {
  browserHistory.push(urlPath);
}

export const history = {
  push: browserHistory.push,
};
