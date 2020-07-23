# Jekyll offical repo has a performance issue, switch to own repo
FROM ahmetozer/jekyll as lookingGlassBuild

WORKDIR /srv/jekyll
COPY . .

RUN apt update ;\
apt install -y --no-install-recommends nginx openssl ;\
apt clean ;\
apt autoremove -y ;\
chmod +x /srv/jekyll/docker_run.sh ;\
mv nginx.conf /etc/nginx/nginx.conf ;\
chown -R www-data:www-data /var/www ;\
chown -R www-data:www-data /srv/jekyll


RUN bundle install

FROM lookingGlassBuild as lookingGlassTest
USER www-data
RUN jekyll build --trace && \
echo -e "\n \n \tTest is OK. Removing Temp Container\n"

FROM lookingGlassBuild

CMD [ "/srv/jekyll/docker_run.sh"]