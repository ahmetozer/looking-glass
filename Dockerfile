FROM jekyll/jekyll:3.8
COPY . /srv/jekyll
WORKDIR /srv/jekyll
RUN bundle install
RUN jekyll build --trace

CMD [ "/usr/jekyll/bin/jekyll", "serve"]