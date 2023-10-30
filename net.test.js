const { clickElement, putText, getText } = require("./lib/commands.js");
const { generateName } = require("./lib/util.js");

let page;

beforeEach(async () => {
  page = await browser.newPage();
  await page.setDefaultNavigationTimeout(0);
}, 50000);

afterEach(() => {
  page.close();
});

describe("Go to movies tests", () => {
  beforeEach(async () => {
    await page.goto("https://qamid.tmweb.ru/");
  }, 50000);

  test("Бронирование одного билета", async () => {
    await clickElement(page, "a:nth-child(2)");
    await clickElement(page, ".movie-seances__hall a");
    const byuingSchema = "div.buying-scheme";
    await page.waitForSelector(byuingSchema);
    const place = ".buying-scheme__wrapper > :nth-child(6) > :nth-child(6)";
    await clickElement(page, place);
    await clickElement(page, "button");
    const result = "h2";
    await page.waitForSelector(result);
    const filmName = [await getText(page, "div > p:nth-child(1) > span")];
    const actual = filmName;
    const expected = ["Зверополис"];
    expect(actual).toEqual(expected);
  }, 50000);

  test("Бронирование 2-х билетов", async () => {
    await clickElement(page, "a:nth-child(3)");
    await clickElement(page, ".movie-seances__hall a");
    const byuingSchema = "div.buying-scheme";
    await page.waitForSelector(byuingSchema);
    let place1 = ".buying-scheme__wrapper > :nth-child(3) > :nth-child(5)";
    let place2 = ".buying-scheme__wrapper > :nth-child(3) > :nth-child(6)";
    await clickElement(page, place1);
    await clickElement(page, place2);
    await clickElement(page, "button");
    const result = "h2";
    await page.waitForSelector(result);
    filmName = [await getText(page, "div > p:nth-child(1) > span")];
    const actual = filmName;
    const expected = await ["Зверополис"];
    expect(actual).toEqual(expected);
  }, 50000);

  test("Бронирование билета на занятое место", async () => {
    await clickElement(page, "a:nth-child(4)");
    await clickElement(page, "div:nth-child(3) a");
    const byuingSchema = "div.buying-scheme";
    await page.waitForSelector(byuingSchema);
    const place = ".buying-scheme__wrapper > :nth-child(5) > :nth-child(5)";
    await clickElement(page, place);
    await clickElement(page, "button");
    const result = "h2";
    await page.waitForSelector(result);
    await clickElement(page, "button");
    const electroTicket = "h2";
    await page.waitForSelector(electroTicket);
    await page.goto("https://qamid.tmweb.ru/");
    await clickElement(page, "a:nth-child(4)");
    await clickElement(page, "div:nth-child(3) a");
    await page.waitForSelector(byuingSchema);
    const isTaken = await page.$eval(place, (el) =>
      el.classList.contains("buying-scheme__chair_taken")
    );
    let actual;
    if (isTaken) {
      actual = await getText(page, "div:nth-child(2) > p:nth-child(1)");
    } else {
      await clickElement(page, place);
    }
    const actualTrim = actual.trim();
    const expected = "Занято";
    expect(actualTrim).toEqual(expected);
  }, 60000);
});