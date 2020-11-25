FROM node:8
RUN apt-get update || : && apt-get install python -y
RUN apt-get install python3-pip -y

RUN mkdir /app
COPY package.json /app

WORKDIR "/app"

RUN apt-get update
RUN apt-get install python
RUN apt-get -y install ffmpeg
RUN npm install lame
RUN npm install youtube-audio-stream
RUN npm install
COPY index.html /app
COPY youtube.js /app
COPY color.js /app/public
COPY materialize.js /app/public
COPY materialize.css /app/public
COPY style.css /app/public
COPY sound.js /app/public
COPY automata.js /app/public
EXPOSE 8080
CMD [ "node", "youtube.js" ]

