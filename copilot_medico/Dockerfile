FROM python:3.8

# Instala dependencias do npm, alem de criar os arquivos da extensao.
RUN apt-get update && apt-get upgrade -y && \
    apt-get install -y nodejs \
    npm    

RUN mkdir -p /var/copmed-extension/
COPY static/copmed-extension/  /var/copmed-extension/
RUN cd /var/copmed-extension/ && npm install && npm run build

#ls /var/app/static/copmed-extension/
VOLUME ["/var/app/"]
ADD . /app
WORKDIR /app
RUN pip install -r requirements.txt

#RUN cd /var/app/static/copmed-extension/ && npm install && npm run build