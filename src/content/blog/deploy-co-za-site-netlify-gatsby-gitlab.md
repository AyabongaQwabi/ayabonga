---
title: "Deploy a .co.za Site to Netlify with Gatsby, GitLab, and RegisterDomainSA"
excerpt: "Step-by-step: Gatsby on Netlify, GitLab CI, and pointing RegisterDomainSA nameservers to Netlify DNS."
date: October 13, 2019
readTime: 12 min read
tags: Netlify, Gatsby, GitLab, co.za, South Africa, DNS
categories: Engineering
---

How to deploy a .co.za website to Netlify with GatsbyJS, Gitlab and RegisterDomainSA
Ayabonga Qwabi
Ayabonga Qwabi
Senior Product Engineer at Simply | Senior Full-Stack Developer | Clojure, React & Node.js Expert

October 13, 2019

In the past few months I have been playing around with Netlify and Registerdomain.co.za building a couple of websites for some friends . With the latest one being www.bakeni.co.za

I have fell in love with how Netlify makes the process of hosting custom websites so easy. Which has motivated me to write this article, in hope that others might find it compelling to follow this deployment style.

So here's a step guide to how you can deploy your first .co.za website to Netlify.

Please note this tutorial assumes you have a stable internet connection
Create a GatsbyJS website
Follow this tutorial here on how you can install GatsbyJS on your machine and bootstrap your first website.

You will need to have a running NodeJS environment. If you don't have one then then you can either follow the process explained here or you can install a Node Version Manager which can make the process easier for you e.g nvm or nvm-windows

Create a Gitlab Repo
We could accomplish the same with a Github repo but the reason I selected Gitlab is for its intergrated CI/CD, you can run your pipelines, build images, create custom runners and so much more all from Gitlab. It's very advantageous for devOps purposes.

Register or Login at gitlab.com
Create a new project
Follow the instructions and push your GatsbyJS website to Gitlab
You will need to have Git installed and also familiar with how it works

Deploy to Netlify
You will now need to login at www.netlify.com with your Gitlab account

Create a new website by navigating to https://app.netlify.com/start and select Gitlab from the list of options.
Then select your GatsbyJS Website from the list of repositories

No alt text provided for this image 3. The build configuration should be set automatically in the next page. This is where you can alter your build command incase you added a custom build script .

No alt text provided for this image 4. Deploy your website.

You should now be taken to your site's dashboard.

No alt text provided for this image

Netlify will assign a random name to your website for which you can access your website from in the following format https://myrandomsitename.netlify.com

Don't worry you can always change this random name by clicking site settings

Purchase RegisterDomainSA domain
Search and buy a custom domain for around +-R75 p/a
No alt text provided for this image 2. On checkout you will be provided with the following screen. This is where the magic happens.

No alt text provided for this image
Here we change Register Domain's DNS nameservers to Netlify's DNS nameservers

We can do this by going to the Domains setting, which can be found in your team dashboard in Netlify. You can see this dashboard by clicking the Netlify icon at the top or navigating to

https://app.netlify.com/teams/[your gitlab username]/dns

Then click "Add or register domain"

Then input your domain name e.g netlify-is-da-bomb.co.za

You should now be asked whether you are the owner of the domain or not

No alt text provided for this image
If you are then click "Yes, add domain"

Once you start the process of purchasing the domain on RegisterDomainSA's website it registers as taken on Netlify, so you are safe to say yes even though you have not yet purchased it. Unless RegisterDomainSA told you it is unavailable
In the following screen you should be asked to add your DNS records, if you have any at this stage of the process you can input them or you can input them later and click "Continue"

After clicking "Continue" you should now see a list of Name Servers to use

No alt text provided for this image
dns1.p07.nsone.net
dns2.p07.nsone.net
dns3.p07.nsone.net
dns4.p07.nsone.net
You can then go back to the Register Domain tab and input them in, replacing the ones already filled in by Register Domain.

Then continue to checkout and buy your domain.

Configure Netlify to use your custom domain
Now we want to be able to view the content of our website which is hosted at myrandomsitename.netlify.com on our custom domain e.g netlify-is-da-bomb.co.za

Note: your custom domain name does not have to include netlify on its name, this is just a name I chose for fun
Navigate to app.netlify.com/sites/[myrandomsitename]/settings/domain
or just simply got to your sites settings and click on "Domain Management"

Under Custom Domain click "Add Custom Domain"

On click you should see a screen similar to the one we had before when we were changing the name servers

No alt text provided for this image

You should do the same here and input your custom domain and verify you are the owner.

Now if you navigate to "Overview" in your dashboard you should notice that the site content is now served from your custom domain instead of myrandomsitename.netlify.com

No alt text provided for this image

Although you will have to wait at least 24 hours for RegisterDomainSA and Netlifey's DNS to be fully configured before you can actually see content on your site. Sometimes it takes an hour or two but the defined waiting period is 24hrs

Recap
To deploy a Gatbsy site to Netlify you

Create GatbsyJS site
Push it to Gitlab
Deploy it to Netlify
Buy a domain from RegisterDomainSA
Swap RegisterDomainSA's nameservers for Netlify's nameservers
Add your custom domain to your Netlify Website

Netlify offers a whole range of other services which you can take advantage of

e.g

Automatically secure your website with an SSL certificate
Deploy repo branches as subdomains for staging
Add and manage subdomains
Manages form data for you
Use the power of Netlify CMS to create blog sites
I've recently used some of these features on my website which I haven't really started building yet but have just set it up.

APP

[Staging] https://staging.app.touch.net.za/

[Live] https://app.touch.net.za/

STATIC SITE

[Staging] https://staging.touch.net.za/

[Live] https://touch.net.za/

Which I will all explain in a series of tutorials.

The End :)

Here's a code Potato
