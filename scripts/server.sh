#! /bin/bash

docker run -d --name minio-server \
    --env MINIO_ROOT_USER="test_key_id" \
    --env MINIO_ROOT_PASSWORD="secret_access_key" \
    --publish '9000:9000' \
    --publish '9001:9001' \
    bitnami/minio:latest

mix run -e "ExAws.S3.put_bucket(\"testing\", PresignedUrl.Config.global().region) |> ExAws.request(PresignedUrl.Config.global())"

mix build_web

echo "running on http://localhost:4040"

iex -S mix

docker kill minio-server
docker rm minio-server
