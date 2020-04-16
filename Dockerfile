FROM node:10.15.3

RUN apt-get update && \
  apt-get install -yq gconf-service libasound2 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 \
  libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 \
  libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 \
  libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 \
  xvfb x11vnc x11-xkb-utils xfonts-100dpi xfonts-75dpi xfonts-scalable xfonts-cyrillic x11-apps \
  ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils wget git bzip2 build-essential && \
  wget https://github.com/Yelp/dumb-init/releases/download/v1.2.1/dumb-init_1.2.1_amd64.deb && \
  dpkg -i dumb-init_*.deb && rm -f dumb-init_*.deb && \
  apt-get clean && apt-get autoremove -y && rm -rf /var/lib/apt/lists/*

RUN mkdir ~/.vnc
RUN x11vnc -storepasswd genny ~/.vnc/passwd

ENV DISPLAY=:99
#ENV SLOWMO=:80


ADD package.json package.json
RUN npm install


RUN wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
RUN dpkg -i google-chrome-stable_current_amd64.deb; apt-get -fy install

ADD . .
COPY "*.jpeg" /dist
RUN npm run build
USER $user
CMD xvfb-run --server-args="-screen 0 2880x1800x24" npm run start-xvfb
