# CS351-T18-Group-Project
Group Project For Fall Semester 2025 @ UIC with Professor Patrick Troy

Team Members:
- Fernando Lopez
- Sheldon Mui
- Dominic Gentile
- Anthony Martinez

# Logistics  

**Q1:** At what time in the week would your group be available to meet online?  
*We are available to meet: Wednesdays at 11am to 1pm, Mondays at 3:30 to 6pm*
*Our weekly meeting will be: Wednesdays at 11am to 1pm @ CDRLC Study Rooms*

---

# Timeline: Weekly Meeting Goals  

**Q2:** What are the goals that your group wants to achieve in each weekly meeting?  
*Our goals will be to discuss systems requirements review initially, then as we develop give progress updates and any setbacks with request for help as needed.*



*[Initial Prototype - Peer Review]*
|Week               | Description           |
|-------------------|-----------------------|
| Prior to 10/07:   | Systems Requirements Review
| Prior to 10/14:   | Progress Check
| Prior to 10/23:   | Minimum Viable Product Review

*[Final Prototype - Instructor Review]*
|Week               | Description           |
|-------------------|-----------------------|
| Prior to 11/04:   | Adjustments of MVP
| Prior to 11/11:   | Minor Feature Adjustments
| Prior to 11/20:   | Verification of Systems


*[Final Presentation - Project Submission]*
|Week                | Description           |
|--------------------|-----------------------|
|Subsequent to 11/20:| Final Product Complete

---

# Communication  

**Q3a:** How can your group communicate when doing the Full Stack Group Project?  
*Our group can communicate with each other through texts and phone calls.*

**Q3b:** What are the usernames of each group member on that platform?  
*There are no usernames for texts and phone calls.*

**Q3c:** What is your group’s expected response time to messages?  
*Our expected response time will be within 1 to 2 days.* 

---

# Norms  

**Q4a:** How will your group handle situations when there is conflict in your group?  
*If there is a conflict, we will discuss the situation before coming to take a vote on how to resolve it.*\
*In the event of a tie, we will try to seek advice from a TA.*

**Q4b:** How will your group handle situations when a member is not contributing enough?   
*The team will handle the situation by sending a reminder about the project.*


---

# Roles  

**Q5:** How will your group divide your role in the Group Project?  

|                   | Role             |
|-------------------|-----------------------|
| Fernando          | Project Lead
| Sheldon           | Testing
| Dominic           | Back-end
| Anthony           | Front-end

---

# Tech Stacks

**Q6:** Which tech stacks will your group use (Django + React or Flask + React)? 
*The tech stack our group will use is: Django + React*


---
# Full Stack Group Project Track  
---

# Track 1: Tackling Generative AI Consequences
**Problem 1:**
*Generative AI committing copyright infringement on artists works.*

**Solution 1:** 
*Program that stores the artists images from the frontend, processed via django, and stored into SQL database with if they are fine with ai use or not, datetime created, and a SHA Key Fingerprint that's specific to the IP of the artist. Should also allow for viewing of images and their specific SHA Key Fingerprint Data. Kind of like Google Play Store developer SHA Key's but for Artist Works. Should contain the key even if scraped by AI and used elsewhere.*

---

# Track 2: Technology for Public Goods 

**Problem 2:**
Students at UIC often find out too late that a classroom has limited charging outlets,
or that only desks in particular locations have outlets.

This results in students sitting in locations with no way to keep their laptops charged.

**Solution 2:** 
We propose making a website that allows students to see an overview of the classroom they select with
a visual indicator of where the power outlets are. 

A total number of power outlets available could be provided to give an estimate to students
to decide if it is likely they can find a power outlet (using the total seats available in the class section).

**Problem 3:** 

**Solution 3:**  

# Track 3: Creative Coding and Cultural Expression

**Idea - Story - Inspiration 4:**

**Implementation 4:**

**Idea - Story - Inspiration 5:**

**Implementation 5:**


# Idea Finalization

**From 5 project ideas you have above, please choose one of the project that you are going with for the rest of the semester. Explain why you are going with that project**
\
\
We will try to do the idea we had for Track 1: Tackling Generative AI Consequences
with a program that allows AI image model trainers to determine if the datasets they have prepared contain
unathorized IP material based of a SHA key fingerprint system.

This project could be useful to change the current paradigmn of model training by allowing the
IP owners to explicity define what media they own is allowed for AI training, if at all.

Legally this may not have an effect (the legal situation is still being determined), but this will provide
owners of IP a way to demonstrate to the public if a model trainer ignored their requests.

Another use is that this could be used to catalog material deemed safe for AI image training, and could
become a building block for future AI image models that attempt to respect the interests of the IP creators.
Imagine an AI image model that is trained only on material that was given the green flag to do so, and making it the norm.
This would be evidence that we can have AI models that will work even without needing unahtorized copyrighted material.

# Extra Credit (Only do this if you are done with Idea Finalization)

# Database Design

**Q1: What database are you using for your project (SQLite, PostgreSQL, noSQL, MongoDB,...), and why do you choose it?**
*We decided on using SQLite since it's a language we have begun to be familiarized through CS 341 and is a dedicated database which we can manage fully.*

**Q2: How will database be helpful to your project? How will you design your database to support your application features?**
*It will directly be storing the images and their related image data. It's directly supporting the application in its process of storing and verifying IP of copyrighted works.*

## Third-Party API Integration

**Q3: Which third-party API(s) will you integrate into your project? What data will you pull from the API(s), and how will you use it in your application?**
*We'll need to use a Cryptographic Hashing library (hashlib) to hash the image with the unique id specific to the artist. We will also need hexdigest() which can convert the hash into a hexadecimal string we can read, literally for converting backwards. We will also need the stegano library to embed the key into the images and to be able to extract it.*

**Q4: Does your API key has limitations such as rate limits or downtime? How are you going to deal with that?**

*There's no limitations since it's local only.*

## Authentication and Security

**Q5: What authentication method will you use (e.g., username/password, OAuth, JWT)?**

*We will end up using OAuth authentication since it's a common standard in regards to authentication with possible implementation of google auth with it.*

**Q6: How will you store and protect sensitive user data (e.g., passwords, tokens)?**

*We will store and protect by not storing passwords but hash again or some sort of similar hashing function. For tokens, we will use an cryptography that we haven't decided yet.*

## Deployment

**Q7: Where will you deploy your project (e.g., Heroku, AWS, Render)? How will you manage environment variables and secrets during deployment?**
*We will likely want to deploy ours using AWS or Github Pages, currently we're considering .gitignore or sensitive data protection API which helps tag sensitive information.*

**Q8: How will you ensure your deployment is reliable and easy to update?**
*We'll re-test and possibly add self-checks regarding information updating with automatic database management. The reliability would be a site tracker to see uptime and downtime.*
