// ==UserScript==
// @name         Google Check
// @namespace    https://github.com/ChuangSheep
// @version      0.1
// @description  An User Script which provides information of website reliablity. This script is provided without guarantee. 
// @author       ChuangSheep
// @include      https://www.google.*/search?*
// @grant        none
// @license GPL3
// ==/UserScript==

'use strict';

const divStart = `<div class="googlecheck-check-sign">`;
const divEnd = `</div>`;
// Icons are available under Apache license version 2.0.
// https://material.io/resources/icons
const tickImg = '<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0z" fill="none"/><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>';
const crossImg = `<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0z" fill="none"/><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM4 12c0-4.42 3.58-8 8-8 1.85 0 3.55.63 4.9 1.69L5.69 16.9C4.63 15.55 4 13.85 4 12zm8 8c-1.85 0-3.55-.63-4.9-1.69L18.31 7.1C19.37 8.45 20 10.15 20 12c0 4.42-3.58 8-8 8z"/></svg>`;
const dpImg = `<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0z" fill="none"/><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11H7v-2h10v2z"/></svg>`;
const warningImg = `<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0z" fill="none"/><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>`;
const unknownImg = `<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0z" fill="none"/><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>`;
const style = `<style>
div.googlecheck-check-sign {
    position: relative;
    font-size: medium;
    display: inline-block;
    padding: 0 0 0 10px;
    width: 24px;
    height: 24px;
  }
  
  .googlecheck-check-sign svg {
      position: absolute;
      bottom: -5px;
  }
  
  .googlecheck-tooltip {
    visibility: hidden;
    width: 400px;
    min-height: 180px;
    background-color: black;
    color: #fff;
    border-radius: 6px;
    padding: 10px 10px 30px 10px;
    
    position: absolute;
    z-index: 30;
    top: -5px;
    left: 105%;
  }
  
  .googlecheck-tooltip h4 {
    padding: 7px 0;
    margin: 0 0;
  }
  
  .googlecheck-tooltip-desc {
    max-width: inherit;
  }
  
  .googlecheck-check-sign:hover .googlecheck-tooltip {
    visibility: visible;
  }
  </style>
`;

const statusMap = {
    "Generally reliable": { "svg": tickImg, },
    "Generally unreliable": { "svg": crossImg, },
    "No consensus": { "svg": warningImg, },
    "Deprecated": { "svg": dpImg, },
    "Unknown": { "svg": unknownImg, }
}

window.addEventListener('load', main, false);

function main() {
    //let sourceList;
    //if (localStorage.getItem("sourceList") === "null") {
    //sourceList = l;
    //localStorage.setItem("sourceList", sourceList);
    //}
    //else {
    //sourceList = JSON.parse(localStorage.getItem("sourceList"));
    //}

    document.getElementsByTagName("head")[0].appendChild(htmlToElement(style))

    const titles = document.getElementsByClassName('LC20lb DKV0Md');
    const addresses = document.getElementsByClassName('TbwUpd NJjxre');
    for (let i = 0; i < titles.length; i++) {
        addSign(checkAddress(addresses[i].firstChild.firstChild.textContent, l), titles[i], addresses[i])
    }
}

// if exist, return the object of the information
// null otherwise
function checkAddress(address, list) {
    for (let obj of list) {
        for (let ads of obj.links) {
            if (address.lastIndexOf(ads.substring(10)) !== -1 &&
                (address.lastIndexOf(ads.substring(10)) === 0 ||
                    address.charAt(address.lastIndexOf(ads.substring(10)) - 1) === ".")) return obj;
        }
    }
    return null;
}

// Add sign and tooltip to the current title node
function addSign(obj, titleNode, address) {
    if (obj !== null) {
        titleNode.parentNode.parentNode.appendChild(htmlToElement(divStart + statusMap[obj.status].svg + getTooltipText(obj) + divEnd));
    }
    else {
        // unknown
        titleNode.parentNode.parentNode.appendChild(htmlToElement(divStart + statusMap.Unknown.svg + getUnknownTooltipText(address) + divEnd));
    }
}

function htmlToElement(html) {
    var template = document.createElement('template');
    html = html.trim();
    template.innerHTML = html;
    return template.content.firstChild;
}

function getTooltipText(info) {
    return `
    <div class="googlecheck-tooltip">
    <div class="googlecheck-tooltip-title">
      <h4>${info.subject}</h4>
    </div>
    <div class="googlecheck-tooltip-status">
      <h4>${info.status}</h4>
    </div>
    <div class="googlecheck-tooltip-desc">
      <p>${info.summary}</p>
    </div>
    <div>
      <span>Last update: ${info.lastUpdate}</span>
    </div>
  </div>
    `
}

function getUnknownTooltipText(address) {
    return `
    <div class="googlecheck-tooltip">
      <div class="googlecheck-tooltip-title">
        <h4>${address.firstChild.firstChild.textContent}</h4>
      </div>
      <div class="googlecheck-tooltip-status">
        <h4>Unknown</h4>
      </div>
      <div class="googlecheck-tooltip-desc">
        <p>This does not directly imply that this source is unreliable. Instead, it might sometimes just be too obvious to point out the reliablility of this source. Use this source with caution. </p>
      </div>
    </div>
    `
}



