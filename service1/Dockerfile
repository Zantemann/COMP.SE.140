FROM python:3.12.6

WORKDIR /service1

RUN apt-get update && apt-get install -y tini

RUN pip install Flask requests

COPY . .

RUN chmod +x down-call.sh

ENTRYPOINT ["/usr/bin/tini", "--", "/usr/local/bin/shared-entrypoint.sh", "python", "index.py"]