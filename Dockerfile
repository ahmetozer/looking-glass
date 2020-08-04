# Jekyll offical repo has a performance issue, switch to own repo
FROM ahmetozer/jekyll as lookingglassbuild

RUN apk add nginx openssl bash

WORKDIR /srv/jekyll
COPY . .

RUN set -x &&\
export ;\
gem check ;\
bundle check ;\
bundle install &&\
chmod +x /srv/jekyll/docker_run.sh &&\
mv nginx.conf /etc/nginx/nginx.conf &&\
chown -R www-data:www-data /var/www &&\
chown -R www-data:www-data /srv/jekyll

FROM lookingglassbuild as lookingglasstest
USER www-data
RUN echo -e "\n \n \t\033[1;36mLooking Glass Container Test\n\033[0m" &&\
jekyll build --trace && \
echo -e "\n \n \t\033[1;32mTest is OK. Removing Temp Container\n\033[0m"

FROM lookingglassbuild

CMD [ "/srv/jekyll/docker_run.sh"]