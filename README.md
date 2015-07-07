gproxy
======

gproxy exploits a Google web service hosted at
`images-onepick-opensocial.googleusercontent.com` (which is commonly used to
fetch user-provided content, e.g., to load images by URL in Google Documents) to
proxy arbitrary HTTP(S) traffic.

Installation
------------

Install with:

    npm install -g git://github.com/cyrus-and/gproxy.git

Note that a global installation is not mandatory, just start the proxy with `npm
start` from this directory.

Usage
-----

1. Generate a self-signed certificate (or skip this step and use the one
   bundled):

        openssl req -x509 -newkey rsa:2048 -nodes -days 3650 \
                    -subj '/CN=localhost' -keyout key.pem -out cert.pem

   Certificates (`key.pem` and `cert.pem`) in the current working directory will
   have the precedence over the one bundled.

2. Start the proxy, optionally also specifying host and port. By default gproxy
   listens on `localhost:8080` but this can be changed by setting two
   environment variables: `GPROXY_HOST` and `GPROXY_PORT`. For example with:

        export GPROXY_HOST=0.0.0.0
        export GPROXY_PORT=1234
        gproxy

   gproxy will listen on all the local interfaces on port `1234`.

3. Use `http://localhost:8080` (or whatever has been chosen) as a proxy server
   in your client configuration for both HTTP and HTTPS traffic. Most programs
   look for specific environment variables like `http_proxy` and
   `https_proxy`. With Bash just:

        export http{,s}_proxy=http://localhost:8080

   Note that to load HTTPS websites the client must ignore certificate
   errors. Some examples:

        google-chrome --ignore-certificate-errors
        curl -k https://example.com
        wget --no-check-certificate https://example.com

Caveats
-------

* Custom client headers are not forwarded to the server (e.g., no cookies).

* Redirects work but the client is not aware of that so the URL cannot be
  properly updated.

* The `content-disposition` response header is lost.

Disclaimer
----------

gproxy is just a PoC and should be treated as such. Proxying arbitrary web
traffic is unlikely to be the original purpose of the aforementioned web
service. Not to mention that even though the client identity is hidden to the
final server, it is not to Google itself.
