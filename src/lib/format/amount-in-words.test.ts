import { describe, expect, it } from "vitest";
import { amountInWordsIndian } from "./amount-in-words";

describe("amountInWordsIndian", () => {
  it("renders zero", () => {
    expect(amountInWordsIndian(0)).toBe("Zero Rupees Only");
  });

  it("renders a plain number under a thousand", () => {
    expect(amountInWordsIndian(500)).toBe("Five Hundred Rupees Only");
  });

  it("renders 1,86,000 using lakh, not the Western 'hundred eighty-six thousand'", () => {
    expect(amountInWordsIndian(186000)).toBe(
      "One Lakh Eighty Six Thousand Rupees Only",
    );
  });

  it("renders 1,00,00,000 using crore, not 'ten million'", () => {
    expect(amountInWordsIndian(10000000)).toBe("One Crore Rupees Only");
  });

  it("combines crore, lakh, thousand and hundreds together", () => {
    expect(amountInWordsIndian(12345678)).toBe(
      "One Crore Twenty Three Lakh Forty Five Thousand Six Hundred Seventy Eight Rupees Only",
    );
  });

  it("rounds off paise — receipts carry no decimals", () => {
    expect(amountInWordsIndian(1860.75)).toBe("One Thousand Eight Hundred Sixty One Rupees Only");
  });

  it("handles teens correctly inside a larger amount", () => {
    expect(amountInWordsIndian(100019)).toBe("One Lakh Nineteen Rupees Only");
  });
});
