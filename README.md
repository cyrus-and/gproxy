gproxy
======

gproxy exploits a Google web service hosted at
`images-onepick-opensocial.googleusercontent.com` (which is commonly used to
fetch user-provided content, e.g., to load images by URL in Google Documents) to
proxy arbitrary HTTP(S) traffic.

Usage
-----

1. Generate a self-signed certificate (or use the one provided):

        openssl req -x509 -newkey rsa:2048 -nodes -days 3650 \
                    -subj '/CN=localhost' -keyout key.pem -out cert.pem

2. Start the proxy:

        npm start

3. Use `http://localhost:8080` as a proxy server in your client configuration
   for both HTTP and HTTPS traffic. Most programs look for specific environment
   varibles like `http_proxy` and `https_proxy`. With Bash just:

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

gproxy is just a POC and should be treated as such. Proxying arbitrary web
traffic is unlikely to be the original purpose of the aforementioned web
service. Not to mention that even though the client identity is hidden to the
final server, it is not to Google itself.
