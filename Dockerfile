# Jekyll offical repo has a performance issue, switch to own repo
FROM ahmetozer/jekyll

RUN apt update ;\
apt install -y nginx openssl ;\
apt clean ;\
apt autoremove -y

WORKDIR /srv/jekyll
COPY . .
COPY nginx.conf /etc/nginx/nginx.conf

RUN bundle install
RUN jekyll build --trace

CMD [ "/srv/jekyll/docker_run.sh"]