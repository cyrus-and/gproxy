gproxy
======

gproxy exploits a Google web service hosted at
`images-onepick-opensocial.googleusercontent.com` (which is commonly used to
fetch user-provided content, e.g., to load images by URL in Google Documents) to
proxy arbitrary HTTP(S) traffic.

Usage
-----

1. Generate a self-signed certificate (or use the one provided):

        openssl req -keyout key.pem -out cert.pem \
                -x509 -newkey rsa:2048 -nodes -subj "/CN=127.0.0.1" -days 3650

2. Start the proxy:

        npm start

3. Use `http://127.0.0.1:8080` as a proxy server. To load HTTPS websites the
   client must also ignore certificate errors, for example:

        google-chrome --ignore-certificate-errors \
                      --proxy-server=http://127.0.0.1:8080

   or:

        curl -k -x http://127.0.0.1:8080 https://example.com

Caveats
-------

* Custom client headers are not forwarded to the server (e.g., no cookies).

* Redirects work but the client is not aware of that so the URL cannot be
  properly updated.

* The `content-disposition` response header is lost.
