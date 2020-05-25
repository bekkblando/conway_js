FROM nikolaik/python-nodejs:python3.7-nodejs8

RUN mkdir /app
COPY package.json /app
COPY youtube.js /app

WORKDIR "/app"

RUN apt-get update
RUN apt-get install python
RUN apt-get -y install ffmpeg
RUN npm install lame
RUN npm install youtube-audio-stream
RUN npm install

CMD node youtube.js
