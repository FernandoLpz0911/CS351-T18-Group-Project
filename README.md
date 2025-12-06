## Table of Contents

1. [Introduction](#Introduction)
2. [Getting Started](#Getting-started)
3. [Demo](#Demo-Video)


# Introduction:
This program that stores the artists images from the frontend, processed via django, 
and stored into SQL database with datetime created, and a SHA Key Fingerprint that's specific to the IP of the artist.

# Getting-started
Make sure you have the following installed:
1. Python (tested with Python 3.12.3)
2. pip    (tested with pip 24.0)
3. django (tested with 5.2.7)
4. nodejs (tested with v20.19.5)
5. npm    (tested with 10.8.2)

## Installation:

1. goto/open   "frontend/"      (without quotes) in terminal
2. run command "npm install"    (without quotes) in terminal
3. run command "npm audit fix"  (if required by terminal and without quotes) in terminal

**it's recommended you create and use venv for anything pip/python related**

4. goto/open root of project folder
5. run command  "pip install -r requirements.txt" (without quotes) in terminal

## Running the frontend:

6. Open new terminal
7. goto/open   "frontend/"   (without quotes) in terminal
8. run command "npm run dev" (without quotes) in terminal

## Running the backend:
9. Open new terminal
10. goto/open   "/backend/backendlogic"           (without quotes) in terminal
11. run command "python3 manage.py runserver"     (without quotes) in terminal

**NOTE: if  python3 doesn't work, use python**

Now, both the frontend and backend should be running.

The following may depend on your local system 

(If the ports are already in use, it will differ, check your terminal)

frontend should accessible at:
http://localhost:5173/

backend should be accessible at:
http://127.0.0.1:8000/api/
http://127.0.0.1:8000/admin

**NOTE: To access the admin for backend you must create a superuser**

Open new terminal
goto/open   "/backend/backendlogic"           (without quotes) in terminal
run command "python manage.py createsuperuser" or "python3 manage.py createsuperuser"

it will prompt you to create a username and password, (email is optional).

Use the newly created credetials to access admin page if desired.



# Demo-Video:
https://bit.ly/48UmzzQ
