// const WEEK_DAYS = new Array(7);
// WEEK_DAYS[0] = "Sunday";
// WEEK_DAYS[1] = "Monday";
// WEEK_DAYS[2] = "Tuesday";
// WEEK_DAYS[3] = "Wednesday";
// WEEK_DAYS[4] = "Thursday";
// WEEK_DAYS[5] = "Friday";
// WEEK_DAYS[6] = "Saturday";

const DAY_IN_MINUTES = 24 * 60;

class TemporalSimilarity {
    /**
     * @param {Date} dateTime1
     * @param {Date} dateTime2
     */
    constructor(dateTime1, dateTime2 = new Date()) {
        this.dateTime1 = dateTime1;
        this.dateTime2 = dateTime2;
    }

    /**
     * Get the overall similarity score.
     *
     * @return {number}
     */
    getScore() {
        let score = 0;
        score += this.getDayTimeScore() * 0.5;
        score += this.getWeekDayScore() * 0.5;
        // Add more scores to recommend more precisely.
        return score;
    }

    /**
     * Determines how similar the week day is.
     *
     * @return {number}
     */
    getWeekDayScore() {
        // Max distance is 3.5, but in as there are no half days, here it's 3.
        // So actually the normalized distance is always below 1.
        return TemporalSimilarity.scoreFromDistance(this.dateTime1.getDay() - this.dateTime2.getDay(), 7, 4);
    }

    /**
     * Determines how similar the day time is.
     *
     * @return {number}
     */
    getDayTimeScore() {
        const minutesOfDay1 = this.dateTime1.getMinutes() + (60 * this.dateTime1.getHours());
        const minutesOfDay2 = this.dateTime2.getMinutes() + (60 * this.dateTime2.getHours());
        return TemporalSimilarity.scoreFromDistance(minutesOfDay1 - minutesOfDay2, DAY_IN_MINUTES, 2);
    }

    /**
     * Get the score from specified distance.
     *
     * @param {number} distance
     * @param {number} coset
     * @param {number} polynomial the ratio of importance to distance
     * @return {number}
     */
    static scoreFromDistance(distance, coset, polynomial = 1){
        return Math.pow(1 - this.normalizeDistance(distance, coset), polynomial);
    }

    /**
     * Get the distance in range [0,1].
     *
     * @param {number} distance
     * @param {number} coset (Restklasse)
     */
    static normalizeDistance(distance, coset) {
        const half = coset / 2.;
        distance = ((distance + coset) % coset);
        const absDistance = distance > half ? (coset - distance) : distance;
        return absDistance / half;
    }
}

module.exports = TemporalSimilarity;