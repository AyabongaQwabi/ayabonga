---
title: "How I Dramatically Improved the Speed of My Gatsby Website"
excerpt: "Tree shaking Ramda, Gatsby Image, code splitting social plugins, and value analysis — PageSpeed before and after."
date: August 15, 2020
readTime: 10 min read
tags: React, Gatsby, Performance, Webpack, Ramda
categories: Engineering
---

How I dramatically improved the speed of my website.
Ayabonga Qwabi
Ayabonga Qwabi
Senior Product Engineer at Simply | Senior Full-Stack Developer | Clojure, React & Node.js Expert

August 15, 2020
It is without a doubt that my new found skills have helped me navigate myself in the world of performance upgrades for ReactJS. I had recently took an online course at Udemy titled The Complete Junior to Senior Web Developer Roadmap (2020) . Found within this course were various strategies and tools with which one would use to improve the perfomance of a react application which I utilised and came up with a robust perfomance solution for my GatsbyJS Website.

No alt text provided for this image
These were the page speed insights for the home page of my website on mobile devices. They were terrible. It took 24.1 seconds to make the website interactive and 5.7 seconds before the user could see anything discernable on the webpage. Something had to be done.

## Tree shaking

Tree shaking is the process of eliminating unused or dead javascript modules or functions imported into your code.

```js
import * as R from 'ramda';

const myObject = {};

console.log(R.isEmpty(myObject)); // true
```

In the above example we are importing the Ramda module for the sole purpose of checking if our object is empty or not. Though this may be an elegant solution to our problem it creates other issues we may need to be concerned about.

In the first line of the code we are importing all the functions housed within the ramda module which in a sense imports the whole file into our project thus making our transpiler (Webpack in this case) create a big Javascript bundle to load into our client.

In order to minimize the size of our bundle we need to handpick the functions we want to use instead of importing the whole module:

```js
import { isEmpty } from 'ramda';

const myObject = {};

console.log(isEmpty(myObject)); // true
```

We need to keep in mind that JavaScript is an expensive resource to process and instead of importing whole modules into our code we should rather pick the select few that we’re going to use.

No alt text provided for this image
After performing this task through out my code I was able to greatly improve the loading speed of my home page.

Image Optimizations
I also came to the understanding that some of the images that were being rendered in the home page were huge and by huge I mean ranging from 400kb to 900kb. These were seriously taking a toll on the amount of time it took to reach our first meaningful paint.

So since I built my website with GatsbyJS I decided to browse their extensive library of plugins and I came across the Gatsby Image API, which has the ability to transform images and optimize them based on the criteria you feed it.

This tool had a profound impact on the performance of my web page.

No alt text provided for this image

I was now reaching my first meaningful paint at optimal speeds. Although this was great for the user experience, the time it took for my users to interact with my web page was still way too long.

Code Spliting
I therefore decided to try splitting my code by demand and rendering components in locations where they are needed. While looking at the page insights I noticed there was a lot of JavaScript being unused in my web page and most of this was from my Facebook plugins (Comments, Likes and Facebook Page plugins).

No alt text provided for this image

They were being unused because I had been adding links to their scripts on my Layout component which basically gets rendered on every page. My logic was that If I included these scripts on the upper most component I won’t have to link to them on the lower components (components which get rendered inside other components) because the resources would have already been loaded into the page by the Layout.

Inevitably that took a toll on the performance of my web page and I had to move these scripts to the pages where they were being used and the results were astounding.

No alt text provided for this image
I had now made my web page highly performant, but I couldn’t help but wonder if I could take this a bit further.

Value Analysis
Although this was not included in Andrei’s master tutorial to website performance I decided to apply it. I picked this one up from Joe Natoli’s tutorial on UX strategies at Udemy. Value analysis basically questions whether features are nice to have or need to have. One such component I had to analyze was the Facebook Messenger button. This component was loading a very huge JavaScript sdk which was taking a toll on the speed of my web page. Although it was nice to have people send messages directly to my Facebook page it wasn’t very much a need because the contact details page arguably accomplished the same thing. So I opted to remove it. After I removed it I saw an incredible increase on the performance of my web page both on mobile and desktop.

No alt text provided for this image

No alt text provided for this image

A wise man once said “Improving JavaScript performance is, as always, a task fit for developers. After all, who better to improve application architecture than the architects themselves?”

There are a myriad of tools and strategies which we can use to increase the performance of our websites. These are just a handful that I found niche to my project. Feel free to comment which tools you find more flexible to use on your projects below.

Thank you.
