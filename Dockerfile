FROM node:erbium

WORKDIR /app

ADD package.json /app
RUN yarn install --frozen-lockfile

ADD ./ /app

RUN yarn install --production

CMD "yarn" "start"