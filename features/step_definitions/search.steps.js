const puppeteer = require("puppeteer");
const chai = require("chai");
const expect = chai.expect;
const { Given, When, Then, Before, After } = require("@cucumber/cucumber");
const { getText, clickElement } = require("../../lib/commands.js");

let browser;
let page;
let byuingSchema;
let place;

Before(async function () {
  browser = await puppeteer.launch({
    headless: false,
    // slowMo: 50,
    defaultViewport: null,
    args: ["--start-maximized"],
  });
  page = await browser.newPage();
  this.browser = browser;
  this.page = page;
});

After(async function () {
  if (this.browser) {
    await this.browser.close();
  }
});

Given("пользователь на странице {string}", async function (url) {
  try {
    await this.page.goto(url, { setTimeout: 60000 });
  } catch (error) {
    throw new Error(`Failed to navigate to ${url} with error: ${error}`);
  }
});

When("переход на расписание следующего дня", async function () {
  return await clickElement(this.page, "a:nth-child(2)");
});

When("выбор сеанса фильма Зверополис на 11-00", async function () {
  await this.page.waitForTimeout(1000);
  return await clickElement(this.page, ".movie-seances__hall a");
});

When("выбор места в зале 6 ряд 6 место", async function () {
  byuingSchema = "div.buying-scheme";
  await this.page.waitForSelector(byuingSchema);
  await this.page.waitForTimeout(500);
  place = ".buying-scheme__wrapper > :nth-child(6) > :nth-child(6)";
  await clickElement(this.page, place);
  await clickElement(this.page, "button");
});

Then("результат бронирования", async function () {
  await this.page.waitForTimeout(1000);
  const result = "h2";
  await this.page.waitForSelector(result);
  const filmName = [await getText(this.page, "div > p:nth-child(1) > span")];
  const actual = filmName;
  const expected = await ["Зверополис"];
  expect(actual).to.have.members(expected);
});

When(
  "выбор места в зале кинотеатра 3 ряд 5, 6 места",
  async function () {
    byuingSchema = "div.buying-scheme";
    await this.page.waitForSelector(byuingSchema);
    let place1 = ".buying-scheme__wrapper > :nth-child(3) > :nth-child(5)";
    let place2 = ".buying-scheme__wrapper > :nth-child(3) > :nth-child(6)";
    await clickElement(this.page, place1);
    await this.page.waitForTimeout(500);
    await clickElement(this.page, place2);
    await this.page.waitForTimeout(500);
    await clickElement(this.page, "button.acceptin-button");
  }
);

Then("результат бронирования двух билетов", async function () {
  await this.page.waitForTimeout(1000);
  const result = "h2";
  await this.page.waitForSelector(result);
  await getText(this.page, `div > p:nth-child(1) > span`);
  let filmName = [await getText(this.page, "div > p:nth-child(1) > span")];
  const actual = filmName;
  const expected = await ["Унесенные ветром"];
  expect(actual).to.have.members(expected);
});

When("переход на расписание через 2 дня от текущей даты", async function () {
  return await clickElement(this.page, "a:nth-child(3)");
});

When("выбор сеанса фильма Унесенные ветром на 16-00",
  async function () {
    await this.page.waitForTimeout(1000);
    return await clickElement(this.page, "div:nth-child(3) a");
  }
);

When("выбирает место в зале кинотеатра 2 ряд 4 место", async function () {
  byuingSchema = "div.buying-scheme";
  await this.page.waitForSelector(byuingSchema);
  place = ".buying-scheme__wrapper > :nth-child(2) > :nth-child(1)";
  await clickElement(this.page, place);
  await clickElement(this.page, "button");
});

Then("покупка билета", async function () {
  await this.page.waitForTimeout(1000);
  const result = "h2";
  await this.page.waitForSelector(result);
  await clickElement(this.page, "button");
  const electroTicket = "h2";
  await this.page.waitForSelector(electroTicket);
  await this.page.waitForTimeout(1000);
  const actual = await getText(this.page, electroTicket);
  const expected = "Унесенные ветром";
  expect(actual).to.equal(expected);
});

When("переход на расписание через 3 дня от текущей даты", async function () {
  return await clickElement(this.page, "a:nth-child(4)");
});

When("выбор места в зале 5 ряд 5 место", async function () {
  byuingSchema = "div.buying-scheme";
  await this.page.waitForSelector(byuingSchema);
  place = ".buying-scheme__wrapper > :nth-child(5) > :nth-child(5)";
  await clickElement(this.page, place);
  await clickElement(this.page, "button");
});

When(
  "переход на главную страницу кинотеатра {string}",
  async function (url) {
    try {
      await this.page.goto(url);
    } catch (error) {
      throw new Error(`Failed to navigate to ${url} with error: ${error}`);
    }
  }
);

Then(
  "результат бронирования места, которое занято",
  async function () {
    await this.page.waitForSelector(byuingSchema);
    const isTaken = await this.page.$eval(place, (el) =>
      el.classList.contains("buying-scheme__chair_taken")
    );
    let actual;
    if (isTaken) {
      actual = await getText(this.page, "div:nth-child(2) > p:nth-child(1)");
    } else {
      await clickElement(this.page, place);
    }
    const actualTrim = actual.trim();
    const expected = "Занято";
    expect(actualTrim).to.equal(expected);
  }
);