var l = [
    {
        "subject": "112 Ukraine",
        "status": "Generally unreliable",
        "lastUpdate": "2020",
        "summary": "112 Ukraine was deprecated following a 2019 RfC, which showed overwhelming consensus for the deprecation of a slew of sources associated with Russian disinformation in Ukraine. It was pointed out later in a 2020 RfC that 112 Ukraine had not been explicitly discussed in that first discussion prior to its blacklisting request. Further discussion established a rough consensus that the source is generally unreliable, but did not form a consensus for deprecation or blacklisting. The prior blacklisting was reversed as out of process.",
        "links": [
            "https://*.112.ua",
            "https://*.112.international"
        ]
    },
    {
        "subject": "Ad Fontes Media",
        "status": "Generally unreliable",
        "lastUpdate": "2020",
        "summary": "There is consensus that Ad Fontes Media and their Media Bias Chart should not be used in article space in reference to sources' political leaning or reliability. Editors consider it a self-published source and have questioned its methodology.",
        "links": [
            "https://*.adfontesmedia.com"
        ]
    },
    {
        "subject": "Advameg",
        "status": "Generally unreliable",
        "lastUpdate": "2019",
        "summary": "Advameg operates content farms, including City-Data, that use scraped or improperly licensed content. These sites frequently republish content from Gale's encyclopedias; many editors can obtain access to Gale through The Wikipedia Library free of charge. Advameg's sites are on the Wikipedia spam blacklist, and links must be whitelisted before they can be used.  WP:COPYLINK prohibits linking to copyright violations.",
        "links": [
            "https://*.company-histories.com",
            "https://*.fundinguniverse.com"
        ]
    },
    {
        "subject": "Agence France-Presse",
        "status": "Generally reliable",
        "lastUpdate": "2020",
        "summary": "Agence France-Presse is a news agency. There is consensus that Agence France-Presse is generally reliable. Syndicated reports from Agence France-Presse that are published in other sources are also considered generally reliable.",
        "links": [
            "https://*.afp.com"
        ]
    },
    {
        "subject": "Al Jazeera",
        "status": "Generally reliable",
        "lastUpdate": "2019",
        "summary": "Al Jazeera is considered a generally reliable news organization. Editors perceive Al Jazeera English (and Aljazeera.com) to be more reliable than Al Jazeera's Arabic-language news reporting. Some editors say that Al Jazeera, particularly its Arabic-language media, is a partisan source with respect to the Arab–Israeli conflict. Al Jazeera's news blogs should be handled with the corresponding policy.",
        "links": [
            "https://*.aljazeera.com",
            "https://*.aljazeera.net"
        ]
    },
    {
        "subject": "AlterNet",
        "status": "Generally unreliable",
        "lastUpdate": "2019",
        "summary": "There is consensus that AlterNet is generally unreliable. Editors consider AlterNet a partisan source, and its statements should be attributed. AlterNet's syndicated content should be evaluated by the reliability of its original publisher, and the citation should preferably point to the original publisher.",
        "links": [
            "https://*.alternet.org"
        ]
    },
    {
        "subject": "Anti-Defamation League",
        "status": "Generally reliable",
        "lastUpdate": "2020",
        "summary": "There is consensus that ADL is a generally reliable source, including for topics related to hate groups and extremism in the U.S. There is no consensus that ADL must be attributed in all cases, but there is consensus that the labelling of organisations and individuals by the ADL (particularly as antisemitic) should be attributed. Some editors consider the ADL's opinion pieces not reliable, and that they should only be used with attribution. Some editors consider the ADL a biased source for Israel/Palestine related topics and should be used with caution, if at all.",
        "links": [
            "https://*.adl.org"
        ]
    },
    {
        "subject": "Amazon",
        "status": "Generally unreliable",
        "lastUpdate": "2020",
        "summary": "User reviews on Amazon are anonymous, self-published, and unverifiable, and should not be used at all. Amazon is a reliable source for basic information about a work (such as release date, ISBN, etc.), although it is unnecessary to cite Amazon when the work itself may serve as a source for that information (e.g., authors' names and ISBNs). Future release dates may be unreliable.",
        "links": [
            "https://*.amazon.com",
            "https://*.amazon.cn",
            "https://*.amazon.in",
            "https://*.amazon.co.jp",
            "https://*.amazon.com.sg",
            "https://*.amazon.com.tr",
            "https://*.amazon.fr",
            "https://*.amazon.de",
            "https://*.amazon.it",
            "https://*.amazon.nl",
            "https://*.amazon.es",
            "https://*.amazon.co.uk",
            "https://*.amazon.ca",
            "https://*.amazon.com.mx",
            "https://*.amazon.com.au",
            "https://*.amazon.com.br"
        ]
    },
    {
        "subject": "The American Conservative",
        "status": "No consensus",
        "lastUpdate": "2020",
        "summary": "There is consensus that The American Conservative is a usable source for attributed opinions. As TAC is published by the American Ideas Institute, an advocacy organization, TAC is considered biased or opinionated.",
        "links": [
            "https://*.theamericanconservative.com"
        ]
    },
    {
        "subject": "An Phoblacht",
        "status": "Generally unreliable",
        "lastUpdate": "2020",
        "summary": "There is consensus that An Phoblacht is generally unreliable for news reporting, as it is a publication of Sinn Féin. Under the conditions of WP:ABOUTSELF, An Phoblacht is usable for attributed statements from Sinn Féin and some editors believe that the publication may also be used for attributed statements from the Provisional Irish Republican Army (IRA).",
        "links": [
            "https://*.anphoblacht.com"
        ]
    },
    {
        "subject": "Anadolu Agency",
        "status": "No consensus",
        "lastUpdate": "2019",
        "summary": "The 2019 RfC established no consensus on the reliability of Anadolu Agency. Well-established news outlets are normally considered reliable for statements of fact. However, Anadolu Agency is frequently described as a mouthpiece of the Turkish government that engages in propaganda, owing to its state-run status. It is not generally reliable for topics that are controversial or related to international politics. See also: Anadolu Agency (controversial topics, international politics).",
        "links": [
            "https://*.aa.com.tr%2Fen",
            "https://*.aa.com.tr"
        ]
    },
    {
        "subject": "Anadolu Agency (controversial topics)",
        "status": "Generally unreliable",
        "lastUpdate": "2019",
        "summary": "In the 2019 RfC, editors generally agreed that Anadolu Agency is generally unreliable for topics that are controversial or related to international politics. See also: Anadolu Agency (general topics).",
        "links": [
            "https://*.aa.com.tr%2Fen",
            "https://*.aa.com.tr"
        ]
    },
    {
        "subject": "Ancestry.com",
        "status": "Generally unreliable",
        "lastUpdate": "2020",
        "summary": "Ancestry.com is a genealogy site that hosts a database of primary source documents including marriage and census records. Some of these sources may be usable under WP:BLPPRIMARY, but secondary sources, where available, are usually preferred. Ancestry.com also hosts user-generated content, which is unreliable.",
        "links": [
            "https://*.ancestry.com"
        ]
    },
    {
        "subject": "Answers.com",
        "status": "Generally unreliable",
        "lastUpdate": "2010",
        "summary": "Answers.com (previously known as WikiAnswers) is a Q&amp;A site that incorporates user-generated content. In the past, Answers.com republished excerpts and summaries of tertiary sources, including D&amp;B Hoovers, Gale, and HighBeam Research. Citations of republished content on Answers.com should point to the original source, with a note that the source was accessed \"via Answers.com\". Answers.com also previously served as a Wikipedia mirror; using republished Wikipedia content is considered circular sourcing.",
        "links": [
            "https://*.answers.com"
        ]
    },
    {
        "subject": "Apple Daily",
        "status": "No consensus",
        "lastUpdate": "2020",
        "summary": "The consensus is that Apple Daily is often but not always reliable, and that it may be appropriate to use it in articles about Hong Kong, but subject to editorial judgment, particularly if the topic is controversial and/or Apple Daily is the only source for a contested claim. There is concern that historically, it was not necessarily as reliable as it is today.",
        "links": [
            "https://*.hk.appledaily.com"
        ]
    },
    {
        "subject": "Arab News",
        "status": "No consensus",
        "lastUpdate": "2020",
        "summary": "There is consensus that Arab News is a usable source for topics unrelated to the Saudi Arabian government. As Arab News is closely associated with the Saudi Arabian government and is published in a country with low press freedom, editors consider Arab News biased and non-independent for Saudi Arabian politics, and recommend attribution for its coverage in this area. Some editors consider Arab News unreliable for matters related to the Saudi Arabian government.",
        "links": [
            "https://*.arabnews.com"
        ]
    },
    {
        "subject": "Ars Technica",
        "status": "Generally reliable",
        "lastUpdate": "2012",
        "summary": "Ars Technica is considered generally reliable for science- and technology-related articles.",
        "links": [
            "https://*.arstechnica.com",
            "https://*.arstechnica.co.uk"
        ]
    },
    {
        "subject": "arXiv",
        "status": "Generally unreliable",
        "lastUpdate": "2015",
        "summary": "arXiv is a preprint (and sometimes postprint) repository containing papers that have undergone moderation, but not necessarily peer review. There is consensus that arXiv is a self-published source, and is generally unreliable with the exception of papers authored by established subject-matter experts. Verify whether a paper on arXiv is also published in a peer-reviewed academic journal; in these cases, cite the more reliable journal and provide an open access link to the paper (which may be hosted on arXiv).",
        "links": [
            "https://*.arxiv.org"
        ]
    },
    {
        "subject": "AskMen",
        "status": "No consensus",
        "lastUpdate": "2020",
        "summary": "There is no consensus on the reliability of AskMen. See also: IGN.",
        "links": [
            "https://*.askmen.com"
        ]
    },
    {
        "subject": "Associated Press",
        "status": "Generally reliable",
        "lastUpdate": "2018",
        "summary": "The Associated Press is a news agency. There is consensus that the Associated Press is generally reliable. Syndicated reports from the Associated Press that are published in other sources are also considered generally reliable.",
        "links": [
            "https://*.ap.org",
            "https://*.apnews.com"
        ]
    },
    {
        "subject": "The Atlantic",
        "status": "Generally reliable",
        "lastUpdate": "2019",
        "summary": "The Atlantic is considered generally reliable.",
        "links": [
            "https://*.theatlantic.com"
        ]
    },
    {
        "subject": "The Australian",
        "status": "Generally reliable",
        "lastUpdate": "2020",
        "summary": "The Australian is considered generally reliable. Some editors consider The Australian to be a partisan source. Opinion pieces are covered by WP:RSOPINION and WP:NEWSBLOG. Several editors expressed concern regarding their coverage of Climate Change related topics.",
        "links": [
            "https://*.theaustralian.com.au"
        ]
    },
    {
        "subject": "The A.V. Club",
        "status": "Generally reliable",
        "lastUpdate": "2014",
        "summary": "The A.V. Club is considered generally reliable for film, music and TV reviews.",
        "links": [
            "https://*.avclub.com"
        ]
    },
    {
        "subject": "Axios",
        "status": "Generally reliable",
        "lastUpdate": "2020",
        "summary": "There is consensus that Axios is generally reliable. Some editors consider Axios to be a biased or opinionated source. Statements of opinion should be attributed and evaluated for due weight.",
        "links": [
            "https://*.axios.com"
        ]
    },
    {
        "subject": "Baidu Baike",
        "status": "Deprecated",
        "lastUpdate": "2020",
        "summary": "Baidu Baike was deprecated in the 2020 RfC as it is similar to an open wiki, which is a type of self-published source. Although edits are reviewed by Baidu administrators before they are published, most editors believe the editorial standards of Baidu Baike to be very low, and do not see any evidence of fact-checking. The Baidu 10 Mythical Creatures kuso originated from Baidu Baike.",
        "links": [
            "https://*.baike.baidu.com",
            "https://*.b.baidu.com"
        ]
    },
    {
        "subject": "Ballotpedia",
        "status": "No consensus",
        "lastUpdate": "2016",
        "summary": "There is no consensus on the reliability of Ballotpedia. The site has an editorial team and accepts error corrections, but some editors do not express strong confidence in the site's editorial process. Discussions indicate that Ballotpedia used to be an open wiki, but stopped accepting user-generated content at some point. Currently, the site claims: \"Ballotpedia's articles are 100 percent written by our professional staff of more than 50 writers and researchers.\"[1]",
        "links": [
            "https://*.ballotpedia.org"
        ]
    },
    {
        "subject": "Battery University",
        "status": "Generally unreliable",
        "lastUpdate": "2014",
        "summary": "batteryuniversity.com is a self published website run by one Isidor Buchmann to promote his discredited book on Lithium battery technology. The content of both the website and the book were trawled from the internet and blogs at a time when information on the technology from the battery manufacturers was scarce (and it still is).  The website self confesses this sourcing.  Neither the website nor the book have the backing of a recognised authority on the technology beyond Cadex International, a small battery charger company run by Buchmann himself. Neither batteryuniversity.com nor Cadex International are notable enough to have Wikipedia articles.",
        "links": [
            "https://*.batteryuniversity.com"
        ]
    },
    {
        "subject": "BBC",
        "status": "Generally reliable",
        "lastUpdate": "2020",
        "summary": "BBC is considered generally reliable. This includes BBC News, BBC documentaries, and the BBC History site (on BBC Online). However, this excludes BBC projects that incorporate user-generated content (such as h2g2 and the BBC Domesday Project) and BBC publications with reduced editorial oversight (such as Collective). Statements of opinion should conform to the corresponding guideline.",
        "links": [
            "https://*.bbc.co.uk",
            "https://*.bbc.com"
        ]
    },
    {
        "subject": "Bellingcat",
        "status": "Generally reliable",
        "lastUpdate": "2019",
        "summary": "There is consensus that Bellingcat is generally reliable for news and should preferably be used with attribution. Some editors consider Bellingcat a biased source, as it receives funding from the National Endowment for Democracy.",
        "links": [
            "https://*.bellingcat.com"
        ]
    },
    {
        "subject": "Bild",
        "status": "Generally unreliable",
        "lastUpdate": "2020",
        "summary": "Bild is a tabloid that has been unfavourably compared to The Sun. A few editors consider the source usable in some cases.",
        "links": [
            "https://*.bild.de"
        ]
    },
    {
        "subject": "Biography.com",
        "status": "No consensus",
        "lastUpdate": "2018",
        "summary": "There is no consensus on the reliability of Biography.com. Some editors consider the source reliable because of its backing from A&amp;E Networks and references to the website in news media. Others point to discrepancies between information on Biography.com and on more established sources, and an unclear fact-checking process.",
        "links": [
            "https://*.biography.com"
        ]
    },
    {
        "subject": "Blaze Media",
        "status": "Generally unreliable",
        "lastUpdate": "2018",
        "summary": "Blaze Media (including TheBlaze) is considered generally unreliable for facts. In some cases, it may be usable for attributed opinions. In 2018, TheBlaze merged with Conservative Review (CRTV) to form Blaze Media.[2]",
        "links": [
            "https://*.theblaze.com",
            "https://*.conservativereview.com"
        ]
    },
    {
        "subject": "Blogger",
        "status": "Generally unreliable",
        "lastUpdate": "2020",
        "summary": "Blogger is a blog hosting service that owns the blogspot.com domain. As a self-published source, it is considered generally unreliable and should be avoided unless the author is a subject-matter expert or the blog is used for uncontroversial self-descriptions. Blogger blogs published by a media organization should be evaluated by the reliability of the organization. Newspaper blogs hosted using Blogger should be handled with WP:NEWSBLOG. Blogger should never be used for third-party claims related to living persons; this includes interviews, as even those cannot be authenticated.",
        "links": [
            "https://*.blogspot.com"
        ]
    },
    {
        "subject": "Bloomberg",
        "status": "Generally reliable",
        "lastUpdate": "2019",
        "summary": "Bloomberg publications, including Bloomberg News and Bloomberg Businessweek, are considered generally reliable for news and business topics. See also: Bloomberg profiles.",
        "links": [
            "https://*.bloomberg.com",
            "https://*.businessweek.com"
        ]
    },
    {
        "subject": "Bloomberg profiles",
        "status": "No consensus",
        "lastUpdate": "2018",
        "summary": "Bloomberg company and executive profiles are generally considered to be based on company press releases and should only be used as a source for uncontroversial information. There is consensus that these profiles should not be used to establish notability. Some editors consider these profiles to be akin to self-published sources. See also: Bloomberg.",
        "links": [
            "https://*.bloomberg.com"
        ]
    },
    {
        "subject": "Boing Boing",
        "status": "No consensus",
        "lastUpdate": "2019",
        "summary": "There is no consensus on the reliability of Boing Boing. Although Boing Boing is a group blog, some of its articles are written by subject-matter experts such as Cory Doctorow, who is considered generally reliable for copyright law.",
        "links": [
            "https://*.boingboing.net"
        ]
    },
    {
        "subject": "Breitbart News",
        "status": "Deprecated",
        "lastUpdate": "2020",
        "summary": "Due to persistent abuse, Breitbart News is on the Wikipedia spam blacklist, and links must be whitelisted before they can be used. The site has published a number of falsehoods, conspiracy theories, and intentionally misleading stories. The 2018 RfC showed a very clear consensus that Breitbart News should be deprecated in the same way as the Daily Mail. This does not mean Breitbart News can no longer be used, but it should not be used, ever, as a reference for facts, due to its unreliability. It can still be used as a primary source when attributing opinions, viewpoints, and commentary.",
        "links": [
            "https://*.breitbart.com"
        ]
    },
    {
        "subject": "Burke's Peerage",
        "status": "Generally reliable",
        "lastUpdate": "2020",
        "summary": "Burke's Peerage is considered generally reliable for genealogy.",
        "links": [
            "https://*.burkespeerage.com"
        ]
    },
    {
        "subject": "Business Insider",
        "status": "No consensus",
        "lastUpdate": "2020",
        "summary": "There is no consensus on the reliability of Business Insider. The site's syndicated content, which may not be clearly marked, should be evaluated by the reliability of its original publisher.",
        "links": [
            "https://*.businessinsider.com",
            "https://*.www.insider.com",
            "https://*.thisisinsider.com"
        ]
    },
    {
        "subject": "Bustle",
        "status": "No consensus",
        "lastUpdate": "2019",
        "summary": "There is consensus that the reliability of Bustle is unclear and that its reliability should be decided on an instance by instance basis. Editors noted that it has an editorial policy and that it will issue retractions. Editors also noted previous issues it had around reliability and that its content is written by freelance writers – though there is no consensus on whether this model affects their reliability.",
        "links": [
            "https://*.bustle.com"
        ]
    },
    {
        "subject": "BuzzFeed",
        "status": "No consensus",
        "lastUpdate": "2018",
        "summary": "Editors find the quality of BuzzFeed articles to be highly inconsistent. A 2014 study from the Pew Research Center found BuzzFeed to be the least trusted news source in America.[3] BuzzFeed may use A/B testing for new articles, which may cause article content to change.[4] BuzzFeed operates a separate news division, BuzzFeed News, which has higher editorial standards and is now hosted on a different website. See also: BuzzFeed News.",
        "links": [
            "https://*.buzzfeed.com"
        ]
    },
    {
        "subject": "BuzzFeed News",
        "status": "Generally reliable",
        "lastUpdate": "2019",
        "summary": "There is consensus that BuzzFeed News is generally reliable. BuzzFeed News now operates separately from BuzzFeed, and most news content originally hosted on BuzzFeed was moved to the BuzzFeed News website in 2018.[5] In light of the staff layoffs at BuzzFeed in January 2019, some editors recommend exercising  more caution for BuzzFeed News articles published after this date. The site's opinion pieces should be handled with WP:RSOPINION. See also: BuzzFeed.",
        "links": [
            "https://*.buzzfeednews.com",
            "https://*.buzzfeed.com"
        ]
    },
    {
        "subject": "The Canary",
        "status": "Generally unreliable",
        "lastUpdate": "2020",
        "summary": "Most editors criticize the accuracy of The Canary, and consider it generally unreliable. Editors agree that The Canary is biased or opinionated.",
        "links": [
            "https://*.thecanary.co"
        ]
    },
    {
        "subject": "Cato Institute",
        "status": "No consensus",
        "lastUpdate": "2015",
        "summary": "The Cato Institute is considered generally reliable for its opinion. Some editors consider the Cato Institute an authoritative source on libertarianism in the United States. There is no consensus on whether it is generally reliable on other topics. Most editors consider the Cato Institute biased or opinionated, so its uses should be attributed.",
        "links": [
            "https://*.cato.org"
        ]
    },
    {
        "subject": "CelebrityNetWorth",
        "status": "Generally unreliable",
        "lastUpdate": "2018",
        "summary": "There is consensus that CelebrityNetWorth is generally unreliable. CelebrityNetWorth does not disclose its methodology, and its accuracy has been criticized by The New York Times.[6]",
        "links": [
            "https://*.celebritynetworth.com"
        ]
    },
    {
        "subject": "Center for Economic and Policy Research",
        "status": "No consensus",
        "lastUpdate": "2020",
        "summary": "The Center for Economic and Policy Research is an economic policy think tank. Though its articles are regularly written by subject-matter experts in economics and are frequently cited by reliable sources, most editors consider the CEPR biased or opinionated, so its uses should be attributed.",
        "links": [
            "https://*.cepr.net"
        ]
    },
    {
        "subject": "Centre for Research on Globalization",
        "status": "Generally unreliable",
        "lastUpdate": "2019",
        "summary": "Due to persistent abuse, Global Research is on the Wikipedia spam blacklist, and links must be whitelisted before they can be used. The Centre for Research on Globalization is the organization that operates the Global Research website (globalresearch.ca, not to be confused with GlobalSecurity.org). The CRG is considered generally unreliable due to its propagation of conspiracy theories and lack of editorial oversight. It is biased or opinionated, and its content is likely to constitute undue weight. As it often covers fringe material, parity of sources should be considered.",
        "links": [
            "https://*.globalresearch.ca",
            "https://*.globalresearch.org",
            "https://*.mondialisation.ca"
        ]
    },
    {
        "subject": "CESNUR",
        "status": "Generally unreliable",
        "lastUpdate": "2019",
        "summary": "CESNUR is an apologia site for new religious movements, and thus is inherently unreliable in its core area due to conflicts of interest. There is also consensus that its content is unreliable on its own merits.",
        "links": [
            "https://*.cesnur.net"
        ]
    },
    {
        "subject": "China Global Television Network",
        "status": "Deprecated",
        "lastUpdate": "2020",
        "summary": "China Global Television Network was deprecated in the 2020 RfC for publishing false or fabricated information. Many editors consider CGTN a propaganda outlet, and some editors express concern over CGTN's airing of forced confessions.",
        "links": [
            "https://*.cgtn.com"
        ]
    },
    {
        "subject": "The Christian Science Monitor",
        "status": "Generally reliable",
        "lastUpdate": "2016",
        "summary": "The Christian Science Monitor is considered generally reliable for news.",
        "links": [
            "https://*.csmonitor.com"
        ]
    },
    {
        "subject": "CliffsNotes",
        "status": "No consensus",
        "lastUpdate": "2018",
        "summary": "CliffsNotes is a study guide. Editors consider CliffsNotes usable for superficial analyses of literature, and recommend supplementing CliffsNotes citations with additional sources.",
        "links": [
            "https://*.cliffsnotes.com"
        ]
    },
    {
        "subject": "Climate Feedback",
        "status": "Generally reliable",
        "lastUpdate": "2020",
        "summary": "Climate Feedback is a fact-checking website that is considered generally reliable for topics related to climate change. It discloses its methodologies, is certified by the International Fact-Checking Network, and has been endorsed by other reliable sources. Most editors do not consider Climate Feedback a self-published source due to its high reviewer requirements.",
        "links": [
            "https://*.climatefeedback.org"
        ]
    },
    {
        "subject": "CNET",
        "status": "Generally reliable",
        "lastUpdate": "2015",
        "summary": "CNET is considered generally reliable for technology-related articles.",
        "links": [
            "https://*.cnet.com"
        ]
    },
    {
        "subject": "CNN",
        "status": "Generally reliable",
        "lastUpdate": "12020",
        "summary": "There is consensus that news broadcast or published by CNN is generally reliable. However, iReport consists solely of user-generated content, and talk show content should be treated as opinion pieces. Some editors consider CNN biased, though not to the extent that it affects reliability.",
        "links": [
            "https://*.cnn.com"
        ]
    },
    {
        "subject": "CoinDesk",
        "status": "Generally unreliable",
        "lastUpdate": "2019",
        "summary": "There is consensus that CoinDesk should not be used to establish notability for article topics, and that it should be avoided in favor of more mainstream sources. Check CoinDesk articles for conflict of interest disclosures, and verify whether their parent company (Digital Currency Group) has an ownership stake in a company covered by CoinDesk.[7]",
        "links": [
            "https://*.coindesk.com"
        ]
    },
    {
        "subject": "Common Sense Media",
        "status": "Generally reliable",
        "lastUpdate": "2020",
        "summary": "There is consensus that Common Sense Media is generally reliable for entertainment reviews. As an advocacy organization, Common Sense Media is biased or opinionated, and its statements should generally be attributed.",
        "links": [
            "https://*.commonsensemedia.org"
        ]
    },
    {
        "subject": "The Conversation",
        "status": "Generally reliable",
        "lastUpdate": "2019",
        "summary": "The Conversation publishes articles from academics who are subject-matter experts. It is generally reliable for subjects in the authors' areas of expertise. Opinions published in The Conversation should be handled with WP:RSOPINION.",
        "links": [
            "https://*.theconversation.com"
        ]
    },
    {
        "subject": "Cosmopolitan",
        "status": "No consensus",
        "lastUpdate": "2019",
        "summary": "There is no consensus on the reliability of Cosmopolitan. It is generally regarded as a situational source, which means context is important. The treatment of Cosmopolitan as a source should be decided on a case-by-case basis, depending on the article and the information to be verified.",
        "links": [
            "https://*.cosmopolitan.com"
        ]
    },
    {
        "subject": "CounterPunch",
        "status": "No consensus",
        "lastUpdate": "2020",
        "summary": "There is no consensus regarding the reliability of CounterPunch. As a biased or opinionated source, its statements should be attributed.",
        "links": [
            "https://*.counterpunch.org"
        ]
    },
    {
        "subject": "Cracked.com",
        "status": "Generally unreliable",
        "lastUpdate": "2015",
        "summary": "Cracked.com is a humor website. There is consensus that Cracked.com is generally unreliable. When Cracked.com cites another source for an article, it is preferable for editors to read and cite that source instead.",
        "links": [
            "https://*.cracked.com"
        ]
    },
    {
        "subject": "Crunchbase",
        "status": "Deprecated",
        "lastUpdate": "2019",
        "summary": "In the 2019 RfC, there was consensus to deprecate Crunchbase, but also to continue allowing external links to the website. A significant proportion of Crunchbase's data is user-generated content.",
        "links": [
            "https://*.crunchbase.com"
        ]
    },
    {
        "subject": "The Daily Beast",
        "status": "Generally reliable",
        "lastUpdate": "2020",
        "summary": "The Daily Beast is considered generally reliable for news. Most editors consider The Daily Beast a biased or opinionated source. Some editors advise caution when using this source for controversial statements of fact related to living persons.",
        "links": [
            "https://*.thedailybeast.com"
        ]
    },
    {
        "subject": "The Daily Caller",
        "status": "Deprecated",
        "lastUpdate": "2019",
        "summary": "The Daily Caller was deprecated in the 2019 RfC, which showed consensus that the site publishes false or fabricated information.",
        "links": [
            "https://*.dailycaller.com",
            "https://*.dailycallernewsfoundation.org"
        ]
    },
    {
        "subject": "The Daily Dot",
        "status": "Generally reliable",
        "lastUpdate": "2018",
        "summary": "The Daily Dot is considered generally reliable for Internet culture. Consider whether content from this publication constitutes due weight before citing it in an article.",
        "links": [
            "https://*.dailydot.com"
        ]
    },
    {
        "subject": "Daily Express",
        "status": "Generally unreliable",
        "lastUpdate": "2020",
        "summary": "The Daily Express is a tabloid with a number of similarities to the Daily Mail. It is considered generally unreliable.",
        "links": [
            "https://*.express.co.uk"
        ]
    },
    {
        "subject": "Daily Kos",
        "status": "Generally unreliable",
        "lastUpdate": "2017",
        "summary": "There is consensus that Daily Kos should generally be avoided as a source, especially for controversial political topics where better sources are available. As an activism blog that publishes user-generated content with a progressive point of view, many editors consider Daily Kos to inappropriately blur news reporting and opinion.",
        "links": [
            "https://*.dailykos.com"
        ]
    },
    {
        "subject": "Daily Mail",
        "status": "Deprecated",
        "lastUpdate": "2020",
        "summary": "The Daily Mail was deprecated in the 2017 RfC, and the decision was reaffirmed in the 2019 RfC. There is consensus that the Daily Mail (including its online version, MailOnline) is generally unreliable, and its use as a reference is generally prohibited, especially when other more reliable sources exist. As a result, the Daily Mail should not be used for determining notability, nor should it be used as a source in articles. The Daily Mail may be used in rare cases in an about-self fashion. Some editors regard the Daily Mail as reliable historically, so old articles may be used in a historical context. (Note that dailymail.co.uk is not trustworthy as a source of past content that was printed in the Daily Mail.) The restriction is often incorrectly interpreted as a \"ban\" on the Daily Mail. The UK Daily Mail is not to be confused with other publications named Daily Mail. The dailymail.com domain was previously used by the unaffiliated Charleston Daily Mail, and reference links are still present.",
        "links": [
            "https://*.dailymail.co.uk",
            "https://*.dailymail.com",
            "https://*.dailym.ai",
            "https://*.dailymail.com.au",
            "https://*.thisismoney.co.uk",
            "https://*.pressreader.com%2Fuk%2Fdaily-mail",
            "https://*.pressreader.com%2Fuk%2Fscottish-daily-mail",
            "https://*.pressreader.com%2Fireland%2Firish-daily-mail",
            "https://*.travelmail.co.uk",
            "https://*.findarticles.com%2Fp%2Fnews-articles%2Fdaily-mail-london-england-the%2F"
        ]
    },
    {
        "subject": "Daily Mirror",
        "status": "No consensus",
        "lastUpdate": "2020",
        "summary": "The Daily Mirror is a tabloid newspaper that publishes tabloid journalism. There is no consensus on whether its reliability is comparable to other British tabloids, such as the Daily Mail or The Sun.",
        "links": [
            "https://*.mirror.co.uk"
        ]
    },
    {
        "subject": "Daily Star",
        "status": "Deprecated",
        "lastUpdate": "2020",
        "summary": "The Daily Star was deprecated in the 2020 RfC due to its reputation of publishing false or fabricated information",
        "links": [
            "https://*.dailystar.co.uk"
        ]
    },
    {
        "subject": "The Daily Telegraph",
        "status": "Generally reliable",
        "lastUpdate": "2018",
        "summary": "There is consensus that The Daily Telegraph (also known as The Telegraph) is generally reliable. Some editors believe that The Daily Telegraph is biased or opinionated for politics. Unrelated to The Daily Telegraph (Sydney).",
        "links": [
            "https://*.telegraph.co.uk"
        ]
    },
    {
        "subject": "The Daily Wire",
        "status": "Generally unreliable",
        "lastUpdate": "2020",
        "summary": "There is a strong consensus that The Daily Wire is generally unreliable for factual reporting. Detractors note the site's tendency to share stories that are taken out of context or are improperly verified.[8][9]",
        "links": [
            "https://*.dailywire.com"
        ]
    },
    {
        "subject": "Deadline Hollywood",
        "status": "Generally reliable",
        "lastUpdate": "2019",
        "summary": "Deadline Hollywood is considered generally reliable for entertainment-related articles.",
        "links": [
            "https://*.deadline.com",
            "https://*.deadlinehollywooddaily.com"
        ]
    },
    {
        "subject": "Debrett's",
        "status": "Generally reliable",
        "lastUpdate": "2020",
        "summary": "There is consensus that Debrett's is reliable for genealogical information. However, their defunct \"People of Today\" section is considered similar to Who's Who (UK) as the details were solicited from the subjects. Editors have also raised concerns that this section included paid coverage.",
        "links": [
            "https://*.debretts.com"
        ]
    },
    {
        "subject": "Democracy Now!",
        "status": "No consensus",
        "lastUpdate": "2013",
        "summary": "There is no consensus on the reliability of Democracy Now!. Most editors consider Democracy Now! a partisan source whose statements should be attributed. Syndicated content published by Democracy Now! should be evaluated by the reliability of its original publisher.",
        "links": [
            "https://*.democracynow.org"
        ]
    },
    {
        "subject": "Deseret News",
        "status": "Generally reliable",
        "lastUpdate": "2016",
        "summary": "The Deseret News is considered generally reliable for local news. It is owned by a subsidiary of The Church of Jesus Christ of Latter-day Saints, and there is no consensus on whether the Deseret News is independent of the LDS Church. The publication's statements on topics regarding the LDS Church should be attributed. The Deseret News includes a supplement, the Church News, which is considered a primary source as an official publication of the LDS Church.",
        "links": [
            "https://*.deseretnews.com"
        ]
    },
    {
        "subject": "Digital Spy",
        "status": "Generally reliable",
        "lastUpdate": "2012",
        "summary": "There is consensus that Digital Spy is generally reliable for entertainment and popular culture. Consider whether the information from this source constitutes due or undue weight.",
        "links": [
            "https://*.digitalspy.co.uk",
            "https://*.digitalspy.com"
        ]
    },
    {
        "subject": "The Diplomat",
        "status": "Generally reliable",
        "lastUpdate": "2020",
        "summary": "There is consensus that The Diplomat is generally reliable. Opinion pieces should be evaluated by WP:RSOPINION and WP:NEWSBLOG. Some editors have expressed concern on their reliability for North Korea-related topics.",
        "links": [
            "https://*.thediplomat.com"
        ]
    },
    {
        "subject": "Discogs",
        "status": "Generally unreliable",
        "lastUpdate": "2019",
        "summary": "The content on Discogs is user-generated, and is therefore generally unreliable. There was consensus against deprecating Discogs in a 2019 RfC, as editors noted that external links to the site may be appropriate.",
        "links": [
            "https://*.discogs.com"
        ]
    },
    {
        "subject": "Dotdash",
        "status": "No consensus",
        "lastUpdate": "2020",
        "summary": "Dotdash (formerly known as About.com) operates a network of websites. Editors find the quality of articles published by About.com to be inconsistent. Some editors recommend treating About.com articles as self-published sources, and only using articles published by established experts. About.com also previously served as a Wikipedia mirror; using republished Wikipedia content is considered circular sourcing. In 2017, the About.com website became defunct and some of its content was moved to Dotdash's current website brands.[10][11] Due to persistent abuse, verywellfamily.com, verywellhealth.com, and verywellmind.com are on the Wikipedia spam blacklist, and links must be whitelisted before they can be used. See also: Investopedia.",
        "links": [
            "https://*.about.com",
            "https://*.thebalance.com",
            "https://*.lifewire.com",
            "https://*.thespruce.com",
            "https://*.thoughtco.com",
            "https://*.tripsavvy.com",
            "https://*.verywell.com",
            "https://*.verywellfamily.com",
            "https://*.verywellhealth.com",
            "https://*.verywellmind.com"
        ]
    },
    {
        "subject": "E!",
        "status": "No consensus",
        "lastUpdate": "2019",
        "summary": "There is no consensus on the reliability of the E! television network, including its website E! Online. It is generally regarded as usable for celebrity news. Consider whether the information from this source constitutes due or undue weight, especially when the subject is a living person.",
        "links": [
            "https://*.eonline.com"
        ]
    },
    {
        "subject": "The Economist",
        "status": "Generally reliable",
        "lastUpdate": "2018",
        "summary": "Most editors consider The Economist generally reliable. The Economist publishes magazine blogs and opinion pieces, which should be handled with the respective guidelines.",
        "links": [
            "https://*.economist.com"
        ]
    },
    {
        "subject": "The Electronic Intifada",
        "status": "Generally unreliable",
        "lastUpdate": "2018",
        "summary": "There is consensus that The Electronic Intifada is generally unreliable with respect to its reputation for accuracy, fact-checking, and error-correction. Almost all editors consider The Electronic Intifada a biased and opinionated source, so their statements should be attributed.",
        "links": [
            "https://*.electronicintifada.net"
        ]
    },
    {
        "subject": "Encyclopædia Britannica",
        "status": "No consensus",
        "lastUpdate": "2020",
        "summary": "The Encyclopædia Britannica (including its online edition, Encyclopædia Britannica Online) is a tertiary source with a strong reputation for fact-checking and accuracy. Most editors prefer reliable secondary sources over the Encyclopædia Britannica when available. From 2009 to 2010, the Encyclopædia Britannica Online accepted a small number of content submissions from the general public. Although these submissions undergo the encyclopedia's editorial process, some editors believe that content from non-staff contributors is less reliable than the encyclopedia's staff-authored content. Content authorship is disclosed in the article history.",
        "links": [
            "https://*.britannica.com"
        ]
    },
    {
        "subject": "Encyclopædia Iranica",
        "status": "Generally reliable",
        "lastUpdate": "2020",
        "summary": "The Encyclopædia Iranica is considered generally reliable for Iran-related topics.",
        "links": [
            "https://*.iranicaonline.org"
        ]
    },
    {
        "subject": "Engadget",
        "status": "Generally reliable",
        "lastUpdate": "2012",
        "summary": "Engadget is considered generally reliable for technology-related articles, it's statements should be attributed.",
        "links": [
            "https://*.engadget.com"
        ]
    },
    {
        "subject": "Entertainment Weekly",
        "status": "Generally reliable",
        "lastUpdate": "2018",
        "summary": "Entertainment Weekly is considered generally reliable for entertainment-related articles. There is no consensus on whether it is reliable for other topics.",
        "links": [
            "https://*.ew.com"
        ]
    },
    {
        "subject": "Entrepreneur",
        "status": "No consensus",
        "lastUpdate": "2020",
        "summary": "There is no consensus for the reliability of Entrepreneur Magazine, although there is a consensus that \"contributor\" pieces in the publication should be treated as self-published, similar to Forbes contributors. Editors did not provide much evidence of fabrication in their articles, but were concerned that its coverage tends toward churnalism and may include improperly disclosed paid pieces.",
        "links": [
            "https://*.entrepreneur.com"
        ]
    },
    {
        "subject": "The Epoch Times",
        "status": "Deprecated",
        "lastUpdate": "2020",
        "summary": "The Epoch Times was deprecated in the 2019 RfC. Most editors classify The Epoch Times as an advocacy group for the Falun Gong, and consider the publication a biased or opinionated source that frequently publishes conspiracy theories. As is the case with Breitbart News and Occupy Democrats, this does not mean that The Epoch Times can no longer be used, just that it can never again be used as a reference for facts.",
        "links": [
            "https://*.theepochtimes.com",
            "https://*.epochtimes.com"
        ]
    },
    {
        "subject": "Evening Standard",
        "status": "No consensus",
        "lastUpdate": "2018",
        "summary": "There is no consensus on the reliability of the Evening Standard. Despite being a free newspaper, it is generally considered more reliable than most British tabloids and middle-market newspapers.",
        "links": [
            "https://*.standard.co.uk"
        ]
    },
    {
        "subject": "Examiner.com",
        "status": "Generally unreliable",
        "lastUpdate": "2014",
        "summary": "Due to persistent abuse, Examiner.com is on the Wikipedia spam blacklist, and links must be whitelisted before they can be used. Examiner.com is considered a self-published source, as it has minimal editorial oversight. Most editors believe the site has a poor reputation for accuracy and fact-checking. Prior to 2004, the examiner.com domain was used by The San Francisco Examiner, which has moved to a different domain. Examiner.com was shut down in 2016.",
        "links": [
            "https://*.examiner.com"
        ]
    },
    {
        "subject": "Facebook",
        "status": "Generally unreliable",
        "lastUpdate": "2020",
        "summary": "Facebook is considered generally unreliable because it is a self-published source with no editorial oversight. In the 2020 RfC, there was consensus to add an edit filter to warn users who attempt to cite Facebook as a source, and no consensus on whether Facebook citations should be automatically reverted with XLinkBot.",
        "links": [
            "https://*.facebook.com"
        ]
    },
    {
        "subject": "Fairness and Accuracy in Reporting",
        "status": "No consensus",
        "lastUpdate": "2014",
        "summary": "There is no consensus on the reliability of Fairness and Accuracy in Reporting. However, there is strong consensus that publications from FAIR should not be used to support exceptional claims regarding living persons. Most editors consider FAIR a biased or opinionated source whose statements should be attributed and generally treated as opinions.",
        "links": [
            "https://*.fair.org"
        ]
    },
    {
        "subject": "FamilySearch",
        "status": "Generally unreliable",
        "lastUpdate": "2018",
        "summary": "FamilySearch operates a genealogy site that incorporates a large amount of user-generated content. Editors see no evidence that FamilySearch performs fact-checking, and believe that the site has a questionable reputation for accuracy. FamilySearch also hosts primary source documents, such as birth certificates, which may be usable in limited situations. When using primary source documents from FamilySearch, follow WP:BLPPRIMARY and avoid interpreting them with original research.",
        "links": [
            "https://*.familysearch.org"
        ]
    },
    {
        "subject": "Famous Birthdays",
        "status": "Generally unreliable",
        "lastUpdate": "2019",
        "summary": "Due to persistent abuse, Famous Birthdays is on the Wikipedia spam blacklist, and links must be whitelisted before they can be used. There is consensus that Famous Birthdays is generally unreliable. Famous Birthdays does not provide sources for its content, claim to have an editorial team, or claim to perform fact-checking. Do not use this site for information regarding living persons.",
        "links": [
            "https://*.famousbirthdays.com"
        ]
    },
    {
        "subject": "Fandom",
        "status": "Generally unreliable",
        "lastUpdate": "2019",
        "summary": "Fandom (formerly Wikia and Wikicities) is considered generally unreliable because open wikis are self-published sources. Although citing Wikia as a source is against policy, copying Fandom content into Wikipedia is permissible if it is published under a compatible license (some wikis may use licenses like CC BY-NC and CC BY-NC-ND, which are incompatible). Use the {{Wikia content}} template to provide the necessary attribution in these cases, and ensure the article meets Wikipedia's policies and guidelines after copying.",
        "links": [
            "https://*.fandom.com",
            "https://*.wikia.com",
            "https://*.wikicities.com"
        ]
    },
    {
        "subject": "Financial Times",
        "status": "Generally reliable",
        "lastUpdate": "2018",
        "summary": "The Financial Times is considered generally reliable.",
        "links": [
            "https://*.ft.com"
        ]
    },
    {
        "subject": "Find a Grave",
        "status": "Generally unreliable",
        "lastUpdate": "12020",
        "summary": "The content on Find a Grave is user-generated,[12] and is therefore considered generally unreliable. Links to Find a Grave may sometimes be included in the external links section of articles, when the site offers valuable additional content, such as images not permitted for use on Wikipedia. Take care that the Find a Grave page does not itself contain prohibited content, such as copyright violations.",
        "links": [
            "https://*.findagrave.com"
        ]
    },
    {
        "subject": "Findmypast",
        "status": "Generally unreliable",
        "lastUpdate": "2019",
        "summary": "Findmypast is a genealogy site that hosts transcribed primary source documents, which is covered under WP:BLPPRIMARY. The site's birth and death certificate records include the event's date of registration, not the date of the event itself. Editors caution against interpreting the documents with original research and note that the transcription process may introduce errors. Findmypast also hosts user-generated family trees, which are unreliable. The Wikipedia Library previously offered access to Findmypast.",
        "links": [
            "https://*.findmypast.co.uk"
        ]
    },
    {
        "subject": "Forbes",
        "status": "Generally reliable",
        "lastUpdate": "2020",
        "summary": "Forbes and Forbes.com include articles written by their staff, which are written with editorial oversight, and are generally reliable. Forbes also publishes various \"top\" lists which can be referenced in articles. See also: Forbes.com contributors.",
        "links": [
            "https://*.forbes.com"
        ]
    },
    {
        "subject": "Forbes.com contributors",
        "status": "Generally unreliable",
        "lastUpdate": "2020",
        "summary": "Most content on Forbes.com is written by contributors with minimal editorial oversight, and is generally unreliable. Editors show consensus for treating Forbes.com contributor articles as self-published sources, unless the article was written by a subject-matter expert. Forbes.com contributor articles should never be used for third-party claims about living persons. Articles that have also been published in the print edition of Forbes are excluded, and are considered generally reliable. Check the byline to determine whether an article is written by \"Forbes Staff\" or a \"Contributor\", and check underneath the byline to see whether it was published in a print issue of Forbes. Previously, Forbes.com contributor articles could have been identified by their URL beginning in \"forbes.com/sites\"; the URL no longer distinguishes them, as Forbes staff articles have also been moved under \"/sites\". See also: Forbes.",
        "links": [
            "https://*.forbes.com"
        ]
    },
    {
        "subject": "Fox News",
        "status": "Generally reliable",
        "lastUpdate": "2020",
        "summary": "There is consensus that Fox News is generally reliable for news coverage on topics other than politics and science. See also: Fox News (politics and science), Fox News (talk shows).",
        "links": [
            "https://*.foxnews.com",
            "https://*.foxbusiness.com"
        ]
    },
    {
        "subject": "Fox News (politics and science)",
        "status": "No consensus",
        "lastUpdate": "2020",
        "summary": "There is no consensus on the reliability of Fox News's coverage of politics and science. Use Fox News with caution to verify contentious claims. Editors perceive Fox News to be biased or opinionated for politics; use in-text attribution for opinions. See also: Fox News (news excluding politics and science), Fox News (talk shows).",
        "links": [
            "https://*.foxnews.com"
        ]
    },
    {
        "subject": "Fox News (talk shows)",
        "status": "Generally unreliable",
        "lastUpdate": "2020",
        "summary": "Fox News talk shows, including Hannity, Tucker Carlson Tonight, The Ingraham Angle, and Fox &amp; Friends, should not be used for statements of fact but can sometimes be used for attributed opinions. See also: Fox News (news excluding politics and science), Fox News (politics and science).",
        "links": [
            "https://*.foxnews.com"
        ]
    },
    {
        "subject": "FrontPage Magazine",
        "status": "Deprecated",
        "lastUpdate": "2020",
        "summary": "In the 2020 RfC, there was unanimous consensus to deprecate FrontPage Magazine. Editors consider the publication generally unreliable, and believe that its opinions should be assigned little to no weight. The publication is considered biased or opinionated.",
        "links": [
            "https://*.frontpagemag.com",
            "https://*.frontpagemagazine.com"
        ]
    },
    {
        "subject": "Gamasutra",
        "status": "Generally reliable",
        "lastUpdate": "2020",
        "summary": "Gamasutra is considered generally reliable for subjects related to video games.",
        "links": [
            "https://*.gamasutra.com"
        ]
    },
    {
        "subject": "The Gateway Pundit",
        "status": "Deprecated",
        "lastUpdate": "2019",
        "summary": "The Gateway Pundit was deprecated in the 2019 RfC, which showed consensus that the site is unacceptable as a source. It is unreliable for statements of fact, and given to publishing hoax articles and reporting conspiracy theories as fact.",
        "links": [
            "https://*.thegatewaypundit.com"
        ]
    },
    {
        "subject": "Gawker",
        "status": "Generally unreliable",
        "lastUpdate": "2019",
        "summary": "Gawker is an inactive gossip blog that frequently published articles on rumors and speculation without named authors. When Gawker is the only source for a piece of information, the information would likely constitute undue weight, especially when the subject is a living person. When another reliable source quotes information from Gawker, it is preferable to cite that source instead. In the 2019 RfC, there was no consensus on whether Gawker should be deprecated.",
        "links": [
            "https://*.gawker.com"
        ]
    },
    {
        "subject": "Geni.com",
        "status": "Generally unreliable",
        "lastUpdate": "2019",
        "summary": "Geni.com is a genealogy site that is considered generally unreliable because it is an open wiki, which is a type of self-published source. Primary source documents from Geni.com may be usable under WP:BLPPRIMARY to support reliable secondary sources, but avoid interpreting them with original research.",
        "links": [
            "https://*.geni.com"
        ]
    },
    {
        "subject": "Genius",
        "status": "No consensus",
        "lastUpdate": "2019",
        "summary": "Song lyrics, annotations and descriptions on Genius are mostly user-generated content and are thus generally unreliable. There is no consensus on the reliability of articles, interviews and videos produced by Genius. Verified commentary from musicians fall under WP:BLPSELFPUB, and usage of such commentary should conform to that policy.",
        "links": [
            "https://*.genius.com",
            "https://*.rapgenius.com"
        ]
    },
    {
        "subject": "Global Times",
        "status": "Deprecated",
        "lastUpdate": "2020",
        "summary": "The Global Times is a tabloid owned by the Chinese Communist Party. It was deprecated near-unanimously in a 2020 RfC which found that it publishes false or fabricated information, including pro-Chinese government propaganda and conspiracy theories.",
        "links": [
            "https://*.globaltimes.cn",
            "https://*.huanqiu.com"
        ]
    },
    {
        "subject": "GlobalSecurity.org",
        "status": "No consensus",
        "lastUpdate": "2020",
        "summary": "There is no consensus on the reliability of GlobalSecurity.org. It is not to be confused with globalresearch.ca.",
        "links": [
            "https://*.globalsecurity.org"
        ]
    },
    {
        "subject": "Goodreads",
        "status": "Generally unreliable",
        "lastUpdate": "2018",
        "summary": "Goodreads is a social cataloging site comprising user-generated content. As a self-published source, Goodreads is considered generally unreliable.",
        "links": [
            "https://*.goodreads.com"
        ]
    },
    {
        "subject": "Google Maps",
        "status": "No consensus",
        "lastUpdate": "2017",
        "summary": "Google Maps and Google Street View may be useful for some purposes, including finding and verifying geographic coordinates and other basic information like street names. However, especially for objects like boundaries (of neighborhoods, allotments, etc.), where other reliable sources are available they should be treated preferentially to Google Maps and Google Street View. It can also be difficult or impossible to determine the veracity of past citations, since Google Maps data is not publicly archived, and may be removed or replaced as soon as it is not current. Inferring information solely from Street View pictures may be considered original research. Note that due to restrictions on geographic data in China, OpenStreetMap coordinates for places in mainland China are almost always much more accurate than Google's – despite OpenStreetMap being user-generated – due to the severe distortion introduced by most commercial map providers. (References, in any case, are usually not required for geographic coordinates.)",
        "links": [
            "https://*.maps.google.com",
            "https://*.google.com%2Fmaps"
        ]
    },
    {
        "subject": "The Grayzone",
        "status": "Deprecated",
        "lastUpdate": "2020",
        "summary": "The Grayzone was deprecated in the 2020 RfC. There is consensus that The Grayzone publishes false or fabricated information. Some editors describe The Grayzone as Max Blumenthal's blog, and question the website's editorial oversight.",
        "links": [
            "https://*.thegrayzone.com"
        ]
    },
    {
        "subject": "The Green Papers",
        "status": "No consensus",
        "lastUpdate": "2020",
        "summary": "There is no consensus on the reliability of The Green Papers. As a self-published source that publishes United States election results, some editors question the site's editorial oversight.",
        "links": [
            "https://*.thegreenpapers.com"
        ]
    },
    {
        "subject": "The Guardian",
        "status": "Generally reliable",
        "lastUpdate": "2019",
        "summary": "There is consensus that The Guardian is generally reliable. The Guardian's op-eds should be handled with WP:RSOPINION. Some editors believe The Guardian is biased or opinionated for politics. See also: The Guardian blogs.",
        "links": [
            "https://*.theguardian.com",
            "https://*.guardian.co.uk",
            "https://*.theguardian.co.uk"
        ]
    },
    {
        "subject": "The Guardian blogs",
        "status": "No consensus",
        "lastUpdate": "2020",
        "summary": "Most editors say that The Guardian blogs should be treated as newspaper blogs or opinion pieces due to reduced editorial oversight. Check the bottom of the article for a \"blogposts\" tag to determine whether the page is a blog post or a non-blog article. See also: The Guardian.",
        "links": [
            "https://*.theguardian.com",
            "https://*.guardian.co.uk",
            "https://*.theguardian.co.uk"
        ]
    },
    {
        "subject": "Guido Fawkes",
        "status": "Generally unreliable",
        "lastUpdate": "2020",
        "summary": "The Guido Fawkes website (order-order.com) is considered generally unreliable because it is a self-published blog. It may be used for uncontroversial descriptions of itself and its own content according to WP:ABOUTSELF, but not for claims related to living persons.",
        "links": [
            "https://*.order-order.com"
        ]
    },
    {
        "subject": "Guinness World Records",
        "status": "No consensus",
        "lastUpdate": "2020",
        "summary": "There is consensus that world records verified by Guinness World Records should not be used to establish notability. Editors have expressed concern that post 2008 records include paid coverage.",
        "links": [
            "https://*.guinnessworldrecords.com"
        ]
    },
    {
        "subject": "Haaretz",
        "status": "Generally reliable",
        "lastUpdate": "2018",
        "summary": "Haaretz is considered generally reliable. Some editors believe that Haaretz reports with a political slant, particularly with respect to the Arab–Israeli conflict, which makes it biased or opinionated. The publication's opinion pieces should be handled with the appropriate guideline.",
        "links": [
            "https://*.haaretz.com",
            "https://*.haaretz.co.il"
        ]
    },
    {
        "subject": "Hansard",
        "status": "No consensus",
        "lastUpdate": "2019",
        "summary": "As a transcript of parliament proceedings in the United Kingdom, Hansard is a primary source and its statements should be attributed to whoever made them. Hansard is considered generally reliable for UK parliamentary proceedings and UK government statements. It is not considered reliable as a secondary source as it merely contains the personal opinions of whoever is speaking in Parliament that day, and is subject to Parliamentary privilege. Hansard is not a word-for-word transcript and may omit repetitions and redundancies.",
        "links": [
            "https://*.parliament.uk",
            "https://*.hansard.parliament.uk",
            "https://*.api.parliament.uk%2Fhistoric-hansard",
            "https://*.hansard.millbanksystems.com",
            "https://*.cmhansrd",
            "https://*.ldhansrd"
        ]
    },
    {
        "subject": "Heat Street",
        "status": "Generally unreliable",
        "lastUpdate": "2017",
        "summary": "Although Heat Street was owned by Dow Jones &amp; Company, a usually reputable publisher, many editors note that Heat Street does not clearly differentiate between its news articles and opinion. There is consensus that Heat Street is a partisan source. Some editors consider Heat Street's opinion pieces and news articles written by its staff to be usable with attribution, though due weight must be considered because Heat Street covers many political topics not as talked about in higher-profile sources.",
        "links": [
            "https://*.heatst.com"
        ]
    },
    {
        "subject": "Heavy.com",
        "status": "No consensus",
        "lastUpdate": "2019",
        "summary": "There is consensus that Heavy.com should not be relied upon for any serious or contentious statements, including dates of birth. When Heavy.com cites another source for their own article, it is preferable to read and cite the original source instead.",
        "links": [
            "https://*.heavy.com"
        ]
    },
    {
        "subject": "The Hill",
        "status": "Generally reliable",
        "lastUpdate": "2019",
        "summary": "The Hill is considered generally reliable for American politics. The publication's opinion pieces should be handled with the appropriate guideline. The publication's contributor pieces, labeled in their bylines, receive minimal editorial oversight and should be treated as equivalent to self-published sources.",
        "links": [
            "https://*.thehill.com"
        ]
    },
    {
        "subject": "The Hindu",
        "status": "Generally reliable",
        "lastUpdate": "2020",
        "summary": "There is consensus that The Hindu is generally reliable and should be treated as a newspaper of record. The publication's opinion pieces should be handled with the appropriate guideline.",
        "links": [
            "https://*.thehindu.com"
        ]
    },
    {
        "subject": "HispanTV",
        "status": "Deprecated",
        "lastUpdate": "2019",
        "summary": "HispanTV was deprecated in the 2019 RfC, which showed overwhelming consensus that the TV channel is generally unreliable and sometimes broadcasts outright fabrications. Editors listed multiple examples of HispanTV broadcasting conspiracy theories and Iranian propaganda.",
        "links": [
            "https://*.hispantv.com",
            "https://*.hispantv.ir"
        ]
    },
    {
        "subject": "History",
        "status": "Generally unreliable",
        "lastUpdate": "2020",
        "summary": "Most editors consider The History Channel generally unreliable due to its poor reputation for accuracy and its tendency to broadcast programs that promote conspiracy theories.",
        "links": [
            "https://*.history.com"
        ]
    },
    {
        "subject": "The Hollywood Reporter",
        "status": "Generally reliable",
        "lastUpdate": "2018",
        "summary": "There is consensus that The Hollywood Reporter is generally reliable for entertainment-related topics, including its articles and reviews on film, TV and music, as well as its box office figures.",
        "links": [
            "https://*.hollywoodreporter.com"
        ]
    },
    {
        "subject": "Hope not Hate",
        "status": "No consensus",
        "lastUpdate": "2019",
        "summary": "Most commenters declined to make a general statement about publications from Hope not Hate. Reliability should be assessed on a case by case basis, while taking context into account. Because they are an advocacy group, they are a biased and opinionated source and their statements should be attributed.",
        "links": [
            "https://*.hopenothate.org.uk",
            "https://*.searchlightmagazine.com"
        ]
    },
    {
        "subject": "HuffPost",
        "status": "Generally reliable",
        "lastUpdate": "2020",
        "summary": "A 2020 RfC found HuffPost staff writers fairly reliable for factual reporting on non-political topics, but notes that they may give prominence to topics that support their political bias and less prominence to, or omit, things that contradict it. HuffPost's reliability has increased since 2012; articles before 2012 are less reliable and should be treated with more caution. HuffPost uses clickbait headlines to attract attention to its articles, thus the body text of any HuffPost article is considered more reliable than its headline. See also: HuffPost (politics), HuffPost contributors.",
        "links": [
            "https://*.huffpost.com",
            "https://*.huffingtonpost.com",
            "https://*.huffingtonpost.co.uk",
            "https://*.huffingtonpost.ca",
            "https://*.huffingtonpost.com.au",
            "https://*.huffpostbrasil.com",
            "https://*.huffingtonpost.de",
            "https://*.huffingtonpost.es",
            "https://*.huffingtonpost.fr",
            "https://*.huffingtonpost.gr",
            "https://*.huffingtonpost.in",
            "https://*.huffingtonpost.it",
            "https://*.huffingtonpost.jp",
            "https://*.huffingtonpost.kr",
            "https://*.huffpostmaghreb.com",
            "https://*.huffingtonpost.com.mx"
        ]
    },
    {
        "subject": "HuffPost (politics)",
        "status": "No consensus",
        "lastUpdate": "2020",
        "summary": "In the 2020 RfC, there was no consensus on HuffPost staff writers' reliability for political topics. The community considers HuffPost openly biased on US politics. There is no consensus on its reliability for international politics. See also: HuffPost (excluding politics), HuffPost contributors.",
        "links": [
            "https://*.huffpost.com",
            "https://*.huffingtonpost.com",
            "https://*.huffingtonpost.co.uk",
            "https://*.huffingtonpost.ca",
            "https://*.huffingtonpost.com.au",
            "https://*.huffpostbrasil.com",
            "https://*.huffingtonpost.de",
            "https://*.huffingtonpost.es",
            "https://*.huffingtonpost.fr",
            "https://*.huffingtonpost.gr",
            "https://*.huffingtonpost.in",
            "https://*.huffingtonpost.it",
            "https://*.huffingtonpost.jp",
            "https://*.huffingtonpost.kr",
            "https://*.huffpostmaghreb.com",
            "https://*.huffingtonpost.com.mx"
        ]
    },
    {
        "subject": "HuffPost contributors",
        "status": "Generally unreliable",
        "lastUpdate": "2020",
        "summary": "Until 2018, the US edition of HuffPost published content written by contributors with near-zero editorial oversight. These contributors generally did not have a reputation for fact-checking, and most editors consider them highly variable in quality. Editors show consensus for treating HuffPost contributor articles as self-published sources, unless the article was written by a subject-matter expert. In 2018, HuffPost discontinued its contributor platform, but old contributor articles are still online. Check the byline to determine whether an article is written by a staff member or a \"Contributor\" (also referred to as an \"Editorial Partner\"). See also: HuffPost (excluding politics), HuffPost (politics).",
        "links": [
            "https://*.huffpost.com",
            "https://*.huffingtonpost.com"
        ]
    },
    {
        "subject": "Human Events",
        "status": "No consensus",
        "lastUpdate": "2019",
        "summary": "Editors consider Human Events biased or opinionated, and its statements should be attributed. In May 2019, a former editor-in-chief of Breitbart News became the editor-in-chief of Human Events; articles published after the leadership change are considered generally unreliable. There is no consensus on the reliability of Human Events's older content.",
        "links": [
            "https://*.humanevents.com"
        ]
    },
    {
        "subject": "Idolator",
        "status": "Generally reliable",
        "lastUpdate": "2017",
        "summary": "There is consensus that Idolator is generally reliable for popular music. Consider whether content from this publication constitutes due weight before citing it in an article.",
        "links": [
            "https://*.idolator.com"
        ]
    },
    {
        "subject": "IGN",
        "status": "Generally reliable",
        "lastUpdate": "2017",
        "summary": "There is consensus that IGN is generally reliable for entertainment and popular culture, as well as for film and video game reviews given that attribution is provided. Consider whether the information from this source constitutes due weight before citing it in an article. In addition, articles written by N-Sider are generally unreliable as this particular group of journalists have been found to fabricate articles and pass off speculation as fact. The site's blogs should be handled with WP:RSBLOG. See also: AskMen.",
        "links": [
            "https://*.ign.com"
        ]
    },
    {
        "subject": "IMDb",
        "status": "Generally unreliable",
        "lastUpdate": "2020",
        "summary": "The content on IMDb is user-generated, and the site is considered unreliable by a majority of editors. WP:Citing IMDb describes two exceptions, both of which do not require citations because the film itself is implied to be the primary source. Although certain content on the site is reviewed by staff, editors criticize the quality of IMDb's fact-checking. A number of editors have pointed out that IMDb content has been copied from other sites, including Wikipedia, and that there have been a number of notable hoaxes in the past. The use of IMDb as an external link is generally considered appropriate (see WP:ELP).",
        "links": [
            "https://*.imdb.com"
        ]
    },
    {
        "subject": "The Independent",
        "status": "Generally reliable",
        "lastUpdate": "2019",
        "summary": "The Independent, a British newspaper, is considered a reliable source for non-specialist information. In March 2016, the publication discontinued its print edition to become an online newspaper; some editors advise caution for articles published after this date.",
        "links": [
            "https://*.independent.co.uk"
        ]
    },
    {
        "subject": "Independent Journal Review",
        "status": "No consensus",
        "lastUpdate": "2018",
        "summary": "There is no consensus on the reliability of the Independent Journal Review. Posts from \"community\" members are considered self-published sources. The site's \"news\" section consists mostly of syndicated stories from Reuters, and citations of these stories should preferably point to Reuters.",
        "links": [
            "https://*.ijr.com"
        ]
    },
    {
        "subject": "Independent Media Center",
        "status": "Generally unreliable",
        "lastUpdate": "2020",
        "summary": "The Independent Media Center is an open publishing network. Editors express low confidence in Indymedia's reputation for fact-checking, and consider Indymedia a self-published source.",
        "links": [
            "https://*.indymedia.org",
            "https://*.imc-africa.mayfirst.org",
            "https://*.indymedia.ie",
            "https://*.indymedia.nl",
            "https://*.indymedia.no",
            "https://*.indymedia.org.uk",
            "https://*.midiaindependente.org",
            "https://*.indymediapr.org",
            "https://*.bigmuddyimc.org",
            "https://*.phillyimc.org",
            "https://*.rogueimc.org",
            "https://*.indybay.org",
            "https://*.indymedia.us",
            "https://*.ucimc.org",
            "https://*.antwerpen-indymedia.be",
            "https://*.michiganimc.org",
            "https://*.tnimc.org"
        ]
    },
    {
        "subject": "The Indian Express",
        "status": "Generally reliable",
        "lastUpdate": "2020",
        "summary": "The Indian Express is considered generally reliable under the news organizations guideline.",
        "links": [
            "https://*.indianexpress.com"
        ]
    },
    {
        "subject": "InfoWars",
        "status": "Deprecated",
        "lastUpdate": "2018",
        "summary": "Due to persistent abuse, InfoWars is on both the Wikipedia spam blacklist and the Wikimedia global spam blacklist, and links must be whitelisted before they can be used. InfoWars was deprecated in the 2018 RfC, which showed unanimous consensus that the site publishes fake news and conspiracy theories. The use of InfoWars as a reference should be generally prohibited, especially when other more reliable sources exist. InfoWars should not be used for determining notability, or used as a secondary source in articles.",
        "links": [
            "https://*.infowars.com",
            "https://*.infowars.net",
            "https://*.infowars.tv",
            "https://*.newswars.com"
        ]
    },
    {
        "subject": "Inter Press Service",
        "status": "Generally reliable",
        "lastUpdate": "2011",
        "summary": "The Inter Press Service is a news agency. There is consensus that the Inter Press Service is generally reliable for news.",
        "links": [
            "https://*.ipsnews.net",
            "https://*.ipsnoticias.net",
            "https://*.ipscuba.net"
        ]
    },
    {
        "subject": "The Intercept",
        "status": "Generally reliable",
        "lastUpdate": "12020",
        "summary": "There is consensus that The Intercept is generally reliable for news. Almost all editors consider The Intercept a biased source, so uses may need to be attributed. For science, editors prefer peer-reviewed journals over news sources like The Intercept.",
        "links": [
            "https://*.theintercept.com"
        ]
    },
    {
        "subject": "International Business Times",
        "status": "Generally unreliable",
        "lastUpdate": "2019",
        "summary": "There is consensus that the International Business Times is generally unreliable. Editors note that the publication's editorial practices have been criticized by other reliable sources, and point to the inconsistent quality of the site's articles. The site's syndicated content, which may not be clearly marked, should be evaluated by the reliability of its original publisher.",
        "links": [
            "https://*.ibtimes.com",
            "https://*.ibtimes.com.au",
            "https://*.ibtimes.com.cn",
            "https://*.ibtimes.co.in",
            "https://*.ibtimes.sg",
            "https://*.ibtimes.co.uk"
        ]
    },
    {
        "subject": "International Fact-Checking Network",
        "status": "Generally reliable",
        "lastUpdate": "2020",
        "summary": "The Poynter Institute's International Fact-Checking Network (IFCN) reviews fact-checking organizations according to a code of principles. There is consensus that it is generally reliable for determining the reliability of fact-checking organizations.",
        "links": [
            "https://*.ifcncodeofprinciples.poynter.org"
        ]
    },
    {
        "subject": "Investopedia",
        "status": "No consensus",
        "lastUpdate": "2018",
        "summary": "Investopedia is owned by Dotdash (formerly known as About.com). There is no consensus on the reliability of Investopedia. It is a tertiary source. See also: Dotdash.",
        "links": [
            "https://*.investopedia.com"
        ]
    },
    {
        "subject": "JAMA",
        "status": "Generally reliable",
        "lastUpdate": "2018",
        "summary": "JAMA is a peer-reviewed medical journal published by the American Medical Association. It is considered generally reliable. Opinion pieces from JAMA, including articles from The Jama Forum, are subject to WP:RSOPINION and might not qualify under WP:MEDRS.",
        "links": [
            "https://*.jamanetwork.com"
        ]
    },
    {
        "subject": "Jewish Virtual Library",
        "status": "Generally unreliable",
        "lastUpdate": "2020",
        "summary": "The Jewish Virtual Library is a partisan source which sometimes cites Wikipedia and it is mostly unreliable, especially in its \"Myths &amp; Facts\" section. When it cites sources, those should preferably be read and then cited directly instead. Some exceptions on a case by case basis are possible.",
        "links": [
            "https://*.jewishvirtuallibrary.org"
        ]
    },
    {
        "subject": "Jezebel",
        "status": "No consensus",
        "lastUpdate": "2016",
        "summary": "There is no consensus on the reliability of Jezebel. Most editors believe that Jezebel is biased or opinionated, and that its claims should be attributed. Jezebel should generally not be used for contentious claims, especially ones about living persons.",
        "links": [
            "https://*.jezebel.com"
        ]
    },
    {
        "subject": "Jihad Watch",
        "status": "Generally unreliable",
        "lastUpdate": "2020",
        "summary": "There is consensus that the Jihad Watch is generally unreliable and should not be used as a source of facts.",
        "links": [
            "https://*.jihadwatch.org"
        ]
    },
    {
        "subject": "Know Your Meme",
        "status": "Generally unreliable",
        "lastUpdate": "2020",
        "summary": "Know Your Meme entries, including \"confirmed\" entries, are user-generated and generally unreliable. There is no consensus on the reliability of their video series.",
        "links": [
            "https://*.knowyourmeme.com"
        ]
    },
    {
        "subject": "Last.fm",
        "status": "Deprecated",
        "lastUpdate": "2019",
        "summary": "Last.fm was deprecated in the 2019 RfC. The content on Last.fm is user-generated, and is considered generally unreliable.",
        "links": [
            "https://*.last.fm"
        ]
    },
    {
        "subject": "Lenta.ru",
        "status": "Deprecated",
        "lastUpdate": "2020",
        "summary": "Due to persistent abuse, Lenta.ru is on the Wikipedia spam blacklist, and links to articles published on or after 12 March 2014 must be whitelisted before they can be used. Lenta.ru was deprecated in the 2019 RfC, which showed consensus that the site frequently publishes conspiracy theories and Russian propaganda, owing to a mass dismissal of staff on 12 March 2014. The use of Lenta.ru articles published since 12 March 2014 as references should be generally prohibited, especially when other more reliable sources exist. Lenta.ru should not be used for determining notability, or used as a secondary source in articles.",
        "links": [
            "https://*.lenta.ru"
        ]
    },
    {
        "subject": "LifeSiteNews",
        "status": "Deprecated",
        "lastUpdate": "2019",
        "summary": "LifeSiteNews was deprecated in the 2019 RfC, which showed consensus that the site publishes false or fabricated information.",
        "links": [
            "https://*.lifesitenews.com"
        ]
    },
    {
        "subject": "LinkedIn",
        "status": "Generally unreliable",
        "lastUpdate": "2020",
        "summary": "LinkedIn is a social network. As a self-published source, it is considered generally unreliable and should be avoided unless the post is used for an uncontroversial self-description. Articles on LinkedIn Pulse written by LinkedIn users are also self-published. LinkedIn accounts should only be cited if they are verified accounts or if the user's identity is confirmed in some way. Posts that are not covered by reliable sources are likely to constitute undue weight. LinkedIn should never be used for third-party claims related to living persons.",
        "links": [
            "https://*.linkedin.com"
        ]
    },
    {
        "subject": "LiveJournal",
        "status": "Generally unreliable",
        "lastUpdate": "2020",
        "summary": "LiveJournal is a blog hosting service. As a self-published source, it is considered generally unreliable. LiveJournal can be used for uncontroversial self-descriptions and content from subject-matter experts, but not as a secondary source for living persons.",
        "links": [
            "https://*.livejournal.com"
        ]
    },
    {
        "subject": "LiveLeak",
        "status": "Generally unreliable",
        "lastUpdate": "2019",
        "summary": "Due to persistent abuse, LiveLeak is on the Wikipedia spam blacklist, and links must be whitelisted before they can be used. LiveLeak is an online video platform that hosts user-generated content. Many of the videos on LiveLeak are copyright violations, and should not be linked to per WP:COPYLINK. The use of LiveLeak as a primary source is questionable in most cases, as the provenance of most of the videos is unclear.",
        "links": [
            "https://*.liveleak.com"
        ]
    },
    {
        "subject": "Los Angeles Times",
        "status": "Generally reliable",
        "lastUpdate": "2016",
        "summary": "Most editors consider the Los Angeles Times generally reliable. Refer to WP:NEWSBLOG for the newspaper's blog.",
        "links": [
            "https://*.latimes.com"
        ]
    },
    {
        "subject": "Lulu.com",
        "status": "Generally unreliable",
        "lastUpdate": "2019",
        "summary": "Due to persistent abuse, Lulu.com is on the Wikipedia spam blacklist, and links must be whitelisted before they can be used. Lulu.com is a print-on-demand publisher, which is a type of self-published source. Books published through Lulu.com can be used if they are written by a subject-matter expert. Occasionally, a reputable publisher uses Lulu.com as a printer; in this case, cite the original publisher instead of Lulu.com.",
        "links": [
            "https://*.lulu.com"
        ]
    },
    {
        "subject": "The Mail on Sunday",
        "status": "Deprecated",
        "lastUpdate": "2020",
        "summary": "There is clear and substantial consensus that the Mail on Sunday is generally unreliable, and a slightly narrower consensus that the source should be deprecated. Those supporting deprecation point to factual errors, asserted fabrications, and biased reporting identified on the part of the source, with reference to specific instances, and to common ownership of the source with a previously deprecated source.",
        "links": [
            "https://*.mailonsunday.co.uk",
            "https://*.pressreader.com%2Fuk%2Fthe-mail-on-sunday%2F",
            "https://*.pressreader.com%2Fuk%2Fthe-scottish-mail-on-sunday%2F",
            "https://*.dailymail.co.uk%2Fmailonsunday"
        ]
    },
    {
        "subject": "Marquis Who's Who",
        "status": "Generally unreliable",
        "lastUpdate": "2017",
        "summary": "Marquis Who's Who, including its publication Who's Who in America, is considered generally unreliable. As most of its content is provided by the person concerned, editors generally consider Marquis Who's Who comparable to a self-published source. There is a broad consensus that Marquis Who's Who should not be used to establish notability for article topics. See also: Who's Who (UK).",
        "links": [
            "https://*.marquiswhoswho.com",
            "https://*.whoswhoinamerica.com"
        ]
    },
    {
        "subject": "The Mary Sue",
        "status": "No consensus",
        "lastUpdate": "2016",
        "summary": "There is no consensus on the reliability of The Mary Sue. It is generally regarded as usable for reviews and opinion, though not for its reblogged content.",
        "links": [
            "https://*.themarysue.com"
        ]
    },
    {
        "subject": "Media Bias/Fact Check",
        "status": "Generally unreliable",
        "lastUpdate": "2019",
        "summary": "There is consensus that Media Bias/Fact Check is generally unreliable, as it is self-published. Editors have questioned the methodology of the site's ratings.",
        "links": [
            "https://*.mediabiasfactcheck.com"
        ]
    },
    {
        "subject": "Media Matters for America",
        "status": "No consensus",
        "lastUpdate": "2019",
        "summary": "There is no consensus on the reliability of Media Matters for America. As a biased or opinionated source, their statements should be attributed.",
        "links": [
            "https://*.mediamatters.org"
        ]
    },
    {
        "subject": "Media Research Center",
        "status": "Generally unreliable",
        "lastUpdate": "2020",
        "summary": "There is consensus that the Media Research Center and its subdivisions (e.g. CNSNews.com, MRCTV, and NewsBusters) are generally unreliable for factual reporting. Some editors believe these sources publish false or fabricated information. As biased or opinionated sources, their statements should be attributed.",
        "links": [
            "https://*.mrc.org",
            "https://*.cnsnews.com",
            "https://*.mrctv.org",
            "https://*.newsbusters.org"
        ]
    },
    {
        "subject": "Mediaite",
        "status": "No consensus",
        "lastUpdate": "2019",
        "summary": "There is some consensus that Mediaite is only marginally reliable, and should be avoided where better sources are available. Editors consider the source to inappropriately blur news and opinion, and due weight should be considered if no other reliable sources support a given statement.",
        "links": [
            "https://*.mediaite.com"
        ]
    },
    {
        "subject": "Medium",
        "status": "Generally unreliable",
        "lastUpdate": "2020",
        "summary": "Medium is a blog hosting service. As a self-published source, it is considered generally unreliable and should be avoided unless the author is a subject-matter expert or the blog is used for uncontroversial self-descriptions. Medium should never be used as a secondary source for living persons.",
        "links": [
            "https://*.medium.com"
        ]
    },
    {
        "subject": "Metacritic",
        "status": "Generally reliable",
        "lastUpdate": "2017",
        "summary": "Metacritic is considered generally reliable for its review aggregation and its news articles on film, TV, and video games. There is no consensus on whether its blog articles and critic opinion pages are generally reliable for facts. There is consensus that user reviews on Metacritic are generally unreliable, as they are self-published sources. Reviewers tracked by Metacritic are not automatically reliable for their reviews. On December 2019, video game aggregate site GameRankings shut down and merged with Metacritic.[13][14][15]",
        "links": [
            "https://*.metacritic.com",
            "https://*.gamerankings.com"
        ]
    },
    {
        "subject": "MetalSucks",
        "status": "No consensus",
        "lastUpdate": "2018",
        "summary": "MetalSucks is considered usable for its reviews and news articles. Avoid its overly satirical content and exercise caution when MetalSucks is the only source making a statement.",
        "links": [
            "https://*.metalsucks.net"
        ]
    },
    {
        "subject": "Metro",
        "status": "Generally unreliable",
        "lastUpdate": "2017",
        "summary": "The reliability of Metro has been compared to that of the Daily Mail and other British tabloids. Articles published in the print newspaper (accessible via metro.news domain) are considered more reliable than articles published only on the metro.co.uk website.",
        "links": [
            "https://*.metro.co.uk",
            "https://*.metro.news"
        ]
    },
    {
        "subject": "Middle East Media Research Institute",
        "status": "No consensus",
        "lastUpdate": "2020",
        "summary": "There is no concensus on the reliability of Middle East Media Research Institute or the accuracy of their translations. Editors are polarised between those who consider it to be a reliable source and those who consider it unreliable. Some editors consider MEMRI selective in what it chooses to translate.",
        "links": [
            "https://*.memri.org",
            "https://*.memritv.org"
        ]
    },
    {
        "subject": "MintPress News",
        "status": "Deprecated",
        "lastUpdate": "2019",
        "summary": "MintPress News was deprecated in the 2019 RfC, which showed consensus that the site publishes false or fabricated information.",
        "links": [
            "https://*.mintpressnews.com"
        ]
    },
    {
        "subject": "Le Monde diplomatique",
        "status": "Generally reliable",
        "lastUpdate": "2018",
        "summary": "There is concensus that Le Monde diplomatique is generally reliable. Editors consider Le Monde diplomatique to be a biased and opinionated source.",
        "links": [
            "https://*.monde-diplomatique.fr",
            "https://*.mondediplo.com"
        ]
    },
    {
        "subject": "Mondoweiss",
        "status": "No consensus",
        "lastUpdate": "2019",
        "summary": "Mondoweiss is a news website operated by the Center for Economic Research and Social Change (CERSC), an advocacy organization. There is no consensus on the reliability of Mondoweiss. Editors consider the site biased or opinionated, and its statements should be attributed.",
        "links": [
            "https://*.mondoweiss.net"
        ]
    },
    {
        "subject": "Morning Star",
        "status": "No consensus",
        "lastUpdate": "2019",
        "summary": "The Morning Star is a British tabloid with a low circulation and readership that the New Statesman has described as \"Britain's last communist newspaper\".[16] There is no consensus on whether the Morning Star engages in factual reporting, and broad consensus that it is a biased and partisan source. All uses of the Morning Star should be attributed. Take care to ensure that content from the Morning Star constitutes due weight in the article and conforms to the biographies of living persons policy.",
        "links": [
            "https://*.morningstaronline.co.uk"
        ]
    },
    {
        "subject": "Mother Jones",
        "status": "Generally reliable",
        "lastUpdate": "2019",
        "summary": "There is consensus that Mother Jones is generally reliable. Almost all editors consider Mother Jones a biased source, so its statements (particularly on political topics) may need to be attributed. Consider whether content from this publication constitutes due weight before citing it in an article.",
        "links": [
            "https://*.motherjones.com"
        ]
    },
    {
        "subject": "MSNBC",
        "status": "Generally reliable",
        "lastUpdate": "2019",
        "summary": "There is consensus that MSNBC is generally reliable. Talk show content should be treated as opinion pieces. See also: NBC News",
        "links": [
            "https://*.msnbc.com"
        ]
    },
    {
        "subject": "MyLife",
        "status": "Generally unreliable",
        "lastUpdate": "2019",
        "summary": "Due to persistent abuse, MyLife is on the Wikipedia spam blacklist, and links must be whitelisted before they can be used. MyLife (formerly known as Reunion.com) is an information broker that publishes user-generated content, and is considered generally unreliable.",
        "links": [
            "https://*.mylife.com",
            "https://*.reunion.com"
        ]
    },
    {
        "subject": "The Nation",
        "status": "Generally reliable",
        "lastUpdate": "2020",
        "summary": "There is consensus that The Nation is generally reliable. In the \"About\" section of their website, they identify as progressive. Most editors consider The Nation a partisan source whose statements should be attributed. The publication's opinion pieces should be handled with the appropriate guideline. Take care to ensure that content from The Nation constitutes due weight in the article and conforms to the biographies of living persons policy.",
        "links": [
            "https://*.thenation.com"
        ]
    },
    {
        "subject": "National Enquirer",
        "status": "Deprecated",
        "lastUpdate": "2019",
        "summary": "The National Enquirer is a supermarket tabloid that is considered generally unreliable. In the 2019 RfC, there was weak consensus to deprecate the National Enquirer as a source, but no consensus to create an edit filter to warn editors against using the publication.",
        "links": [
            "https://*.nationalenquirer.com"
        ]
    },
    {
        "subject": "National Geographic",
        "status": "Generally reliable",
        "lastUpdate": "2018",
        "summary": "There is consensus that National Geographic is generally reliable. For coverage by National Geographic of fringe topics and ideas, due weight and parity of sources should be considered.",
        "links": [
            "https://*.nationalgeographic.com"
        ]
    },
    {
        "subject": "National Review",
        "status": "No consensus",
        "lastUpdate": "2018",
        "summary": "There is no consensus on the reliability of National Review. Most editors consider National Review a partisan source whose statements should be attributed. The publication's opinion pieces should be handled with the appropriate guideline. Take care to ensure that content from the National Review constitutes due weight in the article and conforms to the biographies of living persons policy.",
        "links": [
            "https://*.nationalreview.com"
        ]
    },
    {
        "subject": "Natural News",
        "status": "Generally unreliable",
        "lastUpdate": "2019",
        "summary": "Due to persistent abuse, Natural News is on the Wikipedia spam blacklist, and links must be whitelisted before they can be used. There is a near-unanimous consensus that the site repeatedly publishes false or fabricated information, including a large number of conspiracy theories.",
        "links": [
            "https://*.naturalnews.com",
            "https://*.newstarget.com"
        ]
    },
    {
        "subject": "NBC News",
        "status": "Generally reliable",
        "lastUpdate": "2020",
        "summary": "There is consensus that NBC News is generally reliable for news. See also: MSNBC",
        "links": [
            "https://*.nbcnews.com"
        ]
    },
    {
        "subject": "The New American",
        "status": "Generally unreliable",
        "lastUpdate": "2016",
        "summary": "There is consensus that The New American is generally unreliable for factual reporting. Some editors consider it usable for attributed opinions regarding the John Birch Society.",
        "links": [
            "https://*.thenewamerican.com"
        ]
    },
    {
        "subject": "The New Republic",
        "status": "Generally reliable",
        "lastUpdate": "2020",
        "summary": "There is consensus that The New Republic is generally reliable. Most editors consider The New Republic biased or opinionated. Opinions in the magazine should be attributed.",
        "links": [
            "https://*.newrepublic.com"
        ]
    },
    {
        "subject": "New Scientist",
        "status": "Generally reliable",
        "lastUpdate": "2020",
        "summary": "There is consensus that New Scientist magazine is generally reliable for science coverage. Use New Scientist with caution to verify contentious claims.",
        "links": [
            "https://*.newscientist.com"
        ]
    },
    {
        "subject": "New York",
        "status": "Generally reliable",
        "lastUpdate": "2016",
        "summary": "There is consensus that New York magazine, including its subsidiary publication Vulture, is generally reliable. There is no consensus on whether it is generally reliable for contentious statements. See also: Polygon, The Verge, Vox",
        "links": [
            "https://*.nymag.com",
            "https://*.vulture.com",
            "https://*.thecut.com",
            "https://*.grubstreet.com"
        ]
    },
    {
        "subject": "New York Daily News",
        "status": "No consensus",
        "lastUpdate": "2020",
        "summary": "Most editors consider the content of New York Daily News articles to be generally reliable, but question the accuracy of its tabloid-style headlines.",
        "links": [
            "https://*.nydailynews.com"
        ]
    },
    {
        "subject": "New York Post",
        "status": "Generally unreliable",
        "lastUpdate": "2020",
        "summary": "There is consensus that the New York Post is generally unreliable for factual reporting especially with regard to politics, particularly New York City politics. A tabloid newspaper, editors criticise its lack of concern for fact-checking or corrections, including a number of examples of outright fabrication. Editors consider the New York Post more reliable in the period before it changed ownership in 1976, and particularly unreliable for coverage involving the NYC police.",
        "links": [
            "https://*.nypost.com",
            "https://*.pagesix.com"
        ]
    },
    {
        "subject": "The New York Times",
        "status": "Generally reliable",
        "lastUpdate": "2020",
        "summary": "Most editors consider The New York Times generally reliable. WP:RSOPINION should be used to evaluate opinion columns, while WP:NEWSBLOG should be used for the blogs on The New York Times's website. The 2018 RfC cites WP:MEDPOP to establish that popular press sources such as The New York Times should generally not be used to support medical claims.",
        "links": [
            "https://*.nytimes.com"
        ]
    },
    {
        "subject": "The New Yorker",
        "status": "Generally reliable",
        "lastUpdate": "2011",
        "summary": "There is consensus that The New Yorker is generally reliable. Editors note the publication's robust fact-checking process.",
        "links": [
            "https://*.newyorker.com"
        ]
    },
    {
        "subject": "News Break",
        "status": "Deprecated",
        "lastUpdate": "2020",
        "summary": "News Break is a news aggregator that publishes snippets of articles from other sources. In the 2020 RfC, there was consensus to deprecate News Break in favor of the original sources.",
        "links": [
            "https://*.newsbreak.com"
        ]
    },
    {
        "subject": "News of the World",
        "status": "Deprecated",
        "lastUpdate": "2019",
        "summary": "News of the World was deprecated in the 2019 RfC. There is consensus that News of the World is generally unreliable. As is the case with The Sun, News of the World should not be used as a reference in most cases aside from about-self usage, and should not be used to determine notability. Some editors consider News of the World usable for uncontroversial film reviews if attribution is provided. News of the World shut down in 2011.",
        "links": [
            "https://*.newsoftheworld.co.uk",
            "https://*.newsoftheworld.com"
        ]
    },
    {
        "subject": "Newsmax",
        "status": "Deprecated",
        "lastUpdate": "2020",
        "summary": "Newsmax was deprecated by snowball clause consensus in the November 2020 RfC. Concerns of editors included that Newsmax lacks adherence to journalistic standards, launders propaganda, promulgates misinformation, promotes conspiracy theories and false information for political purposes, and promotes medical misinformation such as COVID-19-related falsehoods, conspiracy theories, and anti-vaccination propaganda.",
        "links": [
            "https://*.newsmax.com",
            "https://*.newsmaxtv.com"
        ]
    },
    {
        "subject": "Newsweek (pre-2013)",
        "status": "Generally reliable",
        "lastUpdate": "2019",
        "summary": "There is consensus that articles from Newsweek pre-2013 are generally reliable for news covered during that time. In 2011, Newsweek was a reputable magazine with only some minor problems while it was owned by The Newsweek Daily Beast Company (which also owned The Daily Beast). Blogs under Newsweek, including The Gaggle, should be handled with the WP:NEWSBLOG policy, though. See also: Newsweek (2013–present).",
        "links": [
            "https://*.newsweek.com"
        ]
    },
    {
        "subject": "Newsweek (2013-present)",
        "status": "No consensus",
        "lastUpdate": "2020",
        "summary": "Unlike articles before 2013, post-2013 Newsweek articles are not generally reliable. From 2013 to 2018, Newsweek was owned and operated by IBT Media, the parent company of International Business Times. IBT Media introduced a number of bad practices to the once reputable magazine and mainly focused on clickbait headlines over quality journalism. Its current relationship with IBT Media is unclear, and Newsweek's quality has not returned to its status prior to the 2013 purchase. Many editors have noted that there are several exceptions to this standard, so consensus is to evaluate Newsweek content on a case-by-case basis. See also: Newsweek (pre-2013).",
        "links": [
            "https://*.newsweek.com"
        ]
    },
    {
        "subject": "The Next Web",
        "status": "No consensus",
        "lastUpdate": "2019",
        "summary": "There is no consensus on the reliability of The Next Web. Articles written by contributors may be subject to reduced or no editorial oversight. Avoid using The Next Web's sponsored content.",
        "links": [
            "https://*.thenextweb.com"
        ]
    },
    {
        "subject": "NNDB",
        "status": "Deprecated",
        "lastUpdate": "2019",
        "summary": "NNDB is a biographical database operated by Soylent Communications, the parent company of shock site Rotten.com. It was deprecated in the 2019 RfC. Editors note NNDB's poor reputation for fact-checking and accuracy, despite the site claiming to have an editorial process. Editors have also found instances of NNDB incorporating content from Wikipedia, which would make the use of the affected pages circular sourcing.",
        "links": [
            "https://*.nndb.com"
        ]
    },
    {
        "subject": "NPR",
        "status": "Generally reliable",
        "lastUpdate": "2020",
        "summary": "There is consensus that NPR is generally reliable for news and statements of fact. NPR's opinion pieces should only be used with attribution.",
        "links": [
            "https://*.npr.org"
        ]
    },
    {
        "subject": "Occupy Democrats",
        "status": "Deprecated",
        "lastUpdate": "2018",
        "summary": "In the 2018 RfC, there was clear consensus to deprecate Occupy Democrats as a source à la the Daily Mail. As with Breitbart News, this does not mean it cannot ever be used on Wikipedia; it means it cannot be used as a reference for facts. It can still be used as a primary source for attributing opinions, viewpoints, and the like.",
        "links": [
            "https://*.occupydemocrats.com"
        ]
    },
    {
        "subject": "One America News Network",
        "status": "Deprecated",
        "lastUpdate": "2019",
        "summary": "In the 2019 RfC, there was clear consensus to deprecate One America News Network as a source à la the Daily Mail. Editors noted that One America News Network published a number of falsehoods, conspiracy theories, and intentionally misleading stories. One America News Network should not be used, ever, as a reference for facts, due to its unreliability. It can still be used as a primary source when attributing opinions, viewpoints, and commentary, meaning that it should not be used as a source outside of its own article.",
        "links": [
            "https://*.oann.com"
        ]
    },
    {
        "subject": "The Onion",
        "status": "Generally unreliable",
        "lastUpdate": "2019",
        "summary": "The Onion is a satirical news website, and should not be used as a source for facts.",
        "links": [
            "https://*.theonion.com"
        ]
    },
    {
        "subject": "OpIndia",
        "status": "Generally unreliable",
        "lastUpdate": "2020",
        "summary": "Due to persistent abuse, OpIndia is on the Wikipedia spam blacklist, and links must be whitelisted before they can be used. OpIndia is considered generally unreliable due to its poor reputation for fact-checking and accuracy. OpIndia was rejected by the International Fact-Checking Network when it applied for accreditation in 2019. In the 2020 discussion, most editors expressed support for deprecating OpIndia. Editors consider the site biased or opinionated. The site has directly attacked (and doxed) Wikipedia editors who edit India-related articles. Posting or linking to another editor's personal information is prohibited under the outing policy, unless the editor has voluntarily disclosed the information on Wikipedia. Editors who are subject to legal risks due to their activity on Wikipedia may request assistance from the Wikimedia Foundation, although support is not guaranteed. See also: Swarajya.",
        "links": [
            "https://*.opindia.com",
            "https://*.opindia.in"
        ]
    },
    {
        "subject": "PanAm Post",
        "status": "Generally unreliable",
        "lastUpdate": "2020",
        "summary": "There is consensus that the PanAm Post is generally unreliable for factual reporting. Most editors consider the publication biased or opinionated. Some editors note that the PanAm Post is used by other reliable sources and only believe that its opinion section should be avoided.",
        "links": [
            "https://*.panampost.com"
        ]
    },
    {
        "subject": "Patheos",
        "status": "Generally unreliable",
        "lastUpdate": "2015",
        "summary": "Patheos is a website that hosts a collection of blogs. These blogs receive little editorial oversight and should be treated as self-published sources. Some editors have shown support for including Patheos articles as a source when cited together with other more reliable sources.",
        "links": [
            "https://*.patheos.com"
        ]
    },
    {
        "subject": "Peerage websites",
        "status": "Deprecated",
        "lastUpdate": "2020",
        "summary": "Two RfCs found consensus that certain self-published peerage websites are not reliable for genealogical information and should be deprecated. See §&nbsp;Self-published peerage websites for the full list.",
        "links": []
    },
    {
        "subject": "People",
        "status": "Generally reliable",
        "lastUpdate": "2014",
        "summary": "There is consensus that People magazine can be a reliable source in biographies of living persons, but the magazine should not be used for contentious claims unless supplemented with a stronger source.",
        "links": [
            "https://*.people.com"
        ]
    },
    {
        "subject": "Pew Research Center",
        "status": "Generally reliable",
        "lastUpdate": "2012",
        "summary": "There is consensus that the Pew Research Center is generally reliable.",
        "links": [
            "https://*.pewresearch.org",
            "https://*.people-press.org",
            "https://*.journalism.org",
            "https://*.pewsocialtrends.org",
            "https://*.pewforum.org",
            "https://*.pewinternet.org",
            "https://*.pewhispanic.org",
            "https://*.pewglobal.org"
        ]
    },
    {
        "subject": "PinkNews",
        "status": "Generally reliable",
        "lastUpdate": "2020",
        "summary": "There is rough consensus that PinkNews is generally reliable for factual reporting, but additional considerations may apply and caution should be used. Most of those who commented on PinkNews' reliability for statements about a person's sexuality said that such claims had to be based on direct quotes from the subject.",
        "links": [
            "https://*.pinknews.co.uk"
        ]
    },
    {
        "subject": "Playboy",
        "status": "Generally reliable",
        "lastUpdate": "2015",
        "summary": "There is consensus that Playboy is generally reliable. Editors note the publication's reputation for high-quality interviews and fact-checking.",
        "links": [
            "https://*.playboy.com"
        ]
    },
    {
        "subject": "The Points Guy",
        "status": "No consensus",
        "lastUpdate": "2019",
        "summary": "There is no consensus on the reliability of news articles and reviews on The Points Guy. The Points Guy has advertising relationships with credit card and travel companies, and content involving these companies should be avoided as sources. The Points Guy is currently on the Wikipedia spam blacklist, and links must be whitelisted before they can be used. See also: The Points Guy (sponsored content).",
        "links": [
            "https://*.thepointsguy.com%2Fnews",
            "https://*.thepointsguy.com%2Freviews"
        ]
    },
    {
        "subject": "The Points Guy (sponsored content)",
        "status": "Generally unreliable",
        "lastUpdate": "2019",
        "summary": "There is consensus that sponsored content on The Points Guy, including content involving credit cards, should not be used as sources. The Points Guy has advertising relationships with credit card and travel companies, receiving compensation from readers signing up for credit cards via the website's links. The Points Guy is currently on the Wikipedia spam blacklist, and links must be whitelisted before they can be used. See also: The Points Guy (news and reviews).",
        "links": [
            "https://*.thepointsguy.com"
        ]
    },
    {
        "subject": "Politico",
        "status": "Generally reliable",
        "lastUpdate": "2018",
        "summary": "Politico is considered generally reliable for American politics. A small number of editors say that Politico is a biased source.",
        "links": [
            "https://*.politico.com"
        ]
    },
    {
        "subject": "PolitiFact",
        "status": "Generally reliable",
        "lastUpdate": "2019",
        "summary": "PolitiFact is a reliable source for reporting the veracity of statements made by political candidates. PolitiFact is a reliable source for reporting the percentage of false statements made by a political candidate (of the statements checked by PolitiFact), provided that attribution is given, as a primary source.",
        "links": [
            "https://*.politifact.com"
        ]
    },
    {
        "subject": "Polygon",
        "status": "Generally reliable",
        "lastUpdate": "2020",
        "summary": "Polygon is considered generally reliable for video games and pop culture related topics. See also: The Verge, Vox, New York",
        "links": [
            "https://*.polygon.com"
        ]
    },
    {
        "subject": "Post Millennial",
        "status": "Generally unreliable",
        "lastUpdate": "2020",
        "summary": "There is consensus that The Post Millennial is generally unreliable. Editors have noted multiple instances of inaccurate reporting, and consider the publication to be strongly biased.",
        "links": [
            "https://*.thepostmillennial.com"
        ]
    },
    {
        "subject": "PR Newswire",
        "status": "Generally unreliable",
        "lastUpdate": "2019",
        "summary": "There is consensus that PR Newswire is generally unreliable, as press releases published on the site are not subject to editorial oversight. Some articles may be used for uncontroversial claims about the article's author.",
        "links": [
            "https://*.prnewswire.com",
            "https://*.prnewswire.co.uk"
        ]
    },
    {
        "subject": "Press TV",
        "status": "Generally unreliable",
        "lastUpdate": "12020",
        "summary": "There is consensus that Press TV is generally unreliable. As a state-owned media network in a country with low press freedom, Press TV may be a primary source for the viewpoint of the Iranian government, although due weight should be considered. Press TV is biased or opinionated, and its statements should be attributed. Press TV is particularly known for promoting anti-Semitic conspiracy theories, including Holocaust denial.[17]",
        "links": [
            "https://*.presstv.com",
            "https://*.presstv.ir"
        ]
    },
    {
        "subject": "Pride.com",
        "status": "No consensus",
        "lastUpdate": "2020",
        "summary": "There is consensus that Pride.com is marginally reliable and that its articles should be evaluated for reliability on a case-by-case basis. Editors consider Pride.com comparable to BuzzFeed in its presentation.",
        "links": [
            "https://*.pride.com"
        ]
    },
    {
        "subject": "ProPublica",
        "status": "Generally reliable",
        "lastUpdate": "2019",
        "summary": "There is a strong consensus that ProPublica is generally reliable for all purposes because it has an excellent reputation for fact-checking and accuracy, is widely cited by reliable sources, and has received multiple Pulitzer Prizes.",
        "links": [
            "https://*.propublica.org"
        ]
    },
    {
        "subject": "Quackwatch",
        "status": "No consensus",
        "lastUpdate": "2019",
        "summary": "Articles written by Stephen Barrett on Quackwatch are considered generally reliable (as Barrett is a subject-matter expert) and self-published (as there is disagreement on the comprehensiveness of Quackwatch's editorial process); Barrett's articles should not be used as a source of information on other living persons. Articles written by other authors on Quackwatch are not considered self-published. Many editors believe uses of Quackwatch should be evaluated on a case-by-case basis, and some editors say its statements should be attributed. It may be preferable to use the sources cited by Quackwatch instead of Quackwatch itself. Since it often covers fringe material, parity of sources should be considered.",
        "links": [
            "https://*.quackwatch.org"
        ]
    },
    {
        "subject": "Quadrant",
        "status": "Generally unreliable",
        "lastUpdate": "2019",
        "summary": "Most editors consider Quadrant generally unreliable for factual reporting. The publication is a biased and opinionated source.",
        "links": [
            "https://*.quadrant.org.au"
        ]
    },
    {
        "subject": "Quartz",
        "status": "Generally reliable",
        "lastUpdate": "2020",
        "summary": "Quartz is considered generally reliable for factual reporting, although some editors argue that caution should be used for science and bitcoin topics.",
        "links": [
            "https://*.qz.com"
        ]
    },
    {
        "subject": "Quillette",
        "status": "Generally unreliable",
        "lastUpdate": "2020",
        "summary": "There is consensus that Quillette is generally unreliable for facts, with non-trivial minorities arguing for either full deprecation or \"considerations apply\". Quillette is primarily a publication of opinion, and thus actual usage in articles will usually be a question of whether or not it is WP:DUE for an attributed opinion rather than whether it is reliable for a factual claim.",
        "links": [
            "https://*.quillette.com"
        ]
    },
    {
        "subject": "Quora",
        "status": "Generally unreliable",
        "lastUpdate": "2019",
        "summary": "Quora is a Q&amp;A site. As an Internet forum, it is a self-published source that incorporates user-generated content, and is considered generally unreliable. Posts from verified accounts on Quora can be used as primary sources for statements about themselves. Posts from verified accounts of established experts may also be used to substantiate statements in their field of expertise, in accordance with the policy on self-published sources.",
        "links": [
            "https://*.quora.com"
        ]
    },
    {
        "subject": "Rappler",
        "status": "Generally reliable",
        "lastUpdate": "2018",
        "summary": "There is consensus that staff content by Rappler is generally reliable. The IMHO section consists of opinions by readers, and not by paid staff. The defunct x.rappler.com section functioned as a self-published blogging service, and is therefore considered generally unreliable.",
        "links": [
            "https://*.rappler.com"
        ]
    },
    {
        "subject": "Rate Your Music",
        "status": "Deprecated",
        "lastUpdate": "2019",
        "summary": "Rate Your Music was deprecated in the 2019 RfC. The content on Rate Your Music is user-generated, and is considered generally unreliable.",
        "links": [
            "https://*.rateyourmusic.com",
            "https://*.cinemos.com",
            "https://*.glitchwave.com",
            "https://*.sonemic.com"
        ]
    },
    {
        "subject": "Reason",
        "status": "Generally reliable",
        "lastUpdate": "2020",
        "summary": "There is consensus that Reason is generally reliable for news and facts. Editors consider Reason to be a biased or opinionated source that primarily publishes commentary, analysis, and opinion articles. Statements of opinion should be attributed and evaluated for due weight.",
        "links": [
            "https://*.reason.com"
        ]
    },
    {
        "subject": "Reddit",
        "status": "Generally unreliable",
        "lastUpdate": "2020",
        "summary": "Reddit is a social news and discussion website. Reddit contains mostly user-generated content, and is considered both self-published and generally unreliable. Interview responses written by verified interviewees on the r/IAmA subreddit are primary sources, and editors disagree on their reliability. The policy on the use of sources about themselves applies.",
        "links": [
            "https://*.reddit.com"
        ]
    },
    {
        "subject": "The Register",
        "status": "Generally reliable",
        "lastUpdate": "2017",
        "summary": "The Register is considered generally reliable for technology-related articles. Some editors say that The Register is biased or opinionated on topics involving Wikipedia.",
        "links": [
            "https://*.theregister.co.uk"
        ]
    },
    {
        "subject": "Religion News Service",
        "status": "Generally reliable",
        "lastUpdate": "2020",
        "summary": "Religion News Service is considered generally reliable. Use RNS with caution to verify contentious claims.",
        "links": [
            "https://*.religionnews.com"
        ]
    },
    {
        "subject": "ResearchGate",
        "status": "Generally unreliable",
        "lastUpdate": "2019",
        "summary": "ResearchGate is a social network that hosts a repository of user-generated publications, including preprints. ResearchGate does not perform fact checking or peer reviewing, and is considered a self-published source. Verify whether a paper on ResearchGate is also published in a peer-reviewed academic journal; in these cases, cite the more reliable journal and provide an open access link to the paper (which may be hosted on ResearchGate).",
        "links": [
            "https://*.researchgate.net"
        ]
    },
    {
        "subject": "Republic TV",
        "status": "Generally unreliable",
        "lastUpdate": "2020",
        "summary": "Republic TV was criticized for spreading misinformation about COVID-19, the Love Jihad conspiracy theory, and other fabrications and factually incorrect information.",
        "links": [
            "https://*.republicworld.com",
            "https://*.bharat.republicworld.com"
        ]
    },
    {
        "subject": "Reuters",
        "status": "Generally reliable",
        "lastUpdate": "2018",
        "summary": "Reuters is a news agency. There is consensus that Reuters is generally reliable. Syndicated reports from Reuters that are published in other sources are also considered generally reliable. Press releases published by Reuters are not automatically reliable.",
        "links": [
            "https://*.reuters.com"
        ]
    },
    {
        "subject": "RhythmOne",
        "status": "No consensus",
        "lastUpdate": "2019",
        "summary": "RhythmOne (who acquired All Media Guide, formerly AllRovi) operates the websites AllMusic, AllMovie, and AllGame (defunct). There is consensus that RhythmOne websites are usable for entertainment reviews with attribution. Some editors question the accuracy of these websites for biographical details and recommend more reliable sources when available. Editors also advise against using AllMusic's genre classifications from the website's sidebar. Listings without accompanying prose do not count toward notability.",
        "links": [
            "https://*.allmusic.com",
            "https://*.allmovie.com",
            "https://*.allgame.com"
        ]
    },
    {
        "subject": "RIA Novosti",
        "status": "No consensus",
        "lastUpdate": "2016",
        "summary": "RIA Novosti was an official news agency of the Russian government. There is a broad consensus that it is a biased and opinionated source. It is generally considered usable for official government statements and positions. There is no consensus on whether it is reliable for other topics, though opinions generally lean towards unreliability. See also: Sputnik, which replaced the international edition of RIA Novosti.",
        "links": [
            "https://*.rian.ru",
            "https://*.rian.com.ua"
        ]
    },
    {
        "subject": "Rolling Stone",
        "status": "Generally reliable",
        "lastUpdate": "2019",
        "summary": "There is consensus that Rolling Stone is generally reliable. Rolling Stone's opinion pieces and reviews, as well as any contentious statements regarding living persons, should only be used with attribution. The publication's capsule reviews deserve less weight than their full-length reviews, as they are subject to a lower standard of fact-checking. Some editors say that Rolling Stone is a partisan source in the field of politics, and that their statements in this field should also be attributed.",
        "links": [
            "https://*.rollingstone.com"
        ]
    },
    {
        "subject": "Rotten Tomatoes",
        "status": "Generally reliable",
        "lastUpdate": "2015",
        "summary": "Rotten Tomatoes is considered generally reliable for its review aggregation and its news articles on film and TV. There is no consensus on whether its blog articles and critic opinion pages are generally reliable for facts. There is consensus that user reviews on Rotten Tomatoes are generally unreliable, as they are self-published sources. Reviewers tracked by Rotten Tomatoes are not automatically reliable for their reviews, while there is no consensus on whether their \"Top Critics\" are generally reliable.",
        "links": [
            "https://*.rottentomatoes.com"
        ]
    },
    {
        "subject": "RT",
        "status": "Deprecated",
        "lastUpdate": "2020",
        "summary": "There is consensus that RT is an unreliable source, publishes false or fabricated information, and should be deprecated along the lines of the Daily Mail. Many editors describe RT as a mouthpiece of the Russian government that engages in propaganda and disinformation.",
        "links": [
            "https://*.rt.com"
        ]
    },
    {
        "subject": "Salon",
        "status": "No consensus",
        "lastUpdate": "2018",
        "summary": "There is no consensus on the reliability of Salon. Editors consider Salon biased or opinionated, and its statements should be attributed.",
        "links": [
            "https://*.salon.com"
        ]
    },
    {
        "subject": "Science-Based Medicine",
        "status": "Generally reliable",
        "lastUpdate": "2019",
        "summary": "Science-Based Medicine is considered generally reliable, as it has a credible editorial board, publishes a robust set of editorial guidelines, and has been cited by other reliable sources. Editors do not consider Science-Based Medicine a self-published source, but it is also not a peer-reviewed publication with respect to WP:MEDRS. Since it often covers fringe material, parity of sources may be relevant.",
        "links": [
            "https://*.sciencebasedmedicine.org"
        ]
    },
    {
        "subject": "ScienceBlogs",
        "status": "No consensus",
        "lastUpdate": "2012",
        "summary": "ScienceBlogs is an invitation-only network of blogs. There is no consensus on the reliability of ScienceBlogs articles in general. Most editors consider ScienceBlogs articles written by subject-matter experts reliable, though articles outside the writer's relevant field are not. As a self-published source it should not be used as a source of information on other living persons. Since it often covers fringe material, parity of sources may be relevant.",
        "links": [
            "https://*.scienceblogs.com"
        ]
    },
    {
        "subject": "Scientific American",
        "status": "Generally reliable",
        "lastUpdate": "2020",
        "summary": "Scientific American is considered generally reliable for popular science content. Use WP:MEDPOP to determine whether the publication's medical coverage should be used.",
        "links": [
            "https://*.scientificamerican.com"
        ]
    },
    {
        "subject": "Scribd",
        "status": "Generally unreliable",
        "lastUpdate": "2016",
        "summary": "Scribd operates a self-publishing platform for documents and audiobooks. It is considered generally unreliable, especially for biographies of living persons. Anyone can upload any document they'd like and there is no assurance that it hasn't been manipulated. Many documents on Scribd's self-publishing platform violate copyrights, so linking to them from Wikipedia would also violate the WP:COPYVIOEL guideline and the WP:COPYVIO policy. If a particular document hosted on the platform is in itself reliable, editors are advised to cite the source without linking to the Scribd entry.",
        "links": [
            "https://*.scribd.com"
        ]
    },
    {
        "subject": "Scriptural texts",
        "status": "Generally unreliable",
        "lastUpdate": "2020",
        "summary": "Scriptural texts, like the Bible and the Quran, are primary sources only suitable for attributed, relevant quotes and in compliance with other Wikipedia content policies and guidelines. Content that interprets or summarizes scriptural passages or narratives should generally be cited to appropriate scholarly sources (for example, in the academic field of religious studies) and attributed when appropriate. Analysis of scriptural content by Wikipedia editors is prohibited by the Wikipedia policy regarding original research.",
        "links": []
    },
    {
        "subject": "Sherdog",
        "status": "No consensus",
        "lastUpdate": "2020",
        "summary": "The source was determined to be not self-published and can be used for basic information on MMA fighters and matches. However, it is considered less reliable than ESPN and other generally reliable sources, so use with caution.",
        "links": [
            "https://*.sherdog.com"
        ]
    },
    {
        "subject": "Sixth Tone",
        "status": "No consensus",
        "lastUpdate": "2020",
        "summary": "Sixth Tone is usable for general non-political topics, such as Chinese society and culture. See also: Sixth Tone (politics).",
        "links": [
            "https://*.sixthtone.com"
        ]
    },
    {
        "subject": "Sixth Tone (politics)",
        "status": "Generally unreliable",
        "lastUpdate": "2020",
        "summary": "Sixth Tone is published by the Shanghai United Media Group, which is government-controlled. Editors consider Sixth Tone generally unreliable for politics. See also: Sixth Tone (general topics).",
        "links": [
            "https://*.sixthtone.com"
        ]
    },
    {
        "subject": "The Skeptic's Dictionary",
        "status": "No consensus",
        "lastUpdate": "2020",
        "summary": "The Skeptic's Dictionary is a book by Robert Todd Carroll that expanded into a website. The website is a self-published source (by a subject-matter expert) and should not be used as a source of information on other living persons. Attribution may be necessary. In some cases, it's preferable to read and cite the sources cited by The Skeptic's Dictionary. As it often covers fringe material, parity of sources may be relevant.",
        "links": [
            "https://*.skepdic.com"
        ]
    },
    {
        "subject": "The Skwawkbox",
        "status": "Generally unreliable",
        "lastUpdate": "2020",
        "summary": "The Skwawkbox is considered generally unreliable because it is self-published. Most editors describe The Skwawkbox as biased or opinionated.",
        "links": [
            "https://*.skwawkbox.org"
        ]
    },
    {
        "subject": "Slate",
        "status": "Generally reliable",
        "lastUpdate": "2015",
        "summary": "Slate is considered generally reliable for its areas of expertise. Contrarian news articles may need to be attributed.",
        "links": [
            "https://*.slate.com",
            "https://*.slate.fr"
        ]
    },
    {
        "subject": "Snopes",
        "status": "Generally reliable",
        "lastUpdate": "2020",
        "summary": "Snopes is certified by the International Fact-Checking Network, and is considered generally reliable. Attribution may be necessary. Since it often covers fringe material, parity of sources may be relevant.",
        "links": [
            "https://*.snopes.com"
        ]
    },
    {
        "subject": "Softpedia",
        "status": "No consensus",
        "lastUpdate": "2019",
        "summary": "Softpedia is considered reliable for its software and product reviews. There is no consensus on whether Softpedia news articles are generally reliable.",
        "links": [
            "https://*.softpedia.com"
        ]
    },
    {
        "subject": "SourceWatch",
        "status": "Generally unreliable",
        "lastUpdate": "2016",
        "summary": "As an open wiki, SourceWatch is considered generally unreliable. SourceWatch is operated by the Center for Media and Democracy.",
        "links": [
            "https://*.sourcewatch.org"
        ]
    },
    {
        "subject": "SCMP",
        "status": "Generally reliable",
        "lastUpdate": "2020",
        "summary": "The South China Morning Post is widely considered to be the English-language newspaper of record in Hong Kong. In the 2020 RFC, there was consensus that the SCMP is generally reliable. However, in addition, there is a rough consensus that additional considerations may apply for the newspaper's coverage of certain topics, including the Chinese Communist Party and the SCMP's current owner, Alibaba. Editors may apply higher scrutiny when dealing with the SCMP's coverage of such topics.",
        "links": [
            "https://*.scmp.com"
        ]
    },
    {
        "subject": "Southern Poverty Law Center",
        "status": "Generally reliable",
        "lastUpdate": "2019",
        "summary": "The Southern Poverty Law Center is considered generally reliable on topics related to hate groups and extremism in the United States. As an advocacy group, the SPLC is a biased and opinionated source. The organization's views, especially when labeling hate groups, should be attributed per WP:RSOPINION. Take care to ensure that content from the SPLC constitutes due weight in the article and conforms to the biographies of living persons policy. Some editors have questioned the reliability of the SPLC on non-United States topics. SPLC classifications should not automatically be included in the lead section of the article about the group which received the classification. The decision to include should rather be decided on a case-by-case basis.",
        "links": [
            "https://*.splcenter.org"
        ]
    },
    {
        "subject": "SparkNotes",
        "status": "No consensus",
        "lastUpdate": "2018",
        "summary": "SparkNotes is a study guide. Editors consider SparkNotes usable for superficial analyses of literature, and recommend supplementing SparkNotes citations with additional sources.",
        "links": [
            "https://*.sparknotes.com"
        ]
    },
    {
        "subject": "The Spectator",
        "status": "No consensus",
        "lastUpdate": "2020",
        "summary": "The Spectator primarily consists of opinion pieces and these should be judged by WP:RSOPINION and WP:NEWSBLOG.",
        "links": [
            "https://*.spectator.co.uk",
            "https://*.spectator.us"
        ]
    },
    {
        "subject": "Der Spiegel",
        "status": "Generally reliable",
        "lastUpdate": "2018",
        "summary": "There is consensus that Der Spiegel is generally reliable. Articles written by Claas Relotius are generally unreliable as this particular journalist has been found to fabricate articles.",
        "links": [
            "https://*.spiegel.de"
        ]
    },
    {
        "subject": "Sputnik",
        "status": "Deprecated",
        "lastUpdate": "2020",
        "summary": "There is consensus that Sputnik is an unreliable source that publishes false or fabricated information, and should be deprecated as in the 2017 RfC of the Daily Mail. Sputnik is considered a Russian propaganda outlet that engages in bias and disinformation,[18] a significant proportion of editors endorse that view, with some editors considering it less reliable than Breitbart News. See also: RIA Novosti, whose international edition was replaced by Sputnik.",
        "links": [
            "https://*.sputniknews.com"
        ]
    },
    {
        "subject": "Stack Exchange",
        "status": "Generally unreliable",
        "lastUpdate": "2018",
        "summary": "Stack Exchange is a network of Q&amp;A sites, including Stack Overflow, MathOverflow, and Ask Ubuntu. As an Internet forum, it is a self-published source that incorporates user-generated content, and is considered generally unreliable.",
        "links": [
            "https://*.stackexchange.com",
            "https://*.stackoverflow.com",
            "https://*.serverfault.com",
            "https://*.superuser.com",
            "https://*.askubuntu.com",
            "https://*.mathoverflow.net"
        ]
    },
    {
        "subject": "starsunfolded.com",
        "status": "Generally unreliable",
        "lastUpdate": "2020",
        "summary": "There is consensus that StarsUnfolded is unreliable as it is a self published source.",
        "links": [
            "https://*.starsunfolded.com"
        ]
    },
    {
        "subject": "The Sun",
        "status": "Deprecated",
        "lastUpdate": "12020",
        "summary": "The Sun was deprecated in the 2019 RfC. There is consensus that The Sun is generally unreliable. References from The Sun are actively discouraged from being used in any article and they should not be used for determining the notability of any subject. The RfC does not override WP:ABOUTSELF, which allows the use of The Sun for uncontroversial self-descriptions. Some editors consider The Sun usable for uncontroversial sports reporting, although more reliable sources are recommended.",
        "links": [
            "https://*.thesun.co.uk",
            "https://*.thesun.ie",
            "https://*.thescottishsun.co.uk",
            "https://*.thesun.mobi",
            "https://*.sunnation.co.uk",
            "https://*.the-sun.com"
        ]
    },
    {
        "subject": "Swarajya",
        "status": "Generally unreliable",
        "lastUpdate": "2020",
        "summary": "Due to persistent abuse, Swarajya is on the Wikipedia spam blacklist, and links must be whitelisted before they can be used. Swarajya is considered generally unreliable due to its poor reputation for fact-checking and accuracy. In the 2020 discussion, most editors expressed support for deprecating Swarajya. Editors consider the publication biased or opinionated. Swarajya was formerly the parent publication of OpIndia, and frequently republishes content from OpIndia under the \"Swarajya Staff\" byline. See also: OpIndia.",
        "links": [
            "https://*.swarajyamag.com"
        ]
    },
    {
        "subject": "Taki's Magazine",
        "status": "Deprecated",
        "lastUpdate": "2019",
        "summary": "Taki's Magazine was deprecated in the 2019 RfC, which showed consensus that it is an unreliable opinion magazine that should be avoided outside of very limited exceptions (e.g. WP:ABOUTSELF).",
        "links": [
            "https://*.takimag.com"
        ]
    },
    {
        "subject": "TASS",
        "status": "No consensus",
        "lastUpdate": "2019",
        "summary": "In the 2019 RfC, editors argued that the reliability of TASS varies based on the subject matter. Editors consider TASS fairly reliable for statements of fact as stated by the Russian government, but also agree that there are deficiencies in the reliability of TASS's reporting on other issues.",
        "links": [
            "https://*.tass.com",
            "https://*.tass.ru"
        ]
    },
    {
        "subject": "TechCrunch",
        "status": "No consensus",
        "lastUpdate": "2018",
        "summary": "Careful consideration should be given to whether a piece is written by staff or as a part of their blog, as well as whether the piece/writer may have a conflict of interest, and to what extent they rely on public relations material from their subject for their writing. TechCrunch may be useful for satisfying verifiability, but may be less useful for the purpose of determining notability.",
        "links": [
            "https://*.techcrunch.com"
        ]
    },
    {
        "subject": "Telesur",
        "status": "Deprecated",
        "lastUpdate": "2019",
        "summary": "Telesur was deprecated in the 2019 RfC, which showed consensus that the TV channel is a Bolivarian propaganda outlet. Many editors state that Telesur publishes false information. As a state-owned media network in a country with low press freedom, Telesur may be a primary source for the viewpoint of the Venezuelan government, although due weight should be considered. Telesur is biased or opinionated, and its statements should be attributed.",
        "links": [
            "https://*.telesurtv.net",
            "https://*.telesurenglish.net"
        ]
    },
    {
        "subject": "TheWrap",
        "status": "Generally reliable",
        "lastUpdate": "2017",
        "summary": "As an industry trade publication, there is consensus that TheWrap is a good source for entertainment news and media analysis. There is no consensus regarding the reliability of TheWrap's articles on other topics.",
        "links": [
            "https://*.thewrap.com"
        ]
    },
    {
        "subject": "ThinkProgress",
        "status": "No consensus",
        "lastUpdate": "2013",
        "summary": "Discussions of ThinkProgress are dated, with the most recent in 2013. Circumstances may have changed. Some consider ",
        "links": [
            "https://*.thinkprogress.org"
        ]
    },
    {
        "subject": "Time",
        "status": "Generally reliable",
        "lastUpdate": "2019",
        "summary": "There is consensus that Time is generally reliable. Time",
        "links": [
            "https://*.time.com"
        ]
    },
    {
        "subject": "The Times",
        "status": "Generally reliable",
        "lastUpdate": "2015",
        "summary": "The Times, including its sister paper The Sunday Times, is considered generally reliable.",
        "links": [
            "https://*.thetimes.co.uk",
            "https://*.thesundaytimes.co.uk",
            "https://*.timesonline.co.uk"
        ]
    },
    {
        "subject": "The Times of India",
        "status": "No consensus",
        "lastUpdate": "2020",
        "summary": "The Times of India",
        "links": [
            "https://*.timesofindia.com"
        ]
    },
    {
        "subject": "TMZ",
        "status": "No consensus",
        "lastUpdate": "2016",
        "summary": "There is no consensus on the reliability of TMZ. Although TMZ is cited by reliable sources, most editors consider TMZ a low-quality source and prefer more reliable sources when available. Because TMZ frequently publishes articles on rumors and speculation without named authors, it is recommended to attribute statements from TMZ. When TMZ is the only source for a piece of information, consider whether the information constitutes due or undue weight, especially when the subject is a living person.",
        "links": [
            "https://*.tmz.com"
        ]
    },
    {
        "subject": "TorrentFreak",
        "status": "Generally reliable",
        "lastUpdate": "2019",
        "summary": "Most editors consider TorrentFreak generally reliable on topics involving file sharing. Editors note references to the website in mainstream media. The source may or may not be reliable for other topics.",
        "links": [
            "https://*.torrentfreak.com"
        ]
    },
    {
        "subject": "Townhall",
        "status": "No consensus",
        "lastUpdate": "2010",
        "summary": "As of 2010, a few editors commented that opinion pieces in Townhall are reliable as a source for the opinion of the author of the individual piece, although they may not be reliable for unattributed statements of fact, and context will dictate whether the opinion of the author as such, meets the standard of WP:DUEWEIGHT.",
        "links": [
            "https://*.townhall.com"
        ]
    },
    {
        "subject": "TRT World",
        "status": "No consensus",
        "lastUpdate": "2019",
        "summary": "Consensus exists that TRT World is reliable for statements regarding the official views of the Turkish government but not reliable for subjects with which the Turkish government could be construed to have a conflict of interest. For other miscellaneous cases, it shall be assumed to be reliable enough.",
        "links": [
            "https://*.trtworld.com"
        ]
    },
    {
        "subject": "The Truth About Guns",
        "status": "Generally unreliable",
        "lastUpdate": "2019",
        "summary": "The Truth About Guns is a group blog. There is consensus that TTAG does not have a strong reputation for fact-checking and accuracy. TTAG has promoted conspiracy theories, and does not clearly label its sponsored content. Editors agree that TTAG is biased or opinionated. Opinions in TTAG are likely to constitute undue weight.",
        "links": [
            "https://*.thetruthaboutguns.com"
        ]
    },
    {
        "subject": "Tunefind",
        "status": "Generally unreliable",
        "lastUpdate": "2019",
        "summary": "Tunefind is almost entirely composed of user-generated content, and is a self-published source.",
        "links": [
            "https://*.tunefind.com"
        ]
    },
    {
        "subject": "TV Guide",
        "status": "Generally reliable",
        "lastUpdate": "2012",
        "summary": "TV Guide is considered generally reliable for television-related topics. Some editors consider TV Guide a primary source for air dates.",
        "links": [
            "https://*.tvguide.com",
            "https://*.tvguidemagazine.com"
        ]
    },
    {
        "subject": "TV Tropes",
        "status": "Generally unreliable",
        "lastUpdate": "2016",
        "summary": "TV Tropes is considered generally unreliable because it is an open wiki, which is a type of self-published source.",
        "links": [
            "https://*.tvtropes.org"
        ]
    },
    {
        "subject": "Twitter",
        "status": "Generally unreliable",
        "lastUpdate": "12020",
        "summary": "Twitter is a social network. As a self-published source, it is considered generally unreliable and should be avoided unless the author is a subject-matter expert or the tweet is used for an uncontroversial self-description. In most cases, Twitter accounts should only be cited if they are verified accounts or if the user's identity is confirmed in some way. Tweets that are not covered by reliable sources are likely to constitute undue weight. Twitter should never be used for third-party claims related to living persons.",
        "links": [
            "https://*.twitter.com"
        ]
    },
    {
        "subject": "Urban Dictionary",
        "status": "Generally unreliable",
        "lastUpdate": "2020",
        "summary": "Urban Dictionary is considered generally unreliable, because it consists solely of user-generated content.",
        "links": [
            "https://*.urbandictionary.com"
        ]
    },
    {
        "subject": "U.S. News & World Report",
        "status": "Generally reliable",
        "lastUpdate": "2020",
        "summary": "There is consensus that U.S. News &amp; World Report is generally reliable.",
        "links": [
            "https://*.usnews.com"
        ]
    },
    {
        "subject": "Us Weekly",
        "status": "No consensus",
        "lastUpdate": "2018",
        "summary": "There is no consensus on the reliability of Us Weekly. It is often considered less reliable than People magazine.",
        "links": [
            "https://*.usmagazine.com"
        ]
    },
    {
        "subject": "USA Today",
        "status": "Generally reliable",
        "lastUpdate": "2018",
        "summary": "There is consensus that USA Today is generally reliable. Editors note the publication's robust editorial process and its centrist alignment.",
        "links": [
            "https://*.usatoday.com"
        ]
    },
    {
        "subject": "Vanity Fair",
        "status": "Generally reliable",
        "lastUpdate": "2019",
        "summary": "Vanity Fair is considered generally reliable for popular culture.",
        "links": [
            "https://*.vanityfair.com"
        ]
    },
    {
        "subject": "Variety",
        "status": "Generally reliable",
        "lastUpdate": "2016",
        "summary": "As an entertainment trade magazine, Variety is considered a reliable source in its field.",
        "links": [
            "https://*.variety.com"
        ]
    },
    {
        "subject": "VDARE",
        "status": "Deprecated",
        "lastUpdate": "2019",
        "summary": "VDARE was deprecated in the 2018 RfC. Editors agree that it is generally unusable as a source, although there may be rare exceptions such as in identifying its writers in an about-self fashion. Such limited instances will only be under careful and guided (\"filtered\") discretion.",
        "links": [
            "https://*.vdare.com"
        ]
    },
    {
        "subject": "Venezuelanalysis",
        "status": "Generally unreliable",
        "lastUpdate": "2019",
        "summary": "There is consensus that Venezuelanalysis is generally unreliable. Some editors consider Venezuelanalysis a Bolivarian propaganda outlet, and most editors question its accuracy. Almost all editors describe the site as biased or opinionated, so its claims should be attributed.",
        "links": [
            "https://*.venezuelanalysis.com"
        ]
    },
    {
        "subject": "VentureBeat",
        "status": "Generally reliable",
        "lastUpdate": "2015",
        "summary": "VentureBeat is considered generally reliable for articles relating to businesses, technology and video games.",
        "links": [
            "https://*.venturebeat.com"
        ]
    },
    {
        "subject": "The Verge",
        "status": "Generally reliable",
        "lastUpdate": "2019",
        "summary": "There is broad consensus that The Verge is a reliable source for use in articles relating to technology, science, and automobiles. Some editors question the quality of The Verge's instructional content on computer hardware. See also: Vox, Polygon, New York",
        "links": [
            "https://*.theverge.com"
        ]
    },
    {
        "subject": "Veterans Today",
        "status": "Deprecated",
        "lastUpdate": "2019",
        "summary": "Due to persistent abuse, Veterans Today is on the Wikipedia spam blacklist, and links must be whitelisted before they can be used. Veterans Today was deprecated in the 2019 RfC, which showed unanimous consensus that the site publishes fake news and antisemitic conspiracy theories. The use of Veterans Today as a reference should be generally prohibited, especially when other more reliable sources exist. Veterans Today should not be used for determining notability, or used as a secondary source in articles.",
        "links": [
            "https://*.veteranstoday.com"
        ]
    },
    {
        "subject": "VGChartz",
        "status": "Generally unreliable",
        "lastUpdate": "2019",
        "summary": "In the 2019 RfC, editors unanimously agreed that VGChartz is generally unreliable. The site consists mainly of news articles that qualify as user-generated content. In addition, editors heavily criticize VGChartz for poor accuracy standards in its video game sales data, and its methodology page consists of wholly unverified claims.[19] If other reliable sources publish video game sales data for certain regions (usually The NPD Group, Chart-Track, and/or Media Create), it is strongly advised that editors cite those sources instead.",
        "links": [
            "https://*.vgchartz.com"
        ]
    },
    {
        "subject": "Vice Media",
        "status": "No consensus",
        "lastUpdate": "2019",
        "summary": "There is no consensus on the reliability of Vice Media publications.",
        "links": [
            "https://*.vice.com",
            "https://*.refinery29.com"
        ]
    },
    {
        "subject": "Vogue",
        "status": "Generally reliable",
        "lastUpdate": "2018",
        "summary": "Vogue is considered generally reliable. Potentially contentious statements made by Vogue interview subjects can be attributed to the individual.",
        "links": [
            "https://*.vogue.com"
        ]
    },
    {
        "subject": "Voltaire Network",
        "status": "Deprecated",
        "lastUpdate": "2020",
        "summary": "The Voltaire Network is considered unreliable due to its affiliation with conspiracy theorist Thierry Meyssan and its republication of articles from Global Research. Editors unanimously agreed to deprecate the Voltaire Network in the 2020 RfC.",
        "links": [
            "https://*.voltairenet.org"
        ]
    },
    {
        "subject": "Vox",
        "status": "Generally reliable",
        "lastUpdate": "2020",
        "summary": "Vox is considered generally reliable. Some editors say that Vox is a partisan source in the field of politics. See also: Polygon, The Verge, New York ",
        "links": [
            "https://*.vox.com"
        ]
    },
    {
        "subject": "The Wall Street Journal",
        "status": "Generally reliable",
        "lastUpdate": "2019",
        "summary": "Most editors consider The Wall Street Journal generally reliable for news. Use WP:NEWSBLOG to evaluate the newspaper's blogs, including Washington Wire. Use WP:RSOPINION for opinion pieces.",
        "links": [
            "https://*.wsj.com"
        ]
    },
    {
        "subject": "Washington Examiner",
        "status": "No consensus",
        "lastUpdate": "2020",
        "summary": "There is no consensus on the reliability of the Washington Examiner, but there is consensus that it should not be used to substantiate exceptional claims. Almost all editors consider the Washington Examiner a partisan source and believe that statements from this publication should be attributed. The Washington Examiner publishes opinion columns, which should be handled with the appropriate guideline.",
        "links": [
            "https://*.washingtonexaminer.com"
        ]
    },
    {
        "subject": "The Washington Post",
        "status": "Generally reliable",
        "lastUpdate": "2020",
        "summary": "Most editors consider The Washington Post generally reliable. Some editors note that WP:NEWSBLOG should be used to evaluate blog posts on The Washington Post's website.",
        "links": [
            "https://*.washingtonpost.com"
        ]
    },
    {
        "subject": "The Washington Times",
        "status": "No consensus",
        "lastUpdate": "2020",
        "summary": "There is consensus that The Washington Times is marginally reliable, and should be avoided when more reliable sources are available. The Washington Times is considered partisan for US politics, especially with regard to climate change and US race relations.",
        "links": [
            "https://*.washingtontimes.com"
        ]
    },
    {
        "subject": "The Weekly Standard",
        "status": "Generally reliable",
        "lastUpdate": "2014",
        "summary": "The Weekly Standard is considered generally reliable, but much of their published content is opinion and should be attributed as such. Most editors say this magazine is a partisan source.",
        "links": [
            "https://*.weeklystandard.com"
        ]
    },
    {
        "subject": "The Western Journal",
        "status": "Generally unreliable",
        "lastUpdate": "2019",
        "summary": "In the 2019 RfC, there was consensus that The Western Journal is generally unreliable, but no consensus on whether The Western Journal should be deprecated. The publication's syndicated content should be evaluated by the reliability of its original publisher.",
        "links": [
            "https://*.westernjournal.com"
        ]
    },
    {
        "subject": "WhatCulture",
        "status": "Generally unreliable",
        "lastUpdate": "2020",
        "summary": "WhatCulture is considered generally unreliable. Contributors \"do not need to have any relevant experience or hold any particular qualifications\" and editors note a poor record of fact checking. It is listed as an unreliable source by WikiProject Professional wrestling.",
        "links": [
            "https://*.whatculture.com"
        ]
    },
    {
        "subject": "Who's Who (UK)",
        "status": "No consensus",
        "lastUpdate": "2019",
        "summary": "There is no consensus on the reliability of Who's Who UK. It is a reference work with information mainly collected from the people concerned. Editors are divided on whether sufficient editorial control exists, and whether it is an independent source. It is generally considered more reliable than Marquis Who's Who, which is published in the United States. See also: Marquis Who's Who.",
        "links": [
            "https://*.ukwhoswho.com"
        ]
    },
    {
        "subject": "WhoSampled",
        "status": "Generally unreliable",
        "lastUpdate": "2016",
        "summary": "WhoSampled is almost entirely composed of user-generated content, and is a self-published source.",
        "links": [
            "https://*.whosampled.com"
        ]
    },
    {
        "subject": "Wikidata",
        "status": "Generally unreliable",
        "lastUpdate": "2018",
        "summary": "Wikidata is largely user-generated, and articles should not directly cite Wikidata as a source (just as it would be inappropriate to cite other Wikipedias' articles as sources). See also: Wikidata transcluded statements.",
        "links": [
            "https://*.wikidata.org"
        ]
    },
    {
        "subject": "Wikidata transcluded statements",
        "status": "No consensus",
        "lastUpdate": "2018",
        "summary": "Uniquely among WMF sites, Wikidata's statements can be directly transcluded into articles; this is usually done to provide external links or infobox data. For example, more than two million external links from Wikidata are shown through the {{Authority control}} template. There has been controversy over the use of Wikidata in the English Wikipedia due to its infancy, its vandalism issues and its sourcing. While there is no consensus on whether information from Wikidata should be used at all, there is general agreement that any Wikidata statements transcluded need to be just as – or more – reliable compared to Wikipedia content. As such, Module:WikidataIB and some related modules and templates filter unsourced Wikidata statements by default; however, other modules and templates, such as Module:Wikidata, do not. See also: Wikidata (direct citations).",
        "links": []
    },
    {
        "subject": "WikiLeaks",
        "status": "Generally unreliable",
        "lastUpdate": "2020",
        "summary": "WikiLeaks is a repository of primary source documents leaked by anonymous sources. Some editors believe that documents from WikiLeaks fail the verifiability policy, because WikiLeaks does not adequately authenticate them, and there are concerns regarding whether the documents are genuine or tampered. It may be appropriate to cite a document from WikiLeaks as a primary source, but only if it is discussed by a reliable source. However, linking to material that violates copyright is prohibited by WP:COPYLINK.",
        "links": [
            "https://*.wikileaks.org"
        ]
    },
    {
        "subject": "Wikinews",
        "status": "Generally unreliable",
        "lastUpdate": "2012",
        "summary": "Most editors believe that Wikinews articles do not meet Wikipedia's verifiability standards. As Wikinews does not enforce a strong editorial policy, many editors consider the site equivalent to a self-published source, which is generally unreliable.",
        "links": [
            "https://*.wikinews.org"
        ]
    },
    {
        "subject": "Wikipedia",
        "status": "Generally unreliable",
        "lastUpdate": "2020",
        "summary": "Wikipedia is not a reliable source because open wikis are self-published sources. This includes articles, non-article pages, The Signpost, non-English Wikipedias, Wikipedia Books, and Wikipedia mirrors; see WP:CIRCULAR for guidance.[20] Occasionally, inexperienced editors may unintentionally cite the Wikipedia article about a publication instead of the publication itself; in these cases, fix the citation instead of removing it. Although citing Wikipedia as a source is against policy, content can be copied between articles with proper attribution; see WP:COPYWITHIN for instructions.",
        "links": [
            "https://*.wikipedia.org"
        ]
    },
    {
        "subject": "Wired",
        "status": "Generally reliable",
        "lastUpdate": "2018",
        "summary": "Wired magazine is considered generally reliable for science and technology.",
        "links": [
            "https://*.wired.com",
            "https://*.wired.co.uk"
        ]
    },
    {
        "subject": "WordPress.com",
        "status": "Generally unreliable",
        "lastUpdate": "2020",
        "summary": "WordPress.com is a blog hosting service that runs on the WordPress software. As a self-published source, it is considered generally unreliable and should be avoided unless the author is a subject-matter expert or the blog is used for uncontroversial self-descriptions. WordPress.com should never be used for claims related to living persons; this includes interviews, as even those cannot be authenticated.",
        "links": [
            "https://*.wordpress.com"
        ]
    },
    {
        "subject": "WorldNetDaily",
        "status": "Deprecated",
        "lastUpdate": "2018",
        "summary": "WorldNetDaily was deprecated in the 2018 RfC. There is clear consensus that WorldNetDaily is not a reliable source, and that it should not be used because of its particularly poor reputation for fact-checking and accuracy. The website is known for promoting falsehoods and conspiracy theories. Most editors consider WorldNetDaily a partisan source. WorldNetDaily's syndicated content should be evaluated by the reliability of its original publisher, and the citation should preferably point to the original publisher.",
        "links": [
            "https://*.wnd.com",
            "https://*.worldnetdaily.com"
        ]
    },
    {
        "subject": "Worldometer",
        "status": "Generally unreliable",
        "lastUpdate": "2020",
        "summary": "Worldometer is a self-published source and editors have questioned its accuracy and methodology. It is disallowed by WikiProject COVID-19 as a source for statistics on the COVID-19 pandemic and is considered generally unreliable for other topics.",
        "links": [
            "https://*.worldometers.info"
        ]
    },
    {
        "subject": "Xinhua News Agency",
        "status": "No consensus",
        "lastUpdate": "2020",
        "summary": "Xinhua News Agency is the official state-run press agency of the People's Republic of China. There is consensus that Xinhua is generally reliable for factual reporting except in areas where the government of China may have a reason to use it for propaganda or disinformation. Xinhua is also generally reliable for the views and positions of the Chinese government and its officials. For subjects where the Chinese government may be a stakeholder, the consensus is almost unanimous that Xinhua cannot be trusted to cover them accurately and dispassionately; some editors favour outright deprecation because of its lack of editorial independence. There is no consensus for applying any one single label to the whole of the agency. Caution should be exercised in using this source, extremely so in case of extraordinary claims on controversial subjects or biographies of living people. When in doubt, try to find better sources instead; use inline attribution if you must use Xinhua.",
        "links": [
            "https://*.xinhuanet.com",
            "https://*.news.cn"
        ]
    },
    {
        "subject": "YouTube",
        "status": "Generally unreliable",
        "lastUpdate": "12020",
        "summary": "Most videos on YouTube are anonymous, self-published, and unverifiable, and should not be used at all. Content uploaded from a verified official account, such as that of a news organization, may be treated as originating from the uploader and therefore inheriting their level of reliability. However, many YouTube videos from unofficial accounts are copyright violations and should not be linked from Wikipedia, according to WP:COPYLINK. See also WP:YOUTUBE and WP:VIDEOLINK.",
        "links": [
            "https://*.youtube.com"
        ]
    },
    {
        "subject": "ZDNet",
        "status": "Generally reliable",
        "lastUpdate": "2018",
        "summary": "ZDNet is considered generally reliable for technology-related articles.",
        "links": [
            "https://*.zdnet.com"
        ]
    },
    {
        "subject": "Zero Hedge",
        "status": "Deprecated",
        "lastUpdate": "2020",
        "summary": "Zero Hedge was deprecated in the 2020 RfC due to its propagation of conspiracy theories. It is a self-published blog that is biased or opinionated.",
        "links": [
            "https://*.zerohedge.com"
        ]
    },
    {
        "subject": "ZoomInfo",
        "status": "Generally unreliable",
        "lastUpdate": "2020",
        "summary": "Due to persistent abuse, ZoomInfo is currently on the Wikipedia spam blacklist, and links must be whitelisted before they can be used.",
        "links": [
            "https://*.zoominfo.com"
        ]
    },
    {
        "subject": "ARD Tagesschau (news)",
        "status": "Generally reliable",
        "lastUpdate": "2019",
        "summary": "70% of those questioned said that they see ARD Tagesschau as a reliable source, while 17% oppose. The ARD is a joint organisation of Germany's regional public-service broadcasters founded in 1950 in West Germany. ",
        "links": [
            "https://*.ard.de",
            "https://*.tagesschau.de",
            "https://*.ardmediathek.de",
            "https://*.ard-text.de"
        ]
    },
    {
        "subject": "ZDF heute (news)",
        "status": "Generally reliable",
        "lastUpdate": "2019",
        "summary": "68% of those questioned view ZDF heute as a reliable source, while 14% oppose. ZDF is a German public-service television broadcaster in 1963. ",
        "links": [
            "https://*.zdf.de"
        ]
    },
    {
        "subject": "Sueddeutsche Zeitung",
        "status": "Generally reliable",
        "lastUpdate": "2019",
        "summary": "64% of those questioned view Sueddeutsche Zeitung as a reliable source, while 11% oppose. The Sueddeutsche Zeitung is one of the largest daily newspapers in Germany. ",
        "links": [
            "https://*.sueddeutsche.de"
        ]
    },
    {
        "subject": "Die ZEIT",
        "status": "Generally reliable",
        "lastUpdate": "2019",
        "summary": "60% of those questioned view Die ZEIT as a reliable source, while 13% oppose. Die Zeit is a German national weekly newspaper published in Hamburg in Germany. The newspaper is generally considered to be among the German newspapers of record and is known for its long and extensive articles. ",
        "links": [
            "https://*.zeit.de"
        ]
    },
    {
        "subject": "Frankfurter Allgemeine Zeitung",
        "status": "Generally reliable",
        "lastUpdate": "2019",
        "summary": "57% of those questioned view Frankfurter Allgemeine Zeitung as a reliable source, while 14% oppose. The Frankfurter Allgemeine Zeitung is a centre-right, liberal-conservative German newspaper. ",
        "links": [
            "https://*.faz.net"
        ]
    },
    {
        "subject": "n-tv (news)",
        "status": "Generally reliable",
        "lastUpdate": "2019",
        "summary": "59% of those questioned view n-tv as a reliable source, while 14% oppose. n-tv is a German free-to-air television news channel owned by the Bertelsmann Media's RTL Group. Some people view its documentary as generaly unreliable and consider its news as biased. ",
        "links": [
            "https://*.n-tv.de"
        ]
    },
    {
        "subject": "Die Welt",
        "status": "No consensus",
        "lastUpdate": "2019",
        "summary": "Die Welt is a conservative German national daily newspaper. Some people consider it biased and see it as tabloid compared to Bild. ",
        "links": [
            "https://*.welt.de"
        ]
    }
]
