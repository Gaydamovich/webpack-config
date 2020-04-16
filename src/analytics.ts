import * as $ from 'jquery'

const createAnalytics = (): object => {
  let counter = 0;
  let isDestroyed = false;

  const listener = (): number => ++counter;

  $(document).on('click', listener);

  return {
    destroy() {
      $(document).off('click', listener);
      isDestroyed = true
    },

    getClicks() {
      if (isDestroyed) {
        return `stop is clicker - ${counter}`
      }
      return counter
    }
  }
};

window['analytics'] = createAnalytics();