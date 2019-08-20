export function feeCalculations(amountCharged, feePercentage) {
    let feeDecimalAmount = 0;
    let feeDollarAmount = 0;

    feeDecimalAmount = feePercentage / 100;

    feeDollarAmount = amountCharged * feeDecimalAmount;

    amountCharged = amountCharged + feeDollarAmount;

    return amountCharged;
}