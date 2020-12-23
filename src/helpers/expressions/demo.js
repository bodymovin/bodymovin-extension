let text = `'use javascript';

const bezierUtlity = new class {
    constructor(t, e, i, s) {
        if (this.mX1 = t, this.mY1 = e, this.mX2 = i, this.mY2 = s, this.NEWTON_ITERATIONS = 4, this.NEWTON_MIN_SLOPE = .001, this.SUBDIVISION_PRECISION = 1e-7, this.SUBDIVISION_MAX_ITERATIONS = 10, this.kSplineTableSize = 11, this.kSampleStepSize = 1 / (this.kSplineTableSize - 1), this.sampleValues = "function" == typeof Float32Array ? new Float32Array(this.kSplineTableSize) : new Array(this.kSplineTableSize), !(t >= 0 && t <= 1 && i >= 0 && i <= 1)) throw new Error("bezier x values must be in [0, 1] range");
        if (t === e && i === s) return this;
        for (let e = 0; e < this.kSplineTableSize; ++e) this.sampleValues[e] = this.calcBezier(e * this.kSampleStepSize, t, i)
    }
    getValue(t) {
        return this.mX1 === this.mY1 && this.mX2 === this.mY2 || 0 === t || 1 === t || this.mX1 === this.mY1 && this.mX2 === this.mY2 ? t : this.calcBezier(this.getTForX(t, this.mX1, this.mX2), this.mY1, this.mY2)
    }
    getTForX(t, e, i) {
        let s = 0,
            h = 1;
        const r = this.kSplineTableSize - 1;
        for (; h !== r && this.sampleValues[h] <= t; ++h) s += this.kSampleStepSize;
        --h;
        const l = s + (t - this.sampleValues[h]) / (this.sampleValues[h + 1] - this.sampleValues[h]) * this.kSampleStepSize,
            S = this.getSlope(l, e, i);
        return S >= this.NEWTON_MIN_SLOPE ? this.newtonRaphsonIterate(t, l, e, i) : 0 === S ? l : this.binarySubdivide(t, s, s + this.kSampleStepSize, e, i)
    }
    A(t, e) {
        return 1 - 3 * e + 3 * t
    }
    B(t, e) {
        return 3 * e - 6 * t
    }
    C(t) {
        return 3 * t
    }
    calcBezier(t, e, i) {
        return ((this.A(e, i) * t + this.B(e, i)) * t + this.C(e)) * t
    }
    getSlope(t, e, i) {
        return 3 * this.A(e, i) * t * t + 2 * this.B(e, i) * t + this.C(e)
    }
    binarySubdivide(t, e, i, s, h) {
        let r, l, S = 0;
        do {
            l = e + (i - e) / 2, r = this.calcBezier(l, s, h) - t, r > 0 ? i = l : e = l
        } while (Math.abs(r) > this.SUBDIVISION_PRECISION && ++S < this.SUBDIVISION_MAX_ITERATIONS);
        return l
    }
    newtonRaphsonIterate(t, e, i, s) {
        for (let h = 0; h < this.NEWTON_ITERATIONS; ++h) {
            const h = this.getSlope(e, i, s);
            if (0 === h) return e;
            e -= (this.calcBezier(e, i, s) - t) / h
        }
        return e
    }
}(.02, .81, .01, 1);
const b = (currentValue, maxValue = 1) => bezierUtlity.getValue(currentValue / maxValue) * maxValue;
const getRandom = ((from, to, seedOffset = 110) => (seedRandom(index + seedOffset, true), Math.floor(random(0, to - from)) + from));

const ANIMATION_DURATION = thisComp.layer("Controller").effect("ANIMATION_DURATION")("Slider");
const X_OVERSCAN = thisComp.layer("Controller").effect("X_OVERSCAN")("Slider");
const Y_OVERSCAN = thisComp.layer("Controller").effect("Y_OVERSCAN")("Slider");
const Z_RANGE = thisComp.layer("Controller").effect("Z_RANGE")("Slider");
const SIZE = thisComp.layer("Controller").effect("SIZE")("Slider");
const isAnimationOnX = effect("isAnimationOnX")("Checkbox") > 0;
const baseX = getRandom(-X_OVERSCAN, SIZE + X_OVERSCAN, 69);
const baseY = getRandom(-Y_OVERSCAN, SIZE + Y_OVERSCAN, 420);
const baseZ = getRandom(-Z_RANGE / 2, Z_RANGE / 2);
const animationTime = effect("animationTime")("Slider");
const direction = getRandom(0, 1) >= 0.5 ? -1 : 1;
let result = [baseX, baseY, baseZ];

if (animationTime >= 0) {
    if (isAnimationOnX) {
        result[0] = b(animationTime / ANIMATION_DURATION) * result[0] * direction;
    } else {
        result[1] = b(animationTime / ANIMATION_DURATION) * result[1] * direction;

    }
}

result;`

export default text