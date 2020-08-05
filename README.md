# Looking Glass

Looking Glass is a simple web interface created to use various network tools over the Web to inspect network or find problem while remote accessing.
You can access the demo system at [https://lg.ahmetozer.org](https://lg.ahmetozer.org)

## Features

- Container Support

- Github or Gitlab Pages support

- Inputs can be a IPv4, IPv6 and Domain

- Disable IPv6 or IPv4 query without firewall or routing configuration (It also works on domain).

- Most of the controls also implement in front end to reduce getting any errors from service.

- Server info table

- Live output

- Nested Server list support. You can categorize your servers until depth 5

- Advanced server select modal

- Recursive configuration support

- Rate limit

- Available functions
  - Ping
  - Traceroute (tracert)
  - nslookup
  - whois
  - curl
  - mtr

- Custom navbar links

- Responsive (Mobile supported)

- Automated self certificate generator

- Custom SSL certificate support

- Fully IPv6 Support

## Images

![start](https://raw.githubusercontent.com/ahmetozer/looking-glass/doc-files/img/1_start.jpg)

![server_select_modal](https://raw.githubusercontent.com/ahmetozer/looking-glass/doc-files/img/2_server_select_modal.jpg)

![after_selecting_server](https://raw.githubusercontent.com/ahmetozer/looking-glass/doc-files/img/3_after_selecting_server.jpg)

## Installation

This software is divided to two part, one of them is web site other one is service side. This is increase flexibility, maintenance and uptime.

### Configure Web Site

There is a few options are available for website. These options are your company information and some preferences like a custom navbar links.

For configuration change `_config.yml` preferences. Comments in configuration file is can help for configuration.

### Build Web Site

There is a few ways to serve your looking glass website.  

#### Github Pages

You can fork this repository on github, edit _config.yml and build with github pages.  
Github pages is also has a Lets Encrypt support. It's automatically generate SSL certificate.

Second option is use docker container to build your static web site easily without installing or configuring any software dependencies.

#### Self Hosting With Docker Container

Get container from docker.

```bash
docker pull ahmetozer/looking-glass
```

To run

```bash
docker run -it --name looking-glass
```

##### ADD configure files and Assets (Logo,server.json,_config.yml or ssl certs)

There is a two options to do it. First one is configure files on your server and overlay files to container with docker volume option while container creating.

```bash
docker run -v /my/configs/lg/server.json:/srv/jekyll/server.json ahmetozer/looking-glass
```

Second one is mount files into server with readonly mode while container creating. (For example mount a SSL Certificates)  
**NOTE :** If you don't mount your certificates, system is create a self signed certificate.

```bash
docker run -it --name looking-glass --restart always \
-e webserver=yes -p 80:80 -p 443:443 \
--mount type=bind,source="looking-glass.crt",target=/etc/ssl/certs/looking-glass.crt,readonly \
--mount type=bind,source="looking-glass.key",target=/etc/ssl/private/looking-glass.key,readonly \
ahmetozer/looking-glass
```

Third one ise add or overwrite files to container with docker cp command after container created.

```bash
docker cp .config.yml looking-glass:/srv/jekyll/.config.yml
docker cp logo.png looking-glass:/srv/jekyll/logo.png
docker cp server.json looking-glass:/srv/jekyll/server.json
docker restart looking-glass
```

After editing config or uploading new files, you have to rebuild your static site. It is takes less than 10 second.

```bash
docker restart looking-glass
```

#### Enable Web Server

You can enable pre configured web server with only set webserver environment variable to yes `-e webserver="yes"`

```bash
docker run -it --name looking-glass --restart always \
-e webserver=yes -p 80:80 -p 443:443 \
--mount type=bind,source="looking-glass.crt",target=/etc/ssl/certs/looking-glass.crt,readonly \
--mount type=bind,source="looking-glass.key",target=/etc/ssl/private/looking-glass.key,readonly \
ahmetozer/looking-glass
```

**My preferred configuration**

```bash
docker run -it --name looking-glass --restart always \
-e webserver=yes -p 80:80 -p 443:443 \
ahmetozer/looking-glass

# Copy SSL certs to container
docker cp /etc/letsencrypt/live/example.com/fullchain.pem looking-glass:/etc/ssl/certs/looking-glass.crt
docker cp /etc/letsencrypt/live/example.com/privkey.pem looking-glass:/etc/ssl/certs/looking-glass.key

# Overwrite configure files with your configuration
docker cp .config.yml looking-glass:/srv/jekyll/.config.yml
docker cp server.json looking-glass:/srv/jekyll/server.json

# Copy your company logo to container
docker cp logo.png looking-glass:/srv/jekyll/logo.png

# To rebuild website restart container
docker restart looking-glass

```

### [Net Tools Service](https://github.com/ahmetozer/net-tools-service)

This front end project uses [Net Tools Service](https://github.com/ahmetozer/net-tools-service) as a backend service.
For more details and configuration information please visit [https://github.com/ahmetozer/net-tools-service](https://github.com/ahmetozer/net-tools-service) to see guideline.

### server.json

This file contains your server settings and information's.
It has a there part. First is ServerConfig, second is Server list and last one is servers.

This configuration it also has a nested configs. You can define settings at main and change by list or server by server.

#### ServerConfig

It is your function configs. You can enable or disable functions globally by top of the json.

Web site and Net Tools Service is uses this same this config.

Every function is disabled by default for security. If you want to enable it you have to define globally, by list or by server to enable it.

System also recursive config replacement support. You can re define ServerConfig in Lists or servers.

For example you want to enable tracert functions globally but disable in One country except one server. You can follow like a this configuration.

```json
    {
    "ServerConfig": {
    ...
        "tracert": "enabled",
    ...
    },
    "Servers": {
        "Netherland": {
            "Description": "Servers in Netherland",
            "ServerConfig": {
                "tracert": "disabled"
            },
            "Servers": {
                "Amsterdam1": {
                    "Name": "X Company 1",
                    "Url": "https://just-a-server",
                    "ServerConfig": {
                        "tracert": "enabled"
                    }
                },
                "Amsterdam2": {
                    "Name": "Y Company 1",
                    "Url": "https://just-a-server2"
                }
            }
```

Configuration scheme work logic is depth based. System start looks config at top of the config and compare by dept until reach server object.

**NOTE :** Please do not forget to define `"referrers"` in server.json.
You can define multiple websites, which is uses same json on net-tools-service with comma in one string.

```json
{
    "ServerConfig": {
       "curl": "enabled",
        "mtr": "enabled",
        "referrers": "lg.ahmetozer.org,noc.ahmetozer.org,lg.ahmet.engineer"
    }
}
```

```json
{
    "ServerConfig": {
       "curl": "enabled",
        "mtr": "enabled",
        "referrers": "lg.ahmetozer.org"
    }
}
```

#### Server List

It's like a server object except it does not have URL object has a again server object.

By naming server list object, please be careful to do not use any space, dot or other special characters. You can only use ^[a-zA-Z0-9]+$ characters for server list objects.

System use name as Server List Object string but if you want to display different name you can define name object in your list.

If you want to display description on right side of server select modal, you can define "Description" item in your server list object.

```json
{
    ...
"Servers": {
        "Turkey": {
            "Name": "Türkiye",
            "Description": "Araştırma ve test sunucuları",
            "ServerConfig": {
                "whois": "disabled",
                "webcontrol": "disabled",
                "tcp": "disabled"
            },
            "Servers": {
                ...
            }
}
```

#### Servers

You can use server objects directly in Server list modal or inside of Server Lists.
Again while defining you have to use ^[a-zA-Z0-9]+$ characters to prevent any error on website.
If you want to show your server name outside of regex, you can again define "Name" in your server.

You can point your Looking glass service with url.
You don't have to stick https port 443, you can also use a different port.  
While define url you don't need to add slash end of to url. System automatically added.

To showing several information on Server Select Modal and server table, please define ASN, IPV4Address and IPV6Address.

```json
{
    "Marmaris1": {
        "Name": "Marmaris 1",
        "Description": "Turknet LSN",
        "ServerConfig": {
            "whois": "enabled",
            "nslookup": "enabled",
            "ping": "disabled",
            "icmp": "enabled",
            "tracert": "enabled",
            "webcontrol": "enabled",
            "speedtest": "enabled"
        },
        "ASN": "AS64496",
        "IPV4Address": "203.0.113.3",
        "IPV6Address": "2001:db8:900d:c0de::3",
        "Url": "https://demo-server-diffrent-port:2083"
    }
}
```
