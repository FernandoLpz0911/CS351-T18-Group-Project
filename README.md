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
| Prior to 10/07:   | 
| Prior to 10/14:   | 
| Prior to 10/23:   | 

*[Final Prototype - Instructor Review]*
|Week               | Description           |
|-------------------|-----------------------|
| Prior to 11/04:   | 
| Prior to 11/11:   | 
| Prior to 11/20:   | 


*[Final Presentation - Project Submission]*
|Week                | Description           |
|--------------------|-----------------------|
|Subsequent to 11/20:| 

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
| Fernando          | 
| Sheldon           | 
| Dominic           | 
| Anthony           | 

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

**Solution 2:** 

**Problem 3:**
*Students struggle to find available and suitable study spaces on campus. They waste time walking between libraries and buildings only to find all spots taken, or they find a space that doesn't fit their needs (e.g., a noisy area, no power outlets, etc.).*

**Solution 3:**
*A real-time study spot map web app that shows the current occupancy and amenities of campus study areas. Students can filter by location, noise level, group size, and availability of power outlets. The app utilizes crowd-sourced reports from students to update a space's "busyness" and environment, enabling everyone to find the ideal place to study.*

# Track 3: Creative Coding and Cultural Expression

**Idea - Story - Inspiration 4:**

**Implementation 4:**

**Idea - Story - Inspiration 5:**

**Implementation 5:**


# Idea Finalization

**From 5 project ideas you have above, please choose one of the project that you are going with for the rest of the semester. Explain why you are going with that project**

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

There's no limitations since it's local only.

## Authentication and Security

**Q5: What authentication method will you use (e.g., username/password, OAuth, JWT)?**

**Q6: How will you store and protect sensitive user data (e.g., passwords, tokens)?**

## Deployment

**Q7: Where will you deploy your project (e.g., Heroku, AWS, Render)? How will you manage environment variables and secrets during deployment?**

**Q8: How will you ensure your deployment is reliable and easy to update?**
