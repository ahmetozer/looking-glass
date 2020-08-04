#!/bin/bash
echo "Looking Glass Website Container"
if [ "$webserver" == "yes" ]
then
    ## Check Certiface are exist
    FILE="/etc/ssl/certs/looking-glass.crt"
    if [ -f "$FILE" ];
    then
        echo "$FILE exists."
    else
        echo "$FILE does not exists."
        USE_Self_Certiface=1
    fi

    FILE="/etc/ssl/private/looking-glass.key"
    if [ -f "$FILE" ];
    then
        echo "$FILE exists."
    else
        echo "$FILE does not exists."
        USE_Self_Certiface=1
    fi

    ## Cert DIR /etc/nginx/looking_glass_cert_dir.conf

    if [ "$USE_Self_Certiface" == "1" ];
    then
        echo "Your website certifaces are not ready."
        echo "Using self certiface"
        ## Check Certiface are exist
        FILE="/etc/ssl/certs/nginx-selfsigned.crt"
        if [ -f "$FILE" ];
        then
            echo "$FILE exists."
        else
            echo "$FILE does not exists."
            Create_Self_Certiface=1
        fi

        FILE="/etc/ssl/private/nginx-selfsigned.key"
        if [ -f "$FILE" ];
        then
            echo "$FILE exists."
        else
            echo "$FILE does not exists."
            Create_Self_Certiface=1
        fi

        if [ "$Create_Self_Certiface" == "1" ];
        then
            openssl req \
            -x509 -nodes -days 365 \
            -newkey rsa:2048 \
            -keyout /etc/ssl/private/nginx-selfsigned.key \
            -out /etc/ssl/certs/nginx-selfsigned.crt \
            -subj "/C=US/ST=Denial/L=Springfield/O=Dis/CN=lg.example.com"
        fi

        echo "ssl_certificate     /etc/ssl/certs/nginx-selfsigned.crt;
        ssl_certificate_key /etc/ssl/private/nginx-selfsigned.key;" > /etc/nginx/looking_glass_cert_dir.conf
    else
        echo "ssl_certificate     /etc/ssl/certs/looking-glass.crt;
        ssl_certificate_key /etc/ssl/private/looking-glass.key;" > /etc/nginx/looking_glass_cert_dir.conf
    fi
fi

echo "Building web"
jekyll build --trace

if [ $? -eq 0 ]
then
    echo "Site successfully builded"
    if [ "$webserver" == "yes" ]
    then
        echo "Starting Nginx"
        if [ ! -d "/run/nginx/" ]; then
            mkdir -p /run/nginx/
        fi
        nginx
    fi
fi