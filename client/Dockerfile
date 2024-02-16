FROM python:3.5

ADD . /weatherflow_atlas
WORKDIR /weatherflow_atlas
RUN apt-get update --allow-releaseinfo-change && apt-get install -y \
    openssl libssl-dev ssl-cert \
    iputils-ping python-dev build-essential 

ENV LIBRDKAFKA_VERSION 1.9.0
RUN curl -Lk -o /root/librdkafka-${LIBRDKAFKA_VERSION}.tar.gz https://github.com/edenhill/librdkafka/archive/v${LIBRDKAFKA_VERSION}.tar.gz && \
    tar -xzf /root/librdkafka-${LIBRDKAFKA_VERSION}.tar.gz -C /root && \
    cd /root/librdkafka-${LIBRDKAFKA_VERSION} && \
    ./configure && make && make install && make clean && ./configure --clean

ENV CPLUS_INCLUDE_PATH /usr/local/include
ENV LIBRARY_PATH /usr/local/lib
ENV LD_LIBRARY_PATH /usr/local/lib

RUN pip install --upgrade pip
RUN pip install -r requirements.txt
CMD ["bash", "runit.sh"]
