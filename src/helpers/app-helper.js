class AppHelper {
  /**
   * @name shuffle
   * @function
   * @summary Fisher-Yates randomization algorithm for shuffling an array (destructive)
   * @example http://stackoverflow.com/a/2450976/3213605
   * @param {Array} array - incoming array that will be destructively randomized
   * @returns {Array} - randomized array
   */
  static shuffle(array){
    let currentIndex, temporaryValue, randomIndex;

    currentIndex = array.length;

    // While there remain elements to shuffle...
    while (currentIndex !== 0) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  }
}

export { AppHelper as default };
