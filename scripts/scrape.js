// Require request and cheerio, making our scrapes possible
var request = require("request");
var cheerio = require("cheerio");

var scrape = function(cb) {
    
    request("http://www.nytimes.com", function(err, res, body) {
    //    console.log(body);

        var $ = cheerio.load(body);

        var articles = [];

        $("article").each(function(i, element) {
            // var head = $(this).children(".story-heading").text().trim();
            // var sum = $(this).children(".summary").text().trim();
            var nytimes = "www.nytimes.com";
            var link = $(element).find("a").attr("href");
            // console.log(nytimes + link);
            var url = nytimes + link;
            // console.log(url);
            var head = $(element).find("h2").text();
            // console.log(title);
            var sum = $(element).find("p").text();
            // console.log(sum);
           

            if (head && sum) {
                var headNeat = head.replace(/(\r\n|\n|\r|\t|\s+)/gm, " ").trim();
                var sumNeat = sum.replace(/(\r\n|\n|\r|\t|\s+)/gm, " ").trim();
                

                var dataToAdd = {
                    headline: headNeat,
                    summary: sumNeat,
                    link: url
                };

                articles.push(dataToAdd);
            }
        });
        cb(articles);
    });
};

module.exports = scrape;