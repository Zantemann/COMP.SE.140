FROM python:3.12.6

WORKDIR /service1

RUN pip install Flask requests

COPY . .

ENTRYPOINT ["/usr/local/bin/shared-entrypoint.sh", "python", "index.py"]