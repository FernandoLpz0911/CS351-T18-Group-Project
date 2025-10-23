
|Project Summary||
|------------------------|-----------------------|
|*Program that stores the artists images from the frontend, processed via django, and stored into SQL database with if they are fine with ai use or not, datetime created, and a SHA Key Fingerprint that's specific to the IP of the artist. Should also allow for viewing of images and their specific SHA Key Fingerprint Data. Kind of like Google Play Store developer SHA Key's but for Artist Works. Should contain the key even if scraped by AI and used elsewhere.*|    



|  Resources:            |                       |
|------------------------|-----------------------|
|Backend Design Patterns:|https://www.freecodecamp.org/news/design-pattern-for-modern-backend-development-and-use-cases/|
|Frontend Design Patterns: |https://www.patterns.dev/|
|Frontend    Mixin Pattern:|https://www.patterns.dev/vanilla/mixin-pattern/|



|Brief description of project idea and goals| |
|------------------------|-----------------------|
|The project is a image watermarking webpage where you upload the image and it returns the same image with a watermark that AI either cannot or has difficulty in deleting. The goal of it is to help artists while highlighting a problem in regards to ai that we can solve. Technical goals are to develop skills in regards to utilizing an advanced data structure, basic cryptography, and full connectivity between front and backend with potential to be fully deployed.|



|Figma Screenshots| Figma Link |
|------------------------|-----------------------|
|https://www.figma.com|https://www.figma.com/design/McASF98g8sLLgzbtvASDEa/Art-Hash-Project?node-id=5-427&p=f&t=OerWEHJtTmucUoB1-0|



|Explaining why certain layouts, flows, or patterns were chosen and how does it helps the users||
|------------------------|-----------------------|
|We have chosen to use Model-View-Controller (MVC) pattern for the backend and Mixin Pattern for the frontend. We have not structured the method however we have considered the research in regards to what we'll create. The reason we chose the design patterns is because it simplified the code and doesn't force dependencies so if something we to go wrong we can isolate it and adjust a small section without difficulty, making it easier to maintain.|


|Any assumptions, limitations, or open questions your team still needs to resolve for the frontend||
|------------------------|-----------------------|
|Limitations would begin with upload limit, runtime of the watermarking, and webpage security. We have to consider upon it further|



| Any future improvements or open questions your team is considering for the frontend||
|------------------------|-----------------------|
|We're considering improvements in regards to base design from our figma design, and the security alongside potential runtime improvements.|

