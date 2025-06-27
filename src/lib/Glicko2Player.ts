// Glicko2Player.ts
// Standalone Glicko-2 implementation (ported from Python)
// Copyright (c) 2009 Ryan Kirkman (MIT License)

export class Glicko2Player {
    private _rating: number = 0;
    private _rd: number = 0;
    public vol: number;
    static tau = 0.5;

    constructor(rating = 1500, rd = 350, vol = 0.06) {
        this.setRating(rating);
        this.setRd(rd);
        this.vol = vol;
    }

    getRating(): number {
        return (this._rating * 173.7178) + 1500;
    }
    setRating(rating: number) {
        this._rating = (rating - 1500) / 173.7178;
    }
    getRd(): number {
        return this._rd * 173.7178;
    }
    setRd(rd: number) {
        this._rd = rd / 173.7178;
    }

    didNotCompete() {
        this._preRatingRD();
    }

    private _preRatingRD() {
        this._rd = Math.sqrt(Math.pow(this._rd, 2) + Math.pow(this.vol, 2));
    }

    updatePlayer(ratingList: number[], rdList: number[], outcomeList: number[]) {
        const ratingListT = ratingList.map(x => (x - 1500) / 173.7178);
        const rdListT = rdList.map(x => x / 173.7178);
        const v = this._v(ratingListT, rdListT);
        this.vol = this._newVol(ratingListT, rdListT, outcomeList, v);
        this._preRatingRD();
        this._rd = 1 / Math.sqrt((1 / Math.pow(this._rd, 2)) + (1 / v));
        let tempSum = 0;
        for (let i = 0; i < ratingListT.length; i++) {
            tempSum += this._g(rdListT[i]) * (outcomeList[i] - this._E(ratingListT[i], rdListT[i]));
        }
        this._rating += Math.pow(this._rd, 2) * tempSum;
    }

    private _newVol(ratingList: number[], rdList: number[], outcomeList: number[], v: number): number {
        const a = Math.log(this.vol ** 2);
        const eps = 0.000001;
        let A = a;
        let B: number;
        const delta = this._delta(ratingList, rdList, outcomeList, v);
        const tau = Glicko2Player.tau;
        if ((delta ** 2) > (this._rd ** 2 + v)) {
            B = Math.log(delta ** 2 - this._rd ** 2 - v);
        } else {
            let k = 1;
            while (this._f(a - k * Math.sqrt(tau ** 2), delta, v, a) < 0) {
                k += 1;
            }
            B = a - k * Math.sqrt(tau ** 2);
        }
        let fA = this._f(A, delta, v, a);
        let fB = this._f(B, delta, v, a);
        while (Math.abs(B - A) > eps) {
            const C = A + ((A - B) * fA) / (fB - fA);
            const fC = this._f(C, delta, v, a);
            if (fC * fB <= 0) {
                A = B;
                fA = fB;
            } else {
                fA = fA / 2.0;
            }
            B = C;
            fB = fC;
        }
        return Math.exp(A / 2);
    }

    private _f(x: number, delta: number, v: number, a: number): number {
        const ex = Math.exp(x);
        const num1 = ex * (delta ** 2 - this._rating ** 2 - v - ex);
        const denom1 = 2 * ((this._rating ** 2 + v + ex) ** 2);
        return (num1 / denom1) - ((x - a) / (Glicko2Player.tau ** 2));
    }

    private _delta(ratingList: number[], rdList: number[], outcomeList: number[], v: number): number {
        let tempSum = 0;
        for (let i = 0; i < ratingList.length; i++) {
            tempSum += this._g(rdList[i]) * (outcomeList[i] - this._E(ratingList[i], rdList[i]));
        }
        return v * tempSum;
    }

    private _v(ratingList: number[], rdList: number[]): number {
        let tempSum = 0;
        for (let i = 0; i < ratingList.length; i++) {
            const tempE = this._E(ratingList[i], rdList[i]);
            tempSum += Math.pow(this._g(rdList[i]), 2) * tempE * (1 - tempE);
        }
        return 1 / tempSum;
    }

    private _E(p2rating: number, p2rd: number): number {
        return 1 / (1 + Math.exp(-1 * this._g(p2rd) * (this._rating - p2rating)));
    }

    private _g(rd: number): number {
        return 1 / Math.sqrt(1 + 3 * Math.pow(rd, 2) / Math.pow(Math.PI, 2));
    }
}
