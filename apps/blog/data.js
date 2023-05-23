const cheerio = require('cheerio');
const fs = require('fs');

// Load the HTML content into Cheerio
const $ = cheerio.load(html);

// Create an empty object to hold the extracted data
const data = {};

// Extract the content from the About section
const aboutTitle = $('#about .w3-padding-64 .w3-tag').text().trim();
const aboutContent = $('#about p')
  .map(function () {
    return $(this).text().trim();
  })
  .get();
const aboutQuote = $('#about .w3-light-grey i').text().trim();
const aboutChef = $('#about .w3-light-grey p').last().text().trim();
const aboutHours = $('#about p').last().prev().text().trim();
const aboutAddress = $('#about p').last().text().trim();

// Add the extracted content to the data object
data.about = {
  title: aboutTitle,
  content: aboutContent,
  quote: aboutQuote,
  chef: aboutChef,
  hours: aboutHours,
  address: aboutAddress,
};

// Extract the content from the Menu section
const menuItems = {};
$('#menu .menu').each(function () {
  const category = $(this).attr('id');
  const items = $(this)
    .find('h5')
    .map(function () {
      const name = $(this).text().trim();
      const price = $(this).next().text().trim();
      return { name, price };
    })
    .get();
  menuItems[category] = items;
});

// Add the extracted content to the data object
data.menu = menuItems;

// Write the data to a JSON file
fs.writeFileSync('data.json', JSON.stringify(data, null, 2));